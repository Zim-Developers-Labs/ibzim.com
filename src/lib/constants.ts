export const APP_TITLE = 'IBZIM';
export const DATABASE_PREFIX = 'ibzim';
export const TEST_DB_PREFIX = 'test_ibzim';
export const EMAIL_SENDER = '"IBZIM" <noreply@ibzim.com>';

export const WHATSAPP_SENDER = '+263717238876';

export const devConString =
  'postgres://postgres:postgres@db.localtest.me:5432/main';

export enum Paths {
  Home = '/',
  Login = '/sign-in',
  Signup = '/sign-up',
  VerifyEmail = '/verify-email',
  ResetPassword = '/reset-password',
}

export const domainUrls = [
  {
    production: 'https://www.ibzim.com',
    development: 'http://localhost:3001',
  },
  {
    production: 'https://admin.ibzim.com',
    development: 'http://localhost:3002',
  },
  {
    production: 'https://help.ibzim.com',
    development: 'http://localhost:3003',
  },
  {
    production: 'https://earn.ibzim.com',
    development: 'http://localhost:3004',
  },
  {
    production: 'https://advertise.ibzim.com',
    development: 'http://localhost:3005',
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
  MAIN: () => getDomainUrl(0),
  ADMIN: () => getDomainUrl(1),
  HELP: () => getDomainUrl(2),
  EARN: () => getDomainUrl(3),
  ADVERTISE: () => getDomainUrl(4),
  PEYA_CHECKOUT: () => getDomainUrl(5),
} as const;
