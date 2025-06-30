'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Star, Trophy, Vote } from 'lucide-react';
import { awardCategories, getCurrentPeriod } from './constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/container';
import { Icons } from '@/components/icons';

export default function AwardsPageWrapper() {
  const selectedYear = 2025;

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-900 px-4 pt-28 pb-48 text-white sm:px-6">
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
        <span className="from-secondaryColor via-primaryColor to-secondaryColor block bg-gradient-to-t bg-clip-text text-center tracking-widest text-transparent">
          SEASON 4 {selectedYear}
        </span>
        <h1 className="my-4">
          <span className="block text-center text-4xl tracking-wide">
            People&#39;s Choice <span className="font-light">Awards</span>
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-center font-light">
          Celebrating Zimbabwean excellence across industries, cities,
          entertainment, education, and music throughout the year
        </p>
        <Icons.ibzimAwardsIcon className="mx-auto mt-6 block h-12 w-12 text-white" />
      </section>
      <section className="-mt-32 bg-zinc-900">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {awardCategories.map((category) => {
              const period = getCurrentPeriod(category);
              const Icon = category.icon;

              return (
                <Card
                  key={category.id}
                  className={`group border-2 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 ${category.color} hover:scale-[1.02]`}
                >
                  <CardHeader className="pb-4">
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className={`rounded-xl bg-white p-3 shadow-sm ${category.iconColor}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {category.title}
                        </CardTitle>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${
                              period === 'voting'
                                ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                : period === 'results'
                                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                                  : period === 'completed'
                                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 bg-gray-50 text-gray-700'
                            }`}
                          >
                            {period === 'voting' && (
                              <Vote className="mr-1 h-3 w-3" />
                            )}
                            {period === 'results' && (
                              <Trophy className="mr-1 h-3 w-3" />
                            )}
                            {period === 'completed' && (
                              <Star className="mr-1 h-3 w-3" />
                            )}
                            {period === 'upcoming' && (
                              <Calendar className="mr-1 h-3 w-3" />
                            )}
                            {period === 'voting'
                              ? 'Voting Open'
                              : period === 'results'
                                ? 'Results Available'
                                : period === 'completed'
                                  ? 'Completed'
                                  : 'Upcoming'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="h-8 text-gray-600">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Timeline */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-700">
                        <span className="font-medium">
                          Voting: {category.votingMonth}
                        </span>
                        <span className="font-medium">
                          Results: {category.resultsMonth}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-200">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            category.id === 'company'
                              ? 'bg-gradient-to-r from-blue-600 to-blue-300'
                              : category.id === 'city'
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-300'
                                : category.id === 'movie'
                                  ? 'bg-gradient-to-r from-purple-600 to-purple-300'
                                  : category.id === 'comedy'
                                    ? 'bg-gradient-to-r from-orange-600 to-orange-300'
                                    : category.id === 'school'
                                      ? 'bg-gradient-to-r from-red-600 to-red-300'
                                      : category.id === 'music'
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-300'
                                        : 'bg-gray-300'
                          }`}
                          style={{
                            width: `${
                              period === 'voting'
                                ? 50
                                : period === 'results' || period === 'completed'
                                  ? 100
                                  : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex gap-2 pt-2">
                      {period === 'voting' && (
                        <Button
                          asChild
                          className="flex-1 border-yellow-500 bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Link
                            href={`/zimbabwe-peoples-choice-awards/${category.id}/vote`}
                            className="text-sm"
                          >
                            <Vote className="mr-1 h-4 w-4" />
                            Vote Now
                          </Link>
                        </Button>
                      )}
                      {period === 'results' && (
                        <Button
                          asChild
                          className="flex-1 border-amber-500 bg-amber-600 hover:bg-amber-700"
                        >
                          <Link
                            href={`/zimbabwe-peoples-choice-awards/${category.id}/results`}
                            className="text-sm"
                          >
                            <Trophy className="mr-1 h-4 w-4" />
                            View Results
                          </Link>
                        </Button>
                      )}
                      {period === 'completed' && (
                        <Button
                          asChild
                          className="flex-1 border-zinc-500 bg-zinc-900 hover:bg-zinc-700"
                        >
                          <Link
                            href={`/zimbabwe-peoples-choice-awards/${category.id}/results/${category.mainAward}`}
                            className="text-sm"
                          >
                            <Trophy className="mr-1 h-4 w-4" />
                            Current Winners
                          </Link>
                        </Button>
                      )}
                      {period === 'upcoming' && (
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 text-sm text-gray-600 sm:text-base"
                          disabled
                        >
                          <Calendar className="mr-1 h-4 w-4" />
                          Coming Soon
                        </Button>
                      )}
                      {(period === 'completed' ||
                        period === 'results' ||
                        period === 'voting' ||
                        period === 'upcoming') && (
                        <Button
                          variant="outline"
                          asChild
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Link
                            href={`/zimbabwe-peoples-choice-awards/${category.id}/results/${category.mainAward}`}
                            className="text-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(
                                `/zimbabwe-peoples-choice-awards/${category.id}/results/${category.mainAward}?year=${selectedYear - 1}`,
                                '_blank',
                              );
                            }}
                          >
                            <Star className="mr-1 h-4 w-4" />
                            Past Winners
                          </Link>
                        </Button>
                      )}
                    </div> */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-sm text-gray-600 sm:text-base"
                        disabled
                      >
                        <Calendar className="mr-1 h-4 w-4" />
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
