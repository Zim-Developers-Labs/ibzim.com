import { Metadata } from 'next';
import ChatsWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Chats | IBZim`,
    description: `Join our topic-based WhatsApp groups where Zimbabweans connect, share ideas, and build networks. Groups open on schedule for focused, meaningful conversations.`,
    pageUrl: '/calendar',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });

export default function ChatsPage() {
  return <ChatsWrapper />;
}
