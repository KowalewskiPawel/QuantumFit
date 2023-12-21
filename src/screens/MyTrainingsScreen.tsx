import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { Button, useTheme, Text, Card } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectUserState } from "../features/user";
import { getTrainingPlanPrompt } from "../prompts";
import apiClient from "../api/apiClient";
import { loadTrainingPlans, selectTrainingPlansState } from "../features/trainingPlans";
import { createTrainingPlan } from "../features/trainingPlans/thunk";

export const MyTrainingsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { trainingPlans } = useAppSelector(selectTrainingPlansState);
  const {
    weight,
    yearOfBirth,
    height,
    lifestyle,
    aim,
    sex,
    exerciseFrequency,
    gymExperience,
    bodyAnalysis
  } = useAppSelector(selectUserState);

  const handleTrainingPlanCreation = async () => {
    setLoading(true);
    const prompt = getTrainingPlanPrompt(
      weight,
      yearOfBirth,
      height,
      lifestyle,
      aim,
      sex,
      exerciseFrequency,
      gymExperience,
      bodyAnalysis
    );

    try {
      const { message } = await apiClient.post("text", { prompt });
      const sliced = message.slice(message.indexOf('{'), message.lastIndexOf('}') + 1)
      const parsedText = JSON.parse(sliced);
      dispatch(createTrainingPlan(parsedText))
      setLoading(false)
    } catch (error) {
      if (error.message) {
      } else {
      }
    } finally {
    }
  }
  useEffect(() => {
    dispatch(loadTrainingPlans())
  }, [])

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();

    date = `${dd}-${mm}-${yyyy}`;
    return date;
  }

  const renderTrainingPlans = () => {
    if (trainingPlans.length) {
      return trainingPlans.map(planDoc => {
        const planData = planDoc.data()
        return (
          <View style={{ marginBottom: 32 }} key={planData.createdAt.seconds}>
            <Card style={{ backgroundColor: theme.colors.backdrop }}>
              <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
              <Card.Title title={`Created at ${convertTimestamp(planData.createdAt)}`} subtitle={`Trainging planned for ${planData.planDuration} days`} />
              <Card.Content>
                <Text variant="bodyMedium">{planData.tips}</Text>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={() => navigation.navigate("MyTrainingsExcercises", { planId: planDoc.id })}>Show entire plan</Button>
              </Card.Actions>
            </Card>
          </View>
        )
      });
    }
    return <View style={{ alignSelf: 'center', height: 100, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>No plans available</Text>
      <Text style={{ fontSize: 24 }}>please create your first plan</Text>
    </View>;
  }

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={styles.textBackground}>
        <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
          My Trainings
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
        {renderTrainingPlans()}
      </ScrollView>
      <Button
        mode="contained"
        onPress={handleTrainingPlanCreation}
        style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
        loading={loading}
      >
        {loading ? 'Creating new traing plan': 'Create My new trainig plan'}
      </Button>
      <Button
        icon="arrow-left"
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
      >
        Go back
      </Button>
    </SafeAreaView>
  );
};
