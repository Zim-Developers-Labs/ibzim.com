"use server";

import { getAllArticlesForSearchByBlog } from "./client";
import { SearchDocumentType } from "@/types";

export async function getSearchData(
  popularArticleIds: string[],
  documentPrefix: string
) {
  const [allArticles]: [SearchDocumentType[]] = await Promise.all([
    getAllArticlesForSearchByBlog(
      documentPrefix !== "" ? `${documentPrefix}.article` : "article",
      documentPrefix !== "" ? `${documentPrefix}.profile` : "profile"
    ),
  ]);

  const popularArticles = allArticles.filter((article: any) =>
    popularArticleIds?.includes(article._id)
  );

  return { allArticles, popularArticles };
}
