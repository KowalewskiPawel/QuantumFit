import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, Surface, TextInput, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { CustomProgressRing, LoadingSpinner, StackRow } from "../components";
import apiClient from "../api/apiClient";
import { useAppSelector } from "../app/store";
import { selectUserState } from "../features/user";
import { calculateTargetCalories } from "../utils";
import { generateCaloriesBurntComment } from "../prompts/calories";

export const DailyGoalScreen = ({ navigation }) => {
  const [caloriesProgress, setCaloriesProgress] = useState(0);
  const [caloriesBurnt, setCaloriesBurnt] = useState(""); // [kcal]
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

  const fetchCaloriesBurntAIComment = async () => {
    setIsLoadingAIComment(true);
    try {
      const { message } = await apiClient.post("text", {
        prompt: generateCaloriesBurntComment(
          targetCalories,
          caloriesBurnt,
          currentBodyFat,
          weight
        ),
      });
      if (message.length === 0) {
        setAiComment("No comment generated. Please try again later.");
      } else {
        setAiComment(message);
      }
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
    const caloriesBurntPercentage = calculateEnergyPercentage(
      Number(caloriesBurnt),
      targetCalories
    );
    setCaloriesProgress(caloriesBurntPercentage);
  }, [caloriesBurnt]);

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
                color: "#FFF",
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
              {caloriesBurnt || "0"} kcal
            </Text>
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                color: "#FFF",
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
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              paddingTop: 20,
              paddingBottom: 10,
              color: "#FFF",
              fontSize: 20,
            }}
          >
            Set Calories Burnt Today:
          </Text>
          <TextInput
            mode="outlined"
            value={caloriesBurnt}
            onChangeText={setCaloriesBurnt}
            keyboardType="numeric"
            maxLength={4}
            placeholder="Calories Burnt (kcal)"
            label="Calories Burnt (kcal)"
            style={{ marginBottom: 20 }}
          />
        </View>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text
            style={{
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
                width: "100%",
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
                {!aiComment
                  ? "No Progress yet Today, AI Comments will be fetched only after increasing the progress bar and clicking 'Analyze Progress' button."
                  : aiComment}
              </Text>
            </Surface>
          )}
        </View>
      </ScrollView>
      <View>
        <Button
          mode="contained"
          disabled={caloriesProgress === 0}
          onPress={fetchCaloriesBurntAIComment}
          style={{ marginTop: 10, marginRight: 10 }}
        >
          Analyze Progress
        </Button>
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
