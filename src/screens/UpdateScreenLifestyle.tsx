import { useState } from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { CustomCard, StackRow, TopHeader } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectUserState, updateUserInfo } from "../features/user";
import { setUserState } from "../features/user/slice";
import { LIFESTYLES } from "../consts/lifestyles";

export const UpdateScreenLifestyle = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const [selectedLifestyle, setSelectedLifestyle] = useState(
    userState.lifestyle || ""
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!selectedLifestyle) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(setUserState({ lifestyle: selectedLifestyle }));
      dispatch(updateUserInfo({ lifestyle: selectedLifestyle }));
      navigation.navigate("UpdateAim");
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <ScrollView>
        <TopHeader>
          Update Lifestyle
        </TopHeader>
        <View style={{ flexDirection: "column", rowGap: 20 }}>
          {LIFESTYLES.map((lifestyle) => (
            <CustomCard
              key={lifestyle.title}
              title={lifestyle.title}
              content={lifestyle.content}
              icon={lifestyle.icon}
              onPress={setSelectedLifestyle}
              selected={selectedLifestyle === lifestyle.title}
            />
          ))}
        </View>
        <StackRow style={{ marginVertical: 20, columnGap: 20, justifyContent: "center" }}>
          <Button
            icon="arrow-left"
            mode="outlined"
            onPress={() => navigation.goBack()}
          >
            Go Back
          </Button>
          <Button
            mode="contained"
            onPress={validateRegistration}
          >
            Continue
          </Button>
        </StackRow>
        <Portal>
          <Dialog
            visible={isError}
            onDismiss={() => setIsError(false)}
            style={{
              backgroundColor: theme.colors.primaryContainer,
            }}
          >
            <Dialog.Title>Please Select Lifestyle</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: theme.colors.onBackground }}>
                Please select lifestyle that describes yours best, and then
                click "continue".
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor={theme.colors.onBackground} onPress={() => setIsError(false)}>
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};
