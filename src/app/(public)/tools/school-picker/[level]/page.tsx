import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import SchoolPickerPageWrapper from '../wrapper';
import { textify } from '@/lib/utils';
import { SchoolPickerProfilesType } from '@/types';
import { getAllSchoolsByLevel } from '@/sanity/lib/client';

type Props = {
  params: Promise<{ level: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;

  return preparePageMetadata({
    title: `${textify(level)} Schools Picker Tool | IBZim`,
    description: `Explore ${textify(level)} schools in Zimbabwe. Find the best fit for your educational needs.`,
    pageUrl: `/tools/school-picker/${level}`,
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });
}

export default async function SchoolPickerPage({ params }: Props) {
  const { level } = await params;

  const normalizedLevel =
    level === 'o-level-education' || level === 'a-level-education'
      ? 'high-school'
      : level === 'primary-education'
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
      level === 'primary-education' &&
      a.primarySchoolPassRates &&
      b.primarySchoolPassRates
    ) {
      return (
        getAveragePassRate(b.primarySchoolPassRates) -
        getAveragePassRate(a.primarySchoolPassRates)
      );
    }
    if (
      level === 'o-level-education' &&
      a.oLevelSchoolPassRates &&
      b.oLevelSchoolPassRates
    ) {
      return (
        getAveragePassRate(b.oLevelSchoolPassRates) -
        getAveragePassRate(a.oLevelSchoolPassRates)
      );
    }
    if (
      level === 'a-level-education' &&
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

  return (
    <SchoolPickerPageWrapper
      level={normalizedLevel}
      selectedLevel={level}
      schools={profiles}
    />
  );
}
