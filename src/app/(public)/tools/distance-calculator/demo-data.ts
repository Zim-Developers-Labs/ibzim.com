export interface Answer {
  id: string
  content: string
  author: string
  isVerified: boolean
  timestamp: Date
  likes: number
}

export interface FAQQuestion {
  id: string
  question: string
  answers: Answer[]
}

export const faqData: FAQQuestion[] = [
  {
    id: "fuel-stations",
    question: "What is the cheapest service station for fuel?",
    answers: [
      {
        id: "fs-1",
        content:
          "Based on our research across Zimbabwe, Puma Energy and Total typically offer competitive fuel prices. However, prices can vary by location and current market conditions. We recommend checking multiple stations in your area and using fuel price comparison apps when available. Government-regulated pricing means differences are usually small, but every cent counts on long journeys.",
        author: "IBZim",
        isVerified: true,
        timestamp: new Date("2024-01-15T10:30:00Z"),
        likes: 24,
      },
      {
        id: "fs-2",
        content:
          "I've found that Zuva stations often have slightly lower prices, especially on weekends. Plus they sometimes have promotions that can save you a few cents per liter.",
        author: "TravellerZW",
        isVerified: false,
        timestamp: new Date("2024-01-16T14:20:00Z"),
        likes: 8,
      },
      {
        id: "fs-3",
        content:
          "Don't forget to check if your bank offers fuel discounts! Some banks have partnerships with specific fuel stations that can give you 2-5% cashback.",
        author: "SmartSaver",
        isVerified: false,
        timestamp: new Date("2024-01-17T09:15:00Z"),
        likes: 12,
      },
      {
        id: "fs-4",
        content:
          "Engen stations in rural areas tend to be cheaper than in Harare or Bulawayo. If you're traveling long distances, consider filling up outside major cities.",
        author: "RuralDriver",
        isVerified: false,
        timestamp: new Date("2024-01-18T16:45:00Z"),
        likes: 6,
      },
    ],
  },
  {
    id: "diesel-vs-petrol",
    question: "Which is better for travelling: diesel or petrol?",
    answers: [
      {
        id: "dvp-1",
        content:
          "For long-distance travel in Zimbabwe, diesel is generally more economical. Diesel engines typically achieve 20-30% better fuel efficiency than petrol engines, and diesel fuel is usually cheaper per liter. Diesel engines also provide better torque for highway driving and climbing hills. However, diesel vehicles have higher upfront costs and maintenance can be more expensive. For city driving and shorter trips, petrol engines are often more suitable due to lower initial costs and quieter operation.",
        author: "IBZim",
        isVerified: true,
        timestamp: new Date("2024-01-10T11:00:00Z"),
        likes: 31,
      },
      {
        id: "dvp-2",
        content:
          "I've been driving diesel for 5 years now. The fuel savings on long trips to Victoria Falls and Bulawayo definitely add up. My Toyota Hilux gets about 12km/L compared to my friend's petrol version getting 8km/L.",
        author: "HighwayKing",
        isVerified: false,
        timestamp: new Date("2024-01-12T08:30:00Z"),
        likes: 15,
      },
      {
        id: "dvp-3",
        content:
          "Petrol is better if you mostly drive in town. Diesel engines need to warm up properly and don't like short trips. Plus petrol cars are generally cheaper to service.",
        author: "CityCommuter",
        isVerified: false,
        timestamp: new Date("2024-01-13T13:20:00Z"),
        likes: 9,
      },
      {
        id: "dvp-4",
        content:
          "Consider the resale value too. Diesel vehicles tend to hold their value better in Zimbabwe, especially pickup trucks and SUVs.",
        author: "CarDealer_ZW",
        isVerified: false,
        timestamp: new Date("2024-01-14T10:10:00Z"),
        likes: 7,
      },
    ],
  },
  {
    id: "reduce-fuel-cost",
    question: "How to reduce fuel cost with any type of car (hybrid, petrol, diesel)?",
    answers: [
      {
        id: "rfc-1",
        content:
          "Here are proven ways to reduce fuel costs: 1) Maintain steady speeds (60-80 km/h is most efficient), 2) Keep tires properly inflated, 3) Remove excess weight from your vehicle, 4) Use air conditioning wisely (above 60km/h, AC is more efficient than open windows), 5) Plan routes to avoid traffic and combine trips, 6) Regular maintenance (clean air filters, proper oil), 7) Gentle acceleration and braking, 8) For hybrids: maximize electric mode in city driving, 9) For diesel: allow proper warm-up time, 10) Consider carpooling for regular commutes.",
        author: "IBZim",
        isVerified: true,
        timestamp: new Date("2024-01-08T09:45:00Z"),
        likes: 42,
      },
      {
        id: "rfc-2",
        content:
          "I reduced my fuel consumption by 15% just by checking tire pressure monthly and driving more smoothly. Small changes make a big difference over time!",
        author: "EcoDriver",
        isVerified: false,
        timestamp: new Date("2024-01-11T15:30:00Z"),
        likes: 18,
      },
      {
        id: "rfc-3",
        content:
          "For hybrid owners: Learn your car's systems! Use eco mode, watch the energy flow display, and try to keep the engine off as much as possible in traffic.",
        author: "HybridExpert",
        isVerified: false,
        timestamp: new Date("2024-01-12T12:00:00Z"),
        likes: 13,
      },
      {
        id: "rfc-4",
        content:
          "Don't underestimate route planning. Using apps like Google Maps to avoid traffic can save 10-20% on fuel costs, especially in Harare during peak hours.",
        author: "TrafficNinja",
        isVerified: false,
        timestamp: new Date("2024-01-13T07:45:00Z"),
        likes: 11,
      },
      {
        id: "rfc-5",
        content:
          "Regular servicing is key! A well-maintained car can be 10-15% more fuel efficient. Don't skip those oil changes and air filter replacements.",
        author: "MechanicMike",
        isVerified: false,
        timestamp: new Date("2024-01-14T14:15:00Z"),
        likes: 16,
      },
    ],
  },
]
