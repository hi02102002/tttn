import {
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   LoadingFullpage,
} from '@/components/ui';
import { useChangePassUser, useUpdateUser } from '@/hooks/api';
import { TQueryUser, TUser } from '@/types/user';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { ChangePassword, UpdateUser } from '.';

type Props = {
   row: Row<TUser>;
   q?: TQueryUser;
};

export const RowActions = ({ row, q }: Props) => {
   const { mutateAsync: updateUser, isLoading: isUpdatingUser } =
      useUpdateUser(q);
   const { mutateAsync: changePassUser, isLoading: isChangingPassUser } =
      useChangePassUser();

   const isLoadingActions = isUpdatingUser || isChangingPassUser;

   return (
      <div>
         {isLoadingActions && <LoadingFullpage />}
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
               <UpdateUser
                  defaultValues={{
                     username: row.original.username,
                     status: row.original.status,
                  }}
                  onSubmit={async ({ values, onClose }) => {
                     await updateUser({
                        userId: row.original.id,
                        data: values,
                     });
                     onClose?.();
                  }}
                  isLoading={isUpdatingUser}
               >
                  <DropdownMenuItem
                     onSelect={(e) => {
                        e.preventDefault();
                     }}
                  >
                     Update
                  </DropdownMenuItem>
               </UpdateUser>
               <ChangePassword
                  onSubmit={async ({ values, onClose }) => {
                     await changePassUser({
                        userId: row.original.id,
                        data: values,
                     });
                     onClose?.();
                  }}
               >
                  <DropdownMenuItem
                     onSelect={(e) => {
                        e.preventDefault();
                     }}
                  >
                     Change password
                  </DropdownMenuItem>
               </ChangePassword>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default RowActions;
