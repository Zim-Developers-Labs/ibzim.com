'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { categoryInfo, getCurrentPeriod, mockResults } from './constants';
import ShinyBadge from './shiny-badge';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="h-6 w-6 text-amber-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <Star className="h-6 w-6 text-gray-500" />;
  }
};

const getRankSmallIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="h-4 w-4 text-amber-500" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Award className="h-4 w-4 text-amber-600" />;
    default:
      return <Star className="h-4 w-4 text-gray-500" />;
  }
};

export default function AwardCategoryResultsPageWrapper() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;
  const awardCategory = params.awardCategory as string;
  const year = Number.parseInt(searchParams.get('year') || '2025');

  const info = categoryInfo[category as keyof typeof categoryInfo];
  const categoryData =
    mockResults[year as keyof typeof mockResults]?.[
      category as keyof (typeof mockResults)[2025]
    ];
  const currentCategoryData: any =
    categoryData?.[awardCategory as keyof typeof categoryData];

  if (!currentCategoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-red-300 bg-gradient-to-r from-red-100 to-red-200">
              <Star className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Category Not Found
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              The requested award category for {year} could not be found.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/zimbabwe-peoples-choice-awards">
                  Back to Awards
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Link
                  href={`/zimbabwe-peoples-choice-awards/${category}/results/${info?.categories[0] || 'company-of-the-year'}`}
                >
                  View Available Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentResults = currentCategoryData.results || [];
  const topThree = currentResults.slice(0, 3);
  const otherNominees = currentResults.slice(3);

  const categories = info?.categories || [];
  const currentIndex = categories.indexOf(awardCategory);
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null;
  const nextCategory =
    currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;

  const totalVotes = currentResults.reduce(
    (sum: number, result: any) => sum + (result.votes || 0),
    0,
  );

  const period = getCurrentPeriod(category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentCategoryData.title} {year}
              </h1>
              <p className="text-sm text-zinc-600 sm:text-base">
                {info?.title} Winners & Nominees
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {[2024, 2025].map((yearOption) => (
                <Button
                  key={yearOption}
                  variant={year === yearOption ? 'default' : 'outline'}
                  size="sm"
                  asChild
                  className={
                    year === yearOption
                      ? 'bg-primaryColor hover:bg-primaryColor/80'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                >
                  <Link
                    href={`/zimbabwe-peoples-choice-awards/${category}/results/${awardCategory}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/zimbabwe-peoples-choice-awards/${category}/results/${awardCategory}?year=${yearOption}`;
                    }}
                  >
                    {yearOption}
                  </Link>
                </Button>
              ))}
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
        </div>
      </div>

      {/* Winner Hero Section - Dark Zinc Theme */}
      {topThree.length > 0 && (
        <div className="relative overflow-hidden bg-zinc-900 text-white">
          {/* Background Pattern */}
          <svg
            viewBox="0 0 1208 1024"
            aria-hidden="true"
            className="absolute -bottom-48 left-1/2 z-0 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-20 lg:-top-0 lg:bottom-auto lg:translate-y-0"
          >
            <ellipse
              cx={604}
              cy={512}
              rx={604}
              ry={512}
              fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)"
            />
            <defs>
              <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
                <stop stopColor="#EAB308" />
                <stop offset={1} stopColor="#FF5A5A" />
              </radialGradient>
            </defs>
          </svg>

          <div className="relative mx-auto max-w-6xl px-4 py-16">
            {/* Winner Badge */}
            <div className="mb-8 text-center">
              <ShinyBadge text={`${year} Winner`} variant="platinum" />
            </div>

            {/* Winner Details */}
            <div className="flex flex-col items-center gap-12 lg:flex-row">
              {/* Winner Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Image
                    height={100}
                    width={100}
                    src={topThree[0].image || '/placeholder.svg'}
                    alt={topThree[0].name}
                    className={`object-cover shadow-2xl ${
                      topThree[0].imageType === 'portrait'
                        ? 'h-48 w-48 rounded-lg lg:h-56 lg:w-56'
                        : topThree[0].imageType === 'poster'
                          ? 'h-60 w-40 rounded-lg lg:h-72 lg:w-48'
                          : topThree[0].imageType === 'cityscape' ||
                              topThree[0].imageType === 'thumbnail'
                            ? 'h-40 w-64 rounded-lg lg:h-48 lg:w-80'
                            : topThree[0].imageType === 'album'
                              ? 'h-48 w-48 rounded-lg lg:h-56 lg:w-56'
                              : 'h-48 w-48 rounded-lg lg:h-56 lg:w-56'
                    }`}
                  />
                  {/* Glow Effect */}
                  <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-amber-400/20 blur-xl"></div>
                </div>
              </div>

              {/* Winner Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h2 className="mb-2 text-3xl font-medium text-white sm:text-4xl">
                    {topThree[0].name}
                  </h2>
                  {topThree[0].company && (
                    <p className="mb-2 text-lg text-zinc-300">
                      {topThree[0].company}
                    </p>
                  )}
                  {topThree[0].movie && (
                    <p className="mb-2 text-lg text-zinc-300">
                      from &quot;{topThree[0].movie}&quot;
                    </p>
                  )}
                  {topThree[0].artist && (
                    <p className="mb-2 text-lg text-zinc-300">
                      by {topThree[0].artist}
                    </p>
                  )}
                  {topThree[0].creator && (
                    <p className="mb-2 text-lg text-zinc-300">
                      by {topThree[0].creator}
                    </p>
                  )}
                </div>

                {/* Winner Stats */}
                {topThree[0].percentage && (
                  <div className="mx-auto grid max-w-sm grid-cols-2 gap-8 lg:mx-0">
                    <div className="text-center lg:text-left">
                      <div className="text-xl text-amber-400 lg:text-2xl">
                        {topThree[0].percentage}%
                      </div>
                      <div className="text-sm text-zinc-400">Vote Share</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-xl text-amber-400 lg:text-2xl">
                        {topThree[0].votes.toLocaleString()}
                      </div>
                      <div className="text-sm text-zinc-400">Total Votes</div>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {topThree[0].percentage && (
                  <div className="mx-auto mt-8 max-w-xs lg:mx-0">
                    <div className="h-2 w-full rounded-full bg-zinc-600">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-800 shadow-lg transition-all duration-1000"
                        style={{ width: `${topThree[0].percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Category Navigation */}
        <div className="mb-8 flex items-center justify-between">
          {prevCategory ? (
            <Button
              variant="outline"
              asChild
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link
                href={`/zimbabwe-peoples-choice-awards/${category}/results/${prevCategory}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/zimbabwe-peoples-choice-awards/${category}/results/${prevCategory}${year !== 2025 ? `?year=${year}` : ''}`;
                }}
              >
                <ChevronLeft className="mr-1 h-4 w-4 sm:mr-2" />
                Previous <span className="hidden sm:inline">Category</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              className="border-gray-300 text-gray-400"
            >
              <ChevronLeft className="mr-1 h-4 w-4 sm:mr-2" />
              Previous <span className="hidden sm:inline">Category</span>
            </Button>
          )}

          <div className="text-center">
            <p className="flex flex-col items-center text-sm text-gray-600 sm:flex-row sm:gap-1">
              <span className="block">Category</span>
              <span className="block">
                {currentIndex + 1} of {categories.length}
              </span>
            </p>
          </div>

          {nextCategory ? (
            <Button
              variant="outline"
              asChild
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link
                href={`/zimbabwe-peoples-choice-awards/${category}/results/${nextCategory}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/zimbabwe-peoples-choice-awards/${category}/results/${nextCategory}${year !== 2025 ? `?year=${year}` : ''}`;
                }}
              >
                Next <span className="hidden sm:inline">Category</span>
                <ChevronRight className="ml-1 h-4 w-4 sm:ml-2" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              className="border-gray-300 text-gray-400"
            >
              Next <span className="hidden sm:inline">Category</span>
              <ChevronRight className="ml-1 h-4 w-4 sm:ml-2" />
            </Button>
          )}
        </div>

        {/* Results Stats */}
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
                Total Votes Cast
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-none border-gray-200 bg-white sm:rounded-xl">
            <CardContent className="pt-2 text-center sm:pt-4 md:pt-6">
              <Trophy
                className="mx-auto mb-2 hidden h-3 w-3 text-amber-500 sm:inline sm:h-6 sm:w-6 md:h-8 md:w-8"
                strokeWidth={1}
              />
              <div className="text-base font-bold text-gray-900 sm:text-lg md:text-2xl">
                {categories.length}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Award Categories
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-l-none border-gray-200 bg-white sm:rounded-xl">
            <CardContent className="pt-2 text-center sm:pt-4 md:pt-6">
              <Crown
                className="mx-auto mb-2 hidden h-3 w-3 text-emerald-500 sm:inline sm:h-6 sm:w-6 md:h-8 md:w-8"
                strokeWidth={1}
              />
              <div className="text-base font-bold text-gray-900 sm:text-lg md:text-2xl">
                {currentResults.length}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Total Nominees
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Runners-up Section */}
        {topThree.length > 1 && (
          <Card className="mb-8 border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Medal className="h-5 w-5 text-gray-500" />
                Runners-up
              </CardTitle>
              <CardDescription className="text-gray-600">
                Second and third place finishers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {topThree.slice(1, 3).map((result: any, index: number) => (
                  <div
                    key={result.id}
                    className={`relative rounded-xl border-2 bg-white p-6 transition-all ${
                      index === 0
                        ? 'border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100'
                        : 'border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50'
                    }`}
                  >
                    <div className="flex items-start gap-4 md:items-center">
                      <div className="hidden items-center gap-2 sm:flex">
                        {getRankIcon(index + 2)}
                        <div className="text-xl font-bold text-gray-800">
                          #{index + 2}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 sm:hidden">
                        {getRankSmallIcon(index + 2)}
                        <div className="text-sm text-zinc-800">
                          #{index + 2}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Image
                          height={100}
                          width={100}
                          src={result.image || '/placeholder.svg'}
                          alt={result.name}
                          className={`border-2 border-gray-200 object-cover shadow-sm ${
                            result.imageType === 'portrait'
                              ? 'h-16 w-16 rounded-lg'
                              : result.imageType === 'poster'
                                ? 'h-18 w-12 rounded-lg'
                                : result.imageType === 'cityscape' ||
                                    result.imageType === 'thumbnail'
                                  ? 'h-12 w-20 rounded-lg'
                                  : result.imageType === 'album'
                                    ? 'h-16 w-16 rounded-lg'
                                    : 'h-16 w-16 rounded-lg'
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900">
                          {result.name}
                        </div>
                        {result.company && (
                          <div className="text-sm text-gray-600">
                            {result.company}
                          </div>
                        )}
                        {result.movie && (
                          <div className="text-sm text-gray-600">
                            from &quot;{result.movie}&quot;
                          </div>
                        )}
                        {result.artist && (
                          <div className="text-sm text-gray-600">
                            by {result.artist}
                          </div>
                        )}
                        {result.creator && (
                          <div className="text-sm text-gray-600">
                            by {result.creator}
                          </div>
                        )}
                        <div className="mt-1 text-sm text-gray-600">
                          {result.description}
                        </div>

                        {result.percentage && (
                          <div className="mt-3">
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="font-medium">
                                {result.percentage}%
                              </span>
                              <span className="text-gray-600">
                                {result.votes.toLocaleString()} votes
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  index === 0
                                    ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                                    : 'bg-gradient-to-r from-amber-600 to-orange-50'
                                }`}
                                style={{ width: `${result.percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Other Nominees Grid */}
        {otherNominees.length > 0 && (
          <Card className="mb-8 border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Star className="h-5 w-5 text-gray-500" />
                Other Nominees
              </CardTitle>
              <CardDescription className="text-gray-600">
                All other participants in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {otherNominees.map((nominee: any) => (
                  <div
                    key={nominee.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        height={100}
                        width={100}
                        src={nominee.image || '/placeholder.svg'}
                        alt={nominee.name}
                        className={`border border-gray-200 object-cover shadow-sm ${
                          nominee.imageType === 'portrait'
                            ? 'h-12 w-12 rounded-full'
                            : nominee.imageType === 'poster'
                              ? 'h-14 w-10 rounded'
                              : nominee.imageType === 'cityscape' ||
                                  nominee.imageType === 'thumbnail'
                                ? 'h-10 w-16 rounded'
                                : nominee.imageType === 'album'
                                  ? 'h-12 w-12 rounded'
                                  : 'h-12 w-12 rounded'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-gray-900">
                          {nominee.name}
                        </div>
                        {nominee.company && (
                          <div className="truncate text-xs text-gray-600">
                            {nominee.company}
                          </div>
                        )}
                        {nominee.movie && (
                          <div className="truncate text-xs text-gray-600">
                            from &quot;{nominee.movie}&quot;
                          </div>
                        )}
                        {nominee.artist && (
                          <div className="truncate text-xs text-gray-600">
                            by {nominee.artist}
                          </div>
                        )}
                        {nominee.creator && (
                          <div className="truncate text-xs text-gray-600">
                            by {nominee.creator}
                          </div>
                        )}
                        <div className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {nominee.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button asChild className="bg-primaryColor hover:bg-primaryColor/80">
            <Link href="/zimbabwe-peoples-choice-awards">
              <ArrowLeft className="mr-2 inline h-4 w-4" />
              Back to Awards
            </Link>
          </Button>
          {year === 2025 && period !== 'completed' && (
            <Button
              variant="outline"
              asChild
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href={`/zimbabwe-peoples-choice-awards/${category}/vote`}>
                Vote in Current Season
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
