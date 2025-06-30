'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Repeat } from 'lucide-react'; // Using Repeat icon
import Link from 'next/link';

export default function CurrencyConverterPageWrapper() {
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [zwlAmount, setZwlAmount] = useState<string>(''); // This will now represent one of the conversions, maybe parallel by default
  const [officialRate, setOfficialRate] = useState<number | null>(null);
  const [parallelRate, setParallelRate] = useState<number | null>(null);
  const [loadingRates, setLoadingRates] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [officialZigAmount, setOfficialZigAmount] = useState<string>('');
  const [parallelZigAmount, setParallelZigAmount] = useState<string>('');
  const [parallelRateSource, setParallelRateSource] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoadingRates(true);
        setError(null);

        const response = await fetch(
          'https://zimrate.tyganeutronics.com/api/v1',
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Find Official Rate (RBZ)
        const rbzRateEntry = data.USD.find(
          (rate: any) => rate.currency === 'RBZ',
        );
        if (rbzRateEntry) {
          setOfficialRate(rbzRateEntry.rate);
        } else {
          setError(
            (prev) => (prev ? prev + ', ' : '') + 'Official rate not found.',
          );
        }

        // Find Parallel Rate (OMIR or another suitable one like ZWG CASH)
        const omirRateEntry = data.USD.find(
          (rate: any) => rate.currency === 'OMIR',
        );
        const zwgCashRateEntry = data.USD.find(
          (rate: any) => rate.name === 'ZWG CASH (zimpricecheck)',
        );

        if (omirRateEntry) {
          setParallelRate(omirRateEntry.rate);
          setParallelRateSource('OMIR'); // Set source to OMIR
        } else if (zwgCashRateEntry) {
          // Use ZWG CASH if OMIR is not available
          setParallelRate(zwgCashRateEntry.rate);
          setParallelRateSource(zwgCashRateEntry.name); // Set source to ZWG CASH name
        } else {
          setError(
            (prev) => (prev ? prev + ', ' : '') + 'Parallel rate not found.',
          );
          setParallelRateSource(null); // Reset source on error
        }
      } catch (err: any) {
        console.error('Error fetching rates:', err);
        setError(`Could not fetch real-time rates: ${err.message}`);
        setOfficialRate(null);
        setParallelRate(null);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, []);

  // Function to perform both conversions
  const performConversions = (usdValue: number) => {
    if (officialRate !== null) {
      setOfficialZigAmount((usdValue * officialRate).toFixed(2));
    } else {
      setOfficialZigAmount('N/A');
    }
    if (parallelRate !== null) {
      setParallelZigAmount((usdValue * parallelRate).toFixed(2));
    } else {
      setParallelZigAmount('N/A');
    }
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usdValue = e.target.value;
    setUsdAmount(usdValue);
    setZwlAmount(''); // Clear ZWL input when changing USD

    const usdNum = parseFloat(usdValue);
    if (!isNaN(usdNum)) {
      performConversions(usdNum);
    } else {
      setOfficialZigAmount('');
      setParallelZigAmount('');
    }
  };

  const handleZwlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZwlAmount(e.target.value);

    setOfficialZigAmount('');
    setParallelZigAmount('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/tools"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-3">
            <Repeat className="text-primary h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">USD to ZiG Converter</h1>
            <p className="text-muted-foreground">
              Convert between USD and ZiG using real-time rates
            </p>
          </div>
        </div>
      </div>

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Converter</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRates ? (
            <p>Loading rates...</p>
          ) : error ? (
            <p className="text-destructive">Error: {error}</p>
          ) : officialRate === null && parallelRate === null ? (
            <p className="text-destructive">
              Could not load any rates. Please try again later.
            </p>
          ) : (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="usdInput">USD Amount</Label>
                <Input
                  id="usdInput"
                  type="number"
                  value={usdAmount}
                  onChange={handleUsdChange}
                  placeholder="Enter USD amount"
                />
              </div>

              {/* Display ZWL input field, but primarily drive conversions from USD */}
              <div>
                <Label htmlFor="zwlInput">ZiG Amount (Enter USD above)</Label>
                <Input
                  id="zwlInput"
                  type="number"
                  value={zwlAmount} // This will show the value from conversions or manual input (though conversions are based on USD)
                  onChange={handleZwlChange} // Keep onChange to allow manual ZWL input if desired, but conversions primarily from USD
                  placeholder="ZiG amount (calculated)"
                  readOnly // Make it read-only if conversions are always from USD
                />
              </div>

              {officialRate !== null && (
                <div className="text-muted-foreground mt-2 text-sm">
                  <p>Official Rate: 1 USD ≈ {officialRate.toFixed(2)} ZiG</p>
                  <p>
                    Official Conversion: {usdAmount || '0'} USD ≈{' '}
                    <span className="text-foreground font-semibold">
                      {officialZigAmount || '0.00'}
                    </span>{' '}
                    ZiG
                  </p>
                </div>
              )}

              {parallelRate !== null && (
                <div className="text-muted-foreground mt-2 text-sm">
                  {/* Display the source name if available */}
                  <p>
                    Parallel Rate ({parallelRateSource || 'N/A'}): 1 USD ≈{' '}
                    {parallelRate.toFixed(2)} ZiG
                  </p>
                  <p>
                    Parallel Conversion: {usdAmount || '0'} USD ≈{' '}
                    <span className="text-foreground font-semibold">
                      {parallelZigAmount || '0.00'}
                    </span>{' '}
                    ZiG
                  </p>
                  {/* Add information about where rates are sourced from */}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
