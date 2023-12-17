import React from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  LoginScreen,
  CameraPermissionScreen,
  EntryScreen,
  RegisterScreenEntry,
  RegisterScreenBody,
  RegisterScreenLifestyle,
  RegisterScreenAim,
  RegisterScreenSeniority,
  MainMenuScreen,
  BodyAnalyzeCameraScreen
} from "./screens";
import { withTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

const MainScreen = ({ theme }) => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="BodyAnalyzeCamera"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: "none",
        }}
      >
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterEntry" component={RegisterScreenEntry} />
        <Stack.Screen name="RegisterBody" component={RegisterScreenBody} />
        <Stack.Screen
          name="RegisterLifestyle"
          component={RegisterScreenLifestyle}
        />
        <Stack.Screen name="RegisterAim" component={RegisterScreenAim} />
        <Stack.Screen
          name="RegisterSeniority"
          component={RegisterScreenSeniority}
        />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen
          name="CameraPermission"
          component={CameraPermissionScreen}
        />
        <Stack.Screen
          name="BodyAnalyzeCamera"
          component={BodyAnalyzeCameraScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const Main = withTheme(MainScreen);
