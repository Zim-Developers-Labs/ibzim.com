import GoogleAdUnit from '@/components/ad-unit';
import Container from '@/components/container';
import { CardProfileType } from '@/types';
import WikiHero from './hero';
import ProfilesListing from './listing';

export default function ProfilesListingComponents({
  profiles,
}: {
  profiles: CardProfileType[];
}) {
  return (
    <main>
      <aside className="bg-white py-4">
        <Container>
          <GoogleAdUnit adSlot="6332518135" />
        </Container>
      </aside>
      <WikiHero />
      <ProfilesListing profiles={profiles} />
    </main>
  );
}
