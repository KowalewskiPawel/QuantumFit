import React from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, CameraPermissionScreen, EntryScreen } from "./screens";
import { withTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

const MainScreen = ({ theme }) => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator initialRouteName="Entry" screenOptions={{ headerShown: false, gestureEnabled: false, animation: "none" }}>
        <Stack.Screen
          name="Entry"
          component={EntryScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="CameraPermission"
          component={CameraPermissionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const Main = withTheme(MainScreen);
