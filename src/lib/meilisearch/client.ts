import { MeiliSearch } from 'meilisearch';
import { env } from '@/env';

const client = new MeiliSearch({
  host: env.MEILI_HOST || 'http://localhost:7700',
  apiKey: env.MEILI_API_KEY,
});

export const meiliSearchIndex = client.index('ibzim_content');
