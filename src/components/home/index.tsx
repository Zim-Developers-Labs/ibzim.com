import { siteConfig } from '@/lib/config';
import Hero from './hero';
import type {
  AuthorType,
  CardArticleType,
  CardProfileType,
  HomeType,
} from '@/types';
import ArticlesListing from './listing';
import ProfilesCard from './profiles-card';
import AuthorsCard from './authors-card';

export type Props = {
  articles: CardArticleType[];
  profiles: CardProfileType[];
  home: HomeType;
  authors: AuthorType[];
};

export default function HomeWrapper({
  articles,
  home,
  profiles,
  authors,
}: Props) {
  const heroArticle = articles.find(
    (article) => article._id === home.mainArticle!._ref,
  );

  const heroCardArticles = articles.filter((article) =>
    home.heroArticles!.some((hero) => hero._ref === article._id),
  );

  const pinnedRankingArticles = articles.filter((article) =>
    home.heroLists!.some((hero) => hero._ref === article._id),
  );

  const restOfArticles = articles.filter(
    (article) =>
      article._id !== home.mainArticle!._ref &&
      !home.heroLists!.some((hero) => hero._ref === article._id) &&
      !home.heroArticles!.some((hero) => hero._ref === article._id),
  );

  const tenRestOfArticles = restOfArticles.slice(0, 10);
  const tenOtherRestOfArticles = restOfArticles.slice(10, 20);
  const remainingRestOfArticles = restOfArticles.slice(20);

  return (
    <main>
      <Hero
        siteConfig={siteConfig}
        heroArticle={heroArticle!}
        latestArticles={heroCardArticles}
        pinnedRankingArticles={pinnedRankingArticles}
      />
      <ArticlesListing articles={tenRestOfArticles} title="Latest Articles" />
      <ProfilesCard profiles={profiles} siteConfig={siteConfig} />
      <ArticlesListing
        articles={tenOtherRestOfArticles}
        title="More Articles"
      />
      <AuthorsCard authors={authors} articles={articles} />
      <ArticlesListing
        articles={remainingRestOfArticles}
        title="More Articles"
      />
    </main>
  );
}
