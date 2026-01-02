'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TwoFactorSetUpForm from './forms';
import { Icons } from '@/components/icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

export default function TwoFAComponents(props: {
  encodedTOTPKey: string;
  qrcode: string;
  callbackUrl?: string;
}) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(props.encodedTOTPKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md border border-zinc-200 bg-white shadow-none">
        <CardHeader className="space-y-4 pb-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
            <Icons.brandedShield className="h-10 w-10 text-zinc-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Set up 2FA Authentication
            </CardTitle>
            <CardDescription className="leading-relaxed text-gray-600">
              {currentStep === 1
                ? 'Scan the QR code with your authenticator app'
                : 'Enter the code from your authenticator app'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="mx-auto hidden w-fit md:block">
                <div
                  style={{
                    width: '200px',
                    height: '200px',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: props.qrcode,
                  }}
                ></div>
              </div>

              <div className="space-y-2">
                <p className="text-center text-sm font-medium text-gray-700 md:hidden">
                  Enter this code in your authenticator app:
                </p>
                <p className="hidden text-center text-sm font-medium text-gray-700 md:block">
                  Or manually enter this code:
                </p>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="group relative w-full cursor-pointer rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-100"
                >
                  <div className="flex items-center justify-center gap-3">
                    <p className="font-mono text-sm break-all text-zinc-900">
                      {props.encodedTOTPKey}
                    </p>
                    {copied ? (
                      <Check className="h-5 w-5 shrink-0 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-700" />
                    )}
                  </div>
                  {copied && (
                    <span className="absolute inset-x-0 -bottom-6 text-center text-xs text-green-600">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
          <TwoFactorSetUpForm
            encodedTOTPKey={props.encodedTOTPKey}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            callbackUrl={props.callbackUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
