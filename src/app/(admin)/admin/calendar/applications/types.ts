export type EventStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type EventType =
  | 'party'
  | 'conference'
  | 'competition'
  | 'workshop'
  | 'meeting'
  | 'social'
  | 'training'
  | 'webinar'
  | 'concert'
  | 'festival'
  | 'show'
  | 'exhibition'
  | 'chat'
  | 'awards'
  | 'chillout';

export type EventCategory =
  | 'holiday'
  | 'business'
  | 'tech'
  | 'community'
  | 'school'
  | 'music'
  | 'religious'
  | 'public'
  | 'ibzim'
  | 'casual'
  | 'sports';

export type EventPriority = 'high' | 'medium' | 'low';

export type EventLocationType = 'virtual' | 'physical';
