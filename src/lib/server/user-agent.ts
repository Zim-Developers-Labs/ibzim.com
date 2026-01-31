/**
 * Parse user agent string to extract device and browser information
 */

import { UAParser } from 'ua-parser-js';

export default function parseUserAgent(userAgent: string): {
  deviceType: string;
  deviceName: string;
  browserName: string;
  browserVersion: string;
} {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let deviceType = 'desktop';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  }

  // Get device name
  let deviceName = 'Unknown Device';
  if (result.device.vendor && result.device.model) {
    deviceName = `${result.device.vendor} ${result.device.model}`;
  } else if (result.os.name) {
    if (deviceType === 'mobile') {
      deviceName = `${result.os.name} Phone`;
    } else if (deviceType === 'tablet') {
      deviceName = `${result.os.name} Tablet`;
    } else {
      deviceName =
        `${result.os.name} ${result.os.version || ''}`.trim() || 'Desktop';
    }
  }

  // Get browser info
  const browserName = result.browser.name || 'Unknown';
  const browserVersion = result.browser.version?.split('.')[0] || '';

  return { deviceType, deviceName, browserName, browserVersion };
}
