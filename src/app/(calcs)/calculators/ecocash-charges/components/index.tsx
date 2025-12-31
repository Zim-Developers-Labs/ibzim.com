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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Calculator,
  ArrowLeft,
  DollarSign,
  Settings,
  Info,
  Edit3,
} from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Container from '@/components/container';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

type TransactionType =
  | 'send'
  | 'withdraw'
  | 'send_to_account'
  | 'direct_payments'
  | 'mastercard';
type Currency = 'USD' | 'ZWL';

interface FeeStructure {
  min: number;
  max: number;
  feePercentage: number;
  fixedFee?: number;
}

interface EditableFees {
  send: FeeStructure[];
  withdraw: FeeStructure[];
  send_to_account: FeeStructure[];
  direct_payments: FeeStructure[];
  mastercard: FeeStructure[];
  imtTaxRate: number;
  exchangeRate: number;
}

const defaultFeeStructures: EditableFees = {
  send: [
    { min: 1.0, max: 4.99, feePercentage: 1.3 },
    { min: 5.0, max: 500, feePercentage: 1.3 },
  ],
  withdraw: [
    { min: 1.0, max: 4.99, feePercentage: 1.7 },
    { min: 5.0, max: 500, feePercentage: 1.7 },
  ],
  send_to_account: [{ min: 1.0, max: 500, feePercentage: 2.0 }],
  direct_payments: [{ min: 1.0, max: 500, feePercentage: 1.5, fixedFee: 0.5 }],
  mastercard: [{ min: 1.0, max: 500, feePercentage: 3.5 }],
  imtTaxRate: 0.02,
  exchangeRate: 27.5, // USD to ZWL rate
};

function calculateFee(
  amount: number,
  transactionType: TransactionType,
  currency: Currency,
  feeStructures: EditableFees,
): { baseFee: number; imtTax: number; totalFee: number; fixedFee: number } {
  // Convert to USD for calculation if needed
  const usdAmount =
    currency === 'ZWL' ? amount / feeStructures.exchangeRate : amount;

  const structure = feeStructures[transactionType];
  const tier = structure.find(
    (tier) => usdAmount >= tier.min && usdAmount <= tier.max,
  );

  let baseFee = 0;
  let fixedFee = 0;
  let imtTax = 0;
  let totalFee = 0;

  if (tier) {
    baseFee = (usdAmount * tier.feePercentage) / 100;
    fixedFee = tier.fixedFee || 0;

    // IMT Tax applies to send transactions >= $5 and send_to_account
    if (
      (transactionType === 'send' || transactionType === 'send_to_account') &&
      usdAmount >= 5.0
    ) {
      imtTax = usdAmount * feeStructures.imtTaxRate;
    }

    totalFee = baseFee + fixedFee + imtTax;
  }

  // Convert back to original currency
  if (currency === 'ZWL') {
    baseFee *= feeStructures.exchangeRate;
    fixedFee *= feeStructures.exchangeRate;
    imtTax *= feeStructures.exchangeRate;
    totalFee *= feeStructures.exchangeRate;
  }

  return { baseFee, imtTax, totalFee, fixedFee };
}

function calculateReceiverAmount(
  receiverAmount: number,
  transactionType: TransactionType,
  currency: Currency,
  feeStructures: EditableFees,
): {
  senderAmount: number;
  senderFee: number;
  receiverWithdrawalFee: number;
  totalSenderPays: number;
} {
  // Calculate what receiver will pay to withdraw
  const receiverWithdrawalFee = calculateFee(
    receiverAmount,
    'withdraw',
    currency,
    feeStructures,
  ).totalFee;

  // The amount sender needs to send (before sender fees)
  const senderAmount = receiverAmount + receiverWithdrawalFee;

  // Calculate sender's fees
  const senderFee = calculateFee(
    senderAmount,
    transactionType,
    currency,
    feeStructures,
  ).totalFee;

  // Total amount sender pays
  const totalSenderPays = senderAmount + senderFee;

  return { senderAmount, senderFee, receiverWithdrawalFee, totalSenderPays };
}

export default function EcocashCalculatorPageComponents() {
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] =
    useState<TransactionType>('send');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [calculationMode, setCalculationMode] = useState<'sender' | 'receiver'>(
    'sender',
  );
  const [feeStructures, setFeeStructures] =
    useState<EditableFees>(defaultFeeStructures);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const numAmount = Number.parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setResult(null);
      return;
    }

    if (
      calculationMode === 'receiver' &&
      (transactionType === 'send' || transactionType === 'send_to_account')
    ) {
      // Calculate based on receiver amount
      const receiverCalc = calculateReceiverAmount(
        numAmount,
        transactionType,
        currency,
        feeStructures,
      );
      setResult({
        mode: 'receiver',
        receiverAmount: numAmount,
        ...receiverCalc,
        currency,
        transactionType,
      });
    } else {
      // Calculate based on sender amount
      const { baseFee, imtTax, totalFee, fixedFee } = calculateFee(
        numAmount,
        transactionType,
        currency,
        feeStructures,
      );

      let totalToSend: number | undefined;
      let amountReceived: number | undefined;

      if (transactionType === 'send' || transactionType === 'send_to_account') {
        totalToSend = numAmount + totalFee;
      } else if (transactionType === 'withdraw') {
        amountReceived = numAmount - totalFee;
      } else {
        totalToSend = numAmount + totalFee;
      }

      setResult({
        mode: 'sender',
        amount: numAmount,
        baseFee,
        imtTax,
        totalFee,
        fixedFee,
        totalToSend,
        amountReceived,
        currency,
        transactionType,
      });
    }
  };

  const updateFeeStructure = (type: keyof EditableFees, value: any) => {
    setFeeStructures((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const transactionTypeLabels: Record<TransactionType, string> = {
    send: 'Send Money',
    withdraw: 'Cash Withdrawal',
    send_to_account: 'Send to Bank Account',
    direct_payments: 'Direct Payments (DSTV/ZESA)',
    mastercard: 'Mastercard Transaction',
  };

  const currencySymbols: any = {
    USD: '$',
    ZWL: 'ZWL$',
  };

  return (
    <div className="bg-zinc-50">
      <Container className="py-12">
        <div className="mb-6">
          <div className="mb-4 flex gap-3 sm:items-center">
            <Avatar className="h-16 w-16 rounded-md border border-zinc-300">
              <AvatarImage
                src="/assets/calc-logos/ecocash.png"
                alt={`ZiG and USD Ecocash Calculator logo`}
              />
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                ZiG and USD EcoCash Calculator
              </h1>
              <p className="text-muted-foreground">
                Calculate EcoCash transaction fees with advanced options
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 border border-zinc-200 bg-white">
            <TabsTrigger
              value="calculator"
              className="data-[state=active]:bg-primaryColor/80 cursor-pointer px-4 data-[state=active]:text-zinc-900"
            >
              Calculator
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primaryColor/80 cursor-pointer px-4 data-[state=active]:text-zinc-900"
            >
              Fee Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card className="bg-teal-200 shadow-none">
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                  <CardDescription className="text-zinc-600">
                    Configure your transaction parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={currency}
                        onValueChange={(value: Currency) => setCurrency(value)}
                      >
                        <SelectTrigger className="border-zinc-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="ZWL">ZWL (ZWL$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-type">Transaction Type</Label>
                      <Select
                        value={transactionType}
                        onValueChange={(value: TransactionType) =>
                          setTransactionType(value)
                        }
                      >
                        <SelectTrigger className="border-zinc-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(transactionTypeLabels).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(transactionType === 'send' ||
                    transactionType === 'send_to_account') && (
                    <div className="space-y-3">
                      <Label>Calculation Mode</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="calculation-mode"
                            checked={calculationMode === 'receiver'}
                            onCheckedChange={(checked) =>
                              setCalculationMode(
                                checked ? 'receiver' : 'sender',
                              )
                            }
                          />
                          <Label htmlFor="calculation-mode" className="text-sm">
                            {calculationMode === 'receiver'
                              ? 'Amount receiver gets'
                              : 'Amount sender pays'}
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      {calculationMode === 'receiver' &&
                      (transactionType === 'send' ||
                        transactionType === 'send_to_account')
                        ? `Amount receiver should get (${currencySymbols[currency]})`
                        : `Transaction Amount (${currencySymbols[currency]})`}
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`Enter amount in ${currency}`}
                      value={amount}
                      className="border-zinc-600 placeholder:text-zinc-700"
                      onChange={(e) => setAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                  <Button onClick={handleCalculate} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Fees
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Calculation Results</CardTitle>
                  <CardDescription>
                    Detailed fee breakdown and amounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      {result.mode === 'receiver' ? (
                        // Receiver mode results
                        <div className="space-y-4">
                          <div className="rounded-lg bg-blue-50 p-4">
                            <div className="text-muted-foreground text-sm">
                              Receiver Gets
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {currencySymbols[result.currency]}{' '}
                              {result.receiverAmount.toFixed(2)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="text-muted-foreground text-xs">
                                Amount to Send
                              </div>
                              <div className="text-lg font-semibold">
                                {currencySymbols[result.currency]}{' '}
                                {result.senderAmount.toFixed(2)}
                              </div>
                            </div>
                            <div className="rounded-lg bg-red-50 p-3">
                              <div className="text-muted-foreground text-xs">
                                Sender&#39;s Fee
                              </div>
                              <div className="text-lg font-semibold text-red-600">
                                {currencySymbols[result.currency]}{' '}
                                {result.senderFee.toFixed(2)}
                              </div>
                            </div>
                            <div className="rounded-lg bg-orange-50 p-3">
                              <div className="text-muted-foreground text-xs">
                                Receiver Withdrawal Fee
                              </div>
                              <div className="text-lg font-semibold text-orange-600">
                                {currencySymbols[result.currency]}{' '}
                                {result.receiverWithdrawalFee.toFixed(2)}
                              </div>
                            </div>
                            <div className="bg-primary/5 rounded-lg p-3">
                              <div className="text-muted-foreground text-xs">
                                Total Sender Pays
                              </div>
                              <div className="text-primary text-lg font-bold">
                                {currencySymbols[result.currency]}{' '}
                                {result.totalSenderPays.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Sender mode results
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <div className="text-muted-foreground text-sm">
                                Transaction Amount
                              </div>
                              <div className="text-2xl font-bold">
                                {currencySymbols[result.currency]}{' '}
                                {result.amount.toFixed(2)}
                              </div>
                            </div>
                            <div className="rounded-lg border border-red-200 bg-red-100/50 p-4">
                              <div className="text-muted-foreground text-sm">
                                Base Fee
                              </div>
                              <div className="text-xl font-bold text-red-600">
                                {currencySymbols[result.currency]}{' '}
                                {result.baseFee.toFixed(2)}
                              </div>
                            </div>
                            {result.fixedFee > 0 && (
                              <div className="rounded-lg border border-red-200 bg-red-100/50 p-4">
                                <div className="text-muted-foreground text-sm">
                                  Fixed Fee
                                </div>
                                <div className="text-xl font-bold text-red-600">
                                  {currencySymbols[result.currency]}{' '}
                                  {result.fixedFee.toFixed(2)}
                                </div>
                              </div>
                            )}
                            {result.imtTax > 0 && (
                              <div className="rounded-lg border border-red-200 bg-red-100/50 p-4">
                                <div className="text-muted-foreground text-sm">
                                  IMT Tax (2%)
                                </div>
                                <div className="text-xl font-bold text-red-600">
                                  {currencySymbols[result.currency]}{' '}
                                  {result.imtTax.toFixed(2)}
                                </div>
                              </div>
                            )}
                            <div className="rounded-lg border border-red-200 bg-red-100/50 p-4">
                              <div className="text-muted-foreground text-sm">
                                Total Fee
                              </div>
                              <div className="text-2xl font-bold text-red-600">
                                {currencySymbols[result.currency]}{' '}
                                {result.totalFee.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            {result.totalToSend !== undefined ? (
                              <div className="bg-primary/5 rounded-lg p-4">
                                <div className="text-muted-foreground text-sm">
                                  Total Amount to Pay
                                </div>
                                <div className="text-primary text-3xl font-bold">
                                  {currencySymbols[result.currency]}{' '}
                                  {result.totalToSend.toFixed(2)}
                                </div>
                              </div>
                            ) : result.amountReceived !== undefined ? (
                              <div className="rounded-lg bg-green-50 p-4">
                                <div className="text-muted-foreground text-sm">
                                  Net Amount Received
                                </div>
                                <div className="text-3xl font-bold text-green-600">
                                  {currencySymbols[result.currency]}{' '}
                                  {result.amountReceived.toFixed(2)}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground py-8 text-center">
                      <DollarSign className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>Enter transaction details to calculate fees</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Editable Fee Structures
                </CardTitle>
                <CardDescription>
                  Customize fee rates and charges. Changes are temporary and
                  reset on page reload.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Exchange Rate & Tax
                    </Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="exchange-rate">USD to ZWL Rate</Label>
                        <Input
                          id="exchange-rate"
                          type="number"
                          value={feeStructures.exchangeRate}
                          onChange={(e) =>
                            updateFeeStructure(
                              'exchangeRate',
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imt-tax">IMT Tax Rate (%)</Label>
                        <Input
                          id="imt-tax"
                          type="number"
                          value={feeStructures.imtTaxRate * 100}
                          onChange={(e) =>
                            updateFeeStructure(
                              'imtTaxRate',
                              (Number.parseFloat(e.target.value) || 0) / 100,
                            )
                          }
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  {Object.entries(transactionTypeLabels).map(([key, label]) => (
                    <div key={key} className="space-y-3">
                      <Label className="text-base font-semibold">{label}</Label>
                      {feeStructures[key as TransactionType].map(
                        (tier, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-4"
                          >
                            <div className="space-y-1">
                              <Label className="text-xs">Min ($)</Label>
                              <Input
                                type="number"
                                value={tier.min}
                                onChange={(e) => {
                                  const newStructure = [
                                    ...feeStructures[key as TransactionType],
                                  ];
                                  newStructure[index] = {
                                    ...tier,
                                    min: Number.parseFloat(e.target.value) || 0,
                                  };
                                  updateFeeStructure(
                                    key as TransactionType,
                                    newStructure,
                                  );
                                }}
                                step="0.01"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Max ($)</Label>
                              <Input
                                type="number"
                                value={tier.max}
                                onChange={(e) => {
                                  const newStructure = [
                                    ...feeStructures[key as TransactionType],
                                  ];
                                  newStructure[index] = {
                                    ...tier,
                                    max: Number.parseFloat(e.target.value) || 0,
                                  };
                                  updateFeeStructure(
                                    key as TransactionType,
                                    newStructure,
                                  );
                                }}
                                step="0.01"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Fee (%)</Label>
                              <Input
                                type="number"
                                value={tier.feePercentage}
                                onChange={(e) => {
                                  const newStructure = [
                                    ...feeStructures[key as TransactionType],
                                  ];
                                  newStructure[index] = {
                                    ...tier,
                                    feePercentage:
                                      Number.parseFloat(e.target.value) || 0,
                                  };
                                  updateFeeStructure(
                                    key as TransactionType,
                                    newStructure,
                                  );
                                }}
                                step="0.1"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Fixed Fee ($)</Label>
                              <Input
                                type="number"
                                value={tier.fixedFee || 0}
                                onChange={(e) => {
                                  const newStructure = [
                                    ...feeStructures[key as TransactionType],
                                  ];
                                  newStructure[index] = {
                                    ...tier,
                                    fixedFee:
                                      Number.parseFloat(e.target.value) || 0,
                                  };
                                  updateFeeStructure(
                                    key as TransactionType,
                                    newStructure,
                                  );
                                }}
                                step="0.01"
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setFeeStructures(defaultFeeStructures)}
                    className="w-full"
                  >
                    Reset to Default Values
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 shadow-none">
          <CardHeader>
            <CardTitle>Transaction Types Information</CardTitle>
            <CardDescription>
              Understanding different EcoCash transaction types and their fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Send Money</h4>
                  <p className="text-muted-foreground text-sm">
                    Person-to-person transfers within EcoCash network. IMT tax
                    applies to amounts ≥ $5.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Cash Withdrawal</h4>
                  <p className="text-muted-foreground text-sm">
                    Withdrawing cash from EcoCash agents. No IMT tax applies.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Send to Bank Account</h4>
                  <p className="text-muted-foreground text-sm">
                    Direct transfers to bank accounts. Higher fees and IMT tax
                    applies.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Direct Payments</h4>
                  <p className="text-muted-foreground text-sm">
                    Bill payments (DSTV, ZESA, etc.). Usually includes fixed
                    fees plus percentage.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Mastercard</h4>
                  <p className="text-muted-foreground text-sm">
                    International card transactions. Higher fees due to forex
                    and processing costs.
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Receiver Amount Calculator:</strong> When sending
                  money, you can calculate how much to send so the receiver gets
                  a specific amount after their withdrawal fees are deducted.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
        {/* Shortcuts */}
        <Card className="mt-8 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">
              <h2>Common Ecocash USSD Codes</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-teal-200 p-3">
                <p className="mb-1 text-xs text-zinc-700">Send Money</p>
                <p className="font-mono text-sm font-medium">
                  *153*1*1*number*amount#
                </p>
              </div>
              <div className="rounded-lg bg-teal-200 p-3">
                <p className="mb-1 text-xs text-zinc-700">Cash Out</p>
                <p className="font-mono text-sm font-medium">
                  *153*3*1*agent*amount#
                </p>
              </div>
              <div className="rounded-lg bg-teal-200 p-3">
                <p className="mb-1 text-xs text-zinc-700">Pay Merchant</p>
                <p className="font-mono text-sm font-medium">
                  *153*2*2*code*amount#
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-12">
          <div className="mb-3 text-lg font-semibold">Other Calculators</div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Link
              href="/calculators/zimbabwe-distance-table"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zinara.png"
                  alt={`Distance Table Calculator ZINARA logo`}
                />
              </Avatar>
              Distance Table
            </Link>
            <Link
              href="/calculators/currency-converter"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
              rounded-md
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zig.png"
                  alt={`ZiG/ZWL Currency Converter logo`}
                />
              </Avatar>
              Currency Converter
            </Link>
            <Link
              href="/calculators/zesa-units"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
              rounded-md
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zesa.png"
                  alt={`ZESA logo`}
                />
              </Avatar>
              ZESA Calculator
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
