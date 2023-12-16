import { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectAuthState, loginUser } from "../features/auth";
import { styles } from "../styles/globalStyles";

export const LoginScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, token, loginTime } = useAppSelector(selectAuthState);
  const theme = useTheme();

  const sendLoginRequest = () => {
    dispatch(loginUser(username, password));
  };

  useEffect(() => {
    if (!token && !loginTime) return;

    const didOneHourPass = Date.now() - loginTime > 3600000;

    if (token && !didOneHourPass) {
      navigation.navigate("PhotoAnalysis");
    }
  }, [token, loginTime]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.textBackground}>
              <Text style={styles.title}>QuantumFit</Text>
            </View>
            {!loading ? (
              <View>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#cccccc"
                  style={styles.input}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#cccccc"
                  secureTextEntry
                  style={styles.input}
                />
                <Button
                  icon="account-key"
                  mode="contained"
                  onPress={sendLoginRequest}
                  style={{ marginTop: 10 }}
                  buttonColor={theme.colors.primary}
                  textColor={theme.colors.onPrimary}
                >
                  Login
                </Button>
              </View>
            ) : (
              <Text>Loading...{/* TODO: Change to LoadingSpinner */}</Text>
            )}
          </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};