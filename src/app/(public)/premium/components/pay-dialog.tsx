'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';

interface PaymentMethod {
  id: number;
  provider: string;
  type: string;
  maskedNumber: string;
  isDefault: boolean;
}

interface TierType {
  id: string;
  name: string;
  price: {
    personal: number;
    business?: number;
  };
  frequency: string;
}

interface PayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: TierType;
  subType: string;
}

const PAYMENT_OPTIONS = [
  { id: 'ecocash', name: 'Ecocash', icon: Icons.payWithEcocashLogo },
  { id: 'stripe', name: 'Stripe', icon: Icons.payWithStripeLogo },
  {
    id: 'peyapeya',
    name: 'Peya Paya',
    subtitle: 'fantasy points',
    icon: Icons.payWithPeyaPeyaLogo,
  },
];

export function PayDialog({
  open,
  onOpenChange,
  tier,
  subType,
}: PayDialogProps) {
  const [defaultPaymentMethod, setDefaultPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Fetch default payment method
      fetchDefaultPaymentMethod();
    }
  }, [open]);

  const fetchDefaultPaymentMethod = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payment-methods/default');
      if (response.ok) {
        const data = await response.json();
        setDefaultPaymentMethod(data);
      }
    } catch (error) {
      console.error('Failed to fetch payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!selectedProvider && !defaultPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const provider = selectedProvider || defaultPaymentMethod?.provider;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          subType,
          provider,
          paymentMethodId: defaultPaymentMethod?.id,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const price =
    subType === 'business' ? tier.price.business : tier.price.personal;
  const billingText =
    tier.frequency === 'monthly' ? 'Every month' : `Every ${tier.frequency}`;

  const handlePayOptionClick = (option: string) => {
    setSelectedProvider(option);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Subscribing to
          </DialogTitle>
          <DialogClose className="border-input hover:bg-accent rounded-md border p-1" />
        </div>

        <div className="space-y-6">
          {/* Plan Details */}
          <div className="space-y-4 border-b pb-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold text-teal-600">
                {tier.name}
              </h3>
              <div className="text-right">
                <p className="text-2xl font-bold">${price}</p>
                <p className="text-muted-foreground text-sm">
                  {' '}
                  {tier.frequency === 'monthly'
                    ? '/mo'
                    : tier.frequency === 'yearly'
                      ? '/yr'
                      : '/wk'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next charge</span>
                <span className="font-medium">${price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing</span>
                <span className="font-medium">
                  {billingText.replace('ly', '')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          {loading ? (
            <div className="text-muted-foreground text-center text-sm">
              Loading payment methods...
            </div>
          ) : defaultPaymentMethod ? (
            <div className="space-y-3">
              <div className="border-input bg-muted/50 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {defaultPaymentMethod.provider}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {defaultPaymentMethod.maskedNumber}
                    </p>
                  </div>
                  <span className="text-lg">💳</span>
                </div>
              </div>
              <Link href="/payment-methods">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-sm"
                >
                  Edit Payment Methods
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">Select a payment method:</p>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handlePayOptionClick(option.id)}
                    className="overflow-hidden rounded-md border-2 border-transparent hover:border-2 hover:border-teal-300"
                  >
                    <option.icon className="h-auto w-full" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Today's Charge */}
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Today's charge</span>
              <span className="font-bold">${price}</span>
            </div>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayNow}
            className="w-full bg-teal-600 py-2 font-semibold text-white hover:bg-teal-700"
          >
            Pay now
          </Button>

          {/* Footer Text */}
          <p className="text-muted-foreground text-center text-xs">
            All prices are in US dollars and include tax.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
