import * as dotenv from 'dotenv';
import Typesense from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

// 1. Load environment variables
dotenv.config({ path: '.env.local' });

// 2. Configure Typesense Client (More robust config)
const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
      port: Number(process.env.TYPESENSE_PORT) || 8108, // Standard local port is 8108
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 10,
});

const COLLECTION_NAME = 'keywords_index';

const keywordsSchema: CollectionCreateSchema = {
  name: COLLECTION_NAME,
  fields: [
    { name: 'term', type: 'string' },
    { name: 'volume', type: 'int32' },
  ],
  default_sorting_field: 'volume',
};

// Data Preparation
const allKeywords = [
  { term: 'typesense search', volume: 1200 },
  { term: 'nextjs tutorial', volume: 5400 },
  { term: 'react hooks', volume: 3200 },
  { term: 'search engine optimization', volume: 900 },
  { term: 'typescript basics', volume: 2100 },
  { term: 'web development trends', volume: 450 },
];

async function main() {
  try {
    // 3. Clean Slate Strategy: Delete if exists, then create.
    // This ensures your schema is always up to date with the code.
    try {
      console.log(
        `🗑️  Attempting to delete existing collection: ${COLLECTION_NAME}`,
      );
      await client.collections(COLLECTION_NAME).delete();
      console.log(`🗑️  Deleted existing collection: ${COLLECTION_NAME}`);
    } catch (error) {
      // Ignore 404 error if collection doesn't exist yet
    }

    // 4. Create Collection
    await client.collections().create(keywordsSchema);
    console.log(`✅ Collection created: ${COLLECTION_NAME}`);

    // 5. Seed Data
    const returnData = await client
      .collections(COLLECTION_NAME)
      .documents()
      .import(allKeywords, { action: 'create' }); // 'create' is faster/safer since we just wiped the collection

    // 6. Report Results
    const failedItems = returnData.filter((item) => item.success === false);

    if (failedItems.length > 0) {
      console.error('⚠️  Some items failed to import:', failedItems);
    } else {
      console.log(`🚀 Successfully seeded ${returnData.length} keywords.`);
    }

    process.exit(0); // Success exit
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1); // Error exit
  }
}

// Execute Main
main();
