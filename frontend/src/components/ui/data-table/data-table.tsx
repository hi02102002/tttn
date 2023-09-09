import { IconLoader2 } from '@tabler/icons-react';
import {
   ColumnDef,
   ColumnFiltersState,
   Table as TTable,
   TableOptions,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFacetedRowModel,
   getFacetedUniqueValues,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '../table';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
   DataToolbar?: (table: TTable<TData>) => React.ReactNode;
   options?: Omit<
      TableOptions<TData>,
      'data' | 'columns' | 'getCoreRowModel'
   > & {
      isLoading?: boolean;
   };
   onRemoveRowsSelected?: (options: {
      rowsSelected: Record<string, boolean>;
      onClose?: () => void;
   }) => void;
}

export function DataTable<TData, TValue>({
   columns,
   data,
   DataToolbar,
   options,
   onRemoveRowsSelected,
}: DataTableProps<TData, TValue>) {
   const [rowSelection, setRowSelection] = React.useState({});
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
   );

   const { isLoading, ..._options } = options || {};

   const { state, ...__options } = _options;

   const table = useReactTable({
      data,
      columns,
      state: {
         ...state,
         columnVisibility,
         rowSelection,
         columnFilters,
      },
      ...__options,
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),

      getRowId: (row, relativeIndex, parent) => {
         // @ts-ignore
         return parent ? [parent.id, row?.id || row?.mssv].join('.') : row.id;
      },
   });

   return (
      <div className="space-y-4">
         {DataToolbar && <>{DataToolbar(table)}</>}
         <div className="border rounded-md">
            <Table className="relative w-full overflow-auto">
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                              </TableHead>
                           );
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center"
                        >
                           <div className="flex items-center justify-center">
                              <IconLoader2 className="animate-spin" />
                           </div>
                        </TableCell>
                     </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && 'selected'}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center font-medium"
                        >
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
         <DataTablePagination
            table={table}
            onRemoveRowsSelected={(close) => {
               onRemoveRowsSelected?.({
                  rowsSelected: rowSelection,
                  onClose: close,
               });
            }}
            rowsSelected={rowSelection}
         />
      </div>
   );
}
