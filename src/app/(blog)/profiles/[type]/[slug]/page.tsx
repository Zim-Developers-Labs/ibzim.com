import ProfileArticleWrapper from '@/components/profiles/profile';
import { prepareArticleMetadata } from '@/lib/article-metadata';
import { siteConfig } from '@/lib/config';
import {
  getAllProfileSlugsAndTypeByBlog,
  getProfileBySlugAndBlog,
} from '@/lib/sanity/client';
import { urlForImage } from '@/lib/sanity/image';
import { ProfileType } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
    title: `${profile?.seo.title}`,
    description: `${profile?.seo.description}`,
    pageUrl: `/profiles/${type}/${slug}`,
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
  const profiles = await getAllProfileSlugsAndTypeByBlog(
    siteConfig.documentPrefix !== ''
      ? `${siteConfig.documentPrefix}.profile`
      : 'profile',
  );

  return profiles.map((profile) => ({
    type: profile.type,
    slug: profile.slug,
  }));
}

export default async function ProfilePage({ params }: Props) {
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

  return <ProfileArticleWrapper profile={profile} siteConfig={siteConfig} />;
}
