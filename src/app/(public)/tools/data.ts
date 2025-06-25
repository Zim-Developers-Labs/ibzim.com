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
];

export const ibZimAnswers: Answer[] = [
  {
    id: 'ibzim-answer-1',
    content:
      'Based on our research across Zimbabwe, Puma Energy and Total typically offer competitive fuel prices. However, prices can vary by location and current market conditions. We recommend checking multiple stations in your area and using fuel price comparison apps when available. Government-regulated pricing means differences are usually small, but every cent counts on long journeys.',
    userName: 'IBZim',
    tool: 'distance-calculator',
    isVerified: true,
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
    createdAt: new Date('2025-06-02T09:45:00Z'),
    questionId: 'reduce-fuel-cost',
    updatedAt: new Date('2025-06-02T09:45:00Z'),
  },
];
