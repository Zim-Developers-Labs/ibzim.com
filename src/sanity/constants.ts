// Document types which:
// - cannot be created in the 'new document' menu

import { CaseIcon, CogIcon, ComposeIcon, SearchIcon } from '@sanity/icons';
import { FieldGroupDefinition } from 'sanity';

// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['home', 'settings', 'policy'];

export const SOCIAL_PROFILES = [
  'Facebook',
  'Twitter',
  'Instagram',
  'LinkedIn',
  'Wikipedia',
  'YouTube',
  'Pinterest',
  'Snapchat',
  'Other',
  'TikTok',
  'WeChat',
  'WhatsApp',
  'Telegram',
  'Viber',
  'Signal',
  'Skype',
  'Discord',
  'Reddit',
  'Quora',
  'Tumblr',
  'Medium',
  'Twitch',
  'Clubhouse',
  'Spotify',
  'SoundCloud',
  'Tidal',
  'Apple Music',
  'Google Play Music',
  'Deezer',
  'Amazon Music',
];

export const INPUT_GROUP = {
  CONFIG: 'config',
  SEO: 'seo',
  EDITORIAL: 'editorial',
};

export const INPUT_GROUPS: FieldGroupDefinition[] = [
  {
    name: INPUT_GROUP.CONFIG,
    title: 'Config',
    icon: CogIcon,
    // default: true,
  },
  {
    name: INPUT_GROUP.SEO,
    title: 'SEO',
    icon: SearchIcon,
  },
  {
    name: INPUT_GROUP.EDITORIAL,
    title: 'Editorial',
    icon: ComposeIcon,
  },
];

export const ARTICLE_INDUSTRIES = [
  {
    title: 'Arts & Entertainment',
    value: 'media',
  },
  {
    title: 'Beauty and Fitness',
    value: 'lifestyle',
  },
  {
    title: 'Business & Industrial',
    value: 'business',
  },
  {
    title: 'Computers & Electronics',
    value: 'tech',
  },
  {
    title: 'Finance',
    value: 'finance',
  },
  {
    title: 'Hobbies & Leisure',
    value: 'leisure',
  },
  {
    title: 'Home & Garden',
    value: 'home',
  },
  {
    title: 'Internet & Telecom',
    value: 'telecom',
  },
  {
    title: 'Jobs & Careers',
    value: 'careers',
  },
  {
    title: 'People & Society',
    value: 'people',
  },
  {
    title: 'Travel & Transportation',
    value: 'travel',
  },
];

export const NEWS_INDUSTRIES = [
  {
    title: 'Arts & Entertainment',
    value: 'media',
  },
  {
    title: 'Beauty and Fitness',
    value: 'lifestyle',
  },
  {
    title: 'Business & Industrial',
    value: 'business',
  },
  {
    title: 'Computers & Electronics',
    value: 'tech',
  },
  {
    title: 'Education',
    value: 'education',
  },
  {
    title: 'Finance',
    value: 'finance',
  },
  {
    title: 'Hobbies & Leisure',
    value: 'leisure',
  },
  {
    title: 'Home & Garden',
    value: 'home',
  },
  {
    title: 'Internet & Telecom',
    value: 'telecom',
  },
  {
    title: 'Jobs & Careers',
    value: 'jobs',
  },
  {
    title: 'People & Society',
    value: 'people',
  },
  {
    title: 'Politics',
    value: 'politics',
  },
  {
    title: 'Travel & Transportation',
    value: 'travel',
  },
  {
    title: 'Sports',
    value: 'sports',
  },
];

export const ARTICLE_TYPES = [
  {
    title: 'How To Guide',
    value: 'guides',
  },
  {
    title: 'Informative (Did you know)',
    value: 'info',
  },
  {
    title: 'Review Article',
    value: 'reviews',
  },
  {
    title: 'Listicle (Rankings)',
    value: 'rankings',
  },
  {
    title: 'Profile Article',
    value: 'profiles',
  },
  {
    title: 'Interview Article',
    value: 'interviews',
  },
  {
    title: 'Event Article',
    value: 'events',
  },
  {
    title: 'Comparison Article',
    value: 'compare',
  },
  {
    title: 'What is Definition Article',
    value: 'definitions',
  },
  {
    title: 'Inforgraphic Article',
    value: 'inforgraphics',
  },
  {
    title: 'Deals',
    value: 'deals',
  },
  {
    title: 'Case Study Article',
    value: 'case-studies',
  },
];
