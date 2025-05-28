import ZesaCalculatorClient from './ZesaCalculatorClient';

export const metadata = {
  title: 'ZESA Calculator (Units to ZiG) | IBZim',
  description: 'Calculate ZESA electricity cost based on units consumed in Zimbabwe.',
  keywords: 'ZESA, electricity, calculator, units, ZiG, Zimbabwe, power, cost, tariff'
};

export default async function ZesaCalculatorPage() {
  // Future server-side data fetching or logic here

  return (
    <ZesaCalculatorClient />
  );
}

