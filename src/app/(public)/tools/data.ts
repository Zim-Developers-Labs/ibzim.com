import { Answer } from '@/server/db/schema';

export interface Question {
  id: string;
  question: string;
  tool: string;
}

export const questions: Question[] = [
  {
    id: 'fuel-stations',
    question: 'What is the cheapest service station for fuel?',
    tool: 'distance-calculator',
  },
  {
    id: 'diesel-vs-petrol',
    question: 'Which is better for travelling: diesel or petrol?',
    tool: 'distance-calculator',
  },
  {
    id: 'reduce-fuel-cost',
    question:
      'How to reduce fuel cost with any type of car (hybrid, petrol, diesel)?',
    tool: 'distance-calculator',
  },
  {
    id: 'ecocash-charges',
    question: 'What are the current Ecocash USD & ZiG Charges?',
    tool: 'ecocash-calculator',
  },
  {
    id: 'ecocash-shortcodes',
    question: 'What are the shortcodes for ecocash transactions?',
    tool: 'ecocash-calculator',
  },
  {
    id: 'avoiding-charges',
    question: 'How to avoid Ecocash charges',
    tool: 'ecocash-calculator',
  },
];

export const ibZimAnswers: Answer[] = [
  {
    id: 'ibzim-answer-1',
    content:
      'Based on our research across Zimbabwe, prices vary for certain providers depending on the location and current market conditions. We recommend checking multiple stations in your area and using fuel price comparison apps when available. Government-regulated pricing means differences are usually small +/- 0.01 sometimes, but every cent counts on long journeys.',
    userName: 'IBZim',
    tool: 'distance-calculator',
    isVerified: true,
    likesCount: 100,
    createdAt: new Date('2025-06-02T10:30:00Z'),
    questionId: 'fuel-stations',
    updatedAt: new Date('2025-06-02T10:30:00Z'),
  },
  {
    id: 'ibzim-answer-2',
    content:
      'For long-distance travel in Zimbabwe, diesel is generally more economical. Diesel engines typically achieve 20-30% better fuel efficiency than petrol engines, and diesel fuel is usually cheaper per liter. Diesel engines also provide better torque for highway driving and climbing hills. However, diesel vehicles have higher upfront costs and maintenance can be more expensive. For city driving and shorter trips, petrol engines are often more suitable due to lower initial costs and quieter operation.',
    userName: 'IBZim',
    tool: 'distance-calculator',
    isVerified: true,
    likesCount: 100,
    createdAt: new Date('2025-06-02T11:00:00Z'),
    questionId: 'diesel-vs-petrol',
    updatedAt: new Date('2025-06-02T11:00:00Z'),
  },
  {
    id: 'ibzim-answer-3',
    content:
      'Here are proven ways to reduce fuel costs: 1) Maintain steady speeds (60-80 km/h is most efficient), 2) Keep tires properly inflated, 3) Remove excess weight from your vehicle, 4) Use air conditioning wisely (above 60km/h, AC is more efficient than open windows), 5) Plan routes to avoid traffic and combine trips, 6) Regular maintenance (clean air filters, proper oil), 7) Gentle acceleration and braking, 8) For hybrids: maximize electric mode in city driving, 9) For diesel: allow proper warm-up time, 10) Consider carpooling for regular commutes.',
    userName: 'IBZim',
    tool: 'distance-calculator',
    isVerified: true,
    likesCount: 100,
    createdAt: new Date('2025-06-02T09:45:00Z'),
    questionId: 'reduce-fuel-cost',
    updatedAt: new Date('2025-06-02T09:45:00Z'),
  },
  {
    id: 'ibzim-answer-4',
    content:
      'Ecocash charges and Tariffs are - Balance inquiry: $0.15 - Request Bank Balance: $0.10 - Request Bank Statement $0.15 - Cash in: Free  The charges for USD and ZiG transactions vary depending on the type of transaction (sending, receiving, cash-out, bill payments) and the amount involved. For USD, cash-out charges typically range between 5%–10%.',
    userName: 'IBZim',
    tool: 'ecocash-calculator',
    isVerified: true,
    likesCount: 100,
    createdAt: new Date('2025-06-26T10:00:00Z'),
    questionId: 'ecocash-charges',
    updatedAt: new Date('2025-06-26T10:00:00Z'),
  },
  {
    id: 'ibzim-answer-5',
    content:
      'Ecocash shortcodes are USSD codes used to access various services. The main menu is available via *151# (Universal) or *153# (USD). To send money: *151*1*1#, to cash out: *151*1*2#, to pay merchant: *151*2*1#, and to buy airtime: *151*2*2#. You can typically do this for any ecocash dial flow.',
    userName: 'IBZim',
    tool: 'ecocash-calculator',
    isVerified: true,
    likesCount: 100,
    createdAt: new Date('2025-06-26T10:05:00Z'),
    questionId: 'ecocash-shortcodes',
    updatedAt: new Date('2025-06-26T10:05:00Z'),
  },
  {
    id: 'ibzim-answer-6',
    content:
      'To reduce or avoid Ecocash charges, consider using merchant payments instead of person-to-person transfers, as they are usually free. Also, receiving money via merchant accounts or bank-to-wallet transfers can have lower fees. Where possible, transact in ZiG instead of USD to benefit from lower tariff bands. However, charges are part of the mobile money infrastructure and can’t be fully avoided unless using alternative platforms for zero-fee transactions like ZIPIT Smart or direct bank apps.',
    userName: 'IBZim',
    tool: 'ecocash-calculator',
    isVerified: true,
    likesCount: 100,
    createdAt: new Date('2025-06-26T10:10:00Z'),
    questionId: 'avoiding-charges',
    updatedAt: new Date('2025-06-26T10:10:00Z'),
  },
];
