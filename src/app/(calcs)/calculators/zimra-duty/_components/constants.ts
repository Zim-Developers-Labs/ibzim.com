// Vehicle Makes - alphabetically sorted with "Other" at end
export const VEHICLE_MAKES = [
  'Acura',
  'Alfa Romeo',
  'Aston Martin',
  'Audi',
  'Bentley',
  'BMW',
  'Bugatti',
  'Cadillac',
  'Chery',
  'Chevrolet',
  'Chrysler',
  'Citroen',
  'Daihatsu',
  'Dodge',
  'ERF',
  'FAW',
  'Ferrari',
  'Fiat',
  'Ford',
  'Foton',
  'Freightliner',
  'GMC',
  'Hino',
  'Honda',
  'Hummer',
  'Hyundai',
  'Infiniti',
  'Intercontinental',
  'Irizar',
  'Isuzu',
  'Iveco',
  'Jaguar',
  'Jeep',
  'KIA',
  'Lamborghini',
  'Land Rover',
  'Lexus',
  'Leyland',
  'Lincoln',
  'Lotus',
  'Mahindra',
  'Man',
  'Maserati',
  'Mazda',
  'McLaren',
  'Mercedes-Benz',
  'Mini',
  'Mitsubishi',
  'Nissan',
  'Opel',
  'Peugeot',
  'Porsche',
  'Renault',
  'Rolls-Royce',
  'Rover',
  'Saab',
  'Scania',
  'Subaru',
  'Suzuki',
  'Tata',
  'Tesla',
  'Toyota',
  'UD',
  'Vauxhall',
  'Volkswagen',
  'Volvo',
  'Other',
] as const;

export type VehicleMake = (typeof VEHICLE_MAKES)[number];

// Exchange Rates (Base: USD = 27.2339 ZWL)
export const EXCHANGE_RATES = {
  USD: 27.2339,
  ZAR: 1.4975,
  ZAR_TAB2: 1.5051,
  NAD: 1.4975,
  AED: 7.4156,
  CNY: 3.639,
  EUR: 31.9399,
  GBP: 36.6023,
} as const;

export type CurrencyCode = keyof typeof EXCHANGE_RATES;

// Countries of Supply Options
export const COUNTRIES_OF_SUPPLY = {
  southernAfrica: {
    label: 'Southern Africa',
    value: 'southernAfrica',
    requiresOceanFreight: false,
  },
  restOfAfrica: {
    label: 'Rest of Africa',
    value: 'restOfAfrica',
    requiresOceanFreight: false,
  },
  unitedKingdom: {
    label: 'United Kingdom',
    value: 'unitedKingdom',
    requiresOceanFreight: true,
  },
  japan: { label: 'Japan', value: 'japan', requiresOceanFreight: true },
  unitedStates: {
    label: 'United States',
    value: 'unitedStates',
    requiresOceanFreight: true,
  },
  restOfWorld: {
    label: 'Rest of World',
    value: 'restOfWorld',
    requiresOceanFreight: true,
  },
} as const;

export type CountryOfSupplyKey = keyof typeof COUNTRIES_OF_SUPPLY;

// Invoice Currency Options
export const INVOICE_CURRENCIES = {
  AED: { label: 'AED - UAE Dirham', code: 'AED', countryCode: 'AE' },
  CNY: { label: 'CNY - Chinese Yuan', code: 'CNY', countryCode: 'CN' },
  EUR: { label: 'EUR - Euro', code: 'EUR', countryCode: 'EU' },
  GBP: { label: 'GBP - British Pound', code: 'GBP', countryCode: 'GB' },
  USD: { label: 'USD - US Dollar', code: 'USD', countryCode: 'US' },
  ZAR: {
    label: 'ZAR/NAD - Rand/Namibian Dollar',
    code: 'ZAR',
    countryCode: 'ZA',
  },
} as const;

export type InvoiceCurrencyKey = keyof typeof INVOICE_CURRENCIES;

// Function to get exchange rate between two currencies
export function getExchangeRate(
  fromCurrency: InvoiceCurrencyKey,
  toCurrency: 'USD' | 'ZWL',
): number {
  const fromRate =
    EXCHANGE_RATES[fromCurrency === 'ZAR' ? 'ZAR' : fromCurrency];
  if (toCurrency === 'USD') {
    return prec(EXCHANGE_RATES.USD / fromRate, 4);
  }
  // To ZWL - the rates in EXCHANGE_RATES are already in ZWL
  return fromRate;
}

// Function to convert between invoice currencies
export function convertBetweenCurrencies(
  amount: number,
  fromCurrency: InvoiceCurrencyKey,
  toCurrency: InvoiceCurrencyKey,
): number {
  if (fromCurrency === toCurrency) return amount;
  // Convert to USD first, then to target currency
  const fromRateToZWL =
    EXCHANGE_RATES[fromCurrency === 'ZAR' ? 'ZAR' : fromCurrency];
  const toRateToZWL = EXCHANGE_RATES[toCurrency === 'ZAR' ? 'ZAR' : toCurrency];
  return prec((amount * fromRateToZWL) / toRateToZWL, 2);
}

// Tax Rates
export const VAT_RATE = 0.15;
export const VAT_RATE_TAB2 = 0.145;
export const SURTAX_RATE_VEHICLES = 0.35;
export const SURTAX_RATE_GOODS = 0.25;

// Immigrant Rebate Constants
export const REBATE_VEHICLE_THRESHOLD = 40000;
export const MIN_YEARS_ABROAD = 1.99;
export const MIN_OWNERSHIP_MONTHS = 0.5;

// Current year for age calculations
export const CURRENT_YEAR = new Date().getFullYear();
export const SURTAX_AGE_THRESHOLD = 5;
export const BAN_AGE_THRESHOLD = 10;

// Generate years for dropdown (current year to "older than 1970")
export const YEARS = Array.from(
  { length: CURRENT_YEAR - 1970 + 1 },
  (_, i) => CURRENT_YEAR - i,
);

// Utility functions
export function prec(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function convertToUSD(amount: number, currency: CurrencyCode): number {
  if (currency === 'USD') return amount;
  const rate = EXCHANGE_RATES[currency] / EXCHANGE_RATES.USD;
  return prec(amount / rate, 2);
}

export const VEHICLE_TYPES = {
  sedan: {
    label: 'Coupe/Sedan/Saloon/Convertible',
    dutyRate: 0.4,
    hasSurtax: true,
    requiresForeignCurrency: true,
    canBeBanned: true,
    image: '/assets/vehicles/sedan-coupe-car.jpg',
  },
  hatchback: {
    label: 'Hatchback/Station Wagon/SUV/Estate',
    dutyRate: 0.4,
    hasSurtax: true,
    requiresForeignCurrency: true,
    canBeBanned: true,
    image: '/assets/vehicles/suv-hatchback-station-wagon.jpg',
  },
  hybridElectric: {
    label: 'Hybrid and Electric Vehicles',
    dutyRate: 0.25, // Reduced rate for EVs
    hasSurtax: true,
    requiresForeignCurrency: false,
    canBeBanned: true,
    image: '/assets/vehicles/electric-vehicle-ev-hybrid-car.jpg',
  },
  singleCab: {
    label: 'Small truck/Single Cab',
    dutyRate: 0, // Depends on weight
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: true,
    needsWeight: true,
    image: '/assets/vehicles/single-cab-pickup-truck-small.jpg',
  },
  rigidTruck: {
    label: 'Rigid Trucks, Tipper Trucks, Rigid Tanker Trucks',
    dutyRate: 0.1,
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: false,
    showGVMNote: true,
    image: '/assets/vehicles/rigid-truck-tipper-tanker-truck.jpg',
  },
  panelVan: {
    label: 'Panel Van',
    dutyRate: 0, // Depends on weight
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: true,
    needsWeight: true,
    image: '/assets/vehicles/panel-van-delivery-vehicle.jpg',
  },
  doubleCab: {
    label: 'Double Cab/Twin cab',
    dutyRate: 0.6,
    hasSurtax: false,
    requiresForeignCurrency: true,
    canBeBanned: true,
    image: '/assets/vehicles/double-cab-twin-cab-pickup-truck.jpg',
  },
  forklift: {
    label: 'Forklift',
    dutyRate: 0,
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: false,
    image: '/assets/vehicles/forklift-industrial-vehicle.jpg',
  },
  motorcycle: {
    label: 'Motorcycle',
    dutyRate: 0, // Depends on engine size
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: false,
    needsEngineSize: true,
    image: '/assets/vehicles/motorcycle-motorbike.jpg',
  },
  farmTractor: {
    label: 'Farm Tractor',
    dutyRate: 0,
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: false,
    image: '/assets/vehicles/farm-tractor-agricultural-vehicle.jpg',
  },
  haulageTruck: {
    label: 'Haulage Truck (Horse)',
    dutyRate: 0,
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: false,
    image: '/assets/vehicles/haulage-truck-horse-semi-trailer.jpg',
  },
  trailer: {
    label: 'Trailer',
    dutyRate: 0, // Depends on trailer type
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: false,
    needsTrailerType: true,
    image: '/assets/vehicles/trailer-caravan-flatbed.jpg',
  },
  specialPurpose: {
    label: 'Special Purposes (eg Drill rig,Concrete mixers, Cranes..etc)',
    dutyRate: 0.05,
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: false,
    needsSpecialPurposeType: true,
    image: '/assets/vehicles/concrete-mixer-crane-truck-special-vehicle.jpg',
  },
  bus: {
    label: 'Public buses',
    dutyRate: 0, // Depends on capacity
    hasSurtax: false,
    requiresForeignCurrency: false,
    canBeBanned: true,
    needsBusCapacity: true,
    image: '/assets/vehicles/public-bus-passenger-coach.jpg',
  },
} as const;

export type VehicleTypeKey = keyof typeof VEHICLE_TYPES;

export type VehicleTypeInfo = {
  readonly label: string;
  readonly dutyRate: number;
  readonly hasSurtax: boolean;
  readonly requiresForeignCurrency: boolean;
  readonly canBeBanned: boolean;
  readonly image: string;
  readonly needsWeight?: boolean;
  readonly needsEngineSize?: boolean;
  readonly needsTrailerType?: boolean;
  readonly needsSpecialPurposeType?: boolean;
  readonly needsBusCapacity?: boolean;
  readonly showGVMNote?: boolean;
};

export function getVehicleTypeInfo(key: VehicleTypeKey): VehicleTypeInfo {
  return VEHICLE_TYPES[key] as VehicleTypeInfo;
}

export const WEIGHT_OPTIONS = {
  under800: { label: '< 800kg', dutyRate: 0.25 },
  '800to2500': { label: '> 800kg but < 2500kg', dutyRate: 0.4 },
  over2500: {
    label: '> 2500kg but (GVM) < 5 tonnes',
    dutyRate: 0.1,
  },
} as const;

export type WeightKey = keyof typeof WEIGHT_OPTIONS;

export const MOTORCYCLE_ENGINE_OPTIONS = {
  under250: { label: 'Less than 250cc', dutyRate: 0.1 },
  over250: { label: 'More than 250cc', dutyRate: 0.25 },
} as const;

export type MotorcycleEngineKey = keyof typeof MOTORCYCLE_ENGINE_OPTIONS;

export const TRAILER_TYPES = {
  caravan: { label: 'Camping/Housing Caravan type Trailers', dutyRate: 0.4 },
  refrigerated: { label: 'Refrigerated Trailers', dutyRate: 0.2 },
  other: {
    label: 'Other Trailers (Tanker, flatbed, dropsides ...etc)',
    dutyRate: 0.2,
  },
} as const;

export type TrailerTypeKey = keyof typeof TRAILER_TYPES;

export const SPECIAL_PURPOSE_TYPES = {
  concreteMixer: { label: 'Concrete Mixer' },
  drillingRig: { label: 'Mobile Drilling Rig' },
  fireTruck: { label: 'Fire fighting trucks' },
  crane: { label: 'Crane Trucks' },
  towerWagon: { label: 'Tower Wagons for lighting maintenance' },
} as const;

export type SpecialPurposeKey = keyof typeof SPECIAL_PURPOSE_TYPES;

export const BUS_CAPACITY_OPTIONS = {
  '15to20': { label: '15 - 20 Passengers', dutyRate: 0.15 },
  over20: { label: '20+ Passengers', dutyRate: 0.6 },
} as const;

export type BusCapacityKey = keyof typeof BUS_CAPACITY_OPTIONS;

export function getVehicleDutyRate(
  vehicleType: VehicleTypeKey,
  options?: {
    weight?: WeightKey;
    motorcycleEngine?: MotorcycleEngineKey;
    trailerType?: TrailerTypeKey;
    busCapacity?: BusCapacityKey;
    specialPurpose?: SpecialPurposeKey;
  },
): number {
  const typeInfo = VEHICLE_TYPES[vehicleType];

  // Handle types that depend on sub-options
  if (vehicleType === 'singleCab' || vehicleType === 'panelVan') {
    if (options?.weight) {
      return WEIGHT_OPTIONS[options.weight].dutyRate;
    }
    return 0.25; // Default to under 800kg rate
  }

  if (vehicleType === 'motorcycle') {
    if (options?.motorcycleEngine) {
      return MOTORCYCLE_ENGINE_OPTIONS[options.motorcycleEngine].dutyRate;
    }
    return 0.1; // Default to under 250cc rate
  }

  if (vehicleType === 'trailer') {
    if (options?.trailerType) {
      return TRAILER_TYPES[options.trailerType].dutyRate;
    }
    return 0.2; // Default
  }

  if (vehicleType === 'bus') {
    if (options?.busCapacity) {
      return BUS_CAPACITY_OPTIONS[options.busCapacity].dutyRate;
    }
    return 0.15; // Default to 15-20 passengers rate
  }

  return typeInfo.dutyRate;
}

export function canVehicleBeBanned(vehicleType: VehicleTypeKey): boolean {
  return VEHICLE_TYPES[vehicleType].canBeBanned;
}

export function vehicleHasSurtax(vehicleType: VehicleTypeKey): boolean {
  return VEHICLE_TYPES[vehicleType].hasSurtax;
}

export function getLicenceRequirement(
  vehicleType: VehicleTypeKey,
  yearOfManufacture: number,
): string {
  const vehicleAge = CURRENT_YEAR - yearOfManufacture;

  // Check if vehicle is banned (10+ years old and can be banned)
  if (vehicleAge >= BAN_AGE_THRESHOLD && canVehicleBeBanned(vehicleType)) {
    return 'VEHICLE BANNED';
  }

  return 'No need for licence';
}

export function getSurtaxStatus(
  vehicleType: VehicleTypeKey,
  yearOfManufacture: number,
): { applies: boolean; message: string } {
  // Check if vehicle type is exempt from surtax
  if (!vehicleHasSurtax(vehicleType)) {
    return {
      applies: false,
      message: 'No Surtax is charged on such a Vehicle',
    };
  }

  const vehicleAge = CURRENT_YEAR - yearOfManufacture;

  if (vehicleAge <= SURTAX_AGE_THRESHOLD) {
    return {
      applies: false,
      message: 'No Surtax (vehicle less than 5 years old)',
    };
  }

  return {
    applies: true,
    message: 'Surtax = Value for Duty Purposes × 35%',
  };
}

// Goods Categories
export const GOODS_CATEGORIES = {
  buildersWare: { label: 'Builders ware', value: 'buildersWare' },
  chemicalProducts: { label: 'Chemical products', value: 'chemicalProducts' },
  clothing: {
    label: 'Clothing, Footwear and Household Linen',
    value: 'clothing',
  },
  electronics: { label: 'Electronic Equipment', value: 'electronics' },
  groceries: { label: 'Groceries', value: 'groceries' },
  householdItems: { label: 'Household Items', value: 'householdItems' },
  machinery: {
    label: 'Machinery and Mechanical appliances',
    value: 'machinery',
  },
  stationery: { label: 'Stationery and toys', value: 'stationery' },
  toiletries: {
    label: 'Toiletries and Sanitary ware',
    value: 'toiletries',
  },
  vehicleParts: { label: 'Vehicle parts', value: 'vehicleParts' },
} as const;

export type GoodsCategoryKey = keyof typeof GOODS_CATEGORIES;

export type GoodsSubcategory = {
  label: string;
  value: string;
  dutyRate: number;
  perUnit?: { rate: number; unit: string };
  hasSurtax?: boolean;
  maxRate?: { percentage: number; fixed: number; perUnit: string }; // For "maximum of X% or $Y/unit"
  fixedRate?: { amount: number; perUnit: string }; // For "$X/unit" only
  hasThreshold?: boolean; // For flour and salt that need weight threshold selection
  thresholdOptions?: {
    lessThan50kg: { dutyRate: number; label: string };
    moreThan50kg: { dutyRate: number; label: string };
  };
  needsWeight?: boolean; // For items that need weight input (soap, cement, etc.)
};

export const GOODS_SUBCATEGORIES: Record<GoodsCategoryKey, GoodsSubcategory[]> =
  {
    groceries: [
      {
        label: 'Bread, buns, rolls and Wafers',
        value: 'bread',
        dutyRate: 0.4,
      },
      {
        label: 'Cereals',
        value: 'cereals',
        dutyRate: 0.4,
        perUnit: { rate: 1, unit: 'kg' },
      },
      {
        label: 'Cooking oil',
        value: 'cookingOil',
        dutyRate: 0.4,
        maxRate: { percentage: 0.4, fixed: 0.5, perUnit: 'litre' },
        perUnit: { rate: 0.5, unit: 'litre' },
      },
      {
        label: 'Crude soya bean oil',
        value: 'crudeSoyaBeanOil',
        dutyRate: 0.05,
      },
      {
        label: 'Soft Drinks',
        value: 'softDrinks',
        dutyRate: 0,
        perUnit: { rate: 0.5, unit: 'litre' },
      },
      {
        label: 'Flour',
        value: 'flour',
        dutyRate: 0.1,
        hasThreshold: true,
        thresholdOptions: {
          lessThan50kg: { dutyRate: 0.1, label: 'Less than 50kg' },
          moreThan50kg: { dutyRate: 0.2, label: '50kg or more' },
        },
      },
      { label: 'Infant Porridge', value: 'infantPorridge', dutyRate: 0.1 },
      { label: 'Jam', value: 'jam', dutyRate: 0.4 },
      { label: 'Maheu', value: 'maheu', dutyRate: 0.85 },
      { label: 'Margarine', value: 'margarine', dutyRate: 0.4 },
      { label: 'Mineral Water', value: 'mineralWater', dutyRate: 0.85 },
      {
        label: 'Pasta (Macaroni, spaghetti...)',
        value: 'pasta',
        dutyRate: 0.4,
      },
      {
        label: 'Sugar',
        value: 'sugar',
        dutyRate: 0.1,
        fixedRate: { amount: 100, perUnit: 'ton' },
        needsWeight: true,
      },
      {
        label: 'Salt',
        value: 'salt',
        dutyRate: 0.15,
        hasThreshold: true,
        thresholdOptions: {
          lessThan50kg: { dutyRate: 0.15, label: 'Less than 50kg' },
          moreThan50kg: { dutyRate: 0, label: '50kg or more' },
        },
      },
      { label: 'Tomato Sauce', value: 'tomatoSauce', dutyRate: 0.4 },
      { label: 'Yeast', value: 'yeast', dutyRate: 0.4 },
    ],
    clothing: [
      {
        label: 'Blankets',
        value: 'blankets',
        dutyRate: 0.4,
        perUnit: { rate: 1.5, unit: 'kg' },
      },
      {
        label: 'Clothing',
        value: 'clothing',
        dutyRate: 0.4,
        perUnit: { rate: 3, unit: 'kg' },
      },
      {
        label: 'Curtains',
        value: 'curtains',
        dutyRate: 0.4,
        perUnit: { rate: 1.5, unit: 'pair' },
      },
      {
        label: 'Footwear',
        value: 'footwear',
        dutyRate: 0.4,
        perUnit: { rate: 1.0, unit: 'pair' },
      },
      { label: 'Hats', value: 'hats', dutyRate: 0.4 },
      {
        label: 'Sheets',
        value: 'sheets',
        dutyRate: 0.4,
        perUnit: { rate: 1.5, unit: 'kg' },
      },
      { label: 'Table cloths', value: 'tableCloths', dutyRate: 0.4 },
      {
        label: 'Used Clothing',
        value: 'usedClothing',
        dutyRate: 0,
        perUnit: { rate: 5.0, unit: 'kg' },
      },
    ],
    electronics: [
      { label: 'Amplifiers', value: 'amplifiers', dutyRate: 0.4 },
      { label: 'Calculator', value: 'calculator', dutyRate: 0.25 },
      { label: 'CDs and DVDs', value: 'cdsDvds', dutyRate: 0.2 },
      { label: 'Cellphones', value: 'cellphones', dutyRate: 0.25 },
      { label: 'Cellphone parts', value: 'cellphoneParts', dutyRate: 0.05 },
      {
        label: 'Cellphone batteries',
        value: 'cellphoneBatteries',
        dutyRate: 0.2,
      },
      { label: 'Chargers', value: 'chargers', dutyRate: 0 },
      { label: 'Clocks', value: 'clocks', dutyRate: 0.2 },
      { label: 'Computers', value: 'computers', dutyRate: 0 },
      { label: 'Computer software', value: 'computerSoftware', dutyRate: 0 },
      { label: 'External storage', value: 'externalStorage', dutyRate: 0.2 },
      { label: 'Fire alarm', value: 'fireAlarm', dutyRate: 0.05 },
      { label: 'Flash drives', value: 'flashDrives', dutyRate: 0.2 },
      { label: 'Headphones', value: 'headphones', dutyRate: 0.4 },
      { label: 'Internal storage', value: 'internalStorage', dutyRate: 0 },
      { label: 'landline sets', value: 'landlineSets', dutyRate: 0 },
      { label: 'Magnetic cards', value: 'magneticCards', dutyRate: 0.2 },
      { label: 'Memory', value: 'memory', dutyRate: 0.1 },
      { label: 'Microphones', value: 'microphones', dutyRate: 0.4 },
      { label: 'Music keyboard', value: 'musicKeyboard', dutyRate: 0.2 },
      { label: 'Other Alarm', value: 'otherAlarm', dutyRate: 0.25 },
      { label: 'POS machine', value: 'posMachine', dutyRate: 0 },
      { label: 'Processor', value: 'processor', dutyRate: 0.1 },
      {
        label: 'Printed Circuit boards',
        value: 'printedCircuitBoards',
        dutyRate: 0.05,
      },
      {
        label: 'Percussion instruments',
        value: 'percussionInstruments',
        dutyRate: 0.2,
      },
      { label: 'Printer', value: 'printer', dutyRate: 0 },
      { label: 'Router/Switch', value: 'routerSwitch', dutyRate: 0 },
      { label: 'Solar regulator', value: 'solarRegulator', dutyRate: 0.05 },
      { label: 'Smart cards', value: 'smartCards', dutyRate: 0.2 },
      { label: 'Speakers', value: 'speakers', dutyRate: 0.4 },
      { label: 'Tablet', value: 'tablet', dutyRate: 0 },
      { label: 'Watches', value: 'watches', dutyRate: 0.2 },
    ],
    householdItems: [
      { label: 'Coffee maker', value: 'coffeeMaker', dutyRate: 0.3 },
      { label: 'Decoder', value: 'decoder', dutyRate: 0.4 },
      { label: 'Dishwasher', value: 'dishwasher', dutyRate: 0.3 },
      { label: 'Grinders', value: 'grinders', dutyRate: 0.3 },
      { label: 'Dryer', value: 'dryer', dutyRate: 0.3 },
      { label: 'Food Mixers', value: 'foodMixers', dutyRate: 0.3 },
      {
        label: 'Furniture (metal, wood, plastic)',
        value: 'furniture',
        dutyRate: 0.4,
      },
      { label: 'Hair Dryers', value: 'hairDryers', dutyRate: 0.4 },
      { label: 'Iron', value: 'iron', dutyRate: 0.4 },
      { label: 'Juice extractors', value: 'juiceExtractors', dutyRate: 0.3 },
      { label: 'Mattresses', value: 'mattresses', dutyRate: 0.4 },
      { label: 'Microwave', value: 'microwave', dutyRate: 0.4 },
      { label: 'Radio', value: 'radio', dutyRate: 0.4 },
      { label: 'Refridgerators', value: 'refridgerators', dutyRate: 0.65 },
      { label: 'Sewing Machine', value: 'sewingMachine', dutyRate: 0.05 },
      { label: 'Stoves', value: 'stoves', dutyRate: 0.65 },
      { label: 'Televisions', value: 'televisions', dutyRate: 0.4 },
      { label: 'Toasters', value: 'toasters', dutyRate: 0.3 },
      { label: 'Vacuum Cleaners', value: 'vacuumCleaners', dutyRate: 0.3 },
      { label: 'Washing Machine', value: 'washingMachine', dutyRate: 0.3 },
    ],
    buildersWare: [
      { label: 'Bathtubs', value: 'bathtubs', dutyRate: 0.4 },
      { label: 'Bricks', value: 'bricks', dutyRate: 0.15 },
      {
        label: 'Cement',
        value: 'cement',
        dutyRate: 0,
        fixedRate: { amount: 100, perUnit: 'tonne' },
        needsWeight: true,
      },
      { label: 'Cisterns', value: 'cisterns', dutyRate: 0.4 },
      { label: 'Doors', value: 'doors', dutyRate: 0.4 },
      { label: 'Frames', value: 'frames', dutyRate: 0.4 },
      { label: 'Sinks', value: 'sinks', dutyRate: 0.4 },
      { label: 'Steel Roof tiles', value: 'steelRoofTiles', dutyRate: 0.25 },
      { label: 'Steel sheets', value: 'steelSheets', dutyRate: 0.25 },
      { label: 'Tiles', value: 'tiles', dutyRate: 0.15 },
      { label: 'Urinals', value: 'urinals', dutyRate: 0.4 },
      { label: 'Wash basin', value: 'washBasin', dutyRate: 0.4 },
      { label: 'Windows', value: 'windows', dutyRate: 0.4 },
    ],
    chemicalProducts: [
      { label: 'Antifreeze Liquid', value: 'antifreezeLiquid', dutyRate: 0.05 },
      {
        label: 'Chemicals (Mining, Industrial...)',
        value: 'industrialChemicals',
        dutyRate: 0.05,
      },
      {
        label: 'Chemical Fertilizer',
        value: 'chemicalFertilizer',
        dutyRate: 0.05,
      },
      { label: 'Diesel', value: 'diesel', dutyRate: 0.05 },
      { label: 'Enzymes', value: 'enzymes', dutyRate: 0.05 },
      { label: 'Explosives', value: 'explosives', dutyRate: 0.05 },
      { label: 'Fireworks', value: 'fireworks', dutyRate: 0.05 },
      { label: 'Glue', value: 'glue', dutyRate: 0.05 },
      { label: 'Lubricating Oils', value: 'lubricatingOils', dutyRate: 0.05 },
      { label: 'LPG Gas', value: 'lpgGas', dutyRate: 0.05 },
      {
        label: 'Organic Fertilisers',
        value: 'organicFertilisers',
        dutyRate: 0.05,
      },
      { label: 'Paint and Varnish', value: 'paintAndVarnish', dutyRate: 0.05 },
      { label: 'Paraffin', value: 'paraffin', dutyRate: 0.05 },
      { label: 'Petrol', value: 'petrol', dutyRate: 0.05 },
      { label: 'Pesticides', value: 'pesticides', dutyRate: 0.05 },
      { label: 'Polish', value: 'polish', dutyRate: 0.05 },
      { label: 'Printing Ink', value: 'printingInk', dutyRate: 0.05 },
      { label: 'Toner Powder', value: 'tonerPowder', dutyRate: 0.05 },
      { label: 'Wax', value: 'wax', dutyRate: 0.05 },
    ],
    machinery: [
      { label: 'Book binder', value: 'bookBinder', dutyRate: 0 },
      {
        label: 'Bulldozers, graders and loaders',
        value: 'bulldozersGradersLoaders',
        dutyRate: 0,
      },
      { label: 'Coin Scales', value: 'coinScales', dutyRate: 0.2 },
      { label: 'Combine Harvester', value: 'combineHarvester', dutyRate: 0 },
      {
        label: 'Cultivators and weeders',
        value: 'cultivatorsWeeders',
        dutyRate: 0.15,
      },
      { label: 'Dairy Machines', value: 'dairyMachines', dutyRate: 0 },
      { label: 'Disc harrows', value: 'discHarrows', dutyRate: 0.1 },
      { label: 'Electric motor', value: 'electricMotor', dutyRate: 0 },
      { label: 'Generator', value: 'generator', dutyRate: 0 },
      { label: 'Ice cream Machines', value: 'iceCreamMachines', dutyRate: 0.2 },
      {
        label: 'Industrial sewing machine',
        value: 'industrialSewingMachine',
        dutyRate: 0,
      },
      { label: 'lawn mower', value: 'lawnMower', dutyRate: 0 },
      {
        label: 'Lithium Ion Solar Batteries',
        value: 'lithiumIonSolarBatteries',
        dutyRate: 0,
      },
      {
        label: 'Machine for cutting and making paper',
        value: 'machineCuttingMakingPaper',
        dutyRate: 0,
      },
      { label: 'Primary Cells', value: 'primaryCells', dutyRate: 0.2 },
      { label: 'Poultry Incubator', value: 'poultryIncubator', dutyRate: 0 },
      { label: 'Pumps', value: 'pumps', dutyRate: 0.05 },
      {
        label: 'seeders, planters and trasplanters',
        value: 'seedersPlantersTrasplanters',
        dutyRate: 0.05,
      },
      { label: 'Scales', value: 'scales', dutyRate: 0.05 },
      { label: 'Solar Modules', value: 'solarModules', dutyRate: 0 },
      { label: 'Solar Batteries', value: 'solarBatteries', dutyRate: 0.2 },
    ],
    stationery: [
      {
        label: 'Articles of sports',
        value: 'articlesOfSports',
        dutyRate: 0.25,
      },
      { label: 'Children books', value: 'childrenBooks', dutyRate: 0.05 },
      { label: 'Pens', value: 'pens', dutyRate: 0.2 },
      { label: 'Pencil', value: 'pencil', dutyRate: 0.2 },
      { label: 'Toys', value: 'toys', dutyRate: 0.4 },
      { label: 'Textbooks', value: 'textbooks', dutyRate: 0 },
      {
        label: 'Tricycle and electric cars',
        value: 'tricycleElectricCars',
        dutyRate: 0.4,
      },
      { label: 'Video games', value: 'videoGames', dutyRate: 0.4 },
      { label: 'Modelling Paste', value: 'modellingPaste', dutyRate: 0.1 },
    ],
    toiletries: [
      { label: 'Combs and hair slides', value: 'combs', dutyRate: 0.4 },
      {
        label: 'Cosmetic (lipstick, foundation, face powder)',
        value: 'cosmetics',
        dutyRate: 0.4,
      },
      { label: 'Diapers', value: 'diapers', dutyRate: 0 },
      { label: 'Hair Products', value: 'hairProducts', dutyRate: 0.4 },
      { label: 'Lotion', value: 'lotion', dutyRate: 0.4 },
      { label: 'Perfume', value: 'perfume', dutyRate: 0.4 },
      {
        label: 'Sanitary wear (pads etc..)',
        value: 'sanitaryWear',
        dutyRate: 0,
      },
      { label: 'Shampoos', value: 'shampoos', dutyRate: 0.4 },
      {
        label: 'Soap',
        value: 'soap',
        dutyRate: 0.4,
        maxRate: { percentage: 0.4, fixed: 0.5, perUnit: 'kg' },
        needsWeight: true,
      },
      { label: 'Toilet sprays', value: 'toiletSprays', dutyRate: 0.4 },
      { label: 'Toothbrush', value: 'toothbrush', dutyRate: 0.1 },
      { label: 'Toothpaste', value: 'toothpaste', dutyRate: 0.4 },
    ],
    vehicleParts: [
      { label: 'Air Filter', value: 'airFilter', dutyRate: 0.6 },
      { label: 'Bearings', value: 'bearings', dutyRate: 0.05 },
      { label: 'Brakes', value: 'brakes', dutyRate: 0.1 },
      { label: 'Bumper', value: 'bumper', dutyRate: 0.1 },
      { label: 'Car Batteries', value: 'carBatteries', dutyRate: 0.6 },
      { label: 'Diesel engine', value: 'dieselEngine', dutyRate: 0.1 },
      { label: 'Fire extinguisher', value: 'fireExtinguisher', dutyRate: 0.05 },
      { label: 'Fuel Pump', value: 'fuelPump', dutyRate: 0.1 },
      { label: 'Oil/Petrol filters', value: 'oilPetrolFilters', dutyRate: 0.1 },
      { label: 'Spark plugs', value: 'sparkPlugs', dutyRate: 0.1 },
      { label: 'Petrol Engine', value: 'petrolEngine', dutyRate: 0.05 },
      { label: 'Other Car Parts', value: 'otherCarParts', dutyRate: 0.1 },
      { label: 'Radiator', value: 'radiator', dutyRate: 0.1 },
      { label: 'Seat belts', value: 'seatBelts', dutyRate: 0.1 },
      {
        label: 'Suspension (Shock absorbers, springs etc)',
        value: 'suspension',
        dutyRate: 0.1,
      },
      {
        label: 'Transmission shaft',
        value: 'transmissionShaft',
        dutyRate: 0.05,
      },
      { label: 'Toothed wheels', value: 'toothedWheels', dutyRate: 0.05 },
      { label: 'Water Pump', value: 'waterPump', dutyRate: 0.1 },
      { label: 'Windscreens', value: 'windscreens', dutyRate: 0.1 },
      { label: 'Wipers', value: 'wipers', dutyRate: 0.1 },
    ],
  };

export const IMPORTATION_METHODS = {
  air: { label: 'By Air', value: 'air', upliftRate: 0.15 },
  post: { label: 'By Post', value: 'post', upliftRate: 0.15 },
  road: { label: 'By Road', value: 'road', upliftRate: 0.06 },
  rail: { label: 'By Rail', value: 'rail', upliftRate: 0.06 },
} as const;

export type ImportationMethodKey = keyof typeof IMPORTATION_METHODS;

export const NATIONALITY_OPTIONS = {
  zimbabwe: { label: 'Zimbabwe', value: 'zimbabwe' },
  other: { label: 'Other Country', value: 'other' },
} as const;

export const VISA_TYPES = {
  permanentResident: {
    label: 'Permanent Resident',
    value: 'permanentResident',
  },
  employment: { label: 'Employment Visa', value: 'employment' },
  study: { label: 'Study Visa', value: 'study' },
} as const;

export const RETURN_REASONS = {
  studies: { label: 'Completed Studies', value: 'studies' },
  employment: { label: 'End of Employment Contract', value: 'employment' },
  retirement: { label: 'Retirement', value: 'retirement' },
  health: { label: 'Health Reasons', value: 'health' },
  family: { label: 'Family Reasons', value: 'family' },
  other: { label: 'Other', value: 'other' },
} as const;
