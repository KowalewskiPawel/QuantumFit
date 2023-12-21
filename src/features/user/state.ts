import type { RootState } from "../../app/store";

export type UserState = {
  username: string | null;
  email: string | null;
  sex: string | null;
  height: number | null;
  weight: number | null;
  yearOfBirth: number | null;
  lifestyle: string | null;
  aim: string | null;
  exerciseFrequency: number | null;
  photos: string[] | null;
  gymExperience: number | null;
  currentBodyFat: number | null;
  targetBodyFat: number | null;
  targetWeight: number | null;
  bodyPartsThatNeedImprovement: string[] | null;
  loading: boolean;
  errorMessage: string | null;
  bodyAnalysis: any | null;
};

export const selectUserState = (state: RootState) => state.user;
