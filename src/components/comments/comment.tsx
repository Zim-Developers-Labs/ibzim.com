'use client';

import { User } from 'lucia';
import { formatUpdatedAt, Linkify } from '@/lib/utils';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  FlagIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { CommentWithChildren } from './comments-lib';
import {
  deleteCommentAndChildren,
  getUserCommentReaction,
  updateCommentReaction,
} from './action';
import { toast } from 'sonner';
import { getCurrentRank } from '@/lib/comments/ranks';
import { RankIconWrapper } from '../icons/rank-icon-wrapper';
import RanksDialog from './ranks-dialog';
import { EditingForm, ReplyForm } from './forms';
import { Icons } from '../icons';
import HighlightedCommentHandler from './highlighted-comment-handler';
import { PinIcon } from 'lucide-react';
import CommentShareDialog from './share-dialog';
import ReportCommentDialog from './report-dialog';

type CommentProps = {
  articleId: string;
  comment: CommentWithChildren;
  parentCommentId: string;
  user?: User;
  setComments: any;
  onCommentAdded: () => void;
  updatedComments: any;
  onCommentDeleted: (commentId: string) => void;
  i: number;
  article: any;
};

export default function Comment({
  articleId,
  comment,
  parentCommentId,
  setComments,
  updatedComments,
  onCommentAdded,
  user,
  i,
  article,
}: CommentProps) {
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [dislikesCount, setDislikesCount] = useState(comment.dislikesCount);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showEditBox, setShowEditBox] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);

  useEffect(() => {
    async function fetchReactionStatus() {
      if (user && comment.commentId) {
        const reaction = await getUserCommentReaction(
          user.id,
          comment.commentId,
        );
        setUserReaction(reaction);
      }
    }
    fetchReactionStatus();
  }, [user, comment?.commentId]);

  const handleReaction = async (reaction: 'like' | 'dislike') => {
    if (!user) {
      toast.error('Please log in to like or dislike comments');
      return;
    }

    setIsLoading(true);
    const newReaction = userReaction === reaction ? null : reaction;
    const result = await updateCommentReaction(
      user.id,
      comment.commentId,
      newReaction,
    );
    setIsLoading(false);

    if (result.success) {
      setUserReaction(newReaction);
      setLikesCount(result.likesCount ?? 0);
      setDislikesCount(result.dislikesCount ?? 0);

      // Update the comment in the parent component's state
      setComments((prevComments: any) =>
        prevComments.map((c: any) =>
          c.commentId === comment.commentId
            ? {
                ...c,
                likesCount: result.likesCount,
                dislikesCount: result.dislikesCount,
              }
            : c,
        ),
      );
    } else {
      alert('Failed to update reaction');
    }
  };

  const fname = comment.user?.fullName
    ? comment.user?.fullName.split(' ')[0]
    : 'I';
  const lname = comment.user?.fullName
    ? comment.user?.fullName.split(' ')[1]
    : 'B';

  // Delete

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteComment = async () => {
    if (!user || user.id !== comment.userId) {
      toast.error("You don't have permission to delete this comment");
      return;
    }

    setIsDeleting(true);
    toast.info('Comment is being deleted');
    const result = await deleteCommentAndChildren(comment.commentId);
    toast.success('Comment has been deleted successfully');
    setIsDeleting(false);

    if (result.success) {
      // Update the comments state to remove the deleted comment
      setComments((prevComments: CommentWithChildren[]) => {
        const removeCommentRecursively = (
          comments: CommentWithChildren[],
        ): CommentWithChildren[] => {
          return comments.filter((c) => {
            if (c.commentId === comment.commentId) {
              return false; // Remove this comment
            }
            if (c.children) {
              c.children = removeCommentRecursively(c.children);
            }
            return true;
          });
        };

        return removeCommentRecursively(prevComments);
      });
    } else {
      alert('Failed to delete comment. Please try again.');
    }
  };

  const isEdited = comment.updatedAt;
  const commentText = (
    <span>
      {comment.commentText}
      {isEdited && (
        <span className="ml-1 inline-block rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-700 italic">
          (Edited)
        </span>
      )}
    </span>
  );

  const [isRanksOpen, setRanksIsOpen] = useState(false);

  function openRanks() {
    setRanksIsOpen(true);
  }

  function closeRanks() {
    setRanksIsOpen(false);
  }

  const currentRank = getCurrentRank(comment.user?.totalPoints || 0)?.name;

  return (
    <li className="text-sm text-gray-500">
      <div className="mb-4 flex space-x-4 rounded-lg bg-gray-50 px-4">
        <div className="flex-none py-10">
          {comment.user?.avatar ? (
            <Image
              src={comment.user.avatar}
              alt={comment.user.fullName!}
              height={50}
              width={50}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="grid h-10 w-10 place-content-center rounded-full bg-gray-200 uppercase">
              {fname![0]}
              {lname![0]}
            </div>
          )}
        </div>
        <div className="flex-1 py-10">
          <div className="flex w-full items-start justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-gray-900">
                @
                {comment.user?.username
                  ? comment.user?.username
                  : `user-${comment.user?.id}`}
                {comment.user && comment.user.totalPoints > 200 && (
                  <RankIconWrapper
                    onClick={openRanks}
                    id={Linkify(currentRank!)}
                    height={20}
                    width={20}
                    className="inline"
                  />
                )}
                <RanksDialog isOpen={isRanksOpen} onClose={closeRanks} />
              </h3>
              <p className="text-xs text-gray-400">
                <span>{formatUpdatedAt(comment.createdAt.toString())}</span>
              </p>
            </div>
            <CommentMenu
              comment={comment}
              handleDeleteComment={handleDeleteComment}
              isDeleting={isDeleting}
              user={user}
              showEditBox={showEditBox}
              setShowEditBox={setShowEditBox}
            />
          </div>
          {showEditBox ? (
            <EditingForm
              commentId={comment.commentId}
              editedText={editedText}
              setComments={setComments}
              setEditedText={setEditedText}
              setShowEditBox={setShowEditBox}
              showEditBox={showEditBox}
            />
          ) : (
            <div className="prose prose-sm mt-4 mb-4 max-w-none text-gray-900">
              {commentText}
            </div>
          )}
          <div className="grid grid-cols-4">
            <div className="col-span-2 flex items-center gap-2">
              <button
                onClick={() => handleReaction('like')}
                disabled={isLoading}
                className="flex items-center space-x-1 text-gray-900"
              >
                {userReaction === 'like' ? (
                  <Icons.handThumbUpSolid className="text-primaryColor h-5 w-5" />
                ) : (
                  <HandThumbUpIcon className="h-5 w-5" />
                )}
                <span className="text-sm text-gray-500">{likesCount}</span>
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
                <span className="text-sm text-gray-500">{dislikesCount}</span>
              </button>
            </div>

            <ReplyForm
              articleId={articleId}
              parentCommentId={comment.commentId}
              user={user}
              setComments={setComments}
              onCommentAdded={onCommentAdded}
            />
          </div>
        </div>
      </div>

      {comment.children?.length > 0 && (
        <ul className="pl-10">
          {comment.children.map((childComment: any) => (
            <Comment
              i={i}
              articleId={articleId}
              article={article}
              parentCommentId={parentCommentId}
              user={user}
              key={childComment.commentId}
              onCommentAdded={onCommentAdded}
              comment={childComment}
              setComments={setComments}
              updatedComments={updatedComments}
              onCommentDeleted={handleDeleteComment}
            />
          ))}
        </ul>
      )}

      <Suspense fallback={<div>Loading comments...</div>}>
        <HighlightedCommentHandler
          article={article}
          dislikesCount={dislikesCount}
          handleReaction={handleReaction}
          isLoading={isLoading}
          likesCount={likesCount}
          userReaction={userReaction}
        />
      </Suspense>
    </li>
  );
}

function CommentMenu({
  user,
  comment,
  handleDeleteComment,
  isDeleting,
  showEditBox,
  setShowEditBox,
}: {
  user?: User;
  comment: CommentWithChildren;
  handleDeleteComment: () => void;
  isDeleting: boolean;
  showEditBox: boolean;
  setShowEditBox: any;
}) {
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
  }, [comment?.createdAt]);

  const [isReportOpen, setReportIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function openReport() {
    setReportIsOpen(true);
  }

  function closeReport() {
    setReportIsOpen(false);
  }

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
            {user && user.id != comment.userId && (
              <MenuItem>
                <button
                  onClick={openReport}
                  className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  <FlagIcon
                    aria-hidden="true"
                    className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                  />
                  Report
                </button>
              </MenuItem>
            )}
            {!user && (
              <MenuItem>
                <button
                  className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  onClick={() => toast.info('Login/Signup to report comments')}
                >
                  <FlagIcon
                    aria-hidden="true"
                    className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                  />
                  Report
                </button>
              </MenuItem>
            )}
          </div>
          {user && (
            <div className="py-1">
              {user.email == 'tinomazorodze.mt@gmail.com' && (
                <MenuItem>
                  <a
                    href="#"
                    className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    <PinIcon
                      aria-hidden="true"
                      className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                    />
                    Pin
                  </a>
                </MenuItem>
              )}
              {user.id === comment.userId && (
                <MenuItem>
                  <button
                    onClick={() => setShowEditBox(true)}
                    disabled={isExpired || showEditBox}
                    className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    <PencilSquareIcon
                      aria-hidden="true"
                      className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                    />
                    Edit {isExpired && '(expired)'}
                  </button>
                </MenuItem>
              )}
              {user.id === comment.userId && (
                <div className="py-1">
                  <MenuItem>
                    <button
                      onClick={handleDeleteComment}
                      disabled={isExpired || isDeleting}
                      className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                    >
                      <TrashIcon
                        aria-hidden="true"
                        className="mr-3 h-5 w-5 text-gray-400 group-data-[focus]:text-gray-500"
                      />
                      {isDeleting ? 'Deleting...' : 'Delete'}{' '}
                      {isExpired && '(expired)'}
                    </button>
                  </MenuItem>
                </div>
              )}
            </div>
          )}
        </MenuItems>
      </Menu>
      <CommentShareDialog
        isOpen={isOpen}
        onClose={close}
        commentId={comment.commentId}
      />
      {user && (
        <ReportCommentDialog
          isOpen={isReportOpen}
          onClose={closeReport}
          commentId={comment.commentId}
          userId={user.id}
        />
      )}
    </>
  );
}
