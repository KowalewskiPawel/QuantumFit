import type { RootState } from "../../app/store";

export type DietState = {
  meat: boolean;
  fish: boolean;
  dairy: boolean;
  peanuts: boolean;
  mushrooms: boolean;
  shellfish: boolean;
  vegan: boolean;
  vegetarian: boolean;
  gluten: boolean;
  soybeans: boolean;
  loading: boolean;
  errorMessage: string | null;
};

export const selectDietState = (state: RootState) => state.dietPreferences;
export const selectPreviousDietState = (state: RootState) =>
  state.previousDietPreferences;
