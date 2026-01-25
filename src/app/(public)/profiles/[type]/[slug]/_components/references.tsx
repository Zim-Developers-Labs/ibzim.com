import { Icons } from '@/components/icons';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

type ReferenceType = {
  number: number;
  linkText: string;
  sourceTitle: string;
  datePublished: string;
  url: string;
};

function extractReferences(body: any): ReferenceType[] {
  const references = new Map<number, ReferenceType>();

  function processNode(node: any) {
    if (Array.isArray(node)) {
      node.forEach(processNode);
    } else if (typeof node === 'object' && node !== null) {
      if (node._type === 'block' && Array.isArray(node.markDefs)) {
        node.markDefs.forEach((markDef: any) => {
          if (markDef._type === 'annotationReference') {
            references.set(markDef.number, {
              number: markDef.number,
              linkText: markDef.linkText || '',
              sourceTitle: markDef.sourceTitle || '',
              datePublished: markDef.datePublished || '',
              url: markDef.url || '',
            });
          }
        });
      }
      Object.values(node).forEach(processNode);
    }
  }

  processNode(body);

  return Array.from(references.values()).sort((a, b) => a.number - b.number);
}

export default function References({
  body,
  infoboxTable,
}: {
  body: any[];
  infoboxTable: any[];
}) {
  const bodyReferences: ReferenceType[] = extractReferences(body);

  const infoboxTableReferences: ReferenceType[] | null = infoboxTable?.flatMap(
    (info) => extractReferences(info.tableData),
  );

  // Combine and deduplicate references
  const combinedReferences = new Map<number, ReferenceType>();

  // Ensure both variables are arrays even if they are undefined or null
  const safeInfoboxTableReferences = infoboxTableReferences ?? [];
  const safeBodyReferences = bodyReferences ?? [];

  [...safeInfoboxTableReferences, ...safeBodyReferences].forEach((ref) => {
    if (!combinedReferences.has(ref.number)) {
      combinedReferences.set(ref.number, ref);
    }
  });

  const references: ReferenceType[] = Array.from(
    combinedReferences.values(),
  ).sort((a, b) => a.number - b.number);

  if (references.length === 0) {
    return null; // No references to display
  }

  return (
    <section className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <h2 className="-mt-20 mb-5 w-full border-b border-zinc-200 pt-28 pb-4 text-2xl md:text-3xl">
        References
      </h2>
      <ol className="list-inside list-decimal">
        {references.map((reference) => (
          <li
            key={reference.number}
            className="-mt-20 mb-2 pt-20"
            id={`reference-${reference.number}`}
          >
            <span className="text-sm">
              <Link
                href={reference.url}
                target="_blank"
                rel="nofollow"
                className="text-primaryColor hover:underline"
              >
                {reference.url?.endsWith('.pdf') && (
                  <Icons.pdfIcon className="inline" />
                )}{' '}
                {reference.linkText}
                <ExternalLink className="inline size-3" />
              </Link>{' '}
              <span className="italic">{reference.sourceTitle}</span>{' '}
              <span className="text-zinc-600">{reference.datePublished}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
