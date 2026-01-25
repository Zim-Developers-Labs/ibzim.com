'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { verifyPasswordResetEmailAction } from './actions';
import { useActionState, useState } from 'react';
import { SubmitButton } from '@/components/ui/submit-button';

const initialPasswordResetEmailVerificationState = {
  message: '',
};

export default function PasswordResetEmailVerificationForm() {
  const [state, action] = useActionState(
    verifyPasswordResetEmailAction,
    initialPasswordResetEmailVerificationState,
  );
  const [otpValue, setOtpValue] = useState('');

  return (
    <form action={action} className="mx-auto max-w-[300px]">
      <div className="mb-6 flex w-full items-center justify-center">
        <InputOTP
          maxLength={8}
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <input id="form-verify.code" name="code" type="hidden" value={otpValue} />
      {state.message && (
        <p className="mb-4 w-full rounded-sm border border-red-200 bg-red-50 p-2 text-sm text-red-500">
          {state.message}
        </p>
      )}
      <SubmitButton className="bg-primaryColor hover:bg-primaryColor/80 w-full rounded-sm text-white">
        Verify
      </SubmitButton>
    </form>
  );
}
