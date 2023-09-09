import { AddUpdateClassroomDialog } from '@/components/pages/classrooms';
import {
   Button,
   Checkbox,
   DataTable,
   DataTableColumnHeader,
   DataTableViewOptions,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   LoadingFullpage,
} from '@/components/ui';
import {
   useClassrooms,
   useCreateClassroom,
   useDeleteClassrooms,
   useUpdateClassroom,
} from '@/hooks/api';
import { useFilterName, useSorting } from '@/hooks/shared';
import Layout from '@/layouts/app';
import { TClassroom, TClassroomQuery } from '@/types/class';
import { NextPageWithLayout } from '@/types/shared';
import { calcPageCount } from '@/utils';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

const Classrooms: NextPageWithLayout = () => {
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
   });
   const { setSorting, sorting, sortingObj } = useSorting();
   const { name: filterName, render: renderFilterName } = useFilterName({
      placeholder: 'Search by name',
   });

   const q: TClassroomQuery = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      orderBy: sortingObj,
      name: filterName,
   };
   const { data, isLoading } = useClassrooms(q);
   const {
      mutateAsync: handleCreateClassroom,
      isLoading: isCreatingClassroom,
   } = useCreateClassroom(q);
   const {
      mutateAsync: handleUpdateClassroom,
      isLoading: isUpdatingClassroom,
   } = useUpdateClassroom(q);
   const {
      mutateAsync: handleDeleteClassrooms,
      isLoading: isDeletingClassrooms,
   } = useDeleteClassrooms(q);

   const isLoadingActions =
      isCreatingClassroom || isUpdatingClassroom || isDeletingClassrooms;

   const columns: ColumnDef<TClassroom>[] = useMemo(
      () => [
         {
            accessorKey: 'id',
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
            accessorKey: 'academicYear',
            id: 'academicYear',
            name: 'Academic year',
            header: ({ column }) => (
               <DataTableColumnHeader column={column} title="Academic year" />
            ),
            cell: ({ row }) => (
               <span className="font-medium">{row.original.academicYear}</span>
            ),
         },
         {
            id: 'students',
            name: 'Students',
            accessorKey: '_count.students',
            header: ({ column }) => (
               <DataTableColumnHeader
                  column={column}
                  title="Number of students"
               />
            ),
            cell: ({ row }) => (
               <span className="font-medium">
                  {row.original._count.students} students
               </span>
            ),
         },
         {
            id: 'actions',
            cell: ({ row }) => {
               return (
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                           <DotsHorizontalIcon className="h-4 w-4" />
                           <span className="sr-only">Open menu</span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="start" className="w-[160px]">
                        <DropdownMenuItem>View students</DropdownMenuItem>
                        <DropdownMenuItem>
                           Export list of students
                        </DropdownMenuItem>
                        <AddUpdateClassroomDialog
                           title="Update classroom"
                           description="Update classroom details"
                           defaultValues={{
                              academicYear: new Date(
                                 row.original.academicYear,
                                 0,
                                 1
                              ),
                              name: row.original.name,
                           }}
                           onSubmit={async ({ values, onClose }) => {
                              await handleUpdateClassroom({
                                 id: row.original.id,
                                 values,
                              });
                              onClose?.();
                           }}
                           type="UPDATE"
                           isLoading={isUpdatingClassroom}
                        >
                           <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                           >
                              Edit
                           </DropdownMenuItem>
                        </AddUpdateClassroomDialog>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               );
            },
         },
      ],
      [handleUpdateClassroom, isUpdatingClassroom]
   );

   return (
      <>
         <div className="space-y-4">
            <div>
               <h2 className="text-2xl font-semibold">Manage classrooms</h2>
               <p className="text-muted-foreground">
                  Here you can manage classrooms, add, edit, delete, view
                  students in each classroom
               </p>
            </div>
            <DataTable
               columns={columns}
               data={data?.classes || []}
               options={{
                  isLoading,
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
               }}
               DataToolbar={(table) => (
                  <div className="flex items-center justify-between">
                     {renderFilterName()}
                     <div className="flex items-center space-x-2">
                        <DataTableViewOptions table={table} />
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button>Actions</Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                 Export list of classes
                              </DropdownMenuItem>
                              <AddUpdateClassroomDialog
                                 onSubmit={async ({ values, onClose }) => {
                                    await handleCreateClassroom(values);
                                    onClose?.();
                                 }}
                                 isLoading={isCreatingClassroom}
                              >
                                 <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                 >
                                    Add new class
                                 </DropdownMenuItem>
                              </AddUpdateClassroomDialog>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </div>
               )}
               onRemoveRowsSelected={async ({ rowsSelected, onClose }) => {
                  await handleDeleteClassrooms(rowsSelected);
                  onClose?.();
               }}
            />
         </div>
         {isLoadingActions && <LoadingFullpage />}
      </>
   );
};

Classrooms.getLayout = (page) => {
   return <Layout>{page}</Layout>;
};

export default Classrooms;
