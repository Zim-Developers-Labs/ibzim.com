'use client';

import { useActionState, useEffect } from 'react';
import type { User } from 'lucia';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrganizerProfile } from '@/server/db/schema';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  updateOrganizerCallsNumber,
  updateOrganizerEmail,
  updateOrganizerName,
  updateOrganizerWhatsappNumber,
} from './actions';
import { toast } from 'sonner';

export default function OrganizerFields({
  organizer,
}: {
  user: User;
  organizer: OrganizerProfile;
}) {
  const [nameState, nameAction] = useActionState(updateOrganizerName, null);
  const [emailState, emailAction] = useActionState(updateOrganizerEmail, null);
  const [whatsappNumberState, whatsappNumberAction] = useActionState(
    updateOrganizerWhatsappNumber,
    null,
  );
  const [callsNumberState, callsNumberAction] = useActionState(
    updateOrganizerCallsNumber,
    null,
  );

  useEffect(() => {
    if (nameState?.fieldError) {
      Object.values(nameState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (nameState?.done) {
      toast.success('Name updated successfully');
      nameState.done = false;
    }

    if (emailState?.fieldError) {
      Object.values(emailState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (emailState?.done) {
      toast.success('Email updated successfully');
      emailState.done = false;
    }

    if (whatsappNumberState?.fieldError) {
      Object.values(whatsappNumberState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (whatsappNumberState?.done) {
      toast.success('Whatsapp Number updated successfully');
      whatsappNumberState.done = false;
    }

    if (callsNumberState?.fieldError) {
      Object.values(callsNumberState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (callsNumberState?.done) {
      toast.success('Calls Number updated successfully');
      callsNumberState.done = false;
    }
  }, [nameState, emailState, whatsappNumberState, callsNumberState]);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      {!organizer.profileCompleted && (
        <div className="w-full rounded-md bg-teal-200 px-4 py-4 md:px-6">
          <h2 className="mb-2 flex items-center gap-1 text-sm font-medium sm:text-base">
            <Info className="h-4 w-fit" strokeWidth={2} />
            <span>Organizer profile</span>
          </h2>
          <p className="rounded-sm bg-teal-600 p-2 text-xs text-white sm:text-sm">
            To be able to create and edit events on the IBZim Calendar you must
            complete your organizer profile
          </p>
        </div>
      )}

      {/* Individual Form Fields */}

      {/* Display Name Form */}
      <form action={nameAction} className="rounded-lg border bg-white p-6">
        <input type="hidden" name="organizerId" value={organizer.id} />
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">
            Display Name
          </Label>
          <p className="text-sm text-gray-600">
            Please enter your full name, or a display name you are comfortable
            with.
          </p>
          <Input
            id="name"
            name="name"
            defaultValue={organizer.name || ''}
            placeholder="Enter your display name"
            maxLength={32}
            className="mt-2"
          />
          <p className="text-xs text-gray-500">
            Please use 32 characters at maximum.
          </p>
        </div>
        <SubmitButton className="mt-4 bg-gray-900 px-6 py-2 text-white hover:bg-gray-800">
          Save
        </SubmitButton>
      </form>

      {/* Email Form */}
      <form action={emailAction} className="rounded-lg border bg-white p-6">
        <input type="hidden" name="organizerId" value={organizer.id} />
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium">
            Email Address
          </Label>
          <p className="text-sm text-gray-600">
            Your email address for event-related communications.
          </p>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={organizer.email || ''}
            placeholder="Enter your email address"
            className="mt-2"
          />
        </div>
        <SubmitButton className="mt-4 bg-gray-900 px-6 py-2 text-white hover:bg-gray-800">
          Save
        </SubmitButton>
      </form>

      {/* WhatsApp Number Form */}
      <form
        action={whatsappNumberAction}
        className="rounded-lg border bg-white p-6"
      >
        <input type="hidden" name="organizerId" value={organizer.id} />
        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-base font-medium">
            WhatsApp Number
          </Label>
          <p className="text-sm text-gray-600">
            Your WhatsApp number for quick event coordination.
          </p>
          <Input
            id="whatsapp"
            type="tel"
            name="phoneNumber"
            defaultValue={organizer.whatsappPhoneNumber || ''}
            placeholder="Enter your WhatsApp number"
            className="mt-2"
          />
        </div>
        <SubmitButton className="mt-4 bg-gray-900 px-6 py-2 text-white hover:bg-gray-800">
          Save
        </SubmitButton>
      </form>

      {/* Phone Number Form */}
      <form
        action={callsNumberAction}
        className="rounded-lg border bg-white p-6"
      >
        <input type="hidden" name="organizerId" value={organizer.id} />
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number
          </Label>
          <p className="text-sm text-gray-600">
            Your phone number for voice calls and event coordination.
          </p>
          <Input
            id="phone"
            type="tel"
            name="phoneNumber"
            defaultValue={organizer.callsPhoneNumber || ''}
            placeholder="Enter your phone number"
            className="mt-2"
          />
        </div>
        <SubmitButton className="mt-4 bg-gray-900 px-6 py-2 text-white hover:bg-gray-800">
          Save
        </SubmitButton>
      </form>
    </div>
  );
}
