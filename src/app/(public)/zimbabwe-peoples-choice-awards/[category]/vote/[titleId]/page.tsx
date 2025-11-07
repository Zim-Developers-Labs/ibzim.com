import { Metadata } from 'next';
import VotingPageComponent from './components';
import { prepareArticleMetadata } from '@/lib/article-metadata';
import { siteConfig } from '@/lib/config';
import {
  getAllAwardCategories,
  getAwardCategoryBySlug,
} from '@/lib/sanity/client';
import { textify } from '@/lib/utils';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  return prepareArticleMetadata({
    title: `${textify(category)} Voting | People's Choice Awards Zimbabwe`,
    description: `Vote for your favorite nominees in the ${textify(category)} category of the People's Choice Awards Zimbabwe.`,
    pageUrl: `/zimbabwe-peoples-choice-awards/${category}/vote`,
    ogImage: {
      url: '/banner.webp',
      height: 675,
      width: 1200,
    },
    siteConfig,
  });
}

export async function generateStaticParams(): Promise<
  Array<{ category: string; titleId: string }>
> {
  const categories = await getAllAwardCategories();

  let params: Array<{ category: string; titleId: string }> = [];

  categories.forEach((category) => {
    category.categoryTitles.forEach((title) => {
      params.push({
        category: category.slug.current,
        titleId: title.slug.current,
      });
    });
  });

  return params;
}

export default async function VotingPage({ params }: Props) {
  const { category } = await params;

  const awardCategory = await getAwardCategoryBySlug(category);

  if (!awardCategory) {
    return notFound();
  }

  if (awardCategory.votingState !== 'Ongoing') {
    return <div>Voting is not available for this category</div>;
  }

  return <VotingPageComponent awardCategory={awardCategory} />;
}
