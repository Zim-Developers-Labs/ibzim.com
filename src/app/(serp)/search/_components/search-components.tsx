import { useState } from 'react';
import {
  Check,
  SlidersHorizontal,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  timeRangeOptions,
  safeSearchOptions,
  usageRightsOptions,
  imageTypeOptions,
  sizeOptions,
  durationOptions,
  qualityOptions,
  newsTimeRangeOptions,
  sourceTypeOptions,
  FilterType,
} from './search-config';

// --- Shared Components ---

export function FilterMenuItem({
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

// --- Dialogs ---

export function CustomRangeDialog({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (from: Date, to: Date) => void;
}) {
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom Date Range</DialogTitle>
          <DialogDescription>Select a start and end date.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>From</Label>
            <DatePicker date={from} setDate={setFrom} />
          </div>
          <div className="grid gap-2">
            <Label>To</Label>
            <DatePicker date={to} setDate={setTo} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (from && to) {
                onApply(from, to);
                onOpenChange(false);
              }
            }}
            disabled={!from || !to}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ExactSizeDialog({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (w: number, h: number) => void;
}) {
  const [w, setW] = useState('');
  const [h, setH] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exact Image Size</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="grid gap-2">
            <Label>Width</Label>
            <Input
              type="number"
              value={w}
              onChange={(e) => setW(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Height</Label>
            <Input
              type="number"
              value={h}
              onChange={(e) => setH(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onApply(parseInt(w), parseInt(h));
              onOpenChange(false);
            }}
            disabled={!w || !h}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DatePicker({
  date,
  setDate,
}: {
  date?: Date;
  setDate: (d?: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// --- Dropdowns ---

interface TunerProps {
  filters: any;
  onUpdate: (key: string, val: string) => void;
  onCustomRange: () => void;
  onExactSize?: () => void;
}

export function TunerDropdown({
  type,
  ...props
}: { type: FilterType } & TunerProps) {
  // We can render different sub-menus based on type
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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {type.charAt(0).toUpperCase() + type.slice(1)} Filters
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Time Range (Shared by all) */}
        <FilterSubMenu
          label="Time Range"
          options={type === 'news' ? newsTimeRangeOptions : timeRangeOptions}
          current={props.filters.timeRange}
          onSelect={(v: string) => props.onUpdate('timeRange', v)}
          customAction={props.onCustomRange}
        />

        {/* Type Specifics */}
        {type === 'images' && (
          <>
            <FilterSubMenu
              label="Usage Rights"
              options={usageRightsOptions}
              current={props.filters.usageRights}
              onSelect={(v: string) => props.onUpdate('usageRights', v)}
            />
            <FilterSubMenu
              label="Type"
              options={imageTypeOptions}
              current={props.filters.imageType}
              onSelect={(v: string) => props.onUpdate('imageType', v)}
            />
            <FilterSubMenu
              label="Size"
              options={sizeOptions}
              current={props.filters.size}
              onSelect={(v: string) => props.onUpdate('size', v)}
              customAction={props.onExactSize}
              customLabel="Exact size..."
            />
          </>
        )}

        {type === 'videos' && (
          <>
            <FilterSubMenu
              label="Duration"
              options={durationOptions}
              current={props.filters.duration}
              onSelect={(v: string) => props.onUpdate('duration', v)}
            />
            <FilterSubMenu
              label="Quality"
              options={qualityOptions}
              current={props.filters.quality}
              onSelect={(v: string) => props.onUpdate('quality', v)}
            />
          </>
        )}

        {type === 'news' && (
          <FilterSubMenu
            label="Source Type"
            options={sourceTypeOptions}
            current={props.filters.sourceType}
            onSelect={(v: string) => props.onUpdate('sourceType', v)}
          />
        )}

        <DropdownMenuSeparator />
        <FilterSubMenu
          label="Safe Search"
          options={safeSearchOptions}
          current={props.filters.safeSearch}
          onSelect={(v: string) => props.onUpdate('safeSearch', v)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterSubMenu({
  label,
  options,
  current,
  onSelect,
  customAction,
  customLabel = 'Custom range...',
}: any) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span className="flex-1">{label}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {options.map((opt: string) => (
          <FilterMenuItem
            key={opt}
            label={opt}
            isSelected={current === opt}
            onSelect={() => onSelect(opt)}
          />
        ))}
        {customAction && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={customAction}>
              {customLabel}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
