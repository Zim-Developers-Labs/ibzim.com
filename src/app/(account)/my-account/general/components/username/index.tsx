'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/server/constants';
import { useActionState, useEffect, useState } from 'react';
import { checkUsernameAvailability, updateUsername } from './actions';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/ui/submit-button';
import { Check, CheckCircle, Loader2, Pencil, X, XCircle } from 'lucide-react';
import { usernameSchema } from './validators';

const initialUpdateFormState = {
  error: '',
  done: false,
};

type ValidationState =
  | 'idle'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'invalid';

export default function UserNameField({
  user,
  updateUser,
}: {
  user: User;
  updateUser: (data: Partial<User>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [state, action] = useActionState(
    updateUsername,
    initialUpdateFormState,
  );

  const [validationState, setValidationState] =
    useState<ValidationState>('idle');
  const [validationError, setValidationError] = useState<string>('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    if (state.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (state.formError) {
      toast.error(state.formError);
    } else if (state.done) {
      toast.success('Username updated successfully');
      updateUser({ username: username });
      setIsEditing(false);
    }
  }, [state]);

  useEffect(() => {
    if (!isEditing) return;

    // Reset validation state if username is empty
    if (!username || username.trim() === '') {
      setValidationState('invalid');
      setValidationError('Username is required');
      return;
    }

    // Check format validation first (client-side)
    const formatValidation = usernameSchema.safeParse({ username });

    if (!formatValidation.success) {
      const err = formatValidation.error.flatten();
      setValidationState('invalid');
      setValidationError(err.fieldErrors.username?.[0] || 'Invalid username');
      return;
    }

    // If format is valid, check availability with debouncing
    setValidationState('checking');
    setValidationError('');

    const timeoutId = setTimeout(async () => {
      setIsCheckingAvailability(true);
      try {
        const result = await checkUsernameAvailability(username);

        if (result.available) {
          setValidationState('available');
          setValidationError('');
        } else {
          setValidationState('unavailable');
          setValidationError(result.error || 'Username is not available');
        }
      } catch (error) {
        setValidationState('invalid');
        setValidationError('Error checking username availability');
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 2000); // 2000ms debounce

    return () => clearTimeout(timeoutId);
  }, [username, isEditing]);

  const handleCancel = (e: any) => {
    e.preventDefault();
    setIsEditing(false);
    setUsername(user.username);
    setValidationState('idle');
    setValidationError('');
  };

  const isSaveDisabled =
    validationState !== 'available' || isCheckingAvailability;

  const getInputClassName = () => {
    if (validationState === 'available') {
      return 'border-green-500 focus-visible:ring-green-500';
    }
    if (validationState === 'unavailable' || validationState === 'invalid') {
      return 'border-red-500 focus-visible:ring-red-500';
    }
    return '';
  };

  const getValidationIcon = () => {
    if (validationState === 'checking' || isCheckingAvailability) {
      return <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />;
    }
    if (validationState === 'available') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (validationState === 'unavailable' || validationState === 'invalid') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Card className="rounded-md shadow-none">
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">Username</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Enter a username which will be used on your profile url.
            </p>

            {isEditing ? (
              <form className="space-y-3" action={action}>
                <input type="hidden" name="userId" value={user.id} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative col-span-2 max-w-md sm:col-span-1">
                    <Input
                      type="text"
                      value={username}
                      name="username"
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={48}
                      className={getInputClassName()}
                    />
                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                      {getValidationIcon()}
                    </div>
                  </div>
                </div>
                {validationError && (
                  <p className="text-sm text-red-500">{validationError}</p>
                )}
                <p className="text-muted-foreground text-xs">
                  Please use 48 characters at maximum. Only letters, numbers,
                  underscores, and hyphens are allowed.
                </p>
                <div className="flex gap-2">
                  <SubmitButton size="sm" disabled={isSaveDisabled}>
                    <Check className="mr-1 inline h-4 w-4" />
                    Save
                  </SubmitButton>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-sm">{user.username}</p>
                <p className="text-muted-foreground text-xs">
                  Please use 21 characters at maximum.
                </p>
              </div>
            )}
          </div>

          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="ml-4"
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
