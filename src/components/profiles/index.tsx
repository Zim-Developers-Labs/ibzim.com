import { CardProfileType, SearchDocumentType } from '@/types';
import WikiHero from './components/hero';
import WikiListing from './components/listing';
import BlogHeader from '@/app/(blog)/blog-header';
import { User } from 'lucia';

export default function ProfileListingWrapper({
  profiles,
  user,
  allArticles,
  popularArticles,
}: {
  profiles: CardProfileType[];
  allArticles?: SearchDocumentType[];
  popularArticles?: SearchDocumentType[];
  user: User | null;
}) {
  return (
    <main>
      <BlogHeader
        articles={allArticles}
        popularArticles={popularArticles}
        user={user}
      />
      <WikiHero />
      <WikiListing profiles={profiles} />
    </main>
  );
}
