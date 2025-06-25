import type { Answer, AnswerLike } from '@/server/db/schema';

export const demoAnswerLikes: AnswerLike[] = [
  // ibzim-answer-1: 24 likes
  ...Array.from({ length: 24 }, (_, i) => ({
    answerId: 'ibzim-answer-1',
    userId: `demo-user-${i + 1}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // ibzim-answer-2: 38 likes
  ...Array.from({ length: 38 }, (_, i) => ({
    answerId: 'ibzim-answer-2',
    userId: `demo-user-${i + 1}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // ibzim-answer-3: 18 likes
  ...Array.from({ length: 18 }, (_, i) => ({
    answerId: 'ibzim-answer-3',
    userId: `demo-user-${i + 1}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // demo-answer-1: 15 likes
  ...Array.from({ length: 15 }, (_, i) => ({
    answerId: 'demo-answer-1',
    userId: `demo-user-${i + 25}`, // Starting from demo-user-25 to avoid overlap
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // demo-answer-2: 12 likes
  ...Array.from({ length: 12 }, (_, i) => ({
    answerId: 'demo-answer-2',
    userId: `demo-user-${i + 40}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // demo-answer-3: 18 likes
  ...Array.from({ length: 18 }, (_, i) => ({
    answerId: 'demo-answer-3',
    userId: `demo-user-${i + 52}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // demo-answer-6: 14 likes
  ...Array.from({ length: 14 }, (_, i) => ({
    answerId: 'demo-answer-6',
    userId: `demo-user-${i + 70}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // demo-answer-7: 9 likes
  ...Array.from({ length: 9 }, (_, i) => ({
    answerId: 'demo-answer-7',
    userId: `demo-user-${i + 84}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // demo-answer-8: 16 likes
  ...Array.from({ length: 16 }, (_, i) => ({
    answerId: 'demo-answer-8',
    userId: `demo-user-${i + 93}`,
    createdAt: new Date('2023-10-01T00:00:00Z'),
  })),

  // demo-answer-10: 11 likes
  ...Array.from({ length: 11 }, (_, i) => ({
    answerId: 'demo-answer-10',
    userId: `demo-user-${i + 1}`,
    createdAt: new Date('2023-10-02T00:00:00Z'),
  })),

  // demo-answer-11: 13 likes
  ...Array.from({ length: 13 }, (_, i) => ({
    answerId: 'demo-answer-11',
    userId: `demo-user-${i + 12}`,
    createdAt: new Date('2023-10-02T00:00:00Z'),
  })),

  // demo-answer-12: 17 likes
  ...Array.from({ length: 17 }, (_, i) => ({
    answerId: 'demo-answer-12',
    userId: `demo-user-${i + 25}`,
    createdAt: new Date('2023-10-02T00:00:00Z'),
  })),

  // demo-answer-13: 19 likes
  ...Array.from({ length: 19 }, (_, i) => ({
    answerId: 'demo-answer-13',
    userId: `demo-user-${i + 42}`,
    createdAt: new Date('2023-10-02T00:00:00Z'),
  })),
];

export const demoAnswers: Answer[] = [
  {
    id: 'demo-answer-1',
    tool: 'distance-calculator',
    questionId: 'fuel-stations',
    userName: 'Tino Mutasa',
    content:
      "I've found that Budget petroleum stations often have slightly lower prices, especially on weekends. Plus they sometimes have promotions that can save you a few cents per liter.",
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-02T10:30:00Z'),
    updatedAt: new Date('2025-06-02T10:30:00Z'),
  },
  {
    id: 'demo-answer-2',
    tool: 'distance-calculator',
    questionId: 'fuel-stations',
    userName: 'Tafadzwa Moyo',
    content: "Don't forget to check if you have fuel coupons.",
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-05T14:15:00Z'),
    updatedAt: new Date('2025-06-05T14:15:00Z'),
  },
  {
    id: 'demo-answer-3',
    tool: 'distance-calculator',
    questionId: 'fuel-stations',
    userName: 'Chipo Nyathi',
    content:
      "ZUVA stations in remote areas tend to be cheaper than in Harare or Bulawayo. If you're traveling long distances, consider filling up outside major cities.",
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-08T09:45:00Z'),
    updatedAt: new Date('2025-06-08T09:45:00Z'),
  },
  {
    id: 'demo-answer-6',
    tool: 'distance-calculator',
    questionId: 'diesel-vs-petrol',
    content:
      "I've been driving diesel for 5 years now. The fuel savings on long trips to Victoria Falls and Bulawayo definitely add up. My Toyota Hilux gets about 12km/L compared to my friend's petrol version getting 8km/L.",
    userName: 'Simba Chirwa',
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-12T16:20:00Z'),
    updatedAt: new Date('2025-06-12T16:20:00Z'),
  },
  {
    id: 'demo-answer-7',
    tool: 'distance-calculator',
    questionId: 'diesel-vs-petrol',
    content:
      "Petrol is better if you mostly drive in town. Diesel engines need to warm up properly and don't like short trips. Plus petrol cars are generally cheaper to service.",
    userName: 'Tafadzwa Moyo',
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-15T11:30:00Z'),
    updatedAt: new Date('2025-06-15T11:30:00Z'),
  },
  {
    id: 'demo-answer-8',
    tool: 'distance-calculator',
    questionId: 'diesel-vs-petrol',
    content:
      'Consider the resale value too. Diesel vehicles tend to hold their value better, especially pickup trucks and SUVs.',
    userName: 'Chipo Nyathi',
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-18T13:45:00Z'),
    updatedAt: new Date('2025-06-18T13:45:00Z'),
  },
  {
    id: 'demo-answer-10',
    tool: 'distance-calculator',
    questionId: 'reduce-fuel-cost',
    content:
      'I reduced my fuel consumption by 15% just by checking tire pressure monthly and driving more smoothly. Small changes make a big difference over time!',
    userName: 'Kuda Mlambo',
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-20T08:15:00Z'),
    updatedAt: new Date('2025-06-20T08:15:00Z'),
  },
  {
    id: 'demo-answer-11',
    tool: 'distance-calculator',
    questionId: 'reduce-fuel-cost',
    content:
      "For hybrid owners: Learn your car's systems! Use eco mode, watch the energy flow display, and try to keep the engine off as much as possible in traffic.",
    userName: 'Rudo Chikafu',
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-22T15:30:00Z'),
    updatedAt: new Date('2025-06-22T15:30:00Z'),
  },
  {
    id: 'demo-answer-12',
    tool: 'distance-calculator',
    questionId: 'reduce-fuel-cost',
    content:
      "Don't underestimate route planning. Using apps like Google Maps to avoid traffic can save 10-20% on fuel costs, especially in Harare during peak hours.",
    userName: 'Tafara Mupfumi',
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-24T12:00:00Z'),
    updatedAt: new Date('2025-06-24T12:00:00Z'),
  },
  {
    id: 'demo-answer-13',
    tool: 'distance-calculator',
    questionId: 'reduce-fuel-cost',
    content:
      "Regular servicing is key! A well-maintained car can be 10-15% more fuel efficient. Don't skip those oil changes and air filter replacements.",
    userName: 'Nyasha Gondo',
    isVerified: false,
    likesCount: 0,
    createdAt: new Date('2025-06-25T17:45:00Z'),
    updatedAt: new Date('2025-06-25T17:45:00Z'),
  },
];
