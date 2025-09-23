import 'server-only';

const APP_ENV = (process.env.APP_ENV as 'development' | 'production') ?? 'development';
const IS_PRODUCTION = APP_ENV === 'production';

let IRON_SESSION_PASSWORD = process.env.IRON_SESSION_PASSWORD as string | undefined;

if (!IRON_SESSION_PASSWORD || IRON_SESSION_PASSWORD.length < 32) {
  if (IS_PRODUCTION) {
    throw new Error('IRON_SESSION_PASSWORD must be set and at least 32 characters long');
  } else {
    // Fallback for development/CI to avoid failing builds/tests when no .env is present
  IRON_SESSION_PASSWORD = 'dev-iron-session-password-at-least-32-chars!!';
    if (process.env.CI) {
      // Keep logs minimal in CI but note the fallback usage
      console.warn('[env] Using fallback IRON_SESSION_PASSWORD in non-production environment');
    }
  }
}

// Export as a definite string to satisfy consumers (e.g., iron-session SessionOptions)
const IRON_SESSION_PASSWORD_STR: string = IRON_SESSION_PASSWORD as string;

export { APP_ENV, IRON_SESSION_PASSWORD_STR as IRON_SESSION_PASSWORD };
