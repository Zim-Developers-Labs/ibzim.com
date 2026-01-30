'use client';

import { useState } from 'react';
import SERPHeader from './header';
import { useUser } from '@/hooks/user-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal, Calendar, Check } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Filter state types
interface AllFilters {
  timeRange: string;
  customDateFrom?: Date;
  customDateTo?: Date;
  safeSearch: string;
}

interface ImageFilters extends AllFilters {
  usageRights: string;
  imageType: string;
  size: string;
  exactWidth?: number;
  exactHeight?: number;
}

interface VideoFilters extends AllFilters {
  duration: string;
  quality: string;
}

interface NewsFilters extends AllFilters {
  sourceType: string;
}

// Default filter values
const defaultAllFilters: AllFilters = {
  timeRange: 'Any time',
  safeSearch: 'Moderate',
};

const defaultImageFilters: ImageFilters = {
  ...defaultAllFilters,
  usageRights: 'All',
  imageType: 'All types',
  size: 'Any size',
};

const defaultVideoFilters: VideoFilters = {
  ...defaultAllFilters,
  duration: 'Any duration',
  quality: 'Any quality',
};

const defaultNewsFilters: NewsFilters = {
  ...defaultAllFilters,
  sourceType: 'All sources',
};

// Reusable menu item with checkmark
function FilterMenuItem({
  label,
  isSelected,
  onSelect,
}: {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={cn(
        isSelected && 'bg-yellow-50 font-medium dark:bg-yellow-800',
      )}
    >
      <span className="flex-1">{label}</span>
      {isSelected && (
        <Check className="ml-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      )}
    </DropdownMenuItem>
  );
}

export default function SERPageComponents({
  q,
  type,
}: {
  q: string;
  type?: string;
}) {
  const { user } = useUser();

  // Filter states
  const [allFilters, setAllFilters] = useState<AllFilters>(defaultAllFilters);
  const [imageFilters, setImageFilters] =
    useState<ImageFilters>(defaultImageFilters);
  const [videoFilters, setVideoFilters] =
    useState<VideoFilters>(defaultVideoFilters);
  const [newsFilters, setNewsFilters] =
    useState<NewsFilters>(defaultNewsFilters);

  // Custom dialogs state
  const [customRangeOpen, setCustomRangeOpen] = useState(false);
  const [exactSizeOpen, setExactSizeOpen] = useState(false);
  const [tempDateFrom, setTempDateFrom] = useState<Date | undefined>();
  const [tempDateTo, setTempDateTo] = useState<Date | undefined>();
  const [tempWidth, setTempWidth] = useState<string>('');
  const [tempHeight, setTempHeight] = useState<string>('');
  const [activeFilterType, setActiveFilterType] = useState<
    'all' | 'images' | 'videos' | 'news'
  >('all');

  // Time range options
  const timeRangeOptions = [
    'Any time',
    'Past 24 hours',
    'Past week',
    'Past month',
    'Past year',
  ];
  const newsTimeRangeOptions = [
    'Any time',
    'Past hour',
    'Past 24 hours',
    'Past week',
    'Past month',
  ];

  // Safe search options
  const safeSearchOptions = ['Strict', 'Moderate', 'Off'];

  // Image specific options
  const usageRightsOptions = [
    'All',
    'Creative Commons',
    'Commercial use',
    'Modification allowed',
  ];
  const imageTypeOptions = [
    'All types',
    'Photo',
    'Clip Art',
    'Line Drawing',
    'Animated',
    'Transparent',
  ];
  const sizeOptions = ['Any size', 'Large', 'Medium', 'Small', 'Icon'];

  // Video specific options
  const durationOptions = [
    'Any duration',
    'Short (< 4 min)',
    'Medium (4-20 min)',
    'Long (> 20 min)',
  ];
  const qualityOptions = ['Any quality', 'HD', '4K'];

  // News specific options
  const sourceTypeOptions = ['Credible sources', 'All sources'];

  // Handle custom range dialog
  const openCustomRangeDialog = (
    filterType: 'all' | 'images' | 'videos' | 'news',
  ) => {
    setActiveFilterType(filterType);
    const filters = getFiltersForType(filterType);
    setTempDateFrom(filters.customDateFrom);
    setTempDateTo(filters.customDateTo);
    setCustomRangeOpen(true);
  };

  const applyCustomRange = () => {
    if (tempDateFrom && tempDateTo) {
      const customLabel = `${format(tempDateFrom, 'MMM d, yyyy')} - ${format(tempDateTo, 'MMM d, yyyy')}`;
      updateFilter(activeFilterType, 'timeRange', customLabel);
      updateFilter(activeFilterType, 'customDateFrom', tempDateFrom);
      updateFilter(activeFilterType, 'customDateTo', tempDateTo);
    }
    setCustomRangeOpen(false);
  };

  // Handle exact size dialog
  const openExactSizeDialog = () => {
    setTempWidth(imageFilters.exactWidth?.toString() || '');
    setTempHeight(imageFilters.exactHeight?.toString() || '');
    setExactSizeOpen(true);
  };

  const applyExactSize = () => {
    const width = parseInt(tempWidth);
    const height = parseInt(tempHeight);
    if (width > 0 && height > 0) {
      setImageFilters((prev) => ({
        ...prev,
        size: `${width} x ${height}`,
        exactWidth: width,
        exactHeight: height,
      }));
    }
    setExactSizeOpen(false);
  };

  // Get filters for a specific type
  const getFiltersForType = (
    filterType: 'all' | 'images' | 'videos' | 'news',
  ) => {
    switch (filterType) {
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

  // Update filter helper
  const updateFilter = (
    filterType: 'all' | 'images' | 'videos' | 'news',
    key: string,
    value: string | Date | undefined,
  ) => {
    switch (filterType) {
      case 'all':
        setAllFilters((prev) => ({ ...prev, [key]: value }));
        break;
      case 'images':
        setImageFilters((prev) => ({ ...prev, [key]: value }));
        break;
      case 'videos':
        setVideoFilters((prev) => ({ ...prev, [key]: value }));
        break;
      case 'news':
        setNewsFilters((prev) => ({ ...prev, [key]: value }));
        break;
    }
  };

  const AllTunerDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-yellow-100 hover:dark:bg-yellow-800"
          >
            <SlidersHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 sm:w-48">
          <DropdownMenuLabel>Search Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Time Range</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {timeRangeOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={allFilters.timeRange === option}
                    onSelect={() => updateFilter('all', 'timeRange', option)}
                  />
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openCustomRangeDialog('all')}>
                  Custom range...
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Safe Search</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {safeSearchOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={allFilters.safeSearch === option}
                    onSelect={() => updateFilter('all', 'safeSearch', option)}
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const ImagesTunerDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-yellow-100 hover:dark:bg-yellow-800"
          >
            <SlidersHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 sm:w-48">
          <DropdownMenuLabel>Image Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Time Range</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {timeRangeOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={imageFilters.timeRange === option}
                    onSelect={() => updateFilter('images', 'timeRange', option)}
                  />
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => openCustomRangeDialog('images')}
                >
                  Custom range...
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Usage Rights</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {usageRightsOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={imageFilters.usageRights === option}
                    onSelect={() =>
                      updateFilter('images', 'usageRights', option)
                    }
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Type</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {imageTypeOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={imageFilters.imageType === option}
                    onSelect={() => updateFilter('images', 'imageType', option)}
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Size</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {sizeOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={imageFilters.size === option}
                    onSelect={() =>
                      setImageFilters((prev) => ({
                        ...prev,
                        size: option,
                        exactWidth: undefined,
                        exactHeight: undefined,
                      }))
                    }
                  />
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openExactSizeDialog}>
                  Exact size...
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const VideosTunerDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-yellow-100 hover:dark:bg-yellow-800"
          >
            <SlidersHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 sm:w-48">
          <DropdownMenuLabel>Video Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Time Range</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {timeRangeOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={videoFilters.timeRange === option}
                    onSelect={() => updateFilter('videos', 'timeRange', option)}
                  />
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => openCustomRangeDialog('videos')}
                >
                  Custom range...
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Duration</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {durationOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={videoFilters.duration === option}
                    onSelect={() => updateFilter('videos', 'duration', option)}
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Quality</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {qualityOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={videoFilters.quality === option}
                    onSelect={() => updateFilter('videos', 'quality', option)}
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Safe Search</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {safeSearchOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={videoFilters.safeSearch === option}
                    onSelect={() =>
                      updateFilter('videos', 'safeSearch', option)
                    }
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const NewsTunerDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-yellow-100 hover:dark:bg-yellow-800"
          >
            <SlidersHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 sm:w-48">
          <DropdownMenuLabel>News Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Time Range</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {newsTimeRangeOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={newsFilters.timeRange === option}
                    onSelect={() => updateFilter('news', 'timeRange', option)}
                  />
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openCustomRangeDialog('news')}>
                  Custom range...
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Source Type</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {sourceTypeOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={newsFilters.sourceType === option}
                    onSelect={() => updateFilter('news', 'sourceType', option)}
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1">Safe Search</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {safeSearchOptions.map((option) => (
                  <FilterMenuItem
                    key={option}
                    label={option}
                    isSelected={newsFilters.safeSearch === option}
                    onSelect={() => updateFilter('news', 'safeSearch', option)}
                  />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderTunerDropdown = () => {
    switch (type) {
      case 'all':
        return <AllTunerDropdown />;
      case 'images':
        return <ImagesTunerDropdown />;
      case 'videos':
        return <VideosTunerDropdown />;
      case 'news':
        return <NewsTunerDropdown />;
      default:
        return <AllTunerDropdown />;
    }
  };

  // Custom Range Dialog
  const CustomRangeDialog = () => (
    <Dialog open={customRangeOpen} onOpenChange={setCustomRangeOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom Date Range</DialogTitle>
          <DialogDescription>
            Select a start and end date for your search results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start bg-transparent text-left font-normal',
                    !tempDateFrom && 'text-muted-foreground',
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {tempDateFrom ? (
                    format(tempDateFrom, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={tempDateFrom}
                  onSelect={setTempDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start bg-transparent text-left font-normal',
                    !tempDateTo && 'text-muted-foreground',
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {tempDateTo ? (
                    format(tempDateTo, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={tempDateTo}
                  onSelect={setTempDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setCustomRangeOpen(false)}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={applyCustomRange}
            disabled={!tempDateFrom || !tempDateTo}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Exact Size Dialog
  const ExactSizeDialog = () => (
    <Dialog open={exactSizeOpen} onOpenChange={setExactSizeOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exact Image Size</DialogTitle>
          <DialogDescription>
            Enter the exact width and height in pixels.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                placeholder="e.g., 1920"
                value={tempWidth}
                onChange={(e) => setTempWidth(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 1080"
                value={tempHeight}
                onChange={(e) => setTempHeight(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setExactSizeOpen(false)}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={applyExactSize} disabled={!tempWidth || !tempHeight}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (!type || !type.match(/^(all|images|videos|news)$/)) {
    type = 'all';
  }

  return (
    <>
      <SERPHeader user={user} q={q} />
      <div className="relative w-full bg-zinc-100 dark:bg-zinc-800">
        <div className="from-primaryColor/25 via-secondaryColor/5 flex h-screen w-full flex-col justify-start bg-gradient-to-b to-transparent pt-44 sm:pt-28 dark:from-zinc-800 dark:via-zinc-800">
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="flex max-w-xl items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className={`bg-transparent hover:bg-transparent ${type === 'all' ? 'border border-yellow-200 bg-yellow-100 font-semibold hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800' : 'hover:underline'}`}
                  asChild
                >
                  <Link href={`?q=${q}&type=all`}>All</Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`bg-transparent hover:bg-transparent ${type === 'images' ? 'border border-yellow-200 bg-yellow-100 font-semibold hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800' : 'hover:underline'}`}
                  asChild
                >
                  <Link href={`?q=${q}&type=images`}>Images</Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`bg-transparent hover:bg-transparent ${type === 'videos' ? 'border border-yellow-200 bg-yellow-100 font-semibold hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800' : 'hover:underline'}`}
                  asChild
                >
                  <Link href={`?q=${q}&type=videos`}>Videos</Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`bg-transparent hover:bg-transparent ${type === 'news' ? 'border border-yellow-200 bg-yellow-100 font-semibold hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900 dark:hover:bg-yellow-800' : 'hover:underline'}`}
                  asChild
                >
                  <Link href={`?q=${q}&type=news`}>News</Link>
                </Button>
              </div>
              <div>{renderTunerDropdown()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Dialogs */}
      <CustomRangeDialog />
      <ExactSizeDialog />
    </>
  );
}
