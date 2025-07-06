import ProfileListingWrapper from '@/components/profiles';
import { validateRequest } from '@/lib/auth/validate-request';
import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { getSearchData } from '@/sanity/lib/actions';
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

  const { user } = await validateRequest();

  const { allArticles, popularArticles } = await getSearchData(
    siteConfig.popularArticleIds,
    siteConfig.documentPrefix,
  );

  return (
    <ProfileListingWrapper
      user={user}
      allArticles={allArticles}
      popularArticles={popularArticles}
      profiles={profiles}
    />
  );
}
