import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "./state";

const initialState = {
  username: null,
  email: null,
  sex: null,
  height: null,
  weight: null,
  yearOfBirth: null,
  lifestyle: null,
  aim: null,
  exerciseFrequency: null,
  photos: null,
  gymExperience: null,
  currentBodyFat: null,
  targetBodyFat: null,
  targetWeight: null,
  bodyPartsThatNeedImprovement: null,
  errorMessage: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
    resetUserState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUserState, resetUserState } = userSlice.actions;
