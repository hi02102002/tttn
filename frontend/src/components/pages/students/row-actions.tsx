import { Export } from '@/components/shared';
import {
   Button,
   ConfirmDialog,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   LoadingFullpage,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import {
   useAddSubjectsStudent,
   useDeleteStudents,
   useExportSubjectsStudent,
   useUpdateStudent,
} from '@/hooks/api';
import { EExportType } from '@/types/shared';
import { TQueryStudent, TStudent } from '@/types/student';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { AddSubjectStudent, AddUpdateStudent } from '.';

type Props = {
   row: Row<TStudent>;
   q?: TQueryStudent;
};

export const RowActions = ({ row, q }: Props) => {
   const router = useRouter();
   const { mutateAsync: deleteStudents, isLoading: isDeletingStudents } =
      useDeleteStudents(q);
   const { mutateAsync: updateStudent, isLoading: isUpdatingStudent } =
      useUpdateStudent(q);
   const {
      mutateAsync: addSubjectsStudent,
      isLoading: isAddingSubjectsStudent,
   } = useAddSubjectsStudent();

   const {
      mutateAsync: exportSubjectsStudent,
      isLoading: isExportingSubjectsStudent,
   } = useExportSubjectsStudent();

   const isLoadingActions =
      isDeletingStudents ||
      isUpdatingStudent ||
      isAddingSubjectsStudent ||
      isExportingSubjectsStudent;

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
               <Export
                  defaultValues={{
                     name: row.original.name,
                     type: EExportType.XLSX,
                  }}
                  description='Export list scores of student "MSSV" to file excel'
                  title="Export list scores"
                  onSubmit={async ({ values, onClose }) => {
                     await exportSubjectsStudent({
                        filename: values.name,
                        type: values.type,
                        mssv: row.original.mssv,
                     });
                     onClose?.();
                  }}
               >
                  <DropdownMenuItem
                     onSelect={(e) => {
                        e.preventDefault();
                     }}
                  >
                     Export list scores
                  </DropdownMenuItem>
               </Export>
               <DropdownMenuItem
                  onClick={() => {
                     router.push(`${ROUTES.SCORES}?mssv=${row.original.mssv}`);
                  }}
               >
                  View student subjects
               </DropdownMenuItem>
               <AddSubjectStudent
                  isLoading={isAddingSubjectsStudent}
                  onSubmit={async ({ values, onClose }) => {
                     await addSubjectsStudent({
                        mssv: row.original.mssv,
                        subjectIds: values,
                     });
                     onClose?.();
                  }}
               >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                     Add subjects
                  </DropdownMenuItem>
               </AddSubjectStudent>
               <AddUpdateStudent
                  title="Update student"
                  description="Update student information"
                  type="UPDATE"
                  defaultValues={{
                     address: row.original.address,
                     name: row.original.name,
                     classId: row.original.class.id,
                  }}
                  onSubmit={async ({ values, onClose }) => {
                     await updateStudent({
                        mssv: row.original.mssv,
                        values,
                     });
                     onClose?.();
                  }}
                  isLoading={isUpdatingStudent}
               >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                     Edit
                  </DropdownMenuItem>
               </AddUpdateStudent>
               <ConfirmDialog
                  title={`Delete student ${row.original.name}?`}
                  description="This action cannot be undone."
                  message={
                     <p>
                        This action will delete student with{' '}
                        <span className="font-medium text-primary">
                           MSSV {row.original.mssv}
                        </span>{' '}
                        from the class{' '}
                        <span className="font-medium text-primary">
                           {row.original.class.name}
                        </span>
                        . Are you sure about that?
                     </p>
                  }
                  type="destructive"
                  textConfirm="Delete"
                  onConfirm={async (close) => {
                     await deleteStudents({
                        [row.original.mssv]: true,
                     });
                     close?.();
                  }}
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
