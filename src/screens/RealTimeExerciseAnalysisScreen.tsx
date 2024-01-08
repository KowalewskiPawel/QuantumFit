import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Button, IconButton, MD3Colors, useTheme } from "react-native-paper";
import { styles as globalStyles } from "../styles/globalStyles";
import React, { useEffect, useState, useRef } from "react";

import { Camera } from "expo-camera";

import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  cameraWithTensors,
} from "@tensorflow/tfjs-react-native";
import Svg, { Circle } from "react-native-svg";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { CameraType } from "expo-camera/build/Camera.types";
import * as Speech from "expo-speech";
import { LoadingSpinner, TopHeader } from "../components";

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";

// Camera preview size.
//
// From experiments, to render camera feed without distortion, 16:9 ratio
// should be used fo iOS devices and 4:3 ratio should be used for android
// devices.
//
// This might not cover all cases.
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

// The size of the resized output from TensorCamera.
//
// For movenet, the size here doesn't matter too much because the model will
// preprocess the input (crop, resize, etc). For best result, use the size that
// doesn't distort the image.
const OUTPUT_TENSOR_WIDTH = 200;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// Whether to auto-render TensorCamera preview.
const AUTO_RENDER = false;


export const RealTimeExerciseAnalysisScreen = ({ navigation }) => {
  const theme = useTheme();
  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>();
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>();
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type["front"]
  );
  const [squatCount, setSquatCount] = useState(0);
  const squatRef = useRef(false);
  // Use `useRef` so that changing it won't trigger a re-render.
  //
  // - null: unset (initial value).
  // - 0: animation frame/loop has been canceled.
  // - >0: animation frame has been scheduled.
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      // Set initial orientation.
      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      // Listens to orientation change.
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();

      // Load movenet model.
      // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
      const movenetModelConfig: posedetection.MoveNetModelConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
        minPoseScore: 0.3,
        trackerType: posedetection.TrackerType.Keypoint

      };
      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        movenetModelConfig
      );
      setModel(model);

      // Ready!
      setTfReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    // Called when the app is unmounted.
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (squatCount > 0) {
      Speech.speak(`The current count is ${squatCount}`, { rate: 1.0 });
    }
  }, [squatCount]);

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    const loop = async () => {
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      const startTs = Date.now();
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now()
      );
      if (poses && poses.length > 0) {
        const pose = poses[0];

        const leftHip = pose.keypoints.find(
          (k) => k.name === "left_hip" && k.score > 0.3
        );
        const rightHip = pose.keypoints.find(
          (k) => k.name === "right_hip" && k.score > 0.3
        );
        const leftKnee = pose.keypoints.find(
          (k) => k.name === "left_knee" && k.score > 0.3
        );
        const rightKnee = pose.keypoints.find(
          (k) => k.name === "right_knee" && k.score > 0.3
        );

        if (leftHip && rightHip && leftKnee && rightKnee) {
          const avgHipY = (leftHip.y + rightHip.y) / 2;
          const avgKneeY = (leftKnee.y + rightKnee.y) / 2;

          // If the hips are lower than the knees, the user is in a squat
          if (avgHipY > avgKneeY) {
            console.log("in squat");
            squatRef.current = true;
          } else if (squatRef.current) {
            console.log("not in squat");
            // If the user was in a squat and is no longer, increment the squat count
            setSquatCount((prevSquatCount) => prevSquatCount + 1);
            squatRef.current = false;
          }
        }
      }

      const latency = Date.now() - startTs;
      setFps(Math.floor(1000 / latency));
      setPoses(poses);
      tf.dispose([imageTensor]);

      if (rafId.current === 0) {
        return;
      }

      // Render camera preview manually when autorender=false.
      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }

      rafId.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const renderPose = () => {
    if (poses != null && poses.length > 0) {
      const keypoints = poses[0].keypoints
        .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map((k) => {
          // Flip horizontally on android or when using back camera on iOS.
          const flipX =
            IS_ANDROID || cameraType === Camera.Constants.Type["back"];
          const x = flipX ? getOutputTensorWidth() - k.x : k.x;
          const y = k.y;
          const cx =
            (x / getOutputTensorWidth()) *
            (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
          const cy =
            (y / getOutputTensorHeight()) *
            (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);
          return (
            <Circle
              key={`skeletonkp_${k.name}`}
              cx={cx}
              cy={cy}
              r="6"
              strokeWidth="1"
              // fill="rgba(0, 200, 0, 0.6)"
              stroke="rgba(0, 200, 0, 0.4)"
            />
          );
        });

      return <Svg style={styles.svg}>{keypoints}</Svg>;
    } else {
      return <View></View>;
    }
  };

  const renderFps = () => {
    return (
      <View style={styles.fpsContainer}>
        <Text>FPS: {fps}</Text>
        <Text>Squats: {squatCount}</Text>
      </View>
    );
  };

  const renderCameraTypeSwitcher = () => {
    return (
        <IconButton
        style={styles.cameraTypeSwitcher}
          icon="camera-flip-outline"
          iconColor="black"
          onPress={handleSwitchCameraType}
          containerColor="rgba(255, 255, 255, 0.6)"
        />
    );
  };

  const handleSwitchCameraType = () => {
    if (cameraType === Camera.Constants.Type["front"]) {
      setCameraType(Camera.Constants.Type["back"]);
    } else {
      setCameraType(Camera.Constants.Type["front"]);
    }
  };

  const isPortrait = () => {
    return (
      orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    );
  };

  const getOutputTensorWidth = () => {
    // On iOS landscape mode, switch width and height of the output tensor to
    // get better result. Without this, the image stored in the output tensor
    // would be stretched too much.
    //
    // Same for getOutputTensorHeight below.
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_WIDTH
      : OUTPUT_TENSOR_HEIGHT;
  };

  const getOutputTensorHeight = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_HEIGHT
      : OUTPUT_TENSOR_WIDTH;
  };

  const getTextureRotationAngleInDegrees = () => {
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0;
    }

    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === Camera.Constants.Type["front"] ? 270 : 90;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === Camera.Constants.Type["front"] ? 90 : 270;
      default:
        return 0;
    }
  };

  if (!tfReady) {
    return (
      <SafeAreaView style={{ ...globalStyles.container }}>
        <TopHeader>
          Real Time Exercise Analysis
        </TopHeader>
        <ScrollView>
          <Text style={{ color: theme.colors.onBackground }}>
            Loading TensorFlow.js and model...
          </Text>
          <LoadingSpinner />
        </ScrollView>
        <View>
          <Button
            icon="arrow-left"
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={{ marginVertical: 20, marginRight: 10 }}
          >
            Go back
          </Button>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      // Note that you don't need to specify `cameraTextureWidth` and
      // `cameraTextureHeight` prop in `TensorCamera` below.
      <SafeAreaView style={{ ...globalStyles.container }}>
        <TopHeader>
          Real Time Exercise Analysis
        </TopHeader>
        <ScrollView>
          <View
            style={
              isPortrait()
                ? styles.containerPortrait
                : styles.containerLandscape
            }
          >
            <TensorCamera
              ref={cameraRef}
              style={styles.camera}
              autorender={AUTO_RENDER}
              type={cameraType}
              // tensor related props
              resizeWidth={getOutputTensorWidth()}
              resizeHeight={getOutputTensorHeight()}
              resizeDepth={3}

              rotation={getTextureRotationAngleInDegrees()}
              onReady={handleCameraStream}
              useCustomShadersToResize={false} // or true, depending on your needs
              cameraTextureWidth={CAM_PREVIEW_WIDTH}
              cameraTextureHeight={CAM_PREVIEW_HEIGHT}
            />
            {renderPose()}
            {renderFps()}
            {renderCameraTypeSwitcher()}
          </View>
          <View>
            <Button
              icon="arrow-left"
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={{ marginVertical: 20, marginHorizontal: 80 }}
            >
              Go back
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  containerPortrait: {
    position: "relative",
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    borderRadius: 25,
    zIndex: 2
  },
  containerLandscape: {
    position: "relative",
    width: CAM_PREVIEW_HEIGHT,
    height: CAM_PREVIEW_WIDTH,
    borderRadius: 25,
    zIndex: 2
  },
  loadingMsg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  svg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 30,
  },
  fpsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 80,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .6)",
    borderRadius: 10,
    padding: 8,
    zIndex: 20,
  },
  cameraTypeSwitcher: {
    position: "absolute",
    bottom: 5,
    right: 40,
    zIndex: 20,
  },
});
