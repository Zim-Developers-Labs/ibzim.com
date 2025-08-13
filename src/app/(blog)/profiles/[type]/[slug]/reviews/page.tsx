import { Metadata } from 'next';
import ProfileReviewsWrapper from './wrapper';
import { ProfileType } from '@/types';
import {
  getAllProfileSlugsAndTypeByBlog,
  getProfileBySlugAndBlog,
} from '@/sanity/lib/client';
import { siteConfig } from '@/lib/config';
import { prepareArticleMetadata } from '@/lib/article-metadata';
import { urlForImage } from '@/sanity/lib/image';
import {
  getReviewedProfileIds,
  getReviewsForProfile,
  isProfileReviewed,
} from './actions';
import { notFound } from 'next/navigation';
import { validateRequest } from '@/lib/auth/validate-request';
import { getSearchData } from '@/sanity/lib/actions';

type Props = {
  params: Promise<{ slug: string; type: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, type } = await params;
  const [profile]: [ProfileType | null] = await Promise.all([
    getProfileBySlugAndBlog(
      slug,
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.profile`
        : 'profile',
    ),
  ]);

  return prepareArticleMetadata({
    title: `${profile?.name} Reviews`,
    description: `Add or read reviews about ${profile?.name}. Find out what others think to help you make better decisions.`,
    pageUrl: `/profiles/${type}/${slug}/reviews`,
    siteConfig,
    ogImage: {
      url: urlForImage(profile?.picture || '')
        .height(profile?.picture.ratio === '16:9' ? 1200 : 500)
        .width(profile?.picture.ratio === '16:9' ? 675 : 500)
        .fit('crop')
        .url(),
      height: profile?.picture.ratio === '16:9' ? 1200 : 500,
      width: profile?.picture.ratio === '16:9' ? 675 : 500,
    },
  });
}

export async function generateStaticParams() {
  // TODO: create a new get function which only gets profiles which have reviews instead of filtering them here after they all have been fetched
  const profiles = await getAllProfileSlugsAndTypeByBlog(
    siteConfig.documentPrefix !== ''
      ? `${siteConfig.documentPrefix}.profile`
      : 'profile',
  );

  const reviewedProfiles = await getReviewedProfileIds();

  return profiles
    .filter((profile) => reviewedProfiles.includes(profile._id))
    .map((profile) => ({
      type: profile.type,
      slug: profile.slug,
    }));
}

export default async function ProfileReviewsPage({ params }: Props) {
  const { slug } = await params;

  const profile: ProfileType | null = await getProfileBySlugAndBlog(
    slug,
    siteConfig.documentPrefix !== ''
      ? `${siteConfig.documentPrefix}.profile`
      : 'profile',
  );

  if (!profile?._id) {
    return notFound();
  }

  const profileReviewed = await isProfileReviewed(profile._id);

  if (!profileReviewed) {
    return notFound();
  }

  const { user } = await validateRequest();

  const { allArticles, popularArticles } = await getSearchData(
    siteConfig.popularArticleIds,
    siteConfig.documentPrefix,
  );

  const reviews = await getReviewsForProfile(profile._id);

  return (
    <ProfileReviewsWrapper
      profile={profile}
      reviews={reviews}
      user={user}
      allArticles={allArticles}
      popularArticles={popularArticles}
    />
  );
}
