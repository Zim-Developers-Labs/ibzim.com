import { redirect } from 'next/navigation';
import SERPageComponents from './_components';

export default async function SERPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q || q.trim() === '') {
    return redirect('/');
  }

  return <SERPageComponents q={q} />;
}
