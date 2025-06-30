'use client';

import { User } from 'lucia';
import Image from 'next/image';
import { useState, useRef, useEffect, useActionState } from 'react';
import ImageCropModal from './crop-modal';
import {
  updateAvatarUrl,
  updateFullName,
  updateLocation,
  updatePhoneNumber,
  updateUsername,
} from '../actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { cities, countries, countryCodes } from '@/lib/constants';
import ReactCountryFlag from 'react-country-flag';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { toast } from 'sonner';

export default function CustomizationFields({ user }: { user: User }) {
  const [selectedCountry, setSelectedCountry] = useState(
    user.country || countries[0],
  );
  const [selectedCity, setSelectedCity] = useState(user.city || '');
  const fname = user.fullName ? user.fullName.split(' ')[0]! : 'I';
  const lname = user.fullName ? user.fullName.split(' ')[1]! : 'B';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nameState, nameAction] = useActionState(updateFullName, null);
  const [locationState, locationAction] = useActionState(updateLocation, null);
  const [usernameState, usernameAction] = useActionState(updateUsername, null);
  const [phoneNumberState, phoneNumberAction] = useActionState(
    updatePhoneNumber,
    null,
  );
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0],
  );

  const validateFileType = (file: File) => {
    const validTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, WebP, JPEG, and GIF files are allowed');
      return false;
    }
    return true;
  };

  const uploadAvatar = async (croppedImageBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', croppedImageBlob, 'avatar.png');
    formData.append('userId', user.id);

    setProgress(0);
    setIsUploading(true);
    try {
      const response = await fetch(
        `/api/upload?filename=${user.id}-avatar.png`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        toast.error('Upload failed');
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setAvatarUrl(data.url);
      updateAvatarUrl(data.url, user.id);

      toast.success('Avatar uploaded successfully');
      setProgress(100);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(`Failed to upload avatar: ${error}`);
    }
    setIsUploading(false);
  };

  useEffect(() => {
    if (nameState?.fieldError) {
      Object.values(nameState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (nameState?.done) {
      toast.success('Name updated successfully');
      nameState.done = false;
    }

    if (usernameState?.fieldError) {
      Object.values(usernameState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (usernameState?.done) {
      toast.success('Username updated successfully');
      usernameState.done = false;
    }

    if (phoneNumberState?.fieldError) {
      Object.values(phoneNumberState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (phoneNumberState?.done) {
      toast.success('Phone number updated successfully');
      phoneNumberState.done = false;
    }

    if (locationState?.done) {
      toast.success('Location updated successfully');
      locationState.done = false;
    }
  }, [nameState, usernameState, phoneNumberState, locationState]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all spaces from the input
    const cleaned = e.target.value.replace(/\s/g, '');

    // Only allow numbers, +, -, and ()
    const valid = cleaned.replace(/[^\d+()-]/g, '');

    setPhoneNumber(valid);
  };

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <form className="col-span-full rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-2 text-xl font-semibold">Avatar</h2>
            <div className="flex items-center gap-x-8">
              {avatarUrl ? (
                <div className="rounded-md border border-gray-200">
                  <Image
                    alt={user.fullName!}
                    height={96}
                    width={96}
                    src={avatarUrl}
                    className="h-24 w-24 rounded-md"
                  />
                </div>
              ) : (
                <div className="grid h-24 w-24 place-content-center rounded-md bg-gray-100">
                  <span className="text-4xl text-gray-900 capitalize">
                    {fname[0]}
                    {lname[0]}
                  </span>
                </div>
              )}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png,image/webp,image/jpeg,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (!validateFileType(file)) {
                        return;
                      }
                      if (file.size > 1024 * 1024) {
                        toast(
                          'File size must be less than 1MB. Crop or use an image compressor',
                          {
                            action: {
                              label: 'Compress',
                              onClick: () =>
                                window.open(
                                  'https://www.iloveimg.com/compress-image',
                                  '_blank',
                                ),
                            },
                          },
                        );
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setSelectedImage(e.target?.result as string);
                        setIsModalOpen(true);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                >
                  Change avatar
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, WebP, JPEG, or GIF. 1MB max.
                </p>
              </div>
            </div>
          </form>

          {/* Display Name Section */}
          <form
            action={nameAction}
            className="col-span-full rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2 className="mb-2 text-xl font-semibold">Display Name</h2>
            <p className="mb-4 text-sm text-gray-600">
              Please enter your full name, or a display name you are comfortable
              with.
            </p>
            <input type="hidden" name="userId" value={user.id} />
            <input
              type="text"
              name="name"
              defaultValue={user.fullName || ''}
              className="block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 sm:text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">
              Please use 32 characters at maximum.
            </p>
            <SubmitButton
              type="submit"
              className="mt-6 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Save
            </SubmitButton>
          </form>

          {/* Username Section */}
          <form
            action={usernameAction}
            className="col-span-full rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2 className="mb-2 text-xl font-semibold">Username</h2>
            <p className="mb-4 text-sm text-gray-600">
              This is your URL namespace within the platform.
            </p>
            <div className="flex rounded-md shadow-sm">
              <span className="flex items-center rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-3 text-gray-500 select-none sm:text-sm">
                @
              </span>
              <input type="hidden" name="userId" value={user.id} />
              <input
                type="text"
                name="username"
                defaultValue={user.username || `user-${user.id}`}
                className="block w-full rounded-none rounded-r-md border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 sm:text-sm"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Please use 48 characters at maximum.
            </p>
            <SubmitButton
              type="submit"
              className="mt-6 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Save
            </SubmitButton>
          </form>
          {/* Phone Number Section */}
          <form
            action={phoneNumberAction}
            className="col-span-full rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2 className="mb-2 text-xl font-semibold">Phone Number</h2>
            <p className="mb-4 text-sm text-gray-600">
              Add and verify your phone number to enable secure voting.
            </p>
            <input type="hidden" name="userId" value={user.id} />
            <input
              type="hidden"
              name="dialCode"
              value={selectedCountryCode!.code}
            />
            <div className="relative rounded-md shadow-sm">
              <Listbox
                value={selectedCountryCode}
                onChange={setSelectedCountryCode}
              >
                <div className="absolute inset-y-0 left-0">
                  <ListboxButton className="flex h-full items-center gap-2 rounded-l-md border-0 py-0 pr-4 pl-3 text-gray-500 outline-none sm:text-sm">
                    <ReactCountryFlag
                      countryCode={selectedCountryCode!.code}
                      svg
                    />
                    <span>{selectedCountryCode!.code}</span>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </ListboxButton>

                  <ListboxOptions
                    transition
                    className="absolute top-full left-0 z-10 mt-1 max-h-60 w-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
                  >
                    {countryCodes.slice(0, 2).map((country) => (
                      <ListboxOption
                        key={country.code}
                        value={country}
                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <ReactCountryFlag countryCode={country.code} svg />
                        <span>{country.name}</span>
                        <span className="ml-auto text-gray-500">
                          {country.dialCode}
                        </span>
                      </ListboxOption>
                    ))}
                    <div className="h-[1px] w-full bg-gray-200"></div>
                    {countryCodes.slice(2).map((country) => (
                      <ListboxOption
                        key={country.code}
                        value={country}
                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <ReactCountryFlag countryCode={country.code} svg />
                        <span>{country.name}</span>
                        <span className="ml-auto text-gray-500">
                          {country.dialCode}
                        </span>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="+263 78 765 4321"
                className="block w-full rounded-md border border-gray-200 py-2 pl-24 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              />
            </div>

            <SubmitButton
              type="submit"
              className="mt-6 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Save
            </SubmitButton>
          </form>

          {/* Location Section */}
          <form
            action={locationAction}
            className="col-span-full rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2 className="mb-2 text-xl font-semibold">Location</h2>
            <p className="mb-4 text-sm text-gray-600">
              Select your country and city of residence.
            </p>
            <input type="hidden" name="userId" value={user.id} />
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 sm:text-sm"
                >
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </div>

              {(selectedCountry === 'Zimbabwe' ||
                selectedCountry === 'South Africa') && (
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 sm:text-sm"
                  >
                    {cities[selectedCountry as keyof typeof cities].map(
                      (city) => (
                        <option key={city}>{city}</option>
                      ),
                    )}
                  </select>
                </div>
              )}
            </div>
            <SubmitButton
              type="submit"
              disabled={selectedCountry == countries[0]}
              className="mt-6 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Save
            </SubmitButton>
          </form>
        </div>
      </div>
      {isModalOpen && selectedImage && (
        <ImageCropModal
          isUploading={isUploading}
          progress={progress}
          imageUrl={selectedImage}
          onClose={() => setIsModalOpen(false)}
          onSave={(croppedImage) => {
            fetch(croppedImage)
              .then((res) => res.blob())
              .then((blob) => uploadAvatar(blob))
              .then(() => setIsModalOpen(false))
              .catch((error) => {
                console.error('Error processing cropped image:', error);
                alert('Failed to process the cropped image. Please try again.');
              });
          }}
        />
      )}
    </>
  );
}
