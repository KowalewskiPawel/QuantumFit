import React from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, CameraPermissionScreen } from "./screens";
import { withTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

const MainScreen = ({ theme }) => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="CameraPermission"
          component={CameraPermissionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const Main = withTheme(MainScreen);
