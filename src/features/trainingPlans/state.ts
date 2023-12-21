import { DocumentReference } from 'firebase/firestore';
import type { RootState } from '../../app/store';

type DailyTrainingPlan = {
  dayNumber: number,
  excercises: {
     excerciseName: string,
     escerciseDescription: string,
     numberOfReps: string,
     numberOfSets: string,
     brakesBetweenSets: string
     excerciseDuration: string
  }
 }

type TraningPlan = {
  planDuration: number, 
  tips: string,
  dailyPlans: DailyTrainingPlan[]
  user: DocumentReference,
  docId: string
}

export interface TraingPlansState {
  trainingPlans: TraningPlan[]
}

export const selectTrainingPlansState = (state: RootState) => state.trainingPlans;
