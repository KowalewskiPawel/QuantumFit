const extraSentenceStart = `You previously created a meal plan, but the person has specified their dietary 
preferences and they do not like the following foods:`;

const extraSentenceFinish = `Please create a meal plan that does not include any of those food items.`;

export const generateQuestion = (
  { aim, exerciseFrequency, height, lifestyle, sex, weight, yearOfBirth },
  excludedFoods: string
) => {
  const age = new Date(Date.now()).getFullYear() - yearOfBirth;
  const filteredAim = (aim: string) => {
    if (aim.includes("lose")) {
      return "lose weight";
    }

    if (aim.includes("gain")) {
      return "gain weight and muscle mass";
    }

    if (aim.includes("maintain")) {
      return "maintain their weight";
    }

    return "change their body appearance";
  };

  const correctedAim = filteredAim(aim);

  return `Please strictly follow the requirements below: \n

  You are to create a 7 day meal plan for a person who is looking to ${correctedAim}. This person 
  is a ${age} year old ${sex} who currently has a lifestyle (in terms of physical activity) that 
  would be classified as ${lifestyle.toLowerCase()}. They are ${height}cm tall, weigh ${weight}kg, and exercise
  about ${exerciseFrequency} times per week at the gym. \n

  Based on the given information, you are to create a meal plan that will help them to ${correctedAim} by 
  eating the correct amount of calories throughout the day. The idea is to get the person to a healthy 
  body weight for their age, gender, physical activity and height. \n

  ${
    excludedFoods
      ? `\n ${extraSentenceStart} ${excludedFoods}. ${extraSentenceFinish} \n`
      : ""
  }

  I need the meal plan to be in JSON and in this shape. \n

  Example response: \n

  [
    {
      mealSummary: "scrambled eggs, soup, pizza",
      meals: [
        {
          meal: "breakfast",
          name: "scrambled eggs",
          ingredients: [
            "4 eggs",
            "5 slices of bacon",
            "1 slice of cheese",
            "2 slices of toasted bread",
          ],
        },
        {
          meal: "lunch",
          name: "chicken noodle soup",
          ingredients: ["1 large bowl of soup", "75g of fusilli pasta"],
        },
        {
          meal: "dinner",
          name: "pizza",
          ingredients: [
            "4 slices of pizza",
            "1 glass of orange juice",
            "1 small bowl of salad",
          ],
        },
        {
          meal: "snacks",
          name: "extra",
          ingredients: [
            "half a cup of peanuts",
            "a small bowl of ice cream",
            "30g of 85% dark chocolate",
            "2 bananas",
            "100g yoghurt",
            "1 apple",
          ],
        },
      ],
    },
    {
      // follow the same pattern and format as day 1 for the remaining 6 days
    },
  ]; 
  
  \n

  Here are some other tips about the response for various fields. \n 

  The response is an array of objects and each object is equivalent to a day. \n

  mealSummary: This should only include main meals (separated by commas) and each meal cannot be more than 2 words. 
  (e.g. chicken noodle soup => soup or rice, sweet potatos and steak => steak). Use the word
  that describes the meal the best or is the "main" part of the meal. The main format for this is (e.g. "meal1, 
  meal2, meal3"). Do not include snacks in the summary. \n

  meals: This should be an array of 2-4 objects and most of the time it'll be 3 or 4. Each object
  constitutes a meal (e.g. breakfast, lunch, dinner, snacks). People who are looking to lose weight
  might not have 4 meals throughout the day or they will be much smaller is size and portions. \n

  meal: There are only 4 possible choices here (e.g. breakfast, lunch, dinner or snacks) \n

  name: The name of the meal. The meal's name should not be more than 5 words. If it is, shorten the name. \n 

  ingredients: This should be an array of strings. Each string entry should be an ingredient that is part of the 
  meal. You do not need to specify spices (e.g. salt, pepper), herbs (e.g. oregano) or other small ingredients 
  unless they're important to the meal (e.g. no need to say lettuce, mustard, tomato for an egg sandwich. However,
  if the meal is a salad such ingredients should be listed (e.g. lettuce, onion, tomato, peppers)). Try to state 
  quantities where it is appropriate. \n

  For the meal: "snacks", please note that this is optional. Whether it is needed will depend on whether the 
  person gets enough calories in the day from only 3 meals or not. \n

  Concluding remarks:
  - output: JSON object
  - The JSON object should match the exact format as in the example above. There should be no spaces in the response
  - Do not reply with any words! Do not put "/\n" in the output.
  - There should be some variety in terms of meals, ingredients and what the person eats. The meal plan should not be 
  identical everyday. It's okay for meals (or ingredients) to repeat 2-4 times over a 7 day period. A few meals will 
  only be 1-2 times in a week. Likewise, a few will be 5-6 times in a week. The key is to have a balanced meal and 
  ingredient plan. Of course, healthier ingredients should be consumed more often and more regularly. 
   `;
};
