import { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, useTheme, TextInput } from "react-native-paper";
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
    <SafeAreaView style={{ ...styles.container }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <View style={styles.textBackground}>
            <Text style={{ ...styles.title, color: theme.colors.onBackground }}>QuantumFit</Text>
          </View>
          {!loading ? (
            <View>
              <TextInput
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#cccccc"
                style={{ width: "100%", marginBottom: 20 }}
              />
              <TextInput
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#cccccc"
                secureTextEntry
                style={{ width: "100%", marginBottom: 20 }}
              />
              <Button
                icon="account-key"
                mode="contained"
                onPress={sendLoginRequest}
                style={{ marginTop: 20, marginBottom: 20 }}
              >
                Login
              </Button>
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};