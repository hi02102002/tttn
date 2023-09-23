import { RowActions, TableToolbar } from '@/components/pages/subjects';
import { DataTable, DataTableColumnHeader } from '@/components/ui';
import { useSubjects } from '@/hooks/api';
import { useFilterName, useSorting } from '@/hooks/shared';
import Layout from '@/layouts/app';
import { RoleName } from '@/types/role';
import { NextPageWithLayout } from '@/types/shared';
import { TSubject, TSubjectQuery } from '@/types/subject';
import { calcPageCount } from '@/utils';
import { withUser } from '@/utils/withUser';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';

const Subjects: NextPageWithLayout = () => {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
   });
   const { setSorting, sorting, sortingObj } = useSorting();
   const { name: filterName, render: renderFilterName } = useFilterName({
      placeholder: 'Search by name',
   });

   const q: TSubjectQuery = useMemo(
      () => ({
         name: filterName,
         orderBy: sortingObj,
         limit: pagination.pageSize,
         page: pagination.pageIndex + 1,
      }),
      [filterName, sortingObj, pagination]
   );

   const { data, isLoading } = useSubjects(q);

   const columns: ColumnDef<TSubject>[] = useMemo(
      () => [
         {
            accessorKey: 'id',
            id: 'checkbox',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Id" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.id}</span>
            ),
            enableSorting: false,
            enableHiding: false,
         },
         {
            accessorKey: 'name',
            id: 'name',
            name: 'Subject',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Subject" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.name}</span>
            ),
         },
         {
            accessorKey: 'numCredits',
            id: 'numCredits',
            name: 'Number of credits',
            header: ({ column }) => (
               <DataTableColumnHeader
                  column={column}
                  title="Number of credits"
               />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.numCredits}</span>
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
            <h2 className="text-2xl font-semibold">Manage subjects</h2>
            <p className="text-muted-foreground">List of all subjects</p>
         </div>
         <DataTable
            columns={columns}
            data={data?.subjects || []}
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
                  renderFilterName={renderFilterName}
                  q={q}
               />
            )}
         />
      </div>
   );
};

Subjects.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.ADMIN],
})();

export default Subjects;
