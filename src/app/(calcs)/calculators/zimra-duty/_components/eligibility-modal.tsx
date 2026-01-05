'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { EligibilityChecker } from './eligibility-checker';

interface EligibilityResult {
  isEligible: boolean;
  periodOfAbsence: number;
  toa: number;
  messages: string[];
}

interface EligibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEligibilityConfirmed?: (result: EligibilityResult) => void;
}

export function EligibilityModal({
  open,
  onOpenChange,
  onEligibilityConfirmed,
}: EligibilityModalProps) {
  const handleConfirm = (result: EligibilityResult) => {
    onEligibilityConfirmed?.(result);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Returning Resident Eligibility Check</DialogTitle>
          <DialogDescription>
            Check if you qualify for the Returning Resident rebate before
            proceeding
          </DialogDescription>
        </DialogHeader>
        <EligibilityChecker onEligibilityConfirmed={handleConfirm} isModal />
      </DialogContent>
    </Dialog>
  );
}
