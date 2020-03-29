import { createShift } from '..';

describe('createShift function', () => {
  test('it should return a valid shift object', () => {
    const startDate = '1.2.2020';
    const startTime = '18:00';
    const endTime = '23:15';

    const output = {
      shiftStart: '2020-02-01 18:00:00',
      shiftEnd: '2020-02-01 23:15:00',
      shiftDuration: { hours: 5, minutes: 15 },
    };

    expect(createShift({ startDate, startTime, endTime })).toEqual(output);
  });
  test('it should work with times spanning over midnight', () => {
    const startDate = '1.2.2020';
    const startTime = '18:00';
    const endTime = '02:15';

    const output = {
      shiftStart: '2020-02-01 18:00:00',
      shiftEnd: '2020-02-02 02:15:00',
      shiftDuration: {
        hours: 8,
        minutes: 15,
      },
    };

    expect(createShift({ startDate, startTime, endTime })).toEqual(output);
  });
});
