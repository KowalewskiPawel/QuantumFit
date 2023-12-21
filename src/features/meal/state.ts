import type { RootState } from "../../app/store";

type Meals = {
  meal: "breakfast" | "lunch" | "dinner" | "snacks";
  name: string;
  ingredients: string[];
};

export interface MealState {
  mealSummary: string;
  meals: Meals[];
  loading: boolean;
  errorMessage: string | null;
}

export const selectMealState = (state: RootState) => state.mealPlans;
