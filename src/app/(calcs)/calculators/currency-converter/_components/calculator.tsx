'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowRightLeft, Pencil, Check } from 'lucide-react';

const CURRENCIES = ['USD', 'ZAR', 'ZWL', 'ZIG'] as const;
type Currency = (typeof CURRENCIES)[number];
type RateType = 'official' | 'blackmarket';

const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  ZAR: 'South African Rand',
  ZWL: 'Zimbabwean Dollar',
  ZIG: 'Zimbabwe Gold',
};

const FALLBACK_RATES: Record<RateType, Record<Currency, number>> = {
  official: {
    USD: 1,
    ZAR: 18.5,
    ZWL: 6500,
    ZIG: 13.5,
  },
  blackmarket: {
    USD: 1,
    ZAR: 19.2,
    ZWL: 8500,
    ZIG: 25,
  },
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('ZIG');
  const [rateType, setRateType] = useState<RateType>('official');
  const [rates, setRates] =
    useState<Record<RateType, Record<Currency, number>>>(FALLBACK_RATES);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingRate, setEditingRate] = useState<Currency | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchRates = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD',
      );

      if (!response.ok) throw new Error('Failed to fetch rates');

      const data = await response.json();

      setRates({
        official: {
          USD: 1,
          ZAR: data.rates.ZAR || FALLBACK_RATES.official.ZAR,
          ZWL: data.rates.ZWL || FALLBACK_RATES.official.ZWL,
          ZIG: FALLBACK_RATES.official.ZIG,
        },
        blackmarket: {
          USD: 1,
          ZAR: (data.rates.ZAR || FALLBACK_RATES.official.ZAR) * 1.04,
          ZWL: (data.rates.ZWL || FALLBACK_RATES.official.ZWL) * 1.3,
          ZIG: FALLBACK_RATES.blackmarket.ZIG,
        },
      });

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Could not fetch live rates. Using fallback rates.');
      setRates(FALLBACK_RATES);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const convert = (value: number, from: Currency, to: Currency): number => {
    if (from === to) return value;
    const currentRates = rates[rateType];
    const inUSD = value / currentRates[from];
    return inUSD * currentRates[to];
  };

  const result = convert(
    Number.parseFloat(amount) || 0,
    fromCurrency,
    toCurrency,
  );

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const startEditing = (currency: Currency) => {
    setEditingRate(currency);
    setEditValue(rates[rateType][currency].toString());
  };

  const saveRate = (currency: Currency) => {
    const newRate = Number.parseFloat(editValue);
    if (!isNaN(newRate) && newRate > 0) {
      setRates((prev) => ({
        ...prev,
        [rateType]: { ...prev[rateType], [currency]: newRate },
      }));
    }
    setEditingRate(null);
  };

  const currentRates = rates[rateType];

  const isSelected = (currency: Currency) =>
    currency === fromCurrency || currency === toCurrency;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6 md:flex-row">
      {/* Converter Card */}
      <Card className="flex-1 shadow-none">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label className="text-sm text-zinc-600">Currencies</Label>
            <div className="flex flex-wrap gap-2">
              {CURRENCIES.map((currency) => (
                <Badge
                  key={currency}
                  variant={isSelected(currency) ? 'default' : 'outline'}
                  className={`cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors ${
                    isSelected(currency)
                      ? 'bg-teal-200 text-zinc-900'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    if (currency !== fromCurrency && currency !== toCurrency) {
                      setToCurrency(currency);
                    }
                  }}
                >
                  {currency}
                </Badge>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg"
            />
          </div>

          {/* Currency Selection */}
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <Label>From</Label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as Currency)}
                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={swapCurrencies}
              className="mt-6"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 space-y-2">
              <Label>To</Label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as Currency)}
                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={() => {}}>
            Convert
          </Button>

          {/* Result */}
          <div className="space-y-1 rounded-lg bg-teal-200 p-4 text-center">
            <p className="text-muted-foreground text-sm">
              {amount || '0'} {fromCurrency} =
            </p>
            <p className="text-3xl font-bold">
              {result.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              {toCurrency}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rates Card */}
      <Card className="flex-1 bg-teal-200 shadow-none" id="rates">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Exchange Rates
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRates}
              disabled={loading}
              className="gap-2 border-teal-300 bg-white/50 hover:bg-white/80"
            >
              <RefreshCw
                className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          <div className="flex rounded-lg bg-white/40 p-1">
            <button
              onClick={() => setRateType('official')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                rateType === 'official'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-teal-700 hover:bg-white/50'
              }`}
            >
              Official
            </button>
            <button
              onClick={() => setRateType('blackmarket')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                rateType === 'blackmarket'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-teal-700 hover:bg-white/50'
              }`}
            >
              Black Market
            </button>
          </div>

          <p className="text-sm text-teal-700">1 USD equals</p>
        </CardHeader>

        <CardContent className="space-y-3">
          {error && (
            <p className="rounded bg-amber-100 p-2 text-xs text-amber-700">
              {error}
            </p>
          )}

          <div className="space-y-2">
            {CURRENCIES.filter((c) => c !== 'USD').map((currency) => (
              <div
                key={currency}
                className="flex items-center justify-between rounded-md bg-white/60 p-3"
              >
                <div>
                  <span className="font-medium">{currency}</span>
                  <span className="ml-2 text-xs text-teal-700">
                    {CURRENCY_NAMES[currency]}
                  </span>
                </div>

                {editingRate === currency ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-24 bg-white text-sm"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => saveRate(currency)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {currentRates[currency].toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-teal-100"
                      onClick={() => startEditing(currency)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {lastUpdated && (
            <p className="pt-2 text-center text-xs text-teal-700">
              Last updated: {lastUpdated ? lastUpdated : 'N/A'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
