import { getCurrentSession } from '@/lib/server/session';
import SecurityComponents from './components';
import { getUserSessions } from './components/sessions/actions';
import { redirect } from 'next/navigation';

export default async function SecurityPage() {
  const { session, user } = await getCurrentSession();

  if (!user) {
    return redirect(`/sign-in`);
  }

  const sessions = await getUserSessions(user.id, session.id);

  return <SecurityComponents sessions={sessions} />;
}
