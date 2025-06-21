import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Filter } from 'bad-words';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (cents: string) => {
  const amount = Number.parseInt(cents) || 0;
  return (amount / 100).toFixed(2);
};

export function Linkify(titleText: string) {
  const linkified =
    titleText?.toLowerCase &&
    titleText
      .toLowerCase()
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[?!.]/g, '');

  return linkified;
}

export function formatUpdatedAt(updatedAt: string): string {
  const now = new Date();
  const updatedDate = new Date(updatedAt);

  const secondsDiff = Math.floor(
    (now.getTime() - updatedDate.getTime()) / 1000,
  );
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);
  const monthsDiff =
    (now.getFullYear() - updatedDate.getFullYear()) * 12 +
    (now.getMonth() - updatedDate.getMonth());
  const yearsDiff = Math.floor(monthsDiff / 12);

  if (secondsDiff < 60) {
    return 'Just Now';
  } else if (minutesDiff < 60) {
    return `${minutesDiff} ${minutesDiff === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} ${hoursDiff === 1 ? 'hour' : 'hours'} ago`;
  } else if (daysDiff < 30) {
    return `${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} ago`;
  } else if (monthsDiff < 12) {
    return `${monthsDiff} ${monthsDiff === 1 ? 'month' : 'months'} ago`;
  } else if (yearsDiff < 10) {
    return `${yearsDiff} ${yearsDiff === 1 ? 'year' : 'years'} ago`;
  } else {
    return updatedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export const truncateOnWord = (
  text: string,
  maxLength: number,
  ellipsis = true,
) => {
  if (text.length <= maxLength) return text;

  // First split on maxLength chars
  let truncatedText = text.substring(0, maxLength);

  // Then split on the last space, this way we split on the last word,
  // which looks just a bit nicer.
  truncatedText = truncatedText.substring(
    0,
    Math.min(truncatedText.length, truncatedText.lastIndexOf(' ')),
  );

  if (ellipsis) truncatedText += '...';

  return truncatedText;
};

export default function extractTextFromBlocks(blocks: any) {
  return blocks
    .map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child: any) => child.text).join(' ');
      }
      if (block._type === 'blockGreenCard') {
        const title = block.title;
        const blockText = block.body.map((child: any) => child.text).join(' ');

        return `${title} ${blockText}`;
      }

      if (block._type === 'blockTable') {
        return block.rows.map((row: any) => row).join(' ');
      }

      return '';
    })
    .join(' ');
}

export function calculateReadingTime(article: string): number {
  const wordsPerMinute = 200; // Average reading speed (adjusted)
  const wordCount = article.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes); // Ensure at least 1 minute is returned
}

export function absoluteUrl(path: string) {
  // ! should use env.
  return new URL(path, process.env.NEXT_PUBLIC_APP_URL).href;
}

export function filterBadWords(text: string): string {
  const filter = new Filter();
  const newBadWords = ['mhata', 'mboro', 'jende', 'dhodhi', 'garo', 'svira'];

  filter.addWords(...newBadWords);
  const newWords = filter.clean(text);

  return newWords;
}

export function convertToSlug(
  text?: string,
  { fallback }: { fallback?: string } = { fallback: 'top-level' },
) {
  if (!text) return fallback;
  return slugify(text.trim(), {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
  });
}
