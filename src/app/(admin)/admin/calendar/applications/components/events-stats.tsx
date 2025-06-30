import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/server/db/schema';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface EventsStatsProps {
  events: Event[];
}

export function EventsStats({ events }: EventsStatsProps) {
  const totalEvents = events.length;
  const approvedEvents = events.filter((e) => e.approved).length;
  const pendingEvents = events.filter(
    (e) => !e.approved && (!e.approvalExpiry || new Date() <= e.approvalExpiry),
  ).length;
  const expiredEvents = events.filter(
    (e) => !e.approved && e.approvalExpiry && new Date() > e.approvalExpiry,
  ).length;

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      description: 'All event applications',
    },
    {
      title: 'Approved',
      value: approvedEvents,
      icon: CheckCircle,
      description: 'Events approved for publication',
      className: 'text-green-600',
    },
    {
      title: 'Pending Review',
      value: pendingEvents,
      icon: Clock,
      description: 'Awaiting approval decision',
      className: 'text-yellow-600',
    },
    {
      title: 'Expired',
      value: expiredEvents,
      icon: AlertCircle,
      description: 'Applications past deadline',
      className: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 ${stat.className || 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.className || ''}`}>
              {stat.value}
            </div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
