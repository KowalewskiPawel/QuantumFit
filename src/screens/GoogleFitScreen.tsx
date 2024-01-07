import React from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";

export const GoogleFitScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={styles.textBackground}>
        <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
          Google Fit
        </Text>
      </View>
      <ScrollView></ScrollView>
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
