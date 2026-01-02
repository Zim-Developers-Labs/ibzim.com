export const APP_TITLE = 'IBZIM';
export const DATABASE_PREFIX = 'ibzim';
export const TEST_DB_PREFIX = 'test_ibzim';
export const EMAIL_SENDER = '"IBZIM" <noreply@ibzim.com>';

export const domainUrls = [
  {
    production: 'https://advertise.ibzim.com',
    development: 'http://localhost:3001',
  },
  {
    production: 'https://help.ibzim.com',
    development: 'http://localhost:3002',
  },
  {
    production: 'https://help.ibzim.com/docs/earn-online/getting-started',
    development: 'http://localhost:3003',
  },
  {
    production: 'https://www.ibzim.com',
    development: 'http://localhost:3004',
  },
  {
    production: 'https://myaccount.ibzim.com',
    development: 'http://localhost:3005',
  },
  {
    production: 'https://auth.ibzim.com',
    development: 'http://localhost:3006',
  },
  {
    production: 'https://admin.ibzim.com',
    development: 'http://localhost:3007',
  },
  {
    production: 'https://help.ibzim.com/docs/music-billboard',
    development: 'http://localhost:3008',
  },
  {
    production: 'https://partners.ibzim.com',
    development: 'http://localhost:3009',
  },
  {
    production: 'https://policies.ibzim.com',
    development: 'http://localhost:3010',
  },
  {
    production: 'https://dsar.ibzim.com',
    development: 'http://localhost:3011',
  },
  {
    production: 'https://www.peyapeya.com',
    development: 'http://localhost:4000',
  },
];

export function getDomainUrl(index: number): string {
  const domain = domainUrls[index];
  if (!domain) {
    throw new Error(`Domain at index ${index} not found`);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? domain.production : domain.development;
}

export const DOMAIN_URLS = {
  ADVERTISE: () => getDomainUrl(0),
  DOCS: () => getDomainUrl(1),
  EARN: () => getDomainUrl(2),
  MAIN: () => getDomainUrl(3),
  ACCOUNT: () => getDomainUrl(4),
  AUTH: () => getDomainUrl(5),
  ADMIN: () => getDomainUrl(6),
  BILLBOARD: () => getDomainUrl(7),
  PARTNERS: () => getDomainUrl(8),
  POLICIES: () => getDomainUrl(9),
  DSAR: () => getDomainUrl(10),
  PEYA_CHECKOUT: () => getDomainUrl(11),
} as const;
