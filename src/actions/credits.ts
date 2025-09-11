'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ensureDemoUserWithCredit } from '@/lib/user'

export async function getCurrentUserCredits(): Promise<number> {
  const user = await ensureDemoUserWithCredit()
  const credit = await prisma.credit.findUnique({ where: { userId: user.id } })
  return credit?.balance ?? 0
}

export async function topUpCreditsAction(amount: number = 100): Promise<{ balance: number } | { error: string }> {
  try {
    const delta = Number.isFinite(amount) ? Math.max(1, Math.floor(amount)) : 100
    const user = await ensureDemoUserWithCredit()
    const updated = await prisma.credit.update({
      where: { userId: user.id },
      data: { balance: { increment: delta } },
      select: { balance: true }
    })
    try { revalidatePath('/') } catch (e) { console.warn('Failed to revalidate / after top-up', e) }
    return { balance: updated.balance }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Top-up failed'
    console.error('topUpCreditsAction error:', err)
    return { error: msg }
  }
}
