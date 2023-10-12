import * as React from 'react';

import { useDisclosure } from '@/hooks/shared';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
   extends React.InputHTMLAttributes<HTMLInputElement> {
   error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
   ({ className, type, error, ...props }, ref) => {
      const [_type, setType] = React.useState(type);
      const [isShow, { onToggle }] = useDisclosure({
         callback: {
            close() {
               setType(type);
            },
            open() {
               setType('text');
            },
         },
      });
      if (type === 'password') {
         return (
            <div
               className={cn(
                  'flex gap-3 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                  className,
                  {
                     'border-red-500 focus-within:ring-destructive':
                        Boolean(error),
                  }
               )}
            >
               <input
                  type={_type}
                  className="w-full bg-transparent outline-none border-none"
                  ref={ref}
                  {...props}
               />
               <div
                  className="cursor-pointer h-full flex items-center justify-center"
                  onClick={onToggle}
               >
                  {isShow ? (
                     <EyeOff className="w-4 h-4" />
                  ) : (
                     <Eye className="w-4 h-4" />
                  )}
               </div>
            </div>
         );
      }

      return (
         <input
            type={type}
            className={cn(
               'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
               className,
               {
                  'border-red-500 focus-visible:ring-red-500 dark:focus-visible:ring-red-500':
                     Boolean(error),
               }
            )}
            ref={ref}
            {...props}
         />
      );
   }
);
Input.displayName = 'Input';

export { Input };
