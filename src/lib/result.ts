/**
 * Universal return type for server actions
 * Provides a consistent structure for success and error responses
 */
export type Result<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Creates a success result with data
 */
export function success<T>(data: T): Result<T> {
  return {
    data,
    success: true
  };
}

/**
 * Creates an error result with error message
 */
export function error<T>(message: string): Result<T> {
  return {
    success: false,
    error: message
  };
}

/**
 * Type guard to check if a result is a success result.
 * @example
 * ```
 * const res: Result<string> = success("data");
 * if (isOk(res)) {
 *   console.log(res.data); // res is of type { success: true; data: string }
 * }
 * ```
 */
export function isOk<T>(r: Result<T>): r is { success: true; data: T } {
  return r.success;
}

/**
 * Type guard to check if a result is an error result.
 * @example
 * ```
 * const res: Result<string> = error("error message");
 * if (isErr(res)) {
 *   console.log(res.error); // res is of type { success: false; error: string }
 * }
 * ```
 */
export function isErr<T>(r: Result<T>): r is { success: false; error: string } {
  return !r.success;
}
