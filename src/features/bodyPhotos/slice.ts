import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BodyPhotosState } from "./state";

const initialState = [];

export const bodyPhotosSlice = createSlice({
  name: "bodyPhotos",
  initialState,
  reducers: {
    setBodyPhotosState(state, action: PayloadAction<Partial<BodyPhotosState>>) {
      return [...state, ...action.payload];
    },
    resetBodyPhotosState() {
      return [];
    },
  },
});

export const { setBodyPhotosState, resetBodyPhotosState } = bodyPhotosSlice.actions;
