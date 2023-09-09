import { useRef, useState } from 'react';

export const useDropdownWithDialog = () => {
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [hasOpenDialog, setHasOpenDialog] = useState(false);
   const dropdownTriggerRef = useRef<any>(null);
   const focusRef = useRef<any>(null);

   function handleDialogItemSelect() {
      focusRef.current = dropdownTriggerRef.current;
   }

   function handleDialogItemOpenChange(open: boolean) {
      setHasOpenDialog(open);
      if (open === false) {
         setDropdownOpen(false);
      }
   }

   return {
      dropdownOpen,
      hasOpenDialog,
      dropdownTriggerRef,
      focusRef,
      handleDialogItemSelect,
      handleDialogItemOpenChange,
   };
};
