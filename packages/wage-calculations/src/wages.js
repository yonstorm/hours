import { classifyShifts, extractShiftsByDay } from './shifts';

const HOURLY_WAGE = 4.25;
const EVENING_BONUS = 1.25;
const OVERTIME_BONUS_PERCENTAGES_BY_HOUR = [0.25, 0.5, 1.0];

export const calculateDailyWage = (shifts) => {
  const dailyHours = classifyShifts(shifts);
  const normal = dailyHours.normal * HOURLY_WAGE;
  const evening = dailyHours.evening * (HOURLY_WAGE + EVENING_BONUS);

  // calculate overtime bonus
  let overtimePay = 0;
  const maxBonusLevel = OVERTIME_BONUS_PERCENTAGES_BY_HOUR.length - 1;
  let lastBonusPercentage = 0;
  for (let hour = 0; hour < Math.floor(dailyHours.overtime); hour += 1) {
    const bonusLevel = hour < maxBonusLevel ? hour : maxBonusLevel;
    const bonusPercentage = OVERTIME_BONUS_PERCENTAGES_BY_HOUR[bonusLevel];

    overtimePay += HOURLY_WAGE + HOURLY_WAGE * bonusPercentage;

    lastBonusPercentage = bonusPercentage;
  }
  const overtimeHourRemainder = (dailyHours.overtime % 1).toFixed(2);
  overtimePay +=
    (HOURLY_WAGE + HOURLY_WAGE * lastBonusPercentage) * overtimeHourRemainder;
  return {
    normalPay: normal,
    eveningPay: evening,
    overtimePay,
  };
};

export const calculateTotalWage = (shifts) => {
  const shiftsByDay = extractShiftsByDay(shifts);
  const dailyWages = Object.values(shiftsByDay).map((day) => {
    return calculateDailyWage(day);
  });
  const totals = dailyWages.reduce(
    (acc, day) => {
      acc.normalPay += day.normalPay;
      acc.eveningPay += day.eveningPay;
      acc.overtimePay += day.overtimePay;
      acc.total += day.normalPay + day.eveningPay + day.overtimePay;
      return acc;
    },
    { total: 0.0, normalPay: 0.0, eveningPay: 0.0, overtimePay: 0.0 },
  );
  const roundToNearestCent = (amount) => {
    const cents = amount * 100;
    const rounded = Math.round(cents);
    return rounded / 100;
  };

  totals.overtimePay = roundToNearestCent(totals.overtimePay);
  totals.normalPay = roundToNearestCent(totals.normalPay);
  totals.eveningPay = roundToNearestCent(totals.eveningPay);
  totals.total = roundToNearestCent(totals.total);

  return totals;
};
