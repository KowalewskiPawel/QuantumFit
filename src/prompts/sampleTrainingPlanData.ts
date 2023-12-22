const trainingData = [
  {
    trainingSummary: "Biceps, Triceps, Shoulders",
    trainings: [
      {
        training: "Biceps Curls",
        name: "Biceps",
        description:
          "To perform biceps curls, stand with your feet shoulder-width apart, holding a dumbbell in each hand with an underhand grip. Bend your elbows and curl the dumbbells up towards your shoulders, keeping your upper arms stationary. Lower the dumbbells back down to the starting position.",
        reps: 10,
        sets: 3,
        weight: "light to moderate",
      },
      {
        training: "Triceps Pushdowns",
        name: "Triceps",
        description:
          "To perform triceps pushdowns, attach a rope or bar to a cable machine and select a weight. Grasp the rope or bar with an overhand grip, then extend your arms overhead. Bend your elbows and lower the rope or bar towards your chest, keeping your upper arms close to your body. Push back up to the starting position.",
        reps: 10,
        sets: 3,
        weight: "light to moderate",
      },
      {
        training: "Shoulder Press",
        name: "Shoulders",
        description:
          "To perform shoulder press, sit on a bench with a barbell resting across the front of your shoulders. Unrack the barbell and press it overhead until your arms are fully extended. Lower the barbell back down to the starting position.",
        reps: 8,
        sets: 3,
        weight: "moderate",
      },
    ],
  },
  {
    trainingSummary: "Chest, Back, Legs",
    trainings: [
      {
        training: "Bench Press",
        name: "Chest",
        description:
          "To perform bench press, lie on a bench with a barbell resting across your chest. Unrack the barbell and press it overhead until your arms are fully extended. Lower the barbell back down to the starting position.",
        reps: 8,
        sets: 3,
        weight: "moderate to heavy",
      },
      {
        training: "Pull-Ups",
        name: "Back",
        description:
          "To perform pull-ups, hang from a bar with your hands shoulder-width apart and an overhand grip. Pull yourself up until your chin is above the bar, then lower yourself back down to the starting position.",
        reps: "as many as possible",
        sets: 3,
        weight: "bodyweight",
      },
      {
        training: "Squats",
        name: "Legs",
        description:
          "To perform squats, stand with your feet shoulder-width apart and your toes slightly turned out. Bend your knees and lower your body until your thighs are parallel to the ground. Push back up to the starting position.",
        reps: 10,
        sets: 3,
        weight: "light to moderate",
      },
    ],
  },
  {
    trainingSummary: "Core and Cardio",
    trainings: [
      {
        training: "Planks",
        name: "Core",
        description:
          "To perform planks, start in a push-up position with your forearms on the ground and your body in a straight line from your head to your heels. Hold this position for as long as possible.",
        reps: "hold for 30-60 seconds",
        sets: 3,
        weight: "bodyweight",
      },
      {
        training: "Mountain Climbers",
        name: "Core",
        description:
          "To perform mountain climbers, start in a push-up position with your hands shoulder-width apart. Bring one knee towards your chest, then return it to the starting position and bring the other knee towards your chest.",
        reps: "20-30 reps per leg",
        sets: 3,
        weight: "bodyweight",
      },
      {
        training: "Running",
        name: "Cardio",
        description:
          "Running is a great way to improve your cardiovascular fitness. Find a pace that is challenging but sustainable, and run for at least 30 minutes.",
        reps: "30 minutes",
        sets: 1,
        weight: "bodyweight",
      },
    ],
  },
  {
    trainingSummary: "Rest Day",
    trainings: [],
  },
  {
    trainingSummary: "Glutes and Hamstrings",
    trainings: [
      {
        training: "Glute Bridges",
        name: "Glutes",
        description:
          "To perform glute bridges, lie on your back with your knees bent and your feet flat on the ground. Push your hips up towards the ceiling, squeezing your glutes at the top of the movement. Lower your hips back down to the starting position.",
        reps: 10,
        sets: 3,
        weight: "light to moderate",
      },
      {
        training: "Deadlifts",
        name: "Hamstrings",
        description:
          "To perform deadlifts, stand with your feet shoulder-width apart and a barbell on the ground in front of you. Bend your knees and hinge forward at the hips to grab the barbell with an overhand grip. Push through your heels and stand up straight, keeping your back flat and your arms straight. Lower the barbell back down to the starting position.",
        reps: 8,
        sets: 3,
        weight: "moderate to heavy",
      },
    ],
  },
  {
    trainingSummary: "Chest, Back, Legs",
    trainings: [
      {
        training: "Bench Press",
        name: "Chest",
        description:
          "To perform bench press, lie on a bench with a barbell resting across your chest. Unrack the barbell and press it overhead until your arms are fully extended. Lower the barbell back down to the starting position.",
        reps: 8,
        sets: 3,
        weight: "moderate to heavy",
      },
      {
        training: "Pull-Ups",
        name: "Back",
        description:
          "To perform pull-ups, hang from a bar with your hands shoulder-width apart and an overhand grip. Pull yourself up until your chin is above the bar, then lower yourself back down to the starting position.",
        reps: "as many as possible",
        sets: 3,
        weight: "bodyweight",
      },
    ],
  },
  {
    trainingSummary: "Rest Day",
    trainings: [],
  },
];
