import { DataTableViewOptions } from '@/components/ui';
import { TUser } from '@/types/user';
import { Table } from '@tanstack/react-table';

type Props = {
   table: Table<TUser>;
   renderFilterName: () => React.ReactNode;
};

export const TableToolbar = ({ renderFilterName, table }: Props) => {
   return (
      <div className="flex items-center justify-between">
         {renderFilterName()}
         <DataTableViewOptions table={table} />
      </div>
   );
};

export default TableToolbar;
