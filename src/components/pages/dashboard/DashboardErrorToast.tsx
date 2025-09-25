'use client'

import { useEffect } from 'react'
import { toast } from '@/components/ui/sonner'

export function DashboardErrorToast({ show }: { show: boolean }) {
  useEffect(() => {
    if (show) {
      toast.error('Error fetching data')
    }
  }, [show])

  return null
}
