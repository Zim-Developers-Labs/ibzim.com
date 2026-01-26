# Phase 1: Install & Run Meilisearch (Windows)

1. Download Millisearch (meilisearch-windows-amd64.exe)

https://github.com/meilisearch/meilisearch/releases

2. Run:

- Create a folder named meilisearch on your Desktop or C: drive.
- Move the downloaded .exe file into this folder.
- Rename the file to just meilisearch.exe (to make it easier to type).
- Open PowerShell or Command Prompt inside this folder (Shift + Right Click in the folder > "Open PowerShell window here").
- Run this command:

```bash
./meilisearch.exe --master-key="masterKey"
```

- copy generated api key and rerun command with key

```bash
./meilisearch.exe --master-key="generatedMasterkey"
```

3. Verify:

- Open your browser and go to http://localhost:7700.
- You should see a web interface asking for a key. Enter masterKey.
- Success! Your search engine is live locally.

# Phase 2: Feed Data from Sanity to Meilisearch

1. Install Dependencies: In your Next.js project terminal, run:

```bash
npm install meilisearch @sanity/client dotenv
```

1. Create the Script: Create a file in your src/scripts folder called `seed-search.ts`.

```ts
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
  host: 'http://localhost:7700',
  apiKey: process.env.MEILI_API_KEY, // Must match what you ran in PowerShell
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
```

3. Add to your `package.json`

```json
"seed:search": "tsx src/scripts/seed-search.ts",
```

4. Run the Script: Make sure your .env.local has your Sanity Project ID. Then run:

```bash
pnpm seed:search
```

## Phase 3: The Next.js Search Bar

Now we build the frontend component that searches as you type.
