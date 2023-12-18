import React, { useEffect, useState } from "react";
import { Image, Text, View, SafeAreaView } from "react-native";
import { Button, Surface, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { askGeminiText } from "../gemini/gemini-config";
import { selectUserState } from "../features/user";
import { useAppSelector } from "../app/store";
import { StackRow } from "../components";

export const BodyAnalysisScreen = ({ navigation }) => {
  const AnalysePosture = require("../assets/analyse-body.png");
  const userState = useAppSelector(selectUserState);
  // const [geminiResponse, setGeminiResponse] = useState(null);
  const theme = useTheme();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const question = `You are an expert personal trainer and come across a new client. They provide you with the following information about themselves. What initial suggestions, and advice would you suggest to them?
  //       gender - ${userState.sex},
  //       weight - ${userState.weight},
  //       height - ${userState.height},
  //       lifestyle activity level: ${userState.lifestyle},
  //       aim - ${userState.aim}`;

  //     try {
  //       const { response, text } = await askGeminiText(question);
  //       setGeminiResponse({ response, text });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [userState]);

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground, marginBottom: 40 }}>
            Body Analysis
          </Text>
        </View>
        <StackRow>
          <Image source={AnalysePosture} style={{ width: 100, height: 300 }} />
          <View style={{ maxWidth: 150, marginLeft: 20 }}>
            <Text
              style={{
                ...styles.subtitleUpperCase,
                color: theme.colors.onBackground,
                marginLeft: 20,
                marginBottom: 15,
              }}
            >
              Current
            </Text>
            <StackRow>
              <Text
                style={{
                  ...styles.secondarySubtitleUppercase,
                  color: theme.colors.onBackground,
                  alignSelf: "center",
                  marginRight: 10,
                }}
              >
                Body Fat:
              </Text>
              <Text
                style={{
                  ...styles.bigUnits,
                  color: theme.colors.onBackground,
                }}
              >
                15%
              </Text>
            </StackRow>
            <StackRow>
              <Text
                style={{
                  ...styles.secondarySubtitleUppercase,
                  color: theme.colors.onBackground,
                  alignSelf: "center",
                  marginRight: "auto",
                }}
              >
                Weight:
              </Text>
              <Text
                style={{
                  ...styles.bigUnits,
                  color: theme.colors.onBackground,
                }}
              >
                90
              </Text>
              <Text
                style={{
                  ...styles.secondarySubtitleUppercase,
                  color: theme.colors.onBackground,
                  marginLeft: 4,
                }}
              >
                kg
              </Text>
            </StackRow>
            <Text
              style={{
                ...styles.subtitleUpperCase,
                color: theme.colors.onBackground,
                marginLeft: 20,
                marginBottom: 15,
                marginTop: 20,
              }}
            >
              Target
            </Text>
            <StackRow>
              <Text
                style={{
                  ...styles.secondarySubtitleUppercase,
                  color: theme.colors.onBackground,
                  alignSelf: "center",
                  marginRight: 10,
                }}
              >
                Body Fat:
              </Text>
              <Text
                style={{
                  ...styles.bigUnits,
                  color: theme.colors.onBackground,
                }}
              >
                11%
              </Text>
            </StackRow>
            <StackRow>
              <Text
                style={{
                  ...styles.secondarySubtitleUppercase,
                  color: theme.colors.onBackground,
                  alignSelf: "center",
                  marginRight: "auto",
                }}
              >
                Weight:
              </Text>
              <Text
                style={{
                  ...styles.bigUnits,
                  color: theme.colors.onBackground,
                }}
              >
                75
              </Text>
              <Text
                style={{
                  ...styles.secondarySubtitleUppercase,
                  color: theme.colors.onBackground,
                  marginLeft: 4,
                }}
              >
                kg
              </Text>
            </StackRow>
          </View>
        </StackRow>
        <Surface style={{ ...styles.surface, width: "70%", marginVertical: 20 }} elevation={4}>
          <Text style={{
                  ...styles.textBackground,
                  color: theme.colors.onBackground,
                }}>Information about the body provided by AI e.g. which are need work</Text>
        </Surface>
        <StackRow>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{
              marginTop: 20,
              marginBottom: 20,
              marginRight: 20,
              marginLeft: "auto",
            }}
          >
            Complete
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20, marginBottom: 20, marginRight: "auto" }}
          >
            Re-analyse
          </Button>
        </StackRow>
      </View>
    </SafeAreaView>
  );
};
