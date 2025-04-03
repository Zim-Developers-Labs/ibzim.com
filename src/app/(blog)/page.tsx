import HomeWrapper from "@/components/home";
import { siteConfig } from "@/lib/config";
import { preparePageMetadata } from "@/lib/metadata";
import { getAllArticlesByBlog, getAllProfilesForListingByBlog, getHome } from "@/lib/sanity/client";
import { CardArticleType, CardProfileType, HomeType } from "@/types";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const [homes]: [HomeType[]] = await Promise.all([
    getHome(
      siteConfig.documentPrefix !== ""
        ? `${siteConfig.documentPrefix}.home`
        : "home"
    ),
  ]);
  const home: HomeType = homes[0]!;

  return preparePageMetadata({
    title: home.seo.title,
    description: home.seo.description,
    pageUrl: "/",
    imageUrl: "/banner.webp",
    siteConfig,
  });
}

export default async function HomePage() {
  const [articles, home, profiles]: [
    CardArticleType[],
    HomeType[],
    CardProfileType[],
  ] = await Promise.all([
    getAllArticlesByBlog(
      siteConfig.documentPrefix !== ""
        ? `${siteConfig.documentPrefix}.article`
        : "article"
    ),
    getHome(
      siteConfig.documentPrefix !== ""
        ? `${siteConfig.documentPrefix}.home`
        : "home"
    ),
    getAllProfilesForListingByBlog(
      siteConfig.documentPrefix !== ""
        ? `${siteConfig.documentPrefix}.profile`
        : "profile"
    ),
  ]);

  return (
    <HomeWrapper
      profiles={profiles}
      articles={articles}
      home={home[0]!}
    />
  );
}
