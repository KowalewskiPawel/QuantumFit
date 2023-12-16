import { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, useTheme, TextInput, SegmentedButtons } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { StackRow } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectRegisterState } from "../features/register";
import { setRegisterState } from "../features/register/slice";

export const RegisterScreenBody = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const registerStore = useAppSelector(selectRegisterState);
  const [sex, setSex] = useState(registerStore.sex || "male");
  const [height, setHeight] = useState(registerStore.height || "");
  const [weight, setWeight] = useState(registerStore.weight || "");
  const [yearOfBirth, setYearOfBirth] = useState(
    registerStore.yearOfBirth || ""
  );
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
      dispatch(setRegisterState({ sex, height, weight, yearOfBirth }));
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Registration
          </Text>
        </View>
        <View>
        <SegmentedButtons
        value={sex}
        onValueChange={setSex}
        style={{ marginTop: 20, marginBottom: 40 }}
        buttons={[
          {
            value: 'male',
            label: 'Male',
            icon: sex === 'male' ? 'check' : null
          },
          {
            value: 'female',
            label: 'Female',
            icon: sex === 'female' ? 'check' : null
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
              onPress={validateRegistration}
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              Continue
            </Button>
          </StackRow>
        </View>
      </View>
    </SafeAreaView>
  );
};
