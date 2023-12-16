import React from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import { styles } from "../styles/globalStyles";

export const EntryScreen = ({ navigation }) => {
  const theme = useTheme();
  const LogoEntry = require('../assets/logoEntry.png');

  return (
    <SafeAreaView style={{ ...styles.container }}>
        <View>
          <View style={styles.textBackground}>
            <Text style={{ ...styles.title, color: theme.colors.onBackground }}>QuantumFit</Text>
            <Image source={LogoEntry} style={{ width: 200, height: 200 }} />
          </View>
              <Button
                icon="account-key"
                mode="contained"
                style={{ marginTop: 20, backgroundColor: theme.colors.primary }}
                onPress={() => navigation.navigate('Login')}
              >
                Log in
              </Button>
              <Button
                icon="account-plus"
                mode="contained"
                style={{ marginTop: 20, marginBottom: 20, backgroundColor: theme.colors.primary }}
                onPress={() => navigation.navigate('RegisterEntry')}
              >
                Sign up
              </Button>
        </View>
    </SafeAreaView>
  );
};