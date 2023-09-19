import { Button, Input } from '@/components/ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useDebounce } from '.';

type TProps = {
   placeholder?: string;
};

export const useFilterName = (props?: TProps) => {
   const [name, setName] = useState('');
   const debounced = useDebounce(name, 800);
   const { placeholder } = props || {};

   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
   };

   const render = () => {
      return (
         <div className="flex space-x-2">
            <Input
               placeholder={placeholder || 'Search'}
               className="w-[150px] lg:w-[250px]"
               value={name}
               onChange={handleNameChange}
            />
            {name && (
               <Button
                  variant="ghost"
                  className="h-8 px-2 lg:px-3"
                  onClick={() => setName('')}
               >
                  Reset
                  <Cross2Icon className="ml-2 h-4 w-4" />
               </Button>
            )}
         </div>
      );
   };

   return {
      name: debounced,
      render,
   };
};
