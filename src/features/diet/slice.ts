import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DietState } from "./state";

const initialState = {
  meat: false,
  fish: false,
  dairy: false,
  peanuts: false,
  mushrooms: false,
  shellfish: false,
  vegan: false,
  vegetarian: false,
  gluten: false,
  soybeans: false,
  errorMessage: null,
  loading: false,
};

export const dietSlice = createSlice({
  name: "dietPreferences",
  initialState,
  reducers: {
    setDietState(state, action: PayloadAction<Partial<DietState>>) {
      Object.assign(state, action.payload);
    },
    resetDietState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const previousDietSlice = createSlice({
  name: "previousDietPreferences",
  initialState,
  reducers: {
    setPreviousDietState(state, action: PayloadAction<Partial<DietState>>) {
      Object.assign(state, action.payload);
    },
    resetPreviousDietState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { resetDietState, setDietState } = dietSlice.actions;
export const { resetPreviousDietState, setPreviousDietState } =
  previousDietSlice.actions;
