import LibraryNav from './library-nav';

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pt-12 pb-20 sm:px-8 md:flex-row md:divide-x lg:px-12">
      <LibraryNav />

      <div className="flex-1 py-6 md:pl-12">{children}</div>
    </div>
  );
}
