import { useDisclosure } from '@/hooks/shared';

import {
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui';
import { ReactNode } from 'react';

type Props = {
   title?: string;
   description?: string;
   onConfirm?: (onClose?: () => void) => void;
   children: React.ReactNode;
   textConfirm?: string;
   textCancel?: string;
   type?: 'destructive' | 'default';
   message?: string | ReactNode;
};

export const ConfirmDialog = ({
   message,
   title = 'Confirm',
   children,
   textConfirm = 'Confirm',
   textCancel = 'Cancel',
   type = 'default',
   description,
   onConfirm,
}: Props) => {
   const [isOpen, { onChange, onClose }] = useDisclosure();
   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               {description && (
                  <DialogDescription>{description}</DialogDescription>
               )}
            </DialogHeader>
            {message && <p className="text-muted-foreground">{message}</p>}
            <DialogHeader>
               <Button variant="outline" onClick={onClose}>
                  {textCancel}
               </Button>
               <Button variant={type} onClick={() => onConfirm?.(onClose)}>
                  {textConfirm}
               </Button>
            </DialogHeader>
         </DialogContent>
      </Dialog>
   );
};

export default ConfirmDialog;
