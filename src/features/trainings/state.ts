import type { RootState } from "../../app/store";

type Training = {
  training: string;
  name: string;
  description: string;
  reps: number;
  sets: number;
  weight: number;
};

export interface TrainingsState {
  trainingSummary: string;
  trainings: Training[];
  loading: boolean;
  errorMessage: string | null;
}

export const selectTrainingsState = (state: RootState) => state.trainingPlans;
