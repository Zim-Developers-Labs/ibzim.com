'use client';

import { Input } from '@/components/ui/input';
import { resetPasswordAction } from './actions';
import { useActionState, useEffect, useState } from 'react';
import { SubmitButton } from '@/components/ui/submit-button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const initialPasswordResetState = {
  message: '',
};

export function PasswordResetForm() {
  const [state, action] = useActionState(
    resetPasswordAction,
    initialPasswordResetState,
  );
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = (index: number) => {
    if (passwordStrength >= index + 1) {
      if (passwordStrength === 1) return 'bg-red-500';
      if (passwordStrength === 2) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    return 'bg-gray-200';
  };

  return (
    <form action={action}>
      <div className="mx-auto mb-4 max-w-[300px]">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="form-reset.password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <div
              className="cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <div className="flex items-center gap-1 text-xs">
                  <EyeOffIcon className="size-4" />
                  Hide
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs">
                  <EyeIcon className="size-4" />
                  Show
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-1 w-1/4 rounded-full transition-all duration-300 ${getStrengthColor(index)}`}
            />
          ))}
        </div>
        {password !== '' && (
          <p className="mt-1 text-sm text-gray-500">
            {passwordStrength < 2 && 'Password is too weak'}
            {passwordStrength === 2 && 'Password strength is moderate'}
            {passwordStrength > 2 && 'Password is strong'}
          </p>
        )}
        {state.message && (
          <p className="mt-4 mb-4 w-full rounded-sm border border-red-200 bg-red-50 p-2 text-sm text-red-500">
            {state.message}
          </p>
        )}
      </div>
      <br />
      <SubmitButton className="bg-primaryColor hover:bg-primaryColor/90 mx-auto block px-12">
        Reset password
      </SubmitButton>
    </form>
  );
}
