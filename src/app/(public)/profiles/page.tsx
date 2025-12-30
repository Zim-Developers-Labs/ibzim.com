import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import ProfilesListingComponents from './_components';
import { getAllProfilesForListing } from '@/lib/sanity/client';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `${siteConfig.shortName} Profiles`,
    description: `All ${siteConfig.shortName} Profiles.`,
    pageUrl: '/profiles',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function ProfilesPage() {
  const profiles = await getAllProfilesForListing();

  return <ProfilesListingComponents profiles={profiles} />;
}
