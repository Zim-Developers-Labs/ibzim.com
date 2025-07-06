import { WikiBreadCrumb } from '@/components/article/components/breadcrumb';
import Container from '@/components/container';
import ProfileTruthScore from '@/components/truth-score';
import { urlForImage } from '@/sanity/lib/image';
import { ProfileType, SearchDocumentType, SiteConfigType } from '@/types';
import { BookmarkIcon, ChevronRightIcon } from 'lucide-react';
import InfoBox from '../components/info-box';
import { PPtRenderer } from '@/components/pt-renderer';
import References from '../components/references';
import Link from 'next/link';
import { User } from 'lucia';
import BlogHeader from '@/app/(blog)/blog-header';
import GoogleAdUnit from '@/components/ad-unit';

export default function ProfileArticleWrapper({
  profile,
  siteConfig,
  user,
  allArticles,
  popularArticles,
}: {
  profile: ProfileType;
  siteConfig: SiteConfigType;
  allArticles?: SearchDocumentType[];
  popularArticles?: SearchDocumentType[];
  user: User | null;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: profile.seo.title,
            description: profile.seo.description,
            image: urlForImage(profile.picture)
              .height(profile?.picture.ratio === '16:9' ? 675 : 500)
              .width(profile?.picture.ratio === '16:9' ? 675 : 500)
              .url(),
            url: `${siteConfig.url.web}/profiles/${profile.entityType}/${profile.slug.current}`,
          }),
        }}
      />
      <div className="bg-primaryColor/10 relative pb-8 md:pb-10">
        <BlogHeader
          articles={allArticles}
          popularArticles={popularArticles}
          user={user}
        />
        <WikiBreadCrumb name={profile.name} type={profile.entityType} />
        <Container className="max-w-screen-md pt-10 md:pt-20">
          <h1 className="mx-auto mb-4 px-0 text-center text-3xl md:px-4 md:text-4xl">
            {profile.title}
          </h1>
          <p className="mx-auto mb-6 max-w-xl px-0 text-center text-sm md:px-4 md:text-base">
            {profile.intro}
          </p>
        </Container>
      </div>
      <div className="relative min-h-screen">
        <ActionBar profile={profile} />
        <Container className="mt-6 flex flex-col gap-8 pb-4 md:mt-8 md:grid md:flex-none md:grid-cols-[1fr_300px]">
          <div className="h-fit md:mt-4">
            <div className="mb-6 md:float-left md:mb-0 md:pr-8 md:pb-4">
              <InfoBox profile={profile} />
            </div>
            {profile && <PPtRenderer body={profile.body} />}
          </div>
          <aside className="relative w-full">
            <div className="top-[10vh] p-1 md:sticky md:p-2">
              <GoogleAdUnit adSlot="6137077018" />
            </div>
          </aside>
        </Container>
        <Container className="mb-4">
          <References
            body={profile.body}
            infoboxTable={profile.additionalInfo!}
          />
        </Container>
      </div>
    </>
  );
}

function ActionBar({ profile }: { profile: ProfileType }) {
  return (
    <div className="sticky top-0 z-50 mb-8 flex items-center justify-between border border-t border-r-0 border-b border-l-0 border-zinc-200 bg-white px-2 py-4">
      <Container className="g flex w-full items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            // href={`/profiles/${profile.entityType}/${profile.slug.current}/discussions`}
            href="#"
            className="rounded border border-zinc-200 bg-zinc-900 px-2 py-1 text-xs text-white transition-colors hover:bg-zinc-700"
            title="Talk about this profile"
          >
            Talk
            <ChevronRightIcon className="ml-1 hidden h-3 w-3 sm:inline" />
          </Link>
          {profile.entityType === 'school' && (
            <Link
              // href={`/profiles/${profile.entityType}/${profile.slug.current}/reviews`}
              href="#"
              className="rounded border border-zinc-200 bg-zinc-900 px-2 py-1 text-xs text-white transition-colors hover:bg-zinc-700"
              title="Review this profile"
            >
              Reviews
              <ChevronRightIcon className="ml-1 hidden h-3 w-3 sm:inline" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="group flex cursor-pointer items-center gap-2 text-zinc-600">
            <span className="text-xs">Save</span>
            <BookmarkIcon className="h-5 w-fit transition-transform group-hover:-translate-y-1" />
          </div>
          <div className="flex items-center gap-2">
            <ProfileTruthScore
              score={profile.truthScore ? profile.truthScore : 0}
              type="profile"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
