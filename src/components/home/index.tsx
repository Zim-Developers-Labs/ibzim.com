import { siteConfig } from '@/lib/config';
import Hero from './hero';
import type {
  AuthorType,
  CardArticleType,
  CardProfileType,
  HomeType,
  SearchDocumentType,
} from '@/types';
import ArticlesListing from './listing';
import ProfilesCard from './profiles-card';
import AuthorsCard from './authors-card';
import BlogHeader from '@/app/(blog)/blog-header';
import { User } from 'lucia';
import GoogleAdUnit from '../ad-unit';
import Container from '../container';

export type Props = {
  articles: CardArticleType[];
  profiles: CardProfileType[];
  home: HomeType;
  authors: AuthorType[];
  allArticles?: SearchDocumentType[];
  popularArticles?: SearchDocumentType[];
  user: User | null;
};

export default function HomeWrapper({
  articles,
  home,
  profiles,
  authors,
  user,
  allArticles,
  popularArticles,
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
      <BlogHeader
        articles={allArticles}
        popularArticles={popularArticles}
        user={user}
      />
      <aside className="bg-white py-4">
        <Container>
          <GoogleAdUnit adSlot="6332518135" />
        </Container>
      </aside>
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
