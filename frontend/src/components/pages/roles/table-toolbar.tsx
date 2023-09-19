import {
   Button,
   DataTableViewOptions,
   LoadingFullpage,
   ScrollArea,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import { useClassrooms, useCreateRole } from '@/hooks/api';
import { cn } from '@/lib/utils';
import { TClassroom } from '@/types/class';
import { RoleName, TRole, TRoleQuery } from '@/types/role';
import { TQueryScore, TScore } from '@/types/score';
import { SelectValue } from '@radix-ui/react-select';
import { Table } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { AddUpdateRole } from '.';

type Props = {
   renderFilterName?: () => React.ReactNode;
   table: Table<TRole>;
   q?: TRoleQuery;
};

export const TableToolbar = ({ renderFilterName, table, q }: Props) => {
   const { mutateAsync: createRole, isLoading: isCreatingRole } =
      useCreateRole(q);

   return (
      <div>
         {isCreatingRole && <LoadingFullpage />}
         <div className="flex items-center justify-between">
            {renderFilterName && renderFilterName()}
            <div
               className={cn('flex items-center space-x-2', {
                  'ml-auto': renderFilterName === undefined,
               })}
            >
               <DataTableViewOptions table={table} />
               <AddUpdateRole
                  onSubmit={async ({ values, onClose }) => {
                     await createRole({
                        name: values.name as unknown as RoleName,
                     });
                     onClose?.();
                  }}
               >
                  <Button>Create role</Button>
               </AddUpdateRole>
            </div>
         </div>
      </div>
   );
};

export default TableToolbar;
