import { Feature } from './features-table';

export const currentReleaseNotes = [
  'Launched Beta Program',
  'Add Off Database Feedback System',
];

export const features = [
  {
    name: 'My Account',
    docsUrl: '/docs/my-account',
    issues: [
      { id: 'ma-1', title: 'Initial Feature Page Design', status: 'closed' },
      {
        id: 'ma-2',
        title: 'Verification request not being sent on email signup',
        status: 'open',
      },
    ],
  },
  {
    name: 'School Picker Tables',
    docsUrl: '/docs/school-picker',
    issues: [
      { id: 'spc-1', title: 'Initial Feature Page Design', status: 'closed' },
      {
        id: 'spc-2',
        title: 'No ratings data displayed on schools',
        status: 'open',
      },
      {
        id: 'spc-3',
        title: 'Compare tool link blocked to #',
        status: 'open',
      },
    ],
  },
  {
    name: 'Events Calendar',
    docsUrl: '/docs/events-calendar/getting-started',
    issues: [
      { id: 'ec-1', title: 'Initial Feature Page Design', status: 'closed' },
    ],
  },
  {
    name: "People's Choice Awards",
    docsUrl: '/docs/peoples-choice-awards/overview',
    issues: [
      { id: 'pca-1', title: 'Initial Feature Page Design', status: 'closed' },
    ],
  },
  {
    name: 'Billboard',
    docsUrl: '/docs/music-billboard',
    issues: [
      { id: 'bb-1', title: 'Initial Feature Page Design', status: 'closed' },
    ],
  },
  {
    name: 'Premium',
    docsUrl: '#',
    issues: [
      { id: 'pm-1', title: 'Initial Feature Page Design', status: 'closed' },
    ],
  },
  {
    name: 'Earn Online',
    docsUrl: '/docs/earn-online/getting-started',
    issues: [
      { id: 'eo-1', title: 'Initial Feature Page Design', status: 'closed' },
    ],
  },
  {
    name: 'Advertising Platform',
    docsUrl: '/docs/advertising',
    issues: [
      { id: 'ap-1', title: 'Initial Feature Page Design', status: 'closed' },
    ],
  },
  {
    name: 'Articles Blog',
    docsUrl: '/docs/articles-blog',
    issues: [
      { id: 'ab-1', title: 'Initial Feature Page Design', status: 'closed' },
      { id: 'ab-2', title: 'Add Comment Section', status: 'open' },
      { id: 'ab-3', title: 'Add article actions (saving etc)', status: 'open' },
      {
        id: 'ab-4',
        title: 'Add functionality to Article truth score',
        status: 'open',
      },
    ],
  },
  {
    name: 'Government Structure',
    docsUrl: '/docs/government-structure',
    issues: [
      { id: 'gs-1', title: 'Initial Feature Page Design', status: 'open' },
    ],
  },
  {
    name: 'Biography Profiles',
    docsUrl: '/docs/biography-profiles',
    issues: [
      { id: 'bp-1', title: 'Initial Feature Page Design', status: 'closed' },
    ],
  },
  {
    name: 'Platform Documentation',
    docsUrl: '#',
    issues: [
      { id: 'il-1', title: 'Initial Feature Page Design', status: 'closed' },
      { id: 'il-2', title: 'Remove home page redirect', status: 'open' },
      {
        id: 'il-3',
        title: 'Fix: Hidden Search Bar on Sidebar in mobile view',
        status: 'open',
      },
    ],
  },
  {
    name: 'IBZIM Support',
    docsUrl: '#',
    issues: [
      { id: 'is-1', title: 'Initial Feature Page Design', status: 'open' },
    ],
  },
  {
    name: 'Compare Tool',
    docsUrl: '/docs/compare-tool',
    issues: [
      {
        id: 'ct-1',
        title: 'Initial Feature Page Design',
        status: 'in progress',
      },
    ],
  },
  {
    name: 'Calculators Hub',
    docsUrl: '/docs/calculators/overview',
    issues: [
      { id: 'ch-1', title: 'Initial Feature Page Design', status: 'open' },
    ],
  },
] satisfies Feature[];

export const stats = {
  fundingRaised: {
    current: 0,
    previous: 0,
  },
};
