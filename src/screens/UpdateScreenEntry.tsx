import React, { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Button, useTheme, TextInput } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { StackRow } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectUserState, updateUserInfo } from "../features/user";
import { setUserState } from "../features/user/slice";

export const UpdateScreenEntry = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const [username, setUsername] = useState(userState.username || "");
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!username) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(setUserState({ username }));
      dispatch(updateUserInfo({ username }));
      navigation.navigate("UpdateBody");
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View>
        <View style={styles.textBackground}>
          <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
            Update Information
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <TextInput
            mode="outlined"
            label="Username"
            value={username}
            onChangeText={setUsername}
            error={isError}
            placeholder="Username"
            style={{ width: "100%", marginBottom: 20 }}
          />
          <StackRow>
            <Button
              icon="arrow-left"
              mode="contained"
              onPress={() => navigation.goBack()}
              style={{ marginVertical: 20, marginRight: 10 }}
            >
              Go back
            </Button>
            <Button
              mode="contained"
              onPress={validateRegistration}
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              Continue
            </Button>
          </StackRow>
        </View>
      </View>
    </SafeAreaView>
  );
};
