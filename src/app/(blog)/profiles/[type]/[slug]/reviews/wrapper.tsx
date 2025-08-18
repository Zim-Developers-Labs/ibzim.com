'use client';

import Header from '@/components/header';
import { siteConfig } from '@/lib/config';
import { urlForImage } from '@/sanity/lib/image';
import type { ProfileType, SearchDocumentType } from '@/types';
import type { User } from 'lucia';
import Container from '@/components/container';
import GoogleAdUnit from '@/components/ad-unit';
import { ProfileReviewsBreadCrumb } from '@/components/article/components/breadcrumb';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus, Star } from 'lucide-react';
import ReviewsList from './reviews-list';
import { ReviewWithUser } from './actions';
import PostReviewDialog from '@/components/profiles/profile/post-review-dialog';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProfileReviewsWrapper({
  profile,
  reviews,
  user,
  allArticles,
  popularArticles,
}: {
  profile: ProfileType;
  allArticles?: SearchDocumentType[];
  reviews: ReviewWithUser[];
  popularArticles?: SearchDocumentType[];
  user: User | null;
}) {
  const [updatedReviews, setUpdatedReviews] = useState(reviews);

  // TODO: Remove this use effect only added to remove unused variable error of setUpdatedReviews
  useEffect(() => {
    setUpdatedReviews(reviews);
  }, [reviews]);

  const averageRating = updatedReviews.length
    ? Number(
        (
          updatedReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          updatedReviews.length
        ).toFixed(1),
      )
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: updatedReviews.filter((r) => Number(r.rating) === rating).length,
    percentage: updatedReviews.length
      ? (updatedReviews.filter((r) => Number(r.rating) === rating).length /
          updatedReviews.length) *
        100
      : 0,
  }));

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

  const [isPostReviewOpen, setIsPostReviewOpen] = useState(false);

  const handleSetIsPostReviewOpen = useCallback((value: any) => {
    setIsPostReviewOpen(value);
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':
              profile.entityType === 'company'
                ? 'Organization'
                : profile.entityType === 'school'
                  ? 'EducationalOrganization'
                  : 'Article',
            headline: `${profile.name} Reviews`,
            description: `Add or read reviews about ${profile?.name}. Find out what others think to help you make better decisions.`,
            image: urlForImage(profile.picture)
              .height(profile?.picture.ratio === '16:9' ? 675 : 500)
              .width(profile?.picture.ratio === '16:9' ? 675 : 500)
              .url(),
            url: `${siteConfig.url.web}/profiles/${profile.entityType}/${profile.slug.current}/reviews`,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: averageRating,
              ratingCount: updatedReviews.length,
            },
            review: updatedReviews.map((review) => ({
              '@type': 'Review',
              author: {
                '@type': 'Person',
                name: review.userFullName,
              },
              datePublished: review.createdAt,
              reviewBody: review.comment,
              reviewRating: {
                '@type': 'Rating',
                ratingValue: review.rating,
              },
            })),
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
        <ProfileReviewsBreadCrumb
          type={profile.entityType}
          name={profile.name}
        />
        <Container className="max-w-screen-md pt-10 md:pt-20">
          <h1 className="mx-auto mb-4 px-0 text-center text-3xl md:px-4 md:text-4xl">
            {profile.name} Reviews
          </h1>
          <p className="mx-auto mb-6 max-w-xl px-0 text-center text-sm md:px-4 md:text-base">
            {profile.seo.description}{' '}
            {profile.entityType === 'school'
              ? 'This section list reviews from parents, students and teachers.'
              : profile.entityType === 'company'
                ? 'This section lists reviews from customers and employees.'
                : null}
          </p>
          <div className="mx-auto mb-8 max-w-xl rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
              {/* Overall Rating */}
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {averageRating}
                </div>
                <div className="mb-1 flex items-center gap-1">
                  {renderStars(averageRating)}
                </div>
                <div className="text-xs text-gray-600">
                  {updatedReviews.length}{' '}
                  {updatedReviews.length === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="w-full flex-1">
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div
                      key={rating}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="w-6 text-right">{rating}</span>
                      <Star className="h-2 w-2 fill-yellow-400 text-yellow-400 sm:h-3 sm:w-3" />
                      <div className="h-1 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-1 rounded-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-6 text-gray-600">({count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            {updatedReviews.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {Math.round(
                        (updatedReviews.filter((r) => Number(r.rating) >= 4)
                          .length /
                          updatedReviews.length) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-xs text-gray-600">
                      Positive Reviews
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {new Date(
                        updatedReviews[updatedReviews.length - 1]?.createdAt,
                      ).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-600">Most Recent</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="font-semibold text-gray-900">
                      {
                        updatedReviews.filter(
                          (r) => r.comment && r.comment.length > 50,
                        ).length
                      }
                    </div>
                    <div className="text-xs text-gray-600">
                      Detailed Reviews
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
      <div className="relative min-h-screen">
        <ActionBar
          profile={profile}
          user={user}
          handleSetIsPostReviewOpen={handleSetIsPostReviewOpen}
          isPostReviewOpen={isPostReviewOpen}
        />
        <Container className="mt-6 flex flex-col gap-8 pb-4 md:mt-8 md:grid md:flex-none md:grid-cols-[1fr_350px]">
          <div className="h-fit md:mt-4">
            <ReviewsList
              handleSetIsPostReviewOpen={handleSetIsPostReviewOpen}
              isPostReviewOpen={isPostReviewOpen}
              reviews={updatedReviews}
              user={user}
              profile={profile}
            />
          </div>
          <aside className="relative w-full">
            <div className="top-[10vh] p-1 md:sticky md:p-2">
              <GoogleAdUnit adSlot="6137077018" />
            </div>
          </aside>
        </Container>
      </div>
    </>
  );
}

function ActionBar({
  profile,
  user,
  handleSetIsPostReviewOpen,
  isPostReviewOpen,
}: {
  profile: ProfileType;
  user: User | null;
  isPostReviewOpen: boolean;
  handleSetIsPostReviewOpen: (open: boolean) => void;
}) {
  return (
    <>
      <div className="sticky top-0 z-50 mb-8 flex items-center justify-between bg-teal-200 px-2 py-4">
        <Container className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href={`/profiles/${profile.entityType}/${profile.slug.current}`}
              className="block"
            >
              <Button variant="outline">
                <ChevronLeft className="mr-1" />
                Read Biography
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <PostReviewDialog
                profileId={profile._id}
                isPostReviewOpen={isPostReviewOpen}
                setIsPostReviewOpen={handleSetIsPostReviewOpen}
                user={user}
              >
                <Button variant="default">
                  Add Review <Plus className="ml-1" />
                </Button>
              </PostReviewDialog>
            ) : (
              <Button
                variant="default"
                onClick={() => {
                  toast.error('Login/Signup first to clap for article');
                }}
              >
                Add Review <Plus className="ml-1" />
              </Button>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
