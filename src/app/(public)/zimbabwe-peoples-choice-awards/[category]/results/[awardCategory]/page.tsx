import { Metadata } from 'next';
import AwardCategoryResultsPageWrapper from './wrapper';
import { prepareArticleMetadata } from '@/lib/article-metadata';

type Props = {
  params: Promise<{ category: string; awardCategory: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, awardCategory } = await params;

  return prepareArticleMetadata({
    title: `${awardCategory} | People's Choice Awards Zimbabwe`,
    description: `Results for the ${awardCategory} category in the People's Choice Awards Zimbabwe. Discover the nominees and winners.`,
    pageUrl: `/zimbabwe-peoples-choice-awards/${category}/results/${awardCategory}`,
    ogImage: {
      url: '/banner.webp',
      height: 675,
      width: 1200,
    },
  });
}

export default function AwardCategoryResultsPage() {
  return <AwardCategoryResultsPageWrapper />;
}
