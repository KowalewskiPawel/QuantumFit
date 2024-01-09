export const generateCaloriesComment = (
  targetCalories: number,
  caloriesProgress: number,
  currentBodyFat: number,
  weight: number
) => `Please give a short and concise comment on my daily progress.
My daily goal is to burn ${targetCalories} kcal.
The current time is ${new Date().toLocaleTimeString()}
My current progress is ${Math.round(caloriesProgress * targetCalories)} kcal.
My current body fat percentage is ${currentBodyFat}%.
My current body mass is ${weight} kg.
`;
