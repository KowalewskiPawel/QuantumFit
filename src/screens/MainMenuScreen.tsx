import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { useAppDispatch, useAppSelector } from "../app/store";
import { loadUserInfo, selectUserState } from "../features/user";
import { LoadingSpinner, TopHeader } from "../components";

export const MainMenuScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const [isBodyAnalysisMissingModalOpen, setIsBodyAnalysisMissingModalOpen] =
    useState(false);
  const LogoEntry = require("../assets/logoEntry.png");

  const shouldOpenMyTrainings = () => {
    if (userState.currentBodyFat) {
      navigation.navigate("MyTrainings");
    } else {
      setIsBodyAnalysisMissingModalOpen(true);
    }
  };

  const shouldOpenMyDiet = () => {
    if (userState.currentBodyFat) {
      navigation.navigate("MyDiet");
    } else {
      setIsBodyAnalysisMissingModalOpen(true);
    }
  };

  useEffect(() => {
    if (!userState.loading) {
      dispatch(loadUserInfo());
    }
  }, []);

  if (userState.loading) {
    return (
      <SafeAreaView style={{ ...styles.container }}>
        <View>
          <TopHeader>Loading...</TopHeader>
          <Image
            source={LogoEntry}
            style={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <LoadingSpinner sx={{ marginVertical: 40 }} size={60} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader>Hello {userState.username}</TopHeader>
      <View style={{ alignItems: "center", width: "100%", height: 200 }}>
        <Image
          contentFit="contain"
          source={LogoEntry}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          rowGap: 20,
          justifyContent: "center",
        }}
      >
        <Button
          icon="dumbbell"
          mode="contained"
          onPress={shouldOpenMyTrainings}
        >
          My Trainings
        </Button>
        <Button
          mode="contained"
          icon="food-apple-outline"
          onPress={shouldOpenMyDiet}
        >
          My Diet
        </Button>
        <Button
          mode="contained"
          icon="human-male-height"
          onPress={() =>
            navigation.navigate("BodyAnalysisPictureScreen", { side: "front" })
          }
        >
          Body Analysis
        </Button>
        <Button
          mode="contained"
          icon="medal-outline"
          onPress={() => navigation.navigate("ExerciseAnalysis")}
        >
          Exercise Analysis
        </Button>
        <Button
          mode="contained"
          icon="google-fit"
          style={{
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => navigation.navigate("DailyGoal")}
        >
          Daily Goal
        </Button>
        <Button
          mode="contained"
          icon="weight-lifter"
          style={{
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => navigation.navigate("RealTimeExerciseSelector")}
        >
          AI Assisted Real Time Exercise
        </Button>
        <Button
          mode="contained"
          icon="heart-settings-outline"
          style={{
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => navigation.navigate("Settings")}
        >
          Settings
        </Button>
      </View>
      <Portal>
        <Dialog
          visible={isBodyAnalysisMissingModalOpen}
          onDismiss={() => setIsBodyAnalysisMissingModalOpen(false)}
          style={{
            backgroundColor: theme.colors.primaryContainer,
          }}
        >
          <Dialog.Title>Body Analysis Info Missing</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.onBackground }}>
              Please complete the body analysis to enable this feature. If you
              have already completed the body analysis, please try again making
              the analysis or re-log in.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={theme.colors.onBackground}
              onPress={() => setIsBodyAnalysisMissingModalOpen(false)}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};
