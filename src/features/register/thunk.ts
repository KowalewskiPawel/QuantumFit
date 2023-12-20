import { resetRegisterState, setRegisterState } from "./slice";
import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  updateDoc
} from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectRegisterState } from "./state";
import { setSessionState } from "../auth/slice";

export const registerUser = (): AppThunk => async (dispatch, getState) => {
  dispatch(setRegisterState({ loading: true, errorMessage: null }));
  const rootState = getState();
  const registerStore = selectRegisterState(rootState);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registerStore.email,
      registerStore.password
    );
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    const { uid } = user;

    await setDoc(doc(db, "users", uid), {
      aim: registerStore.aim,
      exerciseFrequency: registerStore.exerciseFrequency,
      sex: registerStore.sex,
      weight: registerStore.weight,
      height: registerStore.height,
      yearOfBirth: registerStore.yearOfBirth,
      username: registerStore.username,
      photos: [],
      lifestyle: registerStore.lifestyle,
      gymExperience: registerStore.gymExperience,
      currentBodyFat: null,
      targetBodyFat: null,
      targetWeight: null,
      bodyPartsThatNeedImprovement: [],
    });

    dispatch(
      setRegisterState({ isRegistrationSuccessful: true, loading: false })
    );
    dispatch(
      setSessionState({
        token: idToken,
        username: user.email,
        uid,
        loginTime: Date.now(),
        loading: false,
        error: null,
      })
    );
  } catch (error) {
    let msg = error.message;
    if (msg.includes("invalid-credentials")) {
      msg = "Invalid email or password";
    }
    dispatch(setRegisterState({ loading: false, errorMessage: msg }));
  }
};