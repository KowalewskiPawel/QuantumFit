import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, Chip, useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setDietState } from "../features/diet/slice";
import { selectDietState, updateDietInfo } from "../features/diet";

import { styles } from "../styles/globalStyles";

export const DietAdjustmentScreen = ({ navigation }) => {
  const chipState = useAppSelector(selectDietState);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const filteredChipState = Object.fromEntries(
    Object.entries(chipState).filter(
      ([key]) => key !== "loading" && key !== "errorMessage"
    )
  );

  const handleChipPress = (name: string) => {
    dispatch(
      setDietState({
        ...filteredChipState,
        [name]: !filteredChipState[name],
      })
    );
    dispatch(
      updateDietInfo({
        ...filteredChipState,
        [name]: !filteredChipState[name],
      })
    );
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Diet Preferences
          </Text>
          <Text
            style={{
              ...styles.text,
              fontWeight: "normal",
              color: theme.colors.onBackground,
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 12,
              paddingBottom: 12,
              marginTop: 16,
              marginBottom: 6,
              textAlign: "center",
              backgroundColor: "#034c81",
            }}
          >
            Please select the options types that you do not eat!
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 30,
              marginBottom: 24,
              justifyContent: "space-around",
              rowGap: 16,
            }}
          >
            {Object.entries(filteredChipState).map(([name, isSelected]) => {
              return (
                <Chip
                  key={name}
                  mode={isSelected ? "flat" : "outlined"}
                  selected={isSelected}
                  showSelectedCheck={false}
                  showSelectedOverlay={true}
                  style={{ flexBasis: "40%", maxHeight: 40 }}
                  textStyle={{
                    textAlign: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onPress={() => handleChipPress(name)}
                >
                  {name}
                </Chip>
              );
            })}
          </View>
        </View>
        <Button
          icon="arrow-left"
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
        >
          Go back
        </Button>
      </View>
    </SafeAreaView>
  );
};
