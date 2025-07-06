import { ChevronRight, ChevronRightIcon, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { tools } from '.';
import Link from 'next/link';

export default function SideBar() {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
          <span className="sr-only">Open main menu</span>
          <Menu aria-hidden="true" className="h-6 w-6" />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="px-4">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          <Link
            href="/calendar"
            className="flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-3 text-sm group-data-[state=open]/collapsible:bg-zinc-200 dark:border-white/20 dark:group-data-[state=open]/collapsible:bg-white/20"
          >
            <span>Calendar</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </Link>
          <Link
            href="/zimbabwe-peoples-choice-awards"
            className="flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-3 text-sm group-data-[state=open]/collapsible:bg-zinc-200 dark:border-white/20 dark:group-data-[state=open]/collapsible:bg-white/20"
          >
            <span>2025 Awards</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </Link>
          <Link
            href="https://news.ibzim.com"
            target="_blank"
            className="flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-3 text-sm group-data-[state=open]/collapsible:bg-zinc-200 dark:border-white/20 dark:group-data-[state=open]/collapsible:bg-white/20"
          >
            <span>News</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </Link>
          <Collapsible asChild className="group/collapsible">
            <div>
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-3 text-sm group-data-[state=open]/collapsible:bg-zinc-200 dark:border-white/20 dark:group-data-[state=open]/collapsible:bg-white/20">
                  <span>Tools</span>
                  <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 border-l border-zinc-200 pl-4 dark:border-white/20">
                {tools.map((nav, i) => (
                  <Link
                    key={i}
                    href={nav.href}
                    className="group flex w-full flex-row items-center justify-between rounded-lg p-3 hover:bg-gray-50"
                  >
                    <span className="flex items-center">
                      <ChevronRightIcon className="group-hover:text-primaryColor mr-1 size-3" />
                      <span className="text-sm text-gray-900">{nav.name}</span>
                    </span>
                  </Link>
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </SheetContent>
    </Sheet>
  );
}
