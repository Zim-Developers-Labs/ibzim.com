'use client';

import { Label } from '@/components/ui/label';
import { forgotPasswordAction } from './actions';
import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';

const initialForgotPasswordState = {
  message: '',
};

export function ForgotPasswordForm() {
  const [state, action] = useActionState(
    forgotPasswordAction,
    initialForgotPasswordState,
  );
  return (
    <form action={action}>
      <div className="mx-auto mb-4 max-w-[300px]">
        <Input
          type="email"
          id="form-forgot.email"
          name="email"
          required
          placeholder="yourmail@example.com"
        />
        {state.message && (
          <p className="mt-4 mb-4 w-full rounded-sm border border-red-200 bg-red-50 p-2 text-sm text-red-500">
            {state.message}
          </p>
        )}
      </div>
      <br />
      <SubmitButton className="bg-primaryColor hover:bg-primaryColor/90 mx-auto block px-12">
        Send
      </SubmitButton>
    </form>
  );
}
