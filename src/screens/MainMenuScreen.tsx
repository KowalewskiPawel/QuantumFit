import React, { useEffect, useState } from "react";
import { Text, View, Image, SafeAreaView } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  useTheme,
} from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { useAppDispatch, useAppSelector } from "../app/store";
import { loadUserInfo, selectUserState } from "../features/user";
import { LoadingSpinner } from "../components";

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
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Hello {userState.username}
          </Text>
          <IconButton
            icon="cog"
            iconColor={theme.colors.onBackground}
            size={30}
            style={{
              position: "absolute",
              right: -50,
              top: -30,
              backgroundColor: theme.colors.primary,
            }}
            onPress={() => navigation.navigate("Settings")}
          />
          <Image source={LogoEntry} style={{ width: 200, height: 200 }} />
        </View>
        <Button
          mode="contained"
          style={{ marginTop: 20, backgroundColor: theme.colors.primary }}
          onPress={() =>
            navigation.navigate("BodyAnalysisPictureScreen", { side: "front" })
          }
        >
          Body Analysis
        </Button>
        <Button
          mode="contained"
          style={{
            marginTop: 20,
            backgroundColor: theme.colors.primary,
          }}
          onPress={shouldOpenMyTrainings}
        >
          My Trainings
        </Button>
        <Button
          mode="contained"
          style={{
            marginTop: 20,
            backgroundColor: theme.colors.primary,
          }}
          onPress={shouldOpenMyDiet}
        >
          My Diet
        </Button>
        <Button
          mode="contained"
          style={{
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => navigation.navigate("ExerciseAnalysis")}
        >
          Exercise Analysis
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
            <Text style={{ color: "#FFF" }}>
              Please complete the body analysis to enable this feature. If you
              have already completed the body analysis, please try again making
              the analysis or re-log in.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor="#FFF"
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
