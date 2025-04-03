'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MainForm } from './forms';
import { useState } from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';

export default function Comments() {
  const [value, setValue] = useState(sortTypes[0].value);

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
  { value: 'recent', label: 'Recent' },
  { value: 'best', label: 'Best' },
  { value: 'older', label: 'Older' },
];

function SortFilter({ value, setValue }: { value: any; setValue: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-fit">
        <div className="flex items-center gap-2">
          <div className="text-sm text-zinc-700">Sort By:</div>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="text-primaryColor w-fit justify-between"
          >
            {value
              ? sortTypes.find((framework) => framework.value === value)?.label
              : 'Select framework...'}
            <ChevronsUpDown className="text-zinc-800 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom">
        <Command>
          <CommandList>
            <CommandGroup>
              {sortTypes.map((sort) => (
                <CommandItem
                  key={sort.value}
                  value={sort.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className={`group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none`}
                >
                  <span
                    className={`block w-fit truncate ${sort.value === value && 'font-bold text-white'}`}
                  >
                    {sort.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
