import { Metadata } from 'next';
import SchoolPickerPageWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `School Picker | IBZim`,
    description: `Browse through a selection of primary, secondary, high schools and universities in Zimbabwe matching your criteria using the School Picker tool.`,
    pageUrl: '/tools/school-picker',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });

export default function SchoolPickerPage() {
  return <SchoolPickerPageWrapper />;
}
