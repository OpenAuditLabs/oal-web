'use server'

import { prisma } from '@/lib/prisma'
import { ActivityStatus } from '@prisma/client'

export interface ActivityData {
  id: string
  title: string
  fileCount: number
  fileSize: string
  status: ActivityStatus
  progress: number | null
  createdAt: Date
  updatedAt: Date
}

export async function getRecentActivities(limit: number = 10): Promise<ActivityData[]> {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
    
    return activities
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    return []
  }
}

export async function getActivityById(id: string): Promise<ActivityData | null> {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id }
    })
    
    return activity
  } catch (error) {
    console.error('Error fetching activity:', error)
    return null
  }
}

// Interface for audit cards (matching UI expectations)
export interface AuditCard {
  id: string;
  title: string;
  currentStatus: string;
  size: string;
  started: string;
  duration: string;
  progress: number;
  statusMessage: string;
  statusType: "active" | "queued";
}

// Helper function to format date for display
function formatDateForDisplay(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Add ordinal suffix to day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}; ${time}`;
}

// Helper function to calculate duration
function calculateDuration(startDate: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins}m`;
  } else {
    return `${diffMins}m`;
  }
}

// Get active and queued audits for the audits page
export async function getActiveAudits(): Promise<AuditCard[]> {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        status: {
          in: [ActivityStatus.IN_PROGRESS, ActivityStatus.QUEUED]
        }
      },
      orderBy: [
        { status: 'asc' }, // IN_PROGRESS first, then QUEUED
        { createdAt: 'desc' }
      ]
    })

    return activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      currentStatus: activity.status === ActivityStatus.IN_PROGRESS 
        ? `scanning files (${activity.fileCount} files)` 
        : 'in queue',
      size: activity.fileSize,
      started: formatDateForDisplay(activity.createdAt),
      duration: activity.status === ActivityStatus.IN_PROGRESS 
        ? calculateDuration(activity.createdAt) 
        : 'n/a',
      progress: activity.progress || (activity.status === ActivityStatus.QUEUED ? 0 : 50),
      statusMessage: activity.status === ActivityStatus.IN_PROGRESS 
        ? 'Analyzing security vulnerabilities and threat patterns...'
        : 'Queued for analysis...',
      statusType: activity.status === ActivityStatus.IN_PROGRESS ? 'active' as const : 'queued' as const
    }))
  } catch (error) {
    console.error('Error fetching active audits:', error)
    return []
  }
}


