'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  Car,
  Info,
  Check,
  Ban,
  Ship,
  Truck,
  ArrowRightLeft,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import CalculatorLayout from './layout';
import { EligibilityModal } from './eligibility-modal';
import {
  VEHICLE_MAKES,
  VEHICLE_TYPES,
  WEIGHT_OPTIONS,
  MOTORCYCLE_ENGINE_OPTIONS,
  TRAILER_TYPES,
  SPECIAL_PURPOSE_TYPES,
  BUS_CAPACITY_OPTIONS,
  CURRENT_YEAR,
  SURTAX_AGE_THRESHOLD,
  getVehicleDutyRate,
  getLicenceRequirement,
  getSurtaxStatus,
  COUNTRIES_OF_SUPPLY,
  INVOICE_CURRENCIES,
  getExchangeRate,
  convertBetweenCurrencies,
  getVehicleTypeInfo,
  type VehicleTypeKey,
  type WeightKey,
  type MotorcycleEngineKey,
  type TrailerTypeKey,
  type SpecialPurposeKey,
  type BusCapacityKey,
  type CountryOfSupplyKey,
  type InvoiceCurrencyKey,
} from './constants';
import ReactCountryFlag from 'react-country-flag';

interface FormData {
  importingAs: 'standard' | 'returning_resident' | '';
  vehicleMake: string;
  vehicleType: VehicleTypeKey | '';
  yearOfManufacture: string;
  weight: WeightKey | '';
  motorcycleEngine: MotorcycleEngineKey | '';
  trailerType: TrailerTypeKey | '';
  specialPurposeType: SpecialPurposeKey | '';
  busCapacity: BusCapacityKey | '';
  countryOfSupply: CountryOfSupplyKey | '';
  invoiceCurrency: InvoiceCurrencyKey | '';
  invoiceValue: string;
  oceanFreightCurrency: InvoiceCurrencyKey | '';
  oceanFreightCharges: string;
  otherCharges: string;
  carrierCurrency: InvoiceCurrencyKey | '';
  carrierCharges: string;
}

interface EligibilityResult {
  isEligible: boolean;
  periodOfAbsence: number;
  toa: number;
  messages: string[];
}

const YEAR_OPTIONS = [
  ...Array.from({ length: CURRENT_YEAR - 1970 + 1 }, (_, i) => ({
    value: String(CURRENT_YEAR - i),
    label: String(CURRENT_YEAR - i),
  })),
  { value: 'pre1970', label: 'Older than 1970' },
];

export default function VehicleCalculator() {
  const [step, setStep] = useState(1);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [eligibilityConfirmed, setEligibilityConfirmed] =
    useState<EligibilityResult | null>(null);

  const [formData, setFormData] = useState<FormData>({
    importingAs: '',
    vehicleMake: '',
    vehicleType: '',
    yearOfManufacture: '',
    weight: '',
    motorcycleEngine: '',
    trailerType: '',
    specialPurposeType: '',
    busCapacity: '',
    countryOfSupply: '',
    invoiceCurrency: '',
    invoiceValue: '',
    oceanFreightCurrency: '',
    oceanFreightCharges: '',
    otherCharges: '',
    carrierCurrency: '',
    carrierCharges: '',
  });

  const totalSteps = 3;

  const selectedVehicleType = formData.vehicleType
    ? getVehicleTypeInfo(formData.vehicleType)
    : null;

  const needsWeight = selectedVehicleType?.needsWeight ?? false;
  const needsEngineSize = selectedVehicleType?.needsEngineSize ?? false;
  const needsTrailerType = selectedVehicleType?.needsTrailerType ?? false;
  const needsSpecialPurposeType =
    selectedVehicleType?.needsSpecialPurposeType ?? false;
  const needsBusCapacity = selectedVehicleType?.needsBusCapacity ?? false;
  const showGVMNote = selectedVehicleType?.showGVMNote ?? false;
  const requiresForeignCurrency =
    selectedVehicleType?.requiresForeignCurrency ?? false;

  const isReturningResident = useMemo(() => {
    return (
      formData.importingAs === 'returning_resident' &&
      eligibilityConfirmed?.isEligible === true
    );
  }, [formData.importingAs, eligibilityConfirmed]);

  const vehicleAge = useMemo(() => {
    if (!formData.yearOfManufacture) return 0;
    if (formData.yearOfManufacture === 'pre1970') return CURRENT_YEAR - 1969;
    return CURRENT_YEAR - Number.parseInt(formData.yearOfManufacture);
  }, [formData.yearOfManufacture]);

  const dutyRate = useMemo(() => {
    if (!formData.vehicleType) return 0;
    return getVehicleDutyRate(formData.vehicleType, {
      weight: formData.weight || undefined,
      motorcycleEngine: formData.motorcycleEngine || undefined,
      trailerType: formData.trailerType || undefined,
      busCapacity: formData.busCapacity || undefined,
    });
  }, [
    formData.vehicleType,
    formData.weight,
    formData.motorcycleEngine,
    formData.trailerType,
    formData.busCapacity,
  ]);

  const licenceRequirement = useMemo(() => {
    if (!formData.vehicleType || !formData.yearOfManufacture) return '';
    const year =
      formData.yearOfManufacture === 'pre1970'
        ? 1969
        : Number.parseInt(formData.yearOfManufacture);
    return getLicenceRequirement(formData.vehicleType, year);
  }, [formData.vehicleType, formData.yearOfManufacture]);

  const surtaxStatus = useMemo(() => {
    if (!formData.vehicleType || !formData.yearOfManufacture) return null;
    const year =
      formData.yearOfManufacture === 'pre1970'
        ? 1969
        : Number.parseInt(formData.yearOfManufacture);
    return getSurtaxStatus(formData.vehicleType, year);
  }, [formData.vehicleType, formData.yearOfManufacture]);

  const isConditionalFieldFilled = useMemo(() => {
    if (needsWeight && !formData.weight) return false;
    if (needsEngineSize && !formData.motorcycleEngine) return false;
    if (needsTrailerType && !formData.trailerType) return false;
    if (needsSpecialPurposeType && !formData.specialPurposeType) return false;
    if (needsBusCapacity && !formData.busCapacity) return false;
    return true;
  }, [
    needsWeight,
    needsEngineSize,
    needsTrailerType,
    needsSpecialPurposeType,
    needsBusCapacity,
    formData,
  ]);

  const requiresOceanFreight = useMemo(() => {
    if (!formData.countryOfSupply) return false;
    return (
      COUNTRIES_OF_SUPPLY[formData.countryOfSupply as CountryOfSupplyKey]
        ?.requiresOceanFreight ?? false
    );
  }, [formData.countryOfSupply]);

  const dutyPayableCurrency = useMemo(() => {
    return requiresForeignCurrency ? 'USD' : 'ZWL';
  }, [requiresForeignCurrency]);

  const displayExchangeRate = useMemo(() => {
    if (!formData.invoiceCurrency) return null;
    return getExchangeRate(
      formData.invoiceCurrency,
      dutyPayableCurrency as 'USD' | 'ZWL',
    );
  }, [formData.invoiceCurrency, dutyPayableCurrency]);

  const fobValue = useMemo(() => {
    return Number.parseFloat(formData.invoiceValue) || 0;
  }, [formData.invoiceValue]);

  const oceanFreightValue = useMemo(() => {
    if (
      !formData.oceanFreightCharges ||
      !formData.oceanFreightCurrency ||
      !formData.invoiceCurrency
    )
      return 0;
    const oceanFreight = Number.parseFloat(formData.oceanFreightCharges) || 0;
    return convertBetweenCurrencies(
      oceanFreight,
      formData.oceanFreightCurrency,
      formData.invoiceCurrency,
    );
  }, [
    formData.oceanFreightCharges,
    formData.oceanFreightCurrency,
    formData.invoiceCurrency,
  ]);

  const roadFreightValue = useMemo(() => {
    if (!formData.invoiceCurrency) return 0;
    if (formData.carrierCharges && formData.carrierCurrency) {
      const carrier = Number.parseFloat(formData.carrierCharges) || 0;
      return convertBetweenCurrencies(
        carrier,
        formData.carrierCurrency,
        formData.invoiceCurrency,
      );
    }
    return fobValue * 0.06;
  }, [
    formData.carrierCharges,
    formData.carrierCurrency,
    formData.invoiceCurrency,
    fobValue,
  ]);

  const vdpValue = useMemo(() => {
    return fobValue + oceanFreightValue + roadFreightValue;
  }, [fobValue, oceanFreightValue, roadFreightValue]);

  const MAX_WAIVER_AMOUNT = 40000;

  const fullCustomsDutyValue = useMemo(() => {
    return vdpValue * dutyRate;
  }, [vdpValue, dutyRate]);

  const fullSurtaxValue = useMemo(() => {
    if (!surtaxStatus?.applies) return 0;
    return vdpValue * 0.35;
  }, [vdpValue, surtaxStatus]);

  const { customsDutyValue, surtaxValue, waivedAmount, excessAmount } =
    useMemo(() => {
      if (!isReturningResident) {
        return {
          customsDutyValue: fullCustomsDutyValue,
          surtaxValue: fullSurtaxValue,
          waivedAmount: 0,
          excessAmount: 0,
        };
      }

      const totalWaivable = fullCustomsDutyValue + fullSurtaxValue;

      if (totalWaivable <= MAX_WAIVER_AMOUNT) {
        // Full waiver applies
        return {
          customsDutyValue: 0,
          surtaxValue: 0,
          waivedAmount: totalWaivable,
          excessAmount: 0,
        };
      }

      // Partial waiver - excess must be paid
      const excess = totalWaivable - MAX_WAIVER_AMOUNT;
      // Apply excess proportionally to duty and surtax
      const dutyProportion = fullCustomsDutyValue / totalWaivable;
      const surtaxProportion = fullSurtaxValue / totalWaivable;

      return {
        customsDutyValue: Math.round(excess * dutyProportion * 100) / 100,
        surtaxValue: Math.round(excess * surtaxProportion * 100) / 100,
        waivedAmount: MAX_WAIVER_AMOUNT,
        excessAmount: excess,
      };
    }, [isReturningResident, fullCustomsDutyValue, fullSurtaxValue]);

  const vatValue = useMemo(() => {
    return (fullCustomsDutyValue + vdpValue) * 0.15;
  }, [fullCustomsDutyValue, vdpValue]);

  const totalPayable = useMemo(() => {
    return customsDutyValue + vatValue + surtaxValue;
  }, [customsDutyValue, vatValue, surtaxValue]);

  const dutyBreakdown = useMemo(() => {
    if (!formData.invoiceValue || !formData.invoiceCurrency) return null;

    return {
      vdp: vdpValue,
      rebate: isReturningResident
        ? {
            amount: waivedAmount,
            label: 'Returning Resident Suspension',
          }
        : undefined,
      customsDuty: {
        rate: isReturningResident
          ? excessAmount > 0
            ? `${(dutyRate * 100).toFixed(0)}% (partial)`
            : 'SUSPENDED'
          : `${(dutyRate * 100).toFixed(0)}%`,
        amount: customsDutyValue,
        note:
          isReturningResident && excessAmount > 0
            ? `Duty suspended up to $40,000 max. Excess of $${excessAmount.toLocaleString()} applies.`
            : isReturningResident
              ? `Duty suspended for ${eligibilityConfirmed?.toa} years TOA benefit`
              : undefined,
      },
      surtax:
        surtaxStatus?.applies || isReturningResident
          ? {
              rate: isReturningResident
                ? excessAmount > 0
                  ? '35% (partial)'
                  : 'WAIVED'
                : '35%',
              amount: surtaxValue,
            }
          : null,
      vat: {
        rate: '15%',
        amount: vatValue,
      },
      totalDuty: totalPayable,
      totalCost: vdpValue + totalPayable,
      currency: formData.invoiceCurrency,
      formulaDetails: {
        fob: fobValue,
        oceanFreight: oceanFreightValue,
        roadFreight: roadFreightValue,
        roadFreightIsDefault: !formData.carrierCharges,
      },
    };
  }, [
    formData.invoiceValue,
    formData.invoiceCurrency,
    formData.carrierCharges,
    vdpValue,
    dutyRate,
    customsDutyValue,
    surtaxStatus,
    surtaxValue,
    vatValue,
    totalPayable,
    fobValue,
    oceanFreightValue,
    roadFreightValue,
    isReturningResident,
    eligibilityConfirmed,
    excessAmount,
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

    if (formData.vehicleMake) {
      items.push({ label: 'Vehicle Make', value: formData.vehicleMake });
    }

    if (formData.vehicleType) {
      items.push({
        label: 'Vehicle Type',
        value: selectedVehicleType?.label ?? '',
        effect: isReturningResident
          ? 'Suspended'
          : `${(dutyRate * 100).toFixed(0)}% duty`,
      });
    }

    if (formData.weight && needsWeight) {
      items.push({
        label: 'Payload',
        value: WEIGHT_OPTIONS[formData.weight].label,
        effect: isReturningResident
          ? 'Suspended'
          : `${(WEIGHT_OPTIONS[formData.weight].dutyRate * 100).toFixed(0)}% duty`,
      });
    }

    if (formData.motorcycleEngine && needsEngineSize) {
      items.push({
        label: 'Engine Size',
        value: MOTORCYCLE_ENGINE_OPTIONS[formData.motorcycleEngine].label,
        effect: isReturningResident
          ? 'Suspended'
          : `${(MOTORCYCLE_ENGINE_OPTIONS[formData.motorcycleEngine].dutyRate * 100).toFixed(0)}% duty`,
      });
    }

    if (formData.trailerType && needsTrailerType) {
      items.push({
        label: 'Trailer Type',
        value: TRAILER_TYPES[formData.trailerType].label,
        effect: isReturningResident
          ? 'Suspended'
          : `${(TRAILER_TYPES[formData.trailerType].dutyRate * 100).toFixed(0)}% duty`,
      });
    }

    if (formData.specialPurposeType && needsSpecialPurposeType) {
      items.push({
        label: 'Special Purpose Type',
        value: SPECIAL_PURPOSE_TYPES[formData.specialPurposeType].label,
      });
    }

    if (formData.busCapacity && needsBusCapacity) {
      items.push({
        label: 'Bus Capacity',
        value: BUS_CAPACITY_OPTIONS[formData.busCapacity].label,
        effect: isReturningResident
          ? 'Suspended'
          : `${(BUS_CAPACITY_OPTIONS[formData.busCapacity].dutyRate * 100).toFixed(0)}% duty`,
      });
    }

    if (formData.yearOfManufacture) {
      const yearLabel =
        formData.yearOfManufacture === 'pre1970'
          ? 'Older than 1970'
          : formData.yearOfManufacture;
      let effect = '';
      if (isReturningResident) {
        effect = 'Surtax waived';
      } else if (surtaxStatus) {
        if (surtaxStatus.applies) {
          effect = '+35% surtax';
        } else if (vehicleAge > SURTAX_AGE_THRESHOLD) {
          effect = 'No surtax (exempt type)';
        } else {
          effect = 'No surtax';
        }
      }
      items.push({ label: 'Year of Manufacture', value: yearLabel, effect });
    }

    if (formData.countryOfSupply) {
      items.push({
        label: 'Country of Supply',
        value: COUNTRIES_OF_SUPPLY[formData.countryOfSupply].label,
      });
    }

    if (formData.invoiceCurrency && formData.invoiceValue) {
      items.push({
        label: 'Invoice Value',
        value: `${formData.invoiceCurrency} ${Number.parseFloat(formData.invoiceValue).toLocaleString()}`,
      });
    }

    return items;
  }, [
    formData,
    selectedVehicleType,
    needsWeight,
    needsEngineSize,
    needsTrailerType,
    needsSpecialPurposeType,
    needsBusCapacity,
    surtaxStatus,
    vehicleAge,
    dutyRate,
    isReturningResident,
  ]);

  const isStep1Valid =
    formData.importingAs !== '' &&
    (formData.importingAs === 'standard' ||
      (formData.importingAs === 'returning_resident' &&
        eligibilityConfirmed?.isEligible));

  const isStep2Valid = useMemo(() => {
    if (
      !formData.vehicleMake ||
      !formData.vehicleType ||
      !formData.yearOfManufacture
    ) {
      return false;
    }
    return isConditionalFieldFilled;
  }, [
    formData.vehicleMake,
    formData.vehicleType,
    formData.yearOfManufacture,
    isConditionalFieldFilled,
  ]);

  const canProceed: boolean = useMemo(() => {
    switch (step) {
      case 1:
        return isStep1Valid === true;
      case 2:
        return isStep2Valid === true;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, isStep1Valid, isStep2Valid]);

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

  const renderStep3Content = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-sm bg-teal-100 p-2">
            <Ship className="size-5 text-teal-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              Invoice & Shipping Details
            </h3>
            <p className="text-sm text-slate-500">
              Enter your invoice and freight information
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="countryOfSupply">Country of Supply *</Label>
          <Select
            value={formData.countryOfSupply}
            onValueChange={(value) => {
              updateFormData('countryOfSupply', value as CountryOfSupplyKey);
              if (
                !COUNTRIES_OF_SUPPLY[value as CountryOfSupplyKey]
                  .requiresOceanFreight
              ) {
                updateFormData('oceanFreightCurrency', '');
                updateFormData('oceanFreightCharges', '');
                updateFormData('otherCharges', '');
              }
            }}
          >
            <SelectTrigger id="countryOfSupply" className="w-full">
              <SelectValue placeholder="Select country of supply" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COUNTRIES_OF_SUPPLY).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoiceCurrency">Invoice Currency *</Label>
          <Select
            value={formData.invoiceCurrency}
            onValueChange={(value) =>
              updateFormData('invoiceCurrency', value as InvoiceCurrencyKey)
            }
          >
            <SelectTrigger id="invoiceCurrency" className="w-full">
              <SelectValue placeholder="Select invoice currency" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INVOICE_CURRENCIES).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">{info.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoiceValue">Invoice Value *</Label>
          <div className="relative">
            {formData.invoiceCurrency && (
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                {formData.invoiceCurrency}
              </span>
            )}
            <Input
              id="invoiceValue"
              type="number"
              placeholder={
                formData.invoiceCurrency
                  ? 'Enter invoice value'
                  : 'Select currency first'
              }
              value={formData.invoiceValue}
              onChange={(e) => updateFormData('invoiceValue', e.target.value)}
              className={formData.invoiceCurrency ? 'pl-14' : ''}
              disabled={!formData.invoiceCurrency}
            />
          </div>
        </div>

        {requiresOceanFreight && (
          <>
            <div className="border-t border-slate-200 pt-4">
              <div className="mb-4 flex items-center gap-2 text-slate-600">
                <Ship className="size-4" />
                <span className="text-sm font-medium">
                  Ocean Freight Details
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="oceanFreightCurrency">
                  Ocean Freight Currency
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
                  <SelectTrigger id="oceanFreightCurrency" className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INVOICE_CURRENCIES).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="oceanFreightCharges">
                  Ocean Freight Charges
                </Label>
                <div className="relative">
                  {formData.oceanFreightCurrency && (
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                      {formData.oceanFreightCurrency}
                    </span>
                  )}
                  <Input
                    id="oceanFreightCharges"
                    type="number"
                    placeholder={
                      formData.oceanFreightCurrency
                        ? 'Enter ocean freight charges'
                        : 'Select currency first'
                    }
                    value={formData.oceanFreightCharges}
                    onChange={(e) =>
                      updateFormData('oceanFreightCharges', e.target.value)
                    }
                    className={formData.oceanFreightCurrency ? 'pl-14' : ''}
                    disabled={!formData.oceanFreightCurrency}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="border-t border-slate-200 pt-4">
          <div className="mb-4 flex items-center gap-2 text-slate-600">
            <Truck className="size-4" />
            <span className="text-sm font-medium">Carrier to Border</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrierCurrency">Carrier Charges Currency</Label>
            <Select
              value={formData.carrierCurrency}
              onValueChange={(value) =>
                updateFormData('carrierCurrency', value as InvoiceCurrencyKey)
              }
            >
              <SelectTrigger id="carrierCurrency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INVOICE_CURRENCIES).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="carrierCharges">
              Carrier Charges to Border Post
            </Label>
            <div className="relative">
              {formData.carrierCurrency && (
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500">
                  {formData.carrierCurrency}
                </span>
              )}
              <Input
                id="carrierCharges"
                type="number"
                placeholder={
                  formData.carrierCurrency
                    ? 'Enter carrier charges'
                    : 'Select currency first'
                }
                value={formData.carrierCharges}
                onChange={(e) =>
                  updateFormData('carrierCharges', e.target.value)
                }
                className={formData.carrierCurrency ? 'pl-14' : ''}
                disabled={!formData.carrierCurrency}
              />
            </div>
            <p className="text-xs text-slate-500">
              Leave blank if self driven (freight and insurance is 6% of FOB)
            </p>
          </div>
        </div>

        {/* Exchange Rate Display */}
        {formData.invoiceCurrency && displayExchangeRate && (
          <div className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-slate-800">
              <ArrowRightLeft className="size-4 text-teal-600" />
              Exchange Rate
            </h4>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <ReactCountryFlag
                  countryCode={
                    INVOICE_CURRENCIES[formData.invoiceCurrency].countryCode
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
                <ReactCountryFlag
                  countryCode={dutyPayableCurrency === 'USD' ? 'US' : 'ZW'}
                  svg
                  style={{ width: '1.5em', height: '1.5em' }}
                />
                <span className="font-semibold text-teal-700">
                  {displayExchangeRate.toFixed(4)} {dutyPayableCurrency}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {requiresForeignCurrency
                ? 'Duty is payable in foreign currency (USD) for this vehicle type'
                : 'Duty can be paid in local currency (ZWL) for this vehicle type'}
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
                  {eligibilityConfirmed?.toa} years (up to US$40,000)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-sm bg-teal-100 p-2">
              <UserCheck className="size-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Import Type</h3>
              <p className="text-sm text-slate-500">
                Are you importing as a standard importer or returning resident?
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
              <div className="flex items-center space-x-3 rounded-sm border border-slate-200 p-4 transition-colors hover:border-teal-300">
                <RadioGroupItem value="standard" id="import-standard" />
                <Label
                  htmlFor="import-standard"
                  className="flex flex-1 cursor-pointer flex-col items-start"
                >
                  <span className="font-medium">Standard Import</span>
                </Label>
              </div>
              <p className="text-xs text-zinc-500">
                Regular import duties and taxes apply
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3 rounded-sm border border-slate-200 p-4 transition-colors hover:border-teal-300">
                <RadioGroupItem
                  value="returning_resident"
                  id="import-returning"
                />
                <Label
                  htmlFor="import-returning"
                  className="flex-1 cursor-pointer flex-col items-start"
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
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
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
                        className="mt-2 rounded-sm border-amber-300 bg-transparent font-normal text-amber-700 hover:bg-amber-100"
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
    }

    if (step === 3) {
      return renderStep3Content();
    }

    return (
      <div className="space-y-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-sm bg-teal-100 p-2">
            <Car className="size-5 text-teal-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Vehicle Selection</h3>
            <p className="text-sm text-slate-500">
              Select your vehicle details
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleMake">Vehicle Make *</Label>
          <Select
            value={formData.vehicleMake}
            onValueChange={(value) => updateFormData('vehicleMake', value)}
          >
            <SelectTrigger id="vehicleMake" className="w-full">
              <SelectValue placeholder="Select vehicle make" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {VEHICLE_MAKES.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle Type *</Label>
          <Select
            value={formData.vehicleType}
            onValueChange={(value) => {
              updateFormData('vehicleType', value as VehicleTypeKey);
              updateFormData('weight', '');
              updateFormData('motorcycleEngine', '');
              updateFormData('trailerType', '');
              updateFormData('specialPurposeType', '');
              updateFormData('busCapacity', '');
            }}
          >
            <SelectTrigger id="vehicleType" className="w-full">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(VEHICLE_TYPES).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedVehicleType && (
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-white">
              <Image
                src={selectedVehicleType.image || '/placeholder.svg'}
                alt={selectedVehicleType.label}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {showGVMNote && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Info className="size-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Gross Vehicle Mass exceeds 5 tonnes
              </span>
            </div>
          </div>
        )}

        {needsWeight && (
          <div className="space-y-3">
            <Label>Payload Weight *</Label>
            <RadioGroup
              value={formData.weight}
              onValueChange={(value) =>
                updateFormData('weight', value as WeightKey)
              }
              className="space-y-2"
            >
              {Object.entries(WEIGHT_OPTIONS).map(([key, info]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-teal-300"
                >
                  <RadioGroupItem value={key} id={`weight-${key}`} />
                  <Label
                    htmlFor={`weight-${key}`}
                    className="flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <span>{info.label}</span>
                    <span className="text-xs text-zinc-500">
                      {isReturningResident
                        ? '(Suspended)'
                        : `(${(info.dutyRate * 100).toFixed(0)}% duty)`}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {needsEngineSize && (
          <div className="space-y-3">
            <Label>Engine Capacity *</Label>
            <RadioGroup
              value={formData.motorcycleEngine}
              onValueChange={(value) =>
                updateFormData('motorcycleEngine', value as MotorcycleEngineKey)
              }
              className="space-y-2"
            >
              {Object.entries(MOTORCYCLE_ENGINE_OPTIONS).map(([key, info]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-teal-300"
                >
                  <RadioGroupItem value={key} id={`engine-${key}`} />
                  <Label
                    htmlFor={`engine-${key}`}
                    className="flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <span>{info.label}</span>
                    <span className="text-sm text-slate-500">
                      {isReturningResident
                        ? '(Suspended)'
                        : `(${(info.dutyRate * 100).toFixed(0)}% duty)`}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {needsTrailerType && (
          <div className="space-y-3">
            <Label>Trailer Type *</Label>
            <RadioGroup
              value={formData.trailerType}
              onValueChange={(value) =>
                updateFormData('trailerType', value as TrailerTypeKey)
              }
              className="space-y-2"
            >
              {Object.entries(TRAILER_TYPES).map(([key, info]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-teal-300"
                >
                  <RadioGroupItem value={key} id={`trailer-${key}`} />
                  <Label
                    htmlFor={`trailer-${key}`}
                    className="flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <span>{info.label}</span>
                    <span className="text-sm text-slate-500">
                      {isReturningResident
                        ? '(Suspended)'
                        : `(${(info.dutyRate * 100).toFixed(0)}% duty)`}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {needsSpecialPurposeType && (
          <div className="space-y-3">
            <Label>Special Purpose Vehicle Type *</Label>
            <RadioGroup
              value={formData.specialPurposeType}
              onValueChange={(value) =>
                updateFormData('specialPurposeType', value as SpecialPurposeKey)
              }
              className="space-y-2"
            >
              {Object.entries(SPECIAL_PURPOSE_TYPES).map(([key, info]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-teal-300"
                >
                  <RadioGroupItem value={key} id={`special-${key}`} />
                  <Label
                    htmlFor={`special-${key}`}
                    className="flex-1 cursor-pointer"
                  >
                    {info.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {needsBusCapacity && (
          <div className="space-y-3">
            <Label>Carrying Capacity *</Label>
            <RadioGroup
              value={formData.busCapacity}
              onValueChange={(value) =>
                updateFormData('busCapacity', value as BusCapacityKey)
              }
              className="space-y-2"
            >
              {Object.entries(BUS_CAPACITY_OPTIONS).map(([key, info]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-teal-300"
                >
                  <RadioGroupItem value={key} id={`bus-${key}`} />
                  <Label
                    htmlFor={`bus-${key}`}
                    className="flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <span>{info.label}</span>
                    <span className="text-sm text-slate-500">
                      {isReturningResident
                        ? '(Suspended)'
                        : `(${(info.dutyRate * 100).toFixed(0)}% duty)`}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="yearOfManufacture">Year of Manufacture *</Label>
          <Select
            value={formData.yearOfManufacture}
            onValueChange={(value) =>
              updateFormData('yearOfManufacture', value)
            }
          >
            <SelectTrigger id="yearOfManufacture" className="w-full">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {YEAR_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {licenceRequirement === 'VEHICLE BANNED' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <Ban className="size-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Vehicle Import Banned</p>
                <p className="text-sm">
                  This vehicle type cannot be imported if it is 10 years or
                  older
                </p>
              </div>
            </div>
          </div>
        )}

        {surtaxStatus && !isReturningResident && (
          <div
            className={`rounded-lg border p-3 ${
              surtaxStatus.applies
                ? 'border-amber-200 bg-amber-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            <div
              className={`flex items-center gap-2 ${surtaxStatus.applies ? 'text-amber-700' : 'text-green-700'}`}
            >
              <Info className="size-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                {surtaxStatus.message}
              </span>
            </div>
          </div>
        )}

        {isReturningResident && surtaxStatus?.applies && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="size-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Surtax waived (Returning Resident benefit)
              </span>
            </div>
          </div>
        )}
      </div>
    );
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
