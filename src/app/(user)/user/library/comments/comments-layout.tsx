'use client';

import { CommentType } from '@/server/db/schema';
import { CardArticleType } from '@/types';
import {
  EllipsisHorizontalIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import {
  ArrowUturnLeftIcon,
  ChevronUpDownIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import CommentShareDialog from '@/components/comments/share-dialog';
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { urlForImage } from '@/sanity/lib/image';
import { toast } from 'sonner';

export default function CommentsLayout({
  articles,
  comments,
}: {
  comments: CommentType[];
  articles: CardArticleType[];
}) {
  const commentTree = useMemo(() => {
    const tree: { [key: string]: CommentType[] } = {};
    const topLevelComments: CommentType[] = [];

    // First, group all comments by their parent
    comments.forEach((comment) => {
      if (comment.parentCommentId) {
        if (!tree[comment.parentCommentId]) {
          tree[comment.parentCommentId] = [];
        }
        tree[comment.parentCommentId]!.push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });

    // Function to recursively count all descendants
    const countDescendants = (commentId: string): number => {
      const children = tree[commentId] || [];
      return children.reduce(
        (count, child) => count + 1 + countDescendants(child.commentId),
        0,
      );
    };

    return { tree, topLevelComments, countDescendants };
  }, [comments]);

  const [selected, setSelected] = useState(sortTypes[0]);
  const [sortedComments, setSortedComments] = useState<CommentType[]>([]);

  useEffect(() => {
    if (comments) {
      const sortedComments = [...comments];
      switch (selected?.name) {
        case 'Recent':
          sortedComments.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case 'Most Liked':
          sortedComments.sort(
            (a, b) => (b.likesCount || 0) - (a.likesCount || 0),
          );
          break;
        case 'Most Disliked':
          sortedComments.sort(
            (a, b) => (b.dislikesCount || 0) - (a.dislikesCount || 0),
          );
          break;
        case 'Most Replied':
          sortedComments.sort(
            (a, b) =>
              commentTree.countDescendants(b.commentId) -
              commentTree.countDescendants(a.commentId),
          );
          break;
      }
      setSortedComments(sortedComments);
    }
  }, [selected, comments, commentTree]);

  return (
    <div>
      <h3 className="mb-6 text-xl">{comments.length || 0} Comments posted</h3>{' '}
      <div className="mb-6">
        <SortFilter selected={selected} setSelected={setSelected} />
      </div>
      {sortedComments.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2">
          {sortedComments.map((comment: CommentType) => {
            const article = articles.find(
              (article) => article._id == comment.articleId,
            );

            const commentReplies = commentTree.countDescendants(
              comment.commentId,
            );

            return (
              <CommentCard
                key={comment.commentId}
                comment={comment}
                article={article!}
                commentRepliesCount={commentReplies}
              />
            );
          })}
        </ul>
      ) : (
        <Alert />
      )}
    </div>
  );
}

const sortTypes = [
  { id: 1, name: 'Recent' },
  { id: 2, name: 'Most Liked' },
  { id: 3, name: 'Most Disliked' },
  { id: 4, name: 'Most Replied' },
];

function SortFilter({
  selected,
  setSelected,
}: {
  selected: any;
  setSelected: any;
}) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="flex items-center">
        <Label className="mb-0 block text-sm font-medium text-gray-900">
          Sort By:
        </Label>
        <div className="relative w-fit">
          <ListboxButton className="relative w-full cursor-pointer rounded-md bg-white py-1.5 pr-10 pl-3 text-left text-gray-900 sm:text-sm/6">
            <span className="text-primaryColor block w-fit truncate font-bold">
              {selected!.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-[150px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[leave]:opacity-0 sm:text-sm"
          >
            {sortTypes.map((sort) => (
              <ListboxOption
                key={sort.id}
                value={sort}
                className="group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none data-[focus]:bg-yellow-600 data-[focus]:text-white"
              >
                <span className="block w-fit truncate font-normal group-data-[selected]:font-semibold">
                  {sort.name}
                </span>

                <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-yellow-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </div>
    </Listbox>
  );
}

function CommentCard({
  comment,
  article,
  commentRepliesCount,
}: {
  comment: CommentType;
  article: CardArticleType;
  commentRepliesCount: number;
}) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between rounded-md bg-gray-200 px-4 py-3">
        <div>
          {new Date(comment.createdAt!).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
        <CommentMenu comment={comment} />
      </div>
      <div className="mb-4 flex justify-between">
        <div>
          <p className="mb-4 font-semibold">{comment.commentText}</p>
          <div className="line-clamp-2 text-sm md:line-clamp-1">
            {comment.parentCommentId ? (
              <div>
                Replied to a comment on{' '}
                <Link
                  href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
                  className="text-primaryColor"
                >
                  {article.name}
                </Link>
              </div>
            ) : (
              <div>
                Commented on{' '}
                <Link
                  href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
                  className="text-primaryColor"
                >
                  {article.name}
                </Link>
              </div>
            )}
          </div>
        </div>
        <Link
          href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
          className="block h-[67.5px] w-[120px] overflow-hidden rounded-md hover:scale-95"
        >
          <Image
            src={urlForImage(article.seo.image).height(675).width(1200).url()}
            alt={article.title}
            height={675}
            width={1200}
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <HandThumbUpIcon className="size-4" />
          <div>{comment.likesCount || 0} likes</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <HandThumbDownIcon className="size-4" />
          <div>{comment.dislikesCount || 0} dislikes</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <ArrowUturnLeftIcon className="size-4" />
          <div>{commentRepliesCount} replies</div>
        </div>
      </div>
    </div>
  );
}

function Alert() {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            aria-hidden="true"
            className="h-5 w-5 text-blue-400"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">
            You haven&#39;t commented on any article yet. Support us by sharing
            your thoughts!
          </p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <Link
              href="/"
              className="font-medium whitespace-nowrap text-blue-700 hover:text-blue-600"
            >
              Explore
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function CommentMenu({ comment }: { comment: CommentType }) {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const EDIT_TIME_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds
    const commentTime = new Date(comment.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - commentTime;

    if (timeDifference > EDIT_TIME_LIMIT) {
      setIsExpired(true);
    } else {
      const timer = setTimeout(() => {
        setIsExpired(true);
      }, EDIT_TIME_LIMIT - timeDifference);

      return () => clearTimeout(timer);
    }
  }, [comment.createdAt]);

  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const [isRequestingDelete, setIsRequestingDelete] = useState(false);
  const [isRequestingEdit, setIsRequestingEdit] = useState(false);

  const handleRequestDelete = async () => {
    setIsRequestingDelete(true);
    if (!isExpired) {
      toast.info('Open article to delete to your comment');
    } else {
      window.open(
        `https://wa.me/+263717238876?text="Requesting Deletion of comment: ${comment.commentId}"`,
        '_blank',
      );
    }
    setIsRequestingDelete(false);
  };

  const handleRequestEdit = async () => {
    setIsRequestingEdit(true);
    if (!isExpired) {
      toast.info('Open article to edit to your comment');
    } else {
      window.open(
        `https://wa.me/+263717238876?text="Requesting an edit to comment: ${comment.commentId}"`,
        '_blank',
      );
    }
    setIsRequestingEdit(false);
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none">
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon aria-hidden="true" className="h-5 w-5" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="ring-opacity-5 absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
        >
          <div className="py-1">
            <MenuItem>
              <button
                onClick={open}
                className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                <UserPlusIcon
                  aria-hidden="true"
                  className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                />
                Share
              </button>
            </MenuItem>
          </div>
          <div className="py-1">
            <MenuItem>
              <button
                onClick={handleRequestEdit}
                disabled={isRequestingEdit}
                className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                <PencilSquareIcon
                  aria-hidden="true"
                  className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                />
                {isRequestingEdit ? 'Requesting...' : 'Request Edit'}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={handleRequestDelete}
                disabled={isRequestingDelete}
                className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                <TrashIcon
                  aria-hidden="true"
                  className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                />
                {isRequestingDelete ? 'Requesting...' : 'Request Delete'}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
      <CommentShareDialog
        isOpen={isOpen}
        onClose={close}
        commentId={comment.commentId}
      />
    </>
  );
}
