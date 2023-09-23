import { RowActions, TableToolbar } from '@/components/pages/scores';
import { DataTable, DataTableColumnHeader } from '@/components/ui';
import { useScores } from '@/hooks/api';
import { useFilterName, useSorting } from '@/hooks/shared';
import Layout from '@/layouts/app';
import { httpServer } from '@/lib/axios';
import { TClassroom } from '@/types/class';
import { RoleName } from '@/types/role';
import { TQueryScore, TScore } from '@/types/score';
import { NextPageWithLayout, TBaseResponse } from '@/types/shared';
import { TStudent } from '@/types/student';
import { calcPageCount } from '@/utils';
import { withUser } from '@/utils/withUser';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

type Props = {
   student: TStudent | null;
   classroom: TClassroom | null;
};

const Scores: NextPageWithLayout<Props> = ({ student, classroom }) => {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
   });
   const { setSorting, sorting, sortingObj } = useSorting();
   const { name: name, render: renderSearch } = useFilterName({
      placeholder: 'Search by name student',
   });

   const q: TQueryScore = useMemo(
      () => ({
         limit: pagination.pageSize,
         page: pagination.pageIndex + 1,
         studentName: name,
         orderBy: sortingObj,
         classId: classroom?.id,
         mssv: student?.mssv,
      }),
      [name, sortingObj, pagination, student?.mssv, classroom?.id]
   );

   const { data, isLoading } = useScores(q);

   const columns: ColumnDef<TScore>[] = useMemo(
      () => [
         {
            accessorKey: 'student.mssv',
            id: 'mssv',
            name: 'MSSV',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="MSSV" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.student.mssv}</span>
            ),
         },
         {
            accessorKey: 'student.name',
            id: 'student',
            name: 'Student',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Student" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.student.name}</span>
            ),
         },
         {
            accessorKey: 'subject.name',
            id: 'subject',
            name: 'Subject',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Subject" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.subject.name}</span>
            ),
         },

         {
            accessorKey: 'student.class.name',
            id: 'class',
            name: 'Student class',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Student class" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">
                  {row.original.student.class.name}
               </span>
            ),
         },
         {
            accessorKey: 'score',
            id: 'score',
            name: 'Score',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Score" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">
                  {row.original.score || 'N/A'}
               </span>
            ),
         },
         {
            id: 'actions',
            cell: ({ row }) => {
               return <RowActions row={row} q={q} />;
            },
         },
      ],
      [q]
   );

   return (
      <div className="space-y-4">
         <div>
            <h2 className="text-2xl font-semibold">Manage scores</h2>
            <p className="text-muted-foreground">
               {student
                  ? `All scores of student with MSSV ${student.mssv}`
                  : 'List all scores'}
            </p>
         </div>
         <DataTable
            columns={columns}
            data={data?.scores || []}
            options={{
               manualPagination: true,
               manualSorting: true,
               enableMultiSort: true,
               state: {
                  pagination,
                  sorting,
               },
               onPaginationChange: setPagination,
               onSortingChange: setSorting,
               pageCount: calcPageCount(data?.total || 0, pagination.pageSize),
               isLoading,
            }}
            DataToolbar={(table) => (
               <TableToolbar
                  table={table}
                  q={q}
                  renderFilterName={renderSearch}
                  classroom={classroom as TClassroom}
               />
            )}
         />
      </div>
   );
};

Scores.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.ADMIN],
})(async ({ ctx }) => {
   const mssv = ctx.query.mssv as string;
   const classId = ctx.query.classId as string;

   const getStudent = async () => {
      if (!mssv) {
         return null;
      }

      try {
         const res: TBaseResponse<TStudent> = await httpServer.get(
            `/students/${mssv}`
         );
         return res.data;
      } catch (error) {
         return null;
      }
   };

   const getClass = async () => {
      if (!classId) {
         return null;
      }

      try {
         const res: TBaseResponse<TClassroom> = await httpServer.get(
            `/classes/${classId}`
         );
         return res.data;
      } catch (error) {
         return null;
      }
   };

   const [student, _class] = await Promise.all([
      await getStudent(),
      await getClass(),
   ]);

   return {
      props: {
         student,
         classroom: _class,
      },
   };
});

export default Scores;
