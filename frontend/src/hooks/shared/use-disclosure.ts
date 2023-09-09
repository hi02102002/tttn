import { useCallback, useState } from 'react';

type TDisclosureProps = {
   isOpen?: boolean;
   callback?: {
      open?: () => void;
      close?: () => void;
   };
};

export const useDisclosure = (props?: TDisclosureProps) => {
   const { isOpen: defaultIsOpen = false, callback } = props || {};

   const [isOpen, setIsOpen] = useState(defaultIsOpen);

   const handleOpen = useCallback(() => {
      setIsOpen(true);
      callback?.open?.();
   }, [callback]);

   const handleClose = useCallback(() => {
      setIsOpen(false);
      callback?.close?.();
   }, [callback]);

   const handleToggle = useCallback(() => {
      if (isOpen) {
         handleClose();
      } else {
         handleOpen();
      }
   }, [handleClose, handleOpen, isOpen]);

   const handleChange = useCallback((value: boolean) => {
      setIsOpen(value);
   }, []);

   return [
      isOpen,
      {
         onOpen: handleOpen,
         onClose: handleClose,
         onToggle: handleToggle,
         onChange: handleChange,
      },
   ] as const;
};
