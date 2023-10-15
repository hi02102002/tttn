import { RowActions, TableToolbar } from '@/components/pages/students';
import {
   Checkbox,
   DataTable,
   DataTableColumnHeader,
   LoadingFullpage,
} from '@/components/ui';
import { useDeleteStudents, useStudents } from '@/hooks/api';
import { useFilterName, useSorting } from '@/hooks/shared';
import Layout from '@/layouts/app';
import http_server from '@/lib/axios/http-server';
import { TClassroom } from '@/types/class';
import { RoleName } from '@/types/role';
import { NextPageWithLayout, TBaseResponse } from '@/types/shared';
import { TQueryStudent, TStudent } from '@/types/student';
import { calcPageCount } from '@/utils';
import { withUser } from '@/utils/withUser';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';

type Props = {
   classroom: TClassroom | null;
};

const Students: NextPageWithLayout<Props> = ({ classroom }) => {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
   });
   const { setSorting, sorting, sortingObj } = useSorting();
   const { name: filterName, render: renderFilterName } = useFilterName({
      placeholder: 'Search by name',
   });

   const q: TQueryStudent = useMemo(
      () => ({
         name: filterName,
         orderBy: sortingObj,
         limit: pagination.pageSize,
         page: pagination.pageIndex + 1,
         classId: classroom?.id,
      }),
      [filterName, sortingObj, pagination, classroom?.id]
   );

   const { data, isLoading } = useStudents(q);
   const { mutateAsync: deleteStudents, isLoading: isDeletingStudents } =
      useDeleteStudents(q);

   const columns: ColumnDef<TStudent>[] = useMemo(
      () => [
         {
            accessorKey: 'mssv',
            id: 'checkbox',
            header: ({ table }) => (
               <Checkbox
                  checked={table.getIsAllPageRowsSelected()}
                  onCheckedChange={(value) =>
                     table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Select all"
                  className="translate-y-[2px]"
               />
            ),
            cell: ({ row }) => (
               <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                  className="translate-y-[2px]"
               />
            ),
            enableSorting: false,
            enableHiding: false,
         },
         {
            accessorKey: 'mssv',
            id: 'mssv',
            name: 'MSSV',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="MSSV" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.mssv}</span>
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
         {
            accessorKey: 'address',
            id: 'address',
            name: 'Address',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Address" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.address}</span>
            ),
         },
         {
            accessorKey: 'class.name',
            id: 'class',
            name: 'Classroom',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Classroom" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.class.name}</span>
            ),
         },
         {
            id: 'actions',
            cell: ({ row }) => {
               return <RowActions row={row} q={q} />;
            },
            enableHiding: false,
            enableSorting: false,
         },
      ],
      [q]
   );

   return (
      <>
         <Head>
            <title>Manage students</title>
         </Head>
         <div className="space-y-4">
            <div>
               <h2 className="text-2xl font-semibold">
                  {`Manage students ${
                     classroom ? `of class ${classroom.name}` : ''
                  }`}
               </h2>
               <p className="text-muted-foreground">List of all students</p>
            </div>
            <DataTable
               columns={columns}
               data={data?.students || []}
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
                     table={table}
                     classroom={classroom}
                     renderFilterName={renderFilterName}
                     q={q}
                  />
               )}
               onRemoveRowsSelected={async ({ rowsSelected, onClose }) => {
                  await deleteStudents(rowsSelected);
                  onClose?.();
               }}
            />
         </div>
         {isDeletingStudents && <LoadingFullpage />}
      </>
   );
};

Students.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = withUser({
   isProtected: true,
   roles: [RoleName.ADMIN],
})(async ({ ctx, token }) => {
   const classId = ctx.query.classId as string;

   if (!classId) {
      return {
         props: {
            classroom: null,
         },
      };
   }

   try {
      const res: TBaseResponse<TClassroom> = await http_server(ctx)(
         `/classes/${classId}`
      );

      const classroom = res.data;

      if (!classroom) {
         return {
            props: {
               classroom: null,
            },
         };
      }

      return {
         props: {
            classroom,
         },
      };
   } catch (error) {
      return {
         props: {
            classroom: null,
         },
      };
   }
});

export default Students;
