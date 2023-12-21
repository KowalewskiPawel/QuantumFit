
import React from "react";
import { View } from "react-native";

export const StackRow = ({ children, style = {} }) => <View style={{ display: "flex", flexDirection: "row", ...style }}>{children}</View>;