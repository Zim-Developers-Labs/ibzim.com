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
import { currentSeason, mockNominees, seasonConfig } from './constants';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import VotingStats from './stats';

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

export default function VotingPageComponent() {
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

  const currentPeriod = 'voting';

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
  // if (currentPeriod === 'completed') {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 p-4">
  //       <div className="mx-auto max-w-4xl">
  //         <div className="py-16 text-center">
  //           <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200">
  //             <Star className="h-12 w-12 text-blue-600" />
  //           </div>
  //           <h1 className="mb-4 text-3xl font-bold text-zinc-900">
  //             Awards Completed
  //           </h1>
  //           <p className="mb-8 text-lg text-zinc-600">
  //             The {info?.title} for this year have been completed. Check out the
  //             current winners!
  //           </p>
  //           <div className="flex justify-center gap-4">
  //             <Button asChild className="bg-blue-600 hover:bg-blue-700">
  //               <Link
  //                 href={`/zimbabwe-peoples-choice-awards/${category}/results`}
  //               >
  //                 <Trophy className="mr-2 h-4 w-4" />
  //                 View Current Winners
  //               </Link>
  //             </Button>
  //             <Button
  //               variant="outline"
  //               asChild
  //               className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
  //             >
  //               <Link href="/zimbabwe-peoples-choice-awards">
  //                 Back to Awards
  //               </Link>
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
        return 'bg-zinc-50 border-zinc-300 text-zinc-700';
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
    <div className="">
      <div
        className={`relative mb-8 px-4 ${seasonConfig.bgGradient} overflow-hidden transition-colors duration-700`}
      >
        {Array.from({ length: seasonConfig.count }).map((_, i) => {
          const particle =
            seasonConfig.particles[i % seasonConfig.particles.length];
          return (
            <div
              key={`${currentSeason.name}-${i}`}
              className={`absolute ${particle.color} ${particle.size} ${seasonConfig.animationStyle}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 6}s`,
              }}
            >
              {particle.emoji}
            </div>
          );
        })}
        <div className="my-8 flex flex-col items-center">
          <Icons.ibzimAwardsIcon className="text-primaryColor mx-auto my-4 block h-16 w-16" />
          <span className="text-primaryColor mb-8 block tracking-widest">
            {currentSeason.name} 2025
          </span>
          <div className="mb-4">
            <h1 className="mb-4 text-center text-3xl font-medium text-zinc-900 sm:text-4xl">
              {info?.title} - Voting
            </h1>
            <p className="text-center tracking-widest text-zinc-600">
              ROAD TO THE NATIONALS
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="mb-6 border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          >
            <Link href="/zimbabwe-peoples-choice-awards">
              <ArrowLeft className="h-4 w-4" />
              Back to Awards
            </Link>
          </Button>
        </div>
        <Alert
          variant="default"
          className="relative mx-auto mt-6 mb-24 max-w-4xl overflow-hidden bg-zinc-900 py-8 text-white"
        >
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-yellow-500/20 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl" />

          <AlertCircle className="relative z-10 h-4 w-4" />
          <AlertDescription className="relative z-10 text-zinc-300">
            Every season you can vote for your favorite nominees from whom the
            winners will be awarded a title and a cash prize at the Zimbabwe
            People&#39;s Choice Awards also known as &quot;The Nationals&quot;
            held once a year.
          </AlertDescription>
        </Alert>
      </div>
      <div className="mx-auto max-w-4xl px-4">
        {/* Category Progress */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 sm:text-base">
              Your Voting Progress
            </h2>
            <span className="text-sm text-zinc-600">
              {currentCategoryIndex + 1} of {awardCategories.length} categories
            </span>
          </div>
          <div className="relative mb-8 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600 transition-all duration-500"
              style={{ width: `${votingProgress}%` }}
            ></div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {awardCategories.map((cat, index) => {
              const status = getCategoryStatus(cat);
              return (
                <button
                  key={cat}
                  onClick={() => goToCategory(index)}
                  className={`flex cursor-pointer items-center gap-1 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
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
        <VotingStats
          stats={{
            totalVotes: totalVotes,
            daysRemaining: 15,
            categoriesVoted: Object.values(categoryStatus).filter(
              (s) => s.status === 'voted',
            ).length,
            totalCategories: awardCategories.length,
          }}
        />

        {/* Current Category Voting */}
        <Card className="mb-8 border-zinc-200 bg-white">
          <CardHeader>
            <div className="flex items-start justify-between sm:items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-zinc-900">
                  <Icons.ibzimAwardsIcon className="h-6 w-6" />
                  {currentCategory}
                </CardTitle>
                <CardDescription className="text-zinc-600">
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
                      ? 'cursor-not-allowed border-zinc-200 bg-zinc-50'
                      : votes[currentCategory] === nominee.id.toString()
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
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
                        className="h-8 w-18 rounded-lg border border-zinc-200 object-cover shadow-sm"
                      />
                    </div>

                    {/* Nominee Details */}
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900">
                        {nominee.name}
                      </div>
                      {nominee.company && (
                        <div className="text-sm text-zinc-600">
                          {nominee.company}
                        </div>
                      )}
                      {nominee.movie && (
                        <div className="text-sm text-zinc-600">
                          from &quote;{nominee.movie}&quote;
                        </div>
                      )}
                      {nominee.artist && (
                        <div className="text-sm text-zinc-600">
                          by {nominee.artist}
                        </div>
                      )}
                      {nominee.creator && (
                        <div className="text-sm text-zinc-600">
                          by {nominee.creator}
                        </div>
                      )}
                      <div className="mt-1 text-sm text-zinc-600">
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
                className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={goToNext}
                disabled={currentCategoryIndex === awardCategories.length - 1}
                className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
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
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
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
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary */}
        <Card className="mb-8 border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-zinc-900">Voting Summary</CardTitle>
            <CardDescription className="text-zinc-600">
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
                <div className="text-sm text-zinc-600">Voted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {
                    Object.values(categoryStatus).filter(
                      (s) => s.status === 'skipped',
                    ).length
                  }
                </div>
                <div className="text-sm text-zinc-600">Skipped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-zinc-600">
                  {awardCategories.length - Object.keys(categoryStatus).length}
                </div>
                <div className="text-sm text-zinc-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
