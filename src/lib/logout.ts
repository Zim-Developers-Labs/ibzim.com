'use server';

import { globalPOSTRateLimit } from '@/lib/server/request';
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from '@/lib/server/session';
import { redirect } from 'next/navigation';

export async function logoutAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: 'Too many requests',
    };
  }
  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: 'Not authenticated',
    };
  }
  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  return redirect(`/sign-in`);
}

interface ActionResult {
  message: string;
}
