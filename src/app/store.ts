import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authSlice } from "../features/auth";
import { registerSlice } from "../features/register";
import { userSlice } from "../features/user/slice";
import { dietSlice, previousDietSlice } from "../features/diet";
import { mealSlice } from "../features/meal";
import { bodyPhotosSlice } from "../features/bodyPhotos";
import { trainingsSlice } from "../features/trainings";

export const storeOptions = {
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [registerSlice.name]: registerSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [dietSlice.name]: dietSlice.reducer,
    [previousDietSlice.name]: previousDietSlice.reducer,
    [mealSlice.name]: mealSlice.reducer,
    [bodyPhotosSlice.name]: bodyPhotosSlice.reducer,
    [trainingsSlice.name]: trainingsSlice.reducer,
  },
};

export const store = configureStore(storeOptions);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
