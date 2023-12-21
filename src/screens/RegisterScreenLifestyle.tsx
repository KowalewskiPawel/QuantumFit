import { useState } from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";
import { CustomCard, StackRow } from "../components";
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
      <ScrollView style={{ width: 400 }}>
        <View style={{ ...styles.container }}>
          <View style={styles.textBackground}>
            <Text style={{ ...styles.title, color: theme.colors.onBackground }}>
              Your Lifestyle
            </Text>
          </View>
          <View style={{ display: "flex", alignItems: "center" }}>
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
            <StackRow>
              <Button
                icon="arrow-left"
                mode="contained"
                onPress={() => navigation.goBack()}
                style={{ marginTop: 20, marginBottom: 20, marginRight: 10 }}
              >
                Previous
              </Button>
              <Button
                mode="contained"
                style={{ marginTop: 20, marginBottom: 20 }}
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
                <Text style={{ color: "#FFF" }}>
                  Please select lifestyle that describes yours best, and then
                  click "continue".
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button textColor="#FFF" onPress={() => setIsError(false)}>
                  OK
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
