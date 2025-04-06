'use server';

import { db } from '@/server/db';
import { savedArticles } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export async function saveArticle(userId: string, articleId: string) {
  const existingSave = await db.query.savedArticles.findFirst({
    where: and(
      eq(savedArticles.userId, userId),
      eq(savedArticles.articleId, articleId),
    ),
  });

  if (existingSave) {
    await db.delete(savedArticles).where(eq(savedArticles.id, existingSave.id));
  } else {
    const saveId = generateId(21);
    await db.insert(savedArticles).values({ id: saveId, userId, articleId });
  }
}

export async function getSavedArticles(userId: string) {
  try {
    const allSavedArticles = await db.query.savedArticles.findMany({
      where: eq(savedArticles.userId, userId),
      orderBy: (savedArticles, { desc }) => [desc(savedArticles.savedAt)],
    });

    return { allSavedArticles };
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    return { error: 'An error occered while fetching saved articles' };
  }
}
