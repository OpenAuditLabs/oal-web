import { formatShortDate, debounce, throttle } from './utils';

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

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should debounce a function call', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    jest.advanceTimersByTime(99);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should ensure the function is called with the latest arguments', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc(1);
    debouncedFunc(2);
    debouncedFunc(3);

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledWith(3);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should throttle a function call', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc(); // Called immediately
    throttledFunc(); // Ignored
    throttledFunc(); // Ignored

    expect(func).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);
    throttledFunc(); // Ignored
    expect(func).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);
    throttledFunc(); // Called after wait
    expect(func).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(100);
    throttledFunc(); // Called after wait
    expect(func).toHaveBeenCalledTimes(3);
  });

  it('should ensure the function is called with the latest arguments on trailing call', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc(1);
    jest.advanceTimersByTime(50);
    throttledFunc(2);
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledWith(1);
    throttledFunc(3);
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledWith(3);
  });
});