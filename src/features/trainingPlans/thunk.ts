import { addDoc, collection, db, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectAuthState } from "../auth";
import { setTrainingPlansState } from "./slice";
import { selectTrainingPlansState } from "./state";

export const createTrainingPlan =
  (planData): AppThunk =>
    async (dispatch, getState) => {
      const rootState = getState();
      const authStore = selectAuthState(rootState);
      const traingPlansStore = selectTrainingPlansState(rootState);

      console.log('SAVE_PLAN_TO_DATABASE');
      const userDocRef = doc(db, "users", authStore.uid);
      const trainingsRef = collection(db, "trainingPlans");

      const planDataToUpload = {
        ...planData,
        createdAt: serverTimestamp(),
        user: userDocRef
      }

      try {
        const newPlan = await addDoc(trainingsRef, planDataToUpload);
        const newPlanDoc = await getDoc(newPlan);
        const plansState = { trainingPlans: [...traingPlansStore.trainingPlans] }
        if (newPlanDoc.exists()) {
          plansState.trainingPlans.push(newPlanDoc)
          dispatch(setTrainingPlansState(plansState))
        }
      } catch (error) {
        console.error(error);
      }
    };

export const updateTrainingPlans =
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

export const loadTrainingPlans = (): AppThunk => async (dispatch, getState) => {
  const rootState = getState();
  const authStore = selectAuthState(rootState);

  try {
    const userDocRef = doc(db, "users", authStore.uid);
    const trainingsRef = collection(db, "trainingPlans");

    const plansQuery = await query(trainingsRef, where('user', '==', userDocRef))
    const plansSnapshot = await getDocs(plansQuery);

    if (plansSnapshot.docs?.length) {
      dispatch(setTrainingPlansState({ trainingPlans: plansSnapshot.docs }));
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error(error);
  }
};
