import { Metadata } from 'next';
import VotingPageWrapper from './wrapper';
import { prepareArticleMetadata } from '@/lib/article-metadata';
import { siteConfig } from '@/lib/config';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  return prepareArticleMetadata({
    title: `${category} Voting | People's Choice Awards Zimbabwe`,
    description: `Vote for your favorite nominees in the ${category} category of the People's Choice Awards Zimbabwe.`,
    pageUrl: `/zimbabwe-peoples-choice-awards/${category}/vote`,
    ogImage: {
      url: '/banner.webp',
      height: 675,
      width: 1200,
    },
    siteConfig,
  });
}

export default function VotingPage() {
  return <VotingPageWrapper />;
}
