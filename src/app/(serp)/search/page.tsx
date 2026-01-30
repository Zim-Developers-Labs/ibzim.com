import { redirect } from 'next/navigation';
import SERPageComponents from './_components';
import { Metadata } from 'next';
import { getResultsForQuery } from './_components/actions';
import FailedFetchComponent from './_components/failed-fetch';

type Props = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q, type } = await searchParams;

  if (!q || q.trim() === '') {
    return redirect('/');
  }

  return {
    title: `${q} - IBZIM Search`,
    description: `${type} search results for ${q} on IBZIM.`,
  };
}

export default async function SERPage({ searchParams }: Props) {
  const { q, type } = await searchParams;

  if (!q || q.trim() === '') {
    return redirect('/');
  }

  const searchResults = await getResultsForQuery(q.trim());

  if (!searchResults) {
    return <FailedFetchComponent />;
  }

  return <SERPageComponents q={q} type={type} searchResults={searchResults} />;
}
