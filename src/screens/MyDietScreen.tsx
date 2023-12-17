import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";

export const MyDietScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            My Diet
          </Text>
        </View>
        <Button
          icon="arrow-left"
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
        >
          Go back
        </Button>
      </View>
    </SafeAreaView>
  );
};
