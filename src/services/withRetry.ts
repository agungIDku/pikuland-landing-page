/**
 * Runs an async function and retries on failure.
 * @param fn - Async function to run (no arguments).
 * @param retries - Number of retries after the first attempt (default 1 = 2 total attempts).
 * @returns The result of fn().
 * @throws The last error if all attempts fail.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
): Promise<T> {
  let lastError: unknown;
  const totalAttempts = retries + 1;

  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === totalAttempts) {
        throw lastError;
      }
    }
  }

  throw lastError;
}
