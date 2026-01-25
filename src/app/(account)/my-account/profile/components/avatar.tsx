'use client';

import { User } from '@/lib/server/constants';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { updateAvatarUrl } from '../actions';
import { ProfileDataType } from '.';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageCropDialog from '../image-crop-dialog';

export default function ProfileAvatarField({
  user,
  setProfileData,
  updateUser,
}: {
  user: User;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileDataType>>;
  updateUser: (data: Partial<User>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file.',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please select an image smaller than 5MB.',
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);
    setShowCropModal(true);
  };

  const handleCroppedImageSave = async (croppedImageUrl: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `avatar-${Date.now()}.png`, {
        type: 'image/png',
      });

      const formData = new FormData();
      formData.append('file', file, `avatar-${Date.now()}.png`);
      formData.append('userId', `${user.id}`);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const uploadResponse = await fetch(
        `/api/upload-avatar?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await uploadResponse.json();

      setProfileData((prev) => ({ ...prev, avatar: url }));
      updateUser({ avatar: url });

      await updateAvatarUrl(url, user.id);

      toast.success('Avatar updated', {
        description: 'Your profile picture has been successfully updated.',
      });

      URL.revokeObjectURL(croppedImageUrl);
      URL.revokeObjectURL(selectedImageUrl);
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Upload failed', {
        description: 'Failed to upload avatar. Please try again.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowCropModal(false);
      setSelectedImageUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropModalClose = () => {
    setShowCropModal(false);
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
      setSelectedImageUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Card className="rounded-md shadow-none">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold">Avatar</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Click on the avatar to upload a custom one from your files.
              </p>
              <p className="text-muted-foreground text-xs">
                An avatar is optional but strongly recommended.
              </p>
            </div>
            <div className="relative">
              <Avatar
                className="h-20 w-20 cursor-pointer transition-opacity hover:opacity-80"
                onClick={handleAvatarClick}
              >
                {user.avatar && (
                  <AvatarImage src={user.avatar || '/placeholder.svg'} />
                )}
                <AvatarFallback className="text-lg">
                  {user.fullName.split(' ')[0][0]}
                  {user.fullName.split(' ')[1][0]}
                </AvatarFallback>
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}

              <div className="absolute -right-1 -bottom-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 cursor-pointer rounded-full p-0"
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </CardContent>
      </Card>
      {showCropModal && (
        <ImageCropDialog
          imageUrl={selectedImageUrl}
          isOpen={showCropModal}
          onClose={handleCropModalClose}
          onSave={handleCroppedImageSave}
          isUploading={isUploading}
          progress={uploadProgress}
        />
      )}
    </>
  );
}
