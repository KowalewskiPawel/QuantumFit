import React, { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import {
  Button,
  useTheme,
  TextInput,
  SegmentedButtons,
} from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { StackRow, TopHeader } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectUserState, updateUserInfo } from "../features/user";
import { setUserState } from "../features/user/slice";

export const UpdateScreenBody = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const [sex, setSex] = useState(userState.sex || "male");
  const [height, setHeight] = useState(userState.height || "");
  const [weight, setWeight] = useState(userState.weight || "");
  const [yearOfBirth, setYearOfBirth] = useState(userState.yearOfBirth || "");
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (
      !height ||
      !weight ||
      !yearOfBirth ||
      Number.isNaN(Number(height)) ||
      Number.isNaN(Number(weight)) ||
      Number.isNaN(Number(yearOfBirth))
    ) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(setUserState({ sex, height, weight, yearOfBirth }));
      dispatch(updateUserInfo({ sex, height, weight, yearOfBirth }));
      navigation.navigate("Settings");
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
        <TopHeader>Update Information</TopHeader>
        <View style={{ alignItems: "center" }}>
          <SegmentedButtons
            value={sex}
            onValueChange={setSex}
            style={{ width: "100%", marginTop: 20, marginBottom: 40 }}
            buttons={[
              {
                value: "male",
                label: "Male",
                icon: sex === "male" ? "check" : null,
              },
              {
                value: "female",
                label: "Female",
                icon: sex === "female" ? "check" : null,
              },
            ]}
          />
          <TextInput
            mode="outlined"
            value={height}
            onChangeText={setHeight}
            error={isError}
            label="Height (cm)"
            placeholder="Height (cm)"
            style={{ width: "100%", marginBottom: 20 }}
          />
          <TextInput
            mode="outlined"
            value={weight}
            onChangeText={setWeight}
            error={isError}
            placeholder="Weight (kg)"
            label="Weight (kg)"
            style={{ width: "100%", marginBottom: 20 }}
          />
          <TextInput
            mode="outlined"
            value={yearOfBirth}
            onChangeText={setYearOfBirth}
            error={isError}
            placeholder="Year of Birth"
            label="Year of Birth"
            style={{ width: "100%", marginBottom: 20 }}
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
    </SafeAreaView>
  );
};
