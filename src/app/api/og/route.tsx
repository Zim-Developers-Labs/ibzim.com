import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

import { height, OpenGraphImage, width } from './OpenGraphImage';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const inter = fetch(
    new URL('../../../../public/Inter-Bold.woff', import.meta.url),
  ).then((res) => res.arrayBuffer());
  const bevan = fetch(
    new URL('../../../lib/fonts/Bevan-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());
  const { searchParams } = new URL(req.url);

  const numberOfDiscussions = searchParams.get('numberOfDiscussions');
  const averageRating = searchParams.get('averageRating');
  const totalReviews = searchParams.get('totalReviews');
  let imageUrl = searchParams.get('imageUrl');

  if (!imageUrl) imageUrl = 'https://ibzim.com/og-image.png';

  return new ImageResponse(
    (
      <OpenGraphImage
        imageUrl={imageUrl}
        numberOfDiscussions={numberOfDiscussions}
        reviews={
          averageRating && totalReviews
            ? {
                averageRating,
                totalReviews,
              }
            : null
        }
      />
    ),
    {
      width,
      height,
      fonts: [
        {
          name: 'Inter',
          data: await inter,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Bevan',
          data: await bevan,
          style: 'normal',
          weight: 900,
        },
      ],
    },
  );
}
