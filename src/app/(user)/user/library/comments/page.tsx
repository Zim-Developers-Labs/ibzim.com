import { validateRequest } from '@/lib/auth/validate-request';
import CommentsLayout from './comments-layout';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';
import { getAllUserComments } from './action';
import { getArticlesByIds } from '@/sanity/lib/client';

export const metadata = {
  title: 'My Comments | IBZim',
  description: 'Manage your comments',
};

export default async function CommentsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Home);
  }

  const { comments } = await getAllUserComments(user.id);
  const commentedArticlesIdsArray = [
    ...new Set(comments?.map((comment) => comment.articleId)),
  ];

  const [articles] = await Promise.all([
    getArticlesByIds(commentedArticlesIdsArray),
  ]);

  // @ts-expect-error -- type error
  return <CommentsLayout articles={articles} comments={comments} />;
}
