import { db, doc, getDoc, setDoc } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectAuthState } from "../auth";
import { setDietState, setPreviousDietState } from "./slice";

export const updateDietInfo =
  (updatedFields): AppThunk =>
  async (_dispatch, getState) => {
    const rootState = getState();
    const authStore = selectAuthState(rootState);

    try {
      await setDoc(doc(db, "dietPreferences", authStore.uid), updatedFields, {
        merge: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const loadDietInfo = (): AppThunk => async (dispatch, getState) => {
  const rootState = getState();
  const authStore = selectAuthState(rootState);

  try {
    const docRef = doc(db, "dietPreferences", authStore.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {
        dairy,
        fish,
        gluten,
        meat,
        mushrooms,
        peanuts,
        shellfish,
        soybeans,
        vegan,
        vegetarian,
      } = docSnap.data();

      dispatch(
        setDietState({
          dairy,
          fish,
          gluten,
          meat,
          mushrooms,
          peanuts,
          shellfish,
          soybeans,
          vegan,
          vegetarian,
        })
      );

      dispatch(
        setPreviousDietState({
          dairy,
          fish,
          gluten,
          meat,
          mushrooms,
          peanuts,
          shellfish,
          soybeans,
          vegan,
          vegetarian,
        })
      );
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error(error.message);
  }
};
