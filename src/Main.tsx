import React, { useEffect } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  LoginScreen,
  CameraPermissionScreen,
} from "./screens";
import { useAppDispatch, useAppSelector } from "./app/store";
import { selectAuthState, logoutUser } from "./features/auth";
import { withTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

const MainScreen = ({ theme }) => {
  const dispatch = useAppDispatch();
  const { token, loginTime } = useAppSelector(selectAuthState);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (!token && !loginTime) return;

    const didOneHourPass = Date.now() - loginTime > 3600000;
    if (didOneHourPass) {
      // logout user if one hour has passed since login
      // and navigate to login screen
      dispatch(logoutUser());
      navigationRef.navigate("Login" as never);
    }
  }, [token, loginTime]);

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          // options={{ headerShown: false }}
          name="Login" component={LoginScreen} />
        <Stack.Screen
          // options={{ headerShown: false }}
          name="CameraPermission"
          component={CameraPermissionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const Main = withTheme(MainScreen);