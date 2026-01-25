'use client';

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
import { useUser } from '@/hooks/user-context';
import Container from '@/components/container';
import GoogleAdUnit from '@/components/ad-unit';

export type Props = {
  articles: CardArticleType[];
  profiles: CardProfileType[];
  home: HomeType;
  authors: AuthorType[];
};

export default function ArticlesComponents({
  articles,
  home,
  profiles,
  authors,
}: Props) {
  const { user } = useUser();
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
      <aside className="bg-white py-4">
        <Container>
          <GoogleAdUnit adSlot="6332518135" />
        </Container>
      </aside>
      <Hero
        heroArticle={heroArticle!}
        latestArticles={heroCardArticles}
        pinnedRankingArticles={pinnedRankingArticles}
      />
      <ArticlesListing articles={tenRestOfArticles} title="Latest Articles" />
      <ProfilesCard profiles={profiles} />
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
