import clsx from 'clsx';

export default function BetaContainer({ className, children, ...props }: any) {
  return (
    <div
      className={clsx(
        'relative mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-12',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
