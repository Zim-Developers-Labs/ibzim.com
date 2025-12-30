import { convertToSlug } from '@/lib/utils';
import type { ArticleType, ProfileType } from '@/types';
import { LinkIcon } from 'lucide-react';
import type { PortableTextBlock } from 'sanity';

interface ProcessedHeading {
  href: string;
  text: string;
}

function filterHeadings(
  richText?: PortableTextBlock[] | null,
): ProcessedHeading[] {
  if (!Array.isArray(richText)) return [];

  return richText.reduce<ProcessedHeading[]>((headings, block) => {
    //  @ts-expect-error -- type error
    if (block._type !== 'block' || !block.style?.startsWith('h')) {
      return headings;
    }
    const text = block.children
      //  @ts-expect-error -- type error
      ?.map((child: any) => child.text)
      .join('')
      .trim();
    if (!text) return headings;
    const slug = convertToSlug(text);
    headings.push({ href: `#${slug}`, text });
    return headings;
  }, []);
}

export default function TblContents({ profile }: { profile: ProfileType }) {
  if (profile.tblContentsType == 'manual') {
    const subHeadings = profile.subHeadings;
    return (
      <div className="mb-5 w-full rounded-md border border-zinc-200 bg-zinc-50 text-sm md:max-w-[250px]">
        <span className="mb-3 block border-b border-zinc-300 p-3 text-center text-lg font-[500] md:py-5">
          Table of Contents
        </span>
        <div className="p-4 md:p-8">
          <nav id="tbl_contents">
            {subHeadings?.map((subHeading, index: any) => (
              <a
                key={index}
                href={`#${convertToSlug(subHeading.title)}`}
                className="line hover:text-primaryColor mb-4 flex items-center text-sm text-[15px]"
              >
                {subHeading.type === 'h2' && (
                  <div className="mr-2 h-4 w-4">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                )}

                {subHeading.type === 'h3' && (
                  <>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </>
                )}
                {subHeading.type === 'h4' && (
                  <>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </>
                )}

                <span>{subHeading.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  const headings = filterHeadings(profile.body as PortableTextBlock[]);
  if (!headings.length) return null;

  return (
    <div className="mb-5 w-full rounded-md border border-zinc-200 bg-zinc-50 text-sm md:max-w-[250px]">
      <span className="mb-3 block border-b border-zinc-300 p-3 text-center text-lg font-[500] md:py-5">
        Table of Contents
      </span>
      <div className="p-4 md:p-8">
        <nav id="tbl_contents">
          {headings.map((heading, index) => (
            <a
              key={index}
              href={heading.href}
              className="line hover:text-primaryColor mb-4 flex items-center text-sm text-[15px]"
            >
              <span className="mr-2 h-4 w-4">
                <LinkIcon className="h-4 w-4" />
              </span>
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function ArticleTblContents({ article }: { article: ArticleType }) {
  if (article.tblContentsType == 'manual') {
    const subHeadings = article.subHeadings;
    return (
      <div className="mb-5 w-full rounded-md border border-zinc-200 bg-zinc-50 text-sm">
        <span className="mb-3 block border-b border-zinc-300 p-3 text-center text-lg font-[500] md:py-5">
          Table of Contents
        </span>
        <div className="p-4 md:p-8">
          <nav id="tbl_contents">
            {subHeadings?.map((subHeading, index: any) => (
              <a
                key={index}
                href={`#${convertToSlug(subHeading.title)}`}
                className="line hover:text-primaryColor mb-4 flex items-center text-sm text-[15px]"
              >
                {subHeading.type === 'h2' && (
                  <div className="mr-2 h-4 w-4">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                )}

                {subHeading.type === 'h3' && (
                  <>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </>
                )}
                {subHeading.type === 'h4' && (
                  <>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </>
                )}

                <span>{subHeading.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  const headings = filterHeadings(article.body as PortableTextBlock[]);
  if (!headings.length) return null;

  return (
    <div className="mb-5 w-full rounded-md border border-zinc-200 bg-zinc-50 text-sm">
      <span className="mb-3 block border-b border-zinc-300 p-3 text-center text-lg font-[500] md:py-5">
        Table of Contents
      </span>
      <div className="p-4 md:p-8">
        <nav id="tbl_contents">
          {headings.map((heading, index) => (
            <a
              key={index}
              href={heading.href}
              className="line hover:text-primaryColor mb-4 flex items-center text-sm text-[15px]"
            >
              <span className="mr-2 h-4 w-4">
                <LinkIcon className="h-4 w-4" />
              </span>
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
