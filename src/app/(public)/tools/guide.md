# Text Renderer Guide

A powerful utility function that converts plain text strings into formatted React elements with support for lists, links, bold text, and italic text.

## Installation

The text renderer is already included in your project. Simply import it from the lib directory:

```tsx
import { renderText } from '@/lib/text-renderer';
```

## Basic Usage

### Simple Text Rendering

```tsx
import { renderText } from '@/lib/text-renderer';

function MyComponent() {
  const text = 'This is **bold** and this is _italic_ text.';

  return <div>{renderText(text)}</div>;
}
```

### With Data from External Sources

```tsx
import { renderText } from '@/lib/text-renderer';
import { comments } from '@/data/data';

function CommentList() {
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <h4>{comment.author}</h4>
          {renderText(comment.text)}
        </div>
      ))}
    </div>
  );
}
```

## Supported Formatting

### 1. Bold Text

Use double asterisks to make text bold:

```
**This text will be bold**
```

**Output:** **This text will be bold**

### 2. Italic Text

Use single asterisks to make text italic:

```
_This text will be italic_
```

**Output:** _This text will be italic_

### 3. Links

#### Markdown-style Links

```
[Link Text](https://example.com)
```

#### Plain URLs

```
https://example.com
```

Both will render as clickable links. External links (starting with http/https) open in a new tab.

### 4. Lists

The renderer supports multiple list formats:

#### Bullet Points

```
• Item 1 • Item 2 • Item 3
```

#### Dashes

```

- Item 1 - Item 2 - Item 3
```

#### Asterisks

```

- Item 1 _ Item 2 _ Item 3
```

#### List Prefix

```
list: Item 1 Item 2 Item 3
```

All of these will render as proper HTML unordered lists.

## Advanced Examples

### Mixed Formatting

```tsx
const complexText = `Check out this **amazing** feature! Here's what it includes:
• *Fast* rendering
• **Bold** text support  
• Link to [documentation](https://docs.example.com)
• Plain URLs like https://github.com work too`;

return <div>{renderText(complexText)}</div>;
```

### Real-world Example: Comment System

```tsx
import { renderText } from '@/lib/text-renderer';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <strong>{comment.author}</strong>
        <span>{comment.timestamp}</span>
      </div>
      <div className="comment-body">{renderText(comment.text)}</div>
    </div>
  );
}
```

### Blog Post Content

```tsx
import { renderText } from '@/lib/text-renderer';

function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div className="post-content">{renderText(post.content)}</div>
    </article>
  );
}
```

## Data Structure Examples

### Comments Data

```tsx
// data/comments.ts
export const comments = [
  {
    id: '1',
    author: 'John Doe',
    text: 'Great post! I especially like these features: • Easy to use • **Fast** rendering • _Flexible_ formatting',
    timestamp: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    author: 'Jane Smith',
    text: 'Thanks for sharing! Check out [this related article](https://example.com) for more info.',
    timestamp: '2024-01-15T11:45:00Z',
  },
];
```

### Posts Data

```tsx
// data/posts.ts
export const posts = [
  {
    id: 'post-1',
    title: 'Getting Started',
    content:
      "Welcome to our platform! Here's what you can do: • Create posts • **Format** text • Add _emphasis_ • Share [links](https://example.com)",
    author: 'Admin',
  },
];
```

## Best Practices

### 1. Handle Empty/Null Values

The `renderText()` function handles null and undefined values gracefully, but it's good practice to check:

```tsx
function SafeTextRenderer({ text }: { text?: string }) {
  return (
    <div>{text ? renderText(text) : <span>No content available</span>}</div>
  );
}
```

### 2. Styling

The renderer applies basic CSS classes. You can override them:

```tsx
function StyledText({ text }: { text: string }) {
  return <div className="custom-text-container">{renderText(text)}</div>;
}
```

### 3. Performance with Large Lists

For large datasets, consider memoization:

```tsx
import { useMemo } from 'react';

function OptimizedCommentList({ comments }) {
  const renderedComments = useMemo(
    () =>
      comments.map((comment) => ({
        ...comment,
        renderedText: renderText(comment.text),
      })),
    [comments],
  );

  return (
    <div>
      {renderedComments.map((comment) => (
        <div key={comment.id}>{comment.renderedText}</div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Links not working**: Make sure URLs include `http://` or `https://`
2. **Lists not rendering**: Ensure proper spacing after list markers (`• `, `- `, `* `)
3. **Bold/italic not working**: Check for proper asterisk placement (`**bold**`, `*italic*`)

### Debugging

To see what the parser is generating, you can log the parsed elements:

```tsx
// This is for debugging only - don't use in production
import { parseText } from '@/lib/text-renderer'; // You'd need to export this

function DebugRenderer({ text }) {
  console.log('Parsed elements:', parseText(text));
  return <div>{renderText(text)}</div>;
}
```

## Extending the Renderer

The text renderer is designed to be extensible. To add new formatting options:

1. Add new pattern matching in the parsing functions
2. Add new element types to the `ParsedElement` interface
3. Add rendering logic in the `renderElement` function

Example patterns you might want to add:

- Headings: `# Heading`
- Code: `` `inline code` ``
- Strikethrough: `~~text~~`
- Line breaks: Handle `\n` characters

## API Reference

### `renderText(text: string): React.ReactNode`

**Parameters:**

- `text` (string): The text string to parse and render

**Returns:**

- `React.ReactNode`: Formatted JSX elements

**Example:**

```tsx
const result = renderText('**Bold** text with a [link](https://example.com)');
```

The function is safe to use with any string input and will return `null` for invalid inputs.
