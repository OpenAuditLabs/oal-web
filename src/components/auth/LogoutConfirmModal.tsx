"use client";

import React, { useRef } from 'react';
import Button from '@/components/ui/Button';

interface LogoutConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  pending?: boolean;
}

export default function LogoutConfirmModal({ open, onCancel, onConfirm, pending }: LogoutConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onCancel();
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/80"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg shadow-lg p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-2">Confirm Logout</h2>
        <p className="text-sm text-muted-foreground mb-6">Are you sure you want to log out? You will need to log back in to resume your session.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" type="button" onClick={onCancel} disabled={pending}>Cancel</Button>
          <Button variant="primary" size="sm" type="button" onClick={onConfirm} disabled={pending} className="bg-destructive hover:bg-destructive/90 text-white">
            {pending ? 'Logging out...' : 'Log out'}
          </Button>
        </div>
      </div>
    </div>
  );
}
