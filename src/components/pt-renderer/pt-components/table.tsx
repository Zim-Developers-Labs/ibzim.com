import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ReactCountryFlag from 'react-country-flag';

export default function blockTable({
  // hasSorting,
  rows = [],
}: {
  hasSorting: boolean;
  rows: string[];
}) {
  const renderCell = (cell: string) => {
    // Check for link
    if (cell.trim().includes('=link(')) {
      const match = cell.match(/=link$$"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"$$/);
      if (match) {
        const [, linkText, href, rel] = match;
        return (
          <a
            href={href!}
            rel={rel}
            target="_blank"
            className="text-primaryColor hover:underline"
          >
            {linkText}
          </a>
        );
      }
    }

    // Check for age calculation
    if (cell.trim().startsWith('=age(')) {
      const match = cell.match(/\((\d{4})\)/)?.[1];
      if (match) {
        const birthYear = Number.parseInt(match!);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        return age;
      }
    }

    if (cell.trim().startsWith('=exactage(')) {
      const match = cell.match(/\((\d{4}\/\d{2}\/\d{2})\)/)?.[1];
      if (match) {
        const birthDate = new Date(match);
        const currentDate = new Date();

        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();
        const dayDiff = currentDate.getDate() - birthDate.getDate();

        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          return age - 1;
        }
        return age;
      }
    }

    // Usage: `=image("https://example.com/image.jpg", 50, 50)` would render a 50x50 image

    if (cell.trim().startsWith('=image(')) {
      const match = cell.match(/=image$$"([^"]+)",\s*(\d+),\s*(\d+)$$/);
      if (match) {
        const [, src, width, height] = match;
        return (
          <Image
            src={src || '/placeholder.svg'}
            width={Number(width) ?? 50}
            height={Number(height) ?? 50}
            alt="Cell image"
          />
        );
      }
    }

    // Usage: `=rating(4, 5)` would render "★★★★☆"

    if (cell.trim().startsWith('=rating(')) {
      const match = cell.match(/=rating$$(\d+(?:\.\d+)?),\s*(\d+)$$/);
      if (match) {
        const [, rating, maxRating] = match;
        const stars =
          '★'.repeat(Math.round(parseFloat(rating!))) +
          '☆'.repeat(Math.round(parseFloat(maxRating!) - parseFloat(rating!)));
        return <span className="text-yellow-400">{stars}</span>;
      }
    }

    // Usage: `=progress(75)` would render a progress bar at 75%

    if (cell.trim().startsWith('=progress(')) {
      const match = cell.match(/=progress$$(\d+(?:\.\d+)?)$$/);
      if (match) {
        const percentage = parseFloat(match[1]!);
        return (
          <span className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <span
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${percentage}%` }}
            ></span>
          </span>
        );
      }
    }

    // usa `=flag("zw", "Zimbabwe")` would render a zimbabwe flag icon and the text Zimbabwe

    if (cell.trim().startsWith('=flag(')) {
      const match = cell.match(/=flag\("(\w{2})",\s*"([^"]+)"\)/);
      if (match) {
        const [, countryCode, displayText] = match;
        return (
          <span className="flex items-center gap-2">
            <ReactCountryFlag
              className="h-5 w-auto"
              countryCode={countryCode!}
              svg
            />
            {displayText}
          </span>
        );
      }
    }

    // If no special content, render as before
    const parts = cell.split(/[[\]]/);
    if (parts.length === 3) {
      const [before, linkText, after] = parts;
      const linkParts = after!.slice(1, -1).split(',');
      const href = linkParts[0]!.trim().replace(/^"|"$/g, '');
      const rel = linkParts[1]
        ?.trim()
        .replace(/^"|"$/g, '')
        .replace(/\)"$/, '');

      return (
        <>
          {before}
          <a
            href={href}
            rel={rel ? rel.slice(0, -1) : undefined}
            target="_blank"
            className="text-primaryColor hover:underline"
          >
            {linkText}
          </a>
        </>
      );
    }
    return cell;
  };

  // if (hasSorting) {
  //   const [sortColumn, setSortColumn] = useState<number | null>(null);
  //   const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
  //     null
  //   );

  //   const handleSort = (columnIndex: number) => {
  //     if (sortColumn === columnIndex) {
  //       if (sortDirection === "asc") {
  //         setSortDirection("desc");
  //       } else if (sortDirection === "desc") {
  //         setSortColumn(null);
  //         setSortDirection(null);
  //       } else {
  //         setSortDirection("asc");
  //       }
  //     } else {
  //       setSortColumn(columnIndex);
  //       setSortDirection("asc");
  //     }
  //   };

  //   const sortedRows = [...rows].slice(1).sort((a, b) => {
  //     if (sortColumn === null || sortDirection === null) return 0;
  //     const aValue = a.split("|")[sortColumn]!;
  //     const bValue = b.split("|")[sortColumn]!;
  //     if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
  //     if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
  //     return 0;
  //   });

  //   return (
  //     <div className="mb-6 w-full overflow-x-auto">
  //       {rows[0]!.split("|").length > 3 && (
  //         <span className="float-right text-xs text-gray-900 py-1 px-2 bg-gray-200 rounded-sm mb-2 inline-flex items-center gap-2 sm:hidden">
  //           {`+${rows[0]!.split("|").length - 3} `} columns
  //           <ArrowRightIcon className="size-3" />
  //         </span>
  //       )}
  //       <table className="w-fit sm:w-full">
  //         <thead>
  //           <tr className="bg-zinc-900 text-white">
  //             {rows[0]!.split("|").map((cell, i) => (
  //               <th
  //                 key={i}
  //                 className="px-2 py-2 text-left cursor-pointer"
  //                 onClick={() => handleSort(i)}
  //               >
  //                 <div className="flex items-center gap-1">
  //                   {renderCell(cell)}
  //                   <span className="text-xs line-clamp-1">
  //                     {sortColumn === i
  //                       ? sortDirection === "asc"
  //                         ? "▲"
  //                         : "▼"
  //                       : "▲▼"}
  //                   </span>
  //                 </div>
  //               </th>
  //             ))}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {sortedRows.slice(1).map((row, i) => (
  //             <tr key={i} className="odd:bg-white even:bg-zinc-100">
  //               {row.split("|").map((cell, j) => (
  //                 <td
  //                   key={j}
  //                   className={`px-2 py-2 text-left ${j === 0 ? "font-semibold" : ""}`}
  //                 >
  //                   {renderCell(cell)}
  //                 </td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }

  return (
    <div className="mb-6 w-full overflow-x-auto">
      {rows[0]!.split('|').length > 3 && (
        <span className="float-right mb-2 inline-flex items-center gap-2 rounded-sm bg-gray-200 px-2 py-1 text-xs text-gray-900 sm:hidden">
          {`+${rows[0]!.split('|').length - 3} `} columns
          <ArrowRight className="size-3" />
        </span>
      )}
      <table className="w-fit sm:w-full">
        <thead>
          <tr className="bg-zinc-900 text-white">
            {rows[0]!.split('|').map((cell, i) => (
              <th key={i} className="px-2 py-2 text-left">
                {renderCell(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-zinc-100">
              {row.split('|').map((cell, j) => (
                <td
                  key={j}
                  className={`px-2 py-2 text-left ${j === 0 ? 'font-semibold' : ''}`}
                >
                  {renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
