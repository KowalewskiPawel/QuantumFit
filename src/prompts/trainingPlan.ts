export const getTrainingPlanPrompt = (
    currentWeight: number,
    age: number,
    height: number,
    lifestyle: string,
    aim: string,
    sex: string,
    exerciseFrequency: number,
    gymExperience: number,
    bodyAnalysis: any
  ) => `
  Create a training plan based on the data provided next
  - goal for training: ${aim}
  - bodyFat: ${bodyAnalysis?.current.bodyFat || ''}
  - person height: ${height}
  - lifestyle: ${lifestyle}
  - gender: ${sex}
  - weight: ${currentWeight}
  - age: ${age}
  - train since: ${gymExperience} months
  - excercise frequency: ${exerciseFrequency} times a week
  
  give additional tips about excercises and description how to perform those excercises
  
  please return your answer in a form of .json file in form provided below
  "planDuration" cannot be bigger than excercise frequency 
  {
      "planDuration": "number of days", 
      "tips": "string",
      "dailyPlans": [
          {
           "dayNumber": "number",
           "excercises": {
              "excerciseName": "string",
              "escerciseDescription": "string",
              "numberOfReps": "string",
              "numberOfSets": "string",
              "brakesBetweenSets": "string"
              "excerciseDuration": "string"
           }
          }
      ]
  }
`
