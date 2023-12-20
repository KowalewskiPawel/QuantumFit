import { LIFESTYLES } from "../consts/lifestyles";

const ExampleBodyAnalysisResponseFormat = `{
    current: {
        bodyFat: 20,
        weight: 80,
    },
    target: {
        bodyFat: 15,
        weight: 75,
    },
    additionalInfo: 'The biceps looks good, but the belly is too big. You should focus on cardio exercises and reduce the amount of food you eat.',
}`;

export const getEstimateBodyFatAndTargetPrompt = (
  currentWeight: number,
  age: number,
  height: number,
  lifestyle: string,
  aim: string,
  sex: string,
  exerciseFrequency: number,
  gymExperience: number,
) => `
Please follow strictly the requirements below, and always output the results in the JSON format.
Express the fat level in number as a percentage.
Suggest a target body fat level for me.
Suggest a target weight for me.
Add additional information about my body,
such as what parts of the body look good and what parts of the body need improvement.
The additional information should be a string.
The additional information should be no longer than 200 characters.
Please take into account the following information about me:
Current weight: ${currentWeight}kg
Age: ${age} years old
Height: ${height}cm
Lifestyle: ${lifestyle} - ${
  LIFESTYLES.find((style) => style.title === lifestyle).content
}
Aim: ${aim}
Gender: ${sex}
Exercise frequency: ${exerciseFrequency} times a week
Gym experience: ${gymExperience} months
Return the response in the following JSON format and ensure that it's parsable with JSON.parse() method:
{
    current: {
        bodyFat: number,
        weight: number,
    },
    target: {
        bodyFat: number,
        weight: number,
    },
    additionalInfo: string,
    bodyPartsThatNeedImprovement: string[],
}
`;
