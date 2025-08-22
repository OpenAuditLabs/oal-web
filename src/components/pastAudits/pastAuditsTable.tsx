'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, CircleX, Eye, Download, RefreshCw } from "lucide-react";
import { getAuditHistory, type AuditHistoryItem } from "@/actions/audits";
import { AuditStatus, SeverityLevel } from "@prisma/client";
import { rerunAuditAction } from "@/actions/rerun-audit";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function AuditTable() {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await getAuditHistory({ page: 1, limit: 20 });
        
        setAuditHistory(historyData);
      } catch (error) {
        console.error('Error fetching audit data:', error);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    }).format(new Date(date));
  };

  const formatSeverity = (severity: SeverityLevel | null) => {
    if (!severity) return "N/A";
    return severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
  };

  const formatStatus = (status: AuditStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getActionIcons = (status: AuditStatus, auditId: string) => {
    if (status === "COMPLETED") {
      return (
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded"
            title="View Report"
            onClick={() => {
              console.log('View report for audit:', auditId);
            }}
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
          <form action={rerunAuditAction} className="inline">
            <input type="hidden" name="auditId" value={auditId} />
            <button 
              type="submit"
              className="p-1 hover:bg-secondary rounded"
              title="Re-run Audit"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </form>
        </div>
      );
    } else if (status === "FAILED") {
      return (
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded"
            title="View Report"
            onClick={() => {
              console.log('View failed audit:', auditId);
            }}
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          <form action={rerunAuditAction} className="inline">
            <input type="hidden" name="auditId" value={auditId} />
            <button 
              type="submit"
              className="p-1 hover:bg-secondary rounded"
              title="Re-run Audit"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </form>
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
                  {formatSeverity(audit.overallSeverity)}
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
                console.log('Previous page');
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
                console.log('Next page');
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
