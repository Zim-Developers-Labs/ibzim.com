'use client';

import Container from '@/components/container';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Season = 'Summer' | 'Autumn' | 'Winter' | 'Spring';

interface SeasonData {
  prizePool: string;
  topEarners: {
    rank: number;
    name: string;
    earnings: string;
  }[];
}

// Mock data for seasons
const seasonData: Record<number, Record<Season, SeasonData | null>> = {
  2025: {
    Summer: null, // Future season
    Autumn: null, // Future season
    Winter: null, // Future season
    Spring: null, // Future season
  },
};

const seasons: Season[] = ['Summer', 'Autumn', 'Winter', 'Spring'];

const sponsorData: Record<number, { name: string; icon: any; link: string }[]> =
  {
    2025: [
      {
        name: 'Peya Peya',
        icon: Icons.peyapeyaLogo,
        link: 'https://peyapeya.com',
      },
      {
        name: 'Xfinity Pros',
        icon: Icons.xfinityLogo,
        link: 'https://xfinitypros.com',
      },
    ],
  };

// Helper to get current season based on month
function getCurrentSeason(): Season {
  const month = new Date().getMonth();

  // December (11), January (0), February (1)
  if (month === 11 || month === 0 || month === 1) return 'Summer';

  // March (2) - May (4)
  if (month >= 2 && month <= 4) return 'Autumn';

  // June (5) - August (7)
  if (month >= 5 && month <= 7) return 'Winter';

  // September (8) - November (10)
  return 'Spring';
}

export default function AwardsHero() {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSeason, setSelectedSeason] = useState<Season>(currentSeason);

  const availableYears = [2025, 2026];

  // Determine if a season is locked
  const isSeasonLocked = (year: number, season: Season): boolean => {
    // For 2024, lock Summer and Autumn (data starts from Winter)
    if (year === 2025 && (season === 'Summer' || season === 'Autumn')) {
      return true;
    }

    // For current year, lock future seasons
    if (year === currentYear) {
      const seasonIndex = seasons.indexOf(season);
      const currentSeasonIndex = seasons.indexOf(currentSeason);
      return seasonIndex > currentSeasonIndex;
    }

    return false;
  };

  // Get the first available season for a year
  const getFirstAvailableSeason = (year: number): Season => {
    for (const season of seasons) {
      if (!isSeasonLocked(year, season)) {
        return season;
      }
    }
    return seasons[0];
  };

  // Handle year change
  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    setSelectedSeason(getFirstAvailableSeason(newYear));
  };

  // Handle season selection
  const handleSeasonSelect = (season: Season) => {
    if (!isSeasonLocked(selectedYear, season)) {
      setSelectedSeason(season);
    }
  };

  const selectedData = seasonData[selectedYear]?.[selectedSeason];
  const sponsors = sponsorData[selectedYear] || [];
  const canGoToPreviousYear = selectedYear > Math.min(...availableYears);
  const canGoToNextYear = selectedYear < Math.max(...availableYears);

  return (
    <section className="bg-zinc-900 py-20 text-white">
      <Container>
        <div className="flex flex-col items-center">
          <Icons.ibzimAwardsIcon className="h-12 w-12 text-yellow-500" />
          <h2 className="my-4 text-2xl md:text-4xl">
            Road to the 2025 Nationals
          </h2>
          <p className="text-primaryColor font-light tracking-widest">
            SEASON PRELIMINERIES
          </p>
          {/* Year Navigation */}
          <div className="mt-12 flex items-center gap-4">
            <Button
              onClick={() => handleYearChange(selectedYear - 1)}
              disabled={!canGoToPreviousYear}
              className={cn(
                'rounded-md transition-colors',
                canGoToPreviousYear
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'cursor-not-allowed opacity-30',
              )}
              aria-label="Previous year"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h3 className="text-lg">{selectedYear}</h3>
            <Button
              onClick={() => handleYearChange(selectedYear + 1)}
              disabled={!canGoToNextYear}
              className={cn(
                'rounded-md transition-colors',
                canGoToNextYear
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'cursor-not-allowed opacity-30',
              )}
              aria-label="Next year"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Season Timeline */}
          <div className="mt-12 w-full max-w-4xl">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-6 right-0 left-0 h-1 bg-zinc-700" />

              {/* Season Stops */}
              <div className="relative grid grid-cols-4 gap-4">
                {seasons.map((season, index) => {
                  const isLocked = isSeasonLocked(selectedYear, season);
                  const isSelected = season === selectedSeason;
                  const isCurrent =
                    selectedYear === currentYear && season === currentSeason;

                  return (
                    <div key={season} className="flex flex-col items-center">
                      <button
                        onClick={() => handleSeasonSelect(season)}
                        disabled={isLocked}
                        className={cn(
                          'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all',
                          isSelected && !isLocked
                            ? 'scale-110 border-yellow-500 bg-yellow-500'
                            : isLocked
                              ? 'cursor-not-allowed border-zinc-700 bg-zinc-800'
                              : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800',
                        )}
                        aria-label={`${season} ${selectedYear}`}
                      >
                        {isLocked ? (
                          <Lock className="h-5 w-5 text-zinc-600" />
                        ) : (
                          <span
                            className={cn(
                              'text-sm font-bold',
                              isSelected ? 'text-zinc-900' : 'text-zinc-400',
                            )}
                          >
                            {index + 1}
                          </span>
                        )}
                      </button>
                      <span
                        className={cn(
                          'mt-3 text-sm font-medium',
                          isSelected && !isLocked
                            ? 'text-yellow-500'
                            : isLocked
                              ? 'text-zinc-600'
                              : 'text-zinc-400',
                        )}
                      >
                        {season}
                      </span>
                      {isCurrent && !isLocked && (
                        <span className="mt-1 text-xs text-yellow-500">
                          Ongoing
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Season Details */}
          {selectedData ? (
            <div className="mt-12 w-full max-w-2xl">
              <div className="text-center">
                <h4 className="text-lg font-medium text-zinc-400">
                  Prize Pool
                </h4>
                <div className="relative mt-4 inline-block">
                  <style jsx>{`
                    @keyframes pulse-glow {
                      0%,
                      100% {
                        opacity: 0.5;
                        filter: blur(40px);
                      }
                      50% {
                        opacity: 0.8;
                        filter: blur(60px);
                      }
                    }
                    .glow-pulse {
                      animation: pulse-glow 3s ease-in-out infinite;
                    }
                  `}</style>
                  {/* Multiple layered glows for realistic effect */}
                  <div className="glow-pulse absolute -inset-8 rounded-full bg-yellow-500/40 blur-3xl" />
                  <div
                    className="glow-pulse absolute -inset-4 rounded-full bg-yellow-400/30 blur-2xl"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <div className="relative px-8 py-4">
                    <p className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                      {selectedData.prizePool}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-20">
                <h5 className="mb-6 text-center text-sm font-medium tracking-wider text-zinc-500 uppercase">
                  Sponsored By
                </h5>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {sponsors.map((sponsor) => (
                    <Link
                      href={sponsor.link}
                      target="_blank"
                      key={sponsor.name}
                      className="flex h-16 w-48 items-center justify-center rounded-lg bg-white/5 p-3 transition-all hover:bg-white/10"
                    >
                      <sponsor.icon className="h-10 w-auto text-white" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-center">
                <Button
                  asChild
                  className="bg-yellow-500 text-zinc-900 hover:bg-yellow-600"
                >
                  <Link
                    href={`/results?year=${selectedYear}&season=${selectedSeason.toLowerCase()}`}
                  >
                    {selectedYear} Nationals Results
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-12 w-full max-w-2xl">
              <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-8 text-center">
                <Lock className="mx-auto h-12 w-12 text-zinc-600" />
                <p className="mt-4 text-lg text-zinc-400">
                  No data available for this season
                </p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
