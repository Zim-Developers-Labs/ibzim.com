import Container from '@/components/container';
import Link from 'next/link';

export default function HomeFooter() {
  return (
    <footer className="bg-white">
      <Container>
        <div className="flex flex-col justify-between py-4 text-sm text-[#70757a] sm:flex-row">
          <div className="mb-4 flex justify-center gap-6 sm:mb-0 sm:justify-start">
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Advertising
            </Link>
            <Link href="#" className="hover:underline">
              Business
            </Link>
          </div>
          <div className="flex justify-center gap-6 sm:justify-end">
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Settings
            </Link>
          </div>
        </div>
        <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} IBZIM. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
