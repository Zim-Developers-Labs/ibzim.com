'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import {
  Package,
  DollarSign,
  Truck,
  Tag,
  AlertCircle,
  UserCheck,
  Info,
  Check,
  ExternalLink,
  ArrowRightLeft,
} from 'lucide-react';
import CalculatorLayout from './layout';
import { EligibilityModal } from './eligibility-modal';
import {
  GOODS_CATEGORIES,
  GOODS_SUBCATEGORIES,
  IMPORTATION_METHODS,
  EXCHANGE_RATES,
  VAT_RATE,
  SURTAX_RATE_GOODS,
  prec,
  type GoodsCategoryKey,
  type ImportationMethodKey,
  type CurrencyCode,
  INVOICE_CURRENCIES,
  getExchangeRate,
  convertBetweenCurrencies,
  type InvoiceCurrencyKey,
} from './constants';
import ReactCountryFlag from 'react-country-flag';

interface FormData {
  importingAs: 'standard' | 'returning_resident' | '';
  category: GoodsCategoryKey | '';
  subCategory: string;
  importationMethod: ImportationMethodKey | '';
  invoiceCurrency: InvoiceCurrencyKey | '';
  fobValue: string;
  airFreightCurrency: InvoiceCurrencyKey | '';
  airFreightValue: string;
  postageCurrency: InvoiceCurrencyKey | '';
  postageValue: string;
  roadFreightCurrency: InvoiceCurrencyKey | '';
  roadFreightValue: string;
  railFreightCurrency: InvoiceCurrencyKey | '';
  railFreightValue: string;
  oceanFreightCurrency: InvoiceCurrencyKey | '';
  oceanFreightValue: string;
  quantity: string;
  quantityUnit: string;
  weightInKg: string; // For items that need weight (soap, cement, sugar)
  threshold: string; // For flour and salt ('lessThan50kg' | 'moreThan50kg')
}

interface EligibilityResult {
  isEligible: boolean;
  periodOfAbsence: number;
  toa: number;
  messages: string[];
}

const CURRENCY_OPTIONS = Object.keys(
  INVOICE_CURRENCIES,
) as InvoiceCurrencyKey[];

export default function GoodsCalculator() {
  const [step, setStep] = useState(1);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [eligibilityConfirmed, setEligibilityConfirmed] =
    useState<EligibilityResult | null>(null);

  const [formData, setFormData] = useState<FormData>({
    importingAs: '',
    category: '',
    subCategory: '',
    importationMethod: '',
    invoiceCurrency: '',
    fobValue: '',
    airFreightCurrency: '',
    airFreightValue: '',
    postageCurrency: '',
    postageValue: '',
    roadFreightCurrency: '',
    roadFreightValue: '',
    railFreightCurrency: '',
    railFreightValue: '',
    oceanFreightCurrency: '',
    oceanFreightValue: '',
    quantity: '',
    quantityUnit: '',
    weightInKg: '',
    threshold: '',
  });

  const totalSteps = 4;

  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEligibilityConfirmed = (result: EligibilityResult) => {
    setEligibilityConfirmed(result);
    setShowEligibilityModal(false);
  };

  const isReturningResident = useMemo(() => {
    return (
      formData.importingAs === 'returning_resident' &&
      eligibilityConfirmed?.isEligible === true
    );
  }, [formData.importingAs, eligibilityConfirmed]);

  const subcategories = formData.category
    ? GOODS_SUBCATEGORIES[formData.category]
    : [];
  const selectedSubcategory = subcategories.find(
    (sub) => sub.value === formData.subCategory,
  );

  const displayExchangeRate = useMemo(() => {
    if (!formData.invoiceCurrency) return null;
    return getExchangeRate(formData.invoiceCurrency, 'USD');
  }, [formData.invoiceCurrency]);

  const fobValue = useMemo(() => {
    return Number.parseFloat(formData.fobValue) || 0;
  }, [formData.fobValue]);

  const freightValue = useMemo(() => {
    if (!formData.invoiceCurrency) return 0;

    switch (formData.importationMethod) {
      case 'air': {
        if (!formData.airFreightValue || !formData.airFreightCurrency) return 0;
        const airFreight = Number.parseFloat(formData.airFreightValue) || 0;
        return convertBetweenCurrencies(
          airFreight,
          formData.airFreightCurrency,
          formData.invoiceCurrency,
        );
      }
      case 'post': {
        if (!formData.postageValue || !formData.postageCurrency) return 0;
        const postage = Number.parseFloat(formData.postageValue) || 0;
        return convertBetweenCurrencies(
          postage,
          formData.postageCurrency,
          formData.invoiceCurrency,
        );
      }
      case 'road': {
        if (!formData.roadFreightValue || !formData.roadFreightCurrency) {
          // Default to 5% of FOB if not provided
          return fobValue * 0.05;
        }
        const roadFreight = Number.parseFloat(formData.roadFreightValue) || 0;
        return convertBetweenCurrencies(
          roadFreight,
          formData.roadFreightCurrency,
          formData.invoiceCurrency,
        );
      }
      case 'rail': {
        if (!formData.railFreightValue || !formData.railFreightCurrency) {
          // Default to 5% of FOB if not provided
          return fobValue * 0.05;
        }
        const railFreight = Number.parseFloat(formData.railFreightValue) || 0;
        return convertBetweenCurrencies(
          railFreight,
          formData.railFreightCurrency,
          formData.invoiceCurrency,
        );
      }
      default:
        return 0;
    }
  }, [
    formData.importationMethod,
    formData.invoiceCurrency,
    formData.airFreightValue,
    formData.airFreightCurrency,
    formData.postageValue,
    formData.postageCurrency,
    formData.roadFreightValue,
    formData.roadFreightCurrency,
    formData.railFreightValue,
    formData.railFreightCurrency,
    fobValue,
  ]);

  const oceanFreightValue = useMemo(() => {
    if (
      !formData.oceanFreightValue ||
      !formData.oceanFreightCurrency ||
      !formData.invoiceCurrency
    )
      return 0;
    const oceanFreight = Number.parseFloat(formData.oceanFreightValue) || 0;
    return convertBetweenCurrencies(
      oceanFreight,
      formData.oceanFreightCurrency,
      formData.invoiceCurrency,
    );
  }, [
    formData.oceanFreightValue,
    formData.oceanFreightCurrency,
    formData.invoiceCurrency,
  ]);

  const vdp = useMemo(() => {
    // For road and rail, include ocean freight if provided
    if (
      formData.importationMethod === 'road' ||
      formData.importationMethod === 'rail'
    ) {
      return fobValue + freightValue + oceanFreightValue;
    }
    // For air and post, just FOB + freight
    return fobValue + freightValue;
  }, [fobValue, freightValue, oceanFreightValue, formData.importationMethod]);

  const canProceed: boolean = useMemo(() => {
    switch (step) {
      case 1:
        return (
          formData.importingAs !== '' &&
          (formData.importingAs === 'standard' ||
            (formData.importingAs === 'returning_resident' &&
              eligibilityConfirmed?.isEligible === true))
        );
      case 2:
        if (formData.category === '' || formData.subCategory === '') {
          return false;
        }
        // Check if threshold is required and selected
        if (selectedSubcategory?.hasThreshold && formData.threshold === '') {
          return false;
        }
        // Check if weight is required and entered
        if (
          selectedSubcategory?.needsWeight &&
          (formData.weightInKg === '' ||
            Number.parseFloat(formData.weightInKg) <= 0)
        ) {
          return false;
        }
        return true;
      case 3:
        // Must have importation method, invoice currency, and FOB value
        if (
          formData.importationMethod === '' ||
          formData.invoiceCurrency === '' ||
          formData.fobValue === '' ||
          Number.parseFloat(formData.fobValue) <= 0
        ) {
          return false;
        }
        // Check freight requirements based on method
        switch (formData.importationMethod) {
          case 'air':
            return (
              formData.airFreightCurrency !== '' &&
              formData.airFreightValue !== ''
            );
          case 'post':
            return (
              formData.postageCurrency !== '' && formData.postageValue !== ''
            );
          case 'road':
          case 'rail':
            // Road/rail freight is optional (defaults to 5%), so always valid
            return true;
          default:
            return false;
        }
      case 4:
        if (selectedSubcategory?.perUnit) {
          return (
            formData.quantity !== '' && Number.parseFloat(formData.quantity) > 0
          );
        }
        return true;
      default:
        return false;
    }
  }, [step, formData, selectedSubcategory, eligibilityConfirmed]);

  const convertToBase = (amount: string, currency: CurrencyCode): number => {
    const value = Number.parseFloat(amount) || 0;
    if (value === 0) return 0;
    const rate = EXCHANGE_RATES[currency] / EXCHANGE_RATES.USD;
    return prec(value * rate, 2);
  };

  const MAX_WAIVER_AMOUNT = 40000;

  const calculations = useMemo(() => {
    const quantity = Number.parseFloat(formData.quantity) || 0;
    const weightInKg = Number.parseFloat(formData.weightInKg) || 0;

    if (vdp === 0) {
      return {
        vdp: 0,
        dutyRate: 0,
        customsDuty: 0,
        perUnitDuty: 0,
        surtaxRate: 0,
        surtax: 0,
        vat: 0,
        totalDuty: 0,
        totalCost: 0,
        waivedAmount: 0,
        excessAmount: 0,
        fullCustomsDuty: 0,
        fullSurtax: 0,
      };
    }

    // Determine the duty rate based on subcategory and thresholds
    let dutyRate = 0;
    let fullCustomsDuty = 0;
    let perUnitDuty = 0;

    if (selectedSubcategory) {
      // Handle threshold-based duty rates (flour, salt)
      if (selectedSubcategory.hasThreshold && formData.threshold) {
        dutyRate =
          formData.threshold === 'lessThan50kg'
            ? selectedSubcategory.thresholdOptions!.lessThan50kg.dutyRate
            : selectedSubcategory.thresholdOptions!.moreThan50kg.dutyRate;
        fullCustomsDuty = prec(vdp * dutyRate, 2);
      }
      // Handle max rate logic (soap, cooking oil) - choose minimum of percentage or fixed
      else if (selectedSubcategory.maxRate && weightInKg > 0) {
        const percentageDuty = prec(vdp * selectedSubcategory.dutyRate, 2);
        const fixedDuty = prec(
          weightInKg * selectedSubcategory.maxRate.fixed,
          2,
        );
        fullCustomsDuty = Math.min(percentageDuty, fixedDuty);
        dutyRate = selectedSubcategory.dutyRate; // For display purposes
      }
      // Handle fixed rate only (cement, sugar)
      else if (selectedSubcategory.fixedRate && weightInKg > 0) {
        const weightInTonnes =
          selectedSubcategory.fixedRate.perUnit === 'tonne'
            ? weightInKg / 1000
            : selectedSubcategory.fixedRate.perUnit === 'ton'
              ? weightInKg / 1000
              : weightInKg;
        fullCustomsDuty = prec(
          weightInTonnes * selectedSubcategory.fixedRate.amount,
          2,
        );
        // For percentage duty on top of fixed
        if (selectedSubcategory.dutyRate > 0) {
          fullCustomsDuty += prec(vdp * selectedSubcategory.dutyRate, 2);
        }
        dutyRate = selectedSubcategory.dutyRate;
      }
      // Handle standard percentage + per unit (clothing, blankets, etc.)
      else {
        dutyRate = selectedSubcategory.dutyRate;
        fullCustomsDuty = prec(vdp * dutyRate, 2);

        // Add per-unit duty if applicable
        if (selectedSubcategory.perUnit && quantity > 0) {
          perUnitDuty = prec(quantity * selectedSubcategory.perUnit.rate, 2);
          fullCustomsDuty = prec(fullCustomsDuty + perUnitDuty, 2);
        }
      }
    }

    const appliesSurtax = selectedSubcategory?.hasSurtax || false;
    const surtaxRate = appliesSurtax ? SURTAX_RATE_GOODS : 0;
    const fullSurtax = prec(vdp * surtaxRate, 2);

    let customsDuty = fullCustomsDuty;
    let surtax = fullSurtax;
    let waivedAmount = 0;
    let excessAmount = 0;

    if (isReturningResident) {
      const totalWaivable = fullCustomsDuty + fullSurtax;

      if (totalWaivable <= MAX_WAIVER_AMOUNT) {
        // Full waiver applies
        customsDuty = 0;
        surtax = 0;
        waivedAmount = totalWaivable;
        excessAmount = 0;
      } else {
        // Partial waiver - excess must be paid
        excessAmount = totalWaivable - MAX_WAIVER_AMOUNT;
        waivedAmount = MAX_WAIVER_AMOUNT;
        // Apply excess proportionally to duty and surtax
        const dutyProportion = fullCustomsDuty / totalWaivable;
        const surtaxProportion = fullSurtax / totalWaivable;
        customsDuty = prec(excessAmount * dutyProportion, 2);
        surtax = prec(excessAmount * surtaxProportion, 2);
      }
    }

    const vtp = vdp + fullCustomsDuty;
    const vat = prec(vtp * VAT_RATE, 2);

    const totalDuty = prec(customsDuty + surtax + vat, 2);
    const totalCost = prec(vdp + totalDuty, 2);

    return {
      vdp: prec(vdp, 2),
      dutyRate,
      customsDuty,
      perUnitDuty,
      surtaxRate,
      surtax,
      vat,
      totalDuty,
      totalCost,
      waivedAmount,
      excessAmount,
      fullCustomsDuty,
      fullSurtax,
    };
  }, [
    vdp,
    formData.quantity,
    formData.weightInKg,
    formData.threshold,
    selectedSubcategory,
    isReturningResident,
  ]);

  const summaryItems = useMemo(() => {
    const items: { label: string; value: string; effect?: string }[] = [];

    if (formData.importingAs) {
      items.push({
        label: 'Importing As',
        value:
          formData.importingAs === 'returning_resident'
            ? 'Returning Resident'
            : 'Standard',
        effect: isReturningResident ? 'Duty suspension applies' : undefined,
      });
    }

    if (formData.category) {
      items.push({
        label: 'Category',
        value: GOODS_CATEGORIES[formData.category].label,
      });
    }

    if (formData.subCategory && selectedSubcategory) {
      let effect = isReturningResident
        ? 'Suspended'
        : `${(selectedSubcategory.dutyRate * 100).toFixed(0)}% duty`;
      if (selectedSubcategory.perUnit && !isReturningResident) {
        effect += ` + $${selectedSubcategory.perUnit.rate}/${selectedSubcategory.perUnit.unit}`;
      }
      if (selectedSubcategory.hasSurtax && !isReturningResident) {
        effect += ' +25% surtax';
      }
      items.push({
        label: 'Item Type',
        value: selectedSubcategory.label,
        effect,
      });
    }

    if (formData.importationMethod) {
      const method = IMPORTATION_METHODS[formData.importationMethod];
      items.push({
        label: 'Import Method',
        value: method.label,
      });
    }

    if (
      formData.invoiceCurrency &&
      formData.fobValue &&
      Number.parseFloat(formData.fobValue) > 0
    ) {
      items.push({
        label: 'FOB Value',
        value: `${formData.invoiceCurrency} ${Number.parseFloat(formData.fobValue).toLocaleString()}`,
      });
    }

    if (freightValue > 0) {
      items.push({
        label: 'Freight',
        value: `+${formData.invoiceCurrency} ${freightValue.toLocaleString()}`,
      });
    }

    if (oceanFreightValue > 0) {
      items.push({
        label: 'Ocean Freight',
        value: `+${formData.invoiceCurrency} ${oceanFreightValue.toLocaleString()}`,
      });
    }

    if (
      formData.quantity &&
      Number.parseFloat(formData.quantity) > 0 &&
      selectedSubcategory?.perUnit
    ) {
      items.push({
        label: 'Quantity',
        value: `${formData.quantity} ${selectedSubcategory.perUnit.unit}(s)`,
        effect: isReturningResident
          ? 'Suspended'
          : `+$${prec(Number.parseFloat(formData.quantity) * selectedSubcategory.perUnit.rate, 2)} per-unit duty`,
      });
    }

    return items;
  }, [
    formData,
    selectedSubcategory,
    isReturningResident,
    freightValue,
    oceanFreightValue,
  ]);

  const dutyBreakdown = useMemo(() => {
    if (!formData.fobValue || Number.parseFloat(formData.fobValue) <= 0)
      return null;

    return {
      vdp: calculations.vdp,
      customsDuty: {
        rate: isReturningResident
          ? calculations.excessAmount > 0
            ? selectedSubcategory?.perUnit
              ? `${(calculations.dutyRate * 100).toFixed(0)}% + $${selectedSubcategory.perUnit.rate}/${selectedSubcategory.perUnit.unit} (partial)`
              : `${(calculations.dutyRate * 100).toFixed(0)}% (partial)`
            : 'SUSPENDED'
          : selectedSubcategory?.perUnit
            ? `${(calculations.dutyRate * 100).toFixed(0)}% + $${selectedSubcategory.perUnit.rate}/${selectedSubcategory.perUnit.unit}`
            : selectedSubcategory?.maxRate
              ? `Max ${(calculations.dutyRate * 100).toFixed(0)}% or $${selectedSubcategory.maxRate.fixed}/${selectedSubcategory.maxRate.perUnit}`
              : selectedSubcategory?.fixedRate
                ? `$${selectedSubcategory.fixedRate.amount}/${selectedSubcategory.fixedRate.perUnit}${calculations.dutyRate > 0 ? ` + ${(calculations.dutyRate * 100).toFixed(0)}%` : ''}`
                : `${(calculations.dutyRate * 100).toFixed(0)}%`,
        amount: calculations.customsDuty,
        note:
          isReturningResident && calculations.excessAmount > 0
            ? `Duty suspended up to $40,000 max. Excess of $${calculations.excessAmount.toLocaleString()} applies.`
            : isReturningResident
              ? `Duty suspended for ${eligibilityConfirmed?.toa} years TOA benefit`
              : undefined,
      },
      surtax:
        calculations.surtax > 0 ||
        (selectedSubcategory?.hasSurtax && isReturningResident)
          ? {
              rate: isReturningResident
                ? calculations.excessAmount > 0
                  ? `${(calculations.surtaxRate * 100).toFixed(0)}% (partial)`
                  : 'WAIVED'
                : `${(calculations.surtaxRate * 100).toFixed(0)}%`,
              amount: calculations.surtax,
            }
          : null,
      vat: {
        rate: `${(VAT_RATE * 100).toFixed(0)}%`,
        amount: calculations.vat,
      },
      totalDuty: calculations.totalDuty,
      totalCost: calculations.totalCost,
    };
  }, [
    calculations,
    formData.fobValue,
    selectedSubcategory,
    isReturningResident,
    eligibilityConfirmed,
  ]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <UserCheck className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Import Type</h3>
                <p className="text-sm text-slate-500">
                  Are you importing as a standard importer or returning
                  resident?
                </p>
              </div>
            </div>

            <RadioGroup
              value={formData.importingAs}
              onValueChange={(value) => {
                updateFormData(
                  'importingAs',
                  value as 'standard' | 'returning_resident',
                );
                if (value === 'standard') {
                  setEligibilityConfirmed(null);
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-teal-300">
                  <RadioGroupItem value="standard" id="goods-import-standard" />
                  <Label
                    htmlFor="goods-import-standard"
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium">Standard Import</span>
                  </Label>
                </div>
                <p className="text-xs text-zinc-500">
                  Regular import duties and taxes apply
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-teal-300">
                  <RadioGroupItem
                    value="returning_resident"
                    id="goods-import-returning"
                  />
                  <Label
                    htmlFor="goods-import-returning"
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium">
                      Returning Resident (with rebate)
                    </span>
                  </Label>
                </div>
                <p className="text-xs text-zinc-500">
                  May qualify for duty suspension benefits
                </p>
              </div>
            </RadioGroup>

            {formData.importingAs === 'returning_resident' && (
              <div className="space-y-4">
                {eligibilityConfirmed?.isEligible ? (
                  <div className="rounded-sm border border-green-200 bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                      <Check className="mt-0.5 size-5 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">
                          You qualify for a {eligibilityConfirmed.toa}-year TOA
                          benefit with duty suspension
                        </p>
                        <div
                          className="mt-2 flex h-auto cursor-pointer items-center p-0 text-sm text-green-700 underline"
                          onClick={() => setShowEligibilityModal(true)}
                        >
                          Re-check eligibility
                          <ExternalLink className="ml-1 size-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-sm border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm text-amber-600">
                          Please verify your eligibility for the returning
                          resident rebate before proceeding
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2 border-amber-300 bg-transparent text-amber-700 hover:bg-amber-100"
                          onClick={() => setShowEligibilityModal(true)}
                        >
                          Check Eligibility
                          <ExternalLink className="ml-2 size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Package className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Goods Category</h3>
                <p className="text-sm text-slate-500">
                  Select the type of goods being imported
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  updateFormData('category', value as GoodsCategoryKey);
                  updateFormData('subCategory', '');
                  updateFormData('weightInKg', '');
                  updateFormData('threshold', '');
                }}
              >
                <SelectTrigger id="category" className="w-full cursor-pointer">
                  <SelectValue placeholder="Select goods category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GOODS_CATEGORIES).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.category && subcategories.length > 0 && (
              <div className="space-y-3">
                <Label>Item Type *</Label>
                <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
                  {subcategories.map((sub) => (
                    <button
                      key={sub.value}
                      type="button"
                      onClick={() => {
                        updateFormData('subCategory', sub.value);
                        updateFormData('weightInKg', '');
                        updateFormData('threshold', '');
                      }}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                        formData.subCategory === sub.value
                          ? 'border-teal-500 bg-teal-500 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSubcategory && (
              <div className="space-y-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-1 size-4 flex-shrink-0 text-teal-700" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-teal-900">
                      Rate of Duty for {selectedSubcategory.label}
                    </p>
                    <p className="mt-1 text-sm text-teal-800">
                      {selectedSubcategory.hasThreshold ? (
                        formData.threshold ? (
                          <>
                            {formData.threshold === 'lessThan50kg'
                              ? selectedSubcategory.thresholdOptions!
                                  .lessThan50kg.dutyRate * 100
                              : selectedSubcategory.thresholdOptions!
                                  .moreThan50kg.dutyRate * 100}
                            %
                          </>
                        ) : (
                          'Please select weight threshold below'
                        )
                      ) : selectedSubcategory.maxRate ? (
                        <>
                          Maximum of {selectedSubcategory.dutyRate * 100}% or $
                          {selectedSubcategory.maxRate.fixed}/
                          {selectedSubcategory.maxRate.perUnit}
                        </>
                      ) : selectedSubcategory.fixedRate ? (
                        <>
                          ${selectedSubcategory.fixedRate.amount}/
                          {selectedSubcategory.fixedRate.perUnit}
                          {selectedSubcategory.dutyRate > 0 &&
                            ` plus ${selectedSubcategory.dutyRate * 100}%`}
                        </>
                      ) : selectedSubcategory.perUnit ? (
                        <>
                          {selectedSubcategory.dutyRate * 100}% plus $
                          {selectedSubcategory.perUnit.rate}/
                          {selectedSubcategory.perUnit.unit}
                        </>
                      ) : (
                        <>{selectedSubcategory.dutyRate * 100}%</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Threshold selector for flour and salt */}
                {selectedSubcategory.hasThreshold && (
                  <div className="space-y-2">
                    <Label>Weight Threshold *</Label>
                    <RadioGroup
                      value={formData.threshold}
                      onValueChange={(value) =>
                        updateFormData('threshold', value)
                      }
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-3 rounded-lg border border-slate-200 bg-white p-3">
                        <RadioGroupItem
                          value="lessThan50kg"
                          id="lessThan50kg"
                        />
                        <Label
                          htmlFor="lessThan50kg"
                          className="cursor-pointer"
                        >
                          {
                            selectedSubcategory.thresholdOptions!.lessThan50kg
                              .label
                          }
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border border-slate-200 bg-white p-3">
                        <RadioGroupItem
                          value="moreThan50kg"
                          id="moreThan50kg"
                        />
                        <Label
                          htmlFor="moreThan50kg"
                          className="cursor-pointer"
                        >
                          {
                            selectedSubcategory.thresholdOptions!.moreThan50kg
                              .label
                          }
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Weight field for soap, cement, sugar */}
                {selectedSubcategory.needsWeight && (
                  <div className="space-y-2">
                    <Label htmlFor="weightInKg">Weight in kg *</Label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                        kg
                      </span>
                      <Input
                        id="weightInKg"
                        type="number"
                        placeholder="Enter weight in kg"
                        value={formData.weightInKg}
                        onChange={(e) =>
                          updateFormData('weightInKg', e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {isReturningResident && formData.category && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="size-4" />
                  <span className="text-sm font-medium">
                    Duty suspension benefit will be applied
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Truck className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Importation Method & Value Details
                </h3>
                <p className="text-sm text-slate-500">
                  Select method and enter FOB value with freight costs
                </p>
              </div>
            </div>

            {/* Importation Method Selection */}
            <div className="space-y-3">
              <Label>Importation Method *</Label>
              <RadioGroup
                value={formData.importationMethod}
                onValueChange={(value) => {
                  updateFormData(
                    'importationMethod',
                    value as ImportationMethodKey,
                  );
                  // Reset freight values when changing method
                  updateFormData('airFreightValue', '');
                  updateFormData('postageValue', '');
                  updateFormData('roadFreightValue', '');
                  updateFormData('railFreightValue', '');
                }}
                className="space-y-2"
              >
                {Object.entries(IMPORTATION_METHODS).map(([key, info]) => (
                  <div
                    key={key}
                    className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-teal-300"
                  >
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key} className="flex-1 cursor-pointer">
                      {info.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Currency and FOB Value */}
            {formData.importationMethod && (
              <>
                <div className="space-y-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceCurrency">Invoice Currency *</Label>
                    <Select
                      value={formData.invoiceCurrency}
                      onValueChange={(value) =>
                        updateFormData(
                          'invoiceCurrency',
                          value as InvoiceCurrencyKey,
                        )
                      }
                    >
                      <SelectTrigger id="invoiceCurrency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {INVOICE_CURRENCIES[currency].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fobValue">
                      FOB Value (Freight on Board) *
                    </Label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                        {formData.invoiceCurrency || 'USD'}
                      </span>
                      <Input
                        id="fobValue"
                        type="number"
                        placeholder="Enter FOB value"
                        value={formData.fobValue}
                        onChange={(e) =>
                          updateFormData('fobValue', e.target.value)
                        }
                        disabled={!formData.invoiceCurrency}
                        className="pl-16"
                      />
                    </div>
                  </div>
                </div>

                {/* Exchange Rate Display */}
                {formData.invoiceCurrency && displayExchangeRate && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                      <ArrowRightLeft className="size-4 text-teal-600" />
                      Exchange Rate
                    </h4>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <ReactCountryFlag
                          countryCode={
                            INVOICE_CURRENCIES[formData.invoiceCurrency]
                              .countryCode
                          }
                          svg
                          style={{ width: '1.5em', height: '1.5em' }}
                        />
                        <span className="text-slate-600">
                          1 {formData.invoiceCurrency}
                        </span>
                      </div>
                      <span className="text-slate-400">=</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">
                          ${displayExchangeRate.toFixed(4)} USD
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Method-specific freight fields */}
                {formData.importationMethod === 'air' && (
                  <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="font-medium text-blue-900">
                      Air Freight Details
                    </h4>
                    <div className="space-y-2">
                      <Label htmlFor="airFreightCurrency">
                        Air Freight Currency *
                      </Label>
                      <Select
                        value={formData.airFreightCurrency}
                        onValueChange={(value) =>
                          updateFormData(
                            'airFreightCurrency',
                            value as InvoiceCurrencyKey,
                          )
                        }
                      >
                        <SelectTrigger id="airFreightCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {INVOICE_CURRENCIES[currency].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="airFreightValue">
                        Air Freight and Insurance *
                      </Label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                          {formData.airFreightCurrency || 'USD'}
                        </span>
                        <Input
                          id="airFreightValue"
                          type="number"
                          placeholder="Enter air freight cost"
                          value={formData.airFreightValue}
                          onChange={(e) =>
                            updateFormData('airFreightValue', e.target.value)
                          }
                          disabled={!formData.airFreightCurrency}
                          className="pl-16"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.importationMethod === 'post' && (
                  <div className="space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <h4 className="font-medium text-purple-900">
                      Postage Details
                    </h4>
                    <div className="space-y-2">
                      <Label htmlFor="postageCurrency">
                        Postage Currency *
                      </Label>
                      <Select
                        value={formData.postageCurrency}
                        onValueChange={(value) =>
                          updateFormData(
                            'postageCurrency',
                            value as InvoiceCurrencyKey,
                          )
                        }
                      >
                        <SelectTrigger id="postageCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {INVOICE_CURRENCIES[currency].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postageValue">Postage Value *</Label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                          {formData.postageCurrency || 'USD'}
                        </span>
                        <Input
                          id="postageValue"
                          type="number"
                          placeholder="Enter postage cost"
                          value={formData.postageValue}
                          onChange={(e) =>
                            updateFormData('postageValue', e.target.value)
                          }
                          disabled={!formData.postageCurrency}
                          className="pl-16"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.importationMethod === 'road' && (
                  <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="font-medium text-amber-900">
                      Road Freight Details
                    </h4>

                    {/* Ocean Freight (Optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="oceanFreightCurrency">
                        Ocean Freight Currency (Optional)
                      </Label>
                      <Select
                        value={formData.oceanFreightCurrency}
                        onValueChange={(value) =>
                          updateFormData(
                            'oceanFreightCurrency',
                            value as InvoiceCurrencyKey,
                          )
                        }
                      >
                        <SelectTrigger id="oceanFreightCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {INVOICE_CURRENCIES[currency].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oceanFreightValue">
                        Ocean Freight Charges
                      </Label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                          {formData.oceanFreightCurrency || 'USD'}
                        </span>
                        <Input
                          id="oceanFreightValue"
                          type="number"
                          placeholder="Enter ocean freight cost"
                          value={formData.oceanFreightValue}
                          onChange={(e) =>
                            updateFormData('oceanFreightValue', e.target.value)
                          }
                          disabled={!formData.oceanFreightCurrency}
                          className="pl-16"
                        />
                      </div>
                      <p className="text-xs text-amber-600">
                        Freight from overseas countries
                      </p>
                    </div>

                    {/* Road Freight */}
                    <div className="space-y-2">
                      <Label htmlFor="roadFreightCurrency">
                        Road Freight Currency
                      </Label>
                      <Select
                        value={formData.roadFreightCurrency}
                        onValueChange={(value) =>
                          updateFormData(
                            'roadFreightCurrency',
                            value as InvoiceCurrencyKey,
                          )
                        }
                      >
                        <SelectTrigger id="roadFreightCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {INVOICE_CURRENCIES[currency].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roadFreightValue">
                        Road Freight Charges
                      </Label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                          {formData.roadFreightCurrency || 'USD'}
                        </span>
                        <Input
                          id="roadFreightValue"
                          type="number"
                          placeholder="Enter road freight cost"
                          value={formData.roadFreightValue}
                          onChange={(e) =>
                            updateFormData('roadFreightValue', e.target.value)
                          }
                          disabled={!formData.roadFreightCurrency}
                          className="pl-16"
                        />
                      </div>
                      <p className="text-xs text-amber-600">
                        Leave blank if unsure (freight is 5% of FOB)
                      </p>
                    </div>
                  </div>
                )}

                {formData.importationMethod === 'rail' && (
                  <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-4">
                    <h4 className="font-medium text-green-900">
                      Rail Freight Details
                    </h4>

                    {/* Ocean Freight (Optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="oceanFreightCurrency">
                        Ocean Freight Currency (Optional)
                      </Label>
                      <Select
                        value={formData.oceanFreightCurrency}
                        onValueChange={(value) =>
                          updateFormData(
                            'oceanFreightCurrency',
                            value as InvoiceCurrencyKey,
                          )
                        }
                      >
                        <SelectTrigger id="oceanFreightCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {INVOICE_CURRENCIES[currency].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oceanFreightValue">
                        Ocean Freight Charges
                      </Label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                          {formData.oceanFreightCurrency || 'USD'}
                        </span>
                        <Input
                          id="oceanFreightValue"
                          type="number"
                          placeholder="Enter ocean freight cost"
                          value={formData.oceanFreightValue}
                          onChange={(e) =>
                            updateFormData('oceanFreightValue', e.target.value)
                          }
                          disabled={!formData.oceanFreightCurrency}
                          className="pl-16"
                        />
                      </div>
                      <p className="text-xs text-green-600">
                        Freight from overseas countries
                      </p>
                    </div>

                    {/* Rail Freight */}
                    <div className="space-y-2">
                      <Label htmlFor="railFreightCurrency">
                        Rail Freight Currency
                      </Label>
                      <Select
                        value={formData.railFreightCurrency}
                        onValueChange={(value) =>
                          updateFormData(
                            'railFreightCurrency',
                            value as InvoiceCurrencyKey,
                          )
                        }
                      >
                        <SelectTrigger id="railFreightCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {INVOICE_CURRENCIES[currency].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="railFreightValue">
                        Rail Freight Charges
                      </Label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                          {formData.railFreightCurrency || 'USD'}
                        </span>
                        <Input
                          id="railFreightValue"
                          type="number"
                          placeholder="Enter rail freight cost"
                          value={formData.railFreightValue}
                          onChange={(e) =>
                            updateFormData('railFreightValue', e.target.value)
                          }
                          disabled={!formData.railFreightCurrency}
                          className="pl-16"
                        />
                      </div>
                      <p className="text-xs text-green-600">
                        Leave blank if unsure (freight is 5% of FOB)
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {isReturningResident && formData.importationMethod && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="size-4" />
                  <span className="text-sm font-medium">
                    Duty suspension benefit active
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Tag className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Additional Details
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedSubcategory?.perUnit
                    ? 'Enter the quantity for per-unit duty calculation'
                    : 'Review your calculation'}
                </p>
              </div>
            </div>

            {selectedSubcategory?.perUnit ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-2 text-amber-700">
                    <AlertCircle className="mt-0.5 size-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Per-Unit Duty Applies</p>
                      <p className="text-sm">
                        This item has an additional duty of $
                        {selectedSubcategory.perUnit.rate} per{' '}
                        {selectedSubcategory.perUnit.unit}
                        {isReturningResident &&
                          ' (suspended for returning residents)'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantity ({selectedSubcategory.perUnit.unit}s) *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder={`Enter number of ${selectedSubcategory.perUnit.unit}s`}
                    value={formData.quantity}
                    onChange={(e) => updateFormData('quantity', e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="size-5" />
                  <p className="font-medium">
                    All required information collected
                  </p>
                </div>
                <p className="mt-2 text-sm text-green-600">
                  Your duty calculation is complete. Review the summary on the
                  right.
                </p>
              </div>
            )}

            {isReturningResident && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-2 text-green-700">
                  <Check className="mt-0.5 size-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      Returning Resident Benefit Applied
                    </p>
                    <p className="text-sm">
                      Customs duty and surtax are suspended for{' '}
                      {eligibilityConfirmed?.toa} years (up to US$40,000).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <CalculatorLayout
        step={step}
        totalSteps={totalSteps}
        summaryItems={summaryItems}
        dutyBreakdown={dutyBreakdown}
        onBack={() => setStep((prev) => Math.max(1, prev - 1))}
        onNext={() => setStep((prev) => Math.min(totalSteps, prev + 1))}
        canProceed={canProceed}
      >
        {renderStepContent()}
      </CalculatorLayout>

      <EligibilityModal
        open={showEligibilityModal}
        onOpenChange={setShowEligibilityModal}
        onEligibilityConfirmed={handleEligibilityConfirmed}
      />
    </>
  );
}
