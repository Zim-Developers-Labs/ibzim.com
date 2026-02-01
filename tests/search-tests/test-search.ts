import { SearchIndexEntry } from '@/types';
import fs from 'fs';
import path from 'path';
import Typesense from 'typesense';

const client = new Typesense.Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz',
  connectionTimeoutSeconds: 20,
});

const typesenseSearchIndex = client.collections('search_index');

interface FetchAllEntriesResult {
  entries: SearchIndexEntry[];
  timeTaken: number;
}

async function getResultsForQuery(
  query: string,
): Promise<FetchAllEntriesResult | null> {
  try {
    const searchResults = await typesenseSearchIndex.documents().search({
      q: query,
      query_by: 'name,description,content,embedding',
      prefix: 'true,true,false,false',
      query_by_weights: '4,1,2,1',
      prioritize_exact_match: true,
      per_page: 66,
      page: 1,
    });

    const hits = searchResults.hits || [];
    const timeTaken = searchResults.search_time_ms || 0;

    // Map the documents
    const entries: SearchIndexEntry[] = hits.map(
      (hit) => hit.document as SearchIndexEntry,
    );
    1;
    return {
      entries: entries,
      timeTaken: timeTaken,
    };
  } catch (error) {
    console.error('Typesense search error:', error);
    return null;
  }
}

// --- Types based on your JSON structure ---
type TestType =
  | 'exact_rank_1'
  | 'zero_results'
  | 'zero_or_local_context'
  | 'contains_relevant'
  | 'fuzzy_match';

interface TestCase {
  query: string;
  type: TestType;
  expectedKeywords?: string[];
  forbiddenKeywords?: string[];
  allowedKeywords?: string[];
}

interface TestCategory {
  category: string;
  description: string;
  tests: TestCase[];
}

// --- Helper for Text Normalization ---
const normalize = (text: string) => text.toLowerCase().trim();
const containsAny = (text: string, keywords: string[]) =>
  keywords.some((kw) => normalize(text).includes(normalize(kw)));

// --- The Runner ---
async function runTests() {
  const jsonPath = path.join(__dirname, 'search-test-cases.json');
  const testData: TestCategory[] = JSON.parse(
    fs.readFileSync(jsonPath, 'utf-8'),
  );

  let totalTests = 0;
  let passedTests = 0;

  console.log(`\n🚀 STARTING IBZIM SEARCH QUALITY AUDIT\n`);

  for (const category of testData) {
    console.log(`\n📂 [Category] ${category.category}`);
    console.log(`   ${category.description}`);
    console.log('   ---------------------------------------------------');

    for (const test of category.tests) {
      totalTests++;
      process.stdout.write(`   👉 Testing "${test.query}"... `);

      const result = await getResultsForQuery(test.query);
      const entries = result?.entries || [];
      const topResult = entries[0];

      let passed = false;
      let failureReason = '';

      // --- Validation Logic ---
      switch (test.type) {
        case 'exact_rank_1':
          if (!topResult) {
            failureReason = 'No results returned.';
          } else {
            const match = containsAny(
              topResult.name + ' ' + (topResult.description || ''),
              test.expectedKeywords || [],
            );
            if (match) passed = true;
            else
              failureReason = `Top result "${topResult.name}" did not match keywords: [${test.expectedKeywords?.join(', ')}]`;
          }
          break;

        case 'zero_results':
          if (entries.length === 0) passed = true;
          else
            failureReason = `Found ${entries.length} results (Top: "${entries[0].name}") but expected 0.`;
          break;

        case 'contains_relevant':
        case 'fuzzy_match': // Treating fuzzy similar to contains for top 3
          // Check top 3 results
          const relevantFound = entries
            .slice(0, 3)
            .some((entry: SearchIndexEntry) =>
              containsAny(
                entry.name + ' ' + (entry.description || ''),
                test.expectedKeywords || [],
              ),
            );
          if (relevantFound) passed = true;
          else
            failureReason = `None of the top 3 results contained: [${test.expectedKeywords?.join(', ')}]`;
          break;

        case 'zero_or_local_context':
          if (entries.length === 0) {
            passed = true; // Best case
          } else {
            // If results exist, they MUST match allowedKeywords AND NOT match forbiddenKeywords
            const topText =
              entries[0].name + ' ' + (entries[0].description || '');

            const hasForbidden = test.forbiddenKeywords
              ? containsAny(topText, test.forbiddenKeywords)
              : false;
            const hasAllowed = test.allowedKeywords
              ? containsAny(topText, test.allowedKeywords)
              : false;

            if (hasForbidden) {
              failureReason = `Found forbidden content: "${entries[0].name}" matches forbidden terms.`;
            } else if (!hasAllowed && test.allowedKeywords) {
              failureReason = `Result "${entries[0].name}" exists but is not relevant context (e.g. Starlink).`;
            } else {
              passed = true;
            }
          }
          break;
      }

      // --- Logging ---
      if (passed) {
        passedTests++;
        console.log(`✅ PASS`);
      } else {
        console.log(`❌ FAIL`);
        console.log(`      └─ Reason: ${failureReason}`);
      }
    }
  }

  // --- Summary ---
  console.log(`\n---------------------------------------------------`);
  console.log(
    `🏁 DONE. Score: ${passedTests}/${totalTests} (${Math.round((passedTests / totalTests) * 100)}%)`,
  );

  if (passedTests < totalTests) {
    process.exit(1); // Fail CI pipeline if any test fails
  }
}

runTests().catch((err) => console.error(err));
