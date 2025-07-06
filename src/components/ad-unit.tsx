import Script from 'next/script';

type Props = {
  adSlot: string;
};

const GoogleAdUnit: React.FC<Props> = ({ adSlot }) => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const pId = process.env.P_ID;

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Ad unity */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        // @ts-expect-error -- due to unknown properties in TypeScript
        dataAdClient={`ca-pub-${pId}`}
        dataAdSlot={adSlot}
        dataAdFormat="auto"
        dataFullWidthResponsive="true"
      />
      <Script id="adsbygoogle" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  );
};

export default GoogleAdUnit;
