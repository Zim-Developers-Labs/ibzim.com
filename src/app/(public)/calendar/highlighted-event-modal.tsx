'use client';

import { Event } from '@/server/db/schema';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Fragment } from 'react';

export default function HighlightedEventModal({
  isOpen,
  onClose,
  event,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  error: string | null;
}) {
  const getCategoryColor = (category: Event['category']) => {
    switch (category) {
      case 'holiday':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'business':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tech':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'community':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'school':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'music':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'casual':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ibzim':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

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
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:max-w-2xl sm:p-6">
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

                {error ? (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Error loading event</p>
                      <p className="mt-1">{error}</p>
                    </div>
                  </div>
                ) : event ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="pr-8 text-2xl font-bold text-gray-900">
                          {event.title}
                        </Dialog.Title>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(event.category)}`}
                        >
                          {event.category.charAt(0).toUpperCase() +
                            event.category.slice(1)}
                        </span>
                        {event.recurrence && (
                          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                            <ArrowPathIcon className="mr-1 h-3 w-3" />
                            Recurring
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-4">
                      {/* Date */}
                      <div className="flex items-start space-x-3">
                        <CalendarIcon className="mt-0.5 h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Date & Time
                          </p>
                          {/* TODO: conditional display of end date and time if avialable */}
                          <p className="text-sm text-gray-600">
                            {formatDate(event.startDate)} {event.startTime!}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      {event.location && (
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Location
                            </p>
                            <p className="text-sm text-gray-600">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {event.description && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">
                            Description
                          </p>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm whitespace-pre-wrap text-gray-700">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Event ID: {event.id}
                        </p>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                            onClick={onClose}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No event data available</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
