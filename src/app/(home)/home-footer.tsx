'use client';

import Container from '@/components/container';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOMAIN_URLS } from '@/lib/constants';
import Link from 'next/link';
import { useUser } from '@/hooks/user-context';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { Settings, History } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeFooter() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleProtectedLink = (path: string) => {
    if (!user) {
      toast.error('You must be logged in to access this feature');
      return;
    }
    router.push(path);
  };

  return (
    <footer className="bg-white dark:bg-zinc-900">
      <Container>
        <div className="flex flex-col justify-between py-4 text-sm text-[#70757a] sm:flex-row dark:text-zinc-400">
          <div className="mb-4 flex justify-center gap-6 sm:mb-0 sm:justify-start">
            <Link
              target="_blank"
              href={`${DOMAIN_URLS.HELP()}/docs/introduction`}
              className="hover:underline"
            >
              About
            </Link>
            <Link
              target="_blank"
              href={DOMAIN_URLS.ADVERTISE()}
              className="hover:underline"
            >
              Advertising
            </Link>
            <Link
              target="_blank"
              href={DOMAIN_URLS.BUSINESS()}
              className="hover:underline"
            >
              Business
            </Link>
          </div>
          <div className="flex justify-center gap-6 sm:justify-end">
            <Link
              target="_blank"
              href="/policies/privacy"
              className="hover:underline"
            >
              Privacy
            </Link>
            <Link
              target="_blank"
              href="/policies/terms"
              className="hover:underline"
            >
              Terms
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="cursor-pointer hover:underline">Settings</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    handleProtectedLink('/my-account/search-preferences')
                  }
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Search Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleProtectedLink('/my-account/search-history')
                  }
                  className="cursor-pointer"
                >
                  <History className="mr-2 h-4 w-4" />
                  Search History
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <div className="px-2 pb-1">
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} IBZIM. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
