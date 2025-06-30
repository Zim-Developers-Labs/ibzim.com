import { urlForImage } from '@/sanity/lib/image';
import { CardProfileType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function WikiListing({
  profiles,
}: {
  profiles: CardProfileType[];
}) {
  return (
    <ul className="my-8 grid grid-cols-1 gap-x-4 gap-y-4 px-4 sm:grid-cols-2 md:grid-cols-3 md:px-8 lg:grid-cols-4 xl:px-12">
      {profiles.map((profile, i) => (
        <ProfileCard profile={profile} key={i} />
      ))}
    </ul>
  );
}

function ProfileCard({ profile }: { profile: CardProfileType }) {
  return (
    <li className="group relative">
      <Link
        href={`/profiles/${profile.entityType}/${profile.slug.current}`}
        className="flex w-full flex-row rounded-lg border-zinc-200 bg-zinc-50 p-4 group-hover:bg-zinc-100 sm:flex-col sm:items-center sm:p-6"
      >
        <Image
          src={urlForImage(profile.picture).height(100).width(100).url()}
          alt={profile.name}
          height={100}
          width={100}
          className="mr-4 h-[80px] w-[80px] rounded-lg sm:mr-0 sm:mb-4 sm:h-[100px] sm:w-[100px] sm:rounded-full"
        />
        <span>
          <span className="group-hover:text-primaryColor mb-2 line-clamp-1 font-bold sm:text-center">
            {profile.name}
          </span>
          <span className="mb-4 line-clamp-2 h-[42px] text-sm sm:text-center">
            {profile.subTitle}
          </span>
        </span>
        <span className="absolute right-0 bottom-0 block rounded-md border-zinc-300 px-4 py-2 text-sm text-zinc-600 sm:static sm:border sm:group-hover:bg-zinc-300">
          Read Profile
        </span>
      </Link>
    </li>
  );
}
