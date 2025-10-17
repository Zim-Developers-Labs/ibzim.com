'use client';

import { Button } from '@/components/ui/button';
import { Calendar, ChartLine, Star, Trophy, Vote } from 'lucide-react';
import { awardCategories } from './constants';
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
import Link from 'next/link';
import AwardsHero from './hero';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { currentSeason } from '../[category]/vote/components/constants';
import FAQSection from './faq';

export default function AwardsPageComponent() {
  const selectedYear = 2025;
  const [activeTab, setActiveTab] = useState('voting');

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-900 px-4 pt-28 pb-48 text-white sm:px-6">
        <svg
          viewBox="0 0 1208 1024"
          aria-hidden="true"
          className="absolute -bottom-48 left-1/2 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-20 lg:-top-0 lg:bottom-auto lg:translate-y-0"
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
        <Icons.ibzimAwardsIcon className="mx-auto mb-6 block h-12 w-12 text-white" />
        <span className="from-secondaryColor via-primaryColor to-secondaryColor block bg-gradient-to-t bg-clip-text text-center tracking-widest text-transparent">
          {currentSeason.name} {selectedYear}
        </span>
        <h1 className="my-4">
          <span className="block text-center text-4xl tracking-wide">
            People&#39;s Choice <span className="font-light">Awards</span>
          </span>
        </h1>
        <p className="mx-auto mb-20 max-w-xl text-center font-light">
          Celebrating Zimbabwean excellence across different industries while
          rewarding both winners and voters.
        </p>
        <div className="absolute left-1/2 mx-auto mt-12 w-fit -translate-x-1/2 -translate-y-20">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger
                value="voting"
                className="data-[state=active]:bg-primaryColor cursor-pointer px-4 data-[state=active]:text-white"
              >
                Voting
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-primaryColor cursor-pointer px-4 data-[state=active]:text-white"
              >
                Statistics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      <section className="-mt-32 bg-zinc-900">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {awardCategories.map((category) => {
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
                              category.period === 'voting'
                                ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                : category.period === 'results'
                                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                                  : category.period === 'completed'
                                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 bg-gray-50 text-gray-700'
                            }`}
                          >
                            {category.period === 'voting' && (
                              <Vote className="mr-1 h-3 w-3" />
                            )}
                            {category.period === 'results' && (
                              <Trophy className="mr-1 h-3 w-3" />
                            )}
                            {category.period === 'completed' && (
                              <Star className="mr-1 h-3 w-3" />
                            )}
                            {category.period === 'upcoming' && (
                              <Calendar className="mr-1 h-3 w-3" />
                            )}
                            {category.period === 'voting'
                              ? 'Voting Open'
                              : category.period === 'results'
                                ? 'Results Available'
                                : category.period === 'completed'
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
                    {/* Action Buttons */}
                    {activeTab === 'voting' ? (
                      <div className="flex gap-2 pt-2">
                        {category.votingState === 'open' && (
                          <Button
                            asChild
                            className={`flex-1 ${
                              category.id === 'company'
                                ? 'bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300'
                                : category.id === 'city'
                                  ? 'bg-gradient-to-r from-emerald-300 via-emerald-600 to-emerald-300'
                                  : category.id === 'movie'
                                    ? 'bg-gradient-to-r from-purple-300 via-purple-600 to-purple-300'
                                    : category.id === 'comedy'
                                      ? 'bg-gradient-to-r from-orange-300 via-orange-600 to-orange-300'
                                      : category.id === 'school'
                                        ? 'bg-gradient-to-r from-red-300 via-red-600 to-red-300'
                                        : category.id === 'music'
                                          ? 'bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300'
                                          : 'bg-gray-300'
                            }`}
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

                        {category.votingState === 'closed' && (
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-300 text-sm text-gray-600"
                            disabled
                          >
                            <Calendar className="mr-1 h-4 w-4" />
                            Processing Statistics
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-2">
                        <Button
                          asChild
                          className={`flex-1 ${
                            category.id === 'company'
                              ? 'bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300'
                              : category.id === 'city'
                                ? 'bg-gradient-to-r from-emerald-300 via-emerald-600 to-emerald-300'
                                : category.id === 'movie'
                                  ? 'bg-gradient-to-r from-purple-300 via-purple-600 to-purple-300'
                                  : category.id === 'comedy'
                                    ? 'bg-gradient-to-r from-orange-300 via-orange-600 to-orange-300'
                                    : category.id === 'school'
                                      ? 'bg-gradient-to-r from-red-300 via-red-600 to-red-300'
                                      : category.id === 'music'
                                        ? 'bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300'
                                        : 'bg-gray-300'
                          }`}
                        >
                          <Link
                            href={`/zimbabwe-peoples-choice-awards/${category.id}/results`}
                            className="text-sm"
                          >
                            <ChartLine className="mr-1 h-4 w-4" />
                            View Statistics
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
      <AwardsHero />
      <FAQSection />
    </>
  );
}
