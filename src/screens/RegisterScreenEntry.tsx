import { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, useTheme, TextInput } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { StackRow, TopHeader } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectRegisterState } from "../features/register";
import { setRegisterState } from "../features/register/slice";

export const RegisterScreenEntry = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const registerStore = useAppSelector(selectRegisterState);
  const [username, setUsername] = useState(registerStore.username || "");
  const [email, setEmail] = useState(registerStore.email || "");
  const [password, setPassword] = useState(registerStore.password || "");
  const [passwordRepeat, setPasswordRepeat] = useState(
    registerStore.password || ""
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (password !== passwordRepeat || !username || !email || !password) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(setRegisterState({ username, email, password }));
      navigation.navigate("RegisterBody");
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader>Registration</TopHeader>
      <TextInput
        mode="outlined"
        label="Username"
        value={username}
        onChangeText={setUsername}
        error={isError}
        placeholder="Username"
        style={{ width: "100%", marginBottom: 20 }}
      />
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={isError}
        placeholder="Email"
        style={{ width: "100%", marginBottom: 20 }}
      />
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={isError}
        placeholder="Password"
        secureTextEntry
        style={{ width: "100%", marginBottom: 20 }}
      />
      <TextInput
        mode="outlined"
        label="Confirm Password"
        value={passwordRepeat}
        onChangeText={setPasswordRepeat}
        error={isError}
        placeholder="Confirm Password"
        secureTextEntry
        style={{ width: "100%", marginBottom: 20 }}
      />
      <StackRow style={{ marginVertical: 20, columnGap: 20, justifyContent: "center" }}>
        <Button
          icon="arrow-left"
          mode="outlined"
          onPress={() => navigation.goBack()}
        >
          Go back
        </Button>
        <Button
          mode="contained"
          onPress={validateRegistration}
        >
          Continue
        </Button>
      </StackRow>
    </SafeAreaView>
  );
};
