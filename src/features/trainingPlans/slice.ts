import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TraingPlansState } from "./state";

const initialState = {
  trainingPlans: []
};

export const trainingPlansSlice = createSlice({
  name: "trainingPlans",
  initialState,
  reducers: {
    setTrainingPlansState(state, action: PayloadAction<Partial<TraingPlansState>>) {
      Object.assign(state, action.payload);
    },
    resetTrainingPlansState(_state) {
      return initialState;
    },
  },
});

export const { resetTrainingPlansState, setTrainingPlansState } = trainingPlansSlice.actions;
