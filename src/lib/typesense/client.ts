/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the master API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */

import { env } from '@/env';
import Typesense from 'typesense';

const client = new Typesense.Client({
  nodes: [
    {
      host: env.NEXT_PUBLIC_TYPESENSE_HOST,
      port: env.TYPESENSE_PORT,
      protocol: env.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

export const typesenseSearchIndex = client.collections('search_index');
export const typesensePredictionsIndex = client.collections('keywords_index');
