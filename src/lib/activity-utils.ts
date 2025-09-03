import { AuditStatus } from '@prisma/client'

// Helper function to format status for display
export function formatActivityStatus(status: AuditStatus): string {
  switch (status) {
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'QUEUED':
      return 'Queued'
    case 'COMPLETED':
      return 'Completed'
    case 'FAILED':
      return 'Failed'
    default:
      return status
  }
}

// Helper function to combine file info for display
export function formatFileInfo(fileCount: number, fileSize: string): string {
  return `${fileCount} files - ${fileSize}`
}
