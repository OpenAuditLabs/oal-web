"use client";
import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { AuditStatus, SeverityLevel } from '@prisma/client';

interface Finding {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  category: string | null;
  fileName: string | null;
  lineNumber: number | null;
  remediation: string | null;
  createdAt: string | Date;
}

interface AuditDetailData {
  id: string;
  projectName: string;
  size: string;
  status: AuditStatus;
  overallSeverity: SeverityLevel | null;
  findingsCount: number;
  duration: string | null;
  completedAt: Date | string | null;
  createdAt: Date | string;
  project: { id: string; name: string; description: string | null; fileCount: number; };
  findings: Finding[];
}

interface AuditDetailModalProps {
  open: boolean;
  onClose: () => void;
  audit: AuditDetailData | null;
}

export default function AuditDetailModal({ open, onClose, audit }: AuditDetailModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !audit) return null;

  const formatDate = (value: Date | string | number | null | undefined): string => {
    if (value == null) return 'N/A';
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/60 py-10">
      <div className="bg-background w-full max-w-5xl rounded-lg shadow-lg border border-border p-6 relative animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded hover:bg-secondary text-muted-foreground"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold mb-2">Audit Report</h2>
        <p className="text-sm text-muted-foreground mb-4">Detailed results and findings for <span className="font-medium text-foreground">{audit.projectName}</span></p>

        {/* Summary grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Project</p>
            <p className="font-medium text-foreground truncate" title={audit.project.name}>{audit.project.name}</p>
          </div>
          <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Files</p>
            <p className="font-medium text-foreground">{audit.project.fileCount}</p>
          </div>
            <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Findings</p>
            <p className="font-medium text-foreground">{audit.findingsCount}</p>
          </div>
          <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Severity</p>
            <p className="font-medium text-foreground">{audit.overallSeverity ?? 'N/A'}</p>
          </div>
          <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Size</p>
            <p className="font-medium text-foreground">{audit.size}</p>
          </div>
          <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium text-foreground">{audit.status}</p>
          </div>
          <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Completed</p>
            <p className="font-medium text-foreground">{formatDate(audit.completedAt)}</p>
          </div>
          <div className="p-3 rounded border border-border bg-card/50">
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium text-foreground">{audit.duration || 'N/A'}</p>
          </div>
        </div>

        {/* Project description */}
        {audit.project.description && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Project Description</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{audit.project.description}</p>
          </div>
        )}

        {/* Findings table (scrollable area) */}
        <div className="border border-border rounded-lg overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="bg-secondary/70 border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
            <p className="text-sm font-medium text-foreground">Findings ({audit.findings.length})</p>
          </div>
          {audit.findings.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground flex-1 overflow-auto">No findings recorded for this audit.</div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Title</th>
                    <th className="text-left px-4 py-2 font-medium">Severity</th>
                    <th className="text-left px-4 py-2 font-medium">Category</th>
                    <th className="text-left px-4 py-2 font-medium">Location</th>
                    <th className="text-left px-4 py-2 font-medium">Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {audit.findings.map(f => (
                    <tr key={f.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-2 w-64">
                        <p className="font-medium text-foreground truncate" title={f.title}>{f.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2" title={f.description}>{f.description}</p>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border border-border bg-card/60">{f.severity}</span>
                      </td>
                      <td className="px-4 py-2 align-top">{f.category ?? '—'}</td>
                      <td className="px-4 py-2 align-top text-muted-foreground">{f.fileName ? `${f.fileName}${f.lineNumber ? ':'+f.lineNumber : ''}` : '—'}</td>
                      <td className="px-4 py-2 align-top text-muted-foreground max-w-xs">
                        {f.remediation ? <span className="line-clamp-3" title={f.remediation}>{f.remediation}</span> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
