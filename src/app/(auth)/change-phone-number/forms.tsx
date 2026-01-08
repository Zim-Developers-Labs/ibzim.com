'use client';

import type React from 'react';

import { useActionState, useEffect, useState } from 'react';
import { updatePhoneNumberAction } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DOMAIN_URLS } from '@/lib/constants';
import type { User } from '@/lib/server/constants';
import ReactCountryFlag from 'react-country-flag';
import { ExternalLink, MessageCircle, MessageSquare } from 'lucide-react';
import { countryCodes } from './constants';
import Link from 'next/link';
import { toast } from 'sonner';
import { validatePhoneNumber } from './phone-validation';
import { CountryCode } from 'libphonenumber-js';

const initialUpdateFormState = {
  message: '',
  fieldError: undefined,
  formError: '',
  error: '',
  done: false,
};

export default function ChangePhoneNumberForm({
  user,
  callbackUrl,
}: {
  callbackUrl?: string;
  user: User;
}) {
  const [state, action] = useActionState(
    updatePhoneNumberAction,
    initialUpdateFormState,
  );
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [verificationMethod, setVerificationMethod] = useState<
    'whatsapp' | 'sms'
  >('whatsapp');

  useEffect(() => {
    if (state.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (state.formError) {
      toast.error(state.formError);
    } else if (state.done) {
      toast.success('Verification text sent check your whatsapp');
    }
    setIsDialogOpen(false);
  }, [state]);

  const handleProceed = (e: React.MouseEvent) => {
    e.preventDefault();
    const result = validatePhoneNumber(
      phoneNumber,
      selectedCountry.code as CountryCode,
    );

    if (!result.isValid) {
      setValidationError(result.error || 'Invalid phone number');
      toast.error(result.error || 'Invalid phone number');
      return;
    }

    setValidationError('');
    setIsDialogOpen(true);
  };

  const getDisplayNumber = () => {
    if (!phoneNumber) return selectedCountry.dialCode;

    const result = validatePhoneNumber(
      phoneNumber,
      selectedCountry.code as CountryCode,
    );
    return result.isValid && result.internationalFormat
      ? result.internationalFormat
      : `${selectedCountry.dialCode} ${phoneNumber}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d+\-\s()]/g, '');
    setPhoneNumber(cleaned);

    if (validationError) {
      setValidationError('');
    }
  };

  const handleBlur = () => {
    if (!phoneNumber) return;

    const result = validatePhoneNumber(
      phoneNumber,
      selectedCountry.code as CountryCode,
    );
    if (!result.isValid) {
      setValidationError(result.error || 'Invalid phone number');
    } else {
      setValidationError('');
    }
  };

  const isProceedDisabled =
    !phoneNumber || phoneNumber.length < 3 || !!validationError;

  return (
    <>
      <div className="mx-auto max-w-[300px]">
        <div className="mb-4">
          <Tabs
            value={verificationMethod}
            onValueChange={(value) =>
              setVerificationMethod(value as 'whatsapp' | 'sms')
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="whatsapp" className="relative gap-1.5">
                <span>WhatsApp</span>
                {verificationMethod === 'whatsapp' && (
                  <span className="absolute -top-3 -right-2 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Recommended
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sms" className="gap-1.5">
                <span>SMS</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country-select">Country</Label>
            <Select
              value={selectedCountry.code}
              onValueChange={(value) => {
                const country = countryCodes.find((c) => c.code === value);
                if (country) {
                  setSelectedCountry(country);
                  if (phoneNumber) {
                    const result = validatePhoneNumber(
                      phoneNumber,
                      value as CountryCode,
                    );
                    setValidationError(
                      result.isValid
                        ? ''
                        : result.error || 'Invalid phone number',
                    );
                  }
                }
              }}
            >
              <SelectTrigger id="country-select" className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={selectedCountry.code}
                      svg
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                      }}
                    />
                    <span>{selectedCountry.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                        }}
                      />
                      <span>
                        {country.name} ({country.dialCode})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-phone-number.phoneNumber">
              {verificationMethod === 'whatsapp'
                ? 'WhatsApp number'
                : 'Mobile number'}
            </Label>
            <div className="flex gap-2">
              <div className="border-input bg-muted flex items-center justify-center rounded-md border px-3 text-sm font-medium">
                {selectedCountry.dialCode}
              </div>
              <div className="flex-1">
                <Input
                  id="form-phone-number.phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onBlur={handleBlur}
                  required
                  type="tel"
                  placeholder={
                    verificationMethod === 'whatsapp'
                      ? 'Enter WhatsApp number'
                      : 'Enter mobile number'
                  }
                  className={validationError ? 'border-red-500' : ''}
                />
                {validationError && (
                  <p className="text-destructive mt-1 text-xs">
                    {validationError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              window.open(callbackUrl ?? DOMAIN_URLS.MAIN(), '_self');
            }}
            variant="outline"
            className="col-span-1"
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceed}
            disabled={isProceedDisabled}
            className="bg-primaryColor hover:bg-primaryColor/80 col-span-1"
            type="button"
          >
            Proceed
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Need help?{' '}
            <Link
              href="https://wa.me/+263717238876"
              target="_blank"
              rel="nofollow"
              className="text-foreground hover:underline"
            >
              Contact&nbsp;Support
              <ExternalLink className="ml-1 inline size-3" />
            </Link>
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Phone Number</DialogTitle>
            <DialogDescription>
              Please verify your phone number before proceeding.
            </DialogDescription>
          </DialogHeader>

          <form action={action}>
            <input type="hidden" name="phoneNumber" value={phoneNumber} />
            <input
              type="hidden"
              name="countryCode"
              value={selectedCountry.code}
            />
            <input
              type="hidden"
              name="verificationMethod"
              value={verificationMethod}
            />
            <input type="hidden" value={callbackUrl} name="callbackUrl" />

            <div className="space-y-4 pb-4">
              <div className="border-border bg-muted/50 rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={selectedCountry.code}
                    svg
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                    }}
                  />
                  <span className="font-semibold">{selectedCountry.name}</span>
                </div>
                <p className="font-mono">{getDisplayNumber()}</p>
              </div>

              {/* Confirmation question */}
              <div className="border-border bg-background rounded-lg border p-4">
                <p className="text-foreground text-sm font-medium">
                  Is this phone number correct?
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Please double-check before confirming. This number will be
                  used for{' '}
                  {verificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}{' '}
                  verification.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDialogOpen(false);
                }}
                type="button"
              >
                Go Back
              </Button>
              <SubmitButton className="bg-primaryColor hover:bg-primaryColor/80">
                Yes, Confirm
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
