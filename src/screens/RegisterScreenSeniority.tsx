import { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/globalStyles";
import { StackRow, TopHeader } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { registerUser, selectRegisterState } from "../features/register";
import {
  resetRegisterState,
  setRegisterState,
} from "../features/register/slice";
import { loadUserInfo } from "../features/user";

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

  const createAccount = () => {
    dispatch(registerUser());
  };

  const cancelRegistration = () => {
    dispatch(setRegisterState({ errorMessage: null }));
    setRegisterDialog(false);
  };

  const finishRegistration = () => {
    setRegisterDialog(false);
    dispatch(loadUserInfo());
    navigation.navigate("MainMenu");
    dispatch(resetRegisterState());
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
      <TopHeader>Welcome to QuantumFit</TopHeader>
      <View style={{ alignItems: "center", width: "100%", height: 200 }}>
        <Image contentFit="contain" source={LogoEntry} style={{ width: 200, height: 200 }} />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text
          variant="bodyLarge"
          style={{ marginVertical: 20, textAlign: "center" }}
        >
          We are almost done! Just tell us how many months, have you been
          working out?
        </Text>
        <Text variant="headlineSmall">{renderExerciseFrequency()}</Text>
        <Slider
          style={{ width: 250, height: 20, marginVertical: 10 }}
          minimumValue={1}
          maximumValue={13}
          value={selectedExerciseFrequency}
          onValueChange={setSelectedExerciseFrequency}
          step={1}
          thumbTintColor={theme.colors.primary}
          minimumTrackTintColor={theme.colors.secondary}
          maximumTrackTintColor="#000000"
        />
      </View>
      <StackRow style={{ marginVertical: 20, columnGap: 20, justifyContent: "center" }}>
        <Button
          icon="arrow-left"
          mode="outlined"
          onPress={() => navigation.goBack()}
        >
          Previous
        </Button>
        <Button
          mode="contained"
          onPress={validateRegistration}
        >
          Finish
        </Button>
      </StackRow>
      <Portal>
        <Dialog
          visible={registerDialog}
          onDismiss={() => setRegisterDialog(false)}
          style={{
            backgroundColor: theme.colors.primaryContainer,
          }}
        >
          <Dialog.Title>{registerStore.isRegistrationSuccessful ? "Congratulations!" : "Do you want to create your account?"}</Dialog.Title>
          {registerStore.isRegistrationSuccessful ? (
            <View>
              <Dialog.Content>
                <Text style={{ color: "#5AF113" }}>
                  Your account has been created successfully!
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button textColor={theme.colors.onBackground} onPress={finishRegistration}>
                  OK
                </Button>
              </Dialog.Actions>
            </View>
          ) : (
            <View>
              <Dialog.Content>
                <Text style={{ color: theme.colors.onBackground }}>
                  Please confirm that you want to create your account. You can
                  always go back and change your information.
                </Text>
              </Dialog.Content>
              {registerStore.errorMessage && (
                <Dialog.Content>
                  <Text style={{ color: theme.colors.error }}>
                    {registerStore.errorMessage}
                  </Text>
                </Dialog.Content>
              )}
              <Dialog.Actions>
                <Button
                  textColor={theme.colors.onBackground}
                  onPress={cancelRegistration}
                  disabled={registerStore.loading}
                >
                  Go Back
                </Button>
                <Button
                  textColor={theme.colors.onBackground}
                  onPress={createAccount}
                  disabled={registerStore.loading}
                >
                  {registerStore.loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Dialog.Actions>
            </View>
          )}
        </Dialog>
      </Portal>
    </SafeAreaView >
  );
};
