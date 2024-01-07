import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Image } from "expo-image"
import {
  Button,
  useTheme,
  TextInput,
  Checkbox,
  ActivityIndicator,
} from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectAuthState, loginUser } from "../features/auth";
import { styles } from "../styles/globalStyles";
import { StackRow, TopHeader } from "../components";
import { loadUserInfo } from "../features/user";
import { loadMealInfo } from "../features/meal";
import { loadDietInfo } from "../features/diet";
import { loadTrainingsInfo } from "../features/trainings";

export const LoginScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUser, setRememberUser] = useState(true);
  const { token, loading, error } = useAppSelector(selectAuthState);
  const theme = useTheme();
  const LogoEntry = require("../assets/logoEntry.png");

  const sendLoginRequest = () => {
    dispatch(loginUser(email, password));
  };

  useEffect(() => {
    if (token) {
      dispatch(loadUserInfo());
      dispatch(loadMealInfo());
      dispatch(loadDietInfo());
      dispatch(loadTrainingsInfo());
      navigation.navigate("MainMenu");
    }
  }, [token]);

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TopHeader variant="headlineLarge">Sign in to your account</TopHeader>
      <View style={{ flex: 1, alignItems: "center", width: "100%", height: 200 }}>
        <Image contentFit="contain" source={LogoEntry} style={{ width: 200, height: 200 }} />
      </View>
      <View style={{ flex: 2 }}>
        <TextInput
          mode="outlined"
          label="Email"
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
          label="Password"
          placeholderTextColor={theme.colors.outline}
          secureTextEntry
          style={{ width: "100%", marginBottom: 20 }}
        />
        <StackRow>
          <Checkbox
            status={rememberUser ? "checked" : "unchecked"}
            color={theme.colors.onBackground}
            onPress={() => {
              setRememberUser(!rememberUser);
            }}
          />
          <Text style={{ color: theme.colors.onBackground, alignSelf: "center" }}>
            Remember me
          </Text>
        </StackRow>
        {error && (
          <Text style={{ color: theme.colors.error, alignSelf: "center" }}>
            {error}
          </Text>
        )}
        <StackRow style={{ marginVertical: 20, columnGap: 20, justifyContent: "center" }}>
          <Button
            icon="arrow-left"
            mode="outlined"
            onPress={() => navigation.goBack()}
          >
            Go back
          </Button>
          <Button
            icon="account-key"
            mode="contained"
            disabled={loading}
            onPress={sendLoginRequest}
            loading={loading}
          >
            {loading ? "Loading..." : "Sign in"}
          </Button>
        </StackRow>
      </View>
    </SafeAreaView>
  );
};
