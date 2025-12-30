import { urlForImage } from '@/lib/sanity/image';
import type { CardProfileType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilesCard({
  profiles,
}: {
  profiles: CardProfileType[];
}) {
  const peopleProfiles = profiles
    .filter((profile) => profile.entityType == 'person')
    .slice(0, 3);

  const companyProfiles = profiles
    .filter((profile) => profile.entityType == 'company')
    .slice(0, 3);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4">
      <div className="col-span-full bg-teal-300 px-4 py-8 lg:col-span-1 lg:px-20 lg:py-20">
        <h2 className="mb-6 text-2xl font-bold">IBZIM Profiles</h2>
        <p className="mb-4">
          Read authentic biographies and provide input if any of the information
          feels false.
        </p>
        <Link
          href="/profiles"
          className="block w-fit rounded-md bg-teal-100 px-4 py-2 hover:bg-zinc-900 hover:text-yellow-400"
        >
          All Profiles
        </Link>
      </div>
      <div className="col-span-full bg-zinc-900 px-4 py-8 text-white lg:col-span-3 lg:px-20 lg:py-20">
        <div className="mb-6">
          <h3 className="text-primaryColor mb-4 border-b border-zinc-700 pb-2 text-xl">
            People Profiles
          </h3>
          <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {peopleProfiles.map((profile, i) => (
              <ProfileCard profile={profile} key={i} />
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-primaryColor mb-4 border-b border-zinc-700 pb-2 text-xl">
            Company Profiles
          </h3>
          <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companyProfiles.map((profile, i) => (
              <ProfileCard profile={profile} key={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProfileCard({ profile }: { profile: CardProfileType }) {
  return (
    <li className="group relative">
      <Link
        href={`/profiles/${profile.entityType}/${profile.slug.current}`}
        className="flex w-full flex-row rounded-lg border-zinc-600 bg-zinc-800 p-4 group-hover:bg-zinc-600"
      >
        <Image
          src={
            urlForImage(profile.picture.asset).height(100).width(100).url() ||
            '/placeholder.svg'
          }
          alt={profile.name}
          height={100}
          width={100}
          className="mr-4 h-[80px] w-[80px] rounded-lg"
        />
        <span>
          <span className="group-hover:text-primaryColor mb-2 line-clamp-1 font-bold">
            {profile.name}
          </span>
          <span className="mb-4 line-clamp-2 h-[42px] text-sm">
            {profile.subTitle}
          </span>
        </span>
        <span className="absolute right-0 bottom-0 block rounded-md px-4 py-2 text-sm font-light text-zinc-200">
          Read Profile
        </span>
      </Link>
    </li>
  );
}
