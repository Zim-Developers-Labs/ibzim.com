import { createClient } from 'next-sanity';
import { MeiliSearch } from 'meilisearch';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// 1. Configure Sanity Client
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-01-26',
  perspective: 'published',
  useCdn: false, // We want fresh data
});

// 2. Configure Meilisearch Client
const meili = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_ADMIN_API_KEY, // use admin key for seeding (get through postman or Meili dashboard)
});

const index = meili.index('ibzim_content');

async function seed() {
  console.log('Fetching data from Sanity...');

  // GROQ Query: Get titles, slugs, and convert body text to plain string
  const query = `*[_type in ["article", "news", "profile"] && !(_id in path("drafts.**"))] {
    "id": _id,
    title,
    "slug": slug.current,
    "type": _type,
    "excerpt": pt::text(body)[0..200], // Grab first 200 chars of body
    "image": seo.image.asset->url
  }`;

  const documents = await sanity.fetch(query);

  console.log(`Found ${documents.length} documents. Indexing...`);

  // 3. Upload to Meilisearch
  await index.addDocuments(documents);

  // 4. Set Searchable Attributes (Optional but recommended)
  await index.updateSearchableAttributes(['title', 'excerpt', 'type']);
  await index.updateFilterableAttributes(['type']);

  console.log('Done! Check localhost:7700 to see your data.');
}

seed();
