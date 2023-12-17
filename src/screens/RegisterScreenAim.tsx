import { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/globalStyles";
import { CustomCard, StackRow } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectRegisterState } from "../features/register";
import { setRegisterState } from "../features/register/slice";

export const RegisterScreenAim = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const AIMS = [
    {
      content: "I want to lose weight",
    },
    {
      content: "I want to keep my weight",
    },
    {
      content: "I want to gain weight and muscle mass",
    },
  ];
  const registerStore = useAppSelector(selectRegisterState);
  const [selectedAim, setSelectedAim] = useState(registerStore.aim || "");
  const [selectedExerciseFrequency, setSelectedExerciseFrequency] = useState(
    registerStore.exerciseFrequency || 1
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!selectedAim || !selectedExerciseFrequency) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(
        setRegisterState({
          aim: selectedAim,
          exerciseFrequency: selectedExerciseFrequency,
        })
      );
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Your Aim
          </Text>
        </View>
        <View style={{ display: "flex", alignItems: "center" }}>
          {AIMS.map((aim) => (
            <CustomCard
              key={aim.content}
              content={aim.content}
              onPress={setSelectedAim}
              onlyContent
              selected={selectedAim === aim.content}
            />
          ))}
          <Text variant="bodyLarge" style={{ marginTop: 20, marginBottom: 10 }}>
            How many days a week do you want to exercise?
          </Text>
          <Text variant="titleLarge">{selectedExerciseFrequency}</Text>
          <Slider
            style={{ width: 250, height: 20, marginTop: 10, marginBottom: 10 }}
            minimumValue={0}
            maximumValue={7}
            value={selectedExerciseFrequency}
            onValueChange={setSelectedExerciseFrequency}
            step={1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#000000"
          />
          <StackRow>
            <Button
              icon="arrow-left"
              mode="contained"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
            >
              Previous
            </Button>
            <Button
              mode="contained"
              style={{ marginTop: 20, marginBottom: 20 }}
              onPress={validateRegistration}
            >
              Continue
            </Button>
          </StackRow>
        </View>
        <Portal>
          <Dialog
            visible={isError}
            onDismiss={() => setIsError(false)}
            style={{
              backgroundColor: theme.colors.primaryContainer,
            }}
          >
            <Dialog.Title>Please Select Aim</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#FFF" }}>
                Please select aim that you want to achieve, and at least 1 day
                of exercise per week, and then click "continue".
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#FFF" onPress={() => setIsError(false)}>
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
};
