'use client';

import { DOMAIN_URLS } from '@/lib/constants';

export default function VerifyEmailBanner() {
  const handleVerifyClick = () => {
    window.location.href = `${DOMAIN_URLS.AUTH()}/verify-email?callbackUrl=${encodeURIComponent(window.location.href)}&requestId=send_verification_request`;
  };

  return (
    <aside>
      <div
        className="flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-red-800"
        role="alert"
      >
        <div className="text-sm">Please verify your email address</div>
        <button
          onClick={handleVerifyClick}
          className="rounded-full bg-red-800 px-1.5 py-1 text-sm text-red-200"
        >
          Verify Now
        </button>
      </div>
    </aside>
  );
}
