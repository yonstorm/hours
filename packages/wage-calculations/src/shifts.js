import moment from 'moment';

const DATE_INPUT_FORMAT = 'DD.MM.YYYY HH:mm';
const DATE_OUTPUT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const extractWorkedHours = ({ shiftStart, shiftEnd, shiftDuration }) => {
  const totalHoursWorked = shiftDuration.hours;

  const shiftStartTime = shiftStart.split(' ')[1];
  let [startHour, startMinute] = shiftStartTime.split(':');
  startHour = Number(startHour);
  startMinute = Number(startMinute);

  const shiftEndTime = shiftEnd.split(' ')[1];
  let [endHour, endMinute] = shiftEndTime.split(':');
  endHour = Number(endHour);
  endMinute = Number(endMinute);

  const minutesWorkedByHour = new Array(24).fill(0);
  minutesWorkedByHour[startHour] = 60 - startMinute;
  minutesWorkedByHour[endHour] = endMinute;

  let currentHour = startHour + 1;
  for (let i = 0; i < totalHoursWorked - 1; i += 1) {
    if (currentHour === 24) {
      currentHour = 0;
    }

    minutesWorkedByHour[currentHour] = 60;

    currentHour += 1;
  }
  const results = minutesWorkedByHour.map((minutes) => {
    return minutes / 60;
  });

  return results;
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

/**
 * Classifies daily working hours by rules
 * @param {Object[]} dailyShifts - Total worked hours - classified as normal, evening and overtime
 */
export const classifyDailyWorkHours = (dailyShifts) => {
  const sortedShifts = [...dailyShifts].sort((a, b) =>
    moment(a.shiftStart).isAfter(moment(b.shiftStart)),
  );
  let activeWorkingHours = sortedShifts.reduce((acc, shift) => {
    const shiftHours = extractWorkedHours(shift);
    shiftHours.forEach((hour, index) => {
      acc[index] += shiftHours[index];
    });
    return acc;
  }, new Array(24).fill(0));

  const firstShift = sortedShifts[0];
  const dayStartHour = Number(
    firstShift.shiftStart.split(' ')[1].split(':')[0],
  );

  const overtimeHours = [];
  let workedHours = 0;
  let currentHour = dayStartHour;
  for (let i = 0; i <= activeWorkingHours.length; i += 1) {
    if (currentHour > 23) {
      currentHour = 0;
    }
    if (workedHours >= 8) {
      overtimeHours.push(currentHour);
    }
    workedHours += activeWorkingHours[currentHour];
    currentHour += 1;
  }
  const totalOvertime = overtimeHours.reduce((acc, overtimeHour) => {
    return acc + activeWorkingHours[overtimeHour];
  }, 0);

  activeWorkingHours = activeWorkingHours.map((value, index) =>
    overtimeHours.includes(index) ? 0 : value,
  );

  const eveningHours = activeWorkingHours.filter(
    (value, hour) => hour >= 18 || hour <= 5,
  );
  const normalHours = activeWorkingHours.filter(
    (value, hour) => hour >= 6 && hour <= 17,
  );

  const hours = {
    normal: normalHours.reduce((acc, value) => acc + value),
    evening: eveningHours.reduce((acc, value) => acc + value),
    overtime: totalOvertime,
  };
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
