import { redirect } from 'next/navigation';
import SERPageComponents from './_components';
import { Metadata } from 'next';
import { getResultsForQuery } from './_components/actions';
import FailedFetchComponent from './_components/failed-fetch';
import { logSearch } from '@/tinybird/analytics';
import { getCurrentSession } from '@/lib/server/session';
import { after } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { headers } from 'next/headers';
import { getLocationFromIP } from '@/lib/server/geolocation';
import parseUserAgent from '@/lib/server/user-agent';

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

  const { user } = await getCurrentSession();

  const searchId = uuidv4();

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  after(async () => {
    const { deviceType, deviceName, browserName, browserVersion } =
      parseUserAgent(userAgent);

    // location

    let ipAddress =
      headersList.get('x-forwarded-for') || headersList.get('x-real-ip');

    if (ipAddress === '::1') {
      ipAddress = '197.221.251.116';
    }

    const location = ipAddress ? await getLocationFromIP(ipAddress) : 'unknown';

    const detailedDeviceData = {
      device_type: deviceType,
      browser_name: browserName,
      browser_version: browserVersion,
      os_name: deviceName,
      location: location || 'unknown',
    };

    const formattedResults: [number, string][] = searchResults.entries
      .slice(0, 20)
      .map((entry, index) => [index + 1, entry.url]);

    logSearch(
      searchId,
      q.trim(),
      user ? user.id : null,
      formattedResults,
      detailedDeviceData,
    );
  });

  return (
    <SERPageComponents
      q={q}
      type={type}
      searchResults={searchResults}
      searchId={searchId}
    />
  );
}
