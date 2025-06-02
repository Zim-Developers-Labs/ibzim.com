import { Metadata } from "next";
import ArticlesWrapper from "./wrapper";
import { getAllFullArticles } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "All Articles",
};

export default async function AllArticlesPage() {
  const sanityArticles = await getAllFullArticles();
  return (
    <>
      <ArticlesWrapper
        sanityArticles={sanityArticles.filter(
          (article) => article._type !== "press.article"
        )}
      />
    </>
  );
}
