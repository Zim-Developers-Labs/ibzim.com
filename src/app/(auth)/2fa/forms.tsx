'use client';

import { useActionState, useState } from 'react';
import { verify2FAAction } from './actions';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const initial2FAVerificationState = {
  message: '',
};

export function TwoFactorVerificationForm({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  const [state, action] = useActionState(
    verify2FAAction,
    initial2FAVerificationState,
  );
  const [code, setCode] = useState('');

  return (
    <form action={action} className="mx-auto max-w-xs space-y-4">
      <input type="hidden" value={callbackUrl} name="callbackUrl" />
      <input id="form-totp.code" name="code" type="hidden" value={code} />
      <div className="mb-6 flex w-full items-center justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
          autoComplete="one-time-code"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <br />
      <SubmitButton className="bg-primaryColor hover:bg-primaryColor/90 w-full px-4">
        Verify
      </SubmitButton>
      {state.message && (
        <p className="mb-4 w-full rounded-sm border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-500">
          {state.message}
        </p>
      )}
      <div className="mt-8 border-t border-gray-100 pt-4 text-center">
        <p className="text-muted-foreground text-center text-sm">
          Lost access to your authenticator app?
          <br />
          <Link href="/2fa/reset" className="text-foreground hover:underline">
            Use&nbsp;recovery&nbsp;code
            <ExternalLink className="ml-1 inline size-3" />
          </Link>
        </p>
      </div>
    </form>
  );
}
