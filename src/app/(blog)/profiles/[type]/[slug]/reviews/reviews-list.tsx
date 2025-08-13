'use client';

import type { User } from 'lucia';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  MoreVertical,
  Flag,
  Trash2,
  Edit,
  Star,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Award,
  ChevronDown,
  Plus,
  Info,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useMemo } from 'react';
import { ReviewWithUser } from './actions';
import { ProfileType } from '@/types';
import PostReviewDialog from '@/components/profiles/profile/post-review-dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProfileReview from './review';

interface ReviewsListProps {
  reviews: ReviewWithUser[];
  user: User | null;
  profile: ProfileType;
  isPostReviewOpen: boolean;
  handleSetIsPostReviewOpen: (open: boolean) => void;
}

export type FeedbackType =
  | 'yes'
  | 'no'
  | 'funny'
  | 'tier1Award'
  | 'tier2Award'
  | 'tier3Award';

export interface ReviewFeedback {
  yes: number;
  no: number;
  funny: number;
  tier1Award: number;
  tier2Award: number;
  tier3Award: number;
  userFeedback?: FeedbackType;
}

type SortOption = 'most-relevant' | 'newest' | 'rating';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

export default function ReviewsList({
  reviews,
  user,
  profile,
  isPostReviewOpen,
  handleSetIsPostReviewOpen,
}: ReviewsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('most-relevant');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const [reviewFeedback, setReviewFeedback] = useState<
    Record<string, ReviewFeedback>
  >(() => {
    const initialFeedback: Record<string, ReviewFeedback> = {};
    reviews.forEach((review) => {
      initialFeedback[review.id] = {
        yes: review.yesCount || 0,
        no: review.noCount || 0,
        funny: review.funnyCount || 0,
        tier1Award: review.tier1Count || 0,
        tier2Award: review.tier2Count || 0,
        tier3Award: review.tier3Count || 0,
      };
    });
    return initialFeedback;
  });

  // filter out reviews which do not have any details using reviews.filter
  const detailedReviews = reviews.filter(
    (r) => r.comment && r.comment?.length > 0 && r.rating,
  );

  const sortedAndFilteredReviews = useMemo(() => {
    let filtered = detailedReviews;

    // Filter by star rating
    if (filterBy !== 'all') {
      const targetRating = Number.parseInt(filterBy);
      filtered = detailedReviews.filter(
        (review) =>
          Math.floor(Number.parseFloat(review.rating)) === targetRating,
      );
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'rating':
          return Number.parseFloat(b.rating) - Number.parseFloat(a.rating);
        case 'most-relevant':
        default:
          // Most relevant: combination of rating and helpfulness
          const aFeedback = reviewFeedback[a.id] || {
            yes: 0,
            no: 0,
            funny: 0,
            tier1Award: 0,
            tier2Award: 0,
            tier3Award: 0,
          };
          const bFeedback = reviewFeedback[b.id] || {
            yes: 0,
            no: 0,
            funny: 0,
            tier1Award: 0,
            tier2Award: 0,
            tier3Award: 0,
          };

          const aHelpfulness =
            aFeedback.yes +
            aFeedback.tier1Award +
            aFeedback.tier2Award +
            aFeedback.tier3Award;
          const bHelpfulness =
            bFeedback.yes +
            bFeedback.tier1Award +
            bFeedback.tier2Award +
            bFeedback.tier3Award;

          const aScore = Number.parseFloat(a.rating) * 0.7 + aHelpfulness * 0.3;
          const bScore = Number.parseFloat(b.rating) * 0.7 + bHelpfulness * 0.3;

          return bScore - aScore;
      }
    });

    return sorted;
  }, [detailedReviews, sortBy, filterBy, reviewFeedback]);

  if (detailedReviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No detailed reviews yet
        </h3>
        <p className="text-gray-500">
          Be the first to share your experience in detail!
        </p>
      </div>
    );
  }

  return (
    <div id="ib-reviews" className="space-y-6">
      <Alert className="border-primaryColor mb-6 border bg-yellow-200">
        <Info />
        <AlertTitle>Rate this {profile.entityType}</AlertTitle>
        <AlertDescription className="text-primary">
          Let others know what you think about {profile.name}
          <div>
            {user ? (
              <PostReviewDialog
                profileId={profile._id}
                isPostReviewOpen={isPostReviewOpen}
                setIsPostReviewOpen={handleSetIsPostReviewOpen}
                user={user}
              >
                <div className="my-2 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 text-zinc-900 hover:text-teal-300 md:h-6 md:w-6`}
                      />
                    </button>
                  ))}
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-zinc-900">
                    Write a review <ArrowRight className="size-4" />
                  </div>
                </div>
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
        </AlertDescription>
      </Alert>
      <h2 className="mb-6 text-2xl font-bold">
        Detailed Ratings and Reviews (
        {filterBy === 'all'
          ? detailedReviews.length
          : sortedAndFilteredReviews.length}
        )
        <span className="text-base font-normal">
          {' '}
          {filterBy !== 'all' && `(Showing ${filterBy}-star reviews)`}
        </span>
      </h2>

      <div className="flex items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-gray-700 sm:inline">
            Sort by:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                {sortBy === 'most-relevant' && 'Most Relevant'}
                {sortBy === 'newest' && 'Newest'}
                {sortBy === 'rating' && 'Rating'}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortBy('most-relevant')}>
                Most Relevant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rating')}>
                Rating
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-gray-700 sm:inline">
            Filter:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                {filterBy === 'all' && 'All ratings'}
                {filterBy !== 'all' && `${filterBy} stars`}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setFilterBy('all')}>
                All ratings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterBy('5')}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span>5 stars</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('4')}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <Star className="h-3 w-3 text-gray-300" />
                  </div>
                  <span>4 stars</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('3')}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3].map((i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    {[4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 text-gray-300" />
                    ))}
                  </div>
                  <span>3 stars</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('2')}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2].map((i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    {[3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 text-gray-300" />
                    ))}
                  </div>
                  <span>2 stars</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('1')}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {[2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 text-gray-300" />
                    ))}
                  </div>
                  <span>1 star</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ul className="space-y-6">
        {sortedAndFilteredReviews.map((review) => (
          <ProfileReview
            key={review.id}
            review={review}
            reviewFeedback={reviewFeedback}
            setReviewFeedback={setReviewFeedback}
            user={user}
          />
        ))}
      </ul>
    </div>
  );
}
