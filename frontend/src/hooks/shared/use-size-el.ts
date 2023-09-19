import { useLayoutEffect, useRef, useState } from 'react';

export const useSizeEl = <T extends HTMLElement = HTMLElement>() => {
   const elRef = useRef<T | null>(null);
   const [size, setSize] = useState({ width: 0, height: 0 });

   const updateSize = () => {
      if (elRef.current) {
         const { width, height } = elRef.current.getBoundingClientRect();
         setSize({ width, height });
      }
   };

   useLayoutEffect(() => {
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
   }, []);

   return { elRef, size };
};
