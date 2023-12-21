import { db, doc, getDoc, setDoc } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectAuthState } from "../auth";
import { setUserState } from "./slice";

export const updateUserInfo =
  (updatedFields): AppThunk =>
    async (dispatch, getState) => {
      dispatch(setUserState({ loading: true, errorMessage: null }));
      const rootState = getState();
      const authStore = selectAuthState(rootState);
      try {
        await setDoc(doc(db, "users", authStore.uid), updatedFields, {
          merge: true,
        });

        dispatch(setUserState({ loading: false }));
      } catch (error) {
        dispatch(setUserState({ loading: false, errorMessage: error }));
      }
    };

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
        currentBodyFat,
        targetBodyFat,
        targetWeight,
        bodyPartsThatNeedImprovement,
        bodyAnalysis
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
          currentBodyFat,
          targetBodyFat,
          targetWeight,
          bodyAnalysis,
          bodyPartsThatNeedImprovement,
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