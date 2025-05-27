'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Vote,
  Trophy,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  SkipForward,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockNominees } from './constants';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const categoryInfo = {
  company: {
    title: 'Company Awards',
    period: 'January Voting',
    categories: [
      'Company of the Year',
      'Best CEO',
      'Best Startup',
      'Best Services',
      'Best Product',
    ],
  },
  city: {
    title: 'City Awards',
    period: 'March Voting',
    categories: ['City of the Year', 'Cleanest City', 'Most Enjoyable City'],
  },
  movie: {
    title: 'Movie Awards',
    period: 'May Voting',
    categories: ['Movie of the Year', 'Best Actor', 'Best Director'],
  },
  comedy: {
    title: 'Comedy Awards',
    period: 'July Voting',
    categories: ['Comedian of the Year', 'Best Skit'],
  },
  school: {
    title: 'School Awards',
    period: 'September Voting',
    categories: [
      'School of the Year',
      'Best Academics',
      'Best Sporting',
      'Best Uniform',
    ],
  },
  music: {
    title: 'Music Awards',
    period: 'November Voting',
    categories: ['Artist of the Year', 'Best Song', 'Best Album'],
  },
};

export default function VotingPageWrapper() {
  const params = useParams();
  const category = params.category as string;
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [categoryStatus, setCategoryStatus] = useState<
    Record<string, { status: 'voted' | 'skipped' | 'pending'; date?: Date }>
  >({});
  const [canEditVotes, setCanEditVotes] = useState<Record<string, boolean>>({});

  const info = categoryInfo[category as keyof typeof categoryInfo];
  const nominees = mockNominees[category as keyof typeof mockNominees] || {};
  const awardCategories = info?.categories || [];
  const currentCategory = awardCategories[currentCategoryIndex];

  const period = useCallback(() => {
    const currentMonth = new Date().getMonth() + 1;
    const votingMonths = {
      company: 1, // January
      city: 3, // March
      movie: 5, // May
      comedy: 7, // July
      school: 9, // September
      music: 11, // November
    };
    const resultsMonths = {
      company: 2, // February
      city: 4, // April
      movie: 6, // June
      comedy: 8, // August
      school: 10, // October
      music: 12, // December
    };

    const votingMonth = votingMonths[category as keyof typeof votingMonths];
    const resultsMonth = resultsMonths[category as keyof typeof resultsMonths];

    if (currentMonth === votingMonth) return 'voting';
    if (currentMonth === resultsMonth) return 'results';
    if (currentMonth > resultsMonth) return 'completed';
    return 'upcoming';
  }, [category]);

  const currentPeriod = period();

  // Load previous votes on component mount
  useEffect(() => {
    const savedVotes = localStorage.getItem(`votes-${category}`);
    const savedStatus = localStorage.getItem(`category-status-${category}`);

    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }

    if (savedStatus) {
      const status = JSON.parse(savedStatus);
      setCategoryStatus(status);

      // Check edit permissions for voted categories
      const editPermissions: Record<string, boolean> = {};
      Object.entries(status).forEach(([cat, data]: [string, any]) => {
        if (data.status === 'voted' && data.date) {
          const voteDate = new Date(data.date);
          const canEdit =
            new Date().getTime() - voteDate.getTime() < 3 * 24 * 60 * 60 * 1000;
          editPermissions[cat] = canEdit;
        } else {
          editPermissions[cat] = true; // Skipped categories can always be voted
        }
      });
      setCanEditVotes(editPermissions);
    }
  }, [category]);

  // If award is completed, show completed message instead of voting form
  if (currentPeriod === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200">
              <Star className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Awards Completed
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              The {info?.title} for this year have been completed. Check out the
              current winners!
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link
                  href={`/zimbabwe-peoples-choice-awards/${category}/results`}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  View Current Winners
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Link href="/zimbabwe-peoples-choice-awards">
                  Back to Awards
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleVote = (nomineeId: string) => {
    const newVotes = { ...votes, [currentCategory]: nomineeId };
    setVotes(newVotes);
    localStorage.setItem(`votes-${category}`, JSON.stringify(newVotes));
  };

  const handleSubmitVote = () => {
    const now = new Date();
    const newStatus = {
      ...categoryStatus,
      [currentCategory]: { status: 'voted' as const, date: now },
    };
    setCategoryStatus(newStatus);
    localStorage.setItem(
      `category-status-${category}`,
      JSON.stringify(newStatus),
    );

    // Update edit permissions
    setCanEditVotes((prev) => ({ ...prev, [currentCategory]: true }));

    // Move to next category if available
    if (currentCategoryIndex < awardCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handleSkipCategory = () => {
    const newStatus = {
      ...categoryStatus,
      [currentCategory]: { status: 'skipped' as const },
    };
    setCategoryStatus(newStatus);
    localStorage.setItem(
      `category-status-${category}`,
      JSON.stringify(newStatus),
    );

    // Move to next category if available
    if (currentCategoryIndex < awardCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const goToCategory = (index: number) => {
    setCurrentCategoryIndex(index);
  };

  const goToPrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentCategoryIndex < awardCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const getCategoryStatus = (categoryName: string) => {
    return categoryStatus[categoryName]?.status || 'pending';
  };

  const getCategoryStatusColor = (status: string) => {
    switch (status) {
      case 'voted':
        return 'bg-emerald-50 border-emerald-300 text-emerald-700';
      case 'skipped':
        return 'bg-amber-50 border-amber-300 text-amber-700';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-700';
    }
  };

  const getCategoryStatusIcon = (status: string) => {
    switch (status) {
      case 'voted':
        return <Check className="mr-1 h-3 w-3" />;
      case 'skipped':
        return <SkipForward className="mr-1 h-3 w-3" />;
      default:
        return <Clock className="mr-1 h-3 w-3" />;
    }
  };

  const currentCategoryStatus = getCategoryStatus(currentCategory);
  const currentCanEdit = canEditVotes[currentCategory] !== false;
  const hasVoteInCurrentCategory = votes[currentCategory];
  const currentNominees: any =
    nominees[currentCategory as keyof typeof nominees] || [];

  const totalVotes = Object.values(nominees)
    .flat()
    .reduce((sum: number, nominee: any) => sum + nominee.votes, 0);
  const votingProgress =
    ((currentCategoryIndex + 1) / awardCategories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="my-8">
          <Icons.ibzimAwardsIcon className="mx-auto my-8 block h-16 w-16 text-zinc-900 sm:hidden" />
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href="/zimbabwe-peoples-choice-awards">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-medium text-gray-900 sm:text-3xl">
                {info?.title} - Voting
              </h1>
              <p className="text-base text-gray-600 sm:text-lg">
                {info?.period} • Vote for your favorites
              </p>
            </div>
          </div>
        </div>
        <Alert variant="destructive" className="my-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Full Disclosure</AlertTitle>
          <AlertDescription>
            This feature is still being developed and all the data is for
            demonstration.
          </AlertDescription>
        </Alert>
        {/* Category Progress */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
              Voting Progress
            </h2>
            <span className="text-sm text-gray-600">
              {currentCategoryIndex + 1} of {awardCategories.length} categories
            </span>
          </div>
          <Progress value={votingProgress} className="mb-4 bg-gray-200" />

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {awardCategories.map((cat, index) => {
              const status = getCategoryStatus(cat);
              return (
                <button
                  key={cat}
                  onClick={() => goToCategory(index)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    index === currentCategoryIndex
                      ? 'border-blue-300 bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                      : getCategoryStatusColor(status)
                  } hover:shadow-sm`}
                >
                  {getCategoryStatusIcon(status)}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voting Stats */}
        <div className="mb-8 grid grid-cols-3 sm:gap-3 md:gap-4">
          <Card className="rounded-r-none border-gray-200 bg-white sm:rounded-xl">
            <CardContent className="pt-2 text-center sm:pt-4 md:pt-6">
              <Users
                className="mx-auto mb-2 hidden h-3 w-3 text-blue-500 sm:inline sm:h-6 sm:w-6 md:h-8 md:w-8"
                strokeWidth={1}
              />
              <div className="text-base font-bold text-gray-900 sm:text-lg md:text-2xl">
                {totalVotes.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Total Votes
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-none border-gray-200 bg-white sm:rounded-xl">
            <CardContent className="pt-2 text-center sm:pt-4 md:pt-6">
              <Clock
                className="mx-auto mb-2 hidden h-3 w-3 text-orange-500 sm:inline sm:h-6 sm:w-6 md:h-8 md:w-8"
                strokeWidth={1}
              />
              <div className="text-base font-bold text-gray-900 sm:text-lg md:text-2xl">
                15
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Days Remaining
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-l-none border-gray-200 bg-white sm:rounded-xl">
            <CardContent className="pt-2 text-center sm:pt-4 md:pt-6">
              <Vote
                className="mx-auto mb-2 hidden h-3 w-3 text-emerald-500 sm:inline sm:h-6 sm:w-6 md:h-8 md:w-8"
                strokeWidth={1}
              />
              <div className="text-base font-bold text-gray-900 sm:text-lg md:text-2xl">
                {
                  Object.values(categoryStatus).filter(
                    (s) => s.status === 'voted',
                  ).length
                }
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Categories Voted
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Category Voting */}
        <Card className="mb-8 border-gray-200 bg-white">
          <CardHeader>
            <div className="flex items-start justify-between sm:items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Icons.ibzimAwardsIcon className="h-6 w-6" />
                  {currentCategory}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {currentCategoryStatus === 'voted'
                    ? currentCanEdit
                      ? 'You can edit your vote for a few more days'
                      : 'Vote submitted (editing period expired)'
                    : currentCategoryStatus === 'skipped'
                      ? 'Category skipped - you can still vote'
                      : 'Choose your favorite nominee in this category'}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={getCategoryStatusColor(currentCategoryStatus)}
              >
                {getCategoryStatusIcon(currentCategoryStatus)}
                {currentCategoryStatus === 'voted'
                  ? 'Voted'
                  : currentCategoryStatus === 'skipped'
                    ? 'Skipped'
                    : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Edit Warning */}
            {currentCategoryStatus === 'voted' && !currentCanEdit && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <Clock className="mr-1 inline h-4 w-4" />
                  Your vote in this category is locked. The 3-day editing period
                  has expired.
                </p>
              </div>
            )}

            <div className="grid gap-4">
              {currentNominees.map((nominee: any) => (
                <div
                  key={nominee.id}
                  onClick={() => {
                    if (
                      !(currentCategoryStatus === 'voted' && !currentCanEdit)
                    ) {
                      handleVote(nominee.id.toString());
                    }
                  }}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    currentCategoryStatus === 'voted' && !currentCanEdit
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                      : votes[currentCategory] === nominee.id.toString()
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Nominee Image */}
                    <div className="flex-shrink-0">
                      <Image
                        width={72}
                        height={72}
                        src={`/placeholder.svg?height=60&width=60&query=${encodeURIComponent(nominee.name)}`}
                        alt={nominee.name}
                        className="h-8 w-18 rounded-lg border border-gray-200 object-cover shadow-sm"
                      />
                    </div>

                    {/* Nominee Details */}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {nominee.name}
                      </div>
                      {nominee.company && (
                        <div className="text-sm text-gray-600">
                          {nominee.company}
                        </div>
                      )}
                      {nominee.movie && (
                        <div className="text-sm text-gray-600">
                          from &quote;{nominee.movie}&quote;
                        </div>
                      )}
                      {nominee.artist && (
                        <div className="text-sm text-gray-600">
                          by {nominee.artist}
                        </div>
                      )}
                      {nominee.creator && (
                        <div className="text-sm text-gray-600">
                          by {nominee.creator}
                        </div>
                      )}
                      <div className="mt-1 text-sm text-gray-600">
                        {nominee.description}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {votes[currentCategory] === nominee.id.toString() && (
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation and Action Buttons */}
        <div className="mb-8 space-y-4">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* Top Row - Navigation */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentCategoryIndex === 0}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={goToNext}
                disabled={currentCategoryIndex === awardCategories.length - 1}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Bottom Row - Actions */}
            <div className="flex gap-2">
              {currentCategoryStatus !== 'voted' && (
                <Button
                  variant="outline"
                  onClick={handleSkipCategory}
                  className="flex-1 border-amber-300 text-sm text-amber-700 hover:bg-amber-50"
                >
                  <SkipForward className="mr-1 h-4 w-4" />
                  Skip
                </Button>
              )}

              {(currentCategoryStatus !== 'voted' || currentCanEdit) &&
                hasVoteInCurrentCategory && (
                  <Button
                    onClick={handleSubmitVote}
                    className={`bg-emerald-600 text-sm hover:bg-emerald-700 ${
                      currentCategoryStatus !== 'voted' ? 'flex-1' : 'flex-1'
                    }`}
                  >
                    <Vote className="mr-1 h-4 w-4" />
                    {currentCategoryStatus === 'voted' ? 'Update' : 'Submit'}
                  </Button>
                )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden items-center justify-between md:flex">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentCategoryIndex === 0}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              {currentCategoryStatus !== 'voted' && (
                <Button
                  variant="outline"
                  onClick={handleSkipCategory}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip Category
                </Button>
              )}

              {(currentCategoryStatus !== 'voted' || currentCanEdit) &&
                hasVoteInCurrentCategory && (
                  <Button
                    onClick={handleSubmitVote}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Vote className="mr-2 h-4 w-4" />
                    {currentCategoryStatus === 'voted'
                      ? 'Update Vote'
                      : 'Submit Vote'}
                  </Button>
                )}
            </div>

            <Button
              variant="outline"
              onClick={goToNext}
              disabled={currentCategoryIndex === awardCategories.length - 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary */}
        <Card className="mb-8 border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Voting Summary</CardTitle>
            <CardDescription className="text-gray-600">
              Your progress across all categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {
                    Object.values(categoryStatus).filter(
                      (s) => s.status === 'voted',
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Voted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {
                    Object.values(categoryStatus).filter(
                      (s) => s.status === 'skipped',
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Skipped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {awardCategories.length - Object.keys(categoryStatus).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
