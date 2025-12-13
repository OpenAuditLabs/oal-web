export interface PastAudit {
  id: string;
  title: string;
  createdAt: string;
  status: 'completed' | 'failed' | 'pending';
}
