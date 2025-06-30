'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Close modal and reset form after 2 seconds
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setRating(0);
      setComment('');
      setFeedbackType('');
    }, 2000);
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setFeedbackType('');
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when modal closes
      setTimeout(resetForm, 150); // Small delay to avoid visual glitch
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primaryColor hover:bg-primaryColor/90 text-zinc-900">
          <MessageSquare className="mr-2 h-4 w-4" />
          Share Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Share Your Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve by sharing your experience with our tools
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-green-800">
                Thank you for your feedback!
              </h3>
              <p className="text-muted-foreground text-sm">
                Your input helps us improve our tools.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Feedback Type</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="improvement">
                    Improvement Suggestion
                  </SelectItem>
                  <SelectItem value="general">General Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Overall Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        'h-6 w-6 transition-colors',
                        hoveredRating >= star || rating >= star
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300',
                      )}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-muted-foreground ml-2 text-sm">
                    {rating} out of 5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comments</Label>
              <Textarea
                id="comment"
                placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || (!rating && !comment.trim())}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
