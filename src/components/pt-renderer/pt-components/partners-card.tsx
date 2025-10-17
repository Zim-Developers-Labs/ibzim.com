import { urlForImage } from '@/lib/sanity/image';
import { CircleCheck, ExternalLink, Info } from 'lucide-react';
import Image from 'next/image';

function Display51({ partner = {} }: any) {
  return (
    <div>
      <div className="text-accent-6 mb-4 text-center font-bold">
        {partner.name}
      </div>
      {partner.image && (
        <Image
          src={urlForImage(partner.image)!
            .width(250)
            .height(50)
            .fit('crop')
            .auto('format')
            .url()}
          alt={`${partner.name} Logo`}
          className="mx-auto mb-4 h-auto w-full rounded-full"
          loading="lazy"
          title={partner.name}
          height={50}
          width={250}
        />
      )}
      <a
        href={partner.link}
        target="_blank"
        rel="nofollow"
        className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-md bg-gradient-to-tr from-teal-400 via-teal-700 to-teal-400 py-2 text-white shadow-lg hover:bg-gradient-to-tl"
      >
        Learn More
        <ExternalLink className="ml-2 inline-block w-4" />
      </a>
    </div>
  );
}

function Display11({ partner }: any) {
  return (
    <div className="flex items-center justify-between gap-4">
      {partner.image && (
        <Image
          src={urlForImage(partner.image)!
            .width(100)
            .height(100)
            .fit('crop')
            .auto('format')
            .url()}
          alt={`${partner.name} Logo`}
          className="mx-auto mb-4 h-[100px] w-[100px]"
          loading="lazy"
          title={partner.name}
          height={100}
          width={100}
        />
      )}
      <div className="flex flex-col items-end">
        <div className="text-accent-6 mb-4 line-clamp-1 text-center text-sm font-bold">
          {partner.name}
        </div>

        <a
          href={partner.link}
          target="_blank"
          rel="nofollow"
          className="mb-4 flex w-fit cursor-pointer items-center justify-center rounded-md bg-gradient-to-tr from-teal-400 via-teal-700 to-teal-400 px-2 py-2 text-sm text-white shadow-lg hover:bg-gradient-to-tl"
        >
          Learn More{' '}
          <span className="sr-only" aria-hidden="true">
            About {partner.name}
          </span>
          <ExternalLink className="ml-2 inline-block w-4" />
        </a>
      </div>
    </div>
  );
}

export default function blockPartnersCard(props: any) {
  const { partners } = props;

  return (
    <div className="mb-4 rounded-md bg-zinc-100 p-2">
      <div className="flex w-full items-center justify-between">
        <div></div>
        <div className="mx-auto">
          <span className="text-sm">Tino&#39;s Top Picks</span>
          <Info className="ml-1 inline-block w-4" />
        </div>
      </div>
      <div className="custom-scrollbar-h overflow-x-auto">
        <ul className="mx-auto flex w-fit flex-col space-y-4 py-2 lg:flex-row lg:space-y-0 lg:space-x-4">
          {partners.map((partner: any, index: any) => (
            <li
              key={index}
              className="mx-auto w-full rounded-md border border-zinc-300 bg-white p-4 md:max-w-[300px] lg:h-[350px] lg:w-[300px]"
            >
              {partner.imageRatio === '1x1' ? (
                <Display11 partner={partner} />
              ) : (
                <Display51 partner={partner} />
              )}
              <div className="text-accent-6 flex justify-between border-zinc-300 pb-2 text-sm lg:border-b">
                <div>Starting Price in Zimbabwe</div>
                <div className="font-bold">{partner.startingPrice}</div>
              </div>
              <ul className="hidden text-sm text-zinc-600 lg:block">
                {partner.features.map((feature: any, index: any) => (
                  <li key={index} className="flex justify-between py-2">
                    <div>{feature}</div>
                    <CircleCheck className="mr-2 inline-block w-4 text-green-700" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
