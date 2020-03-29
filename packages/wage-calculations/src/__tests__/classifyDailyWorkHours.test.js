import { classifyDailyWorkHours, createShift } from '..';

describe('ClassifyDailyWorkHours function', () => {
  test('it should return work time with overtime hours', () => {
    const input = [
      createShift({
        startDate: '1.2.2020',
        startTime: '00:00',
        endDate: '1.2.2020',
        endTime: '10:00',
      }),
    ];

    expect(classifyDailyWorkHours(input)).toEqual(
      expect.objectContaining({
        overtime: 2,
      }),
    );
  });
  test('it should return work time with evening hours', () => {
    const input = [
      createShift({
        startDate: '1.2.2020',
        startTime: '16:00',
        endDate: '1.2.2020',
        endTime: '23:00',
      }),
    ];

    expect(classifyDailyWorkHours(input)).toEqual(
      expect.objectContaining({
        evening: 5,
      }),
    );
  });
  test('it should return work time with normal hours', () => {
    const input = [
      createShift({
        startDate: '1.2.2020',
        startTime: '12:00',
        endDate: '1.2.2020',
        endTime: '18:00',
      }),
    ];

    expect(classifyDailyWorkHours(input)).toEqual(
      expect.objectContaining({
        normal: 6,
      }),
    );
  });
  test('it should return work time with normal and overtime hours', () => {
    const input = [
      createShift({
        startDate: '1.2.2020',
        startTime: '06:00',
        endDate: '1.2.2020',
        endTime: '18:00',
      }),
    ];

    expect(classifyDailyWorkHours(input)).toEqual(
      expect.objectContaining({
        normal: 8,
        overtime: 4,
      }),
    );
  });
  test('it should return 0 evening hours if during overtime', () => {
    const input = [
      createShift({
        startDate: '1.2.2020',
        startTime: '10:00',
        endDate: '1.2.2020',
        endTime: '00:00',
      }),
    ];

    expect(classifyDailyWorkHours(input)).toEqual(
      expect.objectContaining({
        normal: 8,
        overtime: 6,
      }),
    );
  });
  test('it should work with multiple shifts during the day', () => {
    const input = [
      {
        startDate: '1.2.2020',
        startTime: '06:00',
        endDate: '1.2.2020',
        endTime: '12:00',
      },
      {
        startDate: '1.2.2020',
        startTime: '17:00',
        endDate: '1.2.2020',
        endTime: '19:00',
      },
      {
        startDate: '1.2.2020',
        startTime: '21:00',
        endDate: '1.2.2020',
        endTime: '01:00',
      },
    ].map((v) => createShift(v));

    expect(classifyDailyWorkHours(input)).toEqual(
      expect.objectContaining({
        normal: 7,
        evening: 1,
        overtime: 4,
      }),
    );
  });
  test('it should work with multiple shifts during the day even if shifts are not sorted by startTime ascending', () => {
    const input = [
      {
        startDate: '1.2.2020',
        startTime: '06:00',
        endDate: '1.2.2020',
        endTime: '12:00',
      },
      {
        startDate: '1.2.2020',
        startTime: '21:00',
        endDate: '1.2.2020',
        endTime: '01:00',
      },
      {
        startDate: '1.2.2020',
        startTime: '17:00',
        endDate: '1.2.2020',
        endTime: '19:00',
      },
    ].map((v) => createShift(v));

    expect(classifyDailyWorkHours(input)).toEqual(
      expect.objectContaining({
        normal: 7,
        evening: 1,
        overtime: 4,
      }),
    );
  });
});
