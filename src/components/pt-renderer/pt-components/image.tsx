import { urlForImage } from '@/lib/sanity/image';
import Image from 'next/image';

export default function imageModule(props: any) {
  const { alt = '', image = {}, imageCredits = '', imageHeight = 675 } = props;

  const imageUrl =
    image &&
    urlForImage(image)?.width(1200).height(imageHeight).fit('crop').url();

  return (
    <div className="mb-4">
      <div className="mb-1 block rounded-xl">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt}
            className="h-auto w-full rounded-xl"
            loading="lazy"
            title={alt}
            height={imageHeight}
            width={1200}
          />
        )}
      </div>
      {imageCredits && (
        <small className="text-zinc-600">
          {'('}Image Credit: {imageCredits}
          {')'}
        </small>
      )}
    </div>
  );
}
