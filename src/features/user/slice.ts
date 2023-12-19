import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "./state";

const initialState = {
  username: null,
  email: null,
  sex: null,
  height: null,
  weight: null,
  yearOfBirth: null,
  lifeStyle: null,
  aim: null,
  exerciseFrequency: null,
  photos: null,
  gymExperience: null,
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
      state = initialState;
    },
  },
});

export const { setUserState, resetUserState } = userSlice.actions;
