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
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  CircleDollarSign,
  CircleQuestionMark,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  currentSeason,
  getDaysRemainingInSeason,
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
import { textify } from '@/lib/utils';
import { VotesType } from '@/lib/server/db';
import { Spinner } from '@/components/ui/spinner';

export default function VotingPageComponent({
  awardCategory,
  titleId,
  nominees,
  user,
  dbVotes,
  dbUserCategoryVotes,
}: {
  awardCategory: SanityAwardCategoryType;
  titleId: string;
  nominees: NomineeType[];
  user: User | null;
  dbVotes: VotesType[] | null;
  dbUserCategoryVotes: VotesType[] | null;
}) {
  const currentTitleIndex = awardCategory.categoryTitles.findIndex(
    (cat) => cat.slug.current === titleId,
  );
  const [votes, setVotes] = useState<VotesType[] | null>(dbVotes);
  const [loading, setLoading] = useState<boolean>(false);
  const [userCategoryVotes, setUserCategoryVotes] = useState<
    VotesType[] | null
  >(dbUserCategoryVotes);

  const userHasPremium = true; // Set to true to unlock all nominee statistics

  const initialTitleStatus = userCategoryVotes
    ? userCategoryVotes.find((vote) => vote.titleId === titleId)
      ? 'voted'
      : 'pending'
    : 'pending';
  const [titleStatus, setTitleStatus] = useState<'voted' | 'pending'>(
    initialTitleStatus,
  );
  const [viewMode, setViewMode] = useState<string>('voting');

  const [selectedNomineeId, setSelectedNomineeId] = useState<string | null>(
    null,
  );
  const categoryTitles = awardCategory.categoryTitles || [];

  const [votingProgress, setVotingProgress] = useState<number>(
    ((userCategoryVotes ? userCategoryVotes.length : 0) /
      categoryTitles.length) *
      100,
  );
  const currentTitle = categoryTitles.find(
    (cat) => cat.slug.current === titleId,
  )!;

  useEffect(() => {
    if (votes && user) {
      const existingVote = votes.find(
        (v) => v.userId === user.id && v.titleId === currentTitle.slug.current,
      );
      if (existingVote) {
        setSelectedNomineeId(existingVote.nomineeId);
      } else {
        setSelectedNomineeId(null);
      }
    }
  }, [votes, user, currentTitle]);

  const handleNomineeClick = async (nomineeId: string) => {
    if (titleStatus !== 'voted') {
      setSelectedNomineeId(nomineeId);
    }
  };

  const handleSubmitVote = async () => {
    if (!user) {
      toast.error('You must be logged in to vote.');
      return;
    }

    if (!selectedNomineeId) {
      toast.error('Please select a nominee first.');
      return;
    }

    setLoading(true);

    try {
      const result = await submitVote(
        user.id,
        user.username,
        user.ip,
        selectedNomineeId,
        currentTitle.slug.current,
        awardCategory.slug.current,
      );

      if (result.vote) {
        // Update local state with new vote
        const newVote: VotesType = result.vote;
        setUserCategoryVotes((prev) => (prev ? [...prev, newVote] : [newVote]));
        setVotingProgress(
          ((userCategoryVotes ? userCategoryVotes.length + 1 : 1) /
            categoryTitles.length) *
            100,
        );

        setVotes((prev) => (prev ? [...prev, newVote] : [newVote]));
        setTitleStatus('voted');

        toast.success('Vote submitted successfully!');
        toast.success(`You have added $0.01 to your nominee balance`);
        toast.success('You have earned +20 Impact Points');
      } else {
        toast.error(result.error || 'Failed to submit vote.');
      }
    } catch (error) {
      console.error('[v0] Error submitting vote:', error);
      toast.error('An error occurred while submitting your vote.');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    if (currentTitleIndex > 0) {
      window.location.href = `/zimbabwe-peoples-choice-awards/${awardCategory.slug.current}/vote/${awardCategory.categoryTitles[currentTitleIndex - 1].slug.current}`;
    }
  };

  const goToNext = () => {
    if (currentTitleIndex < categoryTitles.length - 1) {
      window.location.href = `/zimbabwe-peoples-choice-awards/${awardCategory.slug.current}/vote/${awardCategory.categoryTitles[currentTitleIndex + 1].slug.current}`;
    }
  };

  const getAnyTitleStatus = (titleId: string) => {
    const vote = userCategoryVotes?.find((vote) => vote.titleId === titleId);
    return vote ? 'voted' : 'pending';
  };

  const getTitleStatusColor = (selectedTitle: string) => {
    const status = getAnyTitleStatus(selectedTitle);
    switch (status) {
      case 'voted':
        return 'bg-emerald-50 border-emerald-300 text-emerald-700';
      default:
        return 'bg-zinc-50 border-zinc-300 text-zinc-700';
    }
  };

  const getTitleStatusIcon = (selectedTitle: string) => {
    const status = getAnyTitleStatus(selectedTitle);
    switch (status) {
      case 'voted':
        return <Check className="mr-1 h-3 w-3" />;
      default:
        return <Clock className="mr-1 h-3 w-3" />;
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'statistics') {
      if (titleStatus !== 'voted') {
        if (!user) {
          // or however you check if user is logged in
          toast.error('Login and vote to see statistics');
          return;
        }
        toast.error('Vote first to see statistics');
        return;
      }
    }
    setViewMode(value);
  };
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
              {textify(titleId)} - {awardCategory.title}
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
              {userCategoryVotes ? userCategoryVotes.length : 0} of{' '}
              {categoryTitles.length} Titles
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
            {categoryTitles.map((title, index) => {
              return (
                <Link
                  href={`/zimbabwe-peoples-choice-awards/${awardCategory.slug.current}/vote/${awardCategory.categoryTitles[index].slug.current}`}
                  key={title._id}
                  className={`flex cursor-pointer items-center gap-1 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                    index === currentTitleIndex
                      ? 'border-blue-300 bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                      : getTitleStatusColor(title.slug.current)
                  } hover:shadow-sm`}
                >
                  {getTitleStatusIcon(title.slug.current)}
                  {title.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Voting Stats */}
        <VotingStats
          stats={{
            totalVotes: votes ? (votes.length > 0 ? votes.length : 0) : 0,
            daysRemaining: getDaysRemainingInSeason(),
            totalTitles: categoryTitles.length,
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
                  {titleStatus === 'voted'
                    ? 'Vote submitted (you can vote for this category again in the next season)'
                    : 'Choose your favorite nominee in this category'}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={getTitleStatusColor(titleStatus)}
              >
                {getTitleStatusIcon(titleStatus)}
                {titleStatus === 'voted' ? 'Voted' : 'Pending'}
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
                <Tabs value={viewMode} onValueChange={handleTabChange}>
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
              {viewMode === 'statistics'
                ? (() => {
                    // Calculate vote counts for each nominee
                    const nomineeVoteCounts = nominees.map((nominee) => {
                      const voteCount = votes
                        ? votes.filter(
                            (v) => v.nomineeId === nominee.nomineeProfile?._id,
                          ).length
                        : 0;
                      return { nominee, voteCount };
                    });

                    const sortedNominees = nomineeVoteCounts.sort(
                      (a, b) => b.voteCount - a.voteCount,
                    );

                    // Calculate total votes for percentage
                    const totalVotes = votes ? votes.length : 0;

                    return sortedNominees.map(
                      ({ nominee, voteCount }, index) => {
                        const percentage =
                          totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                        const isGold = index === 0;
                        const isSilver = index === 1;
                        const isLocked = index > 1 && !userHasPremium;

                        return (
                          <li
                            key={nominee.nomineeProfile?._id}
                            className={isLocked ? 'relative' : ''}
                          >
                            <div
                              className={`relative overflow-hidden rounded-lg border-2 px-4 py-4 transition-all md:px-8 ${
                                isGold
                                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg'
                                  : isSilver
                                    ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 shadow-md'
                                    : 'border-zinc-200 bg-zinc-50'
                              } ${isLocked ? 'blur-sm' : ''}`}
                            >
                              <div className="flex items-start space-x-4 sm:items-center md:space-x-8">
                                {!isLocked && (
                                  <div className="hidden items-center gap-2 sm:flex">
                                    <Trophy
                                      className={`h-6 w-6 ${
                                        isGold
                                          ? 'text-yellow-500'
                                          : isSilver
                                            ? 'text-gray-400'
                                            : 'text-zinc-400'
                                      }`}
                                    />
                                    <div className="text-xl font-bold text-gray-800">
                                      #{index + 1}
                                    </div>
                                  </div>
                                )}
                                {!isLocked && (
                                  <div className="absolute bottom-4 left-4 flex items-center gap-1 sm:hidden">
                                    <Trophy
                                      className={`h-4 w-4 ${
                                        isGold
                                          ? 'text-yellow-500'
                                          : isSilver
                                            ? 'text-gray-400'
                                            : 'text-zinc-400'
                                      }`}
                                    />
                                    <div className="text-sm text-zinc-800">
                                      #{index + 1}
                                    </div>
                                  </div>
                                )}
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
                                    className="h-18 w-18 rounded-lg border-2 border-zinc-200 object-cover shadow-sm"
                                  />
                                </div>

                                {/* Nominee Details */}
                                <div className="flex-1">
                                  <div
                                    className={`mb-2 font-semibold sm:mb-0 ${
                                      isGold
                                        ? 'text-yellow-900'
                                        : isSilver
                                          ? 'text-gray-900'
                                          : 'text-zinc-900'
                                    }`}
                                  >
                                    {nominee.nomineeProfile?.name}
                                  </div>
                                  {titleId === 'comedian-of-the-year' && (
                                    <div
                                      className={`text-sm ${
                                        isGold
                                          ? 'text-yellow-700'
                                          : isSilver
                                            ? 'text-gray-600'
                                            : 'text-zinc-600'
                                      }`}
                                    >
                                      {nominee.nomineeProfile?.legalName}
                                    </div>
                                  )}

                                  {/* Vote Statistics */}
                                  <div className="mt-5 sm:mt-3">
                                    <div className="mb-2 flex max-w-sm items-center justify-between text-sm">
                                      <span
                                        className={`font-medium ${
                                          isGold
                                            ? 'text-yellow-800'
                                            : isSilver
                                              ? 'text-gray-700'
                                              : 'text-zinc-700'
                                        }`}
                                      >
                                        {voteCount} votes
                                      </span>
                                      <span
                                        className={`font-semibold ${
                                          isGold
                                            ? 'text-yellow-900'
                                            : isSilver
                                              ? 'text-gray-800'
                                              : 'text-zinc-800'
                                        }`}
                                      >
                                        {percentage.toFixed(1)}%
                                      </span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div
                                      className={`relative h-2 w-full max-w-sm overflow-hidden rounded-full ${
                                        isGold
                                          ? 'bg-yellow-200'
                                          : isSilver
                                            ? 'bg-gray-200'
                                            : 'bg-zinc-200'
                                      }`}
                                    >
                                      <div
                                        className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${
                                          isGold
                                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                            : isSilver
                                              ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                                              : 'bg-gradient-to-r from-zinc-400 to-zinc-600'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isLocked && (
                              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-[2px]">
                                <div className="rounded-lg bg-white px-6 py-4 text-center shadow-xl">
                                  <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
                                  <h3 className="mb-1 font-semibold text-zinc-900">
                                    Premium Feature
                                  </h3>
                                  <p className="mb-3 text-sm text-zinc-600">
                                    Upgrade to view all nominee statistics
                                  </p>
                                  <Button
                                    size="sm"
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                  >
                                    Upgrade to Premium
                                  </Button>
                                </div>
                              </div>
                            )}

                            {!isLocked && (
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
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <CircleDollarSign className="size-3 h-3 w-3" />
                                      Gift a dollar
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    Set as public/private
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}
                          </li>
                        );
                      },
                    );
                  })()
                : nominees.map((nominee) => (
                    <li key={nominee.nomineeProfile?._id}>
                      <div
                        onClick={() => {
                          if (
                            titleStatus !== 'voted' &&
                            nominee.nomineeProfile?._id
                          ) {
                            handleNomineeClick(nominee.nomineeProfile._id);
                          }
                        }}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          selectedNomineeId === nominee.nomineeProfile?._id
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
                          {selectedNomineeId ===
                            nominee.nomineeProfile?._id && (
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
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
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
            <div className="flex items-center justify-center">
              {titleStatus === 'pending' ? (
                <Button
                  onClick={handleSubmitVote}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <Spinner className="mr-1 h-4 w-4" />
                  ) : (
                    <Vote className="mr-1 h-4 w-4" />
                  )}
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              ) : (
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href={user ? `/${user.username}/votes` : '#'}>
                    Manage Votes
                  </Link>
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
              {titleStatus === 'pending' ? (
                <Button
                  onClick={handleSubmitVote}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Vote className="mr-2 h-4 w-4" />
                  )}
                  {loading ? 'Submitting...' : 'Submit Vote'}
                </Button>
              ) : (
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href={user ? `/${user.username}/votes` : '#'}>
                    Manage Votes
                  </Link>
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
        <Card className="mb-8 border-zinc-200 bg-white">
          <CardContent className="text-center text-sm text-zinc-600">
            <div>Gifting Leaderboard</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
