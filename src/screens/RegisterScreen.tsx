import { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { Button, useTheme, TextInput } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { StackRow } from "../components";

export const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (password !== passwordRepeat || !username || !email || !password) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }


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
            value={username}
            onChangeText={setUsername}
            error={isError}
            placeholder="Username"
            style={{ width: "100%", marginBottom: 20 }}
          />
          <TextInput
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            error={isError}
            placeholder="Email"
            style={{ width: "100%", marginBottom: 20 }}
          />
          <TextInput
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            error={isError}
            placeholder="Password"
            secureTextEntry
            style={{ width: "100%", marginBottom: 20 }}
          />
          <TextInput
            mode="outlined"
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
