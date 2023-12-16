import React, { useCallback } from "react";
import { PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Main } from "./src/Main";
import { CombinedDarkTheme } from "./src/themes";
import { store } from "./src/app/store";
import { View } from "react-native";

export default function App() {
  // Disable Light/Dark Mode for now
  // const colorScheme = useColorScheme();
  // const appTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  const [fontsLoaded] = useFonts({
    "Roboto-Black": require("./src/assets/fonts/Roboto-Black.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <StoreProvider store={store}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Main />
        </View>
      </StoreProvider>
    </PaperProvider>
  );
}
