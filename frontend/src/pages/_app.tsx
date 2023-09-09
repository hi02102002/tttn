import { ThemeProvider } from '@/contexts/theme.ctx';
import '@/styles/globals.css';
import { AppPropsWithLayout } from '@/types/shared';
import {
   Hydrate,
   QueryClient,
   QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextNProgress from 'nextjs-progressbar';
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }: AppPropsWithLayout) {
   const [queryClient] = useState(() => new QueryClient());
   const getLayout = Component.getLayout ?? ((page) => page);
   return (
      <>
         <NextNProgress
            options={{
               showSpinner: false,
            }}
            height={2}
            color="hsl(var(--primary))"
         />
         <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
               <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
               >
                  <Toaster position="top-center" theme="light" />
                  {getLayout(<Component {...pageProps} />)}
               </ThemeProvider>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </>
   );
}
