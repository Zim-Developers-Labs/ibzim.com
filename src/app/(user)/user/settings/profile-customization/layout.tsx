'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Users, ArrowLeftRight } from 'lucide-react';

function ProfileNavigation() {
  const pathname = usePathname();

  const isGeneralActive = pathname === '/user/settings/profile-customization';
  const isOrganizerActive =
    pathname === '/user/settings/profile-customization/organizer';

  return (
    <div className="mb-6 flex items-center justify-center gap-4">
      <Link
        href="/user/settings/profile-customization"
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 sm:px-4 sm:py-2 ${
          isGeneralActive
            ? 'bg-primaryColor text-black shadow-md'
            : 'border-1 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
        }`}
      >
        <User className="h-3 w-3 sm:h-4 sm:w-4" strokeWidth={1} />
        General <span className="hidden sm:inline">Profile</span>
      </Link>

      <div className="flex items-center gap-1 text-gray-400">
        <ArrowLeftRight className="h-5 w-5" />
      </div>

      <Link
        href="/user/settings/profile-customization/organizer"
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 sm:px-4 sm:py-2 ${
          isOrganizerActive
            ? 'bg-primaryColor text-black shadow-md'
            : 'border-1 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
        }`}
      >
        <Users className="h-3 w-3 sm:h-4 sm:w-4" strokeWidth={1} />
        Organizer <span className="hidden sm:inline">Profile</span>
      </Link>
    </div>
  );
}

export default function ProfileCustomizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProfileNavigation />
      {children}
    </>
  );
}
