'use client';

import type React from 'react';
import { forwardRef, useEffect, useState } from 'react';
import clsx from 'clsx';

function BatteryIcon({ level = 80 }: { level?: number }) {
  // Determine color based on battery level
  const color = level > 20 ? '#fff' : '#ff3b30';

  return (
    <svg
      width="25"
      height="12"
      viewBox="0 0 25 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="20"
        height="10"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="3"
        y="3"
        width={(level / 100) * 16}
        height="6"
        rx="1"
        fill={color}
      />
      <path
        d="M23 4V8C23.8047 7.66122 24.328 6.87313 24.328 6C24.328 5.12687 23.8047 4.33878 23 4Z"
        fill={color}
      />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.00001 9.5C8.66667 9.5 9.16667 10 9.16667 10.6667C9.16667 11.3333 8.66667 11.8333 8.00001 11.8333C7.33334 11.8333 6.83334 11.3333 6.83334 10.6667C6.83334 10 7.33334 9.5 8.00001 9.5Z"
        fill="white"
      />
      <path
        d="M8 6.5C9.83333 6.5 11.5 7.16667 12.6667 8.33333L11.3333 9.66667C10.5 8.83333 9.33333 8.33333 8 8.33333C6.66667 8.33333 5.5 8.83333 4.66667 9.66667L3.33333 8.33333C4.5 7.16667 6.16667 6.5 8 6.5Z"
        fill="white"
      />
      <path
        d="M8 3.5C10.9167 3.5 13.5833 4.58333 15.5 6.5L14.1667 7.83333C12.5833 6.25 10.4167 5.33333 8 5.33333C5.58333 5.33333 3.41667 6.25 1.83333 7.83333L0.5 6.5C2.41667 4.58333 5.08333 3.5 8 3.5Z"
        fill="white"
      />
      <path
        d="M8 0.5C11.75 0.5 15.25 1.91667 17.8333 4.5L16.5 5.83333C14.25 3.58333 11.25 2.33333 8 2.33333C4.75 2.33333 1.75 3.58333 -0.5 5.83333L-1.83333 4.5C0.75 1.91667 4.25 0.5 8 0.5Z"
        fill="white"
      />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 8.5H2.5V11H1V8.5Z" fill="white" />
      <path d="M5 6H6.5V11H5V6Z" fill="white" />
      <path d="M9 3.5H10.5V11H9V3.5Z" fill="white" />
      <path d="M13 1H14.5V11H13V1Z" fill="white" />
    </svg>
  );
}

export function AppScreen({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [currentTime, setCurrentTime] = useState<string>('00:00');

  useEffect(() => {
    // Set initial time
    updateTime();

    // Update time every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }

  return (
    <div className={clsx('flex flex-col', className)} {...props}>
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 text-xs text-white">
        <div className="flex-1">
          <span className="font-medium">{currentTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon level={72} />
        </div>
      </div>
      {children}
    </div>
  );
}

AppScreen.Header = forwardRef<
  React.ElementRef<'div'>,
  { children: React.ReactNode }
>(function AppScreenHeader({ children }, ref) {
  return (
    <div ref={ref} className="mt-6 px-4 text-white">
      {children}
    </div>
  );
});

AppScreen.Title = forwardRef<
  React.ElementRef<'div'>,
  { children: React.ReactNode }
>(function AppScreenTitle({ children }, ref) {
  return (
    <div ref={ref} className="text-2xl text-white">
      {children}
    </div>
  );
});

AppScreen.Subtitle = forwardRef<
  React.ElementRef<'div'>,
  { children: React.ReactNode }
>(function AppScreenSubtitle({ children }, ref) {
  return (
    <div ref={ref} className="text-sm text-gray-500">
      {children}
    </div>
  );
});

AppScreen.Body = forwardRef<
  React.ElementRef<'div'>,
  { className?: string; children: React.ReactNode }
>(function AppScreenBody({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={clsx('mt-6 flex-auto rounded-t-2xl bg-white', className)}
    >
      {children}
    </div>
  );
});
