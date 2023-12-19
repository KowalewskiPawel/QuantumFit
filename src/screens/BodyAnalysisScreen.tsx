import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { askGeminiText } from "../gemini/gemini-config";
import { selectUserState } from "../features/user";
import { useAppSelector } from "../app/store";

export const BodyAnalysisScreen = ({ navigation }) => {
  const userState = useAppSelector(selectUserState);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const question = `You are an expert personal trainer and come across a new client. They provide you with the following information about themselves. What initial suggestions, and advice would you suggest to them?
        gender - ${userState.sex}, 
        weight - ${userState.weight},
        height - ${userState.height},
        lifestyle activity level: ${userState.lifestyle},
        aim - ${userState.aim}`;

      try {
        const { response, text } = await askGeminiText(question);
        setGeminiResponse({ response, text });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userState]);

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Body Analysis
          </Text>
        </View>
        <View>
          <Text style={{ color: theme.colors.onBackground }}>
            {geminiResponse
              ? geminiResponse.text
              : "Your results are currently loading..."}
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
