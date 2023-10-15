import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import { TUser } from '@/types/user';
import { isAdmin } from '@/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';

const NotFound = () => {
   const { user } = useUser();
   const router = useRouter();

   return (
      <>
         <Head>
            <title>404 - Page not found</title>
         </Head>
         <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="space-y-2 flex flex-col items-center">
               <h2 className="text-6xl font-bold text-center">404</h2>
               <p className="text-xl font-medium text-center text-muted-foreground">
                  Page not found
               </p>
               <Button
                  onClick={() => {
                     router.push(
                        isAdmin(user as TUser)
                           ? ROUTES.ADMIN
                           : ROUTES.STUDENT_DASHBOARD
                     );
                  }}
               >
                  Back to home
               </Button>
            </div>
         </div>
      </>
   );
};

export default NotFound;
