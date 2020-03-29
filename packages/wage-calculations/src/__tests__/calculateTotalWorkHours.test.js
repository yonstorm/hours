import { calculateTotalWorkHours, createShift } from '..';

describe('CalculateTotalWorkHours function', () => {
  test('it should return total hours worked', () => {
    const input = [
      createShift({
        startDate: '1.2.2020',
        startTime: '18:00',
        endTime: '23:15',
      }),
      createShift({
        startDate: '1.2.2020',
        startTime: '00:00',
        endTime: '06:00',
      }),
    ];
    const output = { hours: 11, minutes: 15 };

    expect(calculateTotalWorkHours(input)).toEqual(output);
  });
});
