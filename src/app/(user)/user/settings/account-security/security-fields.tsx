'use client';

import { User } from 'lucia';
import { changeEmail, changePassword } from '../actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paths } from '@/lib/constants';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function SecurityFields({ user }: { user: User }) {
  const [changeEmailState, changeEmailFormAction] = useActionState(
    changeEmail,
    null,
  );
  const [changePasswordState, changePasswordFormAction] = useActionState(
    changePassword,
    null,
  );
  const router = useRouter();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [showPassword4, setShowPassword4] = useState(false);

  useEffect(() => {
    if (changeEmailState?.fieldError) {
      Object.values(changeEmailState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (changeEmailState?.done) {
      toast.success('Email updated, verification required');
      changeEmailState.done = false;
      router.push(Paths.VerifyEmail);
    }

    if (changePasswordState?.fieldError) {
      Object.values(changePasswordState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (changePasswordState?.done) {
      toast.success('Password updated, login required');
      changePasswordState.done = false;
    }
  }, [changeEmailState, changePasswordState, router]);

  return (
    <div className="divide-y">
      <div className="mx-auto w-full max-w-[400px] pb-8">
        <h3 className="mb-2 text-3xl">Account Security</h3>
        <p className="mb-4 text-sm text-gray-600">{user.email}</p>
      </div>
      <form
        action={changeEmailFormAction}
        className="mx-auto w-full max-w-[400px] py-12 pb-12 md:col-span-2"
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="currentEmail" value={user.email} />
          <div className="col-span-full">
            <h4 className="mb-8 text-lg">Change your Email</h4>
            <div className="focus-within:ring-primaryColor rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-600"
              >
                New email
              </label>
              <input
                name="newEmail"
                type="email"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="col-span-full">
            <div className="focus-within:ring-primaryColor rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-600"
              >
                Confirm your New email
              </label>
              <input
                name="confirmNewEmail"
                type="email"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="col-span-full">
            <div className="focus-within:ring-primaryColor relative rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-600"
              >
                Your current password
              </label>
              <input
                name="currentPassword"
                type={showPassword1 ? 'text' : 'password'}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
              <div
                className="absolute right-0 bottom-0 cursor-pointer pr-4 pb-2"
                onClick={() => setShowPassword1((prev) => !prev)}
              >
                {showPassword1 ? (
                  <EyeSlashIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex">
            <SubmitButton
              type="submit"
              className="bg-primaryColor hover:bg-primaryColor/40 focus-visible:outline-primaryColor rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2"
            >
              Confirm&nbsp;email
            </SubmitButton>
          </div>
        </div>
      </form>
      <form
        action={changePasswordFormAction}
        className="mx-auto w-full max-w-[400px] py-12 md:col-span-2"
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div className="col-span-full">
            <h4 className="mb-2 text-lg">Change your Password</h4>
          </div>
          <input type="hidden" name="userId" value={user.id} />
          <div className="col-span-full">
            <div className="focus-within:ring-primaryColor relative rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
              <label
                htmlFor="current-password"
                className="block text-xs font-medium text-gray-600"
              >
                Current Password
              </label>
              <input
                name="currentPassword"
                type={showPassword2 ? 'text' : 'password'}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
              <div
                className="absolute right-0 bottom-0 cursor-pointer pr-4 pb-2"
                onClick={() => setShowPassword2((prev) => !prev)}
              >
                {showPassword2 ? (
                  <EyeSlashIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </div>
            </div>
          </div>
          <div className="col-span-full">
            <div className="focus-within:ring-primaryColor relative rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
              <label
                htmlFor="new-password"
                className="block text-xs font-medium text-gray-600"
              >
                New password
              </label>
              <input
                name="newPassword"
                type={showPassword3 ? 'text' : 'password'}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
              <div
                className="absolute right-0 bottom-0 cursor-pointer pr-4 pb-2"
                onClick={() => setShowPassword3((prev) => !prev)}
              >
                {showPassword3 ? (
                  <EyeSlashIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </div>
            </div>
          </div>
          <div className="col-span-full">
            <div className="focus-within:ring-primaryColor relative rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
              <label
                htmlFor="confirm-password"
                className="block text-xs font-medium text-gray-600"
              >
                Confirm new password
              </label>
              <input
                name="confirmNewPassword"
                type={showPassword4 ? 'text' : 'password'}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
              <div
                className="absolute right-0 bottom-0 cursor-pointer pr-4 pb-2"
                onClick={() => setShowPassword4((prev) => !prev)}
              >
                {showPassword4 ? (
                  <EyeSlashIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex">
            <SubmitButton
              type="submit"
              className="bg-primaryColor hover:bg-primaryColor/40 focus-visible:outline-primaryColor rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2"
            >
              Update&nbsp;Password
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
