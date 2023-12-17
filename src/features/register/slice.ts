import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RegisterState } from "./state";

const initialState = {
  username: null,
  email: null,
  password: null,
  sex: null,
  isRegistrationSuccessful: null,
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

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterState(state, action: PayloadAction<Partial<RegisterState>>) {
      Object.assign(state, action.payload);
    },
    resetRegisterState(state) {
      state = initialState;
    },
  },
});

export const { setRegisterState, resetRegisterState } = registerSlice.actions;
