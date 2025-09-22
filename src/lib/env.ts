import 'server-only';

const APP_ENV = (process.env.APP_ENV as 'development' | 'production') ?? 'production';

const IRON_SESSION_PASSWORD = process.env.IRON_SESSION_PASSWORD as string;

if (!IRON_SESSION_PASSWORD || IRON_SESSION_PASSWORD.length < 32) {
  throw new Error('IRON_SESSION_PASSWORD must be set and at least 32 characters long');
}

export { APP_ENV, IRON_SESSION_PASSWORD };
