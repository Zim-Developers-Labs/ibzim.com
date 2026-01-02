'use client';

import { useUser } from '@/hooks/user-context';
import UserNameField from './username';
import DeleteAccountField from './delete-account';

export type AccountDatatType = {
  username: string;
};

export default function AccountComponents() {
  const { user, updateUser } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <UserNameField updateUser={updateUser} user={user} />
      <DeleteAccountField user={user} />
    </div>
  );
}
