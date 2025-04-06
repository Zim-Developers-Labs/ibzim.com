'use client';

import { toast } from 'sonner';
import { Icons } from '../icons';
import { SignToggler } from '../header/sign-toggler';
import { Textarea } from '../ui/textarea';
import { User } from 'lucia';
import { useActionState, useEffect, useRef, useState } from 'react';
import { editComment, postComment } from './action';
import { CommentWithChildren } from './comments-lib';
import { SubmitButton } from '../ui/submit-button';

export function MainForm({
  user,
  articleId,
  setComments,
  updatedComments,
  onCommentAdded,
  claps,
  handleClap,
  isClapping,
  userClapped,
}: {
  user?: User;
  articleId: string;
  setComments: any;
  updatedComments: any;
  onCommentAdded: () => void;
  handleClap: any;
  isClapping: boolean;
  userClapped: boolean;
  claps: any;
}) {
  const [state, formAction] = useActionState(postComment, null);
  const [replyText, setReplyText] = useState('');

  if (state?.done) {
    setReplyText('');
    state.done = false;
    setComments([state.comment, ...updatedComments]);
    onCommentAdded();
  }

  return (
    <form action={formAction} className="relative mb-8">
      <input type="hidden" name="userId" value={user?.id} />
      <input type="hidden" name="articleId" value={articleId} />
      <div className="focus-within:ring-primaryColor overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
        <label htmlFor="commentText" className="sr-only">
          Add your comment
        </label>
        <Textarea
          name="commentText"
          id="commentText"
          minLength={2}
          maxLength={500}
          value={replyText}
          onChange={(e) => {
            setReplyText(e.target.value);
          }}
          placeholder="Add your comment..."
          className="border-0 shadow-none outline-0 focus:border-0 focus:outline-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none"
        />

        {/* Spacer element to match the height of the toolbar */}
        <div className="py-2" aria-hidden="true">
          {/* Matches height of button in toolbar (1px border + 36px content height) */}
          <div className="py-px">
            <div className="h-12" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-4">
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={handleClap}
              disabled={isClapping || !user}
              className={`flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500 ${!isClapping && 'cursor-pointer hover:-translate-y-1'}`}
            >
              {userClapped ? (
                <Icons.clapHandsSolid className="text-primaryColor h-5 w-fit" />
              ) : (
                <Icons.clapHands className="h-5 w-fit" title="Clap" />
              )}
              <span className="sr-only">Clap hands for article</span>
            </button>
          ) : (
            <button
              onClick={() => {
                toast.error('Login/Signup first to clap for article');
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:-translate-y-1 hover:text-gray-500"
            >
              <Icons.clapHands className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Clap hands for article</span>
            </button>
          )}
          <div
            aria-label="Article Claps Count"
            className="text-sm text-gray-500"
          >
            {claps || 0}
          </div>
        </div>
        <div className="flex-shrink-0">
          {!user && <SignToggler linkText="Login to comment" />}
          {user && <SubmitButton>Post Comment</SubmitButton>}
        </div>
      </div>
    </form>
  );
}

type ReplyFormProps = {
  user?: User;
  articleId: string;
  parentCommentId: string;
  setComments: any;
  onCommentAdded: () => void;
};

export function ReplyForm({
  articleId,
  parentCommentId,
  user,
  setComments,
  onCommentAdded,
}: ReplyFormProps) {
  const [state, formAction] = useActionState(postComment, null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const formRef = useRef<HTMLFormElement>(null); // Reference for the reply form

  // Hide reply box if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowReplyBox(false);
      }
    };

    // Add the event listener when the reply box is open
    if (showReplyBox) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReplyBox]);

  if (state?.done) {
    setReplyText('');
    setShowReplyBox(false);
    state.done = false;
    setComments((prevComments: any) => {
      const updateCommentsRecursively = (
        comments: CommentWithChildren[],
      ): CommentWithChildren[] => {
        return comments.map((comment) => {
          if (comment.commentId === parentCommentId) {
            return {
              ...comment,
              children: [
                state.comment as CommentWithChildren,
                ...(comment.children || []),
              ],
            };
          } else if (comment.children) {
            return {
              ...comment,
              children: updateCommentsRecursively(comment.children),
            };
          }
          return comment;
        });
      };

      return updateCommentsRecursively(prevComments);
    });
    onCommentAdded();
  }

  return (
    <>
      <div className="col-span-2 flex w-full justify-between self-end">
        <div className="w-full"></div>
        <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>
      </div>

      {showReplyBox && (
        <form
          action={formAction}
          className="relative col-span-full mt-4"
          ref={formRef}
        >
          <input type="hidden" name="userId" value={user?.id} />
          <input type="hidden" name="articleId" value={articleId} />
          <input type="hidden" name="parentCommentId" value={parentCommentId} />
          <div className="focus-within:ring-primaryColor overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
            <label htmlFor="commentText" className="sr-only">
              Add your reply
            </label>
            <textarea
              name="commentText"
              id="commentText"
              value={replyText}
              className="block w-full resize-none border-0 bg-transparent py-2 text-gray-900 placeholder:text-sm placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              minLength={2}
              maxLength={500}
              onChange={(e) => setReplyText(e.target.value)}
              rows={1}
              placeholder="Write a reply..."
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pr-2 pl-3">
            <div></div>
            <div className="flex-shrink-0">
              {!user && <SignToggler linkText="Login to comment" />}
              {user && <SubmitButton>Reply</SubmitButton>}
            </div>
          </div>
          {state?.fieldError ? (
            <ul className="bg-destructive/10 text-destructive list-disc space-y-1 rounded-lg border p-2 text-[0.8rem] font-medium">
              {Object.values(state.fieldError).map((err) => (
                <li className="ml-4" key={err}>
                  {err}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="bg-destructive/10 text-destructive rounded-lg border p-2 text-[0.8rem] font-medium">
              {state?.formError}
            </p>
          ) : null}
        </form>
      )}
    </>
  );
}

export function EditingForm({
  setEditedText,
  setShowEditBox,
  showEditBox,
  editedText,
  commentId,
  setComments,
}: {
  setEditedText: any;
  setShowEditBox: any;
  showEditBox: any;
  editedText: any;
  commentId: any;
  setComments: any;
}) {
  const [state, formAction] = useActionState(editComment, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowEditBox(false);
      }
    };

    // Add the event listener when the reply box is open
    if (showEditBox) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowEditBox, showEditBox]);

  if (state?.success) {
    setComments((prevComments: any) =>
      prevComments.map((c: any) =>
        c.commentId === commentId ? { ...c, commentText: state.comment } : c,
      ),
    );
    setShowEditBox(false);
  }

  return (
    <form
      action={formAction}
      className="relative col-span-full my-4"
      ref={formRef}
    >
      <input type="hidden" name="commentId" value={commentId} />
      <div className="focus-within:ring-primaryColor overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
        <label htmlFor="editedText" className="sr-only">
          Add your reply
        </label>
        <textarea
          name="editedText"
          id="editedText"
          value={editedText}
          className="block w-full resize-none border-0 bg-transparent py-2 text-gray-900 placeholder:text-sm placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          minLength={2}
          maxLength={500}
          onChange={(e) => setEditedText(e.target.value)}
          rows={3}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        {/* Spacer element to match the height of the toolbar */}
        <div className="py-2" aria-hidden="true">
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pr-2 pl-3">
        <div></div>
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditBox(false)}
              className="inline-flex items-center rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-700"
            >
              Cancel
            </button>
            <SubmitButton>Edit Comment</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}
