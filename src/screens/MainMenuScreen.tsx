import React from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import { useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";

export const MainMenuScreen = ({ navigation }) => {
  const theme = useTheme();
  const LogoEntry = require('../assets/logoEntry.png');

  return (
    <SafeAreaView style={{ ...styles.container }}>
        <View>
          <View style={styles.textBackground}>
            <Text style={{ ...styles.title, color: theme.colors.onBackground }}>QuantumFit</Text>
            <Image source={LogoEntry} style={{ width: 200, height: 200 }} />
          </View>
        </View>
    </SafeAreaView>
  );
};