import { db, doc, getDoc, setDoc } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectAuthState } from "../auth";
import { setMealState } from "./slice";

export const updateMealInfo =
  (updatedFields): AppThunk =>
  async (dispatch, getState) => {
    const rootState = getState();
    const authStore = selectAuthState(rootState);

    try {
      await setDoc(doc(db, "mealPlans", authStore.uid), updatedFields, {
        merge: true,
      });

    } catch (error) {
      console.error(error);
    }
  };

export const loadMealInfo = (): AppThunk => async (dispatch, getState) => {
  const rootState = getState();
  const authStore = selectAuthState(rootState);

  try {
    const docRef = doc(db, "mealPlans", authStore.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { mealPlan } = docSnap.data();

      const dietPlans = JSON.parse(mealPlan);

      dispatch(setMealState(dietPlans));
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error(error);
  }
};
