import { withTimeout, TimeoutError, sleep } from './async';

describe('withTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should resolve with the original value when the promise resolves before the timeout', async () => {
    const promise = sleep(50).then(() => 'success');
    const resultPromise = withTimeout(promise, 100);

    jest.advanceTimersByTime(50);
    await expect(resultPromise).resolves.toBe('success');
  });

  it('should reject with TimeoutError if the promise takes longer than ms', async () => {
    const promise = sleep(150).then(() => 'success');
    const resultPromise = withTimeout(promise, 100);

    jest.advanceTimersByTime(100);
    await expect(resultPromise).rejects.toThrow(TimeoutError);
    await expect(resultPromise).rejects.toThrow('Timed out after 100 ms');
  });

  it('should reject with the original error if the promise rejects before the timeout', async () => {
    const error = new Error('Original error');
    const promise = sleep(50).then(() => { throw error; });
    const resultPromise = withTimeout(promise, 100);

    jest.advanceTimersByTime(50);
    await expect(resultPromise).rejects.toThrow(error);
  });

  it('should clear the timeout if the promise resolves before the timeout', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const promise = sleep(50).then(() => 'success');
    const resultPromise = withTimeout(promise, 100);

    jest.advanceTimersByTime(50);
    await resultPromise;

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    clearTimeoutSpy.mockRestore();
  });

  it('should clear the timeout if the promise rejects before the timeout', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const error = new Error('Original error');
    const promise = sleep(50).then(() => { throw error; });
    const resultPromise = withTimeout(promise, 100);

    jest.advanceTimersByTime(50);
    await expect(resultPromise).rejects.toThrow(error);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    clearTimeoutSpy.mockRestore();
  });

  it('should not call clearTimeout if the timeout occurs first', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const promise = sleep(150).then(() => 'success');
    const resultPromise = withTimeout(promise, 100);

    jest.advanceTimersByTime(100);
    await expect(resultPromise).rejects.toThrow(TimeoutError);

    expect(clearTimeoutSpy).not.toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
