'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  CircleDollarSign,
  CircleQuestionMark,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  currentSeason,
  getDaysRemainingInSeason,
  mockNominees,
  seasonConfig,
} from './constants';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VotingStats from './stats';
import { NomineeType, SanityAwardCategoryType } from '@/types';
import { urlForImage } from '@/lib/sanity/image';
import { submitVote } from './actions';
import { User } from '@/lib/server/constants';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

export default function VotingPageComponent({
  awardCategory,
  titleId,
  nominees,
  user,
}: {
  awardCategory: SanityAwardCategoryType;
  titleId: string;
  nominees: NomineeType[];
  user: User | null;
}) {
  const params = useParams();
  const category = params.category as string;
  const [currentTitleIndex, setCurrentTitleIndex] = useState(
    awardCategory.categoryTitles.findIndex(
      (cat) => cat.slug.current === titleId,
    ),
  );
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryStatus, setCategoryStatus] = useState<
    Record<string, { status: 'voted' | 'pending'; date?: Date }>
  >({});
  const [viewMode, setViewMode] = useState<string>('voting');

  const categoryTitles = awardCategory.categoryTitles || [];
  const currentTitle = categoryTitles.find(
    (cat) => cat.slug.current === titleId,
  )!;

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
    }
  }, [category]);

  const handleVote = async (nomineeId: string) => {
    const newVotes = { ...votes, [currentTitle.slug.current]: nomineeId };
    setVotes(newVotes);
    if (!user) {
      toast.error('You must be logged in to vote.');
      setLoading(false);
      return;
    }
    localStorage.setItem(`votes-${category}`, JSON.stringify(newVotes));
  };

  const handleSubmitVote = () => {
    setLoading(true);
    const now = new Date();
    const newStatus = {
      ...categoryStatus,
      [currentTitle.slug.current]: { status: 'voted' as const, date: now },
    };
    setCategoryStatus(newStatus);
    localStorage.setItem(
      `category-status-${category}`,
      JSON.stringify(newStatus),
    );

    if (!user) {
      toast.error('You must be logged in to vote.');
      setLoading(false);
      return;
    }
    // const response = await submitVote()

    // Move to next category if available
    if (currentTitleIndex < categoryTitles.length - 1) {
      setCurrentTitleIndex(currentTitleIndex + 1);
    }
    setLoading(false);
  };

  const goToCategory = (index: number) => {
    setCurrentTitleIndex(index);
    window.location.href = `/zimbabwe-peoples-choice-awards/${awardCategory.slug.current}/vote/${awardCategory.categoryTitles[index].slug.current}`;
  };

  const goToPrevious = () => {
    if (currentTitleIndex > 0) {
      setCurrentTitleIndex(currentTitleIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentTitleIndex < categoryTitles.length - 1) {
      setCurrentTitleIndex(currentTitleIndex + 1);
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

  const currentTitleStatus = getCategoryStatus(currentTitle.slug.current);
  const hasVoteInCurrentTitle = votes[currentTitle.slug.current];

  const totalVotes = Object.values(nominees)
    .flat()
    .reduce((sum: number, nominee: any) => sum + nominee.votes, 0);
  const votingProgress =
    ((currentTitleIndex + 1) / categoryTitles.length) * 100;

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
              {awardCategory.title} - Voting
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
              {currentTitleIndex + 1} of {categoryTitles.length} categories
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
            {categoryTitles.map((cat, index) => {
              const status = getCategoryStatus(cat.slug.current);
              return (
                <button
                  key={cat._id}
                  onClick={() => goToCategory(index)}
                  className={`flex cursor-pointer items-center gap-1 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                    index === currentTitleIndex
                      ? 'border-blue-300 bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                      : getCategoryStatusColor(status)
                  } hover:shadow-sm`}
                >
                  {getCategoryStatusIcon(status)}
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voting Stats */}
        <VotingStats
          stats={{
            totalVotes: totalVotes,
            daysRemaining: getDaysRemainingInSeason(),
            categoriesVoted: Object.values(categoryStatus).filter(
              (s) => s.status === 'voted',
            ).length,
            totalCategories: categoryTitles.length,
          }}
        />

        {/* Current Category Voting */}
        <Card className="mb-8 border-zinc-200 bg-white">
          <CardHeader>
            <div className="flex items-start justify-between sm:items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-zinc-900">
                  <Icons.ibzimAwardsIcon className="h-6 w-6" />
                  {currentTitle.title}
                </CardTitle>
                <CardDescription className="text-zinc-600">
                  {currentTitleStatus === 'voted'
                    ? 'Vote submitted (you can vote for this category again in the next season)'
                    : 'Choose your favorite nominee in this category'}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={getCategoryStatusColor(currentTitleStatus)}
              >
                {getCategoryStatusIcon(currentTitleStatus)}
                {currentTitleStatus === 'voted' ? 'Voted' : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Alert
              variant="default"
              className="relative mx-auto mb-8 max-w-4xl overflow-hidden bg-zinc-900 py-8 text-white"
            >
              <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-yellow-500/20 blur-3xl" />
              <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl" />

              <AlertCircle className="relative z-10 h-4 w-4" />
              <AlertDescription className="relative z-10 text-zinc-300">
                <div className="mb-4">
                  Switch to Statistics to view the current poll standings for
                  the top 3 nominees. With IBZIM Premium you can view standings
                  for all nominees
                </div>
                <Tabs value={viewMode} onValueChange={setViewMode}>
                  <TabsList>
                    <TabsTrigger
                      value="voting"
                      className="cursor-pointer px-2 text-xs data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
                    >
                      Voting
                    </TabsTrigger>
                    <TabsTrigger
                      value="statistics"
                      className="cursor-pointer px-2 text-xs data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
                    >
                      <Trophy className="size-3" />
                      Statistics
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </AlertDescription>
            </Alert>

            <ul className="grid gap-4">
              {nominees.map((nominee) => (
                <li key={nominee.nomineeProfile?._id}>
                  <div
                    onClick={() => {
                      if (
                        currentTitleStatus !== 'voted' &&
                        nominee.nomineeProfile?._id
                      ) {
                        handleVote(nominee.nomineeProfile._id);
                      }
                    }}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      currentTitleStatus === 'voted'
                        ? 'cursor-not-allowed border-zinc-200 bg-zinc-50'
                        : votes[currentTitle.slug.current] ===
                            nominee.nomineeProfile?._id.toString()
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
                          src={
                            nominee.nomineeProfile?.picture
                              ? urlForImage(
                                  nominee.nomineeProfile.picture,
                                ).url()
                              : '/fallback.webp'
                          }
                          alt={
                            nominee.nomineeProfile?.picture.alt ||
                            'Nominee Image'
                          }
                          className="h-18 w-18 rounded-lg border border-zinc-200 object-cover shadow-sm"
                        />
                      </div>

                      {/* Nominee Details */}
                      <div className="flex-1">
                        <div className="font-medium text-zinc-900">
                          {nominee.nomineeProfile?.name}
                        </div>
                        {titleId === 'comedian-of-the-year' && (
                          <div className="text-sm text-zinc-600">
                            {nominee.nomineeProfile?.legalName}
                          </div>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {votes[currentTitle.slug.current] ===
                        nominee.nomineeProfile?._id.toString() && (
                        <div className="flex-shrink-0">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      asChild
                    >
                      <Link
                        href={`/profiles/${nominee.nomineeProfile?.entityType}/${nominee.nomineeProfile?.slug.current}`}
                      >
                        <CircleQuestionMark className="size-3 h-3 w-3" />
                        Read Biography
                      </Link>
                    </Button>
                    <Dialog>
                      <DialogTrigger>
                        <Button size="sm" variant="outline" className="text-xs">
                          <CircleDollarSign className="size-3 h-3 w-3" />
                          Gift a dollar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>Set as public/private</DialogContent>
                    </Dialog>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Navigation and Action Buttons */}
        <div className="mb-12 space-y-4">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* Top Row - Navigation */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentTitleIndex === 0}
                className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={goToNext}
                disabled={currentTitleIndex === categoryTitles.length - 1}
                className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Bottom Row - Actions */}
            <div className="flex gap-2">
              {hasVoteInCurrentTitle && (
                <Button
                  onClick={handleSubmitVote}
                  className={`flex-1 bg-emerald-600 text-sm hover:bg-emerald-700`}
                  disabled={loading || currentTitleStatus === 'voted'}
                >
                  <Vote className="mr-1 h-4 w-4" />
                  Submit
                </Button>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden items-center justify-between md:flex">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentTitleIndex === 0}
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              {hasVoteInCurrentTitle && (
                <Button
                  onClick={handleSubmitVote}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Vote className="mr-2 h-4 w-4" />
                  Submit Vote
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={goToNext}
              disabled={currentTitleIndex === categoryTitles.length - 1}
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <Card className="border-zinc-200 bg-white">
          <CardContent className="text-center text-sm text-zinc-600">
            <div>Gifting Leaderboard</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
