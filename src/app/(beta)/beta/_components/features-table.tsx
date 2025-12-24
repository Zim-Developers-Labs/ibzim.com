'use client';

import { useState } from 'react';
import ProgressCircle from './progress-circle';
import {
  FileText,
  Star,
  Bug,
  ChevronDown,
  MessageCircle,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { features } from './data';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { DOMAIN_URLS } from '@/lib/constants';

// Categorize features by progress
const categorizeFeatures = () => {
  const nearlyComplete = features.filter((f) => {
    const progress =
      (f.issues.filter((issue) => issue.status === 'closed').length /
        f.issues.length) *
      100;
    return progress >= 80;
  });
  const inProgress = features.filter((f) => {
    const progress =
      (f.issues.filter((issue) => issue.status === 'closed').length /
        f.issues.length) *
      100;
    return progress >= 40 && progress < 80;
  });
  const earlyDevelopment = features.filter((f) => {
    const progress =
      (f.issues.filter((issue) => issue.status === 'closed').length /
        f.issues.length) *
      100;
    return progress < 40;
  });
  return { nearlyComplete, inProgress, earlyDevelopment };
};

export interface Feature {
  name: string;
  docsUrl: string;
  issues: {
    id: string;
    title: string;
    status: 'open' | 'closed' | 'in progress';
  }[];
}

interface FeatureRowProps {
  feature: Feature;
  expandedBug: string | null;
  setExpandedBug: (name: string | null) => void;
  onRateClick: (feature: Feature) => void;
  progressColor?: string;
}

function FeatureRow({
  feature,
  expandedBug,
  progressColor,
  setExpandedBug,
  onRateClick,
}: FeatureRowProps) {
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [bugDialogOpen, setBugDialogOpen] = useState(false);
  const isExpanded = expandedBug === feature.name;
  const issues = feature.issues || [];

  const handleBugClick = () => {
    setExpandedBug(isExpanded ? null : feature.name);
  };

  const submitToWhatsApp = () => {
    const message = `Bug Report - ${feature.name}\n\nTitle: ${issueTitle}\nDescription: ${issueDescription}`;
    const whatsappUrl = `https://wa.me/+263717238876?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIssueTitle('');
    setIssueDescription('');
  };

  const submitToGitHub = () => {
    const title = encodeURIComponent(`[${feature.name}] ${issueTitle}`);
    const body = encodeURIComponent(issueDescription);
    const githubUrl = `https://github.com/XfinityPros/ibzim-ux/issues/new?title=${title}&body=${body}`;
    window.open(githubUrl, '_blank');
    setIssueTitle('');
    setIssueDescription('');
  };

  const progress =
    (feature.issues.filter((issue) => issue.status === 'closed').length /
      feature.issues.length) *
    100;
  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <div
        className={cn(
          'flex flex-col items-start justify-between gap-6 p-4 py-6 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:gap-3 sm:py-4',
          isExpanded && 'bg-zinc-50',
        )}
      >
        <div className="flex items-center gap-3">
          <ProgressCircle
            progress={progress}
            color={progressColor || '#10b981'}
          />
          <span className="font-medium text-zinc-900">{feature.name}</span>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 bg-transparent sm:flex-none"
            asChild
          >
            <Link
              href={`${DOMAIN_URLS.DOCS()}${feature.docsUrl}`}
              target="_blank"
            >
              <FileText className="size-3.5" />
              <span className="">Docs</span>
            </Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 gap-1.5 sm:flex-none"
            onClick={() => onRateClick(feature)}
          >
            <Star className="size-3.5" />
            <span className="">Rate</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className={cn(
              'flex-1 gap-1.5 bg-red-600 text-white hover:bg-red-700 hover:text-red-50 sm:flex-none',
              isExpanded && 'bg-red-700 text-red-50',
            )}
            onClick={handleBugClick}
          >
            <Bug className="size-3.5" />
            <span className="">Issues</span>
            <ChevronDown
              className={cn(
                'size-3.5 transition-transform',
                isExpanded && 'rotate-180',
              )}
            />
          </Button>
        </div>
      </div>

      {/* Bug Report Accordion */}
      {isExpanded && (
        <div className="space-y-4 bg-zinc-50 px-4 pb-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="size-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Please check the pending issues below before submitting a new one
              to avoid duplicates.
            </AlertDescription>
          </Alert>

          {/* Pending Issues List */}
          {issues.filter((issue) => issue.status !== 'closed').length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h4 className="mb-3 text-sm font-medium text-zinc-900">
                Pending Issues (
                {issues.filter((issue) => issue.status !== 'closed').length})
              </h4>
              <div className="space-y-2">
                {issues
                  .filter((issue) => issue.status !== 'closed')
                  .map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between rounded bg-zinc-50 p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-zinc-400">
                          {issue.id}
                        </span>
                        <span className="text-zinc-700">{issue.title}</span>
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs',
                          issue.status === 'open'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700',
                        )}
                      >
                        {issue.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {issues.filter((issue) => issue.status !== 'closed').length === 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <p className="text-sm text-zinc-500">
                No pending issues for this feature.
              </p>
            </div>
          )}

          <Button
            className="w-full gap-2 bg-red-600 hover:bg-red-700"
            onClick={() => setBugDialogOpen(true)}
          >
            <Plus className="size-4" />
            Submit New Issue
          </Button>
        </div>
      )}

      <Dialog open={bugDialogOpen} onOpenChange={setBugDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pt-4 sm:pt-0">
            <DialogTitle>Report an Issue - {feature.name}</DialogTitle>
            <DialogDescription>
              Describe the bug or issue you encountered with this feature.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label
                htmlFor={`dialog-title-${feature.name}`}
                className="text-sm"
              >
                Issue Title
              </Label>
              <Input
                id={`dialog-title-${feature.name}`}
                placeholder="Brief description of the issue"
                className="placeholder:text-sm"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor={`dialog-desc-${feature.name}`}
                className="text-sm"
              >
                Description
              </Label>
              <Textarea
                id={`dialog-desc-${feature.name}`}
                placeholder="Detailed description, steps to reproduce..."
                className="placeholder:text-sm"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              onClick={submitToWhatsApp}
              disabled={!issueTitle.trim()}
            >
              <Icons.whatsapp className="size-3.5" />
              <span className="hidden sm:inline">Submit via</span> WhatsApp
            </Button>
            <Button
              size="sm"
              variant="default"
              className="flex-1 gap-1.5"
              onClick={submitToGitHub}
              disabled={!issueTitle.trim()}
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden sm:inline">Submit to</span> GitHub
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface FeatureCategoryProps {
  title: string;
  description: string;
  features: Feature[];
  expandedBug: string | null;
  setExpandedBug: (name: string | null) => void;
  onRateClick: (feature: Feature) => void;
  badgeColor: string;
  progressColor?: string;
}

function FeatureCategory({
  title,
  description,
  features,
  expandedBug,
  setExpandedBug,
  onRateClick,
  progressColor,
  badgeColor,
}: FeatureCategoryProps) {
  if (features.length === 0) return null;

  return (
    <Card className="gap-0 overflow-hidden border-zinc-200 bg-white shadow-none">
      <CardHeader className="border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              {title}
            </CardTitle>
            <p className="text-sm text-zinc-500">{description}</p>
          </div>
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium',
              badgeColor,
            )}
          >
            {features.length}&nbsp;features
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {features.map((feature) => (
          <FeatureRow
            progressColor={progressColor}
            key={feature.name}
            feature={feature}
            expandedBug={expandedBug}
            setExpandedBug={setExpandedBug}
            onRateClick={onRateClick}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default function FeaturesTable() {
  const [expandedBug, setExpandedBug] = useState<string | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const { nearlyComplete, inProgress, earlyDevelopment } = categorizeFeatures();

  const handleRateClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setRating(0);
    setReview('');
    setRatingDialogOpen(true);
  };

  const submitRating = () => {
    if (!selectedFeature) return;
    const message = `Feature Review - ${selectedFeature.name}\n\nRating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)\n\nReview: ${review}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setRatingDialogOpen(false);
    setSelectedFeature(null);
    setRating(0);
    setReview('');
  };

  return (
    <div className="space-y-6">
      <FeatureCategory
        title="Nearly Complete"
        description="Features that are avialable and ready for reviewing."
        features={nearlyComplete}
        expandedBug={expandedBug}
        setExpandedBug={setExpandedBug}
        onRateClick={handleRateClick}
        badgeColor="bg-emerald-100 text-emerald-700"
        progressColor="#10b981"
      />

      <FeatureCategory
        title="In Progress"
        description="Features that are not ready but available for testing."
        features={inProgress}
        expandedBug={expandedBug}
        setExpandedBug={setExpandedBug}
        onRateClick={handleRateClick}
        badgeColor="bg-blue-100 text-blue-700"
        progressColor="#3b82f6"
      />

      <FeatureCategory
        title="Early Development"
        description="Features that are not available for testing yet."
        features={earlyDevelopment}
        expandedBug={expandedBug}
        setExpandedBug={setExpandedBug}
        onRateClick={handleRateClick}
        badgeColor="bg-amber-100 text-amber-700"
        progressColor="#f59e0b"
      />

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate {selectedFeature?.name}</DialogTitle>
            <DialogDescription>
              Share your experience with this feature. Your review will be
              submitted via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'size-8 transition-colors',
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-zinc-300',
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Tell us what you think about this feature..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setRatingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              onClick={submitRating}
              disabled={rating === 0}
            >
              <MessageCircle className="size-4" />
              Submit via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
