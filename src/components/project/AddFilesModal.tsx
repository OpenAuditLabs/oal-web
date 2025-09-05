"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import UploadCard from '@/components/common/UploadCard';
import Button from '@/components/ui/Button';

interface AddFilesModalProps {
  open: boolean;
  onClose: () => void;
  project: { id: string; name: string } | null;
}

export default function AddFilesModal({ open, onClose, project }: AddFilesModalProps) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Focus trap + restore
  const keyHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab' && contentRef.current) {
      const focusable = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey) {
        if (active === first || !contentRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !contentRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', keyHandler);
      const timer = setTimeout(() => {
        if (contentRef.current) {
          const firstBtn = contentRef.current.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          firstBtn?.focus();
        }
      }, 0);
      // Prevent background scroll
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', keyHandler);
        document.body.style.overflow = prevOverflow;
        lastFocusedRef.current?.focus();
      };
    }
  }, [open, keyHandler]);

  if (!open || !project) return null;

  const handleFilesSelected = (files: FileList) => {
    // Placeholder for future upload integration
    console.log(`Selected ${files.length} files for project ${project.id}`);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-files-title"
    >
      <div
        ref={contentRef}
        className="w-full max-w-2xl bg-background rounded-lg shadow-lg border border-border p-6 max-h-[85vh] overflow-y-auto focus:outline-none"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 id="add-files-title" className="text-xl font-bold mb-1">Add Files</h2>
            <p className="text-sm text-muted-foreground">Project: <span className="font-medium text-foreground">{project.name}</span></p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="text-foreground">
          <UploadCard 
            onFilesSelected={handleFilesSelected} 
            headline={`Upload files for "${project.name}"`}
            footerNote=""
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>Close</Button>
          {/* Future: Add an Upload button to trigger backend upload */}
        </div>
      </div>
    </div>
  );
}
