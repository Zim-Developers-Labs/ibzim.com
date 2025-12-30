import formatDate from 'date-fns/format';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileType } from '@/types';
import { Icons } from '@/components/icons';
import { ExternalLink, TriangleAlert } from 'lucide-react';
import { urlForImage } from '@/lib/sanity/image';
import { TxtRenderer } from '@/components/pt-renderer';

export default function InfoBox({ profile }: { profile: ProfileType }) {
  return (
    <div className="mx-auto block w-full rounded-md border border-zinc-200 bg-zinc-50 md:mx-0 md:max-w-[300px]">
      <figure className="mb-2">
        {profile.picture.ratio === '16:9' ? (
          <Image
            src={
              urlForImage(profile.picture).width(300).height(169).url() ||
              '/placeholder.svg'
            }
            width={300}
            height={169}
            alt={profile.picture.alt}
            className="mx-auto mb-2 block rounded-md"
          />
        ) : (
          <Image
            src={
              urlForImage(profile.picture).width(150).height(150).url() ||
              '/placeholder.svg'
            }
            width={150}
            height={150}
            alt={profile.picture.alt}
            className="mx-auto mb-2 block h-[100px] w-[100px] rounded-md md:h-[150px] md:w-[150px]"
          />
        )}
        <figcaption className="text-center text-xs italic sm:text-sm">
          {profile.picture.alt}
        </figcaption>
      </figure>
      <table className="mx-auto mb-3 w-full">
        <caption className="mb-4 w-full border-y text-center text-sm text-zinc-700">
          Details
        </caption>
        <tbody className="mx-auto block w-full max-w-[300px] overflow-x-hidden px-2 text-sm md:px-3">
          {profile.legalName && (
            <tr className="grid grid-cols-[40%_60%]">
              <th className="pr-2 pb-2 text-left align-top">Legal Name</th>
              <td className="pb-2 text-left align-top">{profile.legalName}</td>
            </tr>
          )}
          {profile.yearFounded && (
            <tr className="grid grid-cols-[40%_60%]">
              <th className="pr-2 pb-2 text-left align-top">Year Founded</th>
              <td className="pb-2 text-left align-top">
                {profile.yearFounded} (
                {new Date().getFullYear() - profile.yearFounded} Years Ago)
              </td>
            </tr>
          )}
          {profile.birthDate && (
            <tr className="grid grid-cols-[40%_60%]">
              <th className="pr-2 pb-2 text-left align-top">Born</th>
              <td className="pb-2 text-left align-top">
                {formatDate(new Date(profile.birthDate), 'MMMM d, yyyy')}
                <br />({profile.isBirthDateApproximate && 'Estimated'} Age{' '}
                {Math.floor(
                  (new Date().getTime() -
                    new Date(profile.birthDate).getTime()) /
                    3.15576e10,
                )}{' '}
                Years)
              </td>
            </tr>
          )}
          {profile.birthYear && (
            <tr className="grid grid-cols-[40%_60%]">
              <th className="pr-2 pb-2 text-left align-top">Birth Year</th>
              <td className="pb-2 text-left align-top">
                {profile.birthYear} (Age{' '}
                {new Date().getFullYear() - profile.birthYear} Years)
              </td>
            </tr>
          )}
          {profile.additionalInfo?.map((info, index) => (
            <tr key={index} className="grid grid-cols-[40%_60%]">
              <th className="pr-2 pb-2 text-left align-top">
                {info.tableHeading}
              </th>
              <td className="pb-2 text-left align-top">
                <TxtRenderer body={info.tableData} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {profile.socialLinks && (
        <div className="border-t border-t-zinc-200 px-2 pt-3 md:px-3">
          <span className="mb-3 block text-lg">Social Media Links</span>
          <ul className="text-primaryColor mb-5 flex w-fit items-center space-x-4 text-xs">
            {profile.socialLinks?.map((socialLink, index) => (
              <li key={index}>
                <Link
                  href={socialLink.link}
                  rel="nofollow"
                  className="flex flex-col items-center hover:underline"
                  target="_blank"
                >
                  <div
                    className={`mb-1 grid h-[35px] w-[35px] place-content-center rounded-md ${
                      socialLink.name === 'LinkedIn'
                        ? 'bg-[#0077b5]'
                        : socialLink.name === 'Twitter'
                          ? 'bg-[#1da1f2]'
                          : socialLink.name === 'Facebook'
                            ? 'bg-[#4267B2]'
                            : socialLink.name === 'Instagram'
                              ? 'bg-[#C13584]'
                              : socialLink.name === 'YouTube'
                                ? 'bg-[#FF0000]'
                                : 'bg-[#333]'
                    }`}
                  >
                    {socialLink.name === 'LinkedIn' ? (
                      <Icons.linkedinIn className="h-5 text-white" />
                    ) : socialLink.name === 'Twitter' ? (
                      <Icons.twitter className="h-5 text-white" />
                    ) : socialLink.name === 'Facebook' ? (
                      <Icons.facebookF className="h-5 text-white" />
                    ) : socialLink.name === 'Instagram' ? (
                      <Icons.instagram className="h-5 text-white" />
                    ) : socialLink.name === 'YouTube' ? (
                      <Icons.youtube className="h-5 text-white" />
                    ) : (
                      <ExternalLink className="h-5" />
                    )}
                  </div>
                  <span>{socialLink.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {profile.relatedProfiles && (
        <div className="border-t border-t-zinc-200 px-2 pt-3 md:px-3">
          <span className="mb-3 block text-lg">People Are Interested In</span>
          <ul>
            {profile.relatedProfiles?.map((relatedProfile, index) => {
              return (
                <li key={index} className="mb-3 text-sm">
                  <Link
                    href={`/profiles/${relatedProfile.entityType}/${relatedProfile.slug.current}`}
                    target="_blank"
                    className="group w-full"
                  >
                    <span className="block px-4 py-2">
                      <span className="flex">
                        <Image
                          src={
                            urlForImage(relatedProfile.picture)
                              .width(50)
                              .height(50)
                              .url() || '/placeholder.svg'
                          }
                          alt={`${relatedProfile.name}`}
                          className="mr-2 h-[50px] w-[50px] rounded-md"
                          loading="eager"
                          title={relatedProfile.name}
                          height={50}
                          width={50}
                        />
                        <span className="block">
                          <span className="text-md font-bold group-hover:underline">
                            {relatedProfile.name}{' '}
                            <ExternalLink className="text mb-1 inline h-3" />
                          </span>
                          <span className="text-accent-4 line-clamp-2 text-xs">
                            {relatedProfile.description}
                          </span>
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div
        className="cursor-pointer rounded-b-md border-t border-zinc-200 p-2 hover:bg-red-200"
        onClick={() => window.open('https://wa.me/+263717238876', '_blank')}
      >
        <div className="flex items-center justify-center gap-1 rounded-sm border-red-900 text-xs text-red-900">
          <TriangleAlert className="size-3" /> Report Inaccuracy
        </div>
      </div>
    </div>
  );
}
