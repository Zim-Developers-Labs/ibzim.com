'use client';

import { useCallback } from 'react';
import { ChevronRightIcon, LinkIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { deploymentDomain, siteConfig } from '@/lib/config';
import { Icons } from '@/components/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

type EventSharePopoverProps = {
  eventId: string;
};

export default function EventSharePopover({ eventId }: EventSharePopoverProps) {
  const shareUrl = `https://${deploymentDomain}/tools/events-calendar?highlight_event_id=${eventId}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Event link copied to clipboard!');
    });
  }, [shareUrl]);

  const openShareWindow = useCallback((url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }, []);

  const shareButtons = [
    {
      name: 'Whatsapp',
      icon: Icons.whatsapp,
      onClick: () =>
        openShareWindow(`https://api.whatsapp.com/send?text=*${shareUrl}`),
    },
    {
      name: 'Facebook',
      icon: Icons.facebookF,
      onClick: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        ),
    },
    {
      name: 'Instagram',
      icon: Icons.instagram,
      onClick: () =>
        openShareWindow(`https://www.instagram.com/share?url=${shareUrl}`),
    },
    {
      name: 'Email',
      icon: EnvelopeIcon,
      onClick: () =>
        openShareWindow(
          `mailto:?subject="${siteConfig.shortName} Conversation"&body=${shareUrl}`,
        ),
    },
    {
      name: 'Twitter',
      icon: Icons.twitter,
      onClick: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?text="${siteConfig.shortName} Conversation"&url=${shareUrl}`,
        ),
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full flex-1">Share Event</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full px-6 py-0">
        <div className="w-full divide-y divide-gray-200 text-sm">
          {shareButtons.map((button) => (
            <button
              key={button.name}
              onClick={button.onClick}
              className="flex w-full items-center justify-between px-4 py-4 hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <button.icon className="h-fit w-5" />
                <div>{button.name}</div>
              </div>
              <div className="text-primaryColor text-xs">
                <ChevronRightIcon className="h-fit w-5" />
              </div>
            </button>
          ))}
          <div className="flex w-full items-center gap-4 px-4 py-4">
            <div className="rounded-md bg-gray-100 px-2 py-2">
              event_id?share-link
            </div>
            <button
              onClick={handleCopy}
              className="bg-primaryColor/60 hover:bg-primaryColor/90 flex items-center gap-2 rounded-md p-2"
            >
              <div>Copy</div>
              <LinkIcon className="h-4 w-fit" />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
