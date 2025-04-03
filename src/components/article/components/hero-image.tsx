import { urlForImage } from '@/lib/sanity/image';

export default function HeroImage(props: any) {
  const { alt, image, imageCredits } = props;

  const imageUrl =
    image && urlForImage(image)?.width(800).height(450).fit('crop').url();

  return (
    <div className="my-8 rounded-lg border border-gray-200 p-2 md:p-8">
      <div className="mb-1 block rounded-xl">
        {image && (
          <img
            src={imageUrl}
            alt={alt}
            className="h-auto w-full rounded-xl shadow-xl"
            decoding="sync"
            title={alt}
            height={450}
            width={800}
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
