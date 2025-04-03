import { urlForImage } from '@/lib/sanity/image';
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
    <span className="group relative inline">
      <span className="text-primaryColor hover:text-opacity-90 inline">
        {children}
      </span>
      {/* Article Preview On Link Hover */}
      <Suspense fallback={'...Loading'}>
        <span className="absolute z-50 -mt-4 hidden h-fit w-fit bg-transparent pt-4 transition-all group-hover:block sm:left-0">
          <a
            href={url}
            className="block h-fit w-[250px] bg-white"
            aria-hidden="true"
          >
            <span className="block rounded-lg border border-zinc-200 shadow-2xl">
              <span className="block">
                <img
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
            </span>
          </a>
        </span>
      </Suspense>
    </span>
  );
}
