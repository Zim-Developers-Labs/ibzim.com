'use client';

import { useActionState } from 'react';
import { reset2FAAction } from './actions';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';

const initial2FAResetState = {
  message: '',
};

export function TwoFactorResetForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action] = useActionState(reset2FAAction, initial2FAResetState);
  return (
    <form action={action} className="mx-auto max-w-xs space-y-4">
      <input type="hidden" value={callbackUrl} name="callbackUrl" />
      <Input id="form-totp.code" name="code" required />
      <br />
      <SubmitButton className="bg-primaryColor hover:bg-primaryColor/90 w-full px-4">
        Verify
      </SubmitButton>
      {state.message && (
        <p className="mb-4 w-full rounded-sm border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-500">
          {state.message}
        </p>
      )}
    </form>
  );
}
