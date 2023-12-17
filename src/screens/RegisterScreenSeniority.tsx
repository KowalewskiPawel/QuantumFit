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
  const [registerDialog, setRegisterDialog] = useState(false);
  const [selectedExerciseFrequency, setSelectedExerciseFrequency] = useState(
    registerStore.gymExperience || 1
  );
  const theme = useTheme();

  const validateRegistration = () => {
      dispatch(
        setRegisterState({
          gymExperience: selectedExerciseFrequency,
        })
      );
      setRegisterDialog(true);
  };

  const renderExerciseFrequency = () => {
    switch (selectedExerciseFrequency) {
      case 1:
        return "less than 1 month";
      case 13:
        return "more than 12 months";
      default:
        return `${selectedExerciseFrequency} months`;
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
          <Text variant="bodyLarge" style={{ marginTop: 20, marginBottom: 10, marginHorizontal: 10 }}>
            We are almost done! Just tell us how many months, have you been
            working out?
          </Text>
          <Text variant="titleLarge">
            {renderExerciseFrequency()}
          </Text>
          <Slider
            style={{ width: 250, height: 20, marginTop: 10, marginBottom: 10 }}
            minimumValue={1}
            maximumValue={13}
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
            visible={registerDialog}
            onDismiss={() => setRegisterDialog(false)}
            style={{
              backgroundColor: theme.colors.primaryContainer,
            }}
          >
            <Dialog.Title>Do you want to create your account?</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#FFF" }}>
                Please confirm that you want to create your account. You can always go back and change your information.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
            <Button textColor="#FFF" onPress={() => setRegisterDialog(false)}>
                Go Back
              </Button>
              <Button textColor="#FFF" onPress={() => setRegisterDialog(false)}>
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
};
