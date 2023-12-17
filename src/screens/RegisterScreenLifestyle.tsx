import { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { CustomCard, StackRow } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectRegisterState } from "../features/register";
import { setRegisterState } from "../features/register/slice";

export const RegisterScreenLifestyle = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const LIFESTYLES = [
    {
      title: "Lack of physical activity",
      content:
        "Lack of exercise and sedentary lifestyle (e.g. work in the office)",
      icon: "speedometer-slow",
    },
    {
      title: "Low physical activity",
      content:
        "Sedentary lifestyle and having a walk or working out 1-2 times a week",
      icon: "run",
    },
    {
      title: "Moderate physical activity",
      content: "Moderate physical activity (e.g. working out 3-5 times a week)",
      icon: "run-fast",
    },
    {
      title: "High physical activity",
      content: "High physical activity (e.g. working out 5-7 times a week)",
      icon: "weight-lifter",
    },
  ];
  const registerStore = useAppSelector(selectRegisterState);
  const [selectedLifestyle, setSelectedLifestyle] = useState(
    registerStore.lifeStyle || ""
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!selectedLifestyle) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(setRegisterState({ lifeStyle: selectedLifestyle }));
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Your Lifestyle
          </Text>
        </View>
        <View style={{ display: "flex", alignItems: "center" }}>
          {LIFESTYLES.map((lifestyle) => (
            <CustomCard
              key={lifestyle.title}
              title={lifestyle.title}
              content={lifestyle.content}
              icon={lifestyle.icon}
              onPress={setSelectedLifestyle}
              selected={selectedLifestyle === lifestyle.title}
            />
          ))}
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
            <Dialog.Title>Please Select Lifestyle</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#FFF" }}>
                Please select lifestyle that describes yours best, and then click
                "continue".
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
