import { CardProfileType, SearchDocumentType } from '@/types';
import WikiHero from './components/hero';
import WikiListing from './components/listing';
import BlogHeader from '@/app/(blog)/blog-header';
import { User } from 'lucia';
import Container from '../container';
import GoogleAdUnit from '../ad-unit';

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
      <aside className="bg-white py-4">
        <Container>
          <GoogleAdUnit adSlot="6332518135" />
        </Container>
      </aside>
      <WikiHero />
      <WikiListing profiles={profiles} />
    </main>
  );
}
