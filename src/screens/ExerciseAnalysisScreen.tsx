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
  IconButton,
  MD3Colors,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { Video } from "expo-av";
import { styles } from "../styles/globalStyles";
import {
  uploadToFirebase,
} from "../firebase/firebase-config";
import { useAppSelector } from "../app/store";
import { selectAuthState } from "../features/auth";
import { LoadingSpinner, StackRow } from "../components";
import apiClient from "../api/apiClient";
import { exerciseAnalysisPrompt } from "../prompts/exerciseAnalysis";

type CameraCapturedVideo = {
  uri: string;
};

export const ExerciseAnalysisScreen = ({ navigation }) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get("window").width;
  const { uid } = useAppSelector(selectAuthState);
  const cameraWidth = windowWidth * 0.9;
  const cameraHeight = cameraWidth * (4 / 3);
  const [countdown, setCountdown] = useState(5);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState(10);
  const [showCountDown, setShowCountdown] = useState(false);
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
    setCountdown(5);
    setShowCountdown(true);
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
    }, 5000);
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

  useEffect(() => {
    if (countdown >= 5) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = setInterval(
        () => setCountdown((v) => v - 1),
        1000
      );
    }
    if (countdown === 0) {
      clearInterval(countdownTimer.current);
    }
  }, [countdown]);

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

  useEffect(() => {
    if (videoUrl) {
      setTimeout(() => {
        fetchAnalysis();
      }, 2000);
    }
  }, [videoUrl]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Camera Permission Not Granted
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  if (geminiResponse && !fetchingAnalysis) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <View>
          <View style={localStyles.loadingScreen}>
            <View style={styles.textBackground}>
              <Text
                style={{
                  ...styles.title,
                  color: theme.colors.onBackground,
                  marginBottom: 40,
                }}
              >
                Exercise Analysis
              </Text>
            </View>
            <View
              style={{
                ...localStyles.cameraContainer,
                width: cameraWidth - 50,
                height: cameraHeight - 100,
              }}
            >
              <Video
                source={recordedVideo}
                shouldPlay
                style={localStyles.camera}
                isLooping
              />
            </View>
            <Surface
              style={{
                ...styles.surface,
                marginTop: 20,
                marginBottom: 10,
                backgroundColor: theme.colors.backdrop,
                marginHorizontal: 40,
              }}
              elevation={4}
            >
              <ScrollView>
                <Text
                  style={{
                    ...styles.textBackground,
                    color: theme.colors.onBackground,
                  }}
                >
                  {geminiResponse}
                </Text>
              </ScrollView>
            </Surface>
            <StackRow>
              <Button
                mode="contained"
                disabled={fetchingAnalysis}
                onPress={cleanUpAfterRecording}
                style={{
                  marginTop: 20,
                  marginBottom: 20,
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
                style={{ marginTop: 20, marginBottom: 20, marginRight: "auto" }}
              >
                Re-analyze
              </Button>
            </StackRow>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (videoUrl && fetchingAnalysis) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <View>
          <View style={styles.textBackground}>
            <Text
              style={{
                ...styles.title,
                color: theme.colors.onBackground,
                marginBottom: 40,
              }}
            >
              Exercise Analysis
            </Text>
          </View>
          <View style={localStyles.loadingScreen}>
            <Text style={{ marginBottom: 30 }} variant="headlineMedium">
              Analyzing your video
            </Text>
            <LoadingSpinner />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (errorFetchingGeminiResponse) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <View>
          <View style={styles.textBackground}>
            <Text
              style={{
                ...styles.title,
                color: theme.colors.onBackground,
                marginBottom: 40,
              }}
            >
              Exercise Analysis
            </Text>
          </View>
          <View style={localStyles.loadingScreen}>
            <Text
              style={{ marginBottom: 30, color: theme.colors.error }}
              variant="headlineMedium"
            >
              {errorFetchingGeminiResponse}
            </Text>
          </View>
          <StackRow>
            <Button
              mode="contained"
              disabled={fetchingAnalysis}
              onPress={() => navigation.goBack()}
              style={{
                marginTop: 20,
                marginBottom: 20,
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
              style={{ marginTop: 20, marginBottom: 20, marginRight: "auto" }}
            >
              Re-analyze
            </Button>
          </StackRow>
        </View>
      </SafeAreaView>
    );
  }

  if (!recordedVideo) {
    return (
      <View style={localStyles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitleUpperCase}>
            Record 10 seconds of the Exercise for the analysis
          </Text>
        </View>
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
            <View style={localStyles.buttonContainer}>
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

                <IconButton
                  size={26}
                  icon="camera-flip-outline"
                  iconColor={MD3Colors.secondary100}
                  onPress={toggleCameraType}
                />
            </View>
          </Camera>
        </View>
        {showCountDown ? (
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
        ) : (
          <View style={{ ...styles.container }}>
            <IconButton
              size={60}
              iconColor="red"
              style={{ marginTop: 16 }}
              icon="record-rec"
              onPress={recordVideo}
            />
            <Button
              icon="arrow-left"
              mode="contained"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
            >
              Go back
            </Button>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Record the video of the Exercise to analyze
        </Text>
      </View>
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
          style={localStyles.camera}
          isLooping
        />
      </View>
      {uploadStatus ? (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 18 }}>
            Uploading the video. Status: {uploadStatus}%
          </Text>
        </View>
      ) : (
        <View style={localStyles.buttonsRow}>
          <Button
            icon="cancel"
            mode="contained-tonal"
            buttonColor="red"
            style={{ marginRight: 16 }}
            onPress={() => setRecordedVideo(null)}
          >
            Retake
          </Button>
          <Button
            icon="check"
            mode="contained-tonal"
            buttonColor="green"
            style={{ marginLeft: 16 }}
            onPress={uploadVideoToFirebase}
          >
            Accept
          </Button>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  cameraContainer: {
    width: "100%",
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
    alignSelf: "flex-start",
    width: "100%",
    position: "absolute",
    bottom: 0,
    justifyContent: "flex-end",
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
  buttonsRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  countdownTimer: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 30,
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
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  loadingScreen: {
    height: 200,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
