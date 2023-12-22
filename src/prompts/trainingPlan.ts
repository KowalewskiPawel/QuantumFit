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
  - person's height: ${height}
  - lifestyle: ${lifestyle}
  - gender: ${sex}
  - weight: ${currentWeight}
  - age: ${age}
  - training since: ${gymExperience} months
  - exercise frequency: ${exerciseFrequency} times a week
  
  give additional tips about exercises and description how to perform those exercises
  
  please return your answer in a form of .json file in form provided below
  "planDuration" cannot be bigger than exercise frequency 
  {
      "planDuration": "number", 
      "tips": "string",
      "dailyPlans": [
          {
           "dayNumber": "number",
           "exercises": {
              "exerciseName": "string",
              "exerciseDescription": "string",
              "numberOfReps": "string",
              "numberOfSets": "string",
              "brakesBetweenSets": "string"
              "exerciseDuration": "string"
           }
          }
      ]
  }
`
