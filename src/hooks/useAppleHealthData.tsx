import { useEffect } from "react";
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from "react-native-health";

const REQUESTED_PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.ActivitySummary,
      AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
      AppleHealthKit.Constants.Permissions.BodyFatPercentage,
      AppleHealthKit.Constants.Permissions.BodyMass,
      AppleHealthKit.Constants.Permissions.BodyMassIndex,
      AppleHealthKit.Constants.Permissions.EnergyConsumed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [AppleHealthKit.Constants.Permissions.BodyFatPercentage],
  },
};

export const useAppleHealthData = () => {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const midnightISO = todayMidnight.toISOString();

  const currentDateOptions: HealthInputOptions = {
    date: new Date().toISOString(),
    startDate: midnightISO,
    endDate: new Date().toISOString(),
    includeManuallyAdded: true,
  };

  const getActiveEnergyAsync = () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(
        currentDateOptions,
        (err, results) => {
          if (err) {
            console.log(JSON.stringify(err));
            reject(err);
          } else {
            const activeEnergyBurned = results.reduce(
              (acc, curr) => acc + curr.value,
              0
            );
            resolve(activeEnergyBurned);
          }
        }
      );
    });
  };

  useEffect(() => {
    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err || !isAvailable) {
        console.error("Apple HealthKit is not available");
        return;
      }
      AppleHealthKit.initHealthKit(REQUESTED_PERMISSIONS, (err) => {
        if (err) {
          console.error(JSON.stringify(err));
          return;
        }
      });
    });
  }, []);

  return {
    getActiveEnergyAsync,
  };
};
