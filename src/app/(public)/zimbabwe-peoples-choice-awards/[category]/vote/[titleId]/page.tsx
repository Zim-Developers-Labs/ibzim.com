import { Metadata } from 'next';
import VotingPageComponent from './components';
import { prepareArticleMetadata } from '@/lib/article-metadata';
import {
  getAllAwardCategories,
  getAwardCategoryBySlug,
  getTitleNomineesByTitleSlug,
} from '@/lib/sanity/client';
import { textify } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { getCurrentSession } from '@/lib/server/session';
import { getAllTitleVotes, getAllUserCategoryVotes } from './actions';
import { VotesType } from '@/lib/server/db';

type Props = {
  params: Promise<{ category: string; titleId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, titleId } = await params;

  return prepareArticleMetadata({
    title: `${textify(titleId)} Voting | People's Choice Awards Zimbabwe`,
    description: `Vote for who deserves the title: "${textify(titleId)}" in the ${textify(category)} category of the People's Choice Awards Zimbabwe.`,
    pageUrl: `/zimbabwe-peoples-choice-awards/${category}/vote/${titleId}`,
    ogImage: {
      url: '/banner.webp',
      height: 675,
      width: 1200,
    },
  });
}

export async function generateStaticParams(): Promise<
  Array<{ category: string; titleId: string }>
> {
  const categories = await getAllAwardCategories();

  const params: Array<{ category: string; titleId: string }> = [];

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
  const { category, titleId } = await params;

  const awardCategory = await getAwardCategoryBySlug(category);

  if (!awardCategory) {
    return notFound();
  }

  const titleExists = awardCategory.categoryTitles.find(
    (title) => title.slug.current === titleId,
  );

  if (!titleExists) {
    return notFound();
  }

  if (awardCategory.votingState !== 'Ongoing') {
    return <div>Voting is not available for this category</div>;
  }

  const nominees = await getTitleNomineesByTitleSlug(titleId);

  const { user } = await getCurrentSession();

  const votes = await getAllTitleVotes(titleId);

  let userCategoryVotes: VotesType[] | null = null;

  if (user) {
    userCategoryVotes = await getAllUserCategoryVotes(
      user.id,
      awardCategory.slug.current,
    );
  }

  return (
    <VotingPageComponent
      user={user}
      awardCategory={awardCategory}
      titleId={titleId}
      nominees={nominees}
      dbVotes={votes}
      dbUserCategoryVotes={userCategoryVotes}
    />
  );
}
