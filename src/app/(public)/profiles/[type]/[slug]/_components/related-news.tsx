import { urlForImage } from '@/lib/sanity/image';
import { RelatedNewsItem } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function RelatedNewsGrid({ news }: { news: RelatedNewsItem[] }) {
  return (
    <section className="mt-16 border-t py-12">
      <h2 className="mb-6 text-lg font-semibold">Related News</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {news.slice(0, 4).map((item) => (
          <Link
            key={item.slug.current}
            href={`/news/${item.industry.slug}/${item.slug.current}`}
            className="group"
          >
            <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
              <Image
                src={
                  urlForImage(item.mainImage).width(1200).height(675).url() ||
                  '/placeholder.svg'
                }
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-muted-foreground text-xs tracking-wide uppercase">
              {item.industry.slug}
            </span>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium group-hover:underline">
              {item.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
