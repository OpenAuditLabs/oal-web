import type { AuditWithProject } from '@/actions/audits/getAuditList/logic'
import { AuditsList } from '../../models/audits/AuditsList'

export interface AuditsContainerProps {
  audits: AuditWithProject[]
}

export function AuditsContainer({ audits }: AuditsContainerProps) {
  return <AuditsList audits={audits} />
}
