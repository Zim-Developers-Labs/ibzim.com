import Container from '@/components/container';
import FeedbackModal from './feedback-modal';
import { SmileIcon } from 'lucide-react';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Container className="py-12">{children}</Container>
      <aside className="relative mt-12 flex flex-col items-center border-b border-zinc-600 bg-zinc-900 px-4 py-24 text-center">
        <div className="absolute top-0 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-8 transform items-center justify-center rounded-full bg-zinc-900 text-2xl">
          <SmileIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-primaryColor mb-6 text-3xl md:text-4xl">
          How was your experience?
        </h3>
        <p className="mb-8 max-w-xl text-zinc-200">
          At IBZim we prioritize providing our users with exactly what they need
          in the best way possible.
        </p>
        <FeedbackModal />
      </aside>
    </div>
  );
}
