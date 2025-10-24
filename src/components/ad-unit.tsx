'use client';

import { env } from '@/env';
import { useEffect } from 'react';

type Props = {
  adSlot: string;
};

const GoogleAdUnit: React.FC<Props> = ({ adSlot }) => {
  useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  if (env.NODE_ENV !== 'production') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 md:p-4">
        Ad Slot: {adSlot}
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={`ca-pub-5335750983677223`}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAdUnit;
