import 'server-only';
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-user'

export async function getCurrentUserCredits(): Promise<number> {
  const user = await getAuthUser();
  if (!user) return 0;
  const credit = await prisma.credit.findUnique({ where: { userId: user.id } });
  return credit?.balance ?? 0;
}
