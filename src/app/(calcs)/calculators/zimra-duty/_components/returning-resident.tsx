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
import {
  Users,
  Calendar,
  DollarSign,
  Car,
  AlertCircle,
  Check,
  XCircle,
} from 'lucide-react';
import CalculatorLayout from './layout';
import {
  VEHICLE_TYPES,
  WEIGHT_OPTIONS,
  SPECIAL_PURPOSE_TYPES,
  EXCHANGE_RATES,
  YEARS,
  CURRENT_YEAR,
  SURTAX_AGE_THRESHOLD,
  VAT_RATE,
  SURTAX_RATE_VEHICLES,
  REBATE_VEHICLE_THRESHOLD,
  MIN_YEARS_ABROAD,
  MIN_OWNERSHIP_MONTHS,
  getVehicleDutyRate,
  prec,
  NATIONALITY_OPTIONS,
  VISA_TYPES,
  RETURN_REASONS,
  type VehicleTypeKey,
  type WeightKey,
  type SpecialPurposeKey,
  type BusCapacityKey,
  type TrailerTypeKey,
  type MotorcycleEngineKey,
  type CurrencyCode,
} from './constants';

interface FormData {
  nationality: string;
  countryOfBirth: string;
  visaType: string;
  returnReason: string;
  dateLeftZimbabwe: string;
  dateReturned: string;
  dateOwnershipChanged: string;
  vehicleMake: string;
  vehicleType: VehicleTypeKey | '';
  weight: WeightKey | '';
  specialPurposeType: SpecialPurposeKey | '';
  busCapacity: BusCapacityKey | '';
  trailerType: TrailerTypeKey | '';
  motorcycleEngine: MotorcycleEngineKey | '';
  yearOfManufacture: string;
  invoiceValue: string;
  invoiceCurrency: CurrencyCode;
  oceanFreight: string;
  oceanFreightCurrency: CurrencyCode;
  otherCharges: string;
  otherChargesCurrency: CurrencyCode;
  roadCarrierCharges: string;
  roadCarrierCurrency: CurrencyCode;
}

const CURRENCY_OPTIONS = Object.keys(EXCHANGE_RATES) as CurrencyCode[];

function calculatePeriod(
  startDate: string,
  endDate: string,
): { years: number; months: number; days: number; totalYears: number } | null {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return null;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalYears = years + months / 12 + days / 365;
  return { years, months, days, totalYears };
}

export default function ReturningResidentCalculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nationality: '',
    countryOfBirth: '',
    visaType: '',
    returnReason: '',
    dateLeftZimbabwe: '',
    dateReturned: '',
    dateOwnershipChanged: '',
    vehicleMake: '',
    vehicleType: '',
    weight: '',
    specialPurposeType: '',
    busCapacity: '',
    trailerType: '',
    motorcycleEngine: '',
    yearOfManufacture: '',
    invoiceValue: '',
    invoiceCurrency: 'USD',
    oceanFreight: '',
    oceanFreightCurrency: 'USD',
    otherCharges: '',
    otherChargesCurrency: 'USD',
    roadCarrierCharges: '',
    roadCarrierCurrency: 'USD',
  });

  const totalSteps = 7;

  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const needsWeight =
    formData.vehicleType === 'singleCab' || formData.vehicleType === 'panelVan';
  const needsSpecialPurpose = formData.vehicleType === 'specialPurpose';
  const needsBusCapacity = formData.vehicleType === 'bus';
  const needsTrailerType = formData.vehicleType === 'trailer';
  const needsMotorcycleEngine = formData.vehicleType === 'motorcycle';

  const periodAbroad = useMemo(
    () => calculatePeriod(formData.dateLeftZimbabwe, formData.dateReturned),
    [formData.dateLeftZimbabwe, formData.dateReturned],
  );
  const ownershipPeriod = useMemo(
    () => calculatePeriod(formData.dateOwnershipChanged, formData.dateReturned),
    [formData.dateOwnershipChanged, formData.dateReturned],
  );

  const meetsAbsenceRequirement =
    periodAbroad && periodAbroad.totalYears >= MIN_YEARS_ABROAD;
  const meetsOwnershipRequirement =
    ownershipPeriod && ownershipPeriod.totalYears >= MIN_OWNERSHIP_MONTHS;
  const isZimbabwean = formData.nationality === 'zimbabwe';
  const qualifiesForSuspension =
    meetsAbsenceRequirement && meetsOwnershipRequirement;

  const vehicleAge = formData.yearOfManufacture
    ? CURRENT_YEAR - Number.parseInt(formData.yearOfManufacture)
    : 0;
  const isPassengerVehicle = ['sedan', 'hatchback', 'doubleCab'].includes(
    formData.vehicleType,
  );
  const appliesSurtax =
    isPassengerVehicle &&
    vehicleAge > SURTAX_AGE_THRESHOLD &&
    formData.vehicleType !== 'hybridElectric';

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return (
          formData.nationality !== '' &&
          formData.visaType !== '' &&
          formData.returnReason !== ''
        );
      case 2:
        return (
          formData.dateLeftZimbabwe !== '' &&
          formData.dateReturned !== '' &&
          formData.dateOwnershipChanged !== ''
        );
      case 3:
        return (
          formData.vehicleType !== '' &&
          ((!needsWeight &&
            !needsSpecialPurpose &&
            !needsBusCapacity &&
            !needsTrailerType &&
            !needsMotorcycleEngine) ||
            (needsWeight && formData.weight !== '') ||
            (needsSpecialPurpose && formData.specialPurposeType !== '') ||
            (needsBusCapacity && formData.busCapacity !== '') ||
            (needsTrailerType && formData.trailerType !== '') ||
            (needsMotorcycleEngine && formData.motorcycleEngine !== ''))
        );
      case 4:
        return formData.yearOfManufacture !== '';
      case 5:
        return (
          formData.invoiceValue !== '' &&
          Number.parseFloat(formData.invoiceValue) > 0
        );
      case 6:
        return (
          formData.oceanFreight !== '' &&
          Number.parseFloat(formData.oceanFreight) >= 0
        );
      case 7:
        return (
          formData.roadCarrierCharges !== '' &&
          Number.parseFloat(formData.roadCarrierCharges) >= 0
        );
      default:
        return false;
    }
  }, [
    step,
    formData,
    needsWeight,
    needsSpecialPurpose,
    needsBusCapacity,
    needsTrailerType,
    needsMotorcycleEngine,
  ]);

  const convertToBase = (amount: string, currency: CurrencyCode): number => {
    const value = Number.parseFloat(amount) || 0;
    if (value === 0) return 0;
    const rate = EXCHANGE_RATES[currency] / EXCHANGE_RATES.USD;
    return prec(value * rate, 2);
  };

  const calculations = useMemo(() => {
    const invoiceValueBase = convertToBase(
      formData.invoiceValue,
      formData.invoiceCurrency,
    );
    const oceanFreightBase = convertToBase(
      formData.oceanFreight,
      formData.oceanFreightCurrency,
    );
    const otherChargesBase = convertToBase(
      formData.otherCharges,
      formData.otherChargesCurrency,
    );
    const roadCarrierChargesBase = convertToBase(
      formData.roadCarrierCharges,
      formData.roadCarrierCurrency,
    );
    const totalValueBase =
      invoiceValueBase +
      oceanFreightBase +
      otherChargesBase +
      roadCarrierChargesBase;

    const dutyRate = formData.vehicleType
      ? getVehicleDutyRate(formData.vehicleType, {
          weight: formData.weight || undefined,
          specialPurpose: formData.specialPurposeType || undefined,
          busCapacity: formData.busCapacity || undefined,
          trailerType: formData.trailerType || undefined,
          motorcycleEngine: formData.motorcycleEngine || undefined,
        })
      : 0;

    const surtaxRate = appliesSurtax ? SURTAX_RATE_VEHICLES : 0;

    if (qualifiesForSuspension) {
      if (totalValueBase <= REBATE_VEHICLE_THRESHOLD) {
        const vat = prec(totalValueBase * VAT_RATE, 2);
        return {
          vdp: totalValueBase,
          dutyRate,
          customsDuty: 0,
          surtaxRate: 0,
          surtax: 0,
          vat,
          totalDuty: vat,
          totalCost: prec(totalValueBase + vat, 2),
          eligible: true,
          suspensionApplied: true,
          dutiableExcess: 0,
          savedAmount: prec(
            totalValueBase * dutyRate + totalValueBase * surtaxRate,
            2,
          ),
        };
      } else {
        const dutiableExcess = totalValueBase - REBATE_VEHICLE_THRESHOLD;
        const customsDuty = prec(dutiableExcess * dutyRate, 2);
        const surtax = prec(dutiableExcess * surtaxRate, 2);
        const vtp = totalValueBase + customsDuty;
        const vat = prec(vtp * VAT_RATE, 2);
        const totalDuty = prec(customsDuty + surtax + vat, 2);

        return {
          vdp: totalValueBase,
          dutyRate,
          customsDuty,
          surtaxRate,
          surtax,
          vat,
          totalDuty,
          totalCost: prec(totalValueBase + totalDuty, 2),
          eligible: true,
          suspensionApplied: true,
          dutiableExcess,
          savedAmount: prec(
            REBATE_VEHICLE_THRESHOLD * dutyRate +
              REBATE_VEHICLE_THRESHOLD * surtaxRate,
            2,
          ),
        };
      }
    }

    const customsDuty = prec(totalValueBase * dutyRate, 2);
    const surtax = prec(totalValueBase * surtaxRate, 2);
    const vtp = totalValueBase + customsDuty;
    const vat = prec(vtp * VAT_RATE, 2);
    const totalDuty = prec(customsDuty + surtax + vat, 2);

    return {
      vdp: totalValueBase,
      dutyRate,
      customsDuty,
      surtaxRate,
      surtax,
      vat,
      totalDuty,
      totalCost: prec(totalValueBase + totalDuty, 2),
      eligible: false,
      suspensionApplied: false,
      dutiableExcess: 0,
      savedAmount: 0,
    };
  }, [formData, appliesSurtax, qualifiesForSuspension]);

  const summaryItems = useMemo(() => {
    const items: { label: string; value: string; effect?: string }[] = [];

    if (formData.nationality) {
      items.push({
        label: 'Nationality',
        value:
          NATIONALITY_OPTIONS[
            formData.nationality as keyof typeof NATIONALITY_OPTIONS
          ]?.label || formData.nationality,
        effect: isZimbabwean ? 'Qualifies for rebate' : undefined,
      });
    }

    if (formData.visaType) {
      items.push({
        label: 'Visa Type',
        value:
          VISA_TYPES[formData.visaType as keyof typeof VISA_TYPES]?.label ||
          formData.visaType,
      });
    }

    if (periodAbroad) {
      items.push({
        label: 'Period Abroad',
        value: `${periodAbroad.years}y ${periodAbroad.months}m ${periodAbroad.days}d`,
        effect: meetsAbsenceRequirement
          ? 'Meets 2 year requirement'
          : 'Less than 2 years',
      });
    }

    if (ownershipPeriod) {
      items.push({
        label: 'Ownership Period',
        value: `${ownershipPeriod.years}y ${ownershipPeriod.months}m ${ownershipPeriod.days}d`,
        effect: meetsOwnershipRequirement
          ? 'Meets 6 month requirement'
          : 'Less than 6 months',
      });
    }

    if (formData.vehicleType) {
      items.push({
        label: 'Vehicle Type',
        value: VEHICLE_TYPES[formData.vehicleType].label,
        effect: `${(calculations.dutyRate * 100).toFixed(0)}% duty rate`,
      });
    }

    if (formData.yearOfManufacture) {
      items.push({
        label: 'Year',
        value: formData.yearOfManufacture,
        effect:
          appliesSurtax && !calculations.suspensionApplied
            ? '+35% surtax'
            : undefined,
      });
    }

    if (formData.invoiceValue && Number.parseFloat(formData.invoiceValue) > 0) {
      items.push({
        label: 'Invoice Value',
        value: `${formData.invoiceCurrency} ${Number.parseFloat(formData.invoiceValue).toLocaleString()}`,
      });
    }

    return items;
  }, [
    formData,
    periodAbroad,
    ownershipPeriod,
    meetsAbsenceRequirement,
    meetsOwnershipRequirement,
    isZimbabwean,
    calculations,
    appliesSurtax,
  ]);

  const dutyBreakdown = useMemo(() => {
    if (!formData.invoiceValue || Number.parseFloat(formData.invoiceValue) <= 0)
      return null;

    if (calculations.suspensionApplied) {
      return {
        vdp: calculations.vdp,
        rebate: {
          amount: calculations.savedAmount,
          label: 'Suspension of Duty Saved',
        },
        customsDuty: {
          rate: `${(calculations.dutyRate * 100).toFixed(0)}%`,
          amount: calculations.customsDuty,
          note:
            calculations.customsDuty === 0
              ? 'NO DUTY PAYABLE'
              : `On excess of $${(calculations.vdp - REBATE_VEHICLE_THRESHOLD).toLocaleString()}`,
        },
        surtax:
          calculations.surtax > 0
            ? {
                rate: `${(calculations.surtaxRate * 100).toFixed(0)}%`,
                amount: calculations.surtax,
              }
            : { rate: '0%', amount: 0, note: 'NO SURTAX PAYABLE' },
        vat: {
          rate: `${(VAT_RATE * 100).toFixed(0)}%`,
          amount: calculations.vat,
        },
        totalDuty: calculations.totalDuty,
        totalCost: calculations.totalCost,
      };
    }

    return {
      vdp: calculations.vdp,
      customsDuty: {
        rate: `${(calculations.dutyRate * 100).toFixed(0)}%`,
        amount: calculations.customsDuty,
      },
      surtax:
        calculations.surtax > 0
          ? {
              rate: `${(calculations.surtaxRate * 100).toFixed(0)}%`,
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
  }, [calculations, formData.invoiceValue]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Users className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Eligibility Information
                </h3>
                <p className="text-sm text-slate-500">
                  Your nationality and visa status
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) => updateFormData('nationality', value)}
              >
                <SelectTrigger id="nationality">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NATIONALITY_OPTIONS).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visaType">Visa/Permit Type *</Label>
              <Select
                value={formData.visaType}
                onValueChange={(value) => updateFormData('visaType', value)}
              >
                <SelectTrigger id="visaType">
                  <SelectValue placeholder="Select visa type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VISA_TYPES).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnReason">Reason for Returning *</Label>
              <Select
                value={formData.returnReason}
                onValueChange={(value) => updateFormData('returnReason', value)}
              >
                <SelectTrigger id="returnReason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RETURN_REASONS).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Calendar className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Important Dates
                </h3>
                <p className="text-sm text-slate-500">
                  For calculating eligibility periods
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateLeft">Date Left Zimbabwe *</Label>
              <Input
                id="dateLeft"
                type="date"
                value={formData.dateLeftZimbabwe}
                onChange={(e) =>
                  updateFormData('dateLeftZimbabwe', e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateReturned">
                Date Returned (or Intended Return) *
              </Label>
              <Input
                id="dateReturned"
                type="date"
                value={formData.dateReturned}
                onChange={(e) => updateFormData('dateReturned', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOwnership">
                Date Vehicle Ownership Changed *
              </Label>
              <Input
                id="dateOwnership"
                type="date"
                value={formData.dateOwnershipChanged}
                onChange={(e) =>
                  updateFormData('dateOwnershipChanged', e.target.value)
                }
              />
            </div>

            {periodAbroad && ownershipPeriod && (
              <div
                className={`rounded-lg border-2 p-4 ${qualifiesForSuspension ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}
              >
                <div
                  className={`flex items-start gap-3 ${qualifiesForSuspension ? 'text-green-800' : 'text-red-800'}`}
                >
                  {qualifiesForSuspension ? (
                    <Check className="mt-0.5 size-5" />
                  ) : (
                    <XCircle className="mt-0.5 size-5" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {qualifiesForSuspension
                        ? 'You qualify for Suspension of Duty!'
                        : 'You do NOT qualify for Suspension of Duty'}
                    </p>
                    <p className="mt-1 text-sm">
                      {qualifiesForSuspension
                        ? 'Customs duty and surtax will be waived for vehicles up to $40,000 in value. VAT still applies.'
                        : 'You must be abroad for at least 2 years AND own the vehicle for at least 6 months to qualify.'}
                    </p>
                  </div>
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
                <Car className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Vehicle Details
                </h3>
                <p className="text-sm text-slate-500">
                  Select your vehicle type
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value) => {
                  updateFormData('vehicleType', value as VehicleTypeKey);
                  updateFormData('weight', '');
                  updateFormData('specialPurposeType', '');
                  updateFormData('busCapacity', '');
                  updateFormData('trailerType', '');
                  updateFormData('motorcycleEngine', '');
                }}
              >
                <SelectTrigger id="vehicleType">
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

            {needsWeight && (
              <div className="space-y-3">
                <Label>Weight Capacity *</Label>
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
                        className="flex-1 cursor-pointer"
                      >
                        {info.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {needsSpecialPurpose && (
              <div className="space-y-3">
                <Label>Special Purpose Type *</Label>
                <RadioGroup
                  value={formData.specialPurposeType}
                  onValueChange={(value) =>
                    updateFormData(
                      'specialPurposeType',
                      value as SpecialPurposeKey,
                    )
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Calendar className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Year of Manufacture
                </h3>
                <p className="text-sm text-slate-500">
                  Vehicle age affects surtax calculations
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year of Manufacture *</Label>
              <Select
                value={formData.yearOfManufacture}
                onValueChange={(value) =>
                  updateFormData('yearOfManufacture', value)
                }
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.yearOfManufacture &&
              vehicleAge > SURTAX_AGE_THRESHOLD &&
              isPassengerVehicle &&
              !qualifiesForSuspension && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-start gap-2 text-amber-700">
                    <AlertCircle className="mt-0.5 size-4" />
                    <span className="text-sm">
                      This {vehicleAge} year old vehicle would normally attract
                      a 35% surtax.
                    </span>
                  </div>
                </div>
              )}

            {formData.yearOfManufacture && qualifiesForSuspension && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="size-4" />
                  <span className="text-sm font-medium">
                    Surtax will be waived under the Suspension of Duty benefit
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <DollarSign className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Vehicle Value</h3>
                <p className="text-sm text-slate-500">
                  Fair market value of the vehicle
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceValue">Invoice Value *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.invoiceCurrency}
                  onValueChange={(value) =>
                    updateFormData('invoiceCurrency', value as CurrencyCode)
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="invoiceValue"
                  type="number"
                  placeholder="0.00"
                  className="flex-1"
                  value={formData.invoiceValue}
                  onChange={(e) =>
                    updateFormData('invoiceValue', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <DollarSign className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Ocean Freight</h3>
                <p className="text-sm text-slate-500">
                  Cost of ocean freight (enter 0 if none)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oceanFreight">Ocean Freight *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.oceanFreightCurrency}
                  onValueChange={(value) =>
                    updateFormData(
                      'oceanFreightCurrency',
                      value as CurrencyCode,
                    )
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="oceanFreight"
                  type="number"
                  placeholder="0.00"
                  className="flex-1"
                  value={formData.oceanFreight}
                  onChange={(e) =>
                    updateFormData('oceanFreight', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <DollarSign className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Road Carrier Charges
                </h3>
                <p className="text-sm text-slate-500">
                  Other associated charges (enter 0 if none)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadCarrierCharges">Road Carrier Charges *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.roadCarrierCurrency}
                  onValueChange={(value) =>
                    updateFormData('roadCarrierCurrency', value as CurrencyCode)
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="roadCarrierCharges"
                  type="number"
                  placeholder="0.00"
                  className="flex-1"
                  value={formData.roadCarrierCharges}
                  onChange={(e) =>
                    updateFormData('roadCarrierCharges', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CalculatorLayout
      step={step}
      totalSteps={totalSteps}
      summaryItems={summaryItems}
      dutyBreakdown={dutyBreakdown}
      onBack={() => setStep((s) => Math.max(1, s - 1))}
      onNext={() => setStep((s) => Math.min(totalSteps, s + 1))}
      canProceed={canProceed}
    >
      {renderStepContent()}
    </CalculatorLayout>
  );
}
