'use client';
import { TierType } from '.';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { PayDialog } from './pay-dialog';
import { User } from '@/lib/server/constants';
import { toast } from 'sonner';
import { AlertCircleIcon } from 'lucide-react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function PremiumPricing({
  tiers,
  subType,
  user,
}: {
  tiers: TierType[];
  subType: string;
  user: User | null;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierType | null>(null);
  const savedInMontlyPersonal = Math.ceil(
    tiers[0].price.personal * 4 - tiers[1].price.personal,
  );

  const savedInYearlyPersonal = Math.ceil(
    tiers[1].price.personal * 12 - tiers[2].price.personal,
  );

  const savedInYearlyBusiness = Math.ceil(
    tiers[1].price.business! * 12 - tiers[2].price.business!,
  );

  function SavedBadge({ amount }: { amount: number }) {
    return (
      <Badge className="ml-2 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 font-semibold text-white shadow-md">
        Save ${amount}
      </Badge>
    );
  }

  const handleBuyClick = (tier: TierType) => {
    if (!user) {
      toast('Please log in to purchase a subscription.', {
        icon: <AlertCircleIcon className="h-5 w-5 text-red-600" />,
        action: {
          label: 'Log In',
          onClick: () =>
            (window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(window.location.href)}`),
        },
      });
      return;
    }

    if (!user.emailVerified) {
      toast('Verify your email to proceed with the purchase.', {
        icon: <AlertCircleIcon className="h-5 w-5 text-red-600" />,
        action: {
          label: 'Verify Email',
          onClick: () =>
            (window.location.href = `/verify-email?callbackUrl=${encodeURIComponent(window.location.href)}&requestId=send_verification_request`),
        },
      });
      return;
    }

    if (subType === 'business' && tier.price.business === undefined) {
      return;
    }
    setSelectedTier(tier);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="relative mx-auto -mt-32 max-w-7xl px-6 lg:px-8">
        <div className="relative mx-auto mb-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div
            aria-hidden="true"
            className="hidden lg:absolute lg:inset-x-px lg:top-4 lg:bottom-0 lg:block lg:rounded-2xl lg:bg-zinc-900 lg:ring-1 lg:ring-zinc-800"
          />
          {tiers.map((tier) => {
            return (
              <div
                key={tier.id}
                className={classNames(
                  tier.featured
                    ? 'z-10 bg-zinc-900 shadow-xl ring-1 ring-zinc-700 lg:bg-white lg:ring-zinc-200'
                    : 'bg-white ring-1 ring-zinc-200 lg:bg-transparent lg:ring-0 lg:ring-zinc-800',
                  'relative rounded-2xl lg:rounded-b-none',
                )}
              >
                <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                  <h2
                    id={tier.id}
                    className={classNames(
                      tier.featured
                        ? 'text-white lg:text-zinc-900'
                        : 'text-zinc-900 lg:text-white',
                      'text-sm/6 font-semibold',
                    )}
                  >
                    {tier.name}
                    {tier.frequency !== 'weekly' &&
                      (tier.frequency === 'monthly' ? (
                        subType === 'personal' ? (
                          <SavedBadge amount={savedInMontlyPersonal} />
                        ) : null
                      ) : subType === 'personal' ? (
                        <SavedBadge amount={savedInYearlyPersonal} />
                      ) : (
                        <SavedBadge amount={savedInYearlyBusiness} />
                      ))}
                  </h2>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                    <div className="mt-2 flex items-center gap-x-4">
                      <p
                        className={classNames(
                          tier.featured
                            ? 'text-white lg:text-zinc-900'
                            : 'text-zinc-900 lg:text-white',
                          'text-4xl font-semibold tracking-tight',
                        )}
                      >
                        {subType === 'business'
                          ? tier.price.business !== undefined
                            ? `$${tier.price.business}`
                            : 'N/A'
                          : `$${tier.price.personal}`}
                      </p>
                      <div className="text-sm">
                        <p
                          className={
                            tier.featured
                              ? 'text-white lg:text-zinc-900'
                              : 'lg:text-white'
                          }
                        >
                          USD
                        </p>
                        <p
                          className={
                            tier.featured
                              ? 'text-zinc-400 lg:text-zinc-500'
                              : 'text-zinc-500 lg:text-zinc-400'
                          }
                        >{`Billed ${tier.frequency}`}</p>
                      </div>
                    </div>
                    <button
                      aria-describedby={tier.id}
                      onClick={() => handleBuyClick(tier)}
                      className={classNames(
                        tier.featured
                          ? 'bg-primaryColor hover:bg-primaryColor/80 shadow-sm'
                          : 'bg-zinc-700 hover:bg-zinc-600 focus-visible:outline-white',
                        'relative rounded-md px-3 py-2 text-center text-sm/6 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2',
                      )}
                    >
                      {subType === 'business' &&
                      tier.price.business === undefined
                        ? 'Not Available'
                        : 'Buy this plan'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mx-auto max-w-2xl text-center text-sm">
          Get more from IBZIM with our brand new{' '}
          <span className="font-bold">IBZIM Magazine + Premium Membership</span>{' '}
          bundle. Subscription renews automatically and you can cancel your
          subscription at any time.
        </p>
      </div>
      {selectedTier && (
        <PayDialog
          user={user}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          tier={selectedTier}
          subType={subType}
        />
      )}
    </>
  );
}
