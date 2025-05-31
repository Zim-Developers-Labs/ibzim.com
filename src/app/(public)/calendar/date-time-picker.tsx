'use client';

import * as React from 'react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CalendarIcon, Clock } from 'lucide-react';

export default function DateTimePicker() {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    value: string,
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === 'hour') {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0),
        );
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
      } else if (type === 'ampm') {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === 'PM' ? currentHours + 12 : currentHours - 12,
        );
      }
      setDate(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'MM/dd/yyyy hh:mm aa')
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? 'default'
                        : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? 'default' : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() =>
                      handleTimeChange('minute', minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex p-2 sm:flex-col">
                {['AM', 'PM'].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === 'AM' && date.getHours() < 12) ||
                        (ampm === 'PM' && date.getHours() >= 12))
                        ? 'default'
                        : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange('ampm', ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DatePicker({
  updateFormData,
  value,
}: {
  updateFormData?: any;
  value: any;
}) {
  const [date, setDate] = React.useState<Date>(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate!);
            if (updateFormData && selectedDate) {
              updateFormData('date', selectedDate.toISOString());
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function TimePicker({
  updateFormData,
  toUpdate,
}: {
  updateFormData?: any;
  toUpdate: string;
}) {
  const [time, setTime] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    value: string,
  ) => {
    const newTime = time ? new Date(time) : new Date();

    if (type === 'hour') {
      const hour = Number.parseInt(value);
      const currentHours = newTime.getHours();
      const isPM = currentHours >= 12;
      newTime.setHours(
        isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour,
      );
    } else if (type === 'minute') {
      newTime.setMinutes(Number.parseInt(value));
    } else if (type === 'ampm') {
      const currentHours = newTime.getHours();
      if (value === 'PM' && currentHours < 12) {
        newTime.setHours(currentHours + 12);
      } else if (value === 'AM' && currentHours >= 12) {
        newTime.setHours(currentHours - 12);
      }
    }
    setTime(newTime);
    updateFormData(toUpdate, newTime.toISOString());
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !time && 'text-muted-foreground',
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? format(time, 'hh:mm aa') : <span>Select time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex p-2 sm:flex-col">
              {hours.reverse().map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={
                    time &&
                    (time.getHours() % 12 === hour % 12 ||
                      (time.getHours() % 12 === 0 && hour === 12))
                      ? 'default'
                      : 'ghost'
                  }
                  className="aspect-square shrink-0 sm:w-full"
                  onClick={() => handleTimeChange('hour', hour.toString())}
                >
                  {hour}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex p-2 sm:flex-col">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={
                    time && time.getMinutes() === minute ? 'default' : 'ghost'
                  }
                  className="aspect-square shrink-0 sm:w-full"
                  onClick={() => handleTimeChange('minute', minute.toString())}
                >
                  {minute.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
          <ScrollArea className="">
            <div className="flex p-2 sm:flex-col">
              {['AM', 'PM'].map((ampm) => (
                <Button
                  key={ampm}
                  size="icon"
                  variant={
                    time &&
                    ((ampm === 'AM' && time.getHours() < 12) ||
                      (ampm === 'PM' && time.getHours() >= 12))
                      ? 'default'
                      : 'ghost'
                  }
                  className="aspect-square shrink-0 sm:w-full"
                  onClick={() => handleTimeChange('ampm', ampm)}
                >
                  {ampm}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
