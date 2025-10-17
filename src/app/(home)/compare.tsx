'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { X, Plus, Search, GitCompare } from 'lucide-react';
import { toast } from 'sonner';

// Define the subcategories for profiles
const PROFILE_SUBCATEGORIES = [
  { value: 'primarySchool', label: 'Primary Schools' },
  { value: 'highSchool', label: 'High Schools' },
  { value: 'university', label: 'Universities' },
  { value: 'musician', label: 'Musicians' },
  { value: 'comedian', label: 'Comedians' },
  { value: 'telecomCompany', label: 'Telecom Companies' },
  { value: 'fastFoodRestaurant', label: 'Fast Food Restaurants' },
  { value: 'hotel', label: 'Hotels' },
] as const;

type SubCategory = (typeof PROFILE_SUBCATEGORIES)[number]['value'];

interface Entity {
  id: string;
  name: string;
  subCategory: SubCategory;
}

// Mock data for demonstration - replace with actual Sanity data
const MOCK_ENTITIES: Entity[] = [
  { id: '1', name: 'St. Johns Primary School', subCategory: 'primarySchool' },
  { id: '2', name: 'Avondale Primary School', subCategory: 'primarySchool' },
  { id: '3', name: 'Churchill High School', subCategory: 'highSchool' },
  { id: '4', name: 'Prince Edward High School', subCategory: 'highSchool' },
  { id: '5', name: 'University of Zimbabwe', subCategory: 'university' },
  { id: '6', name: 'NUST', subCategory: 'university' },
  { id: '7', name: 'Jah Prayzah', subCategory: 'musician' },
  { id: '8', name: 'Winky D', subCategory: 'musician' },
  { id: '9', name: 'Comic Pastor', subCategory: 'comedian' },
  { id: '10', name: 'Madam Boss', subCategory: 'comedian' },
  { id: '11', name: 'Econet', subCategory: 'telecomCompany' },
  { id: '12', name: 'NetOne', subCategory: 'telecomCompany' },
  { id: '13', name: 'Chicken Inn', subCategory: 'fastFoodRestaurant' },
  { id: '14', name: 'Nandos', subCategory: 'fastFoodRestaurant' },
  { id: '15', name: 'Meikles Hotel', subCategory: 'hotel' },
  { id: '16', name: 'Rainbow Towers', subCategory: 'hotel' },
];

export default function CompareFeature() {
  const [selectedCategory, setSelectedCategory] = useState<SubCategory | null>(
    null,
  );
  const [selectedEntities, setSelectedEntities] = useState<(Entity | null)[]>([
    null,
    null,
    null,
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter entities based on selected category and search query
  const filteredEntities = MOCK_ENTITIES.filter((entity) => {
    const matchesCategory = selectedCategory
      ? entity.subCategory === selectedCategory
      : false;
    const matchesSearch = entity.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get default results (first 5 entities of selected category)
  const defaultResults = selectedCategory
    ? MOCK_ENTITIES.filter((e) => e.subCategory === selectedCategory).slice(
        0,
        5,
      )
    : [];

  const handleAddEntity = (slotIndex: number) => {
    if (!selectedCategory) {
      toast.error('Please select a category first', {
        description:
          'Choose a category to start adding profiles for comparison',
      });
      return;
    }
    setCurrentSlotIndex(slotIndex);
    setSearchQuery('');
    setIsDialogOpen(true);
  };

  const handleSelectEntity = (entity: Entity) => {
    if (currentSlotIndex !== null) {
      const newEntities = [...selectedEntities];
      newEntities[currentSlotIndex] = entity;
      setSelectedEntities(newEntities);
      setIsDialogOpen(false);
      setCurrentSlotIndex(null);
    }
  };

  const handleRemoveEntity = (slotIndex: number) => {
    const newEntities = [...selectedEntities];
    newEntities[slotIndex] = null;
    setSelectedEntities(newEntities);
  };

  const handleCompare = () => {
    const validEntities = selectedEntities.filter((e) => e !== null);
    if (validEntities.length >= 2) {
      // Navigate to compare page or show comparison
      console.log('Comparing:', validEntities);
      alert(`Comparing: ${validEntities.map((e) => e?.name).join(' vs ')}`);
    }
  };

  const validEntityCount = selectedEntities.filter((e) => e !== null).length;
  const isCompareDisabled = validEntityCount < 2;

  return (
    <li className="col-span-full">
      <Card className="group h-full border border-zinc-200 bg-white p-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
            <div className="rounded-t-lg bg-teal-200 p-6 md:p-8 lg:w-56 lg:shrink-0 lg:rounded-l-lg lg:rounded-tr-none">
              <div className="mb-3 flex items-center gap-2 lg:mb-2">
                <GitCompare className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-zinc-900">Compare</h3>
              </div>

              <p className="mb-4 text-zinc-600 lg:text-sm">
                Select category & add 2-3 profiles
              </p>

              {/* Category Selection */}
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) =>
                  setSelectedCategory(value as SubCategory)
                }
              >
                <SelectTrigger className="w-full cursor-pointer border-zinc-400 shadow-sm">
                  <SelectValue placeholder="Category..." />
                </SelectTrigger>
                <SelectContent>
                  {PROFILE_SUBCATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-4 lg:flex-row lg:gap-2">
              {selectedEntities.map((entity, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex flex-1 items-center justify-between rounded-lg border-2 transition-colors lg:min-w-0',
                    entity
                      ? 'border-zinc-200 bg-zinc-50'
                      : 'border-dashed border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50',
                  )}
                >
                  {entity ? (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900 lg:text-xs">
                          {entity.name}
                        </p>
                        <p className="hidden text-xs text-zinc-500 lg:block">
                          {
                            PROFILE_SUBCATEGORIES.find(
                              (c) => c.value === entity.subCategory,
                            )?.label
                          }
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEntity(index)}
                        className="ml-2 h-6 w-6 shrink-0 p-0 text-zinc-500 hover:text-red-600 lg:h-5 lg:w-5"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleAddEntity(index)}
                      variant="ghost"
                      className="flex w-full items-center justify-center gap-2 py-8 text-sm text-zinc-500 hover:text-zinc-700 lg:text-xs"
                      disabled={!selectedCategory}
                    >
                      <Plus className="h-4 w-4" />
                      <span>
                        {selectedCategory !== null
                          ? 'Add profile'
                          : 'Select category first'}
                      </span>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="px-4 pb-8 lg:w-48 lg:shrink-0 lg:pr-6 lg:pb-0">
              <Button
                onClick={handleCompare}
                disabled={isCompareDisabled}
                className="w-full lg:h-auto lg:py-2"
              >
                <GitCompare className="h-5 w-5" />
                <span className="ml-2 lg:text-xs">Compare</span>
              </Button>

              {isCompareDisabled && (
                <p className="mt-2 text-center text-xs text-zinc-500 lg:hidden">
                  Add at least 2 profiles to enable comparison
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Profile</DialogTitle>
            <DialogDescription>
              Search and select a{' '}
              {selectedCategory &&
                PROFILE_SUBCATEGORIES.find((c) => c.value === selectedCategory)
                  ?.label}{' '}
              to compare
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-y-auto">
            {(searchQuery ? filteredEntities : defaultResults).length > 0 ? (
              <div className="space-y-2">
                {(searchQuery ? filteredEntities : defaultResults).map(
                  (entity) => {
                    const isAlreadySelected = selectedEntities.some(
                      (e) => e?.id === entity.id,
                    );
                    return (
                      <button
                        key={entity.id}
                        onClick={() => handleSelectEntity(entity)}
                        disabled={isAlreadySelected}
                        className={cn(
                          'w-full rounded-lg border p-3 text-left transition-colors',
                          isAlreadySelected
                            ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50'
                            : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50',
                        )}
                      >
                        <p className="text-sm font-medium text-zinc-900">
                          {entity.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {
                            PROFILE_SUBCATEGORIES.find(
                              (c) => c.value === entity.subCategory,
                            )?.label
                          }
                        </p>
                        {isAlreadySelected && (
                          <p className="mt-1 text-xs text-zinc-500">
                            Already selected
                          </p>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-500">
                  {searchQuery ? 'No profiles found' : 'No profiles available'}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </li>
  );
}
