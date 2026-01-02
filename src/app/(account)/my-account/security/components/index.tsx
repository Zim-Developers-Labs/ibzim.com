'use client';

import ChangePasswordForm from './change-password';
import { useUser } from '@/hooks/user-context';
import TwoFactorComponent from './2fa';
import SessionsManager from './sessions';
import { SessionData } from './sessions/actions';

export default function SecurityComponents({
  sessions,
}: {
  sessions: SessionData[];
}) {
  const { user, updateUser } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 md:min-w-md">
      <ChangePasswordForm user={user} updateUser={updateUser} />
      <TwoFactorComponent user={user} />
      <SessionsManager sessions={sessions} />
    </div>
  );
}
