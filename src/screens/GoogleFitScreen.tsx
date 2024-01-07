import React from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, useTheme } from "react-native-paper";
//import AppleHealthKit from "react-native-health";
import { styles } from "../styles/globalStyles";
import { CustomProgressRing } from "../components";

export const GoogleFitScreen = ({ navigation }) => {
  const theme = useTheme();
  // AppleHealthKit.isAvailable(() => {
  //   // if (err) {
  //   //   console.log(err);
  //   //   return;
  //   // }
  //   // if (!available) {
  //   //   console.log("Apple HealthKit is not available on this device");
  //   //   return;
  //   // }
  //   // console.log("Apple HealthKit is available on this device!");
  // });

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={styles.textBackground}>
        <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
          Google Fit
        </Text>
      </View>
      <ScrollView>
        <CustomProgressRing progress={0.5} />
      </ScrollView>
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
