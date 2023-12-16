import {
  MD3DarkTheme, MD3Theme,
} from 'react-native-paper';

const QuantumFitDarkScheme = {
  "colors": {
    "primary": "rgb(206, 189, 255)",
    "onPrimary": "rgb(57, 5, 144)",
    "primaryContainer": "rgb(80, 43, 167)",
    "onPrimaryContainer": "rgb(232, 221, 255)",
    "secondary": "rgb(99, 211, 255)",
    "onSecondary": "rgb(0, 53, 69)",
    "secondaryContainer": "rgb(0, 77, 99)",
    "onSecondaryContainer": "rgb(188, 233, 255)",
    "tertiary": "rgb(187, 195, 255)",
    "onTertiary": "rgb(17, 34, 134)",
    "tertiaryContainer": "rgb(45, 60, 156)",
    "onTertiaryContainer": "rgb(223, 224, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(28, 27, 30)",
    "onBackground": "rgb(230, 225, 230)",
    "surface": "rgb(28, 27, 30)",
    "onSurface": "rgb(230, 225, 230)",
    "surfaceVariant": "rgb(72, 69, 78)",
    "onSurfaceVariant": "rgb(202, 196, 207)",
    "outline": "rgb(148, 143, 153)",
    "outlineVariant": "rgb(72, 69, 78)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(230, 225, 230)",
    "inverseOnSurface": "rgb(49, 48, 51)",
    "inversePrimary": "rgb(104, 71, 192)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(37, 35, 41)",
      "level2": "rgb(42, 40, 48)",
      "level3": "rgb(48, 45, 55)",
      "level4": "rgb(49, 46, 57)",
      "level5": "rgb(53, 50, 62)"
    },
    "surfaceDisabled": "rgba(230, 225, 230, 0.12)",
    "onSurfaceDisabled": "rgba(230, 225, 230, 0.38)",
    "backdrop": "rgba(50, 47, 56, 0.4)"
  }
}

export default {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...QuantumFitDarkScheme.colors },
} as MD3Theme;