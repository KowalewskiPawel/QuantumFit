import React from "react";
import { PaperProvider } from "react-native-paper";
import { Main } from "./src/Main";
import { CombinedDarkTheme } from "./src/themes";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./src/app/store";

export default function App() {
  // Disable Light/Dark Mode for now
  // const colorScheme = useColorScheme();
  // const appTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <StoreProvider store={store}>
        <Main />
      </StoreProvider>
    </PaperProvider>
  );
}
