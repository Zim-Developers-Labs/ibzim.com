'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MainForm } from './forms';
import { useState } from 'react';

export default function Comments() {
  const [value, setValue] = useState(sortTypes[0]);

  return (
    <div>
      <MainForm />
      <div>
        <SortFilter value={value} setValue={setValue} />
      </div>
    </div>
  );
}

const sortTypes = [
  { value: 2, label: 'Recent' },
  { value: 1, label: 'Best' },
  { value: 3, label: 'Older' },
];

function SortFilter({ value, setValue }: { value: any; setValue: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? sortTypes.find((framework) => framework.value === value)?.label
            : 'Select framework...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {sortTypes.map((sort) => (
          <div className="group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none data-[focus]:bg-yellow-600 data-[focus]:text-white">
            <span className="block w-fit truncate font-normal group-data-[selected]:font-semibold">
              {sort.label}
            </span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
