import { db, doc, getDoc, setDoc, updateDoc } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectAuthState } from "../auth";
import { setUserState } from "./slice";
import { arrayUnion } from "@firebase/firestore";

export const loadUserInfo = (): AppThunk => async (dispatch, getState) => {
  dispatch(setUserState({ loading: true, errorMessage: null }));
  const rootState = getState();
  const authStore = selectAuthState(rootState);

  try {
    const docRef = doc(db, "users", authStore.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {
        aim,
        exerciseFrequency,
        height,
        lifestyle,
        gymExperience,
        photos,
        sex,
        username,
        weight,
        yearOfBirth,
      } = docSnap.data();

      dispatch(
        setUserState({
          aim,
          exerciseFrequency,
          height,
          lifestyle,
          sex,
          username,
          weight,
          yearOfBirth,
          photos,
          gymExperience,
          loading: false,
        })
      );
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    let msg = error.message;
    if (msg.includes("invalid-credentials")) {
      msg = "Invalid email or password";
    }
    dispatch(setUserState({ loading: false, errorMessage: msg }));
  }
};

export const updateUserInfo = (key: string, value: any): AppThunk => async (dispatch, getState) => {
  dispatch(setUserState({ loading: true, errorMessage: null }));
  const rootState = getState();
  const authStore = selectAuthState(rootState);

  try {
    const userDocRef = doc(db, "users", authStore.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      console.log(authStore.uid);
      if (Array.isArray(value)) {
        value = arrayUnion(...value)
      }
      console.log(value);
      await updateDoc(userDocRef, { [key]: value })
      console.log("DOC SHOULD BE UPDATED");
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    let msg = error.message;
    dispatch(setUserState({ loading: false, errorMessage: msg }));
  }
};
