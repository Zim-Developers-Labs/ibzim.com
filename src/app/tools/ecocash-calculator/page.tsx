import EcoCashCalculatorClient from './EcocashCalculatorClient';

//
export const metadata = {
  title: 'EcoCash Calculator (USD) | IBZim',
  description: 'Calculate EcoCash USD transaction fees and charges for various amounts for Registered Customers.',
  keywords: 'EcoCash, USD, calculator, Zimbabwe, fees, charges, transaction, registered customer, IMT tax'
};

export default async function EcoCashCalculatorPage() {
  // Potentially fetch server-side data here in the future
  // ...

  return (
    // Render the client component
    <EcoCashCalculatorClient />
  );
}