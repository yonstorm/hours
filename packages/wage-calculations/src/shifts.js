import moment from 'moment';

const DATE_INPUT_FORMAT = 'DD.MM.YYYY HH:mm';
const DATE_OUTPUT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const extractWorkedHours = ({ shiftStart, shiftDuration }) => {
  const totalHoursWorked = shiftDuration.hours;

  const shiftTime = shiftStart.split(' ')[1];
  const startHour = Number(shiftTime.split(':')[0]);
  let currentHour = startHour;
  const result = [];
  for (let i = 0; i < totalHoursWorked; i += 1) {
    if (currentHour === 24) {
      currentHour = 0.0;
    }
    result.push(currentHour);

    currentHour += 1.0;
  }
  const { minutes } = shiftDuration;
  const percentOfHour = minutes === 0 ? 0 : minutes / 60;
  result[result.length - 1] += percentOfHour;
  return result;
};

/**
 * Calculates total work hours from provided shifts
 * @param {Array} shifts - Shifts to calculate total from
 * @returns {number} Total work hours
 */
/* eslint-disable no-param-reassign */
export const calculateTotalWorkHours = (shifts) => {
  const totals = shifts.reduce(
    (total, { shiftDuration }) => {
      const { hours, minutes } = shiftDuration;

      total.hours += hours;
      total.minutes += minutes;
      return total;
    },
    { hours: 0, minutes: 0 },
  );
  const leftOverMinutes = totals.minutes % 60;
  const fullHoursFromMinutes = Math.floor(totals.minutes / 60);

  return {
    hours: totals.hours + fullHoursFromMinutes,
    minutes: leftOverMinutes,
  };
};
/* eslint-enable no-param-reassign */

/**
 * Extracts shifts by day
 * @param {Array} shifts - shifts worked
 * @returns {Object} Shifts worked dictionary ( { date: [ {shiftObject} ] } )
 */
export const extractShiftsByDay = (shifts) => {
  // disable eslint reassign check, performance
  /* eslint-disable no-param-reassign */
  const result = shifts.reduce((dict, shift) => {
    const key = shift.shiftStart.split(' ')[0];
    const keyExists = {}.hasOwnProperty.call(dict, key);
    if (!keyExists) {
      dict[key] = [];
    }
    dict[key].push(shift);
    return dict;
  }, {});
  /* eslint-enable no-param-reassign */
  return result;
};

const getTimeDifference = (startTime, endTime) => {
  const start = startTime.split(':').map((v) => Number(v));
  const end = endTime.split(':').map((v) => Number(v));

  const hourDiff = end[0] - start[0];
  const minuteDiff = start[1] - end[1];

  return {
    hours: hourDiff < 0 ? 24 + hourDiff : hourDiff,
    minutes: minuteDiff < 0 ? 0 - minuteDiff : minuteDiff,
  };
};

const getRemainderFromLastElement = (values) => {
  const lastValue = values[values.length - 1];
  if (!lastValue) {
    return 0.0;
  }

  return (lastValue % 1).toFixed(3);
};

/**
 * Classifies daily working hours by rules
 * @param {Object[]} dailyShifts - Total worked hours - classified as normal, evening and overtime
 */
export const classifyDailyWorkHours = (dailyShifts) => {
  // data should be sorted by shift startTime, otherwise calculation for evening hours might be wrong
  const sortedShifts = [...dailyShifts].sort((a, b) =>
    moment(a.shiftStart).isAfter(moment(b.shiftStart)),
  );

  const activeWorkingHours = sortedShifts.reduce((acc, shift) => {
    const shiftHours = extractWorkedHours(shift);
    return [...acc, ...shiftHours];
  }, []);
  console.log(activeWorkingHours);
  const remainder = getRemainderFromLastElement(activeWorkingHours);
  console.log(remainder);

  const overtimeHours = activeWorkingHours.splice(8, activeWorkingHours.length);

  const eveningHours = activeWorkingHours.filter(
    (hour) => hour >= 17 || hour <= 5,
  );
  const normalHours = activeWorkingHours.filter(
    (hour) => hour >= 6 && hour <= 17,
  );

  const hours = {
    normal: normalHours.length,
    evening: eveningHours.length,
    overtime: overtimeHours.length,
  };
  console.log(`hours: ${JSON.stringify(hours)}`);
  return hours;
};

/**
 * Classifies provided shifts working hours by rules
 * @param {Array} shifts -  shifts to classify
 * @returns {Object} shifts - Total worked hours - classified as normal, evening and overtime
 */
export const classifyShifts = (shifts) => {
  const shiftsByDay = extractShiftsByDay(shifts);
  /* eslint-disable no-param-reassign */
  return Object.values(shiftsByDay).reduce(
    (total, shift) => {
      const dailyHours = classifyDailyWorkHours(shift);

      console.log(dailyHours);
      total.normal += dailyHours.normal;
      total.evening += dailyHours.evening;
      total.overtime += dailyHours.overtime;

      return total;
    },
    { normal: 0, evening: 0, overtime: 0 },
  );
  /* eslint-enable no-param-reassign */
};

export const createShift = ({
  startDate = '1900.01.01',
  startTime = '00:00',
  endTime = '00:00',
}) => {
  const shiftStart = moment(
    `${startDate} ${startTime}`,
    DATE_INPUT_FORMAT,
  ).format(DATE_OUTPUT_FORMAT);

  const shiftDuration = getTimeDifference(startTime, endTime);
  const shiftEnd = moment(shiftStart)
    .add(shiftDuration.hours, 'hours')
    .add(shiftDuration.minutes, 'minutes')
    .format(DATE_OUTPUT_FORMAT);

  return {
    shiftStart,
    shiftEnd,
    shiftDuration,
  };
};
