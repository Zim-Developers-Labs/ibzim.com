import UsdZwlConverterClient from './UsdZwlConverterClient';

export const metadata = {
  title: 'USD to ZiG Converter | IBZim',
  description: 'Real-time currency conversion tool for pricing goods/services between USD and ZiG.',
  keywords: 'USD, ZiG, converter, currency, Zimbabwe, exchange rate, parallel market, official rate'
};

export default async function UsdZwlConverterPage() {


  return (
    <UsdZwlConverterClient />
  );
}
