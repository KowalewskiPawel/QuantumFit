import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, Surface, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { CustomProgressRing, LoadingSpinner, StackRow } from "../components";
import { useAppleHealthData } from "../hooks/useAppleHealthData";
import apiClient from "../api/apiClient";
import { useAppSelector } from "../app/store";
import { selectUserState } from "../features/user";
import { calculateTargetCalories } from "../utils";
import { generateCaloriesComment } from "../prompts/caloriesComment";

export const DailyGoalScreen = ({ navigation }) => {
  const [caloriesProgress, setCaloriesProgress] = useState(0);
  const [aiComment, setAiComment] = useState("");
  const [isLoadingAIComment, setIsLoadingAIComment] = useState(false);
  const { weight, yearOfBirth, height, aim, sex, currentBodyFat } =
    useAppSelector(selectUserState);
  const usersAge = new Date().getFullYear() - yearOfBirth;
  const targetCalories = calculateTargetCalories(
    weight,
    height,
    usersAge,
    sex,
    aim
  );

  const theme = useTheme();
  const { getActiveEnergyAsync } = useAppleHealthData();

  const calculateEnergyPercentage = (
    currentValue: number,
    targetValue: number
  ) => {
    if (currentValue >= targetValue) {
      return 1;
    } else {
      return currentValue / targetValue;
    }
  };

  const fetchAIComment = async () => {
    setIsLoadingAIComment(true);
    try {
      const { message } = await apiClient.post("text", {
        prompt: generateCaloriesComment(
          targetCalories,
          caloriesProgress,
          currentBodyFat,
          weight
        ),
      });
      setAiComment(message);
    } catch (error) {
      if (error.message) {
        setAiComment(error.message);
      } else {
        setAiComment("Something went wrong while fetching your body analysis.");
      }
    } finally {
      setIsLoadingAIComment(false);
    }
  };

  useEffect(() => {
    const fetchEnergy = async () => {
      const caloriesBurnt = (await getActiveEnergyAsync()) as number;
      const caloriesBurntPercentage = calculateEnergyPercentage(
        caloriesBurnt,
        targetCalories
      );
      setCaloriesProgress(caloriesBurntPercentage);
    };
    fetchEnergy();
  }, []);

  useEffect(() => {
    if (caloriesProgress > 0) {
      fetchAIComment();
    }
  }, [caloriesProgress]);

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={styles.textBackground}>
        <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
          Daily Goal
        </Text>
      </View>
      <ScrollView>
        <View style={{ display: "flex", alignItems: "center" }}>
          <CustomProgressRing progress={caloriesProgress} />
        </View>
        <StackRow
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <View>
            <Text
              style={{
                paddingTop: 20,
                color: "white",
                fontSize: 20,
              }}
            >
              Progress:
            </Text>
            <Text
              style={{
                paddingTop: 10,
                fontSize: 30,
                color: "#AFB3BE",
                fontWeight: "500",
              }}
            >
              {Math.round(caloriesProgress * targetCalories)} kcal
            </Text>
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                color: "white",
                fontSize: 20,
              }}
            >
              Target:
            </Text>
            <Text
              style={{
                paddingTop: 10,
                fontSize: 30,
                color: "#AFB3BE",
                fontWeight: "500",
              }}
            >
              {targetCalories} kcal
            </Text>
          </View>
        </StackRow>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text
            style={{
              ...styles.subtitleUpperCase,
              alignSelf: "flex-start",
              color: theme.colors.onBackground,
              marginTop: 24,
              marginBottom: 12,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            AI Assistant's Comment
          </Text>
          {isLoadingAIComment ? (
            <LoadingSpinner />
          ) : (
            <Surface
              style={{
                ...styles.surface,
                marginBottom: 20,
                marginHorizontal: 40,
              }}
              elevation={4}
            >
              <Text
                style={{
                  ...styles.textBackground,
                  color: theme.colors.onBackground,
                }}
              >
                {caloriesProgress === 0
                  ? "No Progress yet Today, AI Comments will be fetched only after increasing the progress bar."
                  : aiComment}
              </Text>
            </Surface>
          )}
        </View>
      </ScrollView>
      <View>
        <Button
          icon="arrow-left"
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
        >
          Go back
        </Button>
      </View>
    </SafeAreaView>
  );
};
