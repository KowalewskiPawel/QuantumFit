import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";

export const ShoppingListScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Shopping List
          </Text>
        </View>
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
