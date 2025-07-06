'use client';

import { useEffect } from 'react';

type Props = {
  adSlot: string;
};

const GoogleAdUnit: React.FC<Props> = ({ adSlot }) => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

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
