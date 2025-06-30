import { CardProfileType } from '@/types';
import WikiHero from './components/hero';
import WikiListing from './components/listing';

export default function ProfileListingWrapper({
  profiles,
}: {
  profiles: CardProfileType[];
}) {
  return (
    <main>
      <WikiHero />
      <WikiListing profiles={profiles} />
    </main>
  );
}
