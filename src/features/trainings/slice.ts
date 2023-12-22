import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TrainingsState } from "./state";

const initialState = [];

export const trainingsSlice = createSlice({
  name: "trainingPlans",
  initialState,
  reducers: {
    setTrainingsState(state, action: PayloadAction<Partial<TrainingsState>>) {
      Object.assign(state, action.payload);
    },
    resetTrainingsState(_state) {
      return initialState;
    },
  },
});

export const { setTrainingsState, resetTrainingsState } = trainingsSlice.actions;
