import { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';
import { Dialog, DialogTrigger, DropdownMenuItem } from '.';

type Props = {
   children: React.ReactNode;
   onSelect?: () => void;
   onOpenChange?: (open: boolean) => void;
   content: React.ReactNode;
} & DropdownMenuItemProps;

export const DropdownItemWithDialog = forwardRef<any, Props>(
   (props, forwardedRef) => {
      const { content, children, onSelect, onOpenChange, ...itemProps } = props;
      return (
         <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger>
               <DropdownMenuItem
                  {...itemProps}
                  ref={forwardedRef}
                  className="DropdownMenuItem"
                  onSelect={(event) => {
                     event.preventDefault();
                     onSelect && onSelect();
                  }}
               >
                  {children}
               </DropdownMenuItem>
            </DialogTrigger>
            {content}
         </Dialog>
      );
   }
);

DropdownItemWithDialog.displayName = 'DropdownItemWithDialog';

export default DropdownItemWithDialog;
