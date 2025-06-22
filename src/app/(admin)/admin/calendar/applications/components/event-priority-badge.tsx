import { Badge } from '@/components/ui/badge';
import { EventPriority } from '../types';

interface EventPriorityBadgeProps {
  priority: EventPriority;
}

export function EventPriorityBadge({ priority }: EventPriorityBadgeProps) {
  const priorityConfig = {
    high: {
      label: 'High',
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
    medium: {
      label: 'Medium',
      className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    },
    low: {
      label: 'Low',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
