import { Button, DataTableViewOptions, LoadingFullpage } from '@/components/ui';
import { useCreateSubject } from '@/hooks/api';
import { TSubject, TSubjectQuery } from '@/types/subject';
import { Table } from '@tanstack/react-table';
import { AddUpdateSubject } from '.';

type Props = {
   table: Table<TSubject>;
   renderFilterName: () => React.ReactNode;
   q?: TSubjectQuery;
};

export const TableToolbar = ({ renderFilterName, table, q }: Props) => {
   const { mutateAsync: createSubject, isLoading: isCreatingSubject } =
      useCreateSubject(q);

   return (
      <>
         {isCreatingSubject && <LoadingFullpage />}
         <div className="flex items-center justify-between">
            {renderFilterName()}
            <div className="flex items-center space-x-2">
               <DataTableViewOptions table={table} />
               <AddUpdateSubject
                  onSubmit={async ({ values, onClose }) => {
                     await createSubject({
                        ...values,
                        numCredits: Number(values.numCredits),
                     });
                     onClose?.();
                  }}
               >
                  <Button>Add new subject</Button>
               </AddUpdateSubject>
            </div>
         </div>
      </>
   );
};

export default TableToolbar;
