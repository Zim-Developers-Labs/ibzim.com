'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { useUser } from '@/hooks/user-context';
import ProfileAvatarField from './avatar';
import DisplayNameField from './display-name';

export interface EditableFieldProps {
  label: string;
  value: string;
  description?: string;
  link: string;
}

function EditableField({
  label,
  value,
  description,
  link,
}: EditableFieldProps) {
  return (
    <Card className="rounded-md shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">{label}</h3>
            {description && (
              <p className="text-muted-foreground mb-4 text-sm">
                {description}
              </p>
            )}
            <p className="text-sm">{value}</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="ml-4 cursor-pointer"
            onClick={() => {
              window.open(link, '_self');
            }}
          >
            <ExternalLink className="mr-1 h-4 w-4" />
            Change
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export type ProfileDataType = {
  fullName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
};

export default function ProfileComponents() {
  const { user, updateUser } = useUser();

  const [profileData, setProfileData] = useState<ProfileDataType>({
    fullName: user!.fullName,
    email: user!.email,
    phone: user!.phoneNumber,
    avatar: user!.avatar,
  });

  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // only runs in the browser
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <div className="space-y-6">
      <ProfileAvatarField
        setProfileData={setProfileData}
        updateUser={updateUser}
        user={user!}
      />
      <DisplayNameField
        setProfileData={setProfileData}
        updateUser={updateUser}
        user={user!}
      />

      {currentUrl && (
        <>
          <EditableField
            label="Email Address"
            link={`/change-email?callbackUrl=${encodeURIComponent(currentUrl)}`}
            value={profileData.email}
            description="Your email address for account notifications and communication."
          />

          <EditableField
            label="Whatsapp Phone Number"
            link={`/change-phone-number?callbackUrl=${encodeURIComponent(
              currentUrl,
            )}`}
            value={profileData.phone || 'Not provided'}
            description="Your registered whatsapp phone number for account security and notifications."
          />
        </>
      )}
    </div>
  );
}
