'use server';

import { db } from '@/server/db';
import { comments, CommentType, users } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { User } from 'lucia';

// Extend CommentType to include the 'children' array
export interface CommentWithChildren extends CommentType {
  children: CommentWithChildren[];
  user?: User;
}

interface CommentsResult {
  parentComments: CommentWithChildren[];
  allComments: CommentType[];
  updatedAt?: Date;
}

export async function getUsernameFromId(
  userId: string,
): Promise<string | null> {
  try {
    const user = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length > 0 && user[0]!.username) {
      return user[0]!.username;
    } else {
      console.warn(`No username found for user ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching username for user ID ${userId}:`, error);
    return null;
  }
}

export async function getComments(articleId: string): Promise<CommentsResult> {
  const allComments = await db
    .select()
    .from(comments)
    .where(eq(comments.articleId, articleId));

  const activeUsers = await db
    .select()
    .from(users)
    .where(
      sql`${users.id} IN (
        SELECT DISTINCT ${comments.userId}
        FROM ${comments}
        WHERE ${comments.articleId} = ${articleId}
      )`,
    );

  // Create a map of users by their ID for quick lookup
  const userMap = new Map<string, User>();
  activeUsers.forEach((user) => {
    userMap.set(user.id, user);
  });

  // Initialize a map to link each comment by its ID
  const map = new Map<string, CommentWithChildren>();

  // Populate the map and add a 'children' array to each comment
  allComments.forEach((comment) => {
    const user = userMap.get(comment.userId);
    if (!user) {
      throw new Error(`User not found for comment ${comment.commentId}`);
    }
    const commentWithChildren: CommentWithChildren = {
      ...comment,
      children: [],
      user: user,
    };
    map.set(comment.commentId, commentWithChildren);
  });

  // Root comments to return
  const rootComments: CommentWithChildren[] = [];

  allComments.forEach((comment) => {
    const commentWithChildren = map.get(comment.commentId)!;
    if (comment.parentCommentId) {
      const parentComment = map.get(comment.parentCommentId);
      if (parentComment) {
        parentComment.children.push(commentWithChildren);
      }
    } else {
      rootComments.push(commentWithChildren);
    }
  });

  return {
    parentComments: rootComments,
    allComments,
  };
}
