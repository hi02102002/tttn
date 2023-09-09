import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { IconLoader2 } from '@tabler/icons-react';

const buttonVariants = cva(
   'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50',
   {
      variants: {
         variant: {
            default:
               'bg-primary text-primary-foreground shadow hover:bg-primary/90',
            destructive:
               'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
            outline:
               'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
            secondary:
               'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
         },
         size: {
            default: 'h-9 px-4 py-2',
            sm: 'h-8 rounded-md px-3 text-xs',
            lg: 'h-10 rounded-md px-8',
            icon: 'h-9 w-9',
         },
      },
      defaultVariants: {
         variant: 'default',
         size: 'default',
      },
   }
);

export interface ButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
   asChild?: boolean;
   loading?: boolean;
   leftIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   (
      {
         className,
         variant,
         size,
         asChild = false,
         children,
         loading,
         leftIcon,
         disabled,
         ...props
      },
      ref
   ) => {
      const Comp = asChild ? Slot : 'button';
      return (
         <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            disabled={disabled || loading}
            {...props}
         >
            {!loading && leftIcon ? (
               <div className="mr-2">{leftIcon}</div>
            ) : null}

            {loading && <IconLoader2 className="w-5 h-5 mr-2 animate-spin" />}
            {children}
         </Comp>
      );
   }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
