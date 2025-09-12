"use client";

import { X, FileText, Calendar, Layers3, ListChecks } from 'lucide-react';
import { useEffect, useRef } from 'react';

export interface ProjectDetailData {
  id: string;
  name: string;
  description: string | null;
  fileCount: number;
  createdAt: string | Date;
  auditCount: number;
  // Future: add owner, credits usage, recent audits summary etc.
}

interface ProjectDetailModalProps {
  open: boolean;
  project: ProjectDetailData | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ open, project, onClose }: ProjectDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    let previousActive: Element | null = null;
    let previousOverflow: string = '';
    if (open) {
      previousActive = document.activeElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (dialogRef.current) {
        dialogRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousActive && document.contains(previousActive)) {
        (previousActive as HTMLElement).focus();
      }
    };
  }, [open]);

  if (!open || !project) return null;

  let formattedDate = '';
  const date = new Date(project.createdAt);
  if (!project.createdAt || Number.isNaN(date.getTime())) {
    formattedDate = 'Unknown date';
  } else {
    formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Project details for ${project.name}`}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background shadow-xl p-6 animate-in fade-in-0 zoom-in-95"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{project.name}</h2>
        <p className="text-sm text-muted-foreground mb-6 whitespace-pre-wrap">
          {project.description || 'No description provided.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-lg border border-border p-4 flex items-start gap-3 bg-accent/40">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Files</div>
              <div className="text-lg font-medium text-foreground">{project.fileCount}</div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4 flex items-start gap-3 bg-accent/40">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Created</div>
              <div className="text-lg font-medium text-foreground">{formattedDate}</div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4 flex items-start gap-3 bg-accent/40">
            <ListChecks className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Audits</div>
              <div className="text-lg font-medium text-foreground">{project.auditCount}</div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4 flex items-start gap-3 bg-accent/40">
            <Layers3 className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">ID</div>
              <div className="text-xs font-mono break-all text-foreground">{project.id}</div>
            </div>
          </div>
        </div>
        {/* Placeholder for future audits list / recent activity */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recent Audits (coming soon)</h3>
          <div className="text-xs text-muted-foreground">This area will display recent audits, severity distribution, and credit usage related to this project.</div>
        </div>
      </div>
    </div>
  );
}
