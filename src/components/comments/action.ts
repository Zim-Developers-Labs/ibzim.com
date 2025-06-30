'use server';

import { filterBadWords } from '@/lib/utils';
import {
  CommentInput,
  commentSchema,
  EditCommentInput,
  editCommentSchema,
} from '@/lib/comments/validators';
import { generateId } from 'lucia';
import { CommentWithChildren } from './comments-lib';
import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { commentReactions, commentReports, comments } from '@/server/db/schema';

interface CommentActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  succcesMessage?: string;
  done?: boolean;
  comment?: CommentWithChildren;
}

export async function postComment(
  _: any,
  formData: FormData,
): Promise<CommentActionResponse<CommentInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = commentSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        articleId: err.fieldErrors.articleId?.[0],
        commentText: err.fieldErrors.commentText?.[0],
        parentCommentId: err.fieldErrors.parentCommentId?.[0],
        userId: err.fieldErrors.userId?.[0],
      },
    };
  }

  const { articleId, commentText, userId, parentCommentId } = parsed.data;

  const commentId = generateId(21);

  const filteredComment = filterBadWords(commentText);

  await db.insert(comments).values({
    commentId,
    articleId,
    commentText: filteredComment,
    userId,
    parentCommentId,
  });

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  return {
    succcesMessage: 'Comment Added',
    done: true,
    comment: {
      articleId,
      children: [],
      user,
      commentId,
      commentText: filteredComment,
      userId,
      createdAt: new Date(),
      dislikesCount: 0,
      likesCount: 0,
      // @ts-expect-error -- Type 'string | undefined' is not assignable to type 'string | null'.
      parentCommentId,
    },
  };
}

export async function getUserCommentReaction(
  userId: string,
  commentId: string,
) {
  const result = await db
    .select({ reaction: commentReactions.reaction })
    .from(commentReactions)
    .where(
      and(
        eq(commentReactions.userId, userId),
        eq(commentReactions.commentId, commentId),
      ),
    )
    .limit(1);

  return result[0]?.reaction as 'like' | 'dislike' | null;
}

export async function updateCommentReaction(
  userId: string,
  commentId: string,
  reaction: 'like' | 'dislike' | null,
) {
  const existingReaction = await getUserCommentReaction(userId, commentId);

  if (existingReaction === reaction) {
    return { success: true, message: 'Reaction unchanged' };
  }

  if (existingReaction) {
    if (reaction === null) {
      await db
        .delete(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
          ),
        );

      // Fetch current counts
      const currentComment = await db
        .select({
          likesCount: comments.likesCount,
          dislikesCount: comments.dislikesCount,
        })
        .from(comments)
        .where(eq(comments.commentId, commentId))
        .limit(1);

      if (currentComment.length === 0) {
        throw new Error('Comment not found');
      }

      // Decrement the count for the existing reaction
      await db
        .update(comments)
        .set({
          [existingReaction === 'like' ? 'likesCount' : 'dislikesCount']:
            existingReaction === 'like'
              ? currentComment[0]!.likesCount - 1
              : currentComment[0]!.dislikesCount - 1,
        })
        .where(eq(comments.commentId, commentId));
    } else {
      await db
        .update(commentReactions)
        .set({ reaction })
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
          ),
        );

      // Fetch current counts
      const currentComment = await db
        .select({
          likesCount: comments.likesCount,
          dislikesCount: comments.dislikesCount,
        })
        .from(comments)
        .where(eq(comments.commentId, commentId))
        .limit(1);

      if (currentComment.length === 0) {
        throw new Error('Comment not found');
      }

      // Update counts based on the change in reaction
      const newLikesCount =
        existingReaction === 'like'
          ? currentComment[0]!.likesCount - 1
          : reaction === 'like'
            ? currentComment[0]!.likesCount + 1
            : currentComment[0]!.likesCount;

      const newDislikesCount =
        existingReaction === 'dislike'
          ? currentComment[0]!.dislikesCount - 1
          : reaction === 'dislike'
            ? currentComment[0]!.dislikesCount + 1
            : currentComment[0]!.dislikesCount;

      await db
        .update(comments)
        .set({
          likesCount: newLikesCount,
          dislikesCount: newDislikesCount,
        })
        .where(eq(comments.commentId, commentId));
    }
  } else if (reaction !== null) {
    await db.insert(commentReactions).values({
      id: generateId(21),
      userId,
      commentId,
      reaction,
    });

    // Fetch current counts
    const currentComment = await db
      .select({
        likesCount: comments.likesCount,
        dislikesCount: comments.dislikesCount,
      })
      .from(comments)
      .where(eq(comments.commentId, commentId))
      .limit(1);

    if (currentComment.length === 0) {
      throw new Error('Comment not found');
    }

    // Increment the count for the new reaction
    await db
      .update(comments)
      .set({
        [reaction === 'like' ? 'likesCount' : 'dislikesCount']:
          reaction === 'like'
            ? currentComment[0]!.likesCount + 1
            : currentComment[0]!.dislikesCount + 1,
      })
      .where(eq(comments.commentId, commentId));
  }

  const updatedComment = await db
    .select({
      likesCount: comments.likesCount,
      dislikesCount: comments.dislikesCount,
    })
    .from(comments)
    .where(eq(comments.commentId, commentId))
    .limit(1);

  const likesCount = updatedComment[0]?.likesCount
    ? Number(updatedComment[0].likesCount)
    : 0;
  const dislikesCount = updatedComment[0]?.dislikesCount
    ? Number(updatedComment[0].dislikesCount)
    : 0;

  return {
    success: true,
    message: 'Reaction updated successfully',
    likesCount,
    dislikesCount,
  };
}

export async function deleteComment(commentId: string) {
  try {
    await db.delete(comments).where(eq(comments.commentId, commentId));
    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, message: 'Failed to delete comment' };
  }
}

export async function deleteCommentAndChildren(commentId: string) {
  try {
    // Recursive function to delete a comment and its children
    const deleteRecursive = async (id: string) => {
      // Get all child comments
      const childComments = await db
        .select({ commentId: comments.commentId })
        .from(comments)
        .where(eq(comments.parentCommentId, id));

      // Recursively delete all child comments
      for (const child of childComments) {
        await deleteRecursive(child.commentId);
      }

      // Delete reactions associated with this comment
      await db
        .delete(commentReactions)
        .where(eq(commentReactions.commentId, id));

      // Delete the comment itself
      await db.delete(comments).where(eq(comments.commentId, id));
    };

    // Start the recursive deletion from the given commentId
    await deleteRecursive(commentId);

    return {
      success: true,
      message: 'Comment and its children deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting comment and its children:', error);
    return {
      success: false,
      message: 'Failed to delete comment and its children',
    };
  }
}

interface EditCommentActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  message?: string;
  success?: boolean;
  comment?: string;
}

export async function editComment(
  _: any,
  formData: FormData,
): Promise<EditCommentActionResponse<EditCommentInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = editCommentSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        editedText: err.fieldErrors.editedText?.[0],
        commentId: err.fieldErrors.commentId?.[0],
      },
    };
  }

  const { editedText, commentId } = parsed.data;

  const filteredComment = filterBadWords(editedText);

  await db
    .update(comments)
    .set({ commentText: filteredComment, updatedAt: new Date() })
    .where(eq(comments.commentId, commentId))
    .returning();

  return {
    success: true,
    message: 'Comment updated successfully',
    comment: filteredComment,
  };
}

export async function getCommentById(commentId: string) {
  try {
    const comment = await db.query.comments.findFirst({
      where: eq(comments.commentId, commentId),
    });

    if (!comment) {
      return { error: 'Comment not found' };
    }

    return { comment };
  } catch (error) {
    console.error('Error fetching comment:', error);
    return { error: 'An error occurred while fetching the comment' };
  }
}

export async function reportComment(
  _: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const userId = formData.get('userId') as string;
  const commentId = formData.get('commentId') as string;
  const reason = formData.get('reason') as string;

  const reportId = generateId(21);
  await db.insert(commentReports).values({
    id: reportId,
    commentId,
    reason,
    reporterId: userId,
  });

  return { success: true };
}
