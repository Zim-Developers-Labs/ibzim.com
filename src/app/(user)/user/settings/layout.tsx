import SettingsNav from './settings-nav';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pt-12 pb-20 sm:px-8 md:flex-row md:divide-x lg:px-12">
      <SettingsNav />
      <div className="flex-1 pb-6 md:pl-12">{children}</div>
    </div>
  );
}
