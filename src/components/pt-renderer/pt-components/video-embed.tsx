{
  /* 
  
  previously used next video
  npx next-video sync

    // package.json
  "scripts": {
    "dev": "next dev & npx next-video sync -w",
  },
  
*/
}

import Video from 'next-video';

export default function VideoEmbed({
  status,
  provider,
  providerMetadata,
  createdAt,
  updatedAt,
  size,
  sources,
  poster,
  blurDataURL,
}: any) {
  return (
    <div className="relative my-10 aspect-video h-fit w-full overflow-hidden rounded-lg">
      <Video
        src={{
          status,
          provider,
          providerMetadata,
          createdAt,
          updatedAt,
          size,
          sources,
          poster,
          blurDataURL,
          originalFilePath: '',
        }}
      />
    </div>
  );
}
