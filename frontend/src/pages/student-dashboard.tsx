import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { ENDPOINTS } from '@/constants';
import { useUser } from '@/contexts/user.ctx';
import Layout from '@/layouts/student';
import http_server from '@/lib/axios/http-server';
import { RoleName } from '@/types/role';
import { NextPageWithLayout, TBaseResponse } from '@/types/shared';
import { TStudent } from '@/types/student';
import { withUser } from '@/utils/withUser';
import { GetServerSideProps } from 'next';
import {
   Bar,
   CartesianGrid,
   ComposedChart,
   Legend,
   Line,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from 'recharts';
type Props = {
   avgSubjects: Array<{
      averageScore: number;
      subjectId: string;
      subjectName: string;
      studentScore: number;
   }>;
   student: TStudent;
};

const StudentDashboard: NextPageWithLayout<Props> = ({
   student,
   avgSubjects,
}) => {
   const { user } = useUser();

   return (
      <div className="space-y-4">
         <div>
            <h2 className="text-2xl font-semibold ">Hello {student?.name}</h2>
            <p className="text-muted-foreground">
               Welcome to the student dashboard
            </p>
         </div>
         <div className="flex flex-col gap-4">
            <div className="space-y-4">
               <h2 className="text-xl font-semibold ">Your information</h2>
               <div className="flex gap-4">
                  <Avatar className="w-24 h-24">
                     <AvatarImage
                        src={user?.avatar?.url}
                        alt={user?.username}
                     />
                     <AvatarFallback>{user?.username}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2 w-full">
                     <span>
                        <span className="font-medium">Name: </span>
                        <span>{student?.name}</span>
                     </span>
                     <span>
                        <span className="font-medium">MSSV: </span>
                        <span>{student?.mssv}</span>
                     </span>
                     <span>
                        <span className="font-medium">Class: </span>
                        <span>{student?.class.name}</span>
                     </span>
                     <span>
                        <span className="font-medium">Address: </span>
                        <span>{student?.address}</span>
                     </span>
                  </div>
               </div>
            </div>
            <div className="space-y-4">
               <h2 className="text-xl font-semibold ">
                  Average score of subjects
               </h2>
               <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <ComposedChart
                        data={avgSubjects}
                        margin={{
                           top: 5,
                           right: 30,
                           left: 20,
                           bottom: 5,
                        }}
                     >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subjectName" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip wrapperClassName="!bg-background rounded !border-border !border-2" />
                        <Legend />
                        <Bar
                           dataKey="averageScore"
                           fill={`hsl(var(--primary))`}
                           name="Average score"
                           barSize={40}
                        />
                        <Line
                           connectNulls
                           type="monotone"
                           dataKey="studentScore"
                           stroke={`hsl(221.2 83.2% 53.3%)`}
                           fill={`hsl(221.2 83.2% 53.3%)`}
                           name="Your score"
                           strokeWidth={2}
                        />
                     </ComposedChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
   );
};

StudentDashboard.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.STUDENT],
})(async ({ user, ctx }) => {
   const mssv = user?.student?.mssv || user?.username;

   const getAvgSubjects = async () => {
      try {
         const res: TBaseResponse<
            Array<{
               averageScore: number;
               subjectId: string;
               subjectName: string;
               studentScore: number;
            }>
         > = await http_server(ctx)(
            `${ENDPOINTS.SUBJECTS}/average-score/${mssv}`
         );

         return res.data;
      } catch (error: any) {
         return [];
      }
   };

   const getStudentById = async () => {
      try {
         const res: TBaseResponse<TStudent> = await http_server(ctx)(
            `${ENDPOINTS.STUDENTS}/${mssv}`
         );

         console.log(res.data);

         return res.data;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   const [avgSubjects, student] = await Promise.all([
      getAvgSubjects(),
      getStudentById(),
   ]);

   return {
      props: {
         student,
         avgSubjects,
      },
   };
});

export default StudentDashboard;
