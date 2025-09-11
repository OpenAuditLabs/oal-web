"use client";

import { BanknoteArrowUp } from "lucide-react";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { topUpCreditsAction } from '@/actions/credits';

interface CreditsCardProps {
  credits?: number | null;
  className?: string;
  fixed?: boolean; // if true, pin to bottom-left of the viewport
  offsetClass?: string; // e.g., "left-4 bottom-4"
  increment?: number; // how many credits to add per click (default 100)
  buttonLabel?: string; // optional custom label base (will append ellipsis when pending)
}

export default function CreditsCard({
  credits,
  className = "",
  fixed = true,
  offsetClass = "left-4 bottom-4",
  increment = 100,
  buttonLabel = "Top up"
}: CreditsCardProps) {
  const positionClasses = fixed ? `fixed ${offsetClass} z-40` : "";
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleTopUp = () => {
    if (pending) return;
    startTransition(async () => {
      const res = await topUpCreditsAction(increment);
      if ('balance' in res) {
        router.refresh();
      } else {
        // Silent fail for now; could integrate toast system here
        console.warn('Top up failed', res.error);
      }
    });
  };

  return (
    <div className={`rounded-xl border border-primary bg-accent p-4 shadow-md w-56 max-w-[92vw] ${positionClasses} ${className}`}>
      <div className="text-3xl font-bold text-center text-foreground">
        {typeof credits === 'number' ? credits.toLocaleString() : '—'}
      </div>
      <div className="text-center text-sm text-muted-foreground">Credits Left</div>
      <button
        type="button"
        onClick={handleTopUp}
        disabled={pending}
        className="mt-3 w-full rounded-lg bg-primary text-white py-2 font-medium inline-flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <BanknoteArrowUp className={`w-4 h-4 ${pending ? 'animate-pulse' : ''}`} />
        {pending ? `${buttonLabel}...` : buttonLabel}
      </button>
    </div>
  );
}
