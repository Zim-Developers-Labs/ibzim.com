'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

const GUIDE_STEPS = [
  {
    title: 'Welcome Aboard!',
    content:
      'Welcome to the IBZIM Beta Program! We’re excited to have you on this journey with us.',
    highlight:
      'What better way to get a product you can actually use, than have it built the way you want?',
  },
  {
    title: 'What is IBZIM?',
    content:
      'IBZIM is a platform for information about Zimbabwe. In addition to consuming content, you can create content as well on IBZIM to earn some cash and rewards.',
  },
  {
    title: 'Further Understanding',
    content:
      'You can click the "docs" button to learn more about the features and how to use them.',
    highlight: 'NB: Some documentation may be incomplete',
  },
  {
    title: 'Get Started',
    content:
      'Scroll through the list of features, try them out on ibzim.com and provide feedback through ratings and issue reports.',
    highlight:
      'You can reopen this guide anytime by clicking "learn more" on the banner.',
  },
];

export default function WelcomeGuideDialog({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = GUIDE_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === GUIDE_STEPS.length - 1;

  const handleNext = () => {
    console.log(
      'Next button clicked, current step:',
      currentStep,
      'isLastStep:',
      isLastStep,
    );
    if (isLastStep) {
      console.log('Last step reached, closing dialog');
      onOpenChange?.(false);
      setCurrentStep(0); // Reset for next time
    } else {
      console.log('Moving to next step:', currentStep + 1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked, current step:', currentStep);
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    console.log('Skip button clicked');
    onOpenChange?.(false);
    setCurrentStep(0); // Reset for next time
  };

  const handleOpenChange = (open: boolean) => {
    console.log('Dialog open state changing to:', open);
    if (!open) {
      setCurrentStep(0);
    }
    onOpenChange?.(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Welcome Guide Dialog</DialogTitle>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-center text-xl font-semibold">
            {currentStepData.title}
          </div>
          <div className="text-primaryColor text-sm font-medium">
            Step {currentStep + 1}/{GUIDE_STEPS.length}
          </div>

          <div className="text-foreground text-center">
            {currentStepData.content}
          </div>
          <div className="text-muted-foreground text-center text-sm font-semibold">
            {currentStepData.highlight}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {isFirstStep && (
              <Button variant="outline" onClick={handleSkip}>
                Skip Guide
              </Button>
            )}
            <Button
              variant="default"
              className="bg-primaryColor text-primary-foreground hover:bg-primaryColor/90"
              onClick={handleNext}
            >
              {isLastStep ? 'Get Started' : 'Next Step'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
