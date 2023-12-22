import { db, doc, getDoc, setDoc } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectAuthState } from "../auth";
import { setTrainingsState } from "./slice";

export const updateTrainingsInfo =
  (updatedFields): AppThunk =>
  async (dispatch, getState) => {
    const rootState = getState();
    const authStore = selectAuthState(rootState);

    try {
      await setDoc(doc(db, "trainingPlans", authStore.uid), updatedFields, {
        merge: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const loadTrainingsInfo = (): AppThunk => async (dispatch, getState) => {
  const rootState = getState();
  const authStore = selectAuthState(rootState);

  try {
    const docRef = doc(db, "trainingPlans", authStore.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { trainingPlan } = docSnap.data();

      const parsedPlans = JSON.parse(trainingPlan);

      dispatch(setTrainingsState(parsedPlans));
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error(error);
  }
};
