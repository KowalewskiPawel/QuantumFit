import React from "react";
import {
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";
import { Button, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { TopHeader } from "../components";

export const EntryScreen = ({ navigation }) => {
  const theme = useTheme();
  const LogoEntry = require('../assets/logoEntry.png');

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader variant="headlineLarge" >Welcome to QuantumFit</TopHeader>
      <View style={{ flex: 1, alignItems: "center", width: "100%", height: 200 }}>
        <Image contentFit="contain" source={LogoEntry} style={{ width: 200, height: 200 }} />
      </View>
      <View style={{ flex: 2 }}>
        <Button
          icon="account-key"
          mode="contained"
          style={{ marginTop: 20, backgroundColor: theme.colors.primary }}
          onPress={() => navigation.navigate('Login')}
        >
          Sign in
        </Button>
        <Button
          icon="account-plus"
          mode="contained"
          style={{ marginVertical: 20, backgroundColor: theme.colors.primary }}
          onPress={() => navigation.navigate('RegisterEntry')}
        >
          Sign up
        </Button>
      </View>
    </SafeAreaView>
  );
};