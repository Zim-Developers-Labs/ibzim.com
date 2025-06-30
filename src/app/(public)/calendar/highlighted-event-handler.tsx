'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEventById } from './actions';
import HighlightedEventModal from './highlighted-event-modal';

export default function HighlightedEventHandler() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams: any = useSearchParams();
  const highlightedEventId = searchParams.get('highlight_event_id');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent]: any = useState();

  useEffect(() => {
    if (highlightedEventId) {
      fetchEvent(highlightedEventId);
    }
  }, [highlightedEventId]);

  const fetchEvent = async (eventId: string) => {
    const result = await getEventById(eventId);
    if (result.error) {
      setError(result.error);
    } else {
      setEvent(result.event);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Remove the highlight_event_id parameter from the URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('highlight_event_id');

    // Use replace to update the URL without adding a new history entry
    router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
  };

  if (highlightedEventId) {
    return (
      <HighlightedEventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={event}
        error={error}
      />
    );
  }

  return null;
}
