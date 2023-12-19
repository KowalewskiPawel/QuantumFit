import { useState } from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { CustomCard, StackRow } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectUserState, updateUserInfo } from "../features/user";
import { setUserState } from "../features/user/slice";

export const UpdateScreenLifestyle = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const LIFESTYLES = [
    {
      title: "Sedentary",
      content:
        "Lack of exercise and sedentary lifestyle (e.g. work in the office)",
      icon: "sofa-single",
    },
    {
      title: "Low",
      content:
        "Sedentary lifestyle and having a walk or working out 1-2 times a week",
      icon: "run",
    },
    {
      title: "Moderate",
      content: "Moderate physical activity (e.g. working out 3-5 times a week)",
      icon: "run-fast",
    },
    {
      title: "High",
      content: "High physical activity (e.g. working out 5-7 times a week)",
      icon: "weight-lifter",
    },
  ];
  const userState = useAppSelector(selectUserState);
  const [selectedLifestyle, setSelectedLifestyle] = useState(
    userState.lifestyle || ""
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!selectedLifestyle) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(setUserState({ lifestyle: selectedLifestyle }));
      dispatch(updateUserInfo({ lifestyle: selectedLifestyle }));
      navigation.navigate("UpdateAim");
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <ScrollView style={{ width: 400 }}>
        <View style={{ ...styles.container }}>
          <View style={styles.textBackground}>
            <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
              Update Lifestyle
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
                Go Back
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
                  Please select lifestyle that describes yours best, and then
                  click "continue".
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
      </ScrollView>
    </SafeAreaView>
  );
};
