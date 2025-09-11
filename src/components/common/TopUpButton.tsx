"use client";

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { topUpCreditsAction } from '@/actions/credits'

// This component is used indirectly: passed as onTopUpClick to SidebarClient.
// When rendered (invoked), it performs a top-up and refreshes the page.
export default function TopUpButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  startTransition(async () => {
    const res = await topUpCreditsAction(100)
    if ('balance' in res) {
      router.refresh()
    } else {
      console.warn('Top-up failed:', res.error)
    }
  })

  return null
}
