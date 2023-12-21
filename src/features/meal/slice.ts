import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MealState } from "./state";

const initialState = [];

export const mealSlice = createSlice({
  name: "mealPlans",
  initialState,
  reducers: {
    setMealState(state, action: PayloadAction<Partial<MealState>>) {
      Object.assign(state, action.payload);
    },
    resetMealState(_state) {
      return initialState;
    },
  },
});

export const { resetMealState, setMealState } = mealSlice.actions;
