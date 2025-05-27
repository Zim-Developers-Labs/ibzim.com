'use client';

import { Suspense, useState } from 'react';
import { CalendarEvent, daysOfWeek, months, sampleEvents } from './constants';
import {
  AlertCircle,
  BriefcaseBusiness,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code,
  Flag,
  GraduationCap,
  Heart,
  MapPin,
  Music,
  PersonStanding,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DatePicker from './date-picker';
import { Icons } from '@/components/icons';
import EventSharePopover from './event-share-dialog';
import HighlightedEventHandler from './highlighted-event-handler';

export default function CalendarWrapper() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{
    date: number;
    month: number;
    year: number;
  } | null>(null);
  const [isDaySheetOpen, setIsDaySheetOpen] = useState(false);
  const [upcomingFilter, setUpcomingFilter] = useState<
    'week' | 'month' | '3months'
  >('3months');

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(
      new Date(currentYear, currentMonth + (direction === 'next' ? 1 : -1), 1),
    );
  };

  const getEventsForDate = (date: number) => {
    return sampleEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'holiday':
        return <Flag className="hidden h-3 w-3 sm:inline" />;
      case 'business':
        return <BriefcaseBusiness className="hidden h-3 w-3 sm:inline" />;
      case 'tech':
        return <Code className="hidden h-3 w-3 sm:inline" />;
      case 'community':
        return <Heart className="hidden h-3 w-3 sm:inline" />;
      case 'school':
        return <GraduationCap className="hidden h-3 w-3 sm:inline" />;
      case 'music':
        return <Music className="hidden h-3 w-3 sm:inline" />;
      case 'personal':
        return <PersonStanding className="hidden h-3 w-3 sm:inline" />;
      case 'ibzim':
        return <Icons.logoSm className="hidden h-3 w-3 sm:inline" />;
      default:
        return <Calendar className="hidden h-3 w-3 sm:inline" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'holiday':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'business':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tech':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'community':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'school':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'music':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'personal':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'ibzim':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventColorForMini = (type: string) => {
    switch (type) {
      case 'holiday':
        return 'bg-red-800 text-red-800 border-red-200';
      case 'business':
        return 'bg-green-800 text-green-800 border-green-200';
      case 'tech':
        return 'bg-purple-800 text-purple-800 border-purple-200';
      case 'community':
        return 'bg-blue-800 text-blue-800 border-blue-200';
      case 'school':
        return 'bg-teal-800 text-teal-800 border-teal-200';
      case 'music':
        return 'bg-pink-800 text-pink-800 border-pink-200';
      case 'personal':
        return 'bg-slate-800 text-slate-800 border-slate-200';
      case 'ibzim':
        return 'bg-yellow-800 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-800 text-gray-800 border-gray-200';
    }
  };

  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventSheetOpen(true);
    // Don't close day sheet - allow both to be open
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getEventsForDateObj = (date: Date) => {
    return sampleEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getEventsForDateSorted = (date: number) => {
    const events = getEventsForDate(date);
    return events.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const handleDayClick = (date: number) => {
    setSelectedDay({ date, month: currentMonth, year: currentYear });
    setIsDaySheetOpen(true);
  };

  const getSelectedDayEvents = () => {
    if (!selectedDay) return [];
    return sampleEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDay.date &&
          eventDate.getMonth() === selectedDay.month &&
          eventDate.getFullYear() === selectedDay.year
        );
      })
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    const endDate = new Date();

    switch (upcomingFilter) {
      case 'week':
        endDate.setDate(now.getDate() + 7);
        break;
      case 'month':
        endDate.setMonth(now.getMonth() + 1);
        break;
      case '3months':
        endDate.setMonth(now.getMonth() + 3);
        break;
    }

    return sampleEvents
      .filter((event) => event.date >= now && event.date <= endDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 10); // Limit to 10 events
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-12 border border-gray-200 sm:h-18 md:h-24"
        ></div>,
      );
    }

    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const events = getEventsForDateSorted(date);
      const today = isToday(date);

      days.push(
        <div
          key={date}
          className={`h-12 cursor-pointer border border-gray-200 p-1 sm:h-18 md:h-24 ${today ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}
          onClick={() => handleDayClick(date)}
        >
          <div
            className={`mb-1 text-sm font-medium ${today ? 'text-blue-600' : 'text-gray-900'}`}
          >
            {date}
          </div>
          <div className="space-y-1 overflow-hidden">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="hidden items-center gap-1 sm:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
              >
                {getEventIcon(event.type)}
                <span
                  className={`truncate rounded border px-1 py-0.5 text-xs ${getEventColor(event.type)}`}
                >
                  {event.title}
                </span>
              </div>
            ))}
            {events.length > 2 && (
              <div className="text-xs text-gray-500 hover:text-gray-700">
                +{events.length - 2} more
              </div>
            )}
            {events.length > 0 && (
              <div className="flex items-center gap-2 text-xs sm:hidden">
                {events.map((event, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${getEventColorForMini(event.type)}`}
                  ></span>
                ))}
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <div>
            <h1 className="mb-2 text-3xl text-gray-900 md:text-4xl">
              IBZIM Calendar
            </h1>
            <p className="text-gray-600">
              Stay updated with holidays, tech events, and business
              opportunities in Zimbabwe
            </p>
          </div>

          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[100vh] overflow-y-auto sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit Event for Review</DialogTitle>
                <DialogDescription>
                  Submit your event details for consideration to be added to the
                  IBZIM calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input id="event-title" placeholder="Enter event title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Date</Label>
                  <DatePicker />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Tech Event</SelectItem>
                      <SelectItem value="business">Business Event</SelectItem>
                      <SelectItem value="community">Community Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input id="event-location" placeholder="City or venue" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    placeholder="Brief description of the event"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddEventOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsAddEventOpen(false)}>
                  Submit for Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Full Disclosure</AlertTitle>
          <AlertDescription>
            This feature is still being developed and all the dates are for
            demonstration.
          </AlertDescription>
        </Alert>

        {/* Calendar Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="min-w-[200px] text-center text-2xl">
                  {viewMode === 'month'
                    ? `${months[currentMonth]} ${currentYear}`
                    : `Week of ${getWeekDates()[0].toLocaleDateString()}`}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('month')}
                    className="rounded-r-none"
                  >
                    Month
                  </Button>
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                    className="rounded-l-none"
                  >
                    Week
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'month' ? (
              <>
                {/* Days of week header */}
                <div className="mb-2 grid grid-cols-7 gap-0 rounded-md bg-gray-100">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm text-gray-700 sm:text-base md:font-medium"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0 border border-gray-200">
                  {renderCalendarDays()}
                </div>
              </>
            ) : (
              <>
                {/* Week view */}
                <div className="mb-2 grid grid-cols-7 gap-0">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="bg-gray-100 p-2 text-center font-medium text-gray-700"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0 border border-gray-200">
                  {getWeekDates().map((date, index) => {
                    const events = getEventsForDateObj(date);
                    const today =
                      date.toDateString() === new Date().toDateString();

                    return (
                      <div
                        key={index}
                        className={`h-12 border border-gray-200 p-2 sm:h-18 md:h-32 ${today ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}
                      >
                        <div
                          className={`mb-2 text-sm font-medium ${today ? 'text-blue-600' : 'text-gray-900'}`}
                        >
                          {date.getDate()}
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className={`hidden cursor-pointer rounded border px-2 py-1 text-xs hover:opacity-80 sm:block ${getEventColor(event.type)}`}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-center gap-1">
                                {getEventIcon(event.type)}
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {events.length > 0 && (
                          <div className="flex items-center gap-2 text-xs sm:hidden">
                            {events.map((event, i) => (
                              <span
                                key={i}
                                className={`h-2 w-2 rounded-full ${getEventColorForMini(event.type)}`}
                              ></span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-red-200 bg-red-100 text-red-800"
                >
                  National Holiday
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-purple-200 bg-purple-100 text-purple-800"
                >
                  Tech Event
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-100 text-green-800"
                >
                  Business Event
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-100 text-blue-800"
                >
                  Community Event
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-teal-200 bg-teal-100 text-teal-800"
                >
                  School Event
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-pink-200 bg-pink-100 text-pink-800"
                >
                  Music Event
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <PersonStanding className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-slate-200 bg-slate-100 text-slate-800"
                >
                  Personal Event
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Icons.logoSm className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-yellow-200 bg-yellow-100 text-yellow-800"
                >
                  IBZim Event
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle>Upcoming Events</CardTitle>
              <Select
                value={upcomingFilter}
                onValueChange={(value: 'week' | 'month' | '3months') =>
                  setUpcomingFilter(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Next Week</SelectItem>
                  <SelectItem value="month">Next Month</SelectItem>
                  <SelectItem value="3months">Next 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {getUpcomingEvents().map((event) => (
                <div
                  key={event.id}
                  className="flex cursor-pointer flex-col items-start gap-3 rounded-lg border p-3 hover:bg-gray-50"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.type)}
                    <Badge
                      variant="outline"
                      className={getEventColor(event.type)}
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-4 font-medium">{event.title}</h3>
                    <p className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {event.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {event.location && (
                      <p className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {getUpcomingEvents().length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p>No upcoming events in the selected timeframe.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Day Details Sheet - Opens from LEFT */}
        <Sheet open={isDaySheetOpen} onOpenChange={setIsDaySheetOpen}>
          <SheetContent
            side="left"
            className="w-full max-w-[400px] sm:w-[540px]"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedDay &&
                  `${months[selectedDay.month]} ${selectedDay.date}, ${selectedDay.year}`}
              </SheetTitle>
              <SheetDescription>
                Events and activities for this day
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {selectedDay &&
                (() => {
                  const dayEvents = getSelectedDayEvents();

                  if (dayEvents.length === 0) {
                    return (
                      <div className="py-8 text-center">
                        <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                          No events planned
                        </h3>
                        <p className="mb-4 text-gray-600">
                          Nothing major is scheduled for this day.
                        </p>
                        <Button
                          onClick={() => {
                            setIsDaySheetOpen(false);
                            setIsAddEventOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Event for This Day
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="space-y-3 px-6 md:px-8">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-gray-50"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsEventSheetOpen(true);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                {getEventIcon(event.type)}
                                <Badge
                                  variant="outline"
                                  className={getEventColor(event.type)}
                                >
                                  {event.type}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    event.priority === 'high'
                                      ? 'border-red-200 bg-red-50 text-red-700'
                                      : event.priority === 'medium'
                                        ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                        : 'border-gray-200 bg-gray-50 text-gray-700'
                                  }
                                >
                                  {event.priority} priority
                                </Badge>
                              </div>
                            </div>
                            <h3 className="mt-2 font-medium">{event.title}</h3>
                            {event.location && (
                              <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </p>
                            )}
                            {event.description && (
                              <p className="mt-1 text-sm text-gray-600">
                                {event.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="border-t px-6 pt-4 md:px-8">
                        <Button
                          className="w-full"
                          onClick={() => {
                            setIsDaySheetOpen(false);
                            setIsAddEventOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Event for This Day
                        </Button>
                      </div>
                    </>
                  );
                })()}
            </div>
          </SheetContent>
        </Sheet>

        {/* Event Details Sheet - Opens from RIGHT */}
        <Sheet open={isEventSheetOpen} onOpenChange={setIsEventSheetOpen}>
          <SheetContent
            side="right"
            className="w-full max-w-[400px] sm:w-[540px]"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {selectedEvent && getEventIcon(selectedEvent.type)}
                {selectedEvent?.title}
              </SheetTitle>
              <SheetDescription>
                {selectedEvent && (
                  <span className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={getEventColor(selectedEvent.type)}
                    >
                      {selectedEvent.type.charAt(0).toUpperCase() +
                        selectedEvent.type.slice(1)}{' '}
                      Event
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        selectedEvent.priority === 'high'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : selectedEvent.priority === 'medium'
                            ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700'
                      }
                    >
                      {selectedEvent.priority.charAt(0).toUpperCase() +
                        selectedEvent.priority.slice(1)}{' '}
                      Priority
                    </Badge>
                  </span>
                )}
              </SheetDescription>
            </SheetHeader>

            {selectedEvent && (
              <div className="mt-6 space-y-6 px-6 md:px-8">
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Date & Time
                  </h3>
                  <p className="text-gray-600">
                    {selectedEvent.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {selectedEvent.location && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">Location</h3>
                    <p className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {selectedEvent.location}
                    </p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">
                      Description
                    </h3>
                    <p className="leading-relaxed text-gray-600">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Event Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getEventIcon(selectedEvent.type)}
                      <span className="capitalize">
                        {selectedEvent.type} Event
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          selectedEvent.priority === 'high'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : selectedEvent.priority === 'medium'
                              ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                        }
                      >
                        {selectedEvent.priority.charAt(0).toUpperCase() +
                          selectedEvent.priority.slice(1)}{' '}
                        Priority
                      </Badge>
                      {selectedEvent.isRecurring && (
                        <Badge variant="outline" className="text-xs">
                          Recurring Event
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <EventSharePopover eventId={selectedEvent.id} />
                  {isDaySheetOpen && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsEventSheetOpen(false)}
                    >
                      Back to Day View
                    </Button>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
      <Suspense fallback={<div>Loading comments...</div>}>
        <HighlightedEventHandler />
      </Suspense>
    </div>
  );
}
