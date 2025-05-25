'use client';

import { SubmitButton } from '@/components/ui/submit-button';
import { completeProfile } from '@/lib/auth/actions';
import { useActionState, useEffect, useState } from 'react';
import { cities, countries } from '@/lib/constants';
import { toast } from 'sonner';
import { User } from 'lucia';

export default function About({
  user,
  callbackUrl,
}: {
  user: User;
  callbackUrl?: string;
}) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [state, formAction] = useActionState(completeProfile, null);

  useEffect(() => {
    if (state?.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    }
    if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="mx-auto flex w-full max-w-[400px] flex-col gap-4 rounded-lg border border-gray-200 px-4 py-6"
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl || '/'} />
      <input type="hidden" name="userId" value={user.id} />

      <div>
        <label
          htmlFor="username"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Username{' '}
          <span className="text-xs text-gray-600">
            (Can be edited in settings)
          </span>
        </label>
        <div className="focus-within:ring-primaryColor flex rounded-sm shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2 focus-within:ring-inset sm:max-w-md">
          <span className="flex items-center pl-3 text-gray-500 select-none sm:text-sm">
            @
          </span>
          <input
            id="username"
            name="username"
            value={user.username}
            disabled={true}
            type="text"
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="country"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Country
        </label>
        <select
          id="country"
          name="country"
          defaultValue={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="focus:ring-primaryColor mt-2 block w-full rounded-sm border-0 py-1.5 pr-10 pl-3 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 sm:text-sm/6"
        >
          {countries.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
      </div>

      {(selectedCountry === 'Zimbabwe' ||
        selectedCountry === 'South Africa') && (
        <div className="col-span-full">
          <label
            htmlFor="city"
            className="block text-sm/6 font-medium text-gray-900"
          >
            City
          </label>
          <select
            id="city"
            name="city"
            defaultValue={
              selectedCountry === 'Zimbabwe' ? 'Harare' : 'Johannesburg'
            }
            className="focus:ring-primaryColor mt-2 block w-full rounded-sm border-0 py-1.5 pr-10 pl-3 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 sm:text-sm/6"
          >
            {cities[selectedCountry as keyof typeof cities].map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
      )}
      <SubmitButton className="bg-primaryColor hover:bg-primaryColor/70 block w-full rounded-sm py-2 text-white">
        Continue
      </SubmitButton>
    </form>
  );
}
