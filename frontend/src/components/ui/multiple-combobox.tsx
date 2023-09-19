'use client';

import * as React from 'react';

import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
} from '@/components/ui/command';
import { useSizeEl } from '@/hooks/shared';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
   Badge,
   Button,
   Popover,
   PopoverContent,
   PopoverTrigger,
   ScrollArea,
} from '.';

type TOption = {
   value: string;
   label: string;
};

type Props = {
   values?: TOption[];
   onChange?: (value: TOption[]) => void;
   options: TOption[];
   placeholder?: string;
   defaultValue?: TOption[];
   placeholderEmpty?: string;
   placeholderSearch?: string;
   placeholderSelected?: string;
   width?: string;
   error?: string;
};

export function FancyMultiSelect({
   options,
   defaultValue = [],
   onChange,
   placeholder = 'Select option...',
   placeholderEmpty = 'No option found',
   placeholderSearch = 'Search...',
   placeholderSelected = 'Selected',
   width = '200px',
   values,
   error,
}: Props) {
   const [open, setOpen] = React.useState(false);
   const [selected, setSelected] = React.useState<TOption[]>(defaultValue);
   const {
      size: { width: buttonWidth },
      elRef: buttonRef,
   } = useSizeEl<HTMLButtonElement>();

   const isControlled = React.useMemo(
      () => values !== undefined && onChange !== undefined,
      [values, onChange]
   );

   const selectedOptions = React.useMemo(
      () => (isControlled ? values : selected) || [],
      [isControlled, values, selected]
   );

   const handleUnselect = React.useCallback(
      (option: TOption) => {
         const newSelected = selectedOptions?.filter(
            (s) => s.value !== option.value
         );

         if (!newSelected) return;

         if (isControlled) {
            onChange?.(newSelected);
         } else {
            setSelected(newSelected);
         }
      },
      [selectedOptions, isControlled, onChange]
   );

   const isAlreadySelected = React.useCallback(
      (_option: TOption) => {
         return selectedOptions?.some(
            (option) => option.value === _option.value
         );
      },
      [selectedOptions]
   );

   const handleSelect = React.useCallback(
      (option: TOption) => {
         if (isAlreadySelected(option)) {
            handleUnselect(option);
            setOpen(false);
            return;
         }

         const newSelected = [...selectedOptions, option];

         if (isControlled) {
            onChange?.(newSelected);
         } else {
            setSelected(newSelected);
         }
         setOpen(false);
      },
      [
         handleUnselect,
         selectedOptions,
         isControlled,
         onChange,
         isAlreadySelected,
      ]
   );

   return (
      <Popover open={open} onOpenChange={setOpen} modal>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className={cn('flex items-center justify-between h-[unset]', {
                  'border-destructive': !!error,
               })}
               style={{ width }}
               ref={buttonRef}
            >
               {selectedOptions?.length > 0 ? (
                  selectedOptions.length > 6 ? (
                     <p>
                        {selectedOptions.length} {placeholderSelected}
                     </p>
                  ) : (
                     <div className="flex items-center gap-2 flex-wrap">
                        {selectedOptions.map((option) => {
                           return (
                              <Badge
                                 key={option.value}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnselect(option);
                                 }}
                                 className="text-xs line-clamp-1  whitespace-nowrap"
                              >
                                 {option.label}
                              </Badge>
                           );
                        })}
                     </div>
                  )
               ) : (
                  placeholder
               )}
               <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent
            className="w-[200px] p-0"
            style={{ width: buttonWidth }}
         >
            <Command>
               <CommandInput placeholder={placeholderSearch} className="h-9" />
               <CommandEmpty>{placeholderEmpty}</CommandEmpty>
               <CommandGroup>
                  <ScrollArea
                     className={cn({
                        'h-48': options.length > 6,
                     })}
                  >
                     {options?.map((option) => (
                        <CommandItem
                           key={option.value}
                           onSelect={() => {
                              handleSelect({
                                 value: option.value,
                                 label: option.label,
                              });
                           }}
                        >
                           {option.label}
                           <CheckIcon
                              className={cn(
                                 'ml-auto h-4 w-4 opacity-0 transition-opacity duration-200',
                                 {
                                    'opacity-100': isAlreadySelected(option),
                                 }
                              )}
                           />
                        </CommandItem>
                     ))}
                  </ScrollArea>
               </CommandGroup>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
