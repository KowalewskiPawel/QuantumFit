import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Button, Surface, useTheme, Text } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import {
  loadUserInfo,
  selectUserState,
  updateUserInfo,
} from "../features/user";
import { useAppDispatch, useAppSelector } from "../app/store";
import { LoadingSpinner, StackRow, TopHeader } from "../components";
import { getEstimateBodyFatAndTargetPrompt } from "../prompts/bodyAnalysis";
import { selectBodyPhotosState } from "../features/bodyPhotos";
import apiClient from "../api/apiClient";
import { resetBodyPhotosState } from "../features/bodyPhotos/slice";

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
  const [errorFetchingGeminiResponse, setErrorFetchingGeminiResponse] =
    useState("");
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
    // Disabled for now
    // TODO: Remove photos from storage after analysis
    // dispatch(deletePhotos());
    dispatch(resetBodyPhotosState());
    dispatch(
      updateUserInfo({
        currentBodyFat: geminiResponse.current.bodyFat,
        targetBodyFat: geminiResponse.target.bodyFat,
        targetWeight: geminiResponse.target.weight,
        bodyPartsThatNeedImprovement:
          geminiResponse.bodyPartsThatNeedImprovement,
        photos: [],
      })
    );
    dispatch(loadUserInfo());
    navigation.navigate("MainMenu");
  };

  useEffect(() => {
    if (!loading) {
      fetchAnalysis();
    }
  }, [loading]);

  if (!geminiResponse || isFetchingGeminiResponse) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <TopHeader>Body Analysis</TopHeader>
        <View style={localStyles.loadingScreen}>
          <Text style={{ marginBottom: 30 }} variant="headlineMedium">
            Analyzing your body
          </Text>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  if (errorFetchingGeminiResponse) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <TopHeader>Body Analysis</TopHeader>
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
            style={{ marginVertical: 20, marginRight: "auto" }}
          >
            Re-analyze
          </Button>
        </StackRow>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader>Body Analysis</TopHeader>
      <View style={{ flex: 1 }}>
        <StackRow style={{ flex: 1 }}>
          <View style={{ flex: 2 }}>
            <Image
              contentFit="contain"
              source={AnalysePosture}
              style={{ width: "auto", height: 300 }}
            />
          </View>
          <View style={{ flex: 3, marginLeft: 20 }}>
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
                    marginRight: 4,
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
                  {Math.floor(geminiResponse?.current.bodyFat)}%
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
                    marginRight: 4,
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
                  {`${Math.floor(geminiResponse?.current.weight) || "0"}kg`}
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
                    marginRight: 4,
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
                  {Math.floor(geminiResponse?.target.bodyFat)}%
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
                    marginRight: 4,
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
                  {`${Math.floor(geminiResponse?.target.weight) || "0"}kg`}
                </Text>
              </StackRow>
            </Surface>
          </View>
        </StackRow>
      </View>
      <Surface
        style={{
          ...styles.surface,
          marginTop: 32,
          marginBottom: 20,
          backgroundColor: theme.colors.backdrop,
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
          {geminiResponse?.additionalInfo}
        </Text>
      </Surface>
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
          style={{ marginVertical: 20, marginRight: "auto" }}
        >
          Re-analyze
        </Button>
      </StackRow>
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
