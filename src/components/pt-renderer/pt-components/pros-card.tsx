import { ShieldCheck } from 'lucide-react';

export default function blockProsCard({ pros = [] }: any) {
  return (
    <div className="my-6 w-full rounded-xl border border-zinc-200 bg-zinc-100 p-6">
      <ul className="mt-4">
        {pros.map((pro: any) => (
          <li key={pro} className="mb-2 flex items-baseline">
            <div className="mr-2 h-4 w-4">
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </div>
            <span>{pro}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
