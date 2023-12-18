import { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, useTheme, TextInput } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { StackRow } from "../components";
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
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Registration
          </Text>
        </View>
        <View>
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
          <StackRow>
            <Button
              icon="arrow-left"
              mode="contained"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
            >
              Go back
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
