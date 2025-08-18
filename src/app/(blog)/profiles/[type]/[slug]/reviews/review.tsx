'use client';
import { FeedbackType, ReviewFeedback } from './reviews-list';
import { Dispatch, SetStateAction, useState } from 'react';
import type { User } from 'lucia';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  ThumbsUp,
  ThumbsDown,
  Smile,
  Award,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ReviewWithUser } from './actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ProfileReview({
  review,
  setReviewFeedback,
  user,
  reviewFeedback,
}: {
  review: ReviewWithUser;
  setReviewFeedback: Dispatch<SetStateAction<Record<string, ReviewFeedback>>>;
  reviewFeedback: Record<string, ReviewFeedback>;
  user: User | null;
}) {
  const feedback = reviewFeedback[review.id] || {
    yes: 0,
    no: 0,
    funny: 0,
    tier1Award: 0,
    tier2Award: 0,
    tier3Award: 0,
  };
  const totalAwards =
    feedback.tier1Award + feedback.tier2Award + feedback.tier3Award;
  const hasUserAward = feedback.userFeedback?.includes('Award');

  const [awardDialogOpen, setAwardDialogOpen] = useState<
    Record<string, boolean>
  >({});

  const handleReport = (reviewId: string) => {
    console.log('Reporting review:', reviewId);
  };

  const handleDelete = (reviewId: string) => {
    console.log('Deleting review:', reviewId);
  };

  const handleEdit = (reviewId: string) => {
    console.log('Editing review:', reviewId);
  };

  const handleFeedback = (reviewId: string, feedbackType: FeedbackType) => {
    setReviewFeedback((prev) => {
      const current = prev[reviewId] || {
        yes: 0,
        no: 0,
        funny: 0,
        tier1Award: 0,
        tier2Award: 0,
        tier3Award: 0,
      };
      const wasSelected = current.userFeedback === feedbackType;

      if (current.userFeedback) {
        current[current.userFeedback] = Math.max(
          0,
          current[current.userFeedback] - 1,
        );
      }

      if (!wasSelected) {
        current[feedbackType] = current[feedbackType] + 1;
      }

      return {
        ...prev,
        [reviewId]: {
          ...current,
          userFeedback: wasSelected ? undefined : feedbackType,
        },
      };
    });

    if (feedbackType.includes('Award')) {
      setAwardDialogOpen((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // const openAwardDialog = (reviewId: string) => {
  //   setAwardDialogOpen((prev) => ({ ...prev, [reviewId]: true }));
  // };

  const isReviewEditable = (review: ReviewWithUser) => {
    if (!user || review.reviewerId !== user.id) return false;

    const reviewDate = new Date(review.createdAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - reviewDate.getTime()) / (1000 * 60);

    return diffInMinutes <= 15;
  };

  const canDeleteReview = (review: ReviewWithUser) => {
    if (!user || review.reviewerId !== user.id) return false;

    const feedback = reviewFeedback[review.id] || {
      yes: 0,
      no: 0,
      funny: 0,
      tier1Award: 0,
      tier2Award: 0,
      tier3Award: 0,
    };
    const helpfulCount =
      feedback.yes +
      feedback.tier1Award +
      feedback.tier2Award +
      feedback.tier3Award;

    return helpfulCount < 2;
  };

  const renderStars = (rating: string) => {
    const numRating = Number.parseFloat(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-2 w-2 sm:h-3 sm:w-3 ${i <= numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />,
      );
    }

    return stars;
  };

  return (
    <li
      key={review.id}
      className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 justify-between space-x-4">
          <div className="flex items-start space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={review.userAvatar || undefined}
                alt={review.userFullName || 'Anonymous'}
              />
              <AvatarFallback>
                {review.userFullName
                  ? review.userFullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-gray-900">
                {review.userFullName || 'Anonymous User'}
              </h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs">{review.rating}/5</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleReport(review.id)}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report Review
                </DropdownMenuItem>

                {canDeleteReview(review) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Review
                    </DropdownMenuItem>
                  </>
                )}

                {isReviewEditable(review) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(review.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Review
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {review.comment && (
        <div className="min-w-0 flex-1">
          <p className="my-4 rounded-md bg-zinc-50 p-2 text-sm leading-relaxed text-zinc-900">
            {review.comment}
          </p>

          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Did you find this helpful?
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={
                  feedback.userFeedback === 'yes' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => handleFeedback(review.id, 'yes')}
                className="h-8 text-xs"
              >
                <ThumbsUp className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Yes</span>{' '}
                {feedback.yes > 0 && `(${feedback.yes})`}
              </Button>

              <Button
                variant={feedback.userFeedback === 'no' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback(review.id, 'no')}
                className="h-8 text-xs"
              >
                <ThumbsDown className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">No</span>{' '}
                {feedback.no > 0 && `(${feedback.no})`}
              </Button>

              <Button
                variant={
                  feedback.userFeedback === 'funny' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => handleFeedback(review.id, 'funny')}
                className="h-8 text-xs"
              >
                <Smile className="mr-1 h-3 w-3" />
                Funny {feedback.funny > 0 && `(${feedback.funny})`}
              </Button>

              <Dialog
                open={awardDialogOpen[review.id]}
                onOpenChange={(open) =>
                  setAwardDialogOpen((prev) => ({
                    ...prev,
                    [review.id]: open,
                  }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    variant={hasUserAward ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs"
                  >
                    <Award className="mr-1 h-3 w-3" />
                    Award {totalAwards > 0 && `(${totalAwards})`}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Award this review</DialogTitle>
                    <DialogDescription>
                      Choose an award tier to recognize this helpful review.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-4">
                    <Button
                      variant={
                        feedback.userFeedback === 'tier1Award'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleFeedback(review.id, 'tier1Award')}
                      className="h-12 justify-start"
                    >
                      <Award className="mr-3 h-5 w-5 text-amber-600" />
                      <div className="text-left">
                        <div className="font-medium">Bronze Award</div>
                        <div className="text-muted-foreground text-sm">
                          {feedback.tier1Award > 0 &&
                            `${feedback.tier1Award} awarded`}
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant={
                        feedback.userFeedback === 'tier2Award'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleFeedback(review.id, 'tier2Award')}
                      className="h-12 justify-start"
                    >
                      <Award className="mr-3 h-5 w-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium">Silver Award</div>
                        <div className="text-muted-foreground text-sm">
                          {feedback.tier2Award > 0 &&
                            `${feedback.tier2Award} awarded`}
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant={
                        feedback.userFeedback === 'tier3Award'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleFeedback(review.id, 'tier3Award')}
                      className="h-12 justify-start"
                    >
                      <Award className="mr-3 h-5 w-5 text-yellow-500" />
                      <div className="text-left">
                        <div className="font-medium">Gold Award</div>
                        <div className="text-muted-foreground text-sm">
                          {feedback.tier3Award > 0 &&
                            `${feedback.tier3Award} awarded`}
                        </div>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      )}
    </li>
  );
}

export function ProfileReviewMini({
  review,
  setReviewFeedback,
  user,
  reviewFeedback,
}: {
  review: ReviewWithUser;
  setReviewFeedback: Dispatch<SetStateAction<Record<string, ReviewFeedback>>>;
  reviewFeedback: Record<string, ReviewFeedback>;
  user: User | null;
}) {
  const feedback = reviewFeedback[review.id] || {
    yes: 0,
    no: 0,
    funny: 0,
    tier1Award: 0,
    tier2Award: 0,
    tier3Award: 0,
  };
  const totalAwards =
    feedback.tier1Award + feedback.tier2Award + feedback.tier3Award;
  const hasUserAward = feedback.userFeedback?.includes('Award');

  const [awardDialogOpen, setAwardDialogOpen] = useState<
    Record<string, boolean>
  >({});

  const handleReport = (reviewId: string) => {
    console.log('Reporting review:', reviewId);
  };

  const handleDelete = (reviewId: string) => {
    console.log('Deleting review:', reviewId);
  };

  const handleEdit = (reviewId: string) => {
    console.log('Editing review:', reviewId);
  };

  const handleFeedback = (reviewId: string, feedbackType: FeedbackType) => {
    setReviewFeedback((prev) => {
      const current = prev[reviewId] || {
        yes: 0,
        no: 0,
        funny: 0,
        tier1Award: 0,
        tier2Award: 0,
        tier3Award: 0,
      };
      const wasSelected = current.userFeedback === feedbackType;

      if (current.userFeedback) {
        current[current.userFeedback] = Math.max(
          0,
          current[current.userFeedback] - 1,
        );
      }

      if (!wasSelected) {
        current[feedbackType] = current[feedbackType] + 1;
      }

      return {
        ...prev,
        [reviewId]: {
          ...current,
          userFeedback: wasSelected ? undefined : feedbackType,
        },
      };
    });

    if (feedbackType.includes('Award')) {
      setAwardDialogOpen((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // const openAwardDialog = (reviewId: string) => {
  //   setAwardDialogOpen((prev) => ({ ...prev, [reviewId]: true }));
  // };

  const isReviewEditable = (review: ReviewWithUser) => {
    if (!user || review.reviewerId !== user.id) return false;

    const reviewDate = new Date(review.createdAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - reviewDate.getTime()) / (1000 * 60);

    return diffInMinutes <= 15;
  };

  const canDeleteReview = (review: ReviewWithUser) => {
    if (!user || review.reviewerId !== user.id) return false;

    const feedback = reviewFeedback[review.id] || {
      yes: 0,
      no: 0,
      funny: 0,
      tier1Award: 0,
      tier2Award: 0,
      tier3Award: 0,
    };
    const helpfulCount =
      feedback.yes +
      feedback.tier1Award +
      feedback.tier2Award +
      feedback.tier3Award;

    return helpfulCount < 2;
  };

  const renderStars = (rating: string) => {
    const numRating = Number.parseFloat(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-2 w-2 sm:h-3 sm:w-3 ${i <= numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />,
      );
    }

    return stars;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 justify-between space-x-4">
          <div className="flex items-start space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={review.userAvatar || undefined}
                alt={review.userFullName || 'Anonymous'}
              />
              <AvatarFallback>
                {review.userFullName
                  ? review.userFullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-gray-900">
                {review.userFullName || 'Anonymous User'}
              </h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs">{review.rating}/5</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleReport(review.id)}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report Review
                </DropdownMenuItem>

                {canDeleteReview(review) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Review
                    </DropdownMenuItem>
                  </>
                )}

                {isReviewEditable(review) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(review.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Review
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {review.comment && (
        <div className="min-w-0 flex-1">
          <p className="my-4 rounded-md bg-zinc-50 p-2 text-sm leading-relaxed text-zinc-900">
            {review.comment}
          </p>

          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Did you find this helpful?
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={
                  feedback.userFeedback === 'yes' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => handleFeedback(review.id, 'yes')}
                className="h-8 px-2 text-xs"
              >
                <ThumbsUp className="mr-1 h-3 w-3" />
                {feedback.yes > 0 && `(${feedback.yes})`}
              </Button>

              <Button
                variant={feedback.userFeedback === 'no' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback(review.id, 'no')}
                className="h-8 px-2 text-xs"
              >
                <ThumbsDown className="mr-1 h-3 w-3" />
                {feedback.no > 0 && `(${feedback.no})`}
              </Button>

              <Button
                variant={
                  feedback.userFeedback === 'funny' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => handleFeedback(review.id, 'funny')}
                className="h-8 px-2 text-xs"
              >
                <Smile className="mr-1 h-3 w-3" />
                Funny {feedback.funny > 0 && `(${feedback.funny})`}
              </Button>

              <Dialog
                open={awardDialogOpen[review.id]}
                onOpenChange={(open) =>
                  setAwardDialogOpen((prev) => ({
                    ...prev,
                    [review.id]: open,
                  }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    variant={hasUserAward ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 px-2 text-xs"
                  >
                    <Award className="mr-1 h-3 w-3" />
                    Award {totalAwards > 0 && `(${totalAwards})`}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Award this review</DialogTitle>
                    <DialogDescription>
                      Choose an award tier to recognize this helpful review.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-4">
                    <Button
                      variant={
                        feedback.userFeedback === 'tier1Award'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleFeedback(review.id, 'tier1Award')}
                      className="h-12 justify-start"
                    >
                      <Award className="mr-3 h-5 w-5 text-amber-600" />
                      <div className="text-left">
                        <div className="font-medium">Bronze Award</div>
                        <div className="text-muted-foreground text-sm">
                          {feedback.tier1Award > 0 &&
                            `${feedback.tier1Award} awarded`}
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant={
                        feedback.userFeedback === 'tier2Award'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleFeedback(review.id, 'tier2Award')}
                      className="h-12 justify-start"
                    >
                      <Award className="mr-3 h-5 w-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium">Silver Award</div>
                        <div className="text-muted-foreground text-sm">
                          {feedback.tier2Award > 0 &&
                            `${feedback.tier2Award} awarded`}
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant={
                        feedback.userFeedback === 'tier3Award'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleFeedback(review.id, 'tier3Award')}
                      className="h-12 justify-start"
                    >
                      <Award className="mr-3 h-5 w-5 text-yellow-500" />
                      <div className="text-left">
                        <div className="font-medium">Gold Award</div>
                        <div className="text-muted-foreground text-sm">
                          {feedback.tier3Award > 0 &&
                            `${feedback.tier3Award} awarded`}
                        </div>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
