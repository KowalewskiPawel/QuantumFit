import {
  Camera,
  CameraCapturedPicture,
  CameraType,
  ImageType,
} from "expo-camera";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, MD3Colors, Text, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { uploadToFirebase } from "../firebase/firebase-config";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectAuthState } from "../features/auth";
import { selectUserState } from "../features/user";
import { updateUserInfo } from "../features/user/thunk";
import { selectBodyPhotosState } from "../features/bodyPhotos";
import { setBodyPhotosState } from "../features/bodyPhotos/slice";
import { CountdownTimer, TopHeader } from "../components";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const nextSideMap = {
  front: "side",
  side: "back",
  back: "front",
};

export const BodyAnalysisCameraScreen = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const { side } = route.params;
  const cameraWidth = windowWidth * 0.9;
  const cameraHeight = cameraWidth * (4 / 3);

  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [timerClicked, setTimerClicked] = useState(false)
  const [showCountDown, setShowCountdown] = useState(false);

  const countdownTimer = useRef(null);
  const { uid } = useAppSelector(selectAuthState);
  const { photos } = useAppSelector(selectUserState);
  const bodyPhotos = useAppSelector(selectBodyPhotosState);
  const [uploadStatus, setUploadStatus] = useState(null);

  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);
  const takePictureTimeout = useRef(null);
  const [takenPicture, setTakenPicture] = useState<CameraCapturedPicture>();

  const onPressTimerItem = (time) => {
    setTimer(time);
    setTimerClicked((prevState) => !prevState);
  };

  const takePicture = () => {
    setCountdown(timer)
    if (timer > 0) {
      setShowCountdown(true)
    }
    takePictureTimeout.current = setTimeout(async () => {
      const picture = await cameraRef.current?.takePictureAsync({
        quality: 0.75,
        scale: 0.6,
        imageType: ImageType.jpg,
      });
      setTakenPicture(picture);
      setShowCountdown(false);
    }, timer * 1000);
  };

  useEffect(() => {
    if ((countdown === timer) && (timer > 0)) {
      countdownTimer.current = setInterval(
        () => setCountdown((v) => v - 1),
        1000
      );
    }
    if (countdown === 0) {
      setShowCountdown(false)
      clearInterval(countdownTimer.current);
    }
  }, [countdown]);

  useEffect(() => {
    if (!!takenPicture) {
      clearTimeout(takePictureTimeout.current);
    }
  }, [takenPicture]);

  const handlePictureUpload = async () => {
    setUploadStatus(null);
    try {
      const uploadResponse: any = await uploadToFirebase(
        takenPicture.uri,
        `${uid}_${side}_${Date.now().toFixed()}`,
        true,
        (currentUploadStatus) => {
          setUploadStatus(Math.ceil(currentUploadStatus));
        }
      );
      const newPhotos = [...photos, uploadResponse.downloadUrl];

      dispatch(setBodyPhotosState([...bodyPhotos, uploadResponse.downloadUrl]));
      dispatch(updateUserInfo({ photos: newPhotos }));

      if (side == "back") {
        navigation.navigate("BodyAnalysis");
      } else {
        navigation.navigate("BodyAnalysisPictureScreen", {
          side: nextSideMap[side],
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setUploadStatus(null);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginBottom: 24 }}
          variant="headlineMedium"
        >
          Camera Permission Not Granted
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (!takenPicture) {
    return (<SafeAreaView>
      {timerClicked && <CountdownTimer onPress={onPressTimerItem} />}
      <View style={localStyles.container}>
        <TopHeader>{`Take a picture of the ${side} part of your body`}</TopHeader>
        <View
          style={{
            ...localStyles.cameraContainer,
            width: cameraWidth,
            height: cameraHeight,
          }}
        >
          <Camera
            useCamera2Api
            autoFocus
            ref={cameraRef}
            style={localStyles.camera}
            type={type}
          >
          </Camera>
        </View>
        <View style={localStyles.buttonContainer}>
          <View style={{ flexDirection: 'row', flexWrap: "nowrap" }}>
            <IconButton
              size={26}
              icon="camera-timer"
              iconColor={MD3Colors.secondary100}
              onPress={() => setTimerClicked((prevState) => !prevState)}
            />
            <Text style={{ color: MD3Colors.secondary100, fontSize: 12, fontWeight: 'bold', position: "absolute", bottom: 6, right: 4 }}>{timer > 0 ? `${timer}s` : "off"}</Text>
          </View>
          {showCountDown ? (
            <View style={localStyles.countdownContainer}>
              <Text style={localStyles.countdownTimer}>{countdown}</Text>
            </View>
          ) : (
            <IconButton
              size={60}
              style={{ marginTop: 16 }}
              icon="camera"
              onPress={takePicture}
            />
          )}
          <IconButton
            size={26}
            icon="camera-flip-outline"
            iconColor={MD3Colors.secondary100}
            onPress={toggleCameraType}
          />
        </View>
      </View>
    </SafeAreaView>);
  }

  return (
    <SafeAreaView>
      <View style={localStyles.container}>
        <TopHeader>{`Check if picture of the ${side} is correct`}</TopHeader>
        <View
          style={{
            ...localStyles.cameraContainer,
            width: cameraWidth,
            height: cameraHeight,
          }}
        >
          <Image
            contentFit="cover"
            source={takenPicture.uri}
            style={localStyles.camera}
          />
        </View>
        {uploadStatus ? (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18 }}>
              Uploading the photo. Status: {uploadStatus}%
            </Text>
          </View>
        ) : (
          <View style={{ ...localStyles.buttonContainer, marginTop: 24 }}>
            <Button
              icon="cancel"
              mode="contained-tonal"
              buttonColor="red"
              style={{ marginRight: 16 }}
              onPress={() => setTakenPicture(null)}
            >
              Retake
            </Button>
            <Button
              icon="check"
              mode="contained-tonal"
              buttonColor="green"
              style={{ marginLeft: 16 }}
              onPress={handlePictureUpload}
            >
              Accept
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    minHeight: windowHeight,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingTop: 12,
  },
  cameraContainer: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginBottom: 24
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },

  galleryContainer: {
    flexDirection: "row",
  },

  galleryImage: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: 50,
    height: 50 * (4 / 3),
    margin: 10,
  },
  bodyImage: {
    flex: 1,
    height: "60%",
    width: "auto",
  },

  countdownContainer: {
    marginTop: 16,
    marginBottom: 6,
    marginLeft: 6,
    marginRight: 6,
    width: 76,
    height: 76,
    justifyContent: "center",
    alignItems: "center"
  },

  countdownTimer: {
    fontSize: 40,
    fontWeight: "bold",
  },
});
