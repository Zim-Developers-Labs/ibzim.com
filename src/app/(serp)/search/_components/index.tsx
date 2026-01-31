'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import SERPHeader from './header';
import ResultsComponent from './results';
import HomeFooter from '@/app/(home)/home-footer';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/user-context';
import { FetchAllEntriesResult } from './actions';

// Refactored Imports
import { FilterType } from './search-config';
import { useSearchFilters } from './use-search-filters';
import {
  TunerDropdown,
  CustomRangeDialog,
  ExactSizeDialog,
} from './search-components';

export default function SERPageComponents({
  searchResults,
  q,
  type = 'all',
  searchId,
}: {
  searchResults: FetchAllEntriesResult | null;
  q: string;
  type?: string;
  searchId: string;
}) {
  const { user } = useUser();
  const validType = (
    type.match(/^(all|images|videos|news)$/) ? type : 'all'
  ) as FilterType;

  // Custom Hook for logic
  const {
    filteredResults,
    allFilters,
    updateFilter,
    getFiltersForType,
    clearAllFilters,
    removeFilter,
    hasActiveFilters,
    setExactSize,
  } = useSearchFilters(searchResults);

  // Dialog State
  const [customRangeOpen, setCustomRangeOpen] = useState(false);
  const [exactSizeOpen, setExactSizeOpen] = useState(false);

  // Active Labels for display
  const activeLabels = [];
  if (allFilters.timeRange !== 'Any time')
    activeLabels.push({
      key: 'timeRange',
      label: 'Time',
      value: allFilters.timeRange,
    });
  if (allFilters.safeSearch !== 'Moderate')
    activeLabels.push({
      key: 'safeSearch',
      label: 'Safe Search',
      value: allFilters.safeSearch,
    });

  return (
    <>
      <SERPHeader user={user} q={q} />
      <div className="relative w-full bg-zinc-100 dark:bg-zinc-800">
        <div className="from-primaryColor/25 via-secondaryColor/5 flex min-h-screen w-full flex-col justify-start bg-gradient-to-b to-transparent pt-44 sm:pt-28 dark:from-zinc-800 dark:via-zinc-800">
          <div className="relative mx-auto mb-4 w-full max-w-7xl px-4 sm:px-8 lg:px-10">
            {/* Tabs & Tuner Row */}
            <div className="flex max-w-xl items-center justify-between">
              <div className="flex items-center">
                {['all', 'images', 'videos', 'news'].map((t) => (
                  <Button
                    key={t}
                    variant="ghost"
                    className={`bg-transparent hover:bg-transparent ${validType === t ? 'border border-yellow-200 bg-yellow-100 font-semibold hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800' : 'hover:underline'}`}
                    asChild
                  >
                    <Link
                      href={`?q=${q}&type=${t}`}
                      onClick={(e) => {
                        if (t !== 'all') {
                          e.preventDefault();
                          toast.info(
                            `${t.charAt(0).toUpperCase() + t.slice(1)} search coming soon!`,
                          );
                        }
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Link>
                  </Button>
                ))}
              </div>

              <TunerDropdown
                type={validType}
                filters={getFiltersForType(validType)}
                onUpdate={(k, v) => updateFilter(validType, k, v)}
                onCustomRange={() => setCustomRangeOpen(true)}
                onExactSize={() => setExactSizeOpen(true)}
              />
            </div>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
              <div className="mt-4 flex max-w-xl flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Filters:
                </span>
                {activeLabels.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => removeFilter(f.key)}
                    className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
                  >
                    <span>
                      {f.label}: {f.value}
                    </span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <ResultsComponent
            results={filteredResults}
            q={q}
            searchId={searchId}
          />
        </div>
      </div>

      <CustomRangeDialog
        open={customRangeOpen}
        onOpenChange={setCustomRangeOpen}
        onApply={(from, to) => {
          const label = `${format(from, 'MMM d, yyyy')} - ${format(to, 'MMM d, yyyy')}`;
          updateFilter(validType, 'timeRange', label);
          updateFilter(validType, 'customDateFrom', from);
          updateFilter(validType, 'customDateTo', to);
        }}
      />

      <ExactSizeDialog
        open={exactSizeOpen}
        onOpenChange={setExactSizeOpen}
        onApply={(w, h) => setExactSize(w, h)}
      />

      <HomeFooter />
    </>
  );
}
