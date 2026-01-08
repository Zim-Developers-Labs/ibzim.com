'use client';

import { useActionState, useEffect, useState } from 'react';
import {
  resendPhoneNumberVerificationCodeAction,
  verifyNumberAction,
} from './actions';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { SubmitButton } from '@/components/ui/submit-button';
import { Clock } from 'lucide-react';

const phoneNumberVerificationInitialState = {
  message: '',
};

export function PhoneNumberVerificationForm({
  callbackUrl,
  countryCode,
  verificationMethod,
}: {
  callbackUrl?: string;
  countryCode: string;
  verificationMethod: 'sms' | 'whatsapp';
}) {
  const [state, action] = useActionState(
    verifyNumberAction,
    phoneNumberVerificationInitialState,
  );
  const [otpValue, setOtpValue] = useState('');

  return (
    <form action={action} className="mx-auto max-w-[300px]">
      <input type="hidden" value={callbackUrl} name="callbackUrl" />
      <input type="hidden" value={countryCode} name="countryCode" />
      <input
        type="hidden"
        value={verificationMethod}
        name="verificationMethod"
      />
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

export function ResendPhoneNumberVerificationCodeForm() {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const cooldownEnd = localStorage.getItem('resendCooldownEndVPN');
    const lastAttemptTime = localStorage.getItem('lastResendAttemptVPN');
    const attemptCount = localStorage.getItem('resendAttemptCountVPN');

    // Reset attempt count if last attempt was more than 5 minutes ago
    if (lastAttemptTime) {
      const timeSinceLastAttempt =
        Date.now() - Number.parseInt(lastAttemptTime);
      if (timeSinceLastAttempt > 5 * 60 * 1000) {
        // 5 minutes
        localStorage.removeItem('resendAttemptCountVPN');
        localStorage.removeItem('lastResendAttemptVPN');
      }
    }

    if (cooldownEnd) {
      const remaining = Math.max(
        0,
        Math.floor((Number.parseInt(cooldownEnd) - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
    } else if (!attemptCount) {
      // Set initial 30 second cooldown on first visit
      const initialCooldownEnd = Date.now() + 30000;
      localStorage.setItem(
        'resendCooldownEndVPN',
        initialCooldownEnd.toString(),
      );
      setTimeLeft(30);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem('resendCooldownEndVPN');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('resendCooldownEndVPN');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    const attemptCount = Number.parseInt(
      localStorage.getItem('resendAttemptCountVPN') || '0',
    );
    const newAttemptCount = attemptCount + 1;

    // Calculate cooldown: 30s, 60s, 120s, 240s, 480s (capped at 8 minutes)
    const cooldownSeconds = Math.min(30 * Math.pow(2, attemptCount), 480);
    const cooldownEnd = Date.now() + cooldownSeconds * 1000;

    localStorage.setItem('resendCooldownEndVPN', cooldownEnd.toString());
    localStorage.setItem('resendAttemptCountVPN', newAttemptCount.toString());
    localStorage.setItem('lastResendAttemptVPN', Date.now().toString());
    setTimeLeft(cooldownSeconds);

    // TODO: remove local storage on success
    await resendPhoneNumberVerificationCodeAction();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <form action={handleSubmit}>
      <div className="space-y-4 text-center">
        <div className="text-sm leading-relaxed text-gray-600">
          Didn&#39;t receive the code? Check your spam folder or request a new
          one.
        </div>

        {timeLeft > 0 ? (
          <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="leading-0">
              Resend available in {formatTime(timeLeft)}
            </span>
          </div>
        ) : (
          <SubmitButton
            variant="ghost"
            className="text-primaryColor font-medium hover:bg-yellow-50"
          >
            Resend code
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
