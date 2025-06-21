'use client';

import { Suspense, useCallback, useState } from 'react';
import { daysOfWeek, months, holidayEvents } from './constants';
import {
  AlertCircle,
  BriefcaseBusiness,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Church,
  Code,
  Flag,
  GraduationCap,
  Heart,
  MapPin,
  Medal,
  Music,
  PersonStanding,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Icons } from '@/components/icons';
import EventSharePopover from './event-share-dialog';
import HighlightedEventHandler from './highlighted-event-handler';
import AddEventDialog from './add-event-dialog';
import { Event, OrganizerProfile } from '@/server/db/schema';
import { User } from 'lucia';

export default function CalendarWrapper({
  organizer,
  dbEvents,
  user,
}: {
  organizer: OrganizerProfile | null;
  dbEvents: Event[];
  user: User | null;
}) {
  const events = [...holidayEvents, ...dbEvents];
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const handleSetIsAddEventOpen = useCallback((value: any) => {
    setIsAddEventOpen(value);
  }, []);

  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{
    date: number;
    month: number;
    year: number;
  } | null>(null);
  const [isDaySheetOpen, setIsDaySheetOpen] = useState(false);
  const [upcomingFilter, setUpcomingFilter] = useState<
    'week' | 'month' | '3months' | 'thisYear'
  >('3months');
  const [upcomingEventCategoryFilter, setUpcomingEventCategoryFilter] =
    useState<string>('all');
  const [upcomingEventTypeFilter, setUpcomingEventTypeFilter] =
    useState<string>('all');

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
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'holiday':
        return <Flag className="hidden h-3 w-3 sm:inline" />;
      case 'business':
        return <BriefcaseBusiness className="hidden h-3 w-3 sm:inline" />;
      case 'tech':
        return <Code className="hidden h-3 w-3 sm:inline" />;
      case 'community':
        return <Heart className="hidden h-3 w-3 sm:inline" />;
      case 'sports':
        return <Medal className="hidden h-3 w-3 sm:inline" />;
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

  const getEventColor = (category: string) => {
    switch (category) {
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

  const getEventColorForMini = (category: string) => {
    switch (category) {
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

  const handleEventClick = (event: Event) => {
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
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
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
    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
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
      case 'thisYear':
        endDate.setMonth(now.getMonth() + 12 - now.getMonth());
        break;
    }

    return events
      .filter((event) => {
        const dateMatch = event.startDate >= now && event.startDate <= endDate;
        const categoryMatch =
          upcomingEventCategoryFilter === 'all' ||
          event.category === upcomingEventCategoryFilter;
        return dateMatch && categoryMatch;
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
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
                {getEventIcon(event.category)}
                <span
                  className={`truncate rounded border px-1 py-0.5 text-xs ${getEventColor(event.category)}`}
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
                    className={`h-2 w-2 rounded-full ${getEventColorForMini(event.category)}`}
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
              Stay updated with tech, music, religious, school and business
              events in Zimbabwe.
            </p>
          </div>

          <div className="mt-6 mb-4 flex items-center gap-2 sm:mt-0">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() =>
                window.open('https://wa.me/+263717238876', '_blank')
              }
            >
              <Icons.whatsapp className="mr-1 h-5 w-5" />
              Contact Us
            </Button>
            <AddEventDialog
              organizer={organizer}
              user={user}
              isAddEventOpen={isAddEventOpen}
              setIsAddEventOpen={handleSetIsAddEventOpen}
            />
          </div>
        </div>

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
                              className={`hidden cursor-pointer rounded border px-2 py-1 text-xs hover:opacity-80 sm:block ${getEventColor(event.category)}`}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-center gap-1">
                                {getEventIcon(event.category)}
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
                                className={`h-2 w-2 rounded-full ${getEventColorForMini(event.category)}`}
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

        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Full Disclosure</AlertTitle>
          <AlertDescription>
            Events might be cancelled or rescheduled. Be sure to check the
            calendar or contact organizers a day or 2 before the event.
          </AlertDescription>
        </Alert>

        {/* Legend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Event Categories</CardTitle>
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
                <Medal className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-100 text-blue-800"
                >
                  Sports Event
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
                <Church className="h-4 w-4" />
                <Badge
                  variant="outline"
                  className="border-slate-200 bg-slate-100 text-slate-800"
                >
                  Religious Event
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
              <div className="flex w-full flex-col gap-2 md:w-fit md:flex-row md:items-center">
                <Select
                  value={upcomingEventTypeFilter}
                  onValueChange={(value: string) =>
                    setUpcomingEventTypeFilter(value)
                  }
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Event Types</SelectItem>
                    <SelectItem value="awards">Awards</SelectItem>
                    <SelectItem value="chillout">Chillout</SelectItem>
                    <SelectItem value="concert">Concert</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="festival">Festival Event</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="show">Show</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={upcomingEventCategoryFilter}
                  onValueChange={(value: string) =>
                    setUpcomingEventCategoryFilter(value)
                  }
                >
                  <SelectTrigger className="w-full md:w-[190px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Event Categories</SelectItem>
                    <SelectItem value="public">Public Holiday</SelectItem>
                    <SelectItem value="holiday">Holiday Event</SelectItem>
                    <SelectItem value="tech">Tech Event</SelectItem>
                    <SelectItem value="business">Business Event</SelectItem>
                    <SelectItem value="community">Community Event</SelectItem>
                    <SelectItem value="sports">Sports Event</SelectItem>
                    <SelectItem value="school">School Event</SelectItem>
                    <SelectItem value="music">Music Event</SelectItem>
                    <SelectItem value="religious">Religious Event</SelectItem>
                    <SelectItem value="ibzim">IBZim Event</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={upcomingFilter}
                  onValueChange={(
                    value: 'week' | 'month' | '3months' | 'thisYear',
                  ) => setUpcomingFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Next Week</SelectItem>
                    <SelectItem value="month">Next Month</SelectItem>
                    <SelectItem value="3months">Next 3 Months</SelectItem>
                    <SelectItem value="thisYear">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {getUpcomingEvents().map((event) => (
                <div
                  key={event.id}
                  className="flex cursor-pointer flex-col items-start gap-3 rounded-lg border p-3 hover:bg-gray-50"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.category)}
                    <Badge
                      variant="outline"
                      className={getEventColor(event.category)}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-4 font-medium">{event.title}</h3>
                    <p className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {event.startDate.toLocaleDateString('en-US', {
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
            </div>
            {getUpcomingEvents().length === 0 && (
              <div className="grid place-content-center">
                <div className="w-fit py-8 text-center text-gray-500">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p>No upcoming events in the selected timeframe.</p>
                </div>
              </div>
            )}
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
                        {organizer
                          ? organizer.profileCompleted && (
                              <Button
                                onClick={() => {
                                  setIsDaySheetOpen(false);
                                  setIsAddEventOpen(true);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Event for This Day
                              </Button>
                            )
                          : null}
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
                                {getEventIcon(event.category)}
                                <Badge
                                  variant="outline"
                                  className={getEventColor(event.category)}
                                >
                                  {event.category == 'public'
                                    ? 'Public Holiday'
                                    : event.category}
                                </Badge>
                                {event.category !== 'public' &&
                                  (event.pricingTiers ? (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Paid
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Free
                                    </Badge>
                                  ))}
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
                {selectedEvent && getEventIcon(selectedEvent.category)}
                {selectedEvent?.title}
              </SheetTitle>
              <SheetDescription>
                {selectedEvent && (
                  <span className="mt-2 flex flex-wrap gap-2">
                    {selectedEvent.category === 'public' ? (
                      <Badge
                        variant="outline"
                        className={getEventColor(selectedEvent.category)}
                      >
                        Public Holiday
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className={getEventColor(selectedEvent.category)}
                      >
                        {selectedEvent.category.charAt(0).toUpperCase() +
                          selectedEvent.category.slice(1)}{' '}
                        Event
                      </Badge>
                    )}
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
                    {selectedEvent.startDate.toLocaleDateString('en-US', {
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

                {selectedEvent.category !== 'public' && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">
                      Event Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getEventIcon(selectedEvent.category)}
                        <span className="capitalize">
                          {selectedEvent.category} Event
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedEvent.pricingTiers ? (
                          <Badge variant="outline" className="text-xs">
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Free
                          </Badge>
                        )}
                        {selectedEvent.recurrence && (
                          <Badge variant="outline" className="text-xs">
                            Recurring Event
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 border-t pt-4">
                  {selectedEvent.category !== 'public' && (
                    <EventSharePopover eventId={selectedEvent.id} />
                  )}
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
