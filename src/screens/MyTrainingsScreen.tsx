import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  Card,
  List,
  Button,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../app/store";
import apiClient from "../api/apiClient";
import { selectUserState } from "../features/user";

import { styles } from "../styles/globalStyles";
import { generateTrainingPrompt } from "../prompts/exercisePlan";
import {
  selectTrainingsState,
  updateTrainingsInfo,
} from "../features/trainings";
import { setTrainingsState } from "../features/trainings/slice";

export const MyTrainingsScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const trainingsState = useAppSelector(selectTrainingsState);
  const userState = useAppSelector(selectUserState);
  const [loading, setLoading] = useState(false);
  const [generateTrainingPlanError, setGenerateTrainingPlanError] =
    useState("");
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const upperAccordionWidth = width - 40;

  const fetchData = async () => {
    setLoading(true);
    const question = generateTrainingPrompt(userState);

    try {
      const { message } = await apiClient.post("text", {
        prompt: question,
      });
      const parsedTrainingPlan = JSON.parse(message);
      const parsedTrainingPlanForDB = {
        trainingPlan: JSON.stringify(parsedTrainingPlan),
      };
      dispatch(setTrainingsState(parsedTrainingPlan));
      dispatch(updateTrainingsInfo(parsedTrainingPlanForDB));
    } catch (error) {
      setGenerateTrainingPlanError(`Unfortunately there was a problem generating your training plan. 
      Please try again!`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trainingsState.length === 0) {
      // call gemini to create the training plan
      fetchData();
    }
  }, []);

  const regenerateTrainingPlan = () => {
    setGenerateTrainingPlanError("");
    fetchData();
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={styles.textBackground}>
        <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
          My 7 Day Training Plan
        </Text>
      </View>
      <ScrollView>
        {generateTrainingPlanError || loading ? (
          <>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <Text
              style={{ color: theme.colors.onBackground, marginBottom: 40 }}
            >
              {`${
                generateTrainingPlanError
                  ? generateTrainingPlanError
                  : "Your training plan is currently being generated..."
              }`}
            </Text>
          </>
        ) : (
          <List.AccordionGroup>
            {!!trainingsState.length &&
              !loading &&
              trainingsState.map(
                ({ trainingSummary, trainings }, indexOuter: number) => (
                  <List.Accordion
                    title={`DAY ${indexOuter + 1}`}
                    titleStyle={{ fontSize: 24, fontWeight: "600" }}
                    description={trainingSummary}
                    descriptionStyle={{ fontStyle: "italic", paddingLeft: 6 }}
                    expanded={true}
                    key={`day-${indexOuter}-${Math.random()})}`}
                    id={indexOuter}
                    style={{
                      ...styles.textBackground,
                      width: upperAccordionWidth,
                    }}
                  >
                    <View style={{ marginLeft: 30, marginRight: 30 }}>
                      <List.Section style={{ marginBottom: 0 }}>
                        <List.AccordionGroup>
                          {trainings.map(
                            (
                              {
                                training,
                                name,
                                description,
                                reps,
                                sets,
                                weight,
                              },
                              indexMiddle: number
                            ) => (
                              <List.Accordion
                                title={name}
                                key={`exercise-${name}-${Math.random()}-${indexMiddle}}`}
                                titleStyle={{ fontSize: 18, fontWeight: "500" }}
                                description={training}
                                descriptionStyle={{
                                  fontStyle: "italic",
                                  paddingLeft: 6,
                                  fontWeight: "300",
                                }}
                                id={`${indexOuter}-${indexMiddle}`}
                                style={{
                                  backgroundColor: "#24232a",
                                  marginBottom: 12,
                                }}
                              >
                                <Card
                                  style={{
                                    borderRadius: 0,
                                    marginTop: -12,
                                    marginBottom: 12,
                                  }}
                                >
                                  <Card.Content style={{ paddingTop: 0 }}>
                                    <Text
                                      style={{
                                        color: theme.colors.onBackground,
                                      }}
                                    >
                                      {description}
                                    </Text>
                                    <Text
                                      style={{
                                        marginTop: 10,
                                        color: theme.colors.onBackground,
                                      }}
                                    >
                                      Reps: {reps}
                                    </Text>
                                    <Text
                                      style={{
                                        marginTop: 10,
                                        color: theme.colors.onBackground,
                                      }}
                                    >
                                      Sets: {sets}
                                    </Text>
                                    <Text
                                      style={{
                                        marginTop: 10,
                                        color: theme.colors.onBackground,
                                      }}
                                    >
                                      Weight: {weight}
                                    </Text>
                                  </Card.Content>
                                  <Card.Actions
                                    style={{ paddingTop: 0, paddingBottom: 4 }}
                                  >
                                    <Button mode="text" textColor="#c4bcbc">
                                      Details
                                    </Button>
                                  </Card.Actions>
                                </Card>
                              </List.Accordion>
                            )
                          )}
                        </List.AccordionGroup>
                      </List.Section>
                    </View>
                  </List.Accordion>
                )
              )}
          </List.AccordionGroup>
        )}
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
      {generateTrainingPlanError && (
        <View>
          <Button
            icon="refresh"
            mode="contained"
            onPress={regenerateTrainingPlan}
            style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
          >
            Re-generate training
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};
