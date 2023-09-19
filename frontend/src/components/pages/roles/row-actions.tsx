import {
   Button,
   ConfirmDialog,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   LoadingFullpage,
} from '@/components/ui';
import { useDeleteRole, useUpdateRole, useUpdateScore } from '@/hooks/api';
import { RoleName, TRole, TRoleQuery } from '@/types/role';
import { TQueryScore, TScore } from '@/types/score';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { AddUpdateRole } from '.';

type Props = {
   row: Row<TRole>;
   q?: TRoleQuery;
};

export const RowActions = ({ row, q }: Props) => {
   const { mutateAsync: updateRole, isLoading: IsUpdatingRole } =
      useUpdateRole(q);
   const { mutateAsync: deleteRole, isLoading: IsDeletingRole } =
      useDeleteRole(q);
   return (
      <>
         {(IsUpdatingRole || IsDeletingRole) && <LoadingFullpage />}
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
               <AddUpdateRole
                  onSubmit={async ({ values, onClose }) => {
                     await updateRole({
                        data: {
                           name: values.name as unknown as RoleName,
                        },
                        id: row.original.id,
                     });
                     onClose?.();
                  }}
                  title="Update role"
                  defaultValues={{
                     name: row.original.name,
                  }}
                  description="Update role for system"
                  type="UPDATE"
               >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                     Update
                  </DropdownMenuItem>
               </AddUpdateRole>
               <ConfirmDialog
                  title="Delete role?"
                  description="Are you sure you want to delete this role?"
                  message="This action can't be undone. This will permanently delete the role. Are you sure?"
                  type="destructive"
                  onConfirm={async (close) => {
                     await deleteRole(row.original.id);
                     close?.();
                  }}
               >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                     Delete
                  </DropdownMenuItem>
               </ConfirmDialog>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

export default RowActions;
