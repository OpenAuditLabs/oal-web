'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAuthUser } from '@/lib/auth-user'

export async function topUpCreditsAction(amount: number = 100): Promise<{ balance: number } | { error: string }> {
  try {
    const delta = Number.isFinite(amount) ? Math.max(1, Math.floor(amount)) : 100
    const user = await requireAuthUser()
    // Ensure credit row exists
    await prisma.credit.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, balance: 0 }
    })
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
