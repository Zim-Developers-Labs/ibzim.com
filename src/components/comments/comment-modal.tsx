'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import SpotLightBody from './spotlight/body';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export default function CommentModal({
  isOpen,
  onClose,
  comment,
  error,
  article,
  dislikesCount,
  handleReaction,
  isLoading,
  likesCount,
  userReaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  comment: any | null;
  error: string | null;
  article: any;
  handleReaction: any;
  isLoading: boolean;
  userReaction: any;
  likesCount: any;
  dislikesCount: any;
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:max-w-5xl sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex">
                  <div className="w-full flex-1 sm:flex sm:items-start">
                    <div className="mt-3 text-left sm:mt-0 sm:ml-4">
                      <Dialog.Title
                        as="h3"
                        className="mb-8 text-base leading-6 text-gray-900"
                      >
                        {error ? (
                          'Error'
                        ) : (
                          <span className="text-xl">
                            {siteConfig.shortName}{' '}
                            <span className="from-primaryColor via-secondaryColor to-primaryColor bg-gradient-to-tr bg-clip-text text-transparent">
                              Comment Spotlight
                            </span>
                          </span>
                        )}
                      </Dialog.Title>
                      <div className="mt-2">
                        {error ? (
                          <p className="text-sm text-red-500">{error}</p>
                        ) : comment ? (
                          <SpotLightBody
                            comment={comment}
                            article={article}
                            dislikesCount={dislikesCount}
                            handleReaction={handleReaction}
                            isLoading={isLoading}
                            likesCount={likesCount}
                            userReaction={userReaction}
                          />
                        ) : (
                          <p className="text-sm text-gray-500">
                            Loading comment...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="hidden w-[300px] lg:block">
                    <div id="ad-unit">
                      <div className="grid h-[300px] w-full place-content-center">
                        <Link
                          href="https://www.xfinitypros.com"
                          className="relative block h-[250px] w-[250px] rounded-md bg-gray-400"
                        >
                          <Image
                            src="/assets/xfinity-pros-ad.png"
                            alt="Xfinity Pros Ad"
                            height={250}
                            width={250}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </Link>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <InformationCircleIcon className="h-3 w-fit" />
                          <span>Advertisement</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
