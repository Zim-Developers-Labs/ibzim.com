'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calculator, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatCurrency(
  value: number | undefined | null,
  currency = '$',
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return `${currency}0.00`;
  }
  return `${currency}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface SummaryItem {
  label: string;
  value: string;
  effect?: string;
}

interface DutyBreakdown {
  vdp: number;
  rebate?: {
    amount: number;
    label: string;
  } | null;
  customsDuty: {
    rate: string;
    amount: number;
    note?: string;
  };
  surtax?: {
    rate: string;
    amount: number;
    note?: string;
  } | null;
  vat: {
    rate: string;
    amount: number;
  };
  totalDuty: number;
  totalCost: number;
  currency?: string;
  formulaDetails?: {
    fob: number;
    oceanFreight: number;
    roadFreight: number;
    roadFreightIsDefault: boolean;
  };
}

interface CalculatorLayoutProps {
  step: number;
  totalSteps: number;
  summaryItems: SummaryItem[];
  dutyBreakdown: DutyBreakdown | null;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  children: React.ReactNode;
}

export default function CalculatorLayout({
  step,
  totalSteps,
  summaryItems,
  dutyBreakdown,
  onBack,
  onNext,
  canProceed,
  children,
}: CalculatorLayoutProps) {
  const currency = dutyBreakdown?.currency || '$';

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Card - Input Form */}
      <div className="flex-1 rounded-t-md bg-white p-6 md:rounded-l-md md:rounded-tr-none md:p-8">
        <div className="mx-auto max-w-sm">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-slate-500">
                {Math.round((step / totalSteps) * 100)}% complete
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-all duration-300',
                    i < step ? 'bg-teal-500' : 'bg-slate-200',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[320px]">{children}</div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={step === 1}
              className="flex-1 bg-transparent"
            >
              <ChevronLeft className="mr-1 size-4" />
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!canProceed || step === totalSteps}
              className="flex-1 bg-teal-600 text-white hover:bg-teal-700"
            >
              {step === totalSteps ? 'Complete' : 'Next'}
              {step !== totalSteps && <ChevronRight className="ml-1 size-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Card - Summary */}
      <div className="flex-1 rounded-b-md bg-teal-100 p-6 md:rounded-r-md md:rounded-bl-none md:p-8">
        <div className="mx-auto max-w-sm">
          <div className="mb-6 flex items-center gap-2">
            <Calculator className="size-5 text-teal-700" />
            <h3 className="font-semibold text-teal-900">Calculation Summary</h3>
          </div>

          {summaryItems.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-200">
                <Calculator className="size-8 text-teal-600" />
              </div>
              <p className="text-teal-700">
                Fill in the details to see your duty calculation
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Options */}
              <div className="space-y-3">
                {summaryItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-2 rounded-lg bg-white/50 p-3"
                  >
                    <div>
                      <p className="text-sm text-teal-700">{item.label}</p>
                      <p className="font-medium text-teal-900">{item.value}</p>
                    </div>
                    {item.effect && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap',
                          item.effect.includes('+') ||
                            item.effect.includes('surtax') ||
                            item.effect.includes('Exceeds')
                            ? 'bg-amber-100 text-amber-700'
                            : item.effect.includes('reduced') ||
                                item.effect.includes('exempt') ||
                                item.effect.includes('met') ||
                                item.effect.includes('Meets') ||
                                item.effect.includes('Qualifies') ||
                                item.effect.includes('No surtax') ||
                                item.effect.includes('Within')
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {item.effect}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Duty Breakdown - Using formatCurrency for safe number formatting */}
              {dutyBreakdown && (
                <div className="space-y-3 border-t border-teal-200 pt-4">
                  <h4 className="mb-3 font-medium text-teal-900">
                    Duty Calculation
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="rounded-lg bg-white/70 p-3">
                      <div className="flex justify-between text-teal-700">
                        <span>Value for Duty (VDP)</span>
                        <span className="font-semibold text-teal-800">
                          {formatCurrency(dutyBreakdown.vdp, currency)}
                        </span>
                      </div>
                      {dutyBreakdown.formulaDetails && (
                        <p className="mt-1 text-xs text-teal-600">
                          FOB (
                          {formatCurrency(
                            dutyBreakdown.formulaDetails.fob,
                            currency,
                          )}
                          ) + Ocean (
                          {formatCurrency(
                            dutyBreakdown.formulaDetails.oceanFreight,
                            currency,
                          )}
                          ) + Road (
                          {formatCurrency(
                            dutyBreakdown.formulaDetails.roadFreight,
                            currency,
                          )}
                          {dutyBreakdown.formulaDetails.roadFreightIsDefault &&
                            ' @ 6%'}
                          )
                        </p>
                      )}
                    </div>

                    {dutyBreakdown.rebate && (
                      <div className="flex justify-between text-green-700">
                        <span className="flex items-center gap-1">
                          <Check className="size-3" />
                          {dutyBreakdown.rebate.label}
                        </span>
                        <span className="font-medium">
                          -
                          {formatCurrency(
                            dutyBreakdown.rebate.amount,
                            currency,
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div className="flex justify-between text-teal-700">
                        <span>
                          Customs Duty (
                          {dutyBreakdown.customsDuty?.rate || '0%'})
                        </span>
                        <span className="font-medium">
                          {dutyBreakdown.customsDuty?.note ===
                          'NO DUTY PAYABLE' ? (
                            <span className="text-green-600">NO DUTY</span>
                          ) : (
                            formatCurrency(
                              dutyBreakdown.customsDuty?.amount,
                              currency,
                            )
                          )}
                        </span>
                      </div>
                      {dutyBreakdown.customsDuty?.note &&
                        dutyBreakdown.customsDuty.note !==
                          'NO DUTY PAYABLE' && (
                          <span className="ml-4 text-xs text-teal-600">
                            {dutyBreakdown.customsDuty.note}
                          </span>
                        )}
                    </div>

                    {dutyBreakdown.surtax && (
                      <div className="flex flex-col">
                        <div className="flex justify-between text-amber-700">
                          <span>Surtax ({dutyBreakdown.surtax.rate})</span>
                          <span className="font-medium">
                            {dutyBreakdown.surtax.note ===
                            'NO SURTAX PAYABLE' ? (
                              <span className="text-green-600">NO SURTAX</span>
                            ) : (
                              formatCurrency(
                                dutyBreakdown.surtax.amount,
                                currency,
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between text-teal-700">
                      <span>VAT ({dutyBreakdown.vat?.rate || '15%'})</span>
                      <span className="font-medium">
                        {formatCurrency(dutyBreakdown.vat?.amount, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-teal-200 pt-3">
                    <div className="flex justify-between font-semibold text-teal-800">
                      <span>Total Duty Payable</span>
                      <span>
                        {formatCurrency(dutyBreakdown.totalDuty, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-teal-200/80 p-2 text-lg font-bold text-teal-900">
                      <span>Total Landing Cost</span>
                      <span>
                        {formatCurrency(dutyBreakdown.totalCost, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 rounded-lg bg-teal-200/50 p-3">
            <p className="text-xs leading-relaxed text-teal-700">
              <strong>Disclaimer:</strong> This calculator provides estimates
              only. Actual duty amounts may vary based on ZIMRA assessment.
              Values are rounded to 2 decimal places. Consult ZIMRA for official
              calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
