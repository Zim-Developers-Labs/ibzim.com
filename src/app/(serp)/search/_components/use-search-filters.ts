import { useState, useMemo } from 'react';
import { parseISO, isAfter } from 'date-fns';
import { FetchAllEntriesResult } from './actions'; // Ensure this path is correct
import {
  AllFilters,
  ImageFilters,
  VideoFilters,
  NewsFilters,
  FilterType,
  defaultAllFilters,
  defaultImageFilters,
  defaultVideoFilters,
  defaultNewsFilters,
  getDateThreshold,
  getSafetyThreshold,
} from './search-config';

export function useSearchFilters(searchResults: FetchAllEntriesResult | null) {
  // State
  const [allFilters, setAllFilters] = useState<AllFilters>(defaultAllFilters);
  const [imageFilters, setImageFilters] =
    useState<ImageFilters>(defaultImageFilters);
  const [videoFilters, setVideoFilters] =
    useState<VideoFilters>(defaultVideoFilters);
  const [newsFilters, setNewsFilters] =
    useState<NewsFilters>(defaultNewsFilters);

  // Update Helper
  const updateFilter = (type: FilterType, key: string, value: any) => {
    switch (type) {
      case 'all':
        setAllFilters((p) => ({ ...p, [key]: value }));
        break;
      case 'images':
        setImageFilters((p) => ({ ...p, [key]: value }));
        break;
      case 'videos':
        setVideoFilters((p) => ({ ...p, [key]: value }));
        break;
      case 'news':
        setNewsFilters((p) => ({ ...p, [key]: value }));
        break;
    }
  };

  // Getters
  const getFiltersForType = (type: FilterType) => {
    switch (type) {
      case 'images':
        return imageFilters;
      case 'videos':
        return videoFilters;
      case 'news':
        return newsFilters;
      default:
        return allFilters;
    }
  };

  const clearAllFilters = () => setAllFilters(defaultAllFilters);

  const removeFilter = (key: string) => {
    if (key === 'timeRange') {
      setAllFilters((p) => ({
        ...p,
        timeRange: defaultAllFilters.timeRange,
        customDateFrom: undefined,
        customDateTo: undefined,
      }));
    } else if (key === 'safeSearch') {
      setAllFilters((p) => ({
        ...p,
        safeSearch: defaultAllFilters.safeSearch,
      }));
    }
  };

  // Filtering Logic
  const filteredResults = useMemo(() => {
    if (!searchResults?.entries) return searchResults;
    let filtered = [...searchResults.entries];

    // Time Filter
    if (allFilters.timeRange !== 'Any time') {
      const { from, to } = getDateThreshold(
        allFilters.timeRange,
        allFilters.customDateFrom,
        allFilters.customDateTo,
      );
      if (from && to) {
        filtered = filtered.filter((entry) => {
          const dateField = entry.isInternal
            ? entry.updated_at
            : entry.created_at;
          if (!dateField) return true;
          const entryDate =
            typeof dateField === 'string' ? parseISO(dateField) : dateField;
          return isAfter(entryDate, from) && isAfter(to, entryDate);
        });
      }
    }

    // Safety Filter
    const threshold = getSafetyThreshold(allFilters.safeSearch);
    if (threshold > 0) {
      filtered = filtered.filter(
        (entry) => (entry.safetyScore ?? 1.0) >= threshold,
      );
    }

    return { ...searchResults, entries: filtered };
  }, [searchResults, allFilters]);

  const hasActiveFilters =
    allFilters.timeRange !== defaultAllFilters.timeRange ||
    allFilters.safeSearch !== defaultAllFilters.safeSearch;

  return {
    allFilters,
    imageFilters,
    videoFilters,
    newsFilters,
    filteredResults,
    updateFilter,
    getFiltersForType,
    clearAllFilters,
    removeFilter,
    hasActiveFilters,
    setExactSize: (width: number, height: number) =>
      setImageFilters((p) => ({
        ...p,
        size: `${width} x ${height}`,
        exactWidth: width,
        exactHeight: height,
      })),
  };
}
