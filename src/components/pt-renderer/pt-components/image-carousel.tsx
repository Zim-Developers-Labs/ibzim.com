import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { urlForImage } from '@/lib/sanity/image';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function imageCarouselModule(props: any) {
  const { images = [], imageCredits = '' } = props;

  if (!images.length) return null;

  return (
    <div className="mb-4">
      {/* Main Image Carousel */}
      <Tabs defaultValue="0" className="w-full">
        {images.map((image: any, index: number) => (
          <TabsContent key={index} value={index.toString()} className="mt-0">
            <div className="relative h-fit w-full">
              <Image
                alt={image.alt}
                src={urlForImage(image.image)!.width(1200).height(675).url()}
                className="h-auto w-full rounded-md"
                height={675}
                width={1200}
              />
            </div>
            {/* Thumbnail Navigation */}
            <TabsList className="mt-4 flex h-auto w-full justify-start gap-2 overflow-x-auto bg-transparent p-1">
              {images.map((image: any, index: any) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className={cn(
                    'data-[state=active]:border-primary relative h-20 w-32 overflow-hidden rounded-md border-2 p-0',
                  )}
                >
                  <Image
                    alt={image.alt}
                    src={urlForImage(image.image)!
                      .width(1200)
                      .height(675)
                      .url()}
                    fill
                    className="object-cover"
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </TabsContent>
        ))}
      </Tabs>
      {imageCredits && (
        <small className="text-accent-5 mx-auto mt-4 block w-fit">
          {'('}Image Credit: {imageCredits}
          {')'}
        </small>
      )}
    </div>
  );
}
