import { SortingState } from '@tanstack/react-table';
import { useState } from 'react';

export const useSorting = () => {
   const [sorting, setSorting] = useState<SortingState>([]);

   const sortingObj =
      sorting.length > 0
         ? sorting.reduce((acc, { id, desc }) => {
              acc[id] = desc ? 'desc' : 'asc';
              return acc;
           }, {} as Record<string, 'asc' | 'desc'>)
         : {};

   return {
      sorting,
      sortingObj,
      setSorting,
   };
};
