import { extractWorkedHours, createShift } from '..';

describe('extractWorkedHours function', () => {
  test('it should return array of hours worked', () => {
    const input = createShift({
      startDate: '1.2.2020',
      startTime: '18:00',
      endDate: '1.2.2020',
      endTime: '23:00',
    });

    const output = [18, 19, 20, 21, 22];

    expect(extractWorkedHours(input)).toEqual(output);
  });
  test('it should not return hours over 23', () => {
    const input = createShift({
      startDate: '1.2.2020',
      startTime: '18:00',
      endDate: '1.2.2020',
      endTime: '01:00',
    });

    const output = [18, 19, 20, 21, 22, 23, 0];

    expect(extractWorkedHours(input)).toEqual(output);
  });
});
