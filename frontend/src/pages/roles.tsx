import { RowActions, TableToolbar } from '@/components/pages/roles';
import { DataTable, DataTableColumnHeader } from '@/components/ui';
import { useRoles } from '@/hooks/api';
import { useSorting } from '@/hooks/shared';
import Layout from '@/layouts/app';
import { TRole, TRoleQuery } from '@/types/role';
import { NextPageWithLayout } from '@/types/shared';
import { calcPageCount } from '@/utils';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

const Roles: NextPageWithLayout = () => {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
   });
   const { setSorting, sorting, sortingObj } = useSorting();

   const q: TRoleQuery = useMemo(
      () => ({
         orderBy: sortingObj,
         limit: pagination.pageSize,
         page: pagination.pageIndex + 1,
      }),
      [sortingObj, pagination]
   );

   const { data, isLoading } = useRoles(q);

   const columns: ColumnDef<TRole>[] = useMemo(
      () => [
         {
            accessorKey: 'id',
            header: 'Id',
            name: 'Id',
            cell: ({ row }) => (
               <span className="font-medium">{row.original.id}</span>
            ),
         },
         {
            accessorKey: 'name',
            id: 'name',
            name: 'Name',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.name}</span>
            ),
         },
      ],
      []
   );

   return (
      <div className="space-y-4">
         <div>
            <h2 className="text-2xl font-semibold">Manage roles</h2>
            <p className="text-muted-foreground">Manage list of roles</p>
         </div>
         <DataTable
            columns={columns}
            data={data?.roles || []}
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
            DataToolbar={(table) => <TableToolbar table={table} q={q} />}
         />
      </div>
   );
};

Roles.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export default Roles;
