'use client';

import { ExternalLink, TriangleAlert } from 'lucide-react';
import Container from '../container';
import Comments from './comments';
import MonthlyPageViews from './page-views';
import { Icons } from '../icons';
import { User } from 'lucia';
import { CommentType } from '@/server/db/schema';
import { CommentWithChildren } from './comments-lib';
import { useCallback, useState } from 'react';

type CommentSectionProps = {
  user?: User;
  articleId: string;
  allComments?: CommentType[];
  parentComments?: CommentWithChildren[];
  article: any;
  handleClap: any;
  isClapping: boolean;
  userClapped: boolean;
  claps: any;
};

export default function CommentSection({
  user,
  articleId,
  allComments,
  parentComments,
  article,
  claps,
  handleClap,
  isClapping,
  userClapped,
}: CommentSectionProps) {
  const [commentCount, setCommentCount] = useState(
    allComments ? allComments.length : 0,
  );

  const incrementCommentCount = useCallback(() => {
    setCommentCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <Container className="max-w-screen-md py-10 md:py-20">
      <aside id="commentSection">
        <div className="mb-8 flex items-baseline justify-between sm:items-center">
          <h2 className="flex flex-col items-baseline gap-2 text-2xl font-bold sm:flex-row">
            Conversation
            <span className="box text-base font-normal">
              ({commentCount || 0} Comments)
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <Icons.usersIcon className="h-4 w-fit fill-green-600 text-green-600" />
            <div className="text-sm">
              <MonthlyPageViews />
            </div>
          </div>
        </div>
        <div className="mb-8 border-l-4 border-green-400 bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TriangleAlert
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <div className="text-sm text-green-700">
                Feel free to comment your thoughts on the article. You can
                report Inappropriate comments from the comment menu in
                accordance to our{' '}
                <div
                  onClick={() => window.open('/policies/commenting', '_blank')}
                  className="inline cursor-pointer font-medium text-green-700 underline hover:text-green-600"
                >
                  commenting policy.
                  <ExternalLink className="inline h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0">
            <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
              <svg
                className="h-full w-full text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <div className="w-full min-w-0 flex-1">
            <Comments
              articleId={articleId}
              comments={parentComments}
              user={user}
              onCommentAdded={incrementCommentCount}
              article={article}
              claps={claps}
              handleClap={handleClap}
              isClapping={isClapping}
              userClapped={userClapped}
            />
          </div>
        </div>
      </aside>
    </Container>
  );
}
