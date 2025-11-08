interface Season {
  name: 'SUMMER' | 'AUTUMN' | 'WINTER' | 'SPRING';
  number: 1 | 2 | 3 | 4;
  period: string;
  endMonth: number;
}

export const seasons: Season[] = [
  { name: 'SUMMER', number: 1, period: 'November to January', endMonth: 1 },
  { name: 'AUTUMN', number: 2, period: 'February to March', endMonth: 3 },
  { name: 'WINTER', number: 3, period: 'April to May', endMonth: 5 },
  { name: 'SPRING', number: 4, period: 'August to October', endMonth: 10 },
];

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth() + 1; // JS months: 0 = Jan, so +1

  if (month >= 11 || month <= 1) return seasons[0]; // Summer
  if (month >= 2 && month <= 4) return seasons[1]; // Autumn
  if (month >= 5 && month <= 7) return seasons[2]; // Winter
  return seasons[3]; // Spring
}

export function getDaysRemainingInSeason(date = new Date()): number {
  const season = getCurrentSeason(date);
  const year = date.getFullYear();

  // Handle season that ends in next year (e.g. Summer: Nov–Jan)
  const seasonEndYear = season.endMonth < date.getMonth() + 1 ? year + 1 : year;

  // Get the last day of the season end month
  const seasonEndDate = new Date(seasonEndYear, season.endMonth, 0); // 0 gives last day of prev month
  const diffMs = seasonEndDate.getTime() - date.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return daysRemaining > 0 ? daysRemaining : 0;
}

export const currentSeason = getCurrentSeason();

const seasonalStyles = {
  SUMMER: {
    particles: [
      {
        emoji: '💧',
        size: 'text-xl sm:text-2xl xl:text-3xl',
        color: 'text-blue-400',
      },
      {
        emoji: '💦',
        size: 'text-lg sm:text-xl xl:text-2xl',
        color: 'text-cyan-400',
      },
      {
        emoji: '🌧️',
        size: 'text-2xl sm:text-3xl xl:text-4xl',
        color: 'text-slate-400',
      },
    ],
    count: 20,
    bgGradient: 'bg-gradient-to-br from-slate-200 via-white to-blue-100',
    animationStyle: 'animate-fall',
  },
  AUTUMN: {
    particles: [
      {
        emoji: '🍂',
        size: 'text-2xl sm:text-3xl xl:text-4xl',
        color: 'text-orange-600',
      },
      {
        emoji: '🍁',
        size: 'text-3xl sm:text-4xl xl:text-5xl',
        color: 'text-red-600',
      },
      {
        emoji: '🌰',
        size: 'text-xl sm:text-2xl xl:text-3xl',
        color: 'text-amber-700',
      },
    ],
    count: 15,
    bgGradient: 'bg-gradient-to-br from-orange-200 via-white to-amber-200',
    animationStyle: 'animate-fall',
  },
  WINTER: {
    particles: [
      {
        emoji: '❄️',
        size: 'text-2xl sm:text-3xl xl:text-4xl',
        color: 'text-blue-300',
      },
      {
        emoji: '⛄',
        size: 'text-3xl sm:text-4xl xl:text-5xl',
        color: 'text-slate-400',
      },
      {
        emoji: '🌨️',
        size: 'text-xl sm:text-2xl xl:text-3xl',
        color: 'text-cyan-200',
      },
    ],
    count: 18,
    bgGradient: 'bg-gradient-to-br from-blue-200 via-white to-slate-200',
    animationStyle: 'animate-snow',
  },
  SPRING: {
    particles: [
      {
        emoji: '🌸',
        size: 'text-2xl sm:text-3xl xl:text-4xl',
        color: 'text-pink-400',
      },
      {
        emoji: '🌼',
        size: 'text-3xl sm:text-4xl xl:text-5xl',
        color: 'text-yellow-400',
      },
      {
        emoji: '🦋',
        size: 'text-xl sm:text-2xl xl:text-3xl',
        color: 'text-purple-400',
      },
    ],
    count: 14,
    bgGradient: 'bg-gradient-to-br from-pink-200 via-white to-green-200',
    animationStyle: 'animate-bloom',
  },
};

export const seasonConfig = seasonalStyles[currentSeason.name];
