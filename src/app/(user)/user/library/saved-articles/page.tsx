import { validateRequest } from '@/lib/auth/validate-request';
import { Paths } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { getSavedArticles } from './actions';
import { getArticlesByIds } from '@/sanity/lib/client';
import SavedArticlesWrapper from './wrapper';

export const metadata = {
  title: 'My Library | IBZim',
  description: 'Access your saved articles',
};

export default async function SavedArticlesPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Home);
  }

  const { allSavedArticles } = await getSavedArticles(user.id);

  const savedArticlesIdsArray = [
    ...new Set(allSavedArticles?.map((article) => article.articleId)),
  ];

  const [savedArticles] = await Promise.all([
    getArticlesByIds(savedArticlesIdsArray),
  ]);

  return <SavedArticlesWrapper user={user} savedArticles={savedArticles} />;
}
