import type { ProfileType } from '@/types';
import { TriangleAlert } from 'lucide-react';

// Zimbabwe Flag SVG Component
const ZimbabweFlag = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 512 512"
  >
    <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
    <path
      d="M487.497 146.603c-13.006-27.474-30.757-52.257-52.197-73.302L256 55.652 76.7 73.302c-.572.561-1.13 1.135-1.696 1.702l71.6 71.6L256 149.945l231.497-3.342zM75.001 436.999c.942.942 1.882 1.885 2.838 2.813L256 456.348l178.159-16.536c21.661-21 39.629-45.785 52.818-73.302l-331.152-10.336c-28.493 28.494-61.357 61.356-80.824 80.825z"
      fill="#ffda44"
    />
    <path d="M509.454 219.905l-297.976-8.427L256 256l-44.522 44.522 297.82-7.314A257.933 257.933 0 00512 256c0-12.254-.88-24.3-2.546-36.095z" />
    <path
      d="M256 0C186.172 0 122.886 27.97 76.7 73.302h358.6C389.114 27.97 325.828 0 256 0z"
      fill="#6da544"
    />
    <path
      d="M219.905 219.905h289.549a254.194 254.194 0 00-21.957-73.302H146.603l73.302 73.302zM145.49 366.51h341.488a254.215 254.215 0 0022.321-73.302H218.792L145.49 366.51z"
      fill="#d80027"
    />
    <path
      d="M256 512c69.255 0 132.075-27.512 178.159-72.189H77.841C123.925 484.488 186.745 512 256 512z"
      fill="#6da544"
    />
    <path d="M91.415 59.934A258.029 258.029 0 0074.98 74.98L256 256 74.98 437.02a257.463 257.463 0 0016.435 15.046L287.481 256 91.415 59.934z" />
    <path
      fill="#d80027"
      d="M102.925 189.217l16.575 51.016h53.645l-43.398 31.532 16.576 51.018-43.398-31.531-43.399 31.531 16.578-51.018-43.397-31.532h53.642z"
    />
    <path
      d="M148.519 260.174l-43.198-15.304s-3.192-29.943-3.385-30.958c-1.466-7.723-8.253-13.564-16.403-13.564-9.22 0-16.696 7.475-16.696 16.696 0 1.529.223 3.002.608 4.41l-12.112 12.193h21.536c0 22.353-16.68 22.353-16.68 44.614l9.253 22.261h55.652l9.276-22.261h-.004a22.242 22.242 0 001.726-6.54c7.996-3.234 10.427-11.547 10.427-11.547z"
      fill="#ffda44"
    />
  </svg>
);

export default function RankingCard({ profile }: { profile: ProfileType }) {
  if (profile.entityType == 'school') {
    return <SchoolRanking profile={profile} />;
  }
}

function SchoolRanking({ profile }: { profile: ProfileType }) {
  // Only show for schools

  const calculatePassRateAverage = (
    passRates?: { year: number; passRate: number }[],
  ) => {
    if (!passRates || passRates.length === 0) return 0;
    const sum = passRates.reduce((acc, rate) => acc + rate.passRate, 0);
    return sum / passRates.length;
  };

  const generateRankFromPerformance = (performance: number) => {
    // Higher performance = better rank (lower number)
    // This is a mock calculation - in real app, you'd compare against all schools
    const baseRank = Math.max(1, Math.floor((100 - performance) * 5));
    return baseRank + Math.floor(Math.random() * 10); // Add some variance for demo
  };

  // Determine category based on school type and level
  const getCategory = () => {
    const schoolType =
      profile.oLevelSchoolType ||
      profile.aLevelSchoolType ||
      profile.primarySchoolType;
    const level = profile.level;

    if (schoolType && level) {
      return `${schoolType}`;
    }
    if (schoolType) {
      return schoolType;
    }
    if (level) {
      return level.replace('-', ' ');
    }
    return 'Schools';
  };

  const RankingSection = ({
    title,
    performance,
    suffix,
  }: {
    title: string;
    performance: number;
    suffix: string;
  }) => {
    const nationalRank = generateRankFromPerformance(performance);
    const provincialRank = Math.max(1, Math.floor(nationalRank / 10));
    const categoryRank = Math.max(1, Math.floor(nationalRank / 20));

    return (
      <div className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 p-2">
          <h3 className="text-center text-xs font-semibold text-zinc-900">
            {title} {new Date().getFullYear()}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* National Rank */}
          <div className="p-2 text-center">
            <p className="mb-2 text-xs text-zinc-600">National Rank</p>
            <div className="mb-2 flex items-center justify-center gap-2">
              <ZimbabweFlag className="h-6 w-fit" />
              <span className="text-lg font-bold text-zinc-900">
                #{nationalRank}
              </span>
            </div>
            <p className="text-sm font-medium text-teal-600">Zimbabwe</p>
            <p className="mt-1 text-xs text-zinc-500">
              {performance.toFixed(1)}% {suffix}
            </p>
          </div>

          {/* Provincial Rank */}
          <div className="border-x-0 border-y border-zinc-200 md:border-x md:border-y-0">
            <div className="p-2 text-center">
              <p className="mb-2 text-xs text-zinc-600">Provincial Rank</p>
              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="flex h-4 w-6 items-center justify-center rounded-sm bg-zinc-300">
                  <span className="text-xs font-bold text-zinc-600">
                    {profile.province?.charAt(0) || 'P'}
                  </span>
                </div>
                <span className="text-lg font-bold text-zinc-900">
                  #{provincialRank}
                </span>
              </div>
              <p className="text-sm font-medium text-teal-600">
                {profile.province || 'Province'}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {performance.toFixed(1)}% {suffix}
              </p>
            </div>
          </div>

          {/* Category Rank */}
          <div className="p-2 text-center">
            <p className="mb-2 text-xs text-zinc-600">Category Rank</p>
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="flex h-4 w-6 items-center justify-center rounded-sm bg-zinc-400">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <span className="text-lg font-bold text-zinc-900">
                #{categoryRank}
              </span>
            </div>
            <p
              className="truncate text-sm font-medium text-teal-600"
              title={getCategory()}
            >
              {getCategory()}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {performance.toFixed(1)}% {suffix}
            </p>
          </div>
        </div>
        <div
          className="cursor-pointer rounded-b-lg border-t border-zinc-200 p-2 hover:bg-red-200"
          onClick={() => window.open('https://wa.me/+263717238876', '_blank')}
        >
          <div className="flex items-center justify-center gap-1 rounded-sm border-red-900 text-xs text-red-900">
            <TriangleAlert className="size-3" /> Report Inaccuracy
          </div>
        </div>
      </div>
    );
  };

  if (profile.level === 'primary-school') {
    const avgPassRate = calculatePassRateAverage(
      profile.primarySchoolPassRates,
    );
    return (
      <RankingSection
        title="Primary School Ranking"
        performance={avgPassRate}
        suffix="pass rate"
      />
    );
  }

  if (profile.level === 'high-school') {
    const oLevelAvg = calculatePassRateAverage(profile.oLevelSchoolPassRates);
    const aLevelAvg = calculatePassRateAverage(profile.aLevelSchoolPassRates);

    return (
      <div className="grid grid-cols-2 gap-x-2 md:grid-cols-1 md:gap-x-0 md:gap-y-6">
        <RankingSection
          title="O Level Ranking"
          performance={oLevelAvg}
          suffix="pass rate"
        />
        <RankingSection
          title="A Level Ranking"
          performance={aLevelAvg}
          suffix="pass rate"
        />
      </div>
    );
  }

  return (
    <RankingSection
      title="School Ranking"
      performance={75}
      suffix="performance"
    />
  );
}
