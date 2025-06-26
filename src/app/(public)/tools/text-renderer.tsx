import type React from 'react';
import Link from 'next/link';

interface ParsedElement {
  type: 'text' | 'list' | 'link' | 'bold';
  content: string | string[];
  url?: string;
}

const parseText = (text: string): ParsedElement[] => {
  const elements: ParsedElement[] = [];
  const currentText = text;

  // Parse lists (items separated by newlines or specific patterns)
  const listPattern =
    /(?:list:|•|(?<=\s)-(?=\s))\s*([^•\n]+?(?=(?:\s{2,}|(?<=\s)-(?=\s)|•|list:|$)))/gi;
  const listMatches = Array.from(currentText.matchAll(listPattern));

  if (listMatches.length > 0) {
    let lastIndex = 0;

    listMatches.forEach((match, index) => {
      // Add text before the list
      if (match.index! > lastIndex) {
        const beforeText = currentText.slice(lastIndex, match.index).trim();
        if (beforeText) {
          elements.push(...parseInlineElements(beforeText));
        }
      }

      // Check if this is the start of a list or continuation
      if (index === 0 || match.index! - lastIndex > match[0].length) {
        // Start new list
        const listItems = [match[1].trim()];

        // Collect consecutive list items
        for (let i = index + 1; i < listMatches.length; i++) {
          const nextMatch = listMatches[i];
          if (nextMatch.index! - (match.index! + match[0].length) < 50) {
            listItems.push(nextMatch[1].trim());
          } else {
            break;
          }
        }

        elements.push({
          type: 'list',
          content: listItems,
        });
      }

      lastIndex = match.index! + match[0].length;
    });

    // Add remaining text
    if (lastIndex < currentText.length) {
      const remainingText = currentText.slice(lastIndex).trim();
      if (remainingText) {
        elements.push(...parseInlineElements(remainingText));
      }
    }
  } else {
    // No lists found, parse inline elements
    elements.push(...parseInlineElements(currentText));
  }

  return elements;
};

const parseInlineElements = (text: string): ParsedElement[] => {
  const elements: ParsedElement[] = [];
  const currentText = text;

  // Parse links - matches [text](url) or http(s)://... patterns
  const linkPattern = /\[([^\]]+)\]$$([^)]+)$$|https?:\/\/[^\s]+/g;
  const linkMatches = Array.from(currentText.matchAll(linkPattern));

  if (linkMatches.length > 0) {
    let lastIndex = 0;

    linkMatches.forEach((match) => {
      // Add text before link
      if (match.index! > lastIndex) {
        const beforeText = currentText.slice(lastIndex, match.index!);
        if (beforeText.trim()) {
          elements.push(...parseBold(beforeText));
        }
      }

      // Add link
      if (match[1] && match[2]) {
        // Markdown-style link [text](url)
        elements.push({
          type: 'link',
          content: match[1],
          url: match[2],
        });
      } else {
        // Plain URL
        elements.push({
          type: 'link',
          content: match[0],
          url: match[0],
        });
      }

      lastIndex = match.index! + match[0].length;
    });

    // Add remaining text
    if (lastIndex < currentText.length) {
      const remainingText = currentText.slice(lastIndex);
      if (remainingText.trim()) {
        elements.push(...parseBold(remainingText));
      }
    }
  } else {
    elements.push(...parseBold(currentText));
  }

  return elements;
};

const parseBold = (text: string): ParsedElement[] => {
  const elements: ParsedElement[] = [];

  // Parse **bold** and *italic*
  const formatPattern = /(\*\*([^*]+)\*\*)/g;
  const matches = Array.from(text.matchAll(formatPattern));

  if (matches.length > 0) {
    let lastIndex = 0;

    matches.forEach((match) => {
      // Add text before formatted text
      if (match.index! > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index!);
        if (beforeText.trim()) {
          elements.push({ type: 'text', content: beforeText });
        }
      }

      // Add formatted text
      if (match[2]) {
        // Bold text **text**
        elements.push({ type: 'bold', content: match[2] });
      }

      lastIndex = match.index! + match[0].length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        elements.push({ type: 'text', content: remainingText });
      }
    }
  } else {
    elements.push({ type: 'text', content: text });
  }

  return elements;
};

const renderElement = (
  element: ParsedElement,
  index: number,
): React.ReactNode => {
  switch (element.type) {
    case 'list':
      return (
        <ul key={index} className="my-2 list-inside list-disc space-y-1">
          {(element.content as string[]).map((item, itemIndex) => (
            <li key={itemIndex} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'link':
      const isExternal = element.url?.startsWith('http');
      return isExternal ? (
        <a
          key={index}
          href={element.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {element.content}
        </a>
      ) : (
        <Link
          key={index}
          href={element.url || '#'}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {element.content}
        </Link>
      );

    case 'bold':
      return (
        <strong key={index} className="font-bold">
          {element.content}
        </strong>
      );

    case 'text':
    default:
      return <span key={index}>{element.content}</span>;
  }
};

/**
 * Renders text with formatting support for lists, links, bold, and italic text
 * @param text - The text string to parse and render
 * @returns JSX elements with formatted content
 */
export function renderText(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const parsedElements = parseText(text);
  return (
    <span className="inline-block">
      {parsedElements.map((element, index) => renderElement(element, index))}
    </span>
  );
}
