import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import {
  Button,
  Dialog,
  Portal,
  useTheme,
} from "react-native-paper";
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
          <View style={styles.textBackground}>
            <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
              Loading...
            </Text>
            <Image source={LogoEntry} style={{ width: 200, height: 200 }} />
            <LoadingSpinner />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader>
        Hello {userState.username}
      </TopHeader>
      <View style={{ alignItems: "center", width: "100%", height: 200 }}>
        <Image contentFit="contain" source={LogoEntry} style={{ width: 200, height: 200 }} />
      </View>
      <View style={{ flex: 1, flexDirection: 'column', rowGap: 20, justifyContent: "center" }}>
        <Button
          mode="contained"
          onPress={shouldOpenMyTrainings}
        >
          My Trainings
        </Button>
        <Button
          mode="contained"
          onPress={shouldOpenMyDiet}
        >
          My Diet
        </Button>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("BodyAnalysisPictureScreen", { side: "front" })
          }
        >
          Body Analysis
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("ExerciseAnalysis")}
        >
          Exercise Analysis
        </Button>
        <Button
          mode="contained"
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
