import 'server-only';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const SECRET_ENV_KEY = 'JWT_SECRET';

function getSecretKey(): Uint8Array {
  const secret = process.env[SECRET_ENV_KEY];
  if (!secret || !secret.trim()) {
    throw new Error(`Missing ${SECRET_ENV_KEY} environment variable`);
  }
  return new TextEncoder().encode(secret);
}

export async function signJwt(payload: JWTPayload, expiresIn: string = '7d'): Promise<string> {
  const key = getSecretKey();
  const now = Math.floor(Date.now() / 1000);
  // jose SignJWT expects iat/exp as numeric; we compute exp based on expiresIn days/hours
  const match = /^([0-9]+)([smhd])$/.exec(expiresIn);
  let seconds = 7 * 24 * 60 * 60; // default 7d
  if (match) {
    const val = Number(match[1]);
    const unit = match[2];
    const mult = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
    seconds = val * mult;
  }

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + seconds)
    .sign(key);
}

export async function verifyJwt<T extends JWTPayload = JWTPayload>(token: string): Promise<T> {
  const key = getSecretKey();
  const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
  return payload as T;
}
