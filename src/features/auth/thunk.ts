import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSessionState } from "./slice";
import { auth, signInWithEmailAndPassword } from "../../firebase/firebase-config";

export const loginUser = (username, password) => async (dispatch) => {
  dispatch(setSessionState({ loading: true }));
  try {
    const { user } = await signInWithEmailAndPassword(auth, username, password);
    console.log({ user })

    dispatch(
      setSessionState({
        user, 
        loginTime: Date.now(),
        loading: false,
        error: null,
      })
    );
  } catch (error) {
    let msg = error.message;
    if (msg.includes('invalid-credentials')) {
      msg = "Invalid email or pasword"
    }
    dispatch(setSessionState({ loading: false, error: msg }));
  }
};

export const logoutUser = () => async (dispatch) => {
  await AsyncStorage.removeItem("userToken");
  dispatch(setSessionState({ token: null, username: null, loginTime: null, loading: false, error: null }));
};
