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


