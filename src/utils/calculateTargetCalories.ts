export const calculateTargetCalories = (
  weight: number,
  height: number,
  age: number,
  sex: string,
  goal: string
) => {
  let maintenanceCalories: number;
  if (sex === "male") {
    maintenanceCalories = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    maintenanceCalories = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  if (goal.includes("lose")) {
    maintenanceCalories = maintenanceCalories + 500;
  } else if (goal.includes("gain")) {
    maintenanceCalories = maintenanceCalories - 500;
  }

  return Math.round(maintenanceCalories);
};
