'use client';

import { WikiBreadCrumb } from '@/components/article/components/breadcrumb';
import Container from '@/components/container';
import ProfileTruthScore from '@/components/truth-score';
import { urlForImage } from '@/sanity/lib/image';
import { ProfileType, SearchDocumentType, SiteConfigType } from '@/types';
import {
  ArrowRight,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Info,
  MessageSquarePlus,
  MessagesSquare,
  Paperclip,
  Plus,
  Send,
  Star,
  UserStar,
  X,
} from 'lucide-react';
import InfoBox from '../components/info-box';
import { PPtRenderer } from '@/components/pt-renderer';
import References from '../components/references';
import Link from 'next/link';
import { User } from 'lucia';
import GoogleAdUnit from '@/components/ad-unit';
import Header from '@/components/header';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { toast } from 'sonner';
import { ReviewWithUser } from '@/app/(blog)/profiles/[type]/[slug]/reviews/actions';
import PostReviewDialog from './post-review-dialog';
import ProfileReview, {
  ProfileReviewMini,
} from '@/app/(blog)/profiles/[type]/[slug]/reviews/review';
import { ReviewFeedback } from '@/app/(blog)/profiles/[type]/[slug]/reviews/reviews-list';
import RankingCard from './ranking-card';

export default function ProfileArticleWrapper({
  profile,
  siteConfig,
  user,
  allArticles,
  reviews,
  popularArticles,
}: {
  profile: ProfileType;
  reviews?: ReviewWithUser[];
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
        <Header
          articles={allArticles}
          popularArticles={popularArticles}
          user={user}
        />
        <aside className="bg-white py-4">
          <Container>
            <GoogleAdUnit adSlot="6332518135" />
          </Container>
        </aside>
        <WikiBreadCrumb name={profile.name} type={profile.entityType} />
        <Container className="max-w-screen-md pt-10 md:pt-20">
          <h1 className="mx-auto mb-4 px-0 text-center text-3xl md:px-4 md:text-4xl">
            {profile.title}
          </h1>
          <p className="mx-auto mb-6 max-w-xl px-0 text-center text-sm md:px-4 md:text-base">
            {profile.intro}
          </p>
          <RankingCard profile={profile} />
        </Container>
      </div>
      <div className="relative min-h-screen">
        <ActionBar profile={profile} user={user} reviews={reviews} />
        <Container className="mt-6 flex flex-col gap-8 pb-4 md:mt-8 md:grid md:flex-none md:grid-cols-[1fr_350px]">
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

function ActionBar({
  profile,
  user,
  reviews,
}: {
  profile: ProfileType;
  user: User | null;
  reviews?: ReviewWithUser[];
}) {
  const [isDiscussSheetOpen, setIsDiscussSheetOpen] = useState(false);
  const [isReviewsSheetOpen, setIsReviewsSheetOpen] = useState(false);
  const [isGuidelinesExpanded, setIsGuidelinesExpanded] = useState(true);
  const [isPostReviewOpen, setIsPostReviewOpen] = useState(false);

  const [updatedReviews, setUpdatedReviews] = useState(reviews || []);

  const averageRating = updatedReviews.length
    ? Number(
        (
          updatedReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          updatedReviews.length
        ).toFixed(1),
      )
    : 0;

  const renderStars = (rating: number, size = 'h-3 w-3 sm:h-4 sm:w-4') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <Star
            key={i}
            className={`${size} fill-yellow-400 text-yellow-400`}
          />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <div key={i} className="relative">
            <Star className={`${size} fill-gray-200 text-gray-200`} />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: '50%' }}
            >
              <Star className={`${size} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>,
        );
      } else {
        // Empty star
        stars.push(
          <Star key={i} className={`${size} fill-gray-200 text-gray-200`} />,
        );
      }
    }
    return stars;
  };

  const handleSetIsPostReviewOpen = useCallback((value: any) => {
    setIsPostReviewOpen(value);
  }, []);

  const [message, setMessage] = useState('');

  const handleDiscussClick = () => {
    setIsDiscussSheetOpen(true);
  };

  const handleReviewsClick = () => {
    setIsReviewsSheetOpen(true);
  };

  const mostRecentDetailedReview = updatedReviews[0];

  return (
    <>
      <div className="sticky top-0 z-50 mb-8 flex items-center justify-between bg-teal-200 px-2 py-4">
        <Container className="g flex w-full items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              onClick={handleDiscussClick}
              className="rounded bg-zinc-900 px-2 py-1 text-xs text-white transition-colors hover:bg-zinc-700"
              title="Talk about this profile"
            >
              Discuss
              <ChevronRightIcon className="ml-1 hidden h-3 w-3 sm:inline" />
            </Button>
            {profile.entityType === 'school' && (
              <Button
                onClick={handleReviewsClick}
                className="rounded bg-zinc-900 px-2 py-1 text-xs text-white transition-colors hover:bg-zinc-700"
                title="Review this profile"
              >
                <ChevronLeftIcon className="mr-1 hidden h-3 w-3 sm:inline" />
                Reviews
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="group flex cursor-pointer items-center gap-2 text-zinc-900">
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
      {/* Discuss Sheet - Opens from LEFT */}
      <Sheet open={isDiscussSheetOpen} onOpenChange={setIsDiscussSheetOpen}>
        <SheetContent side="left" className="w-full max-w-[400px] sm:w-[540px]">
          <SheetHeader className="pb-0">
            <SheetTitle className="flex items-center gap-2">
              <MessagesSquare className="h-5 w-5" />
              Profile Discussions
            </SheetTitle>
            <SheetDescription>
              Comments on the content of {profile.name} biography.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <Alert className="border-primaryColor mb-6 border bg-yellow-200">
              <Info />
              <AlertDescription className="text-primary">
                Feature still under development.
              </AlertDescription>
            </Alert>
            {/* Discussion Guidelines */}
            <div className="bg-muted/50 rounded-lg p-4">
              <button
                onClick={() => setIsGuidelinesExpanded(!isGuidelinesExpanded)}
                className="flex w-full items-center justify-between text-left"
              >
                <h4 className="text-sm font-medium">Discussion Guidelines</h4>
                {isGuidelinesExpanded ? (
                  <X className="h-4 w-4 transition-all duration-200" />
                ) : (
                  <Plus className="h-4 w-4 transition-all duration-200" />
                )}
              </button>

              {isGuidelinesExpanded && (
                <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                  <li>
                    • Keep discussions focused on improving the biography
                    content
                  </li>
                  <li>• Provide sources when suggesting factual changes</li>
                  <li>• Be respectful and constructive in your feedback</li>
                </ul>
              )}
            </div>
          </div>
          <SheetFooter className="pb-0">
            <div className="flex items-center gap-2 border-t py-4">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  // Handle attach media
                  console.log('Attach media clicked');
                }}
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach media</span>
              </Button>

              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="max-h-[120px] min-h-[40px] flex-1"
                rows={1}
              />

              <Button disabled={!message.trim()} className="shrink-0">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Reviews Sheet - Opens from RIGHT */}
      <Sheet open={isReviewsSheetOpen} onOpenChange={setIsReviewsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-[400px] sm:w-[540px]"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <UserStar className="h-5 w-5" />
              Reviews
            </SheetTitle>
            <SheetDescription>
              Reviews and ratings for {profile.name}
            </SheetDescription>
          </SheetHeader>
          {updatedReviews.length > 0 ? (
            <div className="mt-2 px-4 md:px-6">
              <div className="mb-4 rounded-lg border border-zinc-200 p-4">
                {/* Overall Rating */}
                <div className="flex items-start">
                  <div className="text-3xl font-bold text-gray-900">
                    {averageRating}
                  </div>
                  <div className="ml-2 flex flex-col items-start">
                    <div className="mb-1 flex items-center gap-1">
                      {renderStars(averageRating)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Based on {updatedReviews.length}{' '}
                      {updatedReviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                </div>
              </div>
              {/* Top Review */}
              <div className="mb-4">
                <MostRecentReview
                  mostRecentDetailedReview={mostRecentDetailedReview}
                  user={user}
                />
              </div>
              <Link
                href={`/profiles/${profile.entityType}/${profile.slug.current}/reviews`}
              >
                <Button variant="default" className="w-full">
                  View More Reviews <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="relative mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                  <MessageSquarePlus className="h-8 w-8 text-teal-400" />
                </div>
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                  <Star className="h-3 w-3 text-yellow-500" />
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                No reviews yet
              </h3>

              <p className="mb-1 max-w-[280px] text-sm text-zinc-800">
                Be the first to review {profile.name}.
              </p>

              <p className="max-w-[320px] text-xs text-zinc-600">
                Your review could be the one that helps someone find exactly
                what they're looking for.
              </p>
            </div>
          )}
          <SheetFooter>
            <div className="space-y-2 border-t py-4">
              <div className="flex items-center justify-between gap-2">
                {user ? (
                  <PostReviewDialog
                    profileId={profile._id}
                    isPostReviewOpen={isPostReviewOpen}
                    setIsPostReviewOpen={handleSetIsPostReviewOpen}
                    user={user}
                  >
                    <Button className="w-full flex-1 bg-teal-400 text-zinc-900 hover:bg-teal-500">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Review
                    </Button>
                  </PostReviewDialog>
                ) : (
                  <Button
                    onClick={() => {
                      toast.error('Login/Signup first to clap for article');
                    }}
                    className="w-full flex-1 bg-teal-400 text-zinc-900 hover:bg-teal-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Post Review
                  </Button>
                )}
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

function MostRecentReview({
  mostRecentDetailedReview,
  user,
}: {
  mostRecentDetailedReview: ReviewWithUser;
  user: User | null;
}) {
  const [reviewFeedback, setReviewFeedback] = useState<
    Record<string, ReviewFeedback>
  >(() => {
    return {
      [mostRecentDetailedReview.id]: {
        yes: mostRecentDetailedReview.yesCount || 0,
        no: mostRecentDetailedReview.noCount || 0,
        funny: mostRecentDetailedReview.funnyCount || 0,
        tier1Award: mostRecentDetailedReview.tier1Count || 0,
        tier2Award: mostRecentDetailedReview.tier2Count || 0,
        tier3Award: mostRecentDetailedReview.tier3Count || 0,
      },
    };
  });

  return (
    <ProfileReviewMini
      key={mostRecentDetailedReview.id}
      review={mostRecentDetailedReview}
      reviewFeedback={reviewFeedback}
      setReviewFeedback={setReviewFeedback}
      user={user}
    />
  );
}
