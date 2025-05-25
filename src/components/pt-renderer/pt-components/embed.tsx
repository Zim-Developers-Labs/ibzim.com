import { urlForImage } from '@/sanity/lib/image';
import { TxtRenderer } from '..';
import { Icons } from '@/components/icons';
import Image from 'next/image';

export default function blockEmbed(props: any) {
  if (props?.items[0]?.displayPicture) {
    return <SocialMediaEmbed props={props} />;
  }
  if (props?.items[0]?.figure) {
    return <FigureEmbed props={props} />;
  }

  return null;
}

function FigureEmbed({ props }: { props: any }) {
  const { caption, items } = props;
  const figure = items[0].figure;

  return (
    <div className="md:float-right md:ml-8">
      <figure className="w-full rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm md:max-w-[250px] md:p-6">
        <Image
          src={urlForImage(figure.asset)
            .height(figure.height)
            .width(figure.width)
            .url()}
          alt={figure.alt}
          height={figure.height}
          width={figure.width}
          className="mx-auto rounded-md"
        />
        <figcaption className="mt-4">
          <TxtRenderer body={caption} />
        </figcaption>
      </figure>
    </div>
  );
}

function SocialMediaEmbed({ props }: { props: any }) {
  const { caption, items } = props;
  const figure = items[0].figure;

  return (
    <div className="md:float-right md:ml-8">
      <blockquote className="w-full rounded-md border border-zinc-200 bg-zinc-50 text-sm md:max-w-[250px]">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center">
            <Image
              src={urlForImage(items[0].displayPicture.asset)
                .height(30)
                .width(30)
                .url()}
              alt={items[0].displayPicture.figCaption}
              height={30}
              width={30}
              className="mr-2 rounded-full"
            />
            <div>
              <div>{items[0].displayName}</div>
              <div className="text-xs">{items[0].subTitle}</div>
            </div>
          </div>
          <div>
            {props.items[0].platform == 'twitter' && (
              <Icons.twitter
                className="size-5 text-[#1DA1F2]"
                style={{ color: '#1DA1F2' }}
              />
            )}
          </div>
        </div>
        <figure className="p-4 md:p-6">
          <Image
            src={urlForImage(figure.asset)
              .height(figure.height)
              .width(figure.width)
              .url()}
            alt={figure.alt}
            height={figure.height}
            width={figure.width}
            className="mx-auto rounded-md"
          />
          <figcaption className="mt-4">
            <TxtRenderer body={caption} />
          </figcaption>
        </figure>
      </blockquote>
    </div>
  );
}
