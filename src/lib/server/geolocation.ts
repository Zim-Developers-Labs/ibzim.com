'use server';

interface GeolocationData {
  city: string;
  country_name: string;
  country_code: string;
}

export async function getLocationFromIP(
  ipAddress: string,
): Promise<string | null> {
  try {
    // Using ipapi.co (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);

    if (!response.ok) {
      return null;
    }

    const data: GeolocationData = await response.json();

    // Format as "City, Country"
    if (data.city && data.country_name) {
      return `${data.city}, ${data.country_name}`;
    }

    return data.country_name || null;
  } catch (error) {
    console.error('Failed to fetch location:', error);
    return null;
  }
}
