"use client";

import { BanknoteArrowUp } from "lucide-react";

interface CreditsCardProps {
  credits?: number | null;
  onTopUp?: () => void;
  className?: string;
  buttonLabel?: string;
  fixed?: boolean; // if true, pin to bottom-left of the viewport
  offsetClass?: string; // e.g., "left-4 bottom-4"
}

export default function CreditsCard({ credits, onTopUp, className = "", buttonLabel = "Top up", fixed = true, offsetClass = "left-4 bottom-4" }: CreditsCardProps) {
  const positionClasses = fixed ? `fixed ${offsetClass} z-40` : "";
  return (
    <div className={`rounded-xl border border-primary bg-accent p-4 shadow-md w-56 max-w-[92vw] ${positionClasses} ${className}`}>
      <div className="text-3xl font-bold text-center text-foreground">
        {typeof credits === 'number' ? credits.toLocaleString() : '—'}
      </div>
      <div className="text-center text-sm text-muted-foreground">Credits Left</div>
      <button
        type="button"
        onClick={onTopUp}
        className="mt-3 w-full rounded-lg bg-primary text-white py-2 font-medium inline-flex items-center justify-center gap-2 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <BanknoteArrowUp className="w-4 h-4" />
        {buttonLabel}
      </button>
    </div>
  );
}
