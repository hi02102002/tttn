import { SectionCard, TSectionCard } from '@/components/pages/admin-dashboard';
import { ROUTES } from '@/constants';
import Layout from '@/layouts/app';
import { RoleName } from '@/types/role';
import { NextPageWithLayout } from '@/types/shared';
import { withUser } from '@/utils/withUser';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { v4 as uuid } from 'uuid';

const items: TSectionCard[] = [
   {
      name: 'Classrooms',
      description:
         'Manage classrooms, add, edit, delete, view students in each classroom',
      id: uuid(),
      path: ROUTES.CLASSROOMS,
      image: '/images/classroom.png',
   },
   {
      name: 'Students',
      description:
         'Manage students, add, edit, delete, view scores of each student',
      id: uuid(),
      path: ROUTES.STUDENTS,
      image: '/images/students.png',
   },
   {
      name: 'Subjects',
      description:
         'Manage subjects, add, edit, delete, view scores of each subject',
      id: uuid(),
      path: ROUTES.SUBJECTS,
      image: '/images/subject.png',
   },
   {
      name: 'Scores',
      description:
         'Manage scores, add, edit, delete, view scores of each student and subject',
      id: uuid(),
      path: ROUTES.SCORES,
      image: '/images/scores.png',
   },
];

const Admin: NextPageWithLayout = () => {
   return (
      <>
         <Head>
            <title>Admin - Dashboard</title>
         </Head>
         <div className="space-y-4">
            <div>
               <h2 className="text-2xl font-semibold">Admin</h2>
               <p className="text-muted-foreground">
                  Here you can manage your classrooms, students, subjects and
                  their scores
               </p>
            </div>

            <ul className="md:grid-cols-2 gap-4 grid">
               {items.map((item) => (
                  <li key={item.id}>
                     <Link href={item.path}>
                        <SectionCard item={item} />
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </>
   );
};

Admin.getLayout = (page) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.ADMIN],
})();
export default Admin;
