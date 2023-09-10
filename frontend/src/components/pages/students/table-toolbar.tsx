import {
   Button,
   DataTableViewOptions,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   LoadingFullpage,
   ScrollArea,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import { useClassrooms, useCreateStudent } from '@/hooks/api';
import { TClassroom } from '@/types/class';
import { TQueryStudent, TStudent } from '@/types/student';
import { Table } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { AddUpdateStudent } from '.';

type Props = {
   table: Table<TStudent>;
   renderFilterName: () => React.ReactNode;
   classroom: TClassroom | null;
   q?: TQueryStudent;
};

export const TableToolbar = ({
   renderFilterName,
   table,
   classroom,
   q,
}: Props) => {
   const router = useRouter();
   const { data: resClassrooms } = useClassrooms();
   const { mutateAsync: createStudent, isLoading: isCreatingStudent } =
      useCreateStudent(q);
   return (
      <>
         {isCreatingStudent && <LoadingFullpage />}
         <div className="flex items-center justify-between">
            {renderFilterName()}
            <div className="flex items-center space-x-2">
               <DataTableViewOptions table={table} />
               <div className="flex items-center space-x-2">
                  <Select
                     onValueChange={(value) => {
                        if (value === 'all') {
                           router.push(`${ROUTES.STUDENTS}`);
                        } else {
                           router.push(`${ROUTES.STUDENTS}?classId=${value}`);
                        }
                     }}
                     defaultValue={(classroom?.id as string) || 'all'}
                  >
                     <SelectTrigger className="w-[180px] font-medium">
                        <SelectValue placeholder="All classrooms" />
                     </SelectTrigger>
                     <SelectContent>
                        <ScrollArea className="h-52">
                           <SelectItem
                              value="all"
                              onClick={() => {
                                 router.push(`${ROUTES.STUDENTS}`);
                              }}
                           >
                              All classrooms
                           </SelectItem>
                           {resClassrooms?.classes.map((_class) => {
                              return (
                                 <SelectItem key={_class.id} value={_class.id}>
                                    {_class.name}
                                 </SelectItem>
                              );
                           })}
                        </ScrollArea>
                     </SelectContent>
                  </Select>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button>Actions</Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Export all students</DropdownMenuItem>

                        <AddUpdateStudent
                           classId={classroom?.id}
                           onSubmit={async ({ values, onClose }) => {
                              await createStudent(values);
                              onClose?.();
                           }}
                        >
                           <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                           >
                              Add new student
                           </DropdownMenuItem>
                        </AddUpdateStudent>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         </div>
      </>
   );
};

export default TableToolbar;
