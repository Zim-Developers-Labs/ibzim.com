'use client';

import { submitReview } from '@/app/(blog)/profiles/[type]/[slug]/reviews/actions';
import { RecommendedType } from '@/app/(blog)/profiles/[type]/[slug]/reviews/validators';
import { User } from 'lucia';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { ExternalLink, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';

interface ReviewFormData {
  rating: number;
  comment: string;
  recommended: RecommendedType;
}

const initialFormData: ReviewFormData = {
  rating: 0,
  comment: '',
  recommended: 'neutral',
};

export default function PostReviewDialog({
  isPostReviewOpen,
  setIsPostReviewOpen,
  user,
  profileId,
  children,
}: {
  user: User;
  isPostReviewOpen: boolean;
  setIsPostReviewOpen: (open: boolean) => void;
  profileId: string;
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
  const [state, formAction] = useActionState(submitReview, null);

  const updateFormData = (
    field: keyof ReviewFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRatingClick = (rating: number) => {
    updateFormData('rating', rating);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsPostReviewOpen(false);
  };

  const handleRecommendationChange = (value: 'yes' | 'no' | 'neutral') => {
    updateFormData('recommended', value);
  };

  useEffect(() => {
    if (state?.formError) {
      toast.error(state.formError);
    }

    if (state?.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    }

    if (state?.done) {
      toast.success('Your review has been submitted', {
        description:
          'You can view and manage all your reviews in your profile setting',
      });
      setFormData(initialFormData);
      setIsPostReviewOpen(false);
      state.done = false;
    }
  }, [state, setIsPostReviewOpen]);

  return (
    <Dialog open={isPostReviewOpen} onOpenChange={setIsPostReviewOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add your Review</DialogTitle>
          <DialogDescription>
            <span className="flex items-center space-x-2">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.fullName!}
                  height={50}
                  width={50}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <span className="grid h-10 w-10 place-content-center rounded-full bg-zinc-200 uppercase">
                  {user.fullName.split(' ')[0][0]}
                  {user.fullName.split(' ')[1][0]}
                </span>
              )}
              <span className="text-sm font-medium text-zinc-900">
                {user.fullName}
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] min-h-[250px] w-full max-w-full overflow-x-hidden overflow-y-auto pr-2">
          <form className="space-y-6" action={formAction}>
            {/* Rating Section */}
            <div className="space-y-3">
              <Label className="text-sm">Rating *</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 md:h-6 md:w-6 ${
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-zinc-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-xs text-zinc-600">
                    {formData.rating} out of 5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <Textarea
                id="comment"
                placeholder="Optionally share your experience and thoughts..."
                value={formData.comment}
                onChange={(e) => updateFormData('comment', e.target.value)}
                className="min-h-[120px] resize-none text-sm placeholder:text-sm"
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Minimum 10 characters</span>
                <span>{formData.comment.length}/1000</span>
              </div>
            </div>

            {/* Recommendation Section - Tab Style */}
            <div className="space-y-3">
              <Label className="text-sm">Would you recommend this?</Label>
              <div className="flex max-w-[210px] rounded-lg border border-zinc-200 p-1">
                <button
                  type="button"
                  onClick={() => handleRecommendationChange('yes')}
                  className={`flex-1 rounded-sm px-2 py-1 text-xs font-medium transition-all ${
                    formData.recommended === 'yes'
                      ? 'bg-teal-400 text-zinc-900 shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleRecommendationChange('neutral')}
                  className={`flex-1 rounded-sm px-2 py-1 text-xs font-medium transition-all ${
                    formData.recommended === 'neutral'
                      ? 'bg-teal-400 text-zinc-900 shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  Maybe
                </button>
                <button
                  type="button"
                  onClick={() => handleRecommendationChange('no')}
                  className={`flex-1 rounded-sm px-2 py-1 text-xs font-medium transition-all ${
                    formData.recommended === 'no'
                      ? 'bg-teal-400 text-zinc-900 shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <SubmitButton
                disabled={
                  formData.rating === 0 ||
                  (formData.comment
                    ? formData.comment.trim().length < 10
                    : false)
                }
                className="flex-1 bg-teal-400 text-zinc-900 hover:bg-teal-500"
              >
                Submit Review
              </SubmitButton>
            </div>

            {/* Input fields */}
            <input type="hidden" name="rating" value={formData.rating} />
            <input
              type="hidden"
              name="comment"
              value={formData.comment !== '' ? formData.comment : undefined}
            />
            <input
              type="hidden"
              name="recommended"
              value={formData.recommended}
            />
            <input type="hidden" name="reviewerId" value={user.id} />
            <input type="hidden" name="profileId" value={profileId} />
          </form>
        </div>

        <DialogFooter className="flex w-full justify-between sm:justify-between">
          <div className="text-xs text-green-700">
            Feel free to comment your thoughts on the profile
            <span className="hidden md:inline">
              . You can report Inappropriate reviews from the review menu
            </span>{' '}
            in accordance to our{' '}
            <div
              onClick={() => window.open('/policies/commenting', '_blank')}
              className="inline cursor-pointer font-medium text-green-700 underline hover:text-green-600"
            >
              commenting policy.
              <ExternalLink className="inline h-4 w-4" />
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
