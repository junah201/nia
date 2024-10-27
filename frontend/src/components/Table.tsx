import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import { useCustomQuery } from '@/lib/Query';

interface TableProps {
  size?: number;
  queryKey: string;
  queryDetail?: any;
  queryFn: () => Promise<any>;
  columns: ColumnDef<any, any>[];
  showLoading?: boolean;
  errorMessage?: string;
}

export const Table = ({
  size = 20,
  queryKey,
  queryDetail,
  queryFn,
  columns,
  showLoading = true,
  errorMessage,
}: TableProps) => {
  const { data, isLoading, isFetching } = useCustomQuery(
    [
      queryKey,
      {
        ...queryDetail,
      },
    ],
    queryFn,
    {
      keepPreviousData: true,
      retry: 0,
      ErrorMessage: errorMessage || '데이터를 불러오는데 실패했습니다.',
    }
  );

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data?.data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <ShadcnTable>
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
            {table.getRowModel().rows?.length ? (
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadcnTable>
      </div>
    </div>
  );
};
