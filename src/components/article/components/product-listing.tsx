'use client';

import { urlForImage } from '@/sanity/lib/image';
import type { ArticleType } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

type ProductListingProps = {
  articleProducts: Pick<ArticleType, 'products'>;
};

export default function ProductListing(props: ProductListingProps) {
  const { articleProducts = { products: [] } } = props;
  const products = articleProducts.products;
  const [showAll, setShowAll] = useState(false);

  const initialDisplayCount = 7;

  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  const productsToShow = showAll
    ? products
    : products.slice(0, initialDisplayCount);

  return (
    <div className="py-8">
      <ul className="pb-2">
        {productsToShow.map((product) => {
          const imageUrl =
            product.image &&
            urlForImage(product.image)
              ?.width(1200)
              .height(675)
              .fit('crop')
              .url();
          return (
            <li
              key={product.name}
              className="mb-8 border-b-2 border-dotted border-slate-400 pb-4"
            >
              <div className="flex flex-row-reverse items-center gap-4 md:flex-row">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    height={100}
                    width={100}
                    alt={product.name}
                    className="h-auto w-[50px] rounded-md"
                  />
                )}
                <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
                  <div>
                    <span className="block font-bold">{product.name}</span>
                    <span className="block text-sm">{product.bestFor}</span>
                  </div>
                  <a
                    href={product.link.url}
                    target="_blank"
                    rel={
                      product.link.dofollow ? 'dofollow' : 'noopener nofollow'
                    }
                    className="bg-primaryColor hover:bg-primaryColor block w-[190px] rounded-md py-2 text-center text-sm font-medium text-zinc-900"
                  >
                    {product.link.text}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {products.length > initialDisplayCount && (
        <div
          onClick={() => setShowAll(!showAll)}
          className="text-primaryColor cursor-pointer text-sm font-medium"
        >
          {showAll
            ? 'Show Less'
            : `Show More (${products.length - initialDisplayCount} products)`}
        </div>
      )}
    </div>
  );
}
