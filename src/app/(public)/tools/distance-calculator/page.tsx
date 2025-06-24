import { validateRequest } from '@/lib/auth/validate-request';
import DistanceCalculatorWrapper from './wrapper';

export default async function DistanceCalculatorPage() {
  const { user } = await validateRequest();

  return <DistanceCalculatorWrapper user={user} />;
}
