'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { getAuditList } from '@/actions/audits/getAuditList/logic'
import type { AuditWithProject, AuditStatus } from '@/types/audit'
import { AuditsList } from '../../models/audits/AuditsList'
import { Input } from '../../ui/input'
import { Skeleton } from '../../ui/skeleton'
import { Button } from '../../ui/button'
import { useState, useEffect, useRef, useCallback } from 'react'

export interface AuditsContainerProps {}

export function AuditsContainer({}: AuditsContainerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchTerm])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      setDebouncedSearchTerm(searchTerm)
    }
  }

  // For demonstration, log the debounced search term
  useEffect(() => {
    console.log('Debounced Search Term:', debouncedSearchTerm)
  }, [debouncedSearchTerm])

  return (
    <div className="p-10 space-y-8">
      <Input
        type="text"
        placeholder="Search audits..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="max-w-sm"
      />
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <AuditsList audits={audits} />
      )}
    </div>
  )
}
