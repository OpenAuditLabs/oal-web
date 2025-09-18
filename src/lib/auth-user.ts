import 'server-only';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/jwt';
import { createHash } from 'crypto';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

// Get authenticated user by validating JWT cookie and matching stored hash
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    const payload = await verifyJwt<{ sub: string; email: string }>(token);
    if (!payload?.sub) return null;
    // Check hash matches latest issued token for single-session style enforcement
    const hash = createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({ where: { id: payload.sub, jwt_hash: hash }, select: { id: true, email: true, name: true } });
    if (!user) return null;
    return user;
  } catch (e) {
    console.warn('getAuthUser failed', e);
    return null;
  }
}

export async function requireAuthUser(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }
  return user;
}
