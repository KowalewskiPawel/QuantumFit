import React from "react";
import { View, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { Button } from "react-native-paper";

import { logoutUser } from "../features/auth";
import { useAppDispatch } from "../app/store";

import { styles } from "../styles/globalStyles";
import { TopHeader } from "../components";

export const SettingsScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const LogoEntry = require("../assets/logoEntry.png");

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate("Entry");
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader>
        Settings
      </TopHeader>
      <View style={{ alignItems: "center", width: "100%", height: 200 }}>
        <Image contentFit="contain" source={LogoEntry} style={{ width: 200, height: 200 }} />
      </View>
      <View style={{ flexDirection: "column", rowGap: 20 }}>
        <Button
          icon="file-document-outline"
          mode="contained"
          onPress={() => navigation.navigate("UpdateEntry")}
        >
          Update Personal Information
        </Button>
        <Button
          icon="bullseye-arrow"
          mode="contained"
          onPress={() => navigation.navigate("UpdateLifestyle")}
        >
          Modify Lifestyle & Aim
        </Button>
        <Button
          icon="logout"
          mode="contained"
          onPress={handleLogout}
        >
          Log out
        </Button>
        <Button
          icon="arrow-left"
          mode="outlined"
          onPress={() => navigation.goBack()}
        >
          Go back
        </Button>
      </View>
    </SafeAreaView >
  );
};
