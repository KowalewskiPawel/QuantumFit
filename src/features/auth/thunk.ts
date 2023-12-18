import { signOut } from "firebase/auth";
import { setSessionState } from "./slice";
import { auth, signInWithEmailAndPassword } from "../../firebase/firebase-config";
import { resetRegisterState } from "../register/slice";

export const loginUser = (username: string, password: string) => async (dispatch: any) => {
  dispatch(setSessionState({ loading: true, error: null }));
  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    dispatch(
      setSessionState({
        token: idToken, 
        username: user.email,
        uid: user.uid,
        loginTime: Date.now(),
        loading: false,
        error: null,
      })
    );
  } catch (error) {
    let msg = error.message;
    if (msg.includes('invalid-credentials')) {
      msg = "Invalid email or password";
    }
    dispatch(setSessionState({ loading: false, error: msg }));
  }
};

export const logoutUser = () => async (dispatch) => {
  signOut(auth);
  dispatch(resetRegisterState());
  dispatch(setSessionState({ token: null, username: null, loginTime: null, loading: false, error: null }));
};
