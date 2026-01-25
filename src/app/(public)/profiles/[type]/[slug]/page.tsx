import { prepareArticleMetadata } from '@/lib/article-metadata';
import { ProfileType } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProfileComponents from './_components';
import { urlForImage } from '@/lib/sanity/image';
import {
  getAllProfileSlugsAndType,
  getProfileBySlug,
} from '@/lib/sanity/client';

type Props = {
  params: Promise<{ slug: string; type: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, type } = await params;

  const profile = await getProfileBySlug(slug);

  return prepareArticleMetadata({
    title: `${profile?.seo.title}`,
    description: `${profile?.seo.description}`,
    pageUrl: `/profiles/${type}/${slug}`,
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
  const profiles = await getAllProfileSlugsAndType();

  return profiles.map((profile) => ({
    type: profile.type,
    slug: profile.slug,
  }));
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile: ProfileType | null = await getProfileBySlug(slug);

  if (!profile?._id) {
    return notFound();
  }

  const reviews = null;

  return <ProfileComponents reviews={reviews} profile={profile} />;
}
