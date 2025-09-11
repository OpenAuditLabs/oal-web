"use client";

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { topUpCreditsAction } from '@/actions/credits';

export default function TopUpButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (pending) return;
    startTransition(async () => {
      const res = await topUpCreditsAction(100);
      if ('balance' in res) {
        router.refresh();
      } else {
        console.warn('Top-up failed:', res.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label="Top up credits"
      className="rounded-lg bg-primary text-white py-2 px-4 font-medium inline-flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {pending ? 'Topping up...' : 'Top up credits'}
    </button>
  );
}
