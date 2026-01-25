'ue client';

import { useActionState, useEffect, useState } from 'react';
import { ProfileDataType } from '.';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';
import { updateDisplayName } from '../actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { toast } from 'sonner';
import { User } from '@/lib/server/constants';

const initialUpdateFormState = {
  error: '',
  done: false,
};

export default function DisplayNameField({
  user,
  setProfileData,
  updateUser,
}: {
  user: User;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileDataType>>;
  updateUser: (data: Partial<User>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.fullName.split(' ')[0] || '');
  const [surname, setSurname] = useState(user.fullName.split(' ')[1] || '');
  const [state, action] = useActionState(
    updateDisplayName,
    initialUpdateFormState,
  );

  useEffect(() => {
    if (state.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (state.formError) {
      toast.error(state.formError);
    } else if (state.done) {
      toast.success('Display name updated successfully');
      updateUser({ fullName: name + ' ' + surname });
      setIsEditing(false);
    }
  }, [state]);

  const handleCancel = (e: any) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <Card className="rounded-md shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">Display Name</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Please enter your full name, or a display name you are comfortable
              with.
            </p>

            {isEditing ? (
              <form className="space-y-3" action={action}>
                <input type="hidden" name="userId" value={user.id} />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    value={name}
                    name="fname"
                    onChange={(e) => setName(e.target.value)}
                    maxLength={32}
                    className="col-span-2 max-w-md sm:col-span-1"
                    placeholder="First Name"
                  />
                  <Input
                    type="text"
                    value={surname}
                    name="lname"
                    onChange={(e) => setSurname(e.target.value)}
                    maxLength={32}
                    className="col-span-2 max-w-md sm:col-span-1"
                    placeholder="Last Name"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Please use 32 characters at maximum.
                </p>
                <div className="flex gap-2">
                  <SubmitButton size="sm">
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
                <p className="text-sm">{user.fullName}</p>
                <p className="text-muted-foreground text-xs">
                  Please use 32 characters at maximum.
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
