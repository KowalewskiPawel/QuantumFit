import { useState } from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { CustomCard, StackRow, TopHeader } from "../components";
import { useAppDispatch, useAppSelector } from "../app/store";
import { selectRegisterState } from "../features/register";
import { setRegisterState } from "../features/register/slice";
import { LIFESTYLES } from "../consts/lifestyles";

export const RegisterScreenLifestyle = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const registerStore = useAppSelector(selectRegisterState);
  const [selectedLifestyle, setSelectedLifestyle] = useState(
    registerStore.lifestyle || ""
  );
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  const validateRegistration = () => {
    if (!selectedLifestyle) {
      setIsError(true);
    } else {
      setIsError(false);
      dispatch(setRegisterState({ lifestyle: selectedLifestyle }));
      navigation.navigate("RegisterAim");
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <ScrollView>
        <TopHeader>Your Lifestyle</TopHeader>
        <View style={{ display: "flex", flexDirection: 'column', rowGap: 20 }}>
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
          <StackRow style={{ marginVertical: 20, columnGap: 20, justifyContent: "center" }}>
            <Button
              icon="arrow-left"
              mode="outlined"
              onPress={() => navigation.goBack()}
            >
              Previous
            </Button>
            <Button
              mode="contained"
              onPress={validateRegistration}
            >
              Continue
            </Button>
          </StackRow>
        </View>
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
                click "Continue".
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
