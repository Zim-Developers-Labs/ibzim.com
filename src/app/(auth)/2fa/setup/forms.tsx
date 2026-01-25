'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { setup2FAAction } from './actions';

const initial2FASetUpState = {
  message: '',
};

export default function TwoFactorSetUpForm(props: {
  encodedTOTPKey: string;
  setCurrentStep: any;
  currentStep: any;
  callbackUrl?: string;
}) {
  const [state, action] = useActionState(setup2FAAction, initial2FASetUpState);
  const { setCurrentStep, currentStep } = props;
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const handleStepOneContinue = () => {
    setCurrentStep(2);
  };

  const handleStepTwoBack = () => {
    setCurrentStep(1);
  };

  return (
    <form action={action} className="space-y-4">
      <input
        name="key"
        type="hidden"
        value={props.encodedTOTPKey}
        hidden
        required
      />
      <input type="hidden" value={props.callbackUrl} name="callbackUrl" />
      {currentStep === 2 && <Input id="form-totp.code" name="code" required />}
      <br />
      {state.message && currentStep == 2 && (
        <p className="mb-4 w-full rounded-sm border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-500">
          {state.message}
        </p>
      )}
      {currentStep === 1 && (
        <div className="flex w-full items-center justify-between gap-2">
          <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-100"
              >
                Skip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <DialogTitle className="text-center text-xl">
                  Are you sure you want to skip?
                </DialogTitle>
                <DialogDescription className="text-center leading-relaxed">
                  Your account handles payments and money. Without two-factor
                  authentication, hackers could easily break into your account
                  and steal your funds or personal information. We strongly
                  recommend setting up 2FA to keep your account safe.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSkipDialog(false)}
                  className="w-full"
                >
                  Go back and set up 2FA
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    window.location.href = props.callbackUrl || '/continue';
                  }}
                  className="w-full"
                >
                  Skip anyway (not recommended)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            onClick={handleStepOneContinue}
            className="bg-primaryColor hover:bg-primaryColor/80 flex-1 cursor-pointer text-zinc-900"
          >
            Continue
          </Button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex w-full items-center justify-between gap-2 text-zinc-600">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={handleStepTwoBack}
          >
            Back
          </Button>
          <SubmitButton className="bg-primaryColor hover:bg-primaryColor/80 flex-1 cursor-pointer text-zinc-900">
            Complete
          </SubmitButton>
        </div>
      )}
    </form>
  );
}
