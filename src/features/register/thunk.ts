import { setRegisterState } from "./slice";
import { auth, createUserWithEmailAndPassword } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectRegisterState } from "./state";

export const registerUser = (): AppThunk => async (dispatch, getState) => {
  dispatch(setRegisterState({ loading: true }));
  const rootState = getState();
  const registerStore = selectRegisterState(rootState);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, registerStore.email, registerStore.password);
    console.log("userCredential", userCredential);
    debugger;
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    const { uid } = user;

    // dispatch(
    //   setRegisterState({
    //     token: idToken, 
    //     username: user.email,
    //     loginTime: Date.now(),
    //     loading: false,
    //     error: null,
    //   })
    // );
  } catch (error) {
    let msg = error.message;
    if (msg.includes('invalid-credentials')) {
      msg = "Invalid email or password";
    }
    dispatch(setRegisterState({ loading: false, errorMessage: msg }));
  }
};