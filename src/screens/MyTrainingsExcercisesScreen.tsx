import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { Button, useTheme, Text, Card } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { useAppDispatch, useAppSelector } from "../app/store";
import { loadTrainingPlans, selectTrainingPlansState } from "../features/trainingPlans";
import { serverTimestamp } from "firebase/firestore";

export const MyTrainingsExcercisesScreen = ({ navigation, route }) => {
  const { planId } = route.params;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { trainingPlans } = useAppSelector(selectTrainingPlansState);
  const [trainingPlan, setTrainingPlan] = useState(null);

  useEffect(() => {
    if (!trainingPlans?.length) {
      dispatch(loadTrainingPlans())
    } else {
      const plan = trainingPlans.find(plan => plan.id === planId)?.data()
      setTrainingPlan(plan)
    }
  }, [trainingPlans])

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();

    date = `${dd}-${mm}-${yyyy}`;
    return date;
  }

  const renderDailyTrainingPlans = () => {
    if (!!trainingPlan) {
      return (
        <View style={{ marginBottom: 32 }} key={trainingPlan.createdAt.seconds}>
          <Card style={{ backgroundColor: theme.colors.backdrop }}>
            <Card.Content>
              <Text variant="bodyMedium">{trainingPlan.tips}</Text>
            </Card.Content>
          </Card>
        </View>
      )
    }
    return;
  }

  const renderExcercises = () => {
    if (!!trainingPlan) {
      return trainingPlan.dailyPlans.map(dplan => {
        return (
          <View style={{ marginBottom: 32 }} key={`daily-plan-${planId}-${dplan.dayNumber}`}>
            <Card style={{ backgroundColor: theme.colors.backdrop }}>
              <Card.Content>
                <Card.Title title={`Day ${dplan.dayNumber}`} />
                <Text style={{marginBottom: 20}} variant="titleMedium">Excercises:</Text>
                <View>
                  {dplan.excercises.map((excercise, index) => (<View style={{ marginBottom: 20 }} key={`${planId}-day-${dplan.dayNumber}-excercise-${index}`}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{excercise.excerciseName}</Text>
                    <View style={{ marginBottom: 12 }}>
                      <Text>{`Duration: ${excercise.excerciseDuration}`}</Text>
                      <Text>{`Reps: ${excercise.numberOfReps}`}</Text>
                      <Text>{`Sets: ${excercise.numberOfSets}`}</Text>
                      <Text>{`Brakes between sets: ${excercise.brakesBetweenSets}`}</Text>
                    </View>
                    <Text>{excercise.excerciseDescription}</Text>
                  </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </View>
        )
      }
      )
    }
    return;
  }
  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={styles.textBackground}>
        <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
          {`Plan since ${!trainingPlan ? serverTimestamp() : convertTimestamp(trainingPlan?.createdAt)}`}
        </Text>
      </View>
      {renderDailyTrainingPlans()}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
        {renderExcercises()}
      </ScrollView>
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
