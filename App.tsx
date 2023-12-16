import React from "react";
import { PaperProvider } from "react-native-paper";
import { Main } from "./src/Main";
import { CombinedLightTheme, CombinedDarkTheme } from "./src/themes";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./src/app/store";
import { useColorScheme } from "react-native";

export default function App() {
  const colorScheme = useColorScheme();
  const appTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <PaperProvider theme={appTheme}>
      <StoreProvider store={store}>
        <Main />
      </StoreProvider>
    </PaperProvider>
  );
}
