'use client';

import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  ChartLine,
  Clock,
  Star,
  Trophy,
  Vote,
} from 'lucide-react';
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
import { currentSeason } from '../[category]/vote/[titleId]/components/constants';
import FAQSection from './faq';
import { AwardCategoryType, SanityAwardCategoryType } from '@/types';
import { awardCategoriesMetadata } from './constants';
import { DOMAIN_URLS } from '@/lib/constants';

export default function AwardsPageComponent({
  sanityAwardCategories,
}: {
  sanityAwardCategories: SanityAwardCategoryType[];
}) {
  const selectedYear = 2025;
  const [activeTab, setActiveTab] = useState('voting');

  const awardCategories: AwardCategoryType[] = sanityAwardCategories.map(
    (cat: SanityAwardCategoryType) => {
      const match = awardCategoriesMetadata.find(
        (c) => c.id === cat.slug.current,
      );
      return {
        _id: cat._id,
        title: cat.title,
        description: cat.description,
        votingState: cat.votingState,
        categoryTitles: cat.categoryTitles,

        id: match?.id || '',
        icon: match?.icon || null,
        color: match?.color || '',
        iconColor: match?.iconColor || '',
      } as AwardCategoryType;
    },
  );

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
                value="guides"
                className="data-[state=active]:bg-primaryColor cursor-pointer px-4 data-[state=active]:text-white"
              >
                Guides
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      <section className="-mt-32 bg-zinc-900">
        <Container>
          {activeTab === 'voting' && (
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
                                category.votingState === 'Not Started'
                                  ? 'border-zinc-300 bg-zinc-50 text-zinc-700'
                                  : category.id === 'company-awards'
                                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                                    : category.id === 'tech-awards'
                                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                      : category.id === 'movie-awards'
                                        ? 'border-purple-300 bg-purple-50 text-purple-700'
                                        : category.id === 'comedy-awards'
                                          ? 'border-orange-300 bg-orange-50 text-orange-700'
                                          : category.id === 'school-awards'
                                            ? 'border-red-300 bg-red-50 text-red-700'
                                            : category.id === 'music-awards'
                                              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                              : 'border-gray-300 bg-gray-50 text-gray-700'
                              }`}
                            >
                              {category.votingState === 'Ongoing' && (
                                <Vote className="mr-1 h-3 w-3" />
                              )}
                              {category.votingState === 'Results Ready' && (
                                <Trophy className="mr-1 h-3 w-3" />
                              )}
                              {category.votingState === 'Getting Results' && (
                                <Star className="mr-1 h-3 w-3" />
                              )}
                              {category.votingState === 'Not Started' && (
                                <Calendar className="mr-1 h-3 w-3" />
                              )}
                              {category.votingState}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="h-8 text-gray-600">
                        {category.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex gap-2 pt-2">
                        {category.votingState === 'Ongoing' && (
                          <Button
                            asChild
                            className={`flex-1 ${
                              category.id === 'company-awards'
                                ? 'bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300'
                                : category.id === 'tech-awards'
                                  ? 'bg-gradient-to-r from-emerald-300 via-emerald-600 to-emerald-300'
                                  : category.id === 'movie-awards'
                                    ? 'bg-gradient-to-r from-purple-300 via-purple-600 to-purple-300'
                                    : category.id === 'comedy-awards'
                                      ? 'bg-gradient-to-r from-orange-300 via-orange-600 to-orange-300'
                                      : category.id === 'school-awards'
                                        ? 'bg-gradient-to-r from-red-300 via-red-600 to-red-300'
                                        : category.id === 'music-awards'
                                          ? 'bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300'
                                          : 'bg-gray-300'
                            }`}
                          >
                            <Link
                              href="#"
                              // href={`/zimbabwe-peoples-choice-awards/${category.id}/vote/${category.categoryTitles[0].slug.current}`}
                              className="text-sm"
                            >
                              <Vote className="mr-1 h-4 w-4" />
                              Vote Now
                            </Link>
                          </Button>
                        )}

                        {category.votingState === 'Results Ready' && (
                          <Button
                            asChild
                            className={`flex-1 ${
                              category.id === 'company-awards'
                                ? 'bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300'
                                : category.id === 'tech-awards'
                                  ? 'bg-gradient-to-r from-emerald-300 via-emerald-600 to-emerald-300'
                                  : category.id === 'movie-awards'
                                    ? 'bg-gradient-to-r from-purple-300 via-purple-600 to-purple-300'
                                    : category.id === 'comedy-awards'
                                      ? 'bg-gradient-to-r from-orange-300 via-orange-600 to-orange-300'
                                      : category.id === 'school-awards'
                                        ? 'bg-gradient-to-r from-red-300 via-red-600 to-red-300'
                                        : category.id === 'music-awards'
                                          ? 'bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300'
                                          : 'bg-gray-300'
                            }`}
                          >
                            <Link
                              href={`/zimbabwe-peoples-choice-awards/${category.id}/vote`}
                              className="text-sm"
                            >
                              <Vote className="mr-1 h-4 w-4" />
                              View Results
                            </Link>
                          </Button>
                        )}

                        {category.votingState === 'Getting Results' && (
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-300 text-sm text-gray-600"
                            disabled
                          >
                            <Clock className="mr-1 h-4 w-4" />
                            Getting Results
                          </Button>
                        )}

                        {category.votingState === 'Not Started' && (
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-300 text-sm text-gray-600"
                            disabled
                          >
                            <Calendar className="mr-1 h-4 w-4" />
                            Not Started
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group border-2 border-amber-300 bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-xl bg-white p-3 text-amber-500 shadow-sm">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      Introduction
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Get started with the People's Choice Awards. Learn about the
                    awards, how they work, and what makes them special.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-amber-300 via-amber-600 to-amber-300"
                  >
                    <Link
                      href={`${DOMAIN_URLS.DOCS()}/docs/peoples-choice-awards/overview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                    >
                      <BookOpen className="mr-1 h-4 w-4" />
                      Read Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group border-2 border-purple-300 bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-xl bg-white p-3 text-purple-500 shadow-sm">
                      <Star className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      Guide for Nominees
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Everything nominees need to know about participating in the
                    awards, promotion, and what to expect.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-300 via-purple-600 to-purple-300"
                  >
                    <Link
                      href={`${DOMAIN_URLS.DOCS()}/docs/peoples-choice-awards/nominees-guide`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                    >
                      <Star className="mr-1 h-4 w-4" />
                      Read Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group border-2 border-blue-300 bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-xl bg-white p-3 text-blue-500 shadow-sm">
                      <Vote className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      Guide for Voters
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Learn how to vote effectively, understand the voting
                    process, and discover the rewards for participating.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300"
                  >
                    <Link
                      href={`${DOMAIN_URLS.DOCS()}/docs/peoples-choice-awards/voters-guide`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                    >
                      <Vote className="mr-1 h-4 w-4" />
                      Read Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </section>
      <AwardsHero />
      <FAQSection />
    </>
  );
}
