import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { ENDPOINTS, ROUTES } from '@/constants';
import Layout from '@/layouts/student';
import { httpServer } from '@/lib/axios';
import { RoleName } from '@/types/role';
import { NextPageWithLayout, TBaseResponse } from '@/types/shared';
import { TUser } from '@/types/user';
import { withUser } from '@/utils/withUser';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
   BarChart,
   Bar,
   Cell,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
   ComposedChart,
   Line,
} from 'recharts';
type Props = {
   user: TUser;
   avgSubjects: Array<{
      averageScore: number;
      subjectId: string;
      subjectName: string;
      studentScore: number;
   }>;
};

const StudentDashboard: NextPageWithLayout<Props> = ({ user, avgSubjects }) => {
   console.log(avgSubjects);
   return (
      <div className="space-y-4">
         <div>
            <h2 className="text-2xl font-semibold ">Student Dashboard</h2>
            <p className="text-muted-foreground">
               Your information will be displayed here. You can edit your
               profile here.
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
                        <span>{user?.student?.name}</span>
                     </span>
                     <span>
                        <span className="font-medium">MSSV: </span>
                        <span>{user?.student?.mssv}</span>
                     </span>
                     <span>
                        <span className="font-medium">Class: </span>
                        <span>{user?.student?.class.name}</span>
                     </span>
                     <span>
                        <span className="font-medium">Address: </span>
                        <span>{user?.student?.address}</span>
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
})(async ({ user, token }) => {
   const mssv = user?.student?.mssv || user?.username;

   const res: TBaseResponse<
      Array<{
         averageScore: number;
         subjectId: string;
         subjectName: string;
         studentScore: number;
      }>
   > = await httpServer.get(`${ENDPOINTS.SUBJECTS}/average-score/${mssv}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   return {
      props: {
         avgSubjects: res.data,
      },
   };
});

export default StudentDashboard;
