import { Header } from '@/components/shared';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import { v4 as uuid } from 'uuid';

type Props = {
   children: React.ReactNode;
   classNameMain?: string;
};

const Layout = ({ classNameMain, children }: Props) => {
   return (
      <>
         <Header
            items={[
               {
                  id: uuid(),
                  name: 'Home',
                  path: ROUTES.STUDENT_DASHBOARD,
               },
               {
                  id: uuid(),
                  name: 'Register subject',
                  path: ROUTES.STUDENT_REGISTER_SUBJECTS,
               },
            ]}
         />
         <main className={cn('container py-4', classNameMain)}>{children}</main>
      </>
   );
};

export default Layout;
