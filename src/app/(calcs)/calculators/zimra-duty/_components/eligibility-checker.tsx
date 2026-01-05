'use client';

import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  User,
  Calendar,
  Clock,
  AlertCircle,
  Check,
  Globe,
  ChevronLeft,
  ChevronRight,
  FileText,
  Stamp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Reason for return options with corresponding TOA
const RETURN_REASONS = {
  completed_studies: { label: 'Completed Studies', toa: 2 },
  retirement: { label: 'Retirement', toa: 5 },
  health_related: { label: 'Health related issues', toa: 5 },
  returning_home: { label: 'Returning back home', toa: 5 },
  resignation: { label: 'Resignation from work', toa: 2 },
  end_diplomatic: { label: 'End of diplomatic mission', toa: 2 },
  other: { label: 'Other', toa: 2 },
} as const;

const VISA_TYPES = {
  permanent_resident: 'Permanent Resident VISA',
  employment: 'Employment VISA',
  study: 'Study VISA',
} as const;

type ReturnReasonKey = keyof typeof RETURN_REASONS;
type VisaTypeKey = keyof typeof VISA_TYPES;

interface EligibilityFormData {
  nationality: 'zimbabwe' | 'other' | '';
  nationalityOther: string;
  countryOfBirth: 'zimbabwe' | 'other' | '';
  countryOfBirthOther: string;
  visaType: VisaTypeKey | '';
  visaDate: string;
  dateLeftZimbabwe: string;
  dateReturning: string;
  reasonForReturn: ReturnReasonKey | '';
  otherReason: string;
}

interface EligibilityResult {
  isEligible: boolean;
  periodOfAbsence: number;
  toa: number;
  messages: string[];
}

interface EligibilityCheckerProps {
  onEligibilityConfirmed?: (result: EligibilityResult) => void;
  isModal?: boolean;
}

export function EligibilityChecker({
  onEligibilityConfirmed,
  isModal = false,
}: EligibilityCheckerProps) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<EligibilityFormData>({
    nationality: '',
    nationalityOther: '',
    countryOfBirth: '',
    countryOfBirthOther: '',
    visaType: '',
    visaDate: '',
    dateLeftZimbabwe: '',
    dateReturning: '',
    reasonForReturn: '',
    otherReason: '',
  });

  const requiresVisaStep = formData.countryOfBirth === 'other';
  const totalSteps = requiresVisaStep ? 6 : 5;

  const updateFormData = <K extends keyof EligibilityFormData>(
    key: K,
    value: EligibilityFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const periodStartDate = useMemo(() => {
    if (requiresVisaStep) {
      return formData.visaDate;
    }
    return formData.dateLeftZimbabwe;
  }, [requiresVisaStep, formData.visaDate, formData.dateLeftZimbabwe]);

  // Calculate period of absence in years
  const periodOfAbsence = useMemo(() => {
    if (!periodStartDate || !formData.dateReturning) return 0;
    const leftDate = new Date(periodStartDate);
    const returnDate = new Date(formData.dateReturning);
    const diffTime = returnDate.getTime() - leftDate.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, diffYears);
  }, [periodStartDate, formData.dateReturning]);

  const meetsMinimumAbsence = periodOfAbsence >= 2;

  // Get TOA based on reason for return
  const toa = useMemo(() => {
    if (!formData.reasonForReturn) return 0;
    return RETURN_REASONS[formData.reasonForReturn].toa;
  }, [formData.reasonForReturn]);

  // Check eligibility
  const eligibilityResult = useMemo((): EligibilityResult => {
    const messages: string[] = [];
    let isEligible = true;

    // Check nationality/birth
    if (
      formData.nationality !== 'zimbabwe' &&
      formData.countryOfBirth !== 'zimbabwe'
    ) {
      isEligible = false;
      messages.push('Must be a Zimbabwean citizen or born in Zimbabwe');
    }

    // Check period of absence
    if (!meetsMinimumAbsence) {
      isEligible = false;
      messages.push('Minimum period of absence is 2 years');
    }

    if (isEligible) {
      messages.push('You qualify for the Returning Resident rebate');
      messages.push(`Time of Arrival (TOA) benefit: ${toa} years`);
    }

    return {
      isEligible,
      periodOfAbsence,
      toa,
      messages,
    };
  }, [
    formData.nationality,
    formData.countryOfBirth,
    meetsMinimumAbsence,
    periodOfAbsence,
    toa,
  ]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return formData.nationality !== '';
      case 2:
        // VISA type is required when country of birth is other
        if (formData.countryOfBirth === 'other') {
          return formData.visaType !== '';
        }
        return formData.countryOfBirth !== '';
      case 3:
        if (requiresVisaStep) {
          // VISA step - need VISA date for permanent resident or employment
          if (
            formData.visaType === 'permanent_resident' ||
            formData.visaType === 'employment'
          ) {
            return formData.visaDate !== '';
          }
          // Study VISA - no date required, can proceed
          return true;
        }
        // Original step 3 (period of absence) - now only for Zimbabwe-born
        return (
          formData.dateLeftZimbabwe !== '' &&
          formData.dateReturning !== '' &&
          meetsMinimumAbsence
        );
      case 4:
        if (requiresVisaStep) {
          // Period of absence step for VISA holders
          return formData.dateReturning !== '' && meetsMinimumAbsence;
        }
        // Original step 4 (reason for return)
        return (
          formData.reasonForReturn !== '' &&
          (formData.reasonForReturn !== 'other' || formData.otherReason !== '')
        );
      case 5:
        if (requiresVisaStep) {
          // Reason for return step for VISA holders
          return (
            formData.reasonForReturn !== '' &&
            (formData.reasonForReturn !== 'other' ||
              formData.otherReason !== '')
          );
        }
        // Result step
        return true;
      case 6:
        // Result step for VISA holders
        return true;
      default:
        return false;
    }
  }, [step, formData, meetsMinimumAbsence, requiresVisaStep]);

  const summaryItems = useMemo(() => {
    const items: { label: string; value: string }[] = [];

    if (formData.nationality) {
      items.push({
        label: 'Nationality',
        value:
          formData.nationality === 'zimbabwe'
            ? 'Zimbabwean'
            : formData.nationalityOther || 'Other',
      });
    }
    if (formData.countryOfBirth) {
      items.push({
        label: 'Country of Birth',
        value:
          formData.countryOfBirth === 'zimbabwe'
            ? 'Zimbabwe'
            : formData.countryOfBirthOther || 'Other',
      });
    }
    if (formData.visaType) {
      items.push({
        label: 'VISA Type',
        value: VISA_TYPES[formData.visaType],
      });
    }
    if (formData.visaDate) {
      items.push({
        label:
          formData.visaType === 'permanent_resident'
            ? 'Permanent Residence Date'
            : 'Employment Date',
        value: new Date(formData.visaDate).toLocaleDateString(),
      });
    }
    if (formData.dateLeftZimbabwe && !requiresVisaStep) {
      items.push({
        label: 'Date Left',
        value: new Date(formData.dateLeftZimbabwe).toLocaleDateString(),
      });
    }
    if (formData.dateReturning) {
      items.push({
        label: 'Date Returning',
        value: new Date(formData.dateReturning).toLocaleDateString(),
      });
    }
    if (periodOfAbsence > 0) {
      items.push({
        label: 'Period of Absence',
        value: `${periodOfAbsence.toFixed(1)} years`,
      });
    }
    if (formData.reasonForReturn) {
      const reason =
        formData.reasonForReturn === 'other'
          ? formData.otherReason || 'Other'
          : RETURN_REASONS[formData.reasonForReturn].label;
      items.push({ label: 'Reason for Return', value: reason });
    }
    if (toa > 0) {
      items.push({ label: 'TOA Benefit', value: `${toa} years` });
    }

    return items;
  }, [formData, periodOfAbsence, toa, requiresVisaStep]);

  const getVisaDateLabel = () => {
    if (formData.visaType === 'permanent_resident') {
      return 'Date/(Intended date) of taking up permanent residence *';
    }
    if (formData.visaType === 'employment') {
      return 'Date/(Intended date) of taking up employment *';
    }
    return '';
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <User className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800">Nationality</h3>
                <p className="text-sm text-zinc-500">
                  What is your nationality?
                </p>
              </div>
            </div>

            <RadioGroup
              value={formData.nationality}
              onValueChange={(value) =>
                updateFormData('nationality', value as 'zimbabwe' | 'other')
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-teal-300">
                <RadioGroupItem value="zimbabwe" id="nat-zim" />
                <Label
                  htmlFor="nat-zim"
                  className="flex-1 cursor-pointer font-medium"
                >
                  Zimbabwean
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-teal-300">
                <RadioGroupItem value="other" id="nat-other" />
                <Label
                  htmlFor="nat-other"
                  className="flex-1 cursor-pointer font-medium"
                >
                  Other
                </Label>
              </div>
            </RadioGroup>

            {formData.nationality === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="nationalityOther">
                  Please specify your nationality (optional)
                </Label>
                <Input
                  id="nationalityOther"
                  placeholder="Enter your nationality"
                  value={formData.nationalityOther}
                  onChange={(e) =>
                    updateFormData('nationalityOther', e.target.value)
                  }
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Globe className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800">
                  Country of Birth
                </h3>
                <p className="text-sm text-zinc-500">Where were you born?</p>
              </div>
            </div>

            <RadioGroup
              value={formData.countryOfBirth}
              onValueChange={(value) => {
                updateFormData('countryOfBirth', value as 'zimbabwe' | 'other');
                // Reset VISA fields when changing country of birth
                if (value === 'zimbabwe') {
                  updateFormData('visaType', '');
                  updateFormData('visaDate', '');
                }
              }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-teal-300">
                <RadioGroupItem value="zimbabwe" id="birth-zim" />
                <Label
                  htmlFor="birth-zim"
                  className="flex-1 cursor-pointer font-medium"
                >
                  Zimbabwe
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-teal-300">
                <RadioGroupItem value="other" id="birth-other" />
                <Label
                  htmlFor="birth-other"
                  className="flex-1 cursor-pointer font-medium"
                >
                  Other
                </Label>
              </div>
            </RadioGroup>

            {formData.countryOfBirth === 'other' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="countryOfBirthOther">
                    Please specify your country of birth (optional)
                  </Label>
                  <Input
                    id="countryOfBirthOther"
                    placeholder="Enter your country of birth"
                    value={formData.countryOfBirthOther}
                    onChange={(e) =>
                      updateFormData('countryOfBirthOther', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visaType">
                    Type of Zimbabwean VISA granted *
                  </Label>
                  <Select
                    value={formData.visaType}
                    onValueChange={(value) => {
                      updateFormData('visaType', value as VisaTypeKey);
                      // Reset visa date when changing visa type
                      updateFormData('visaDate', '');
                    }}
                  >
                    <SelectTrigger id="visaType" className="w-full">
                      <SelectValue placeholder="Select VISA type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VISA_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        );

      case 3:
        if (requiresVisaStep) {
          return (
            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-teal-100 p-2">
                  <Stamp className="size-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-800">VISA Details</h3>
                  <p className="text-sm text-zinc-500">
                    {formData.visaType === 'study'
                      ? 'Your Study VISA information'
                      : 'When did you take up your VISA status?'}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm text-zinc-600">
                  <span className="font-medium">VISA Type:</span>{' '}
                  {formData.visaType && VISA_TYPES[formData.visaType]}
                </p>
              </div>

              {(formData.visaType === 'permanent_resident' ||
                formData.visaType === 'employment') && (
                <div className="space-y-2">
                  <Label htmlFor="visaDate">{getVisaDateLabel()}</Label>
                  <Input
                    id="visaDate"
                    type="date"
                    value={formData.visaDate}
                    onChange={(e) => updateFormData('visaDate', e.target.value)}
                  />
                  <p className="text-xs text-zinc-500">
                    This date will be used to calculate your period of absence
                  </p>
                </div>
              )}

              {formData.visaType === 'study' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">
                    No additional date information is required for Study VISA
                    holders. Please proceed to the next step.
                  </p>
                </div>
              )}
            </div>
          );
        }

        // Original Step 3 - Period of Absence for Zimbabwe-born
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Calendar className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800">
                  Period of Absence
                </h3>
                <p className="text-sm text-zinc-500">
                  When did you leave and when are you returning?
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateLeft">Date you left Zimbabwe *</Label>
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
                <Label htmlFor="dateReturn">
                  Date / (Intended date) of coming to Zimbabwe *
                </Label>
                <Input
                  id="dateReturn"
                  type="date"
                  value={formData.dateReturning}
                  onChange={(e) =>
                    updateFormData('dateReturning', e.target.value)
                  }
                />
                <p className="text-xs text-zinc-500">
                  Note: If you haven&apos;t returned yet, enter your intended
                  return date
                </p>
              </div>

              {formData.dateLeftZimbabwe && formData.dateReturning && (
                <div
                  className={cn(
                    'rounded-lg border p-4',
                    meetsMinimumAbsence
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50',
                  )}
                >
                  <div className="flex items-center gap-2">
                    {meetsMinimumAbsence ? (
                      <Check className="size-5 text-green-600" />
                    ) : (
                      <AlertCircle className="size-5 text-red-600" />
                    )}
                    <div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          meetsMinimumAbsence
                            ? 'text-green-700'
                            : 'text-red-700',
                        )}
                      >
                        Period of Absence: {periodOfAbsence.toFixed(1)} years
                      </p>
                      <p
                        className={cn(
                          'text-sm',
                          meetsMinimumAbsence
                            ? 'text-green-600'
                            : 'text-red-600',
                        )}
                      >
                        {meetsMinimumAbsence
                          ? 'Meets the minimum 2-year requirement'
                          : 'Does not meet the minimum 2-year requirement'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        if (requiresVisaStep) {
          return (
            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-teal-100 p-2">
                  <Calendar className="size-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-800">
                    Period of Absence
                  </h3>
                  <p className="text-sm text-zinc-500">
                    When are you returning to Zimbabwe?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Show the start date as read-only info */}
                {periodStartDate && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-600">
                      <span className="font-medium">
                        {formData.visaType === 'permanent_resident'
                          ? 'Permanent Residence Date:'
                          : 'Employment Date:'}
                      </span>{' '}
                      {new Date(periodStartDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dateReturn">
                    Date / (Intended date) of coming to Zimbabwe *
                  </Label>
                  <Input
                    id="dateReturn"
                    type="date"
                    value={formData.dateReturning}
                    onChange={(e) =>
                      updateFormData('dateReturning', e.target.value)
                    }
                  />
                  <p className="text-xs text-zinc-500">
                    Note: If you haven&apos;t returned yet, enter your intended
                    return date
                  </p>
                </div>

                {periodStartDate && formData.dateReturning && (
                  <div
                    className={cn(
                      'rounded-lg border p-4',
                      meetsMinimumAbsence
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {meetsMinimumAbsence ? (
                        <Check className="size-5 text-green-600" />
                      ) : (
                        <AlertCircle className="size-5 text-red-600" />
                      )}
                      <div>
                        <p
                          className={cn(
                            'text-sm font-medium',
                            meetsMinimumAbsence
                              ? 'text-green-700'
                              : 'text-red-700',
                          )}
                        >
                          Period of Absence: {periodOfAbsence.toFixed(1)} years
                        </p>
                        <p
                          className={cn(
                            'text-sm',
                            meetsMinimumAbsence
                              ? 'text-green-600'
                              : 'text-red-600',
                          )}
                        >
                          {meetsMinimumAbsence
                            ? 'Meets the minimum 2-year requirement'
                            : 'Does not meet the minimum 2-year requirement'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Original Step 4 - Reason for Return for Zimbabwe-born
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <FileText className="size-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-800">
                  Reason for Return
                </h3>
                <p className="text-sm text-zinc-500">
                  Why are you returning to Zimbabwe?
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Select your reason *</Label>
              <Select
                value={formData.reasonForReturn}
                onValueChange={(value) =>
                  updateFormData('reasonForReturn', value as ReturnReasonKey)
                }
              >
                <SelectTrigger id="reason" className="w-full">
                  <SelectValue placeholder="Select reason for return" />
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

            {formData.reasonForReturn === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="otherReason">
                  Please specify your reason *
                </Label>
                <Input
                  id="otherReason"
                  placeholder="Enter your reason for returning"
                  value={formData.otherReason}
                  onChange={(e) =>
                    updateFormData('otherReason', e.target.value)
                  }
                />
              </div>
            )}

            {formData.reasonForReturn && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start gap-2">
                  <Clock className="size-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-zinc-700">
                      Time Of Arrival (TOA) Benefit
                    </p>
                    <p className="text-sm text-zinc-600">
                      Based on your reason, you qualify for a{' '}
                      <strong>{toa}-year</strong> TOA benefit period
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        if (requiresVisaStep) {
          return (
            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-teal-100 p-2">
                  <FileText className="size-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-800">
                    Reason for Return
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Why are you returning to Zimbabwe?
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Select your reason *</Label>
                <Select
                  value={formData.reasonForReturn}
                  onValueChange={(value) =>
                    updateFormData('reasonForReturn', value as ReturnReasonKey)
                  }
                >
                  <SelectTrigger id="reason" className="w-full">
                    <SelectValue placeholder="Select reason for return" />
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

              {formData.reasonForReturn === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="otherReason">
                    Please specify your reason *
                  </Label>
                  <Input
                    id="otherReason"
                    placeholder="Enter your reason for returning"
                    value={formData.otherReason}
                    onChange={(e) =>
                      updateFormData('otherReason', e.target.value)
                    }
                  />
                </div>
              )}

              {formData.reasonForReturn && (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="size-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-zinc-700">
                        Time Of Arrival (TOA) Benefit
                      </p>
                      <p className="text-sm text-zinc-600">
                        Based on your reason, you qualify for a{' '}
                        <strong>{toa}-year</strong> TOA benefit period
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Result step for Zimbabwe-born (original step 5)
        return renderResultStep();

      case 6:
        return renderResultStep();

      default:
        return null;
    }
  };

  const renderResultStep = () => (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-3">
        <div
          className={cn(
            'rounded-lg p-2',
            eligibilityResult.isEligible ? 'bg-green-100' : 'bg-red-100',
          )}
        >
          {eligibilityResult.isEligible ? (
            <Check className="size-5 text-green-700" />
          ) : (
            <AlertCircle className="size-5 text-red-700" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-zinc-800">Eligibility Result</h3>
          <p className="text-sm text-zinc-500">
            Your returning resident eligibility status
          </p>
        </div>
      </div>

      <div
        className={cn(
          'rounded-lg border-2 p-6',
          eligibilityResult.isEligible
            ? 'border-green-100 bg-green-50'
            : 'border-red-300 bg-red-50',
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {eligibilityResult.isEligible ? (
              <div className="rounded-full bg-green-500 p-1">
                <Check className="size-4 text-white" />
              </div>
            ) : (
              <div className="rounded-full bg-red-500 p-1">
                <AlertCircle className="size-4 text-white" />
              </div>
            )}
            <h4
              className={cn(
                'text-xl font-bold',
                eligibilityResult.isEligible
                  ? 'text-green-700'
                  : 'text-red-700',
              )}
            >
              {eligibilityResult.isEligible ? 'You Qualify!' : 'Not Eligible'}
            </h4>
          </div>

          <ul className="space-y-2">
            {eligibilityResult.messages.map((msg, idx) => (
              <li
                key={idx}
                className={cn(
                  'flex items-start gap-2 text-sm',
                  eligibilityResult.isEligible
                    ? 'text-green-700'
                    : 'text-red-700',
                )}
              >
                <span className="ml-1">•</span>
                <span>{msg}</span>
              </li>
            ))}
          </ul>

          {eligibilityResult.isEligible && (
            <div className="mt-4 rounded-lg bg-white/50 p-4">
              <h5 className="mb-2 font-semibold text-green-800">Summary</h5>
              <div className="grid gap-2 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Period of Absence:</span>
                  <span className="font-medium">
                    {periodOfAbsence.toFixed(1)} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TOA Benefit Period:</span>
                  <span className="font-medium">{toa} years</span>
                </div>
              </div>
            </div>
          )}

          {eligibilityResult.isEligible && onEligibilityConfirmed && (
            <Button
              onClick={() => onEligibilityConfirmed(eligibilityResult)}
              className="mt-4 w-full bg-green-600 hover:bg-green-700"
            >
              Confirm & Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-0">
      <div className="mx-auto max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-zinc-600">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full bg-teal-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 size-4" />
            Back
          </Button>
          {step < totalSteps ? (
            <Button
              onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canProceed}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Next
              <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
