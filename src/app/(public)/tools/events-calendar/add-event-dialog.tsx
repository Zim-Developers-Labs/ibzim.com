'use client';

import { useActionState, useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle,
  Plus,
  BadgeDollarSign,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from './date-time-picker';
import { User } from 'lucia';
import AddEventSignToggler from './add-event-sign-toggler';
import { submitEvent } from './actions';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/ui/submit-button';
import { OrganizerProfile } from '@/server/db/schema';
import { Icons } from '@/components/icons';

// Demo enum values based on the database schema
const eventTypes = [
  { value: 'awards', label: 'Awards' },
  { value: 'chillout', label: 'Chillout' },
  { value: 'competition', label: 'Competition' },
  { value: 'concert', label: 'Concert' },
  { value: 'conference', label: 'Conference' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'festival', label: 'Festival' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'party', label: 'Party' },
  { value: 'show', label: 'Show' },
  { value: 'social', label: 'Social' },
  { value: 'training', label: 'Training' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
];

const eventCategories = [
  { value: 'business', label: 'Business Event' },
  { value: 'casual', label: 'Casual Event' },
  { value: 'community', label: 'Community Event' },
  { value: 'holiday', label: 'Holiday Event' },
  { value: 'music', label: 'Music Event' },
  { value: 'religious', label: 'Religious Event' },
  { value: 'school', label: 'School Event' },
  { value: 'sports', label: 'Sports Event' },
  { value: 'tech', label: 'Tech Event' },
];

const eventLocationTypes = [
  { value: 'physical', label: 'Physical' },
  { value: 'virtual', label: 'Virtual' },
];

const eventRecurrences = [
  { value: 'none', label: 'No Recurrence' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

interface EventFormData {
  title: string;
  description: string;
  type: string;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  locationType: string;
  locationLink: string;
  priority: string;
  recurrence: string;
  pricingTiers: string;
  pricingDetails: string;
  ticketsLink: string;
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  type: '',
  startTime: '',
  startDate: '',
  endDate: '',
  endTime: '',
  category: '',
  location: '',
  locationType: '',
  locationLink: '',
  priority: 'low',
  recurrence: 'none',
  pricingTiers: '',
  pricingDetails: '',
  ticketsLink: '',
};

const steps = [
  { id: 1, title: 'Basic Info', icon: CalendarDays },
  { id: 2, title: 'Date & Time', icon: Clock },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Settings', icon: BadgeDollarSign },
  { id: 5, title: 'Review', icon: CheckCircle },
];

export default function AddEventDialog({
  user,
  organizer,
  isAddEventOpen,
  setIsAddEventOpen,
}: {
  organizer: OrganizerProfile | null;
  user: User | null;
  isAddEventOpen: boolean;
  setIsAddEventOpen: (open: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  const updateFormData = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.title.trim() !== '' &&
          formData.type !== '' &&
          formData.category !== '' &&
          formData.description.trim() !== ''
        );
      case 2:
        return formData.startDate !== '' && formData.startTime !== '';
      case 3:
        return formData.locationType !== '' && formData.location !== '';
      case 4:
        // Pricing validation: first tier can be empty, but additional tiers must have name and price
        return pricingTiers.every((tier, index) => {
          if (index === 0) {
            // First tier can have both empty name and 0 or empty price but not have 1 filled and other empty
            return (
              (tier.name.trim() === '' && tier.price.trim() === '0') ||
              (tier.name.trim() === '' && tier.price.trim() === '') ||
              (tier.name.trim() !== '' && Number(tier.price.trim()) >= 100)
            );
          }
          // Additional tiers must have both name and price
          return tier.name.trim() !== '' && Number(tier.price.trim()) > 99;
        });
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const [state, formAction] = useActionState(submitEvent, null);

  useEffect(() => {
    if (state?.formError) {
      toast.error(state.formError);
    }

    if (state?.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    }

    if (state?.done) {
      toast.success('Event submitted for review');
      setFormData(initialFormData);
      setCurrentStep(1);
      setIsAddEventOpen(false);
      state.done = false;
    }
  }, [state, setIsAddEventOpen]);

  const [pricingTiers, setPricingTiers] = useState([{ name: '', price: '0' }]);

  const addPricingTier = () => {
    setPricingTiers((prev) => [...prev, { name: '', price: '0' }]);
    updateFormData(
      'pricingTiers',
      JSON.stringify([...pricingTiers, { name: '', price: '0' }]),
    );
  };

  const updatePricingTier = (
    index: number,
    field: 'name' | 'price',
    value: string,
  ) => {
    setPricingTiers((prev) =>
      prev.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier)),
    );
    const updatedTiers = pricingTiers.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier,
    );
    updateFormData('pricingTiers', JSON.stringify(updatedTiers));
  };

  const removePricingTier = (index: number) => {
    if (pricingTiers.length > 1) {
      setPricingTiers((prev) => prev.filter((_, i) => i !== index));
      const updatedTiers = pricingTiers.filter((_, i) => i !== index);
      updateFormData('pricingTiers', JSON.stringify(updatedTiers));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm">
                Event Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm">
                  Event Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateFormData('category', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm">
                  Event Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => updateFormData('type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event"
                maxLength={140}
                className="block w-full"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="date" className="text-sm">
                  Start Date *
                </Label>
                <DatePicker
                  updateFormData={updateFormData}
                  value={formData.startDate}
                  toUpdate="startDate"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <Label htmlFor="startTime" className="text-sm">
                  Start Time *
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  className="text-sm placeholder:text-sm"
                  value={formData.startTime}
                  onChange={(e) => updateFormData('startTime', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="date" className="text-sm">
                  End Date{' '}
                  <span className="text-xs text-zinc-600">(Optional)</span>
                </Label>
                <DatePicker
                  updateFormData={updateFormData}
                  value={formData.endDate}
                  toUpdate="endDate"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <Label htmlFor="endTime" className="text-sm">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  className="text-sm placeholder:text-sm"
                  value={formData.endTime}
                  onChange={(e) => updateFormData('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm">
                Location Type *
              </Label>
              <Select
                value={formData.locationType}
                onValueChange={(value) => updateFormData('locationType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {eventLocationTypes.map((locationType) => (
                    <SelectItem
                      key={locationType.value}
                      value={locationType.value}
                    >
                      {locationType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Enter event location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationLink">Location Link</Label>
              <Input
                id="locationLink"
                placeholder="https://maps.google.com/..."
                value={formData.locationLink}
                onChange={(e) => updateFormData('locationLink', e.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                Optional: Add a link to Google Maps or venue website
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {/* <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => updateFormData('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventPriorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="recurrence">Recurrence</Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value) => updateFormData('recurrence', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventRecurrences.map((recurrence) => (
                    <SelectItem key={recurrence.value} value={recurrence.value}>
                      {recurrence.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Pricing Tiers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Pricing Tiers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPricingTier}
                  className="h-9"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tier
                </Button>
              </div>

              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex flex-col items-end gap-3 rounded-lg border bg-white p-4 md:flex-row"
                >
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`pricing-name-${index}`}
                      className="text-sm"
                    >
                      Pricing Name
                    </Label>
                    <Input
                      id={`pricing-name-${index}`}
                      placeholder="e.g., Standard, VIP, Early Bird"
                      value={tier.name}
                      onChange={(e) =>
                        updatePricingTier(index, 'name', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor={`pricing-price-${index}`}
                      className="text-sm"
                    >
                      Price (in cents)
                    </Label>
                    <Input
                      id={`pricing-price-${index}`}
                      type="number"
                      placeholder="0"
                      value={tier.price}
                      onChange={(e) =>
                        updatePricingTier(index, 'price', e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  {pricingTiers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePricingTier(index)}
                      className="h-10 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <p className="text-muted-foreground text-sm">
                💡 Enter prices in cents (e.g., 1050 for $10.50). Set to 0 for
                free tiers.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketsLink" className="text-sm">
                Tickets Link (optional)
              </Label>
              <Input
                id="ticketsLink"
                placeholder="https://example.com/tickets"
                value={formData.ticketsLink}
                onChange={(e) => updateFormData('ticketsLink', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricingDetails" className="text-sm">
                Additional Payment Details (optional)
              </Label>
              <Textarea
                id="pricingDetails"
                placeholder="Alternative ticket locations, deadlines etc."
                maxLength={140}
                className="block w-full"
                value={formData.pricingDetails}
                onChange={(e) =>
                  updateFormData('pricingDetails', e.target.value)
                }
                rows={2}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Event Details</h4>
                <p className="text-muted-foreground text-sm">
                  {formData.title}
                </p>
                <p className="text-muted-foreground text-sm">
                  {eventTypes.find((t) => t.value === formData.type)?.label}
                </p>
                {formData.description && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {formData.description}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium">Schedule</h4>
                <p className="text-muted-foreground text-sm">
                  {formData.startDate} {formData.startTime} to{' '}
                  {formData.endDate} {formData.endTime}{' '}
                  {!formData.endDate && 'same day'}
                </p>
              </div>

              {formData.location && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-muted-foreground text-sm">
                      {formData.location}
                    </p>
                    {formData.locationLink && (
                      <p className="text-sm text-blue-600 underline">
                        {formData.locationLink}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Separator />

              <div className="flex gap-2">
                <Badge variant="outline">
                  {
                    eventRecurrences.find(
                      (r) => r.value === formData.recurrence,
                    )?.label
                  }
                </Badge>
                {formData.pricingTiers ? (
                  <Badge variant="outline">Paid</Badge>
                ) : (
                  <Badge variant="outline">Free</Badge>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) return <AddEventSignToggler text="Add Event" />;

  if (!organizer || !organizer.profileCompleted) {
    return (
      <Button
        className="bg-teal-400 font-normal text-zinc-900 hover:bg-teal-500"
        onClick={() =>
          window.open('/user/settings/profile-customization/organizer', '_self')
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Event
      </Button>
    );
  }

  return (
    <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="mb-6 flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-2 w-2 items-center justify-center rounded-full border-1 md:h-8 md:w-8 md:border-2 ${
                    isCompleted
                      ? 'bg-primaryColor border-primaryColor text-primary-foreground'
                      : isActive
                        ? 'border-primaryColor text-primaryColor'
                        : 'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  <Icon className="hidden h-4 w-4 md:inline" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-4 md:w-12 ${isCompleted ? 'bg-primaryColor' : 'bg-muted'}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="max-h-[50vh] min-h-[250px] w-full max-w-full overflow-x-hidden overflow-y-auto pr-2 sm:max-h-[60vh]">
          {renderStepContent()}
        </div>

        <DialogFooter className="flex w-full justify-between sm:justify-between">
          <div
            className="text-primaryColor mx-auto mt-4 flex cursor-pointer items-center gap-2 text-sm sm:mx-0 sm:mt-0"
            onClick={() => window.open('https://wa.me/+263717238876', '_blank')}
          >
            <Icons.whatsapp className="h-5 w-fit" />
            <span>Need help?</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              className="w-full flex-1/2 sm:w-auto"
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="w-full flex-1/2 sm:w-auto"
              >
                Next
              </Button>
            ) : (
              <form action={formAction}>
                <input type="hidden" value={organizer.id} name="organizerId" />
                <input type="hidden" value={formData.title} name="title" />
                <input
                  type="hidden"
                  value={formData.description}
                  name="description"
                />
                <input type="hidden" value={formData.type} name="type" />
                <input
                  type="hidden"
                  value={formData.category}
                  name="category"
                />
                <input
                  type="hidden"
                  value={formData.startTime}
                  name="startTime"
                />
                <input
                  type="hidden"
                  value={
                    formData.startDate
                      ? new Date(formData.startDate).toISOString().split('T')[0]
                      : undefined
                  }
                  name="startDate"
                />
                <input
                  type="hidden"
                  value={formData.endTime != '' ? formData.endTime : undefined}
                  name="endTime"
                />
                <input
                  type="hidden"
                  value={
                    formData.endDate != ''
                      ? new Date(formData.endDate).toISOString().split('T')[0]
                      : undefined
                  }
                  name="endDate"
                />
                <input
                  type="hidden"
                  value={formData.location}
                  name="location"
                />
                <input
                  type="hidden"
                  value={formData.locationType}
                  name="locationType"
                />
                <input
                  type="hidden"
                  value={formData.locationLink}
                  name="locationLink"
                />
                <input
                  type="hidden"
                  value={formData.priority}
                  name="priority"
                />
                <input
                  type="hidden"
                  value={formData.recurrence}
                  name="recurrence"
                />
                <input
                  type="hidden"
                  value={formData.pricingTiers}
                  name="pricingTiers"
                />
                <input
                  type="hidden"
                  value={formData.pricingDetails}
                  name="pricingDetails"
                />
                <input
                  type="hidden"
                  value={formData.ticketsLink}
                  name="ticketsLink"
                />
                <SubmitButton>Submit for Approval</SubmitButton>
              </form>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
