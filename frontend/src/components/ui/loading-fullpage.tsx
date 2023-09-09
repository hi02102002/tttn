type Props = {};
import * as Portal from '@radix-ui/react-portal';
import { IconLoader2 } from '@tabler/icons-react';
import { useEffect } from 'react';

export const LoadingFullpage = () => {
   useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
         document.body.style.overflow = 'unset';
      };
   }, []);

   return (
      <Portal.Root className="fixed inset-0 z-[100] h-screen flex items-center justify-center">
         <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
         <IconLoader2 className="animate-spin relative z-[60]" />
      </Portal.Root>
   );
};

export default LoadingFullpage;
