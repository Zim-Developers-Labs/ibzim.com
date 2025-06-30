import { z } from 'zod';

export const commentSchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  commentText: z
    .string()
    .min(2, 'Comment must be at least 2 characters long')
    .regex(/^[\w\s.,!?'"-]*$/, 'Comment contains invalid characters')
    .trim(),
  parentCommentId: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const editCommentSchema = z.object({
  commentId: z.string().min(1, 'Comment ID is required'),
  editedText: z
    .string()
    .min(2, 'Comment must be at least 2 characters long')
    .regex(/^[\w\s.,!?'"-]*$/, 'Comment contains invalid characters')
    .trim(),
});

export type EditCommentInput = z.infer<typeof editCommentSchema>;
