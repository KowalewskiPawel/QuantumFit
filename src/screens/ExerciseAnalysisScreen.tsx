import React from "react";
import { Camera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  MD3Colors,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { Video, ResizeMode } from "expo-av";
import { styles } from "../styles/globalStyles";
import { uploadToFirebase } from "../firebase/firebase-config";
import { useAppSelector } from "../app/store";
import { selectAuthState } from "../features/auth";
import { CountdownTimer, LoadingSpinner, StackRow, TopHeader } from "../components";
import apiClient from "../api/apiClient";
import { exerciseAnalysisPrompt } from "../prompts/exerciseAnalysis";

type CameraCapturedVideo = {
  uri: string;
};
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const cameraWidth = windowWidth * 0.9;
const cameraHeight = cameraWidth * (4 / 3);

export const ExerciseAnalysisScreen = ({ navigation }) => {
  const theme = useTheme();
  const { uid } = useAppSelector(selectAuthState);

  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(timer);
  const [timerClicked, setTimerClicked] = useState(false)
  const [showCountDown, setShowCountdown] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState(10);

  const [isRecording, setIsRecording] = useState(false);
  const countdownTimer = useRef(null);
  const recordingCountdownTimer = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [videoUrl, setVideoUrl] = useState<string>();
  const [videoContentType, setVideoContentType] = useState<string>();
  const [fetchingAnalysis, setFetchingAnalysis] = useState<boolean>(false);
  const [errorFetchingGeminiResponse, setErrorFetchingGeminiResponse] =
    useState<string>("");
  const [geminiResponse, setGeminiResponse] = useState<string>("");

  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);
  const recordVideoTimeout = useRef(null);
  const [recordedVideo, setRecordedVideo] = useState<CameraCapturedVideo>();

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const recordVideo = () => {
    setCountdown(timer);
    if (timer > 0) {
      setShowCountdown(true)
    }
    recordVideoTimeout.current = setTimeout(async () => {
      setIsRecording(true);
      setRecordingCountdown(10);
      const video = await cameraRef.current.recordAsync({
        quality: "480p",
        maxDuration: 10,
        maxFileSize: 7000000,
        mute: true,
      });
      setRecordedVideo(video);
      setIsRecording(false);
      setShowCountdown(false);
    }, timer * 1000);
  };

  const fetchAnalysis = async () => {
    setFetchingAnalysis(true);
    setErrorFetchingGeminiResponse("");

    try {
      const { message } = await apiClient.post("video", {
        prompt: exerciseAnalysisPrompt,
        videoUrl,
        fileType: videoContentType,
      });
      setGeminiResponse(message);
    } catch (error) {
      if (error.message) {
        setErrorFetchingGeminiResponse(error.message);
      } else {
        setErrorFetchingGeminiResponse(
          "Something went wrong while fetching your body analysis."
        );
      }
    } finally {
      setFetchingAnalysis(false);
    }
  };

  const uploadVideoToFirebase = async () => {
    setUploadStatus(null);
    try {
      const uploadResponse: any = await uploadToFirebase(
        recordedVideo.uri,
        `${uid}_exercise_${Date.now().toFixed()}`,
        false,
        (currentUploadStatus) => {
          setUploadStatus(Math.ceil(currentUploadStatus));
        }
      );
      const { downloadUrl, metadata } = uploadResponse;
      setVideoUrl(downloadUrl);
      setVideoContentType(metadata.contentType);
    } catch (error) {
      console.error(error.message);
    } finally {
      setUploadStatus(null);
    }
  };

  const cleanUpAfterRecording = async () => {
    // Disabled for now as it makes the app crash from time to time
    // TODO: Remove videos from firebase storage after analysis
    // if (videoUrl) {
    //   const videoToDelete = extractFileId(videoUrl);
    //   await deleteObject(ref(fbStorage, `videos/${videoToDelete}`));
    // }
    navigation.goBack();
  };

  const onPressTimerItem = (time) => {
    setTimer(time);
    setTimerClicked((prevState) => !prevState);
  };

  useEffect(() => {
    if (countdown >= timer) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = setInterval(
        () => setCountdown((v) => v - 1),
        1000
      );
    }
    if (countdown === 0) {
      clearInterval(countdownTimer.current);
    }
  }, [countdown, timer]);

  useEffect(() => {
    if (recordingCountdown >= 10) {
      clearInterval(recordingCountdownTimer.current);
      recordingCountdownTimer.current = setInterval(
        () => setRecordingCountdown((v) => v - 1),
        1000
      );
    }
    if (recordingCountdown === 0) {
      clearInterval(recordingCountdownTimer.current);
    }
  }, [recordingCountdown]);

  useEffect(() => {
    if (!!recordedVideo) {
      clearTimeout(recordVideoTimeout.current);
    }
  }, [recordedVideo]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission?.granted) {

    return (
      <Portal>
        <Dialog style={{ backgroundColor: theme.colors.primaryContainer }} visible={!permission || !permission?.granted} onDismiss={navigation.goBack}>
          <Dialog.Title>Camera Permissions</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">To use tis feature you need to grant camera permissions to application</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.onPrimary} onPress={navigation.goBack}>Cancel</Button>
            <Button textColor={theme.colors.onPrimary} onPress={requestPermission}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>)
  }

  if (geminiResponse && !fetchingAnalysis) {
    return (
      <ScrollView style={localStyles.container}>
        <TopHeader>Analysis Results</TopHeader>
        <View
          style={{
            ...localStyles.cameraContainer,
            width: cameraWidth,
            height: cameraHeight,
          }}
        >
          <Video
            source={recordedVideo}
            shouldPlay
            style={{ ...localStyles.camera, width: cameraWidth, height: cameraHeight, flex: 1 }}
            isLooping
            resizeMode={ResizeMode.COVER}
          />
        </View>
        <Surface
          style={{
            ...styles.surface,
            marginTop: 20,
            marginBottom: 10,
            backgroundColor: theme.colors.backdrop,
            marginHorizontal: 20,
          }}
          elevation={4}
        >
          <Text
            variant="bodyMedium"
            style={{
              ...styles.textBackground,
              color: theme.colors.onBackground,
            }}
          >
            {geminiResponse}
          </Text>
        </Surface>
        <View style={{ ...localStyles.buttonsContainer, marginBottom: 24 }}>
          <Button
            mode="contained"
            disabled={fetchingAnalysis}
            onPress={fetchAnalysis}
            style={{ marginVertical: 20, marginLeft: "auto" }}
          >
            Re-analyze
          </Button>
          <Button
            mode="contained"
            disabled={fetchingAnalysis}
            onPress={cleanUpAfterRecording}
            style={{
              marginTop: 20,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: "auto",
            }}
          >
            OK
          </Button>
        </View>
      </ScrollView>
    );
  }

  if (videoUrl && fetchingAnalysis) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <TopHeader>Analyzing your video</TopHeader>
        <View
          style={{
            ...localStyles.cameraContainer,
            width: cameraWidth,
            height: cameraHeight,
            position: 'relative'
          }}
        >
          <LoadingSpinner size={60} style={{
            backgroundColor: 'rgba(11, 39, 73, 0.6)',
            flex: 1,
            position: 'absolute',
            width: cameraWidth,
            height: cameraHeight,
            zIndex: 10
          }} />
          <Video
            source={recordedVideo}
            shouldPlay
            style={{ ...localStyles.camera, width: cameraWidth, height: cameraHeight, flex: 1 }}
            isLooping
            resizeMode={ResizeMode.COVER}
          />
        </View>
        {/* <View style={localStyles.loadingScreen}>
          <Text style={{ marginBottom: 30 }} variant="headlineMedium">
            Analyzing your video
          </Text>
        </View> */}
      </SafeAreaView>
    );
  }

  if (errorFetchingGeminiResponse) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <TopHeader>Exercise Analysis</TopHeader>
        <View style={localStyles.loadingScreen}>
          <Text
            style={{ marginBottom: 30, color: theme.colors.error }}
            variant="headlineMedium"
          >
            {errorFetchingGeminiResponse}
          </Text>
        </View>
        <View style={{ ...localStyles.buttonsContainer, marginTop: 24 }}>
          <Button
            mode="contained"
            disabled={fetchingAnalysis}
            onPress={() => navigation.goBack()}
            style={{
              marginVertical: 20,
              marginRight: 20,
              marginLeft: "auto",
            }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            disabled={fetchingAnalysis}
            onPress={fetchAnalysis}
            style={{ marginVertical: 20, marginRight: "auto" }}
          >
            Re-analyze
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (!recordedVideo) {
    return (
      <View style={localStyles.container}>
        <CountdownTimer visible={timerClicked} onTimeSelect={onPressTimerItem} onDismiss={() => setTimerClicked(false)} />
        <TopHeader>Record 10 seconds of the Exercise for the analysis</TopHeader>
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
            {isRecording && (
              <View
                style={{
                  ...localStyles.recordIndicatorContainer,
                  position: "absolute",
                  left: 30,
                }}
              >
                <View style={localStyles.recordDot} />
                <Text style={localStyles.recordTitle}>{"Recording..."}</Text>
              </View>
            )}
          </Camera>
        </View>
        {showCountDown ? (
          <View style={{...localStyles.countdownContainer, alignSelf: 'center'}}>
            <Text
              style={{
                ...localStyles.countdownTimer,
                color: isRecording
                  ? theme.colors.error
                  : theme.colors.onPrimaryContainer,
              }}
            >
              {countdown === 0 ? recordingCountdown : countdown}
            </Text>
          </View>
        ) : (
          <View style={localStyles.buttonsContainer}>
            <View style={{ flexDirection: 'row', flexWrap: "nowrap" }}>
              <IconButton
                size={26}
                icon="camera-timer"
                iconColor={MD3Colors.secondary100}
                onPress={() => setTimerClicked((prevState) => !prevState)}
              />
              <Text style={{ color: MD3Colors.secondary100, fontSize: 12, fontWeight: 'bold', position: "absolute", bottom: 6, right: 4 }}>{timer > 0 ? `${timer}s` : "off"}</Text>
            </View>
            <IconButton
              size={60}
              iconColor={theme.colors.error}
              style={{ marginTop: 16 }}
              icon="record-circle"
              onPress={recordVideo}
            />
            <IconButton
              size={26}
              icon="camera-flip-outline"
              iconColor={MD3Colors.secondary100}
              onPress={toggleCameraType}
              disabled={isRecording}
            />
          </View>
        )}
        <Button
          icon="arrow-left"
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20, width: (windowWidth - 40), alignSelf: "center" }}
        >
          Go back
        </Button>
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <CountdownTimer visible={timerClicked} onTimeSelect={onPressTimerItem} onDismiss={() => setTimerClicked(false)} />
      <TopHeader>Record the video of the Exercise to analyze</TopHeader>
      <View
        style={{
          ...localStyles.cameraContainer,
          width: cameraWidth,
          height: cameraHeight,
        }}
      >
        <Video
          source={recordedVideo}
          shouldPlay
          style={{ ...localStyles.camera, width: cameraWidth, height: cameraHeight, flex: 1 }}
          isLooping
          resizeMode={ResizeMode.COVER}
        />
      </View>
      {uploadStatus ? (
        <View style={{ marginTop: 10,}}>
          <Text style={{ fontSize: 18 }}>
            Uploading the video. Status: {uploadStatus}%
          </Text>
        </View>
      ) : (
        <View style={{ ...localStyles.buttonsContainer, marginTop: 24 }}>
          <Button
            icon="cancel"
            mode="contained-tonal"
            buttonColor={theme.colors.error}
            style={{ marginRight: 16 }}
            onPress={() => setRecordedVideo(null)}
          >
            Retake
          </Button>
          {videoUrl ? (
            <Button
              icon="check"
              mode="contained-tonal"
              buttonColor="blue"
              style={{ marginLeft: 16 }}
              onPress={fetchAnalysis}
            >
              Analyze
            </Button>
          ) : (
            <Button
              icon="check"
              mode="contained-tonal"
              buttonColor="green"
              style={{ marginLeft: 16 }}
              onPress={uploadVideoToFirebase}
            >
              Accept
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    minHeight: windowHeight,
    flex: 1,
    width: "100%",
    paddingTop: 12,
  },
  cameraContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
    alignSelf: "center",
  },
  camera: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  sizeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
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

  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },

  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },

  recordDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },

  loadingScreen: {
    height: 200,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    alignSelf: "center"
  },
});
