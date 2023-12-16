import QuantumFitLightScheme from "./QuantumFitLightScheme";
import QuantumFitDarkScheme from "./QuantumFitDarkScheme";

import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
  } from '@react-navigation/native';
  import {
    MD3DarkTheme,
    MD3LightTheme,
    adaptNavigationTheme,
  } from 'react-native-paper';
  
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  
  export const CombinedLightTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
      ...QuantumFitLightScheme.colors
    },
  };
  export const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
      ...QuantumFitDarkScheme.colors
    },
  };

