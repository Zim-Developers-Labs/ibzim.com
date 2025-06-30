'use client';

import { Calendar } from '@/components/ui/calendar';
import { useState, useMemo } from 'react';
import { EventsStats } from './components/events-stats';
import { EventFilters } from './components/event-filters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EventStatusBadge } from './components/event-status-badge';
import { EventPriorityBadge } from './components/event-priority-badge';
import { CalendarIcon, Clock, Globe, MapPin, User } from 'lucide-react';
import { EventActions } from './components/event-actions';
import { Event, OrganizerProfile } from '@/server/db/schema';
import { updateApplicationStatus } from './actions';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

export default function CalendarApplicationsWrapper({
  allEvents,
  allOrganizers,
}: {
  allEvents: Event[];
  allOrganizers: OrganizerProfile[];
}) {
  const [events, setEvents] = useState<Event[]>(allEvents);
  const [organizers] = useState<OrganizerProfile[]>(allOrganizers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Helper function to get organizer by ID
  const getOrganizerById = (
    organizerId: string | null,
  ): OrganizerProfile | null => {
    if (!organizerId) return null;
    return organizers.find((org) => org.id === organizerId) || null;
  };

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const organizer = getOrganizerById(event.eventOrganizerId);

      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const getEventStatus = (event: Event) => {
        if (event.approved) return 'approved';
        if (event.approvalExpiry && new Date() > event.approvalExpiry)
          return 'expired';
        return 'pending';
      };

      const matchesStatus =
        statusFilter === 'all' || getEventStatus(event) === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || event.category === categoryFilter;
      const matchesPriority =
        priorityFilter === 'all' || event.priority === priorityFilter;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesPriority
      );
    });

    // Sort events
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'startDate':
          aValue = a.startDate;
          bValue = b.startDate;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'organizer':
          const organizerA = getOrganizerById(a.eventOrganizerId);
          const organizerB = getOrganizerById(b.eventOrganizerId);
          aValue = (organizerA?.name || organizerA?.email || '').toLowerCase();
          bValue = (organizerB?.name || organizerB?.email || '').toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    events,
    organizers,
    searchTerm,
    statusFilter,
    categoryFilter,
    priorityFilter,
    sortBy,
    sortOrder,
  ]);

  const handleApprove = async (eventId: string) => {
    const result: any = await updateApplicationStatus(eventId, 'approved');
    if (result.success) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, approved: true, approvalExpiry: null }
            : event,
        ),
      );
      toast.success('Event approved successfully');
    }

    if (result.error) {
      toast.error(`Failed to approve event: ${result.error}`);
    }
  };

  const handleReject = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              approved: false,
              approvalExpiry: new Date(Date.now() - 1000),
            }
          : event,
      ),
    );
  };

  const handleView = (eventId: string) => {
    console.log('View event:', eventId);
    // Implement view logic
  };

  const handleEdit = (eventId: string) => {
    console.log('Edit event:', eventId);
    // Implement edit logic
  };

  const handleDelete = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Applications</h1>
          <p className="text-muted-foreground">
            Manage and review event applications for your calendar
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <EventsStats events={events} />

      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onClearFilters={clearFilters}
      />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing {filteredAndSortedEvents.length} of {events.length} events
        </p>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="startDate">Event Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="organizer">Organizer</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEvents.map((event) => {
              const organizer = getOrganizerById(event.eventOrganizerId);

              return (
                <TableRow key={event.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-muted-foreground line-clamp-2 max-w-[280px] text-sm">
                          {event.description}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        {event.pricingTiers &&
                          JSON.parse(event.pricingTiers).map(
                            (
                              tier: { name: string; price: string },
                              index: number,
                            ) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tier.name} - ${formatPrice(tier.price)}
                              </Badge>
                            ),
                          )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <EventStatusBadge event={event} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <EventPriorityBadge priority={event.priority} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(event.startDate)}
                      </div>
                      {event.startTime && (
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {formatTime(event.startTime)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      {event.locationType === 'virtual' ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      <span className="max-w-[120px] truncate">
                        {event.locationType === 'virtual'
                          ? 'Virtual'
                          : event.location || 'TBD'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      <span className="max-w-[120px] truncate">
                        {organizer
                          ? organizer.name || organizer.email
                          : 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <EventActions
                      event={event}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedEvents.length === 0 && (
        <div className="py-12 text-center">
          <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No events found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}
