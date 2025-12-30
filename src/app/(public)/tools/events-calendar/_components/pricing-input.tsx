'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function PricingSection() {
  const [pricingTiers, setPricingTiers] = useState([
    { name: 'Standard', price: '0' },
  ]);

  const addPricingTier = () => {
    setPricingTiers((prev) => [...prev, { name: '', price: '0' }]);
  };

  const updatePricingTier = (
    index: number,
    field: 'name' | 'price',
    value: string,
  ) => {
    setPricingTiers((prev) =>
      prev.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier)),
    );
  };

  const removePricingTier = (index: number) => {
    if (pricingTiers.length > 1) {
      setPricingTiers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const formatPrice = (cents: string) => {
    const amount = Number.parseInt(cents) || 0;
    return (amount / 100).toFixed(2);
  };

  const handleSubmit = () => {
    console.log('Pricing Tiers:', pricingTiers);
    toast.success('Pricing tiers saved successfully!');
  };

  const resetPricing = () => {
    setPricingTiers([{ name: 'Standard', price: '0' }]);
    toast.info('Pricing tiers reset to default');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Event Pricing Configuration
            </CardTitle>
            <p className="text-muted-foreground">
              Set up multiple pricing tiers for your event. Start with the
              default &quot;Standard&quot; tier and add more as needed.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pricing Tiers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Pricing Tiers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPricingTier}
                  className="h-9"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tier
                </Button>
              </div>

              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 rounded-lg border bg-white p-4"
                >
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`pricing-name-${index}`}
                      className="text-sm font-medium"
                    >
                      Pricing Name
                    </Label>
                    <Input
                      id={`pricing-name-${index}`}
                      placeholder="e.g., Standard, VIP, Early Bird"
                      value={tier.name}
                      onChange={(e) =>
                        updatePricingTier(index, 'name', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`pricing-price-${index}`}
                      className="text-sm font-medium"
                    >
                      Price (in cents)
                    </Label>
                    <Input
                      id={`pricing-price-${index}`}
                      type="number"
                      placeholder="0"
                      value={tier.price}
                      onChange={(e) =>
                        updatePricingTier(index, 'price', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  {pricingTiers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePricingTier(index)}
                      className="h-10 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <p className="text-muted-foreground text-sm">
                💡 Enter prices in cents (e.g., 1050 for $10.50). Set to 0 for
                free tiers.
              </p>
            </div>

            {/* Preview Section */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Pricing Preview</Label>
              <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-4">
                {pricingTiers.map((tier, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-1 text-sm"
                  >
                    {tier.name || `Tier ${index + 1}`}:{' '}
                    {Number.parseInt(tier.price) > 0
                      ? `$${formatPrice(tier.price)}`
                      : 'Free'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                Save Pricing Tiers
              </Button>
              <Button
                onClick={resetPricing}
                variant="outline"
                className="flex-1"
              >
                Reset to Default
              </Button>
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-900">
                Current Configuration:
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Total pricing tiers: {pricingTiers.length}</li>
                <li>
                  • Free tiers:{' '}
                  {
                    pricingTiers.filter(
                      (tier) => Number.parseInt(tier.price) === 0,
                    ).length
                  }
                </li>
                <li>
                  • Paid tiers:{' '}
                  {
                    pricingTiers.filter(
                      (tier) => Number.parseInt(tier.price) > 0,
                    ).length
                  }
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
