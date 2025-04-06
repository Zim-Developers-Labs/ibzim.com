import { urlForImage } from '@/lib/sanity/image';
import { formatUpdatedAt } from '@/lib/utils';
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { getUsernameFromId } from '../comments-lib';
import { Icons } from '@/components/icons';

export default function SpotLightBody({
  comment,
  article,
  dislikesCount,
  handleReaction,
  isLoading,
  likesCount,
  userReaction,
}: {
  comment: any;
  article: any;
  handleReaction: any;
  isLoading: boolean;
  userReaction: any;
  likesCount: any;
  dislikesCount: any;
}) {
  const fname = comment.user?.fullName
    ? comment.user?.fullName.split(' ')[0]
    : 'I';
  const lname = comment.user?.fullName
    ? comment.user?.fullName.split(' ')[1]
    : 'B';

  const username = getUsernameFromId(comment.userId);

  return (
    <div className="">
      <div className="block">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex-none">
            {comment.user?.avatar ? (
              <Image
                src={comment.user.avatar}
                alt={comment.user.fullName!}
                height={50}
                width={50}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="grid h-10 w-10 place-content-center rounded-full bg-yellow-400 uppercase">
                {fname![0]}
                {lname![0]}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              @{username != null ? username : `user-${comment.userId}`}
            </h3>
            <p className="text-xs text-gray-400">
              <span>{formatUpdatedAt(comment.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-6 text-sm text-gray-500">{comment.commentText}</p>
        <div className="col-span-2 flex items-center gap-2">
          <button
            onClick={() => handleReaction('like')}
            disabled={isLoading}
            className="flex items-center space-x-1 text-gray-900"
          >
            {userReaction === 'like' ? (
              <Icons.handThumbUpSolid className="h-5 w-5" />
            ) : (
              <HandThumbUpIcon className="h-5 w-5" />
            )}
            <span>{likesCount}</span>
          </button>
          <button
            onClick={() => handleReaction('dislike')}
            disabled={isLoading}
            className="flex items-center space-x-1 text-gray-900"
          >
            {userReaction === 'dislike' ? (
              <Icons.handThumbDownSolid className="h-5 w-5" />
            ) : (
              <HandThumbDownIcon className="h-5 w-5" />
            )}
            <span>{dislikesCount}</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400 italic">
          User Protection Rules in Place
        </p>
      </div>
      <div className="flex items-center gap-4 rounded-md border border-gray-200 p-4 text-sm">
        <Image
          src={urlForImage(article.seo.image).height(675).width(1200).url()}
          alt={article.title}
          height={675}
          width={1200}
          className="h-12 w-fit rounded-md"
        />
        <div className="gap-2 text-left md:flex md:gap-4">
          <span>{article.name}.</span>{' '}
          <Link
            className="text-primaryColor inline hover:underline"
            href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
          >
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
}
