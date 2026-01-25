'use client';

import { useActionState } from 'react';
import { updateEmailAction } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { DOMAIN_URLS } from '@/lib/constants';

const initialUpdateFormState = {
  message: '',
};

export default function ChangeEmailForm({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  const [state, action] = useActionState(
    updateEmailAction,
    initialUpdateFormState,
  );

  return (
    <form action={action} className="mx-auto max-w-[300px]">
      <div className="mb-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="form-email.email">New email</Label>
          <Input id="form-email.email" name="email" required type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form-email.email">Confirm new email</Label>
          <Input
            id="form-email.confirmEmail"
            name="confirmEmail"
            required
            type="email"
          />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button
          onClick={() => {
            window.open(callbackUrl ?? DOMAIN_URLS.MAIN(), '_self');
          }}
          variant="outline"
          className="col-span-1"
        >
          Cancel
        </Button>
        <SubmitButton className="bg-primaryColor hover:bg-primaryColor/80 col-span-1">
          Proceed
        </SubmitButton>
      </div>
      {state.message && (
        <p className="mb-4 w-full rounded-sm border border-red-200 bg-red-50 p-2 text-sm text-red-500">
          {state.message}
        </p>
      )}
    </form>
  );
}
