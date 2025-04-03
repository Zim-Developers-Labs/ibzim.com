import { urlForImage } from '@/lib/sanity/image';

export default function imageCarouselModule(props: any) {
  const { images = [], imageCredits = '' } = props;

  return (
    <div className="mb-4">
      {/* // ! Image Carousel */}
      {imageCredits && (
        <small className="text-accent-5 mx-auto mt-4 block w-fit">
          {'('}Image Credit: {imageCredits}
          {')'}
        </small>
      )}
    </div>
  );
}
