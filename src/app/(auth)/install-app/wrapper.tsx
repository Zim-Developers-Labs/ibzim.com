'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface BrowserInfo {
  name: string;
  version: string;
  supportsPWA: boolean;
}

export default function InstallPageWrapper() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  // const [isStandalone, setIsStandalone] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const router = useRouter();

  const detectBrowser = (): BrowserInfo => {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      return { name: 'Chrome', version: '', supportsPWA: true };
    } else if (userAgent.includes('Firefox')) {
      return { name: 'Firefox', version: '', supportsPWA: true };
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      return { name: 'Safari', version: '', supportsPWA: true };
    } else if (userAgent.includes('Edg')) {
      return { name: 'Edge', version: '', supportsPWA: true };
    } else if (userAgent.includes('Opera')) {
      return { name: 'Opera', version: '', supportsPWA: true };
    } else {
      return { name: 'Unknown', version: '', supportsPWA: false };
    }
  };

  useEffect(() => {
    // Detect browser
    const browser = detectBrowser();
    setBrowserInfo(browser);

    // Check if running on iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if app is already installed (running in standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    // setIsStandalone(standalone);

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // For iOS devices, we can show install instructions
    if (iOS) {
      setCanInstall(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // If no install prompt after a short delay, check if we can still show manual instructions
    const timer = setTimeout(() => {
      if (!deferredPrompt && !iOS && browser.supportsPWA) {
        setCanInstall(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) return;

    if (isIOS) {
      // For iOS, we can't trigger install programmatically
      return;
    }

    setIsInstalling(true);
    try {
      await deferredPrompt!.prompt();
      const { outcome } = await deferredPrompt!.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setCanInstall(false);
      }
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleBackToSite = () => {
    router.push('/');
  };

  const getManualInstallInstructions = () => {
    if (!browserInfo) return null;

    switch (browserInfo.name) {
      case 'Chrome':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">
              Manual Installation in Chrome:
            </h4>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  1
                </span>
                <span>
                  Click the three dots menu (⋮) in the top right corner
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  2
                </span>
                <span>
                  Look for &quot;Install IBZIM...&quot; or &quot;Add to Home
                  screen&quot; option
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  3
                </span>
                <span>Click &quot;Install&quot; in the popup dialog</span>
              </li>
            </ol>
          </div>
        );

      case 'Firefox':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">
              Manual Installation in Firefox:
            </h4>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  1
                </span>
                <span>Look for the install icon (⊕) in the address bar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  2
                </span>
                <span>
                  Click the install icon and select &quot;Install&quot;
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  3
                </span>
                <span>
                  Or use the hamburger menu (☰) → &quot;Install this site as an
                  app&quot;
                </span>
              </li>
            </ol>
          </div>
        );

      case 'Edge':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">
              Manual Installation in Edge:
            </h4>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  1
                </span>
                <span>
                  Click the three dots menu (...) in the top right corner
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  2
                </span>
                <span>
                  Select &quot;Apps&quot; → &quot;Install this site as an
                  app&quot;
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  3
                </span>
                <span>
                  Click &quot;Install&quot; in the confirmation dialog
                </span>
              </li>
            </ol>
          </div>
        );

      case 'Safari':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">
              Manual Installation in Safari:
            </h4>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  1
                </span>
                <span>
                  Tap the Share button (□↗) at the bottom of the screen
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  2
                </span>
                <span>Scroll down and tap &quot;Add to Home Screen&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                  3
                </span>
                <span>Tap &quot;Add&quot; to install the app</span>
              </li>
            </ol>
          </div>
        );

      default:
        return null;
    }
  };

  const getSupportedBrowsers = () => (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">
        Recommended Browsers for PWA Installation:
      </h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <div className="h-6 w-6 rounded bg-blue-500"></div>
          <span>Chrome</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <div className="h-6 w-6 rounded bg-orange-500"></div>
          <span>Firefox</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <div className="h-6 w-6 rounded bg-blue-600"></div>
          <span>Edge</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <div className="h-6 w-6 rounded bg-blue-400"></div>
          <span>Safari</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        For the best experience, please use one of these browsers and ensure
        you&#39;re using the latest version.
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Icons.ibzimAwardsIcon className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Install IBZIM App
          </CardTitle>
          <CardDescription>
            Get easy access to IBZIM with our progressive web app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  App Installed Successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  You can now access IBZIM directly from your home screen.
                </p>
              </div>
              <Button onClick={handleBackToSite} className="w-full">
                Back to IBZIM
              </Button>
            </div>
          ) : canInstall ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Why install the IBZIM app?
                </h3>
                <ul className="space-y-2 text-left text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Faster loading and better performance
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Easy access from your home screen
                  </li>
                </ul>
              </div>

              {isIOS ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-2 font-semibold text-blue-900">
                      Installation Instructions for iOS:
                    </h4>
                    <ol className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                          1
                        </span>
                        <span>
                          Tap the Share button{' '}
                          <svg
                            className="mx-1 inline h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>{' '}
                          in Safari
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                          2
                        </span>
                        <span>
                          Scroll down and tap &quot;Add to Home Screen&quot;{' '}
                          <svg
                            className="mx-1 inline h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                          3
                        </span>
                        <span>Tap &quot;Add&quot; to install the app</span>
                      </li>
                    </ol>
                  </div>
                  <Button
                    onClick={handleBackToSite}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Back to IBZIM
                  </Button>
                </div>
              ) : deferredPrompt ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                    className="w-full"
                  >
                    {isInstalling ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Installing...
                      </>
                    ) : (
                      <>
                        <Icons.ibzimAwardsIcon className="mr-2 h-4 w-4" />
                        Install IBZIM App
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleBackToSite}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Back to IBZIM
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="mb-3 font-semibold text-amber-900">
                      Manual Installation Available
                    </h4>
                    {getManualInstallInstructions()}
                  </div>
                  <Button
                    onClick={handleBackToSite}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Back to IBZIM
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    Installation Not Available
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Your current browser ({browserInfo?.name || 'Unknown'}) may
                    not support PWA installation or has it disabled.
                  </p>
                </div>

                {browserInfo?.supportsPWA && getManualInstallInstructions() && (
                  <div className="mb-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      {getManualInstallInstructions()}
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  {getSupportedBrowsers()}
                </div>
              </div>

              <Button onClick={handleBackToSite} className="w-full">
                Continue Using IBZIM in Browser
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
