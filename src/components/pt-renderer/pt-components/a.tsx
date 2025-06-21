import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { urlForImage } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export default function annotationLink(props: any) {
  const { url = '', dofollow, children } = props;
  return (
    <a
      href={url}
      rel={dofollow ? 'dofollow' : 'nofollow'}
      target="_blank"
      className="text-primaryColor inline hover:underline"
    >
      {children}
    </a>
  );
}

export function annotationInternalLink(props: any) {
  const { internalPage, children } = props;
  const url =
    internalPage._type == 'article'
      ? `/${internalPage.industry.slug}/${internalPage.type}/${internalPage.slug.current}`
      : `/profiles/${internalPage.entityType}/${internalPage.slug.current}`;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={url} className="text-primaryColor inline hover:underline">
          {children}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit max-w-[250px] p-0 md:p-0">
        <a href={url} aria-hidden="true">
          <span className="block">
            <Image
              src={urlForImage(
                internalPage._type == 'article'
                  ? internalPage.seo.image
                  : internalPage.picture,
              )
                .width(280)
                .height(158)
                .url()}
              alt={internalPage.name}
              className="h-auto w-full rounded-t-lg"
              loading="eager"
              title={internalPage.name}
              height={157.5}
              width={280}
            />
          </span>
          <span className="block p-4">
            <span className="hover:text-primaryColor text-lg font-semibold">
              {internalPage.name}
            </span>
            <span className="mt-2">
              <span className="text-accent-4 line-clamp-3 text-sm">
                {internalPage.seo.description}
              </span>
              <span className="mt-2 flex justify-end">
                <span className="text-primaryColor hover:text-opacity-90 text-sm font-medium">
                  Read more
                </span>
              </span>
            </span>
          </span>
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}
