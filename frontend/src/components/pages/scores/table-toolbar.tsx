import {
   DataTableViewOptions,
   ScrollArea,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import { useClassrooms } from '@/hooks/api';
import { TClassroom } from '@/types/class';
import { TQueryScore, TScore } from '@/types/score';
import { SelectValue } from '@radix-ui/react-select';
import { Table } from '@tanstack/react-table';
import { useRouter } from 'next/router';

type Props = {
   renderFilterName: () => React.ReactNode;
   table: Table<TScore>;
   q?: TQueryScore;
   classroom: TClassroom;
};

export const TableToolbar = ({ renderFilterName, table, classroom }: Props) => {
   const router = useRouter();
   const { data: resClassrooms } = useClassrooms();

   return (
      <div>
         <div className="flex items-center justify-between">
            {renderFilterName()}
            <div className="flex items-center space-x-2">
               <DataTableViewOptions table={table} />
               <div className="flex items-center space-x-2">
                  <Select
                     onValueChange={(value) => {
                        if (value === 'all') {
                           router.push({
                              pathname: ROUTES.SCORES,
                              query: {
                                 ...router.query,
                                 classId: undefined,
                              },
                           });
                        } else {
                           router.push({
                              pathname: ROUTES.SCORES,
                              query: {
                                 ...router.query,
                                 classId: value,
                              },
                           });
                        }
                     }}
                     defaultValue={(classroom?.id as string) || 'all'}
                  >
                     <SelectTrigger className="w-[180px] font-medium">
                        <SelectValue placeholder="All classrooms" />
                     </SelectTrigger>
                     <SelectContent>
                        <ScrollArea className="h-52">
                           <SelectItem value="all">All classrooms</SelectItem>
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
               </div>
            </div>
         </div>
      </div>
   );
};

export default TableToolbar;
