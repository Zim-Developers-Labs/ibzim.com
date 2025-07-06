import { prepareArticleMetadata } from '@/lib/article-metadata';
import { siteConfig } from '@/lib/config';
import {
  getAllProfileSlugsAndTypeByBlog,
  getProfileBySlugAndBlog,
} from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { ProfileType } from '@/types';
import { Metadata } from 'next';

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

  console.log(
    `${
      process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
    }/api/og?${new URLSearchParams({
      numberOfDiscussions: '12',
      imageUrl: urlForImage(profile?.picture || '')
        .height(profile?.picture.ratio === '16:9' ? 1200 : 500)
        .width(profile?.picture.ratio === '16:9' ? 675 : 500)
        .fit('crop')
        .url(),
    })}`,
  );

  return prepareArticleMetadata({
    title: `${profile?.name} Discussions`,
    description: `Talk about ${profile?.name}\'s profile.`,
    pageUrl: `/profiles/${type}/${slug}/discussions`,
    siteConfig,
    ogImage: {
      url: `${
        process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
      }/api/og?${new URLSearchParams({
        numberOfDiscussions: '12',
        imageUrl: urlForImage(profile?.picture || '')
          .height(profile?.picture.ratio === '16:9' ? 1200 : 500)
          .width(profile?.picture.ratio === '16:9' ? 675 : 500)
          .fit('crop')
          .url(),
      })}`,
      height: 1200,
      width: 675,
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

export default function ProfileTalkPage() {
  return (
    <div>
      <h1>Profile Talk Page</h1>
      <p>This is the talk page for a specific profile.</p>
    </div>
  );
}
