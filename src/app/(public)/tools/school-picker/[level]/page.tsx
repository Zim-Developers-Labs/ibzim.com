import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import SchoolPickerPageWrapper from '../wrapper';
import { textify } from '@/lib/utils';
import type { SchoolPickerProfilesType } from '@/types';
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
    pageUrl: `/tools/school-picker/${level}-in-zimbabwe`,
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });
}

export async function generateStaticParams() {
  return [
    { level: 'best-primary-schools-in-zimbabwe' },
    { level: 'best-o-level-schools-in-zimbabwe' },
    { level: 'best-a-level-schools-in-zimbabwe' },
    { level: 'best-tertiary-institutions-in-zimbabwe' },
  ];
}

const allowedLevels = [
  'best-primary-schools-in-zimbabwe',
  'best-o-level-schools-in-zimbabwe',
  'best-a-level-schools-in-zimbabwe',
  'best-tertiary-institutions-in-zimbabwe',
];

export default async function SchoolPickerPage({ params }: Props) {
  const { level } = await params;

  if (!allowedLevels.includes(level)) {
    return notFound();
  }

  const normalizedLevel =
    level === 'best-o-level-schools-in-zimbabwe' ||
    level === 'best-a-level-schools-in-zimbabwe'
      ? 'high-school'
      : level === 'best-primary-schools-in-zimbabwe'
        ? 'primary-school'
        : 'tertiary-institution';

  const [profiles]: [SchoolPickerProfilesType[]] = await Promise.all([
    getAllSchoolsByLevel(normalizedLevel),
  ]);

  const filteredProfiles = profiles.filter((school) => {
    if (level === 'best-o-level-schools-in-zimbabwe') {
      return (
        school.oLevelSchoolPassRates && school.oLevelSchoolPassRates.length > 0
      );
    }
    if (level === 'best-a-level-schools-in-zimbabwe') {
      return (
        school.aLevelSchoolPassRates && school.aLevelSchoolPassRates.length > 0
      );
    }
    // For other levels, return all schools
    return true;
  });

  const getAveragePassRate = (rates?: { year: number; passRate: number }[]) =>
    rates && rates.length > 0
      ? rates.reduce((sum, rate) => sum + rate.passRate, 0) / rates.length
      : 0;

  filteredProfiles.sort((a, b) => {
    if (
      level === 'best-primary-schools-in-zimbabwe' &&
      a.primarySchoolPassRates &&
      b.primarySchoolPassRates
    ) {
      return (
        getAveragePassRate(b.primarySchoolPassRates) -
        getAveragePassRate(a.primarySchoolPassRates)
      );
    }
    if (
      level === 'best-o-level-schools-in-zimbabwe' &&
      a.oLevelSchoolPassRates &&
      b.oLevelSchoolPassRates
    ) {
      return (
        getAveragePassRate(b.oLevelSchoolPassRates) -
        getAveragePassRate(a.oLevelSchoolPassRates)
      );
    }
    if (
      level === 'best-a-level-schools-in-zimbabwe' &&
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

  const profilesWithReviews = await Promise.all(
    filteredProfiles.map(async (profile) => {
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
      selectedLevel={level.replace('-in-zimbabwe', '')}
      schools={profilesWithReviews}
    />
  );
}
