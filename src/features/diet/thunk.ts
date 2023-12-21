import { db, doc, getDoc, setDoc } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectAuthState } from "../auth";
import { setDietState, setPreviousDietState } from "./slice";

export const updateDietInfo =
  (updatedFields): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setDietState({ loading: true, errorMessage: null }));
    const rootState = getState();
    const authStore = selectAuthState(rootState);

    try {
      await setDoc(doc(db, "dietPreferences", authStore.uid), updatedFields, {
        merge: true,
      });

      dispatch(setDietState({ loading: false }));
    } catch (error) {
      dispatch(setDietState({ loading: false, errorMessage: error }));
    }
  };

export const loadDietInfo = (): AppThunk => async (dispatch, getState) => {
  dispatch(setDietState({ loading: true, errorMessage: null }));
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
          loading: false,
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
    dispatch(setDietState({ loading: false, errorMessage: error.message }));
  }
};
