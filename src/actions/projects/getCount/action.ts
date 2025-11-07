'use server';

import { getSession } from '@/lib/session';
import { getProjectCountForUser } from './logic';
import { unwrapResult } from '@/lib/action-unwrap';

export async function getCount(): Promise<number> {
  const session = await getSession();
  if (!session.user?.id) {
    return 0;
  }

  const result = await getProjectCountForUser(session.user.id);
  return unwrapResult(result);
}
