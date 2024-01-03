import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Card,
  List,
  Button,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { selectDietState, selectPreviousDietState } from "../features/diet";
import { useAppDispatch, useAppSelector } from "../app/store";
import apiClient from "../api/apiClient";

import { DietState } from "../features/diet/state";
import { setPreviousDietState } from "../features/diet/slice";
import { selectMealState, updateMealInfo } from "../features/meal";
import { selectUserState } from "../features/user";
import { generateQuestion } from "../prompts/mealPlan";
import { setMealState } from "../features/meal/slice";

import { styles } from "../styles/globalStyles";

export const MyDietScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const previousChipState = useAppSelector(selectPreviousDietState);
  const chipState = useAppSelector(selectDietState);
  const mealState = useAppSelector(selectMealState);
  const userState = useAppSelector(selectUserState);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const upperAccordionWidth = width - 40;

  const fetchData = async (excludedFoods: string) => {
    setLoading(true);
    const question = generateQuestion(userState, excludedFoods);

    try {
      const { message } = await apiClient.post("text", {
        prompt: question,
      });
      const parsedMealPlan = JSON.parse(message);
      const parsedMealPlanForDB = {
        mealPlan: JSON.stringify(parsedMealPlan),
      };
      dispatch(setMealState(parsedMealPlan));
      dispatch(updateMealInfo(parsedMealPlanForDB));
    } catch (error) {
      // There was a problem with the server. Please try again later!
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(() => {
    const hasChipStateChanged = (
      previousState: DietState,
      newState: DietState
    ) =>
      Object.entries(newState)
        .map(([name, value]) => value === previousState[name])
        .filter((value) => value === false).length === 0;

    if (!hasChipStateChanged(previousChipState, chipState)) {
      const selectedChips = Object.entries(chipState)
        .filter(([_key, value]) => value)
        .map(([key]) => key);

      const allChipsButLastOne = selectedChips.slice(0, -1).join(", ");
      const lastChip = selectedChips.slice(-1);
      const excludedFoods = `${allChipsButLastOne} and ${lastChip}`;

      dispatch(setPreviousDietState(chipState));
      // call gemini again to redo the meal plan
      fetchData(excludedFoods);
    }
  });

  useEffect(() => {
    if (mealState.length === 0) {
      // call gemini to create the meal plan
      fetchData("");
    }
  });

  return (
      <SafeAreaView style={{ ...styles.container }}>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            My 7 Day Meal Plan
          </Text>
        </View>
        <ScrollView>
          {loading ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text
                style={{ color: theme.colors.onBackground, marginBottom: 40 }}
              >
                Your meal plan is currently being generated...
              </Text>
            </>
          ) : (
            <List.AccordionGroup>
              {!!mealState.length &&
                !loading &&
                mealState.map(({ mealSummary, meals }, indexOuter: number) => (
                  <List.Accordion
                    title={`DAY ${indexOuter + 1}`}
                    titleStyle={{ fontSize: 24, fontWeight: "600" }}
                    description={mealSummary}
                    descriptionStyle={{ fontStyle: "italic", paddingLeft: 6 }}
                    expanded={true}
                    key={`day-${indexOuter}`}
                    id={indexOuter}
                    style={{
                      ...styles.textBackground,
                      width: upperAccordionWidth,
                    }}
                  >
                    <View style={{ marginLeft: 30, marginRight: 30 }}>
                      <List.Section style={{ marginBottom: 0 }}>
                        <List.AccordionGroup>
                          {meals.map(
                            (
                              { meal, name, ingredients },
                              indexMiddle: number
                            ) => (
                              <List.Accordion
                                title={name}
                                key={name}
                                titleStyle={{ fontSize: 18, fontWeight: "500" }}
                                description={meal}
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
                                    <List.Section style={{ marginBottom: 0 }}>
                                      {ingredients.map((ingredient: string) => (
                                        <List.Item
                                          key={ingredient}
                                          title={ingredient}
                                          titleNumberOfLines={2}
                                          titleStyle={{
                                            marginLeft: -8,
                                            fontSize: 15,
                                          }}
                                          left={(props) => (
                                            <List.Icon
                                              {...props}
                                              style={{ paddingLeft: 0 }}
                                              icon="circle-small"
                                            />
                                          )}
                                          style={{
                                            paddingTop: 2,
                                            paddingBottom: 2,
                                          }}
                                        />
                                      ))}
                                    </List.Section>
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
                ))}
            </List.AccordionGroup>
          )}
        </ScrollView>
        <View>
          {!!mealState.length && !loading && (
            <Button
              icon="tune"
              mode="contained"
              onPress={() => navigation.navigate("DietPreferences")}
              style={{ marginVertical: 20, marginRight: 10 }}
            >
              Adjust My Diet
            </Button>
          )}
          <Button
            icon="arrow-left"
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={{ marginVertical: 20, marginRight: 10 }}
          >
            Go back
          </Button>
        </View>
      </SafeAreaView>
  );
};
