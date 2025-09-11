import { prisma } from '@/lib/prisma'

const DEMO_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@oal.local'

export async function ensureDemoUserWithCredit() {
  // Find or create demo user
  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } })
  if (!user) {
    user = await prisma.user.create({ data: { email: DEMO_EMAIL, name: 'Demo User' } })
  }
  // Ensure credit row exists
  await prisma.credit.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, balance: 0 }
  })
  return user
}

export async function getCurrentUserCredits(): Promise<number> {
  const user = await ensureDemoUserWithCredit()
  const credit = await prisma.credit.findUnique({ where: { userId: user.id } })
  return credit?.balance ?? 0
}
