import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  size?: number;
  style?: any;
}
export const LoadingSpinner: React.FC<Props> = ({size = 40, style  }) => {
  const theme = useTheme()
  return (<View style={{...styles.container, ...style}}>
    <ActivityIndicator size={size} color={theme.colors.tertiary} />
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
