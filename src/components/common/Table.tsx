"use client";

import { cn } from "@/utils/cn";
import { Pagination } from "./Pagination";
import { Spinner } from "./Spinner";

export interface TableColumn<T> {
  id: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TablePageable {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  pageable?: TablePageable;
  onPageChange?: (page: number) => void;
  getRowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "Aucune donnée",
  pageable,
  onPageChange,
  getRowKey,
  onRowClick,
  className,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Chargement des données" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-foreground",
                    column.className
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey ? getRowKey(row, index) : index}
                  className={cn(
                    "transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "px-6 py-4 text-sm text-foreground",
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.id as keyof T] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pageable && onPageChange && (
        <Pagination
          page={pageable.page}
          totalPages={pageable.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
