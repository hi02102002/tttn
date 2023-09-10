import Layout from '@/layouts/app';
import { httpServer } from '@/lib/axios';
import { NextPageWithLayout, TBaseResponse } from '@/types/shared';
import { TStudent } from '@/types/student';
import { GetServerSideProps } from 'next';

type Props = {
   student: TStudent | null;
};

const Subjects: NextPageWithLayout<Props> = ({ student }) => {
   return (
      <div className="space-y-4">
         <div>
            <h2 className="text-2xl font-semibold">
               {student ? `All subjects of ${student.mssv}` : 'Manage subjects'}
            </h2>
            <p className="text-muted-foreground">
               {student
                  ? `List of all subjects of student with MSSV ${student.mssv}`
                  : 'List of all subjects'}
            </p>
         </div>
      </div>
   );
};

Subjects.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const studentId = ctx.query.studentId as string;

   if (!studentId) {
      return {
         props: {
            student: null,
         },
      };
   }

   try {
      const res: TBaseResponse<TStudent> = await httpServer.get(
         `/students/${studentId}`
      );

      const student = res.data;

      return {
         props: {
            student: student || null,
         },
      };
   } catch (error) {
      return {
         props: {
            student: null,
         },
      };
   }
};

export default Subjects;
