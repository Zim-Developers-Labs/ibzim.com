import { Badge } from '@/components/ui/badge';
import { Event } from '@/server/db/schema';

interface EventStatusBadgeProps {
  event: Event;
}

export function EventStatusBadge({ event }: EventStatusBadgeProps) {
  const getStatus = () => {
    if (event.approved) return 'approved';
    if (event.approvalExpiry && new Date() > event.approvalExpiry)
      return 'expired';
    return 'pending';
  };

  const status = getStatus();

  const statusConfig = {
    approved: {
      label: 'Approved',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    pending: {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    expired: {
      label: 'Expired',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
