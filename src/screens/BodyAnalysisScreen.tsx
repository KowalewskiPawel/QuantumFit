import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { Button, Surface, useTheme, Text } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { selectUserState } from "../features/user";
import { useAppDispatch, useAppSelector } from "../app/store";
import { LoadingSpinner, StackRow } from "../components";
import { getEstimateBodyFatAndTargetPrompt } from "../prompts/bodyAnalysis";
import { resetBodyPhotosState } from "../features/bodyPhotos/slice";
import { selectBodyPhotosState } from "../features/bodyPhotos";
import apiClient from "../api/apiClient";

export const BodyAnalysisScreen = ({ navigation }) => {
  const AnalysePosture = require("../assets/analysis-body.png");
  const {
    weight,
    yearOfBirth,
    height,
    lifestyle,
    aim,
    sex,
    exerciseFrequency,
    gymExperience,
    loading,
  } = useAppSelector(selectUserState);
  const bodyPhotos = useAppSelector(selectBodyPhotosState);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [errorFetchingGeminiResponse, setErrorFetchingGeminiResponse] = useState("");
  const [isFetchingGeminiResponse, setIsFetchingGeminiResponse] =
    useState(false);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const fetchAnalysis = async () => {
    setIsFetchingGeminiResponse(true);
    setErrorFetchingGeminiResponse("");
    const usersAge = new Date().getFullYear() - yearOfBirth;
    const bodyAnalysisPrompt = getEstimateBodyFatAndTargetPrompt(
      weight,
      usersAge,
      height,
      lifestyle,
      aim,
      sex,
      exerciseFrequency,
      gymExperience
    );
    try {
      const { message } = await apiClient.post("image", {
        prompt: bodyAnalysisPrompt,
        photos: bodyPhotos,
      });
      const parsedText = JSON.parse(
        message.split("```json")[1].split("```")[0]
      );
      setGeminiResponse(parsedText);
    } catch (error) {
      if (error.message) {
        setErrorFetchingGeminiResponse(error.message);
      } else {
        setErrorFetchingGeminiResponse(
          "Something went wrong while fetching your body analysis."
        );
      }
    } finally {
      setIsFetchingGeminiResponse(false);
    }
  };

  const handleComplete = () => {
    navigation.navigate("MainMenu");
    dispatch(resetBodyPhotosState());
  };

  useEffect(() => {
    if (!loading) {
      fetchAnalysis();
    }
  }, [loading]);

  if (!geminiResponse || isFetchingGeminiResponse) {
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
              Body Analysis
            </Text>
          </View>
          <View style={localStyles.loadingScreen}>
            <Text style={{ marginBottom: 30 }} variant="headlineMedium">
              Analysing your body
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
              Body Analysis
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
            disabled={isFetchingGeminiResponse}
            onPress={handleComplete}
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
            disabled={isFetchingGeminiResponse}
            onPress={fetchAnalysis}
            style={{ marginTop: 20, marginBottom: 20, marginRight: "auto" }}
          >
            Re-analyse
          </Button>
        </StackRow>
        </View>
      </SafeAreaView>
    );
  }

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
            Body Analysis
          </Text>
        </View>
        <View>
          <StackRow>
            <View style={{ flex: 2 }}>
              <Image
                contentFit="contain"
                source={AnalysePosture}
                style={{ width: "auto", height: 300 }}
              />
            </View>
            <View style={{ flex: 3, marginLeft: 12 }}>
              <Surface
                mode={"flat"}
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.tertiary,
                  padding: 12,
                  marginBottom: 32,
                }}
              >
                <Text
                  style={{
                    ...styles.subtitleUpperCase,
                    alignSelf: "flex-start",
                    color: theme.colors.onBackground,
                  }}
                >
                  Current
                </Text>
                <StackRow
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                    }}
                  >
                    Body Fat:
                  </Text>
                  <Text
                    style={{
                      ...styles.bigUnits,
                      color: theme.colors.onBackground,
                    }}
                  >
                    {geminiResponse?.current.bodyFat}%
                  </Text>
                </StackRow>
                <StackRow
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                    }}
                  >
                    Weight:
                  </Text>
                  <Text
                    style={{
                      ...styles.bigUnits,
                      color: theme.colors.onBackground,
                    }}
                  >
                    {`${geminiResponse?.current.weight || "0"}kg`}
                  </Text>
                </StackRow>
              </Surface>
              <Surface
                mode={"flat"}
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.tertiary,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    ...styles.subtitleUpperCase,
                    alignSelf: "flex-start",
                    color: theme.colors.onBackground,
                  }}
                >
                  Target
                </Text>
                <StackRow
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                    }}
                  >
                    Body Fat:
                  </Text>
                  <Text
                    style={{
                      ...styles.bigUnits,
                      color: theme.colors.onBackground,
                    }}
                  >
                    {geminiResponse?.target.bodyFat}%
                  </Text>
                </StackRow>
                <StackRow
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                    }}
                  >
                    Weight:
                  </Text>
                  <Text
                    style={{
                      ...styles.bigUnits,
                      color: theme.colors.onBackground,
                    }}
                  >
                    {`${geminiResponse?.target.weight || "0"}kg`}
                  </Text>
                </StackRow>
              </Surface>
            </View>
          </StackRow>
          <Text
            style={{
              ...styles.subtitleUpperCase,
              alignSelf: "flex-start",
              color: theme.colors.onBackground,
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            Additional info
          </Text>
          <Surface
            style={{
              ...styles.surface,
              marginBottom: 20,
              backgroundColor: theme.colors.backdrop,
            }}
            elevation={4}
          >
            <Text
              style={{
                ...styles.textBackground,
                color: theme.colors.onBackground,
              }}
            >
              {geminiResponse?.additionalInfo}
            </Text>
          </Surface>
        </View>
        <StackRow>
          <Button
            mode="contained"
            disabled={isFetchingGeminiResponse}
            onPress={handleComplete}
            style={{
              marginTop: 20,
              marginBottom: 20,
              marginRight: 20,
              marginLeft: "auto",
            }}
          >
            Complete
          </Button>
          <Button
            mode="contained"
            disabled={isFetchingGeminiResponse}
            onPress={fetchAnalysis}
            style={{ marginTop: 20, marginBottom: 20, marginRight: "auto" }}
          >
            Re-analyse
          </Button>
        </StackRow>
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  loadingScreen: {
    height: 200,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
