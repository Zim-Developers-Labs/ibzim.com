import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import SchoolPickerPageWrapper from '../wrapper';
import { textify } from '@/lib/utils';

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

  return <SchoolPickerPageWrapper selectedLevel={level} />;
}
