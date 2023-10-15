import { DataTable, DataTableColumnHeader } from '@/components/ui';
import { useUser } from '@/contexts/user.ctx';
import { useScores } from '@/hooks/api';
import { useFilterName, useSorting } from '@/hooks/shared';
import Layout from '@/layouts/student';
import { RoleName } from '@/types/role';
import { TQueryScore, TScore } from '@/types/score';
import { NextPageWithLayout } from '@/types/shared';
import { calcPageCount } from '@/utils';
import { withUser } from '@/utils/withUser';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';

const Scores: NextPageWithLayout = () => {
   const { user } = useUser();
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
         mssv: user?.username,
      }),
      [name, sortingObj, pagination, user?.username]
   );

   const { data, isLoading } = useScores(q);

   const columns: ColumnDef<TScore>[] = useMemo(
      () => [
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
            accessorKey: 'subject.numCredits',
            id: 'numCredits',
            name: 'Number of credits',
            header: ({ column }) => (
               <DataTableColumnHeader
                  column={column}
                  title="Number of credits"
               />
            ),
            cell: ({ row }) => (
               <span className="font-medium">
                  {row.original.subject.numCredits}
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
      ],
      []
   );

   return (
      <>
         <Head>
            <title>Student - Scores</title>
         </Head>
         <div className="space-y-4">
            <div>
               <h2 className="text-2xl font-semibold">Your scores</h2>
               <p className="text-muted-foreground">List of all your scores</p>
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
                  pageCount: calcPageCount(
                     data?.total || 0,
                     pagination.pageSize
                  ),
                  isLoading,
               }}
            />
         </div>
      </>
   );
};

Scores.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.STUDENT],
})();

export default Scores;
