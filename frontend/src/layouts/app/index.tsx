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
                  path: ROUTES.ADMIN,
               },
               {
                  id: uuid(),
                  name: 'Classrooms',
                  path: ROUTES.CLASSROOMS,
               },
               {
                  id: uuid(),
                  name: 'Subjects',
                  path: ROUTES.SUBJECTS,
               },
               {
                  id: uuid(),
                  name: 'Students',
                  path: ROUTES.STUDENTS,
               },
               {
                  id: uuid(),
                  name: 'Scores',
                  path: ROUTES.SCORES,
               },
               {
                  id: uuid(),
                  name: 'Roles',
                  path: ROUTES.ROLES,
               },
               {
                  id: uuid(),
                  name: 'Users',
                  path: ROUTES.USERS,
               },
            ]}
         />
         <main className={cn('container py-4', classNameMain)}>{children}</main>
      </>
   );
};

export default Layout;
