import 'server-only';
import { prisma } from '@/lib/prisma'

const DEMO_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@oal.local'
export async function ensureDemoUserWithCredit() {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: DEMO_EMAIL },
      update: {},
      create: { email: DEMO_EMAIL, name: 'Demo User' },
    });
    await tx.credit.createMany({
      data: { userId: user.id, balance: 0 },
      skipDuplicates: true,
    });
    return user;
  });
}

export async function getCurrentUserCredits(): Promise<number> {
  const user = await ensureDemoUserWithCredit()
  const credit = await prisma.credit.findUnique({ where: { userId: user.id } })
  return credit?.balance ?? 0
}
