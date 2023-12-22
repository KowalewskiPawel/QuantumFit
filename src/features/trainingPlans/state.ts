import { DocumentReference } from 'firebase/firestore';
import type { RootState } from '../../app/store';

type DailyTrainingPlan = {
  dayNumber: number,
  exercises: {
     exerciseName: string,
     exerciseDescription: string,
     numberOfReps: string,
     numberOfSets: string,
     brakesBetweenSets: string
     exerciseDuration: string
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
