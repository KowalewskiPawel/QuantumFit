import React, { useState } from "react";
import { Text, View, Image, SafeAreaView } from "react-native";
import { Button, useTheme, TextInput, Checkbox } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectAuthState, loginUser } from "../features/auth";
import { styles } from "../styles/globalStyles";
import { LoadingSpinner, StackRow } from "../components";

export const LoginScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUser, setRememberUser] = useState(true);
  const { loading } = useAppSelector(selectAuthState);
  const theme = useTheme();
  const LogoEntry = require("../assets/logoEntry.png");

  const sendLoginRequest = () => {
    dispatch(loginUser(email, password));
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            QuantumFit
          </Text>
          <Image source={LogoEntry} style={{ width: 200, height: 200 }} />
        </View>
        {!loading ? (
          <View>
            <TextInput
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={theme.colors.outline}
              style={{ width: "100%", marginBottom: 20 }}
            />
            <TextInput
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={theme.colors.outline}
              secureTextEntry
              style={{ width: "100%", marginBottom: 20 }}
            />
            <StackRow>
              <Checkbox
                status={rememberUser ? "checked" : "unchecked"}
                color="#FFF"
                onPress={() => {
                  setRememberUser(!rememberUser);
                }}
              />
              <Text style={{ color: "#FFF", alignSelf: "center" }}>
                Remember me
              </Text>
            </StackRow>
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
                icon="account-key"
                mode="contained"
                onPress={sendLoginRequest}
                style={{ marginTop: 20, marginBottom: 20 }}
              >
                Sign in
              </Button>
            </StackRow>
          </View>
        ) : (
          <LoadingSpinner />
        )}
      </View>
    </SafeAreaView>
  );
};
