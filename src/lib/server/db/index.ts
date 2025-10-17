import { drizzleClientHttp } from './drizzle-client';

// Export the configured database instance with schema
export const db = drizzleClientHttp;

// Export all schema tables and types
export * from './schema';
