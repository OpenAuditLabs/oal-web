export type MaybePromise<T> = T | Promise<T>;

export async function safeAwait<T>(promise: Promise<T>): Promise<[error: Error] | [error: null, data: T]> {
  try {
    const response = await promise;
    return [null, response];
  } catch (error) {
    return [error as Error];
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Error thrown when a promise times out.
 */
export class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Error thrown when all retry attempts fail.
 */
export class AllAttemptsFailedError extends Error {
  constructor(message = 'All attempts failed', public lastError?: Error) {
    super(message);
    this.name = 'AllAttemptsFailedError';
  }
}

/**
 * Wraps a promise with a timeout. If the promise does not settle within the specified
 * milliseconds, it will reject with a TimeoutError.
 * @template T The type of the promise's resolved value.
 * @param promise The promise to wrap.
 * @param ms The timeout duration in milliseconds.
 * @returns A new promise that resolves or rejects with the original promise's outcome,
 *          or rejects with a TimeoutError if the timeout is reached.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(`Timed out after ${ms} ms`));
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

/**
 * Retries an asynchronous function a specified number of times with a delay between attempts.
 * @template T The return type of the asynchronous function.
 * @param fn The asynchronous function to retry.
 * @param options Configuration for retries, including `attempts` and `delayMs`.
 * @param options.attempts The maximum number of attempts to make.
 * @param options.delayMs The delay in milliseconds between retry attempts.
 * @returns A promise that resolves with the result of `fn` on the first successful attempt,
 *          or rejects with an AllAttemptsFailedError if all attempts fail.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  { attempts, delayMs }: { attempts: number; delayMs: number },
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < attempts - 1) {
        await sleep(delayMs);
      }
    }
  }
  throw new AllAttemptsFailedError('All retry attempts failed', lastError);
}
