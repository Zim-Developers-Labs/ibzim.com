import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import SchoolPickerPageWrapper from '../wrapper';
import { textify } from '@/lib/utils';
import { SchoolPickerProfilesType } from '@/types';
import { getAllSchoolsByLevel } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import { getReviewsCountAndAverageReviewByProfile } from '@/app/(blog)/profiles/[type]/[slug]/reviews/actions';

type Props = {
  params: Promise<{ level: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;

  return preparePageMetadata({
    title: `${textify(level)} Picker Tool`,
    description: `Explore ${level == 'best-tertiary-institutions' ? '30+' : '100+'} ${textify(level)} in Zimbabwe. Find the perfect fit for your educational needs.`,
    pageUrl: `/tools/school-picker/${level}`,
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });
}

export async function generateStaticParams() {
  return [
    { level: 'best-primary-schools' },
    { level: 'best-o-level-schools' },
    { level: 'best-a-level-schools' },
    { level: 'best-tertiary-institutions' },
  ];
}

const allowedLevels = [
  'best-primary-schools',
  'best-o-level-schools',
  'best-a-level-schools',
  'best-tertiary-institutions',
];

export default async function SchoolPickerPage({ params }: Props) {
  const { level } = await params;

  if (!allowedLevels.includes(level)) {
    return notFound();
  }

  const normalizedLevel =
    level === 'best-o-level-schools' || level === 'best-a-level-schools'
      ? 'high-school'
      : level === 'best-primary-schools'
        ? 'primary-school'
        : 'tertiary-institution';

  const [profiles]: [SchoolPickerProfilesType[]] = await Promise.all([
    getAllSchoolsByLevel(normalizedLevel),
  ]);

  const getAveragePassRate = (rates?: { year: number; passRate: number }[]) =>
    rates && rates.length > 0
      ? rates.reduce((sum, rate) => sum + rate.passRate, 0) / rates.length
      : 0;

  profiles.sort((a, b) => {
    if (
      level === 'best-primary-schools' &&
      a.primarySchoolPassRates &&
      b.primarySchoolPassRates
    ) {
      return (
        getAveragePassRate(b.primarySchoolPassRates) -
        getAveragePassRate(a.primarySchoolPassRates)
      );
    }
    if (
      level === 'best-o-level-schools' &&
      a.oLevelSchoolPassRates &&
      b.oLevelSchoolPassRates
    ) {
      return (
        getAveragePassRate(b.oLevelSchoolPassRates) -
        getAveragePassRate(a.oLevelSchoolPassRates)
      );
    }
    if (
      level === 'best-a-level-schools' &&
      a.aLevelSchoolPassRates &&
      b.aLevelSchoolPassRates
    ) {
      return (
        getAveragePassRate(b.aLevelSchoolPassRates) -
        getAveragePassRate(a.aLevelSchoolPassRates)
      );
    }
    return 0;
  });

  // map throughs profiles and map reviewsCount and averageRating to each school from getReviewsCountAndAverageReviewByProfile(profile._id)
  const profilesWithReviews = await Promise.all(
    profiles.map(async (profile) => {
      const { count, average } = await getReviewsCountAndAverageReviewByProfile(
        profile._id,
      );
      return {
        ...profile,
        reviewsCount: count,
        averageRating: average,
      };
    }),
  );

  return (
    <SchoolPickerPageWrapper
      level={normalizedLevel}
      selectedLevel={level}
      schools={profilesWithReviews}
    />
  );
}
