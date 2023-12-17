import React from "react";
import { Text, View, Image, SafeAreaView } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { useAppSelector } from "../app/store";
import { selectUserState } from "../features/user";
import { LoadingSpinner } from "../components";

export const MainMenuScreen = ({ navigation }) => {
  const theme = useTheme();
  const userState = useAppSelector(selectUserState);
  const LogoEntry = require("../assets/logoEntry.png");

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
          <Image source={LogoEntry} style={{ width: 200, height: 200 }} />
        </View>
        <Button
          mode="contained"
          style={{ marginTop: 20, backgroundColor: theme.colors.primary }}
          onPress={() => navigation.navigate("BodyAnalysis")}
        >
          Body Analysis
        </Button>
        <Button
          mode="contained"
          style={{
            marginTop: 20,
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => navigation.navigate("MyTrainings")}
        >
          My Trainings
        </Button>
        <Button
          mode="contained"
          style={{
            marginTop: 20,
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => navigation.navigate("MyDiet")}
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
          onPress={() => navigation.navigate("Settings")}
        >
          Settings
        </Button>
      </View>
    </SafeAreaView>
  );
};
