import { validateRequest } from '@/lib/auth/validate-request';
import DistanceCalculatorWrapper from './wrapper';
import { getAllToolAnswers } from '../actions';

export default async function DistanceCalculatorPage() {
  const { user } = await validateRequest();
  const dbAnswers = await getAllToolAnswers('distance-calculator');

  return <DistanceCalculatorWrapper user={user} dbAnswers={dbAnswers} />;
}
