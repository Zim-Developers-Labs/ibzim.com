'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calculator } from 'lucide-react';
import Link from 'next/link';

const zesaTariffs = [
  { minUnits: 1, maxUnits: 50, pricePerUnit: 2.29 },
  { minUnits: 51, maxUnits: 100, pricePerUnit: 2.58 },
  { minUnits: 101, maxUnits: 200, pricePerUnit: 4.59 },
  { minUnits: 201, maxUnits: 300, pricePerUnit: 6.6 },
  { minUnits: 301, maxUnits: 400, pricePerUnit: 7.17 },
];

export default function ZesaCalculatorPageWrapper() {
  const [unitsInput, setUnitsInput] = useState<string>('');
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculation = () => {
    const numUnits = parseFloat(unitsInput);

    if (isNaN(numUnits) || numUnits < 0) {
      setError('Please enter a valid number of units.');
      setCalculatedCost(null);
      return;
    }
    if (numUnits === 0) {
      setCalculatedCost(0);
      setError(null);
      return;
    }

    if (numUnits > 400) {
      setError(
        'Calculator currently supports up to 400 units based on available data. Please contact ZESA for tariffs above 400 units.',
      );
      setCalculatedCost(null);
      return;
    }

    setError(null); // Clear previous errors
    let totalCost = 0;
    let remainingUnitsToCalculate = numUnits;

    for (const band of zesaTariffs) {
      if (remainingUnitsToCalculate <= 0) break;

      const unitsInThisBand = band.maxUnits - (band.minUnits - 1);
      const unitsToChargeInThisBand = Math.min(
        remainingUnitsToCalculate,
        unitsInThisBand,
      );

      if (numUnits >= band.minUnits) {
        totalCost += unitsToChargeInThisBand * band.pricePerUnit;
        remainingUnitsToCalculate -= unitsToChargeInThisBand;
      }
    }

    setCalculatedCost(totalCost);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/#ib-tools"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-3">
            <Calculator className="text-primary h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              ZESA Calculator (Units to ZiG)
            </h1>
            <p className="text-muted-foreground">
              Calculate ZESA electricity cost based on units consumed
            </p>
          </div>
        </div>
      </div>

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Calculate Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="unitsInput">Enter Units (kWh)</Label>
              <Input
                id="unitsInput"
                type="number"
                value={unitsInput}
                onChange={(e) => setUnitsInput(e.target.value)}
                placeholder="e.g. 150"
                min="0"
                step="1"
              />
            </div>

            <Button onClick={handleCalculation}>Calculate Cost</Button>

            {error && (
              <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}

            {calculatedCost !== null && !error && (
              <div className="mt-4 rounded-md border border-green-400 bg-green-100 p-4 text-green-700">
                <p className="text-sm text-green-800">Estimated Cost:</p>
                <p className="text-2xl font-bold text-green-900">
                  ZiG {calculatedCost.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-green-800">
                  (Based on {parseFloat(unitsInput).toFixed(2)} units)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mx-auto mt-8 max-w-md">
        <CardHeader>
          <CardTitle>Current Tariffs</CardTitle>
          <CardDescription>Price per unit including RE Levy</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground list-inside list-disc text-sm">
            {zesaTariffs.map((band, index) => (
              <li key={index}>
                {band.minUnits} - {band.maxUnits} Units: ZiG{' '}
                {band.pricePerUnit.toFixed(2)} per unit
              </li>
            ))}
            <li>
              Above 400 Units: Tariff data not available in this calculator.
            </li>
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">
            Please note that these tariffs are approximate and may change.
            Always verify with ZESA or an official source.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
