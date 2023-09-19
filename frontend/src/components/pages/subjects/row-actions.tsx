import {
   Button,
   ConfirmDialog,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   LoadingFullpage,
} from '@/components/ui';
import { useDeleteSubject, useUpdateSubject } from '@/hooks/api';
import { TSubject, TSubjectQuery } from '@/types/subject';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { AddUpdateSubject } from '.';

type Props = {
   row: Row<TSubject>;
   q?: TSubjectQuery;
};

export const RowActions = ({ row, q }: Props) => {
   const { mutateAsync: updateSubject, isLoading: isUpdatingSubject } =
      useUpdateSubject(q);
   const { mutateAsync: deleteSubject, isLoading: isDeletingSubject } =
      useDeleteSubject(q);

   const isLoadingActions = isUpdatingSubject || isDeletingSubject;

   return (
      <>
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
               <AddUpdateSubject
                  defaultValues={{
                     name: row.original.name,
                     numCredits: row.original.numCredits.toString(),
                  }}
                  onSubmit={async ({ values, onClose }) => {
                     await updateSubject({
                        id: row.original.id,
                        values: {
                           ...values,
                           numCredits: Number(values.numCredits),
                        },
                     });

                     onClose?.();
                  }}
                  title="Update subject"
                  description="Please fill out the form below to update subject"
                  type="UPDATE"
               >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                     Edit
                  </DropdownMenuItem>
               </AddUpdateSubject>
               <ConfirmDialog
                  title="Delete subject?"
                  description="This action cannot be undone."
                  message="Are you sure you want to delete this subject? This action cannot be undone."
                  onConfirm={async (onClose) => {
                     await deleteSubject(row.original.id);
                     onClose?.();
                  }}
                  type="destructive"
                  textConfirm="Delete"
               >
                  <DropdownMenuItem
                     onSelect={(e) => {
                        e.preventDefault();
                     }}
                  >
                     Delete
                  </DropdownMenuItem>
               </ConfirmDialog>
            </DropdownMenuContent>
         </DropdownMenu>
         {isLoadingActions && <LoadingFullpage />}
      </>
   );
};

export default RowActions;
