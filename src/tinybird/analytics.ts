'use server';

import { env } from '@/env';

export async function logSearch(
  search_id: string,
  query: string,
  user_id: number | null,
  results: [number, string][],
  detailedDeviceData: {
    device_type: string | null;
    browser_name: string | null;
    browser_version: string | null;
    os_name: string | null;
    location: string | null;
  },
) {
  const endpoint = `${env.TINYBIRD_HOST}/v0/events?name=all_searches`;

  const payload = {
    search_id: search_id,
    search_query: query,
    user_id: String(user_id ?? 'anonymous'),
    timestamp: new Date().toISOString(),
    shown_results: results,
    device_type: detailedDeviceData.device_type,
    browser_name: detailedDeviceData.browser_name,
    browser_version: detailedDeviceData.browser_version,
    os_name: detailedDeviceData.os_name,
    location: detailedDeviceData.location,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${env.TINYBIRD_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // Fetch doesn't throw on 4xx/5xx errors, so we check manually
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Tinybird] Failed to log event: ${response.status} ${response.statusText}`,
        errorText,
      );
    }
  } catch (error) {
    // Catch network errors or JSON stringify errors
    // We log it to the server console but DO NOT re-throw
    // to avoid breaking the user's search experience.
    console.error('[Tinybird] Network/Logging error:', error);
  }
}

export async function logLinkClick(
  searchId: string,
  resultUrl: string,
  position: number,
) {
  const endpoint = `${env.TINYBIRD_HOST}/v0/events?name=search_clicks`;

  const payload = {
    search_id: searchId,
    clicked_url: resultUrl,
    position: position,
    timestamp: new Date().toISOString(),
  };
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${env.TINYBIRD_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    // Fetch doesn't throw on 4xx/5xx errors, so we check manually
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Tinybird] Failed to log link click: ${response.status} ${response.statusText}`,
        errorText,
      );
    }
  } catch (error) {
    // Catch network errors or JSON stringify errors
    // We log it to the server console but DO NOT re-throw
    // to avoid breaking the user's experience.
    console.error('[Tinybird] Network/Logging error:', error);
  }
}
