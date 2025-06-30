'use client';

import { useActionState, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { FlagIcon } from '@heroicons/react/24/solid';
import { reportComment } from './action';
import { toast } from 'sonner';
import { SubmitButton } from '../ui/submit-button';

type CommentShareDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  commentId: string;
  userId: string;
};

export default function ReportCommentDialog({
  isOpen,
  onClose,
  commentId,
  userId,
}: CommentShareDialogProps) {
  const reportReasons = [
    'Off-topic or Irrelevant',
    'Harassment or Bullying',
    'Hate Speech or Discrimination',
    'False information',
    'Personal Information',
    'Selling or promoting restricted items',
    'Self-harm or Suicide',
    'Explicit or Inappropriate Content',
    'Copyright Violation',
    'Impersonation',
    'Trolling or Intentional Provocation',
    'Scam, fraud or spam',
    'Illegal Activities',
    'Threats or Incitement to Violence',
    'I just dont like it',
  ];

  const [selected, setSelected] = useState(reportReasons[1]);
  const [state, formAction] = useActionState(reportComment, null);

  if (state?.success) {
    toast.success('A reviewer has been assign to your case');
    onClose();
    state.success = false;
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/70 px-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="w-full max-w-[400px] rounded-xl bg-white backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <DialogTitle className="mb-2 flex items-center justify-center gap-2 border-b border-gray-200 py-8 text-lg">
              <FlagIcon className="h-4 w-fit" />
              Report
            </DialogTitle>
            <div className="mb-6 border-b border-gray-200 px-4 pb-2 text-center text-sm font-semibold">
              Why are you reporting this comment?
            </div>
            <form className="mb-8 px-4" action={formAction}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="reason" value={selected} />
              <input type="hidden" name="commentId" value={commentId} />
              <Listbox value={selected} onChange={setSelected}>
                <Label className="mb-2 block text-xs text-gray-500">
                  Select from these options
                </Label>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pr-10 pl-3 text-left text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-yellow-600 focus:outline-none sm:text-sm/6">
                    <span className="block truncate">{selected}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-400"
                      />
                    </span>
                  </ListboxButton>

                  <ListboxOptions
                    transition
                    className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[leave]:opacity-0 sm:text-sm"
                  >
                    {reportReasons.map((reason, i) => (
                      <ListboxOption
                        key={i}
                        value={reason}
                        className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-[focus]:bg-yellow-600 data-[focus]:text-white"
                      >
                        <span className="block truncate font-normal group-data-[selected]:font-semibold">
                          {reason}
                        </span>

                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-yellow-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                          <CheckIcon aria-hidden="true" className="h-5 w-5" />
                        </span>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
              <SubmitButton
                type="submit"
                className="bg-primaryColor mt-4 w-full rounded-md py-2 text-center text-sm"
              >
                Submit Report
              </SubmitButton>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
