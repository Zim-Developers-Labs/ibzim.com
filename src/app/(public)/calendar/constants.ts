export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type:
    | 'holiday'
    | 'business'
    | 'tech'
    | 'community'
    | 'school'
    | 'music'
    | 'religious'
    | 'ibzim';
  description?: string;
  location?: string;
  isRecurring?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const sampleEvents: CalendarEvent[] = [
  // Zimbabwean National Holidays for 2025 (high priority)
  {
    id: '1',
    title: "New Year's Day",
    date: new Date(2025, 0, 1),
    type: 'holiday',
    description: 'Public holiday celebrating the beginning of the new year',
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Robert Gabriel Mugabe National Youth Day',
    date: new Date(2025, 1, 21),
    type: 'holiday',
    description: 'National holiday honoring the youth of Zimbabwe',
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '3',
    title: 'Independence Day',
    date: new Date(2025, 3, 18),
    type: 'holiday',
    description: "Celebrating Zimbabwe's independence from colonial rule",
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '4',
    title: "Workers' Day",
    date: new Date(2025, 4, 1),
    type: 'holiday',
    description: "International Workers' Day - public holiday",
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '5',
    title: 'Africa Day',
    date: new Date(2025, 4, 25),
    type: 'holiday',
    description: 'Celebrating African unity and heritage',
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '6',
    title: 'Heroes Day',
    date: new Date(2025, 7, 12),
    type: 'holiday',
    description: "Honoring Zimbabwe's liberation war heroes",
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '7',
    title: 'Defence Forces Day',
    date: new Date(2025, 7, 13),
    type: 'holiday',
    description: "Celebrating Zimbabwe's armed forces",
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '8',
    title: 'Unity Day',
    date: new Date(2025, 11, 22),
    type: 'holiday',
    description: 'Commemorating national unity and reconciliation',
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '9',
    title: 'Christmas Day',
    date: new Date(2025, 11, 25),
    type: 'holiday',
    description: 'Christian holiday celebrating the birth of Jesus Christ',
    isRecurring: true,
    priority: 'high',
  },
  {
    id: '10',
    title: 'Boxing Day',
    date: new Date(2025, 11, 26),
    type: 'holiday',
    description: 'Public holiday following Christmas Day',
    isRecurring: true,
    priority: 'high',
  },

  // January 2025 Events
  {
    id: '11',
    title: 'IBZIM Awards Voting Opens',
    date: new Date(2025, 0, 10),
    type: 'community',
    description:
      'Annual awards voting period begins - vote for your favorite tech personalities',
    priority: 'medium',
  },
  {
    id: '12',
    title: 'ZimTech Hackathon',
    date: new Date(2025, 0, 15),
    type: 'tech',
    description:
      '48-hour coding challenge for innovative solutions to local problems',
    location: 'Harare Innovation Hub',
    priority: 'high',
  },
  {
    id: '13',
    title: 'Tech Meetup Harare',
    date: new Date(2025, 0, 20),
    type: 'tech',
    description:
      'Monthly developer meetup - JavaScript frameworks and modern web development',
    location: 'Impact Hub Harare',
    priority: 'low',
  },
  {
    id: '14',
    title: 'DevFest Zimbabwe',
    date: new Date(2025, 0, 25),
    type: 'tech',
    description:
      'Google Developer Festival - Learn, Connect, Build with the latest technologies',
    location: 'Bulawayo',
    priority: 'high',
  },
  {
    id: '15',
    title: 'Startup Pitch Night',
    date: new Date(2025, 0, 28),
    type: 'business',
    description: 'Local startups pitch their ideas to investors and mentors',
    location: 'Harare',
    priority: 'medium',
  },

  // February 2025 Events
  {
    id: '16',
    title: 'Blockchain Zimbabwe Meetup',
    date: new Date(2025, 1, 5),
    type: 'tech',
    description: "Exploring blockchain applications in Zimbabwe's economy",
    location: 'Harare',
    priority: 'low',
  },
  {
    id: '17',
    title: 'AI & Machine Learning Workshop',
    date: new Date(2025, 1, 8),
    type: 'tech',
    description: 'Hands-on workshop on AI implementation for local businesses',
    location: 'University of Zimbabwe',
    priority: 'medium',
  },
  {
    id: '18',
    title: 'Startup Weekend Harare',
    date: new Date(2025, 1, 14),
    type: 'business',
    description: '54-hour entrepreneurship event - from idea to prototype',
    location: 'Harare',
    priority: 'high',
  },
  {
    id: '19',
    title: 'Digital Marketing Workshop',
    date: new Date(2025, 1, 18),
    type: 'business',
    description:
      'Social media and digital marketing strategies for African markets',
    location: 'Bulawayo',
    priority: 'medium',
  },
  {
    id: '20',
    title: 'Women in Tech Conference',
    date: new Date(2025, 1, 22),
    type: 'tech',
    description: 'Empowering women in technology across Zimbabwe',
    location: 'Harare',
    priority: 'medium',
  },
  {
    id: '21',
    title: 'Fintech Innovation Summit',
    date: new Date(2025, 1, 28),
    type: 'business',
    description: 'Exploring financial technology solutions for Zimbabwe',
    location: 'Harare',
    priority: 'high',
  },

  // March 2025 Events
  {
    id: '22',
    title: 'Zimbabwe Innovation Summit',
    date: new Date(2025, 2, 5),
    type: 'business',
    description:
      'Annual innovation conference bringing together entrepreneurs and investors',
    location: 'Victoria Falls',
    priority: 'high',
  },
  {
    id: '23',
    title: 'Mobile App Development Bootcamp',
    date: new Date(2025, 2, 10),
    type: 'tech',
    description: '5-day intensive bootcamp on mobile app development',
    location: 'Harare',
    priority: 'medium',
  },
  {
    id: '24',
    title: 'AgriTech Conference',
    date: new Date(2025, 2, 15),
    type: 'tech',
    description: 'Technology solutions for agriculture in Zimbabwe',
    location: 'Gweru',
    priority: 'medium',
  },
  {
    id: '25',
    title: 'Cybersecurity Awareness Workshop',
    date: new Date(2025, 2, 20),
    type: 'tech',
    description: 'Protecting businesses from cyber threats',
    location: 'Harare',
    priority: 'medium',
  },
  {
    id: '26',
    title: 'E-commerce Expo Zimbabwe',
    date: new Date(2025, 2, 25),
    type: 'business',
    description:
      'Showcasing e-commerce platforms and digital payment solutions',
    location: 'Harare',
    priority: 'high',
  },

  // April 2025 Events
  {
    id: '27',
    title: 'Code4Zimbabwe Hackathon',
    date: new Date(2025, 3, 5),
    type: 'tech',
    description: 'Civic tech hackathon for government transparency solutions',
    location: 'Harare',
    priority: 'high',
  },
  {
    id: '28',
    title: 'Digital Health Summit',
    date: new Date(2025, 3, 12),
    type: 'tech',
    description: 'Healthcare technology innovations for Zimbabwe',
    location: 'Bulawayo',
    priority: 'medium',
  },
  {
    id: '29',
    title: 'Youth Entrepreneurship Forum',
    date: new Date(2025, 3, 20),
    type: 'business',
    description: 'Empowering young entrepreneurs with skills and networks',
    location: 'Harare',
    priority: 'medium',
  },
  {
    id: '30',
    title: 'Cloud Computing Workshop',
    date: new Date(2025, 3, 25),
    type: 'tech',
    description: 'Introduction to cloud platforms and services',
    location: 'Harare',
    priority: 'low',
  },

  // May 2025 Events
  {
    id: '31',
    title: 'Tech Career Fair',
    date: new Date(2025, 4, 8),
    type: 'tech',
    description: 'Connecting tech talent with employers across Zimbabwe',
    location: 'Harare',
    priority: 'medium',
  },
  {
    id: '32',
    title: 'Green Tech Conference',
    date: new Date(2025, 4, 15),
    type: 'tech',
    description:
      'Sustainable technology solutions for environmental challenges',
    location: 'Victoria Falls',
    priority: 'medium',
  },
  {
    id: '33',
    title: 'Data Science Meetup',
    date: new Date(2025, 4, 20),
    type: 'tech',
    description: 'Exploring data analytics and machine learning applications',
    location: 'Harare',
    priority: 'low',
  },
  {
    id: '34',
    title: 'Small Business Digital Transformation',
    date: new Date(2025, 4, 28),
    type: 'business',
    description: 'Helping SMEs adopt digital technologies',
    location: 'Bulawayo',
    priority: 'medium',
  },

  // June 2025 Events
  {
    id: '35',
    title: 'IoT Zimbabwe Conference',
    date: new Date(2025, 5, 5),
    type: 'tech',
    description: 'Internet of Things applications in African context',
    location: 'Harare',
    priority: 'medium',
  },
  {
    id: '36',
    title: 'EdTech Innovation Summit',
    date: new Date(2025, 5, 12),
    type: 'tech',
    description: "Educational technology solutions for Zimbabwe's schools",
    location: 'Gweru',
    priority: 'medium',
  },
  {
    id: '37',
    title: 'Startup Funding Workshop',
    date: new Date(2025, 5, 18),
    type: 'business',
    description: 'How to secure funding for your startup in Zimbabwe',
    location: 'Harare',
    priority: 'high',
  },
  {
    id: '38',
    title: 'Web Development Bootcamp',
    date: new Date(2025, 5, 25),
    type: 'tech',
    description: 'Intensive 3-day web development training',
    location: 'Harare',
    priority: 'medium',
  },

  // Additional events throughout the year
  {
    id: '39',
    title: 'IBZIM Annual Conference',
    date: new Date(2025, 6, 15),
    type: 'community',
    description: "Annual gathering of Zimbabwe's tech community",
    location: 'Harare',
    priority: 'high',
  },
  {
    id: '40',
    title: 'Robotics Workshop for Students',
    date: new Date(2025, 7, 5),
    type: 'tech',
    description: 'Introduction to robotics for high school students',
    location: 'Harare',
    priority: 'low',
  },
  {
    id: '41',
    title: 'Digital Banking Summit',
    date: new Date(2025, 8, 10),
    type: 'business',
    description: "Future of banking in Zimbabwe's digital economy",
    location: 'Harare',
    priority: 'high',
  },
  {
    id: '42',
    title: 'Game Development Workshop',
    date: new Date(2025, 9, 8),
    type: 'tech',
    description: 'Creating games with local themes and stories',
    location: 'Bulawayo',
    priority: 'low',
  },
  {
    id: '43',
    title: 'Tech Policy Forum',
    date: new Date(2025, 10, 12),
    type: 'community',
    description: 'Discussing technology policy and regulation in Zimbabwe',
    location: 'Harare',
    priority: 'medium',
  },
  {
    id: '44',
    title: 'Year-End Tech Awards',
    date: new Date(2025, 11, 15),
    type: 'community',
    description: "Celebrating Zimbabwe's tech achievements of the year",
    location: 'Harare',
    priority: 'high',
  },
];

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
