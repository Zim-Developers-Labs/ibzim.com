import { subHours, subDays, subMonths, subYears } from 'date-fns';

// --- TYPES ---
export interface AllFilters {
  timeRange: string;
  customDateFrom?: Date;
  customDateTo?: Date;
  safeSearch: string;
}

export interface ImageFilters extends AllFilters {
  usageRights: string;
  imageType: string;
  size: string;
  exactWidth?: number;
  exactHeight?: number;
}

export interface VideoFilters extends AllFilters {
  duration: string;
  quality: string;
}

export interface NewsFilters extends AllFilters {
  sourceType: string;
}

export type FilterType = 'all' | 'images' | 'videos' | 'news';

// --- DEFAULTS ---
export const defaultAllFilters: AllFilters = {
  timeRange: 'Any time',
  safeSearch: 'Moderate',
};

export const defaultImageFilters: ImageFilters = {
  ...defaultAllFilters,
  usageRights: 'All',
  imageType: 'All types',
  size: 'Any size',
};

export const defaultVideoFilters: VideoFilters = {
  ...defaultAllFilters,
  duration: 'Any duration',
  quality: 'Any quality',
};

export const defaultNewsFilters: NewsFilters = {
  ...defaultAllFilters,
  sourceType: 'All sources',
};

// --- OPTIONS ---
export const timeRangeOptions = [
  'Any time',
  'Past 24 hours',
  'Past week',
  'Past month',
  'Past year',
];
export const newsTimeRangeOptions = [
  'Any time',
  'Past hour',
  'Past 24 hours',
  'Past week',
  'Past month',
];
export const safeSearchOptions = ['Strict', 'Moderate', 'Off'];
export const usageRightsOptions = [
  'All',
  'Creative Commons',
  'Commercial use',
  'Modification allowed',
];
export const imageTypeOptions = [
  'All types',
  'Photo',
  'Clip Art',
  'Line Drawing',
  'Animated',
  'Transparent',
];
export const sizeOptions = ['Any size', 'Large', 'Medium', 'Small', 'Icon'];
export const durationOptions = [
  'Any duration',
  'Short (< 4 min)',
  'Medium (4-20 min)',
  'Long (> 20 min)',
];
export const qualityOptions = ['Any quality', 'HD', '4K'];
export const sourceTypeOptions = ['Credible sources', 'All sources'];

// --- UTILS ---
export function getDateThreshold(
  timeRange: string,
  customDateFrom?: Date,
  customDateTo?: Date,
): { from: Date | null; to: Date | null } {
  const now = new Date();
  switch (timeRange) {
    case 'Past hour':
      return { from: subHours(now, 1), to: now };
    case 'Past 24 hours':
      return { from: subDays(now, 1), to: now };
    case 'Past week':
      return { from: subDays(now, 7), to: now };
    case 'Past month':
      return { from: subMonths(now, 1), to: now };
    case 'Past year':
      return { from: subYears(now, 1), to: now };
    case 'Any time':
      return { from: null, to: null };
    default:
      if (customDateFrom && customDateTo)
        return { from: customDateFrom, to: customDateTo };
      return { from: null, to: null };
  }
}

export function getSafetyThreshold(safeSearch: string): number {
  switch (safeSearch) {
    case 'Strict':
      return 0.9;
    case 'Moderate':
      return 0.5;
    case 'Off':
      return 0;
    default:
      return 0.5;
  }
}
