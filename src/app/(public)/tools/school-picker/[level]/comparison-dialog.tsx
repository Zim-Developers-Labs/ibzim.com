'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import type { SchoolPickerProfilesType } from '@/types';

interface ComparisonDialogProps {
  selectedSchools: SchoolPickerProfilesType[];
  onRemoveSchool: (schoolId: string) => void;
  onClearAll: () => void;
}

export default function ComparisonDialog({
  selectedSchools,
  onRemoveSchool,
  onClearAll,
}: ComparisonDialogProps) {
  // Don't show dialog if no schools selected
  if (selectedSchools.length === 0) return null;

  // Generate comparison URL
  const generateCompareUrl = () => {
    const slugs = selectedSchools
      .map((school) => school.slug.current)
      .join('-vs-');
    return `/compare/${slugs}`;
  };

  // Create empty slots for up to 4 schools
  const slots = Array.from({ length: 4 }, (_, i) => selectedSchools[i] || null);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-200 bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* School slots */}
          <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {slots.map((school, index) => (
              <Card
                key={index}
                className={`relative flex min-h-[60px] items-center justify-center p-2 md:min-h-[80px] md:p-3 ${
                  school
                    ? 'border-teal-300 bg-teal-50'
                    : 'border-dashed border-zinc-300 bg-zinc-50'
                }`}
              >
                {school ? (
                  <>
                    <button
                      onClick={() => onRemoveSchool(school._id)}
                      className="absolute top-1 right-1 rounded-full bg-white p-1 shadow-sm hover:bg-zinc-100"
                      aria-label="Remove school"
                    >
                      <X className="h-3 w-3 text-zinc-600" />
                    </button>
                    <div className="pr-6 text-center">
                      <p className="line-clamp-2 text-xs font-medium text-zinc-900 md:text-sm">
                        {school.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        {school.location}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-zinc-400 md:text-sm">Empty slot</p>
                )}
              </Card>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 md:flex-col md:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="flex-1 bg-transparent text-xs md:flex-none md:text-sm"
            >
              Clear All
            </Button>
            <Button
              asChild
              size="sm"
              disabled={selectedSchools.length < 2}
              className="flex-1 bg-teal-600 text-xs hover:bg-teal-700 md:flex-none md:text-sm"
            >
              {selectedSchools.length >= 2 ? (
                <Link href={generateCompareUrl()}>
                  Compare ({selectedSchools.length})
                </Link>
              ) : (
                <span>Select 2+ to Compare</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
