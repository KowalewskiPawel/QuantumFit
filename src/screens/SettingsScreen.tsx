import React from "react";
import { Image, Text, View, SafeAreaView } from "react-native";
import { Button, useTheme } from "react-native-paper";

import { logoutUser } from "../features/auth";
import { useAppDispatch } from "../app/store";

import { styles } from "../styles/globalStyles";

export const SettingsScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const LogoEntry = require('../assets/logoEntry.png');

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate('Entry');
  };
  
  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Settings
          </Text>
        </View>
        <Image source={LogoEntry} style={{ width: 175, height: 175, alignSelf: "center" }} />
        <Button
          icon="file-document-outline"
          mode="contained"
          onPress={() => navigation.navigate('UpdateEntry')}
          style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
        >
          Update Personal Information
        </Button>
        <Button
          icon="bullseye-arrow"
          mode="contained"
          onPress={() => navigation.navigate('UpdateLifestyle')}
          style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
        >
          Modify Lifestyle & Aim
        </Button>
        <Button
          icon="logout"
          mode="contained"
          onPress={handleLogout}
          style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
        >
          Log out
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
