"use server";

import { prisma } from '@/lib/prisma';
import { AuditStatus } from '@prisma/client';

export interface ActiveAuditCard {
  id: string;
  title: string; // projectName
  currentStatus: string;
  size: string;
  started: string;
  duration: string;
  progress: number;
  statusMessage: string;
  statusType: 'active' | 'queued';
}

// Unified recent activity (formerly ActivityData) representing audits across all statuses
export interface ActivityData {
  id: string;
  title: string;
  fileCount: number;
  size: string;
  status: AuditStatus;
  progress: number | null;
  createdAt: Date;
  updatedAt: Date;
}

function formatDateForDisplay(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const getOrdinalSuffix = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}; ${time}`;
}

function calculateDuration(startDate: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return diffHours > 0 ? `${diffHours}h ${diffMins}m` : `${diffMins}m`;
}

export async function getActiveAuditsCards(): Promise<ActiveAuditCard[]> {
  try {
    const audits = await prisma.audit.findMany({
      where: { status: { in: [AuditStatus.IN_PROGRESS, AuditStatus.QUEUED] } },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return audits.map(audit => ({
      id: audit.id,
      title: audit.projectName,
      currentStatus: audit.status === AuditStatus.IN_PROGRESS ? `scanning files (${audit.fileCount ?? 0} files)` : 'in queue',
      size: audit.size,
      started: formatDateForDisplay(audit.createdAt),
      duration: audit.status === AuditStatus.IN_PROGRESS ? calculateDuration(audit.createdAt) : 'n/a',
      progress: Math.min(100, Math.max(0, audit.progress ?? 0)),
      statusMessage: audit.status === AuditStatus.IN_PROGRESS ? 'Analyzing security vulnerabilities and threat patterns...' : 'Queued for analysis...',
      statusType: audit.status === AuditStatus.IN_PROGRESS ? 'active' : 'queued'
    }));
  } catch (e) {
    console.error('Error fetching active audits:', e);
    return [];
  }
}

export async function getRecentActivities(limit: number = 10): Promise<ActivityData[]> {
  try {
    const safeLimit = Math.max(1, Math.min(100, Math.floor(Number.isFinite(limit) ? limit : 10)));
    const audits = await prisma.audit.findMany({
      where: {
        status: { in: [AuditStatus.IN_PROGRESS, AuditStatus.QUEUED, AuditStatus.COMPLETED, AuditStatus.FAILED] }
      },
      orderBy: { updatedAt: 'desc' },
      take: safeLimit,
      select: {
        id: true,
        projectName: true,
        fileCount: true,
        size: true,
        status: true,
        progress: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return audits.map(a => ({
      id: a.id,
      title: a.projectName,
      fileCount: a.fileCount ?? 0,
      size: a.size,
      status: a.status,
      progress: a.progress,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    }));
  } catch (e) {
    console.error('Error fetching recent audit activities:', e);
    return [];
  }
}

export async function updateActiveAuditStatus(id: string, newStatus: 'active' | 'queued'): Promise<ActiveAuditCard | null> {
  try {
    if (!id) throw new Error('Audit id required');
    const mapped = newStatus === 'active' ? AuditStatus.IN_PROGRESS : AuditStatus.QUEUED;
    const audit = await prisma.audit.update({ where: { id }, data: { status: mapped } });
    return {
      id: audit.id,
      title: audit.projectName,
      currentStatus: audit.status === AuditStatus.IN_PROGRESS ? `scanning files (${audit.fileCount ?? 0} files)` : 'in queue',
      size: audit.size,
      started: formatDateForDisplay(audit.createdAt),
      duration: audit.status === AuditStatus.IN_PROGRESS ? calculateDuration(audit.createdAt) : 'n/a',
      progress: Math.min(100, Math.max(0, audit.progress ?? 0)),
      statusMessage: audit.status === AuditStatus.IN_PROGRESS ? 'Analyzing security vulnerabilities and threat patterns...' : 'Queued for analysis...',
      statusType: audit.status === AuditStatus.IN_PROGRESS ? 'active' : 'queued'
    };
  } catch (e) {
    console.error('Error updating active audit status:', e);
    return null;
  }
}

export async function removeActiveAudit(id: string): Promise<{ id: string; deleted: boolean }> {
  try {
    // Only allow deletion of QUEUED audits to avoid losing historical data
    const audit = await prisma.audit.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!audit) {
      return { id, deleted: false };
    }

    if (audit.status !== AuditStatus.QUEUED) {
      console.warn(`Attempted delete blocked for audit ${id} with status ${audit.status}`);
      return { id, deleted: false };
    }

    await prisma.audit.delete({ where: { id } });
    return { id, deleted: true };
  } catch (e) {
    console.error('Error removing active audit:', e);
    return { id, deleted: false };
  }
}
