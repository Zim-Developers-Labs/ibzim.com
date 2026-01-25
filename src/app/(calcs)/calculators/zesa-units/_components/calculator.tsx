'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import Link from 'next/link';

// ZESA Tariff Data (as of latest rates)
const tariffData = {
  baseTariffs: {
    USD: {
      fixedCharge: 2.63,
      ruraCharge: 0.06,
      nonReraLevy: 0.3,
    },
    ZWG: {
      fixedCharge: 71.01,
      ruraCharge: 1.62,
      nonReraLevy: 8.1,
    },
  },
  unitTariffs: {
    USD: [
      { range: '0 - 50 kWh', rate: 0.0994 },
      { range: '51 - 100 kWh', rate: 0.1367 },
      { range: '101 - 200 kWh', rate: 0.1489 },
      { range: '201 - 300 kWh', rate: 0.1578 },
      { range: '301+ kWh', rate: 0.1683 },
    ],
    ZWG: [
      { range: '0 - 50 kWh', rate: 2.68 },
      { range: '51 - 100 kWh', rate: 3.69 },
      { range: '101 - 200 kWh', rate: 4.02 },
      { range: '201 - 300 kWh', rate: 4.26 },
      { range: '301+ kWh', rate: 4.54 },
    ],
  },
};

type FirstTimeOption = 'first' | 'not-first';
type CalculateOption = 'units' | 'cost';
type CurrencyOption = 'USD' | 'ZWG';
type TariffTab = 'base' | 'unit';

export default function ZesaCalculator() {
  const [firstTime, setFirstTime] = useState<FirstTimeOption>('first');
  const [calculateOption, setCalculateOption] =
    useState<CalculateOption>('units');
  const [currency, setCurrency] = useState<CurrencyOption>('USD');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [tariffTab, setTariffTab] = useState<TariffTab>('base');

  const calculateUnitsFromCost = (
    cost: number,
    isFirstTime: boolean,
    curr: CurrencyOption,
  ): number => {
    const baseTariffs = tariffData.baseTariffs[curr];
    const unitTariffs = tariffData.unitTariffs[curr];

    let availableCost = cost;
    if (isFirstTime) {
      availableCost -=
        baseTariffs.fixedCharge +
        baseTariffs.ruraCharge +
        baseTariffs.nonReraLevy;
    }

    if (availableCost <= 0) return 0;

    let totalUnits = 0;
    const bands = [50, 50, 100, 100, Number.POSITIVE_INFINITY];

    for (let i = 0; i < unitTariffs.length && availableCost > 0; i++) {
      const bandUnits = bands[i];
      const rate = unitTariffs[i].rate;
      const maxCostForBand = bandUnits * rate;

      if (
        availableCost >= maxCostForBand &&
        bandUnits !== Number.POSITIVE_INFINITY
      ) {
        totalUnits += bandUnits;
        availableCost -= maxCostForBand;
      } else {
        totalUnits += availableCost / rate;
        availableCost = 0;
      }
    }

    return Math.round(totalUnits * 100) / 100;
  };

  const calculateCostFromUnits = (
    units: number,
    isFirstTime: boolean,
    curr: CurrencyOption,
  ): number => {
    const baseTariffs = tariffData.baseTariffs[curr];
    const unitTariffs = tariffData.unitTariffs[curr];

    let totalCost = 0;
    if (isFirstTime) {
      totalCost +=
        baseTariffs.fixedCharge +
        baseTariffs.ruraCharge +
        baseTariffs.nonReraLevy;
    }

    let remainingUnits = units;
    const bands = [50, 50, 100, 100, Number.POSITIVE_INFINITY];

    for (let i = 0; i < unitTariffs.length && remainingUnits > 0; i++) {
      const bandUnits = Math.min(remainingUnits, bands[i]);
      totalCost += bandUnits * unitTariffs[i].rate;
      remainingUnits -= bandUnits;
    }

    return Math.round(totalCost * 100) / 100;
  };

  const handleCalculate = () => {
    const value = Number.parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      setResult(null);
      return;
    }

    const isFirstTime = firstTime === 'first';

    if (calculateOption === 'units') {
      const units = calculateUnitsFromCost(value, isFirstTime, currency);
      setResult(`${units} kWh`);
    } else {
      const cost = calculateCostFromUnits(value, isFirstTime, currency);
      setResult(`${currency} ${cost.toFixed(2)}`);
    }
  };

  const TabButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-teal-200 text-teal-900'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Calculator Card */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* First Time Tabs */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">
              Purchase Type
            </Label>
            <div className="flex flex-wrap gap-2">
              <TabButton
                active={firstTime === 'first'}
                onClick={() => setFirstTime('first')}
              >
                First Time This Month
              </TabButton>
              <TabButton
                active={firstTime === 'not-first'}
                onClick={() => setFirstTime('not-first')}
              >
                Not the First Time
              </TabButton>
            </div>
          </div>

          {/* Calculate Option Tabs */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Calculate</Label>
            <div className="flex gap-2">
              <TabButton
                active={calculateOption === 'units'}
                onClick={() => setCalculateOption('units')}
              >
                Calculate Units
              </TabButton>
              <TabButton
                active={calculateOption === 'cost'}
                onClick={() => setCalculateOption('cost')}
              >
                Calculate Cost
              </TabButton>
            </div>
          </div>

          {/* Currency Tabs */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Currency</Label>
            <div className="flex gap-2">
              <TabButton
                active={currency === 'USD'}
                onClick={() => setCurrency('USD')}
              >
                USD
              </TabButton>
              <TabButton
                active={currency === 'ZWG'}
                onClick={() => setCurrency('ZWG')}
              >
                ZWG
              </TabButton>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="input-value">
              {calculateOption === 'units'
                ? `Amount (${currency})`
                : 'Units (kWh)'}
            </Label>
            <Input
              id="input-value"
              type="number"
              placeholder={
                calculateOption === 'units' ? 'Enter amount' : 'Enter units'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            className="w-full bg-teal-600 text-white hover:bg-teal-700"
          >
            Calculate
          </Button>

          {/* Result Box */}
          <div
            className={`flex min-h-[60px] items-center justify-center rounded-md p-4 text-center ${
              result
                ? 'border-2 border-teal-500'
                : 'border-2 border-dashed border-zinc-300'
            }`}
          >
            {result ? (
              <div>
                <p className="text-muted-foreground text-sm">
                  {calculateOption === 'units' ? 'You will get' : 'Total Cost'}
                </p>
                <p className="text-2xl font-bold text-teal-700">{result}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Result will appear here
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tariffs Card */}
      <Card className="bg-teal-200 shadow-none" id="rates">
        <CardHeader>
          <CardTitle className="text-lg text-teal-900">Tariffs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tariff Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTariffTab('base')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tariffTab === 'base'
                  ? 'bg-teal-700 text-white'
                  : 'bg-teal-100 text-teal-800 hover:bg-teal-300'
              }`}
            >
              Base Tariffs
            </button>
            <button
              onClick={() => setTariffTab('unit')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tariffTab === 'unit'
                  ? 'bg-teal-700 text-white'
                  : 'bg-teal-100 text-teal-800 hover:bg-teal-300'
              }`}
            >
              Tariffs Per Unit
            </button>
          </div>

          {/* Tariff Content */}
          <div className="rounded-lg bg-white/50 p-4">
            {tariffTab === 'base' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-teal-900">
                    USD Charges
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-teal-800">Fixed Charge</span>
                      <span className="font-medium text-teal-900">
                        ${tariffData.baseTariffs.USD.fixedCharge.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-800">RURA Charge</span>
                      <span className="font-medium text-teal-900">
                        ${tariffData.baseTariffs.USD.ruraCharge.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-800">Non-RERA Levy</span>
                      <span className="font-medium text-teal-900">
                        ${tariffData.baseTariffs.USD.nonReraLevy.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-teal-300 pt-4">
                  <h4 className="mb-2 font-semibold text-teal-900">
                    ZWG Charges
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-teal-800">Fixed Charge</span>
                      <span className="font-medium text-teal-900">
                        ZWG {tariffData.baseTariffs.ZWG.fixedCharge.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-800">RURA Charge</span>
                      <span className="font-medium text-teal-900">
                        ZWG {tariffData.baseTariffs.ZWG.ruraCharge.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-800">Non-RERA Levy</span>
                      <span className="font-medium text-teal-900">
                        ZWG {tariffData.baseTariffs.ZWG.nonReraLevy.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-teal-900">
                    USD Rates
                  </h4>
                  <div className="space-y-1 text-sm">
                    {tariffData.unitTariffs.USD.map((tier, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-teal-800">{tier.range}</span>
                        <span className="font-medium text-teal-900">
                          ${tier.rate.toFixed(4)}/kWh
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-teal-300 pt-4">
                  <h4 className="mb-2 font-semibold text-teal-900">
                    ZWG Rates
                  </h4>
                  <div className="space-y-1 text-sm">
                    {tariffData.unitTariffs.ZWG.map((tier, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-teal-800">{tier.range}</span>
                        <span className="font-medium text-teal-900">
                          ZWG {tier.rate.toFixed(2)}/kWh
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Download and Last Updated */}
          <div className="flex flex-col gap-2 pt-2">
            {/* <Link
              href="https://magetsi.co.zw/calculators/zesa-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-teal-800 underline hover:text-teal-950"
            >
              <Download className="h-4 w-4" />
              Download Tariffs PDF
            </Link> */}
            <p className="text-xs text-teal-700">Last updated: January 2026</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
