'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Event } from '@/server/db/schema';
import { MoreHorizontal, Check, X, Eye, Edit, Trash2 } from 'lucide-react';

interface EventActionsProps {
  event: Event;
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  onView: (eventId: string) => void;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export function EventActions({
  event,
  onApprove,
  onReject,
  onView,
  onEdit,
  onDelete,
}: EventActionsProps) {
  const isPending =
    !event.approved &&
    (!event.approvalExpiry || new Date() <= event.approvalExpiry);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(event.id)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        {isPending && (
          <>
            <DropdownMenuItem
              onClick={() => onApprove(event.id)}
              className="text-green-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onReject(event.id)}
              className="text-red-600"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={() => onEdit(event.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(event.id)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
