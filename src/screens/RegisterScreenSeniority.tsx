import { useState } from "react";
import { View, SafeAreaView, Image } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/globalStyles";
import { StackRow } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectRegisterState } from "../features/register";
import { setRegisterState } from "../features/register/slice";

export const RegisterScreenSeniority = ({ navigation }) => {
  const LogoEntry = require("../assets/logoEntry.png");

  const dispatch = useAppDispatch();
  const registerStore = useAppSelector(selectRegisterState);
  const [selectedExerciseFrequency, setSelectedExerciseFrequency] = useState(
    registerStore.gymExperience || 1
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!selectedExerciseFrequency) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(
        setRegisterState({
          gymExperience: selectedExerciseFrequency,
        })
      );
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Welcome to QuantumFit
          </Text>
          <Image source={LogoEntry} style={{ width: 200, height: 200 }} />
        </View>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text variant="bodyLarge" style={{ marginTop: 20, marginBottom: 10 }}>
            We are almost done! Just tell us how many months, have you been
            working out?
          </Text>
          <Text variant="titleLarge">
            {selectedExerciseFrequency === 1 ? "0 up to 1" : selectedExerciseFrequency <= 24
              ? selectedExerciseFrequency
              : "more than 24"}{" "}
            month(s)
          </Text>
          <Slider
            style={{ width: 250, height: 20, marginTop: 10, marginBottom: 10 }}
            minimumValue={1}
            maximumValue={25}
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
              Finish
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
            <Dialog.Title>Please Select Seniority</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#FFF" }}>
                Please select how many months have you been working out, and
                then click "continue".
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
