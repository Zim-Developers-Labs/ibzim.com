import ProfileListingWrapper from '@/components/profiles';
import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { getAllProfilesForListingByBlog } from '@/sanity/lib/client';
import { CardProfileType } from '@/types';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `${siteConfig.shortName} Profiles`,
    description: `All ${siteConfig.shortName} Profiles.`,
    pageUrl: '/profiles',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function ProfilesPage() {
  const [profiles]: [CardProfileType[]] = await Promise.all([
    getAllProfilesForListingByBlog(
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.profile`
        : 'profile',
    ),
  ]);

  return <ProfileListingWrapper profiles={profiles} />;
}
