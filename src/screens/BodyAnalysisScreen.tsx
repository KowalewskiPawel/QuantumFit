import React, { useEffect, useState } from "react";
import { Image, View, SafeAreaView, StyleSheet } from "react-native";
import { Button, Surface, useTheme, Text } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { askGeminiText, askGeminiVision } from "../gemini/gemini-config";
import { selectUserState } from "../features/user";
import { useAppDispatch, useAppSelector } from "../app/store";
import { LoadingSpinner, StackRow } from "../components";
import { getEstimateBodyFatAndTargetPrompt } from "../prompts/bodyAnalysis";
import { resetBodyPhotosState } from "../features/bodyPhotos/slice";

export const BodyAnalysisScreen = ({ navigation }) => {
  const AnalysePosture = require("../assets/analyse-body.png");
  const {
    weight,
    yearOfBirth,
    height,
    lifestyle,
    aim,
    sex,
    exerciseFrequency,
    gymExperience,
    photos
  } = useAppSelector(selectUserState);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const fetchAnalysis = async () => {
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
      // Temporarily add photo urls to second argument of askGeminiVision as a string entry to the array of possible values
      const { text } = await askGeminiVision(bodyAnalysisPrompt, photos);
      const parsedText = JSON.parse(text.split("```json")[1].split("```")[0]);
      setGeminiResponse(parsedText);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleComplete = () => {
    navigation.navigate('MainMenu');
    dispatch(resetBodyPhotosState())
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
        {!geminiResponse ? (
          <View style={localStyles.loadingScreen}>
            <Text style={{marginBottom: 30}} variant="headlineMedium">Analysing your body</Text>
            <LoadingSpinner />
          </View>
        ) : (
          <View>
            <StackRow>
              <Image
                source={AnalysePosture}
                style={{ width: 100, height: 300 }}
              />
              <View style={{ maxWidth: 150, marginLeft: 20 }}>
                <Text
                  style={{
                    ...styles.subtitleUpperCase,
                    color: theme.colors.onBackground,
                    marginLeft: 20,
                    marginBottom: 15,
                  }}
                >
                  Current
                </Text>
                <StackRow>
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                      alignSelf: "center",
                      marginRight: 10,
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
                <StackRow>
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                      alignSelf: "center",
                      marginRight: "auto",
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
                    {weight}
                  </Text>
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                      marginLeft: 4,
                    }}
                  >
                    kg
                  </Text>
                </StackRow>
                <Text
                  style={{
                    ...styles.subtitleUpperCase,
                    color: theme.colors.onBackground,
                    marginLeft: 20,
                    marginBottom: 15,
                    marginTop: 20,
                  }}
                >
                  Target
                </Text>
                <StackRow>
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                      alignSelf: "center",
                      marginRight: 10,
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
                <StackRow>
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                      alignSelf: "center",
                      marginRight: "auto",
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
                    {geminiResponse?.target.weight}
                  </Text>
                  <Text
                    style={{
                      ...styles.secondarySubtitleUppercase,
                      color: theme.colors.onBackground,
                      marginLeft: 4,
                    }}
                  >
                    kg
                  </Text>
                </StackRow>
              </View>
            </StackRow>
            <Surface
              style={{ ...styles.surface, width: "70%", marginVertical: 20 }}
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
        )}
        <StackRow>
          <Button
            mode="contained"
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
})