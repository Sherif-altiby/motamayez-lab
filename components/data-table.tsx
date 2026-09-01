import * as React from "react";
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";

export type DataTableColumn<T> = {
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  cellClassName?: string;
};

type DataTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyState?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  rowKey,
  emptyState,
  actions,
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <>{emptyState ?? <div className="py-10 text-center text-sm text-muted-foreground">لا توجد بيانات</div>}</>;
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={String(index)} className={column.className}>
              {column.header}
            </TableHead>
          ))}
          {actions ? <TableHead className="w-0 whitespace-nowrap"></TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={rowKey(row)}>
            {columns.map((column, index) => {
              const content =
                typeof column.accessor === "function"
                  ? column.accessor(row)
                  : column.accessor
                    ? (row[column.accessor] as React.ReactNode)
                    : null;

              return (
                <TableCell key={`${rowKey(row)}-${String(index)}`} className={column.cellClassName}>
                  {content}
                </TableCell>
              );
            })}
            {actions ? (
              <TableCell className="w-0 whitespace-nowrap">
                <div className="flex justify-end gap-1">{actions(row)}</div>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
