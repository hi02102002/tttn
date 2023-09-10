import { useEffect, useState } from 'react';

export const useDebounce = <T = unknown>(value: T, delay = 500) => {
   const [debounce, setDebounce] = useState(value);

   useEffect(() => {
      const timmer = setTimeout(() => {
         setDebounce(value);
      }, delay);

      return () => {
         clearTimeout(timmer);
      };
   }, [value, delay]);

   return debounce;
};
