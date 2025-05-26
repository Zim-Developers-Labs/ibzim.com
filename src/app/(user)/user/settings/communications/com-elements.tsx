'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { User } from 'lucia';
import { useTransition } from 'react';
import { updateUserCommunicationSettings } from '../actions';
import Link from 'next/link';

interface Preferences {
  ads: boolean;
  account: boolean;
  notifications: boolean;
}

export interface UserCommunicationSettings {
  email: string;
  whatsappNumber: string | null;
  preferences: Preferences;
}

function Toggler({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className="group focus:ring-primaryColor data-[checked]:bg-primaryColor relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      <span className="sr-only">Use setting</span>
      <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5">
        <span
          aria-hidden="true"
          className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in group-data-[checked]:opacity-0 group-data-[checked]:duration-100 group-data-[checked]:ease-out"
        >
          <svg
            fill="none"
            viewBox="0 0 12 12"
            className="h-3 w-3 text-gray-400"
          >
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-[checked]:opacity-100 group-data-[checked]:duration-200 group-data-[checked]:ease-in"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 12 12"
            className="text-primaryColor h-3 w-3"
          >
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </Switch>
  );
}

export default function ComElements({ user }: { user: User }) {
  const preferencesString = JSON.stringify(user.communicationSettings, null, 2);
  const parsedPreferences = JSON.parse(preferencesString) as {
    preferences: Preferences;
  };

  const pref = parsedPreferences.preferences;

  const [settings, setSettings] = useState<UserCommunicationSettings>({
    email: user.email,
    whatsappNumber: user.phoneNumber,
    preferences: {
      ads: pref.ads,
      account: pref.account,
      notifications: pref.notifications,
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleToggle = (key: string, subKey?: string) => {
    return (checked: boolean) => {
      startTransition(async () => {
        let newSettings: Partial<UserCommunicationSettings>;
        if (subKey) {
          newSettings = {
            preferences: {
              ...settings.preferences,
            },
          };
        } else {
          newSettings = {
            preferences: {
              ...settings.preferences,
              [key]: checked,
            },
          };
        }

        await updateUserCommunicationSettings(user.id, newSettings);
        setSettings((prev) => ({
          ...prev,
          ...newSettings,
        }));
      });
    };
  };

  return (
    <section>
      <div className="mb-6">
        <h3 className="mb-2 text-2xl">Communication Settings</h3>
        <p className="mb-1 text-sm text-gray-600">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Phone number:</strong>{' '}
          {user.phoneNumber ? (
            user.phoneNumber
          ) : (
            <Link href="/auth/onboarding">Add number</Link>
          )}
        </p>
      </div>
      <div className="mb-6">
        <h4 className="mb-4 text-xl">IBZim Premium</h4>
        <div className="rounded-lg bg-gray-100 p-4">
          <div className="flex gap-4">
            <div>
              <Toggler
                checked={settings.preferences.ads}
                onChange={handleToggle('ads')}
              />
            </div>
            <p className="text-sm">Popup ads (premium not avialable yet)</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="mb-4 text-xl">
          Notifications - Whatsapp & Email messages
        </h4>
        <div className="rounded-lg bg-gray-100 p-4">
          <div className="mb-2 flex gap-4">
            <div>
              <Toggler
                checked={settings.preferences.account}
                onChange={handleToggle('account')}
              />
            </div>
            <p className="text-sm">Important information about your aacount</p>
          </div>
          <div className="flex gap-4">
            <div>
              <Toggler
                checked={settings.preferences.notifications}
                onChange={handleToggle('notifications')}
              />
            </div>
            <p className="text-sm">
              Notifications about related ibzim activity
            </p>
          </div>
        </div>
      </div>
      {isPending && <p>Updating settings...</p>}
    </section>
  );
}
