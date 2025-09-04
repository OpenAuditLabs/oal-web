'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, CircleX, Eye, Download, RefreshCw, Flame, AlertTriangle, ShieldHalf, Info } from "lucide-react";
import { getAuditHistory, getAuditReport, type AuditHistoryItem } from "@/actions/audits";
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
  const [viewingAuditId, setViewingAuditId] = useState<string | null>(null);
  const [auditDetail, setAuditDetail] = useState<any | null>(null);
  const [auditDetailLoading, setAuditDetailLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const historyData = await getAuditHistory({ 
          page: currentPage, 
          limit: 20,
          search: searchQuery,
          status: statusFilter,
          severity: severityFilter
        });
        
        if (isMounted) {
          setAuditHistory(historyData);
        }
      } catch (error) {
        console.error('Error fetching audit data:', error);
        if (isMounted) {
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
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, statusFilter, severityFilter]);

  // Reset to first page when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, severityFilter]);

  const handleRerun = async (auditId: string) => {
    setRerunningAudits(prev => new Set(prev).add(auditId));
    
    try {
      const formData = new FormData();
      formData.set('auditId', auditId);
      await rerunAuditAction(formData);
      
      // Refresh the current page data with current search query and filters
      const historyData = await getAuditHistory({ 
        page: currentPage, 
        limit: 20,
        search: searchQuery,
        status: statusFilter,
        severity: severityFilter
      });
      setAuditHistory(historyData);
    } catch (error) {
      console.error('Failed to rerun audit:', error);
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

  const openAuditDetail = async (auditId: string) => {
    setViewingAuditId(auditId);
    setAuditDetail(null);
    setAuditDetailLoading(true);
    try {
      const detail = await getAuditReport(auditId);
      setAuditDetail(detail);
    } catch (e) {
      console.error('Failed to load audit detail', e);
    } finally {
      setAuditDetailLoading(false);
    }
  };

  const closeAuditDetail = () => {
    setViewingAuditId(null);
    setAuditDetail(null);
  };

  const getActionIcons = (status: AuditStatus, auditId: string) => {
    if (status === "COMPLETED") {
      return (
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded"
            title="View Report"
            onClick={() => openAuditDetail(auditId)}
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          <button 
            className="p-1 hover:bg-secondary rounded"
            title="Download Report"
            onClick={() => {
              console.log('Download report for audit:', auditId);
            }}
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>
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
        </div>
      );
    } else if (status === "FAILED") {
      return (
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded"
            title="View Report"
            onClick={() => openAuditDetail(auditId)}
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
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

  if (auditHistory.audits.length === 0) {
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
