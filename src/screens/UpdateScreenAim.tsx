import { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/globalStyles";
import { CustomCard, StackRow, TopHeader } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setUserState } from "../features/user/slice";
import { selectUserState, updateUserInfo } from "../features/user";
import { AIMS } from "../consts/aims";

export const UpdateScreenAim = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const [selectedAim, setSelectedAim] = useState(userState.aim || "");
  const [selectedExerciseFrequency, setSelectedExerciseFrequency] = useState(
    userState.exerciseFrequency || 1
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!selectedAim || !selectedExerciseFrequency) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(
        setUserState({
          aim: selectedAim,
          exerciseFrequency: selectedExerciseFrequency,
        })
      );
      dispatch(
        updateUserInfo({
          aim: selectedAim,
          exerciseFrequency: selectedExerciseFrequency,
        })
      );
      navigation.navigate("Settings");
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader>
        Update Aim
      </TopHeader>
      <View style={{ flexDirection: "column", rowGap: 20 }}>
        {AIMS.map((aim) => (
          <CustomCard
            key={aim.content}
            content={aim.content}
            onPress={setSelectedAim}
            onlyContent
            selected={selectedAim === aim.content}
          />
        ))}
        <View style={{alignItems: "center"}}>
          <Text variant="bodyLarge" style={{ marginTop: 20, marginBottom: 10 }}>
            How many days a week do you want to exercise?
          </Text>
          <Text variant="displaySmall">{selectedExerciseFrequency}</Text>
          <Slider
            style={{ width: 250, height: 20, marginVertical: 10 }}
            minimumValue={1}
            maximumValue={7}
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
            Update
          </Button>
        </StackRow>
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
              <Text style={{ color: theme.colors.onBackground }}>
                Please select aim that you want to achieve, and then click
                "update".
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor={theme.colors.onBackground} onPress={() => setIsError(false)}>
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
};
