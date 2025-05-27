import {
  Building2,
  Film,
  GraduationCap,
  Laugh,
  MapPin,
  Music,
} from 'lucide-react';

export const awardCategories = [
  {
    id: 'company',
    title: 'Company Awards',
    description: 'Recognizing excellence in business and innovation',
    icon: Building2,
    votingMonth: 'January',
    resultsMonth: 'February',
    color: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200',
    iconColor: 'text-blue-600',
    awards: [
      'Company of the Year',
      'Best CEO',
      'Best Startup',
      'Best Services',
      'Best Product',
    ],
    mainAward: 'company-of-the-year', // Main sub-category slug
  },
  {
    id: 'city',
    title: 'City Awards',
    description: 'Celebrating the best cities and urban experiences',
    icon: MapPin,
    votingMonth: 'March',
    resultsMonth: 'April',
    color: 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200',
    iconColor: 'text-emerald-600',
    awards: ['City of the Year', 'Cleanest City', 'Most Enjoyable City'],
    mainAward: 'city-of-the-year',
  },
  {
    id: 'movie',
    title: 'Movie Awards',
    description: 'Honoring outstanding achievements in cinema',
    icon: Film,
    votingMonth: 'May',
    resultsMonth: 'June',
    color: 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200',
    iconColor: 'text-purple-600',
    awards: ['Movie of the Year', 'Best Actor', 'Best Director'],
    mainAward: 'movie-of-the-year',
  },
  {
    id: 'comedy',
    title: 'Comedy Awards',
    description: 'Celebrating the best in comedy and entertainment',
    icon: Laugh,
    votingMonth: 'July',
    resultsMonth: 'August',
    color: 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200',
    iconColor: 'text-orange-600',
    awards: ['Comedian of the Year', 'Best Skit'],
    mainAward: 'comedian-of-the-year',
  },
  {
    id: 'school',
    title: 'School Awards',
    description: 'Recognizing excellence in education',
    icon: GraduationCap,
    votingMonth: 'September',
    resultsMonth: 'October',
    color: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200',
    iconColor: 'text-red-600',
    awards: [
      'School of the Year',
      'Best Academics',
      'Best Sporting',
      'Best Uniform',
    ],
    mainAward: 'school-of-the-year',
  },
  {
    id: 'music',
    title: 'Music Awards',
    description: 'Celebrating musical talent and creativity',
    icon: Music,
    votingMonth: 'November',
    resultsMonth: 'December',
    color: 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200',
    iconColor: 'text-indigo-600',
    awards: ['Artist of the Year', 'Best Song', 'Best Album'],
    mainAward: 'artist-of-the-year',
  },
];

export const getCurrentPeriod = (category: any) => {
  const currentMonth = new Date().getMonth() + 1;
  const votingMonths = {
    January: 1,
    March: 3,
    May: 5,
    July: 7,
    September: 9,
    November: 11,
  };
  const resultsMonths = {
    February: 2,
    April: 4,
    June: 6,
    August: 8,
    October: 10,
    December: 12,
  };

  const votingMonth =
    votingMonths[category.votingMonth as keyof typeof votingMonths];
  const resultsMonth =
    resultsMonths[category.resultsMonth as keyof typeof resultsMonths];

  if (currentMonth === votingMonth) return 'voting';
  if (currentMonth === resultsMonth) return 'results';
  if (currentMonth > resultsMonth) return 'completed';
  return 'upcoming';
};
