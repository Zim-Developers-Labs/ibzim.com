'use server';

import { demoAnswerLikes } from '@/data/demo';
import { db } from '@/server/db';
import { Answer, answerLikes, answers } from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { AnswerInput, answerSchema } from './validators';
import { filterBadWords } from '@/lib/utils';
import { generateId } from 'lucia';

export async function getAnswerLikes(answerId: string, userId?: string) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(answerLikes)
      .where(eq(answerLikes.answerId, answerId));

    const count = result[0]?.count ?? 0;

    let userLiked = false;
    if (userId) {
      const existingLike = await db.query.answerLikes.findFirst({
        where: and(
          eq(answerLikes.answerId, answerId),
          eq(answerLikes.userId, userId),
        ),
      });
      userLiked = !!existingLike;
    }

    // add demo data
    const demoLikes = demoAnswerLikes.filter(
      (like) => like.answerId === answerId,
    );

    const likes = Number(count) + demoLikes.length;

    return { success: true, likes, userLiked };
  } catch (error) {
    console.error('Error fetching answer likes:', error);
    return { success: false, error: 'Failed to fetch likes' };
  }
}

export async function toggleAnswerLike(answerId: string, userId: string) {
  try {
    const existingLike = await db.query.answerLikes.findFirst({
      where: and(
        eq(answerLikes.answerId, answerId),
        eq(answerLikes.userId, userId),
      ),
    });

    if (existingLike) {
      await db
        .delete(answerLikes)
        .where(
          and(
            eq(answerLikes.answerId, answerId),
            eq(answerLikes.userId, userId),
          ),
        );
    } else {
      // User hasnt liked yet, so we'll add their like
      await db.insert(answerLikes).values({ answerId, userId });
    }

    // Get the updated likes count
    const result = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(answerLikes)
      .where(eq(answerLikes.answerId, answerId));

    const count = result[0]?.count ?? 0;

    // add demo data
    const demoLikes = demoAnswerLikes.filter(
      (like) => like.answerId === answerId,
    );

    let likes;

    if (answerId.includes('ibzim') || answerId.includes('demo')) {
      likes = Number(count) + demoLikes.length;
      // For demo answers, we don't need to update the likes in the database
      return { success: true, likes, userLiked: !existingLike };
    }

    likes = Number(count);

    // For real answers, we need to update the likes in the database
    await db
      .update(answers)
      .set({ likesCount: likes })
      .where(eq(answers.id, answerId));

    return { success: true, likes, userLiked: !existingLike };
  } catch (error) {
    console.error('Error updating likes:', error);
    return { success: false, error: 'Failed to update likes' };
  }
}

interface AnswerActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  succcesMessage?: string;
  done?: boolean;
  answer?: Answer;
}

export async function addAnswer(
  _: any,
  formData: FormData,
): Promise<AnswerActionResponse<AnswerInput>> {
  const obj = Object.fromEntries(formData);

  const parsed = answerSchema.safeParse(obj);

  if (!parsed.success) {
    const fieldError: Partial<Record<keyof AnswerInput, string>> = {};
    parsed.error.errors.forEach((error) => {
      fieldError[error.path[0] as keyof AnswerInput] = error.message;
    });
    return { fieldError };
  }

  const { userName, answerText, questionId, tool } = parsed.data;

  const filteredAnswerText = filterBadWords(answerText);
  const answerId = generateId(21);

  await db.insert(answers).values({
    id: answerId,
    questionId,
    userName,
    content: filteredAnswerText,
    isVerified: false,
    tool,
  });

  return {
    done: true,
    succcesMessage: 'Answer added successfully',
    answer: {
      id: answerId,
      likesCount: 0,
      tool,
      questionId,
      userName,
      content: filteredAnswerText,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

export async function getAllToolAnswers(tool: string): Promise<Answer[]> {
  try {
    const dbAnswers = await db
      .select()
      .from(answers)
      .where(eq(answers.tool, tool));

    return dbAnswers;
  } catch (error) {
    console.error('Error fetching answers:', error);
    return [];
  }
}
