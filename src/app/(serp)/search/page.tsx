import { redirect } from 'next/navigation';
import SERPageComponents from './_components';
import { Metadata } from 'next';
import { getResultsForQuery } from './_components/actions';
import FailedFetchComponent from './_components/failed-fetch';
import { v4 as uuidv4 } from 'uuid';

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

  const searchId = uuidv4();

  return (
    <SERPageComponents
      q={q}
      type={type}
      searchResults={searchResults}
      searchId={searchId}
    />
  );
}
