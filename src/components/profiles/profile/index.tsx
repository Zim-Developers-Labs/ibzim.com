import { WikiBreadCrumb } from '@/components/article/components/breadcrumb';
import Container from '@/components/container';
import ProfileTruthScore from '@/components/truth-score';
import { urlForImage } from '@/lib/sanity/image';
import { ProfileType, SiteConfigType } from '@/types';
import { BookmarkIcon } from 'lucide-react';
import InfoBox from '../components/info-box';
import TblContents from '@/components/article/components/tbl-contents';
import { PPtRenderer } from '@/components/pt-renderer';
import References from '../components/references';

export default function ProfileArticleWrapper({
  profile,
  siteConfig,
}: {
  profile: ProfileType;
  siteConfig: SiteConfigType;
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
            url: `${siteConfig.url.web}/profiles/${profile.entityType}/${profile.slug}`,
          }),
        }}
      />
      <WikiBreadCrumb name={profile.name} type={profile.entityType} />
      <Container className="max-w-screen-lg py-10 md:py-20">
        <article>
          <h1 className="mx-auto mb-4 px-0 text-center text-3xl md:px-4 md:text-4xl">
            {profile.title}
          </h1>
          <p className="mx-auto mb-6 max-w-xl px-0 text-center text-sm md:px-4 md:text-base">
            {profile.intro}
          </p>
          <div className="relative z-10 mb-8 flex justify-between border border-t border-r-0 border-b border-l-0 border-zinc-200 px-2 py-3">
            <div className="flex items-center gap-2">
              <ProfileTruthScore
                score={profile.truthScore ? profile.truthScore : 0}
                type="profile"
              />
            </div>
            <div className="group flex cursor-pointer items-center gap-2 text-zinc-600">
              <span className="text-xs">Save</span>
              <BookmarkIcon className="h-5 w-fit transition-transform group-hover:-translate-y-1" />
            </div>
          </div>
          <div className="relative min-h-screen">
            <div className="mb-6 md:float-left md:mt-24 md:mb-0 md:pr-8 md:pb-4">
              <InfoBox profile={profile} />
            </div>
            <div>
              {profile?.tblContentsType && (
                <div className="md:float-right md:mt-24 md:ml-8">
                  {profile.tblContentsType == 'auto' ||
                  profile.tblContentsType == 'manual' ? (
                    <TblContents profile={profile} />
                  ) : null}
                </div>
              )}
              {profile && <PPtRenderer body={profile.body} />}
            </div>
          </div>
        </article>
        <References
          body={profile.body}
          infoboxTable={profile.additionalInfo!}
        />
      </Container>
    </>
  );
}
