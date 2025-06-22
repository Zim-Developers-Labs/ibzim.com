import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Globe } from 'lucide-react';
import { EventStatusBadge } from './event-status-badge';
import { EventPriorityBadge } from './event-priority-badge';
import { EventActions } from './event-actions';
import { Event, OrganizerProfile } from '@/server/db/schema';

interface EventCardProps {
  event: Event;
  organizer: OrganizerProfile | null;
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  onView: (eventId: string) => void;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export function EventCard({
  event,
  organizer,
  onApprove,
  onReject,
  onView,
  onEdit,
  onDelete,
}: EventCardProps) {
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
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg leading-tight font-semibold">
              {event.title}
            </h3>
            <div className="flex items-center gap-2">
              <EventStatusBadge event={event} />
              <EventPriorityBadge priority={event.priority} />
              <Badge variant="outline" className="capitalize">
                {event.category}
              </Badge>
            </div>
          </div>
          <EventActions
            event={event}
            onApprove={onApprove}
            onReject={onReject}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.startDate)}</span>
          {event.startTime && (
            <>
              <Clock className="ml-2 h-4 w-4" />
              <span>{formatTime(event.startTime)}</span>
            </>
          )}
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          {event.locationType === 'virtual' ? (
            <Globe className="h-4 w-4" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="truncate">
            {event.locationType === 'virtual'
              ? 'Virtual Event'
              : event.location || 'TBD'}
          </span>
        </div>

        {organizer && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="truncate">
              {organizer.name || organizer.email}
            </span>
          </div>
        )}

        {event.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {event.description}
          </p>
        )}

        {event.pricingTiers && (
          <div className="text-sm">
            <span className="font-medium">Pricing: </span>
            <span className="text-muted-foreground">{event.pricingTiers}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
