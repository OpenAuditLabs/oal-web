import { formatShortDate } from './utils';

describe('formatShortDate', () => {
  it('should format a valid Date object correctly', () => {
    const date = new Date(2020, 0, 2, 15, 4);
    // Using a regex to avoid timezone differences, but checking for expected components
    const formattedDate = formatShortDate(date);
    expect(formattedDate).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2} (AM|PM)/);
  });

  it('should format a valid ISO string correctly', () => {
    const dateString = '2020-01-02T15:04:00Z';
    const formattedDate = formatShortDate(dateString);
    expect(formattedDate).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2} (AM|PM)/);
  });

  it('should throw TypeError for an invalid date string', () => {
    const invalidDateString = 'invalid-date';
    expect(() => formatShortDate(invalidDateString)).toThrow(TypeError);
    expect(() => formatShortDate(invalidDateString)).toThrow('Invalid date provided to formatShortDate');
  });

  it('should throw TypeError for an invalid Date object (e.g., from invalid input)', () => {
    const invalidDate = new Date('not-a-date');
    expect(() => formatShortDate(invalidDate)).toThrow(TypeError);
    expect(() => formatShortDate(invalidDate)).toThrow('Invalid date provided to formatShortDate');
  });
});