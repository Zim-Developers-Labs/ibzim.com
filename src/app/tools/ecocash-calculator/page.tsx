'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';

type TransactionType = 'send' | 'withdraw';

interface FeeStructure {
  min: number;
  max: number;
  feePercentage: number;
}

const feeStructures: Record<TransactionType, FeeStructure[]> = {
  send: [
    { min: 1.0, max: 4.99, feePercentage: 1.3 },
    { min: 5.0, max: 500, feePercentage: 1.3 },
  ],
  withdraw: [
    { min: 1.0, max: 4.99, feePercentage: 1.7 },
    { min: 5.0, max: 500, feePercentage: 1.7 },
  ],
};

const imtTaxRate = 0.02;

function calculateFee(
  amount: number,
  transactionType: TransactionType,
): { baseFee: number; imtTax: number; totalFee: number } {
  const structure = feeStructures[transactionType];
  const tier = structure.find(
    (tier) => amount >= tier.min && amount <= tier.max,
  );

  let baseFee = 0;
  let imtTax = 0;
  let totalFee = 0;

  if (tier) {
    baseFee = (amount * tier.feePercentage) / 100;

    if (transactionType === 'send' && amount >= 5.0) {
      imtTax = amount * imtTaxRate;
    }

    totalFee = baseFee + imtTax;
  }

  return { baseFee, imtTax, totalFee };
}

export default function EcoCashCalculatorPage() {
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] =
    useState<TransactionType>('send');
  const [result, setResult] = useState<{
    amount: number;
    baseFee: number;
    imtTax: number;
    totalFee: number;
    totalToSend?: number;
    amountReceived?: number;
  } | null>(null);

  const handleCalculate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setResult(null);
      return;
    }

    const { baseFee, imtTax, totalFee } = calculateFee(
      numAmount,
      transactionType,
    );

    let totalToSend: number | undefined;
    let amountReceived: number | undefined;

    if (transactionType === 'send') {
      totalToSend = numAmount + totalFee;
    } else if (transactionType === 'withdraw') {
      amountReceived = numAmount - totalFee;
    }

    setResult({
      amount: numAmount,
      baseFee,
      imtTax,
      totalFee,
      totalToSend,
      amountReceived,
    });
  };

  const transactionTypeLabels: Record<TransactionType, string> = {
    send: 'Send Money',
    withdraw: 'Cash Withdrawal',
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
            <Calculator className="text-primary h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">EcoCash USD Calculator</h1>
            <p className="text-muted-foreground">
              Calculate EcoCash USD transaction fees and charges
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              Enter your transaction amount and type to calculate fees (USD)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount in USD"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select
                value={transactionType}
                onValueChange={(value: TransactionType) =>
                  setTransactionType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(transactionTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Fee
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
            <CardDescription>
              Fee breakdown and total amounts of USD
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">
                      Transaction Amount
                    </div>
                    <div className="text-2xl font-bold">
                      USD {result.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-100/50 p-4">
                    <div className="text-muted-foreground text-sm">
                      Base Fee
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      USD {result.baseFee.toFixed(2)}
                    </div>
                  </div>
                  {result.imtTax > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-100/50 p-4">
                      <div className="text-muted-foreground text-sm">
                        IMT Tax (2%)
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        USD {result.imtTax.toFixed(2)}
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-lg border p-4 ${result.totalFee > 0 ? 'border-red-200 bg-red-100/50' : 'border-green-200 bg-green-100/50'}`}
                  >
                    <div className="text-muted-foreground text-sm">
                      Total Fee
                    </div>
                    <div
                      className={`text-2xl font-bold ${result.totalFee > 0 ? 'text-red-600' : 'text-green-600'}`}
                    >
                      USD {result.totalFee.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {transactionType === 'send' ? (
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="text-muted-foreground text-sm">
                        Total Amount to Pay (Amount + Fee)
                      </div>
                      <div className="text-primary text-3xl font-bold">
                        USD {result.totalToSend?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  ) : transactionType === 'withdraw' ? (
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="text-muted-foreground text-sm">
                        Net Amount Received (Amount - Fee)
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        USD {result.amountReceived?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <DollarSign className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>
                  Enter an amount and select transaction type to calculate fees
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Fee Information</CardTitle>
          <CardDescription>
            Understanding EcoCash USD transaction fees (Registered Customer)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-muted-foreground mb-4 text-sm">
              EcoCash USD transaction fees for Registered Customers are
              calculated based on transaction type and amount band:
            </p>

            <h4 className="mb-2 font-semibold">Send Money</h4>
            <ul className="text-muted-foreground mb-4 list-inside list-disc text-sm">
              <li>$1.00 - $4.99: 1.30% fee</li>
              <li>$5.00 - $500: 1.30% base fee + 2% IMT Tax</li>
              <li>Cash In transactions are FREE.</li>
            </ul>

            <h4 className="mt-4 mb-2 font-semibold">Cash Withdrawal</h4>
            <ul className="text-muted-foreground mb-4 list-inside list-disc text-sm">
              <li>$1.00 - $4.99: 1.70% fee</li>
              <li>$5.00 - $500: 1.70% fee</li>
              <li>IMT Tax does NOT apply to Cash Out transactions.</li>
            </ul>

            <p className="text-muted-foreground mt-4 text-sm">
              Please note that fees may change, and you should verify current
              rates with EcoCash on their official website. This calculator is
              based on the tariffs published on
              <a
                href="https://www.ecocash.co.zw/usd-tariffs-limits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                EcoCash&#39;s official USD Tariffs page
              </a>{' '}
              as of [Current Date - Note: You might want to make this dynamic].
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
