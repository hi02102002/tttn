import {
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   LoadingFullpage,
} from '@/components/ui';
import { useUpdateScore } from '@/hooks/api';
import { TQueryScore, TScore } from '@/types/score';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { UpdateScore } from '.';

type Props = {
   row: Row<TScore>;
   q?: TQueryScore;
};

export const RowActions = ({ row, q }: Props) => {
   const { mutateAsync: updateScore, isLoading: isLoadingUpdateScore } =
      useUpdateScore(q);

   return (
      <>
         {isLoadingUpdateScore && <LoadingFullpage />}
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
               <UpdateScore
                  student={row.original.student}
                  subject={row.original.subject}
                  defaultValue={row.original.score || undefined}
                  onSubmit={async ({ value, onClose }) => {
                     await updateScore({
                        mssv: row.original.student.mssv,
                        score: value,
                        subjectId: row.original.subject.id,
                     });
                     onClose?.();
                  }}
               >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                     Add or update score
                  </DropdownMenuItem>
               </UpdateScore>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

export default RowActions;
