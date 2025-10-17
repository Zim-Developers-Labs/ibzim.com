import { navigation } from '@/components/footer/constants';
import { Icons } from '@/components/icons';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatUpdatedAt } from '@/lib/utils';
import { NotificationType } from '@/types';
import {
  Archive,
  Ban,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Info,
} from 'lucide-react';
import Link from 'next/link';

const renderIcon = (icon: string) => {
  switch (icon) {
    case 'info':
      return (
        <Avatar className="grid h-8 w-8 place-content-center border border-zinc-200 bg-zinc-100">
          <Info className="size-4 text-zinc-500" />
        </Avatar>
      );
    case 'warning':
      return (
        <Avatar className="grid h-8 w-8 place-content-center border border-yellow-200 bg-yellow-100">
          <CircleAlert className="size-4 text-yellow-500" />
        </Avatar>
      );
    case 'error':
      return (
        <Avatar className="grid h-8 w-8 place-content-center border border-red-200 bg-red-100">
          <Ban className="size-4 text-red-600" />
        </Avatar>
      );
    case 'success':
      return (
        <Avatar className="grid h-8 w-8 place-content-center border border-green-200 bg-green-100">
          <CircleCheck className="size-4 text-green-600" />
        </Avatar>
      );
    case 'award':
      return <Icons.ibzimAwardsIcon className="text-primaryColor h-6 w-auto" />;
    default:
      return (
        <Avatar className="grid h-8 w-8 place-content-center border border-zinc-200 bg-zinc-100">
          <Info className="size-4 text-zinc-500" />
        </Avatar>
      );
  }
};

const renderCTA = (type: string, n: NotificationType) => {
  switch (type) {
    case 'withButtonLink':
      return (
        <Link
          href={n.payloadForType?.[0].buttonLinkUrl || '#'}
          className="bg-primaryColor hover:bg-primaryColor/80 mt-2 rounded-sm px-2 py-1.5 text-sm"
        >
          {n.payloadForType?.[0].buttonLinkText || 'Learn More'}
          <ChevronRight className="ml-1 inline-block size-4" />
        </Link>
      );
    case 'withSocialButtons':
      return (
        <div className="mt-2 flex items-center gap-2">
          <div className="mx-auto flex space-x-4">
            {navigation.social.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-zinc-500 hover:text-zinc-400"
                target="_blank"
                rel="nofollow"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-auto" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export const renderNotification = (
  n: NotificationType,
  markAsRead: (id: string) => void,
) => {
  return (
    <div
      key={n._id}
      className="border-b px-4 py-4 last:border-b-0 hover:bg-zinc-50 md:px-6"
    >
      <div className="mb-4 flex items-center gap-1">
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatUpdatedAt(n._createdAt)}
        </span>
        {n.from === 'neon' && (
          <Button
            variant="link"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-xs text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800"
            onClick={() => markAsRead(n._id)}
          >
            <Archive className="size-3" />
          </Button>
        )}
      </div>
      <div className="flex items-start gap-4">
        {n.icon && <div>{renderIcon(n.icon)}</div>}
        <div className="-mt-1 mb-3 text-sm">{n.description}</div>
      </div>
      <div className="mb-1 flex items-start justify-between">
        {n.type && renderCTA(n.type, n)}
      </div>
    </div>
  );
};
