'use client';

import { useEffect, useRef, useState, useActionState, startTransition, type ComponentProps } from 'react';
import { toast } from "sonner";
import { CheckCircle, CircleX, Eye, Download, RefreshCw, Flame, AlertTriangle, ShieldHalf, Info } from "lucide-react";
import { getAuditHistoryFormAction, getAuditReportFormAction, type AuditHistoryItem, type AuditHistoryActionResult, type AuditReportState } from "@/actions/audits";
import { generateAuditPdf } from "@/lib/pdf";
import AuditDetailModal from "./AuditDetailModal";
import type { AuditStatus, SeverityLevel } from "@prisma/client";
import { rerunAuditAction } from "@/actions/rerun-audit";

interface AuditTableProps {
  searchQuery?: string;
  statusFilter?: string[];
  severityFilter?: string[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function AuditTable({ 
  searchQuery = '', 
  statusFilter = [],
  severityFilter = []
}: AuditTableProps) {
  // For stale-response guard
  const latestRequestIdRef = useRef<string>('');
  const requestCounterRef = useRef<number>(0);
  const [auditHistory, setAuditHistory] = useState<{
    audits: AuditHistoryItem[];
    pagination: PaginationInfo;
  }>({
    audits: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    }
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rerunningAudits, setRerunningAudits] = useState<Set<string>>(new Set());
  const [rerunConfirmId, setRerunConfirmId] = useState<string | null>(null);
  const [viewingAuditId, setViewingAuditId] = useState<string | null>(null);
  const [viewAuditId, setViewAuditId] = useState<string | null>(null);
  const [downloadAuditId, setDownloadAuditId] = useState<string | null>(null);
  type AuditDetail = ComponentProps<typeof AuditDetailModal>["audit"];
  const [auditDetail, setAuditDetail] = useState<AuditDetail>(null);

  // Server action forms/state
  const historyFormRef = useRef<HTMLFormElement>(null);
  const [historyState, historyAction] = useActionState<AuditHistoryActionResult, FormData>(getAuditHistoryFormAction, {
    audits: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    error: undefined,
  requestId: undefined,
  });

  const viewFormRef = useRef<HTMLFormElement>(null);
  const [viewReportState, viewReportAction] = useActionState<AuditReportState, FormData>(getAuditReportFormAction, null);

  const downloadFormRef = useRef<HTMLFormElement>(null);
  const [downloadReportState, downloadReportAction] = useActionState<AuditReportState, FormData>(getAuditReportFormAction, null);

  // Trigger server action to fetch history when inputs change
  useEffect(() => {
    // Generate a unique requestId for this fetch
    requestCounterRef.current += 1;
    const requestId = `req-${Date.now()}-${requestCounterRef.current}`;
    latestRequestIdRef.current = requestId;
    const fd = new FormData();
    fd.set('requestId', requestId);
    fd.set('page', String(currentPage));
    fd.set('limit', '20');
    fd.set('search', (searchQuery || '').trim());
    if (statusFilter.length > 0) {
      statusFilter.forEach(s => fd.append('status', s.toUpperCase()));
    }
    severityFilter.forEach(s => fd.append('severity', s.toUpperCase()));
    startTransition(() => {
      historyAction(fd);
    });
  }, [currentPage, searchQuery, statusFilter, severityFilter]);


  // Sync server response to local state, only if not stale
  useEffect(() => {
    if (!historyState || !historyState.requestId) return; // ignore initial placeholder
    // Only process if this is the latest request
    if (historyState.requestId !== latestRequestIdRef.current) {
      // Stale response, ignore
      return;
    }
    console.debug('[PastAudits] history response', {
      page: historyState.pagination?.currentPage,
      totalPages: historyState.pagination?.totalPages,
      totalCount: historyState.pagination?.totalCount,
      auditsLen: historyState.audits?.length,
      requestId: historyState.requestId,
      error: historyState.error
    });
    if (historyState.error) {
      console.error('Error fetching audit data:', historyState.error);
      toast.error('Failed to fetch audit history.');
      setAuditHistory({
        audits: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      });
    } else {
      // If there are results overall but this page returned empty, bounce to page 1
      if ((historyState.pagination?.totalCount ?? 0) > 0 && (historyState.audits?.length ?? 0) === 0 && historyState.pagination?.currentPage && historyState.pagination.currentPage > 1) {
        setCurrentPage(1);
        return;
      }
      setAuditHistory({
        audits: historyState.audits ?? [],
        pagination: historyState.pagination ?? {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    }
    setLoading(false);
  }, [historyState]);

  // Reset to first page when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, severityFilter]);

  const handleRerun = (auditId: string) => {
    setRerunConfirmId(auditId);
  };

  const confirmRerun = async (auditId: string) => {
    setRerunningAudits(prev => new Set(prev).add(auditId));
    setRerunConfirmId(null);
    // Optimistically remove audit from table, but keep a reference for rollback
    let removedAudit: AuditHistoryItem | null = null;
    let removedIndex = -1;
    setAuditHistory(prev => {
      removedIndex = prev.audits.findIndex(a => a.id === auditId);
      if (removedIndex !== -1) {
        removedAudit = prev.audits[removedIndex];
      }
      return {
        ...prev,
        audits: prev.audits.filter(a => a.id !== auditId)
      };
    });
    try {
      const formData = new FormData();
      formData.set('auditId', auditId);
      await rerunAuditAction(formData);
  toast.success("Audit re-run successful and moved to queued audits.");
      // Optionally, refresh active audits elsewhere
    } catch (error) {
      console.error('Failed to rerun audit:', error);
  toast.error("Failed to re-run audit.");
      // Rollback the optimistic removal if the action fails
      if (removedAudit) {
        setAuditHistory(prev => {
          // If audit already present (due to a refetch), skip reinserting
          if (prev.audits.some(a => a.id === removedAudit!.id)) return prev;
          const nextAudits = [...prev.audits];
          const insertAt = removedIndex < 0 ? nextAudits.length : Math.min(removedIndex, nextAudits.length);
          nextAudits.splice(insertAt, 0, removedAudit!);
          return { ...prev, audits: nextAudits };
        });
      }
    } finally {
      setRerunningAudits(prev => {
        const next = new Set(prev);
        next.delete(auditId);
        return next;
      });
    }
  };

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case "FAILED":
        return <CircleX className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatSeverity = (severity: SeverityLevel | null) => {
    if (!severity) return "N/A";
    return severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
  };

  const getSeverityIcon = (severity: SeverityLevel | null) => {
    if (!severity) return null;
    switch (severity) {
      case 'CRITICAL':
        return <Flame className="w-4 h-4 text-red-600" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'MEDIUM':
        return <ShieldHalf className="w-4 h-4 text-yellow-500" />;
      case 'LOW':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatStatus = (status: AuditStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const openAuditDetail = (auditId: string) => {
    setViewingAuditId(auditId);
    setAuditDetail(null);
    setViewAuditId(auditId);
    // Dispatch server action with fresh auditId (avoid stale DOM value race)
    const fd = new FormData();
    fd.set('auditId', auditId);
    startTransition(() => {
      viewReportAction(fd);
    });
  };

  // Handle view report server response
  useEffect(() => {
  if (!viewReportState || !viewingAuditId) return;
  if ('error' in viewReportState && viewReportState.error) {
      toast.error('Failed to load audit detail.');
      return;
    }
  const detail = viewReportState as Exclude<AuditReportState, { error: string } | null>;
  // Ignore stale responses that don't match the currently viewed audit
  if (detail.id !== viewingAuditId) return;
    // Normalize to the shape expected by AuditDetailModal
    const normalized: NonNullable<AuditDetail> = {
      id: detail.id,
      projectName: detail.projectName,
      size: detail.size,
      status: detail.status,
      overallSeverity: detail.overallSeverity,
      findingsCount: detail.findingsCount,
      duration: detail.duration,
      completedAt: detail.completedAt,
      createdAt: detail.createdAt,
      project: {
        id: detail.project.id,
        name: detail.project.name,
        description: detail.project.description,
        fileCount: detail.project.fileCount,
      },
  findings: detail.findings.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        severity: f.severity,
        category: f.category,
        fileName: f.file?.path ?? f.file?.name ?? null,
        lineNumber: f.lineNumber,
        remediation: f.remediation,
        createdAt: f.createdAt,
      })),
    };
    setAuditDetail(normalized);
  }, [viewReportState, viewingAuditId]);

  const closeAuditDetail = () => {
    setViewingAuditId(null);
    setAuditDetail(null);
  };

  // Handle download report server response (top-level effect)
  useEffect(() => {
    // capture the id at the start of the effect to guard against stale responses
    const capturedId = downloadAuditId;
    const run = async () => {
      if (!downloadReportState || !capturedId) return;
      if ('error' in downloadReportState && downloadReportState.error) {
        toast.error('Failed to generate/download PDF.');
        return;
      }
      let a: HTMLAnchorElement | null = null;
      let url: string | null = null;
      try {
        const detail = downloadReportState as Exclude<AuditReportState, { error: string } | null>;
        // Ignore stale responses not matching the captured id
        if (detail.id !== capturedId) return;

    const pdfBytes = await generateAuditPdf({
          id: detail.id,
          projectName: detail.projectName,
          size: detail.size,
          status: detail.status,
          overallSeverity: detail.overallSeverity,
          findingsCount: detail.findingsCount,
          duration: detail.duration,
          completedAt: detail.completedAt,
          createdAt: detail.createdAt,
          project: detail.project ? { name: detail.project.name, description: detail.project.description ?? null } : undefined,
          findings: (detail.findings || []).map((f) => ({
            title: f.title,
            description: f.description,
            severity: f.severity,
            category: f.category ?? null,
      file: f.file?.path ?? f.file?.name ?? null,
            lineNumber: f.lineNumber ?? null,
            remediation: f.remediation ?? null,
          }))
        })

  // pdfBytes is a Uint8Array from generateAuditPdf; convert to a sliced ArrayBuffer for Blob
  const arrayBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        url = URL.createObjectURL(blob);
        a = document.createElement('a');
        a.href = url;
        // sanitize filename
        const sanitize = (s: string) => s.replace(/[^a-z0-9-_]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 120) || 'file';
        const safeId = sanitize(String(detail.id));
        a.download = `audit-${safeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        // Allow the browser to complete the download before revoking
        setTimeout(() => {
          if (url) URL.revokeObjectURL(url);
        }, 0);
        toast.success('PDF downloaded.');
      } catch (err) {
        console.error('Failed to download PDF', err);
        toast.error('Failed to generate/download PDF.');
      } finally {
        if (a) a.remove();
        // Only clear if we're still acting on the same captured id
        if (downloadAuditId === capturedId) {
          setDownloadAuditId(null);
        }
      }
    };
    run();
  }, [downloadReportState, downloadAuditId])

  const getActionIcons = (status: AuditStatus, auditId: string) => {
    if (status === "COMPLETED" || status === "FAILED") {
      return (
        <div className="flex items-center gap-1 relative">
          <button 
            className="p-1 hover:bg-secondary rounded"
            title="View Report"
            onClick={() => openAuditDetail(auditId)}
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          {status === "COMPLETED" && (
            <button 
              className="p-1 hover:bg-secondary rounded"
              title="Download Report"
              onClick={() => {
                setDownloadAuditId(auditId);
                const fd = new FormData();
                fd.set('auditId', auditId);
                startTransition(() => {
                  downloadReportAction(fd);
                });
              }}
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <div className="relative inline-block">
            <button 
              onClick={() => handleRerun(auditId)}
              disabled={rerunningAudits.has(auditId)}
              className="p-1 hover:bg-secondary rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title={rerunningAudits.has(auditId) ? "Re-running..." : "Re-run Audit"}
              aria-disabled={rerunningAudits.has(auditId)}
              aria-busy={rerunningAudits.has(auditId)}
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${rerunningAudits.has(auditId) ? 'animate-spin' : ''}`} />
            </button>
            {rerunConfirmId === auditId && (
              <div className="absolute right-0 mt-2 w-64 z-30 rounded-md border border-border bg-popover shadow-lg p-4 animate-in fade-in-0 zoom-in-95">
                <p className="text-sm font-medium text-foreground mb-2">Re-run this audit?</p>
                <p className="text-xs text-muted-foreground mb-3">This will move the audit to active audits and remove it from past audits.</p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRerunConfirmId(null)}
                    className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmRerun(auditId)}
                    className="px-2 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary/90"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border-2 border-border p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading audit history...</p>
        </div>
      </div>
    );
  }

  if (!loading && auditHistory.pagination.totalCount === 0) {
    return (
      <div className="bg-card rounded-lg border-2 border-border p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No audit history found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border-2 border-border overflow-hidden">
  {/* Audit Detail Modal */}
  <AuditDetailModal open={!!viewingAuditId} onClose={closeAuditDetail} audit={auditDetail} />
      {/* Hidden forms to call server actions */}
      <form ref={historyFormRef} action={historyAction} className="hidden" key={`hist-${currentPage}-${searchQuery}-${statusFilter.join(',')}-${severityFilter.join(',')}`}>
        <input type="hidden" name="requestId" value={`${currentPage}-${searchQuery}-${statusFilter.join(',')}-${severityFilter.join(',')}`} />
        <input type="hidden" name="page" value={String(currentPage)} />
        <input type="hidden" name="limit" value="20" />
        <input type="hidden" name="search" value={(searchQuery || '').trim()} />
        {statusFilter.length > 0 ? (
          statusFilter.map((s, idx) => (
            <input key={`status-${idx}`} type="hidden" name="status" value={s.toUpperCase()} />
          ))
        ) : null}
        {severityFilter.map((s, idx) => (
          <input key={`severity-${idx}`} type="hidden" name="severity" value={s.toUpperCase()} />
        ))}
  <button type="submit" aria-hidden="true" className="hidden" />
      </form>

      <form ref={viewFormRef} action={viewReportAction} className="hidden" key={`view-${viewAuditId ?? ''}`}>
        <input type="hidden" name="auditId" value={viewAuditId ?? ''} />
        <button type="submit" aria-hidden="true" className="hidden" />
      </form>

      <form ref={downloadFormRef} action={downloadReportAction} className="hidden" key={`dl-${downloadAuditId ?? ''}`}>
        <input type="hidden" name="auditId" value={downloadAuditId ?? ''} />
        <button type="submit" aria-hidden="true" className="hidden" />
      </form>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Project</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Size</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Severity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Findings</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Completed</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {auditHistory.audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-secondary/50">
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {audit.projectName}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.size}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(audit.status)}
                    <span className="text-sm text-muted-foreground">
                      {formatStatus(audit.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(audit.overallSeverity)}
                    <span>{formatSeverity(audit.overallSeverity)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.findingsCount}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.duration || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(audit.completedAt)}
                </td>
                <td className="px-6 py-4">
                  {getActionIcons(audit.status, audit.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-border bg-secondary/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {auditHistory.audits.length} of {auditHistory.pagination.totalCount} results
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={!auditHistory.pagination.hasPreviousPage}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary"
              onClick={() => {
                if (auditHistory.pagination.hasPreviousPage) {
                  setCurrentPage(prev => prev - 1);
                }
              }}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {auditHistory.pagination.currentPage} of {auditHistory.pagination.totalPages}
            </span>
            <button
              disabled={!auditHistory.pagination.hasNextPage}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary"
              onClick={() => {
                if (auditHistory.pagination.hasNextPage) {
                  setCurrentPage(prev => prev + 1);
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
