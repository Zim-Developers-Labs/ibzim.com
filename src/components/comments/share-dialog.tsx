'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Dialog, DialogPanel } from '@headlessui/react';
import { ChevronRightIcon, LinkIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { Icons } from '../icons';
import { siteConfig } from '@/lib/config';

type CommentShareDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  commentId: string;
};

export default function CommentShareDialog({
  isOpen,
  onClose,
  commentId,
}: CommentShareDialogProps) {
  const pathname = usePathname();
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(
        `${window.location.origin}${pathname}?highlight_comment_id=${commentId}`,
      );
    }
  }, [pathname, commentId]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Comment link copied to clipboard!');
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
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/70">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="w-full max-w-[300px] overflow-hidden rounded-xl bg-white backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <div className="divide-y divide-gray-200 text-sm">
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
                  comment_id?share-link
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
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
