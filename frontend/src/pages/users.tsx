import { RowActions, TableToolbar } from '@/components/pages/users';
import { DataTable, DataTableColumnHeader } from '@/components/ui';
import { useUsers } from '@/hooks/api';
import { useFilterName, useSorting } from '@/hooks/shared';
import Layout from '@/layouts/app';
import { RoleName } from '@/types/role';
import { NextPageWithLayout } from '@/types/shared';
import { TQueryUser, TUser } from '@/types/user';
import { calcPageCount } from '@/utils';
import { withUser } from '@/utils/withUser';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';

const Users: NextPageWithLayout = () => {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
   });
   const { setSorting, sorting, sortingObj } = useSorting();
   const { name: filterName, render: renderFilterName } = useFilterName({
      placeholder: 'Search by name',
   });

   const q: TQueryUser = useMemo(
      () => ({
         orderBy: sortingObj,
         limit: pagination.pageSize,
         page: pagination.pageIndex + 1,
         fullName: filterName,
         username: filterName,
      }),
      [filterName, sortingObj, pagination]
   );

   const { data, isLoading } = useUsers(q);
   const columns: ColumnDef<TUser>[] = useMemo(
      () => [
         {
            accessorKey: 'username',
            id: 'username',
            name: 'Username',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Username" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.username}</span>
            ),
         },
         {
            accessorKey: 'fullName',
            id: 'fullName',
            name: 'Full name',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Full name" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.fullName}</span>
            ),
         },

         {
            accessorKey: 'status',
            id: 'status',
            name: 'Status',
            header: ({ column }) => {
               return <DataTableColumnHeader column={column} title="Status" />;
            },
            cell: ({ row }) => {
               return (
                  <span className="font-medium">{row.original.status}</span>
               );
            },
         },
         {
            accessorKey: 'role',
            id: 'role',
            name: 'Role',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Roles" />
            ),
            cell: ({ row }) => {
               return (
                  <span className="font-medium">
                     {row.original.usersRoles
                        .map((role) => role.role.name)
                        .join(', ')}
                  </span>
               );
            },
            enableSorting: false,
         },
         {
            accessorKey: 'actions',
            id: 'actions',
            name: 'Actions',
            header: ({ column }) => {
               return <DataTableColumnHeader column={column} title="Actions" />;
            },
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => {
               return <RowActions row={row} q={q} />;
            },
         },
      ],
      [q]
   );

   return (
      <>
         <Head>
            <title>Manage users</title>
         </Head>
         <div className="space-y-4">
            <div>
               <h2 className="text-2xl font-semibold">Manage users</h2>
               <p className="text-muted-foreground">
                  Manage users of the system here.
               </p>
            </div>
            <DataTable
               columns={columns}
               data={data?.users || []}
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
               DataToolbar={(table) => (
                  <TableToolbar
                     renderFilterName={renderFilterName}
                     table={table}
                  />
               )}
            />
         </div>
      </>
   );
};

Users.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.ADMIN],
})();

export default Users;
