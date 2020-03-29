import { classifyShifts, createShift } from '..';

describe('classifyShifts function', () => {
  test('it should return working hours classified for provided shifts', () => {
    const input = [
      createShift({
        startDate: '1.2.2020',
        startTime: '00:00',
        endDate: '1.2.2020',
        endTime: '06:00',
      }),
      createShift({
        startDate: '1.2.2020',
        startTime: '12:00',
        endDate: '1.2.2020',
        endTime: '18:00',
      }),
      createShift({
        startDate: '3.2.2020',
        startTime: '12:00',
        endDate: '1.2.2020',
        endTime: '18:00',
      }),
    ];

    expect(classifyShifts(input)).toEqual(
      expect.objectContaining({
        normal: 8,
        evening: 6,
        overtime: 4,
      }),
    );
  });
});
