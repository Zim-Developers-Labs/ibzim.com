'use client';

import { useActionState, useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Settings,
  CheckCircle,
  Plus,
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

// Demo enum values based on the database schema
const eventTypes = [
  { value: 'awards', label: 'Awards' },
  { value: 'chillout', label: 'Chillout' },
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
  entryPrice: string;
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
  entryPrice: '0',
};

const steps = [
  { id: 1, title: 'Basic Info', icon: CalendarDays },
  { id: 2, title: 'Date & Time', icon: Clock },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Settings', icon: Settings },
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
        return formData.title.trim() !== '' && formData.type !== '';
      case 2:
        return formData.startDate !== '' && formData.startTime !== '';
      case 3:
        return (
          formData.locationType !== '' &&
          formData.location !== '' &&
          formData.locationLink !== ''
        );
      case 4:
        return true; // Settings have defaults
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
  }, [state]);

  const formatPrice = (cents: string) => {
    const amount = Number.parseInt(cents) || 0;
    return (amount / 100).toFixed(2);
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
                Description
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
              <Label htmlFor="location">Location</Label>
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
            <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price (in cents)</Label>
              <Input
                id="entryPrice"
                type="number"
                placeholder="0"
                value={formData.entryPrice}
                onChange={(e) => updateFormData('entryPrice', e.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                Enter price in cents (e.g., 1050 for $10.50)
              </p>
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
                  {formData.endDate} {formData.endTime}
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
                {Number.parseInt(formData.entryPrice) > 0 ? (
                  <Badge variant="outline">
                    ${formatPrice(formData.entryPrice)}
                  </Badge>
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
        className="mt-4 bg-teal-400 font-normal text-zinc-900 hover:bg-teal-500 sm:mt-0"
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
        <Button className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh]sm:max-h-[80vh] w-full overflow-y-auto sm:max-w-[600px]">
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
        <div className="min-h-[250px] w-full max-w-full overflow-x-hidden">
          {renderStepContent()}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} disabled={!isStepValid()}>
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
              <input type="hidden" value={formData.category} name="category" />
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
                value={formData.endTime ? formData.endTime : undefined}
                name="endTime"
              />
              <input
                type="hidden"
                value={
                  formData.endDate
                    ? new Date(formData.endDate).toISOString().split('T')[0]
                    : undefined
                }
                name="endDate"
              />
              <input type="hidden" value={formData.location} name="location" />
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
              <input type="hidden" value={formData.priority} name="priority" />
              <input
                type="hidden"
                value={formData.recurrence}
                name="recurrence"
              />
              <input
                type="hidden"
                value={formData.entryPrice}
                name="entryPrice"
              />
              <SubmitButton>Submit for Approval</SubmitButton>
            </form>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
