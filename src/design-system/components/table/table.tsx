/**
 * Grahvani Table Primitive
 *
 * The single source of truth for tables across the platform. Compose with
 * Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell.
 *
 * For data-driven use cases, use DataTable which provides sorting, empty state,
 * loading state, sticky header, and row selection.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  tableCellPadding,
  tableTypography,
  tableRowHeight,
  tableHeaderClasses,
  tableDividerClasses,
  tableHoverClasses,
  tableSelectedClasses,
  tableEmptyStateClasses,
  tableSkeletonClasses,
  type TableVariant,
} from './table-system';

// ---------------------------------------------------------------------------
// Padding class maps (required for Tailwind class detection)
// ---------------------------------------------------------------------------

const paddingXClasses: Record<number, string> = {
  1: 'px-1',
  2: 'px-2',
  3: 'px-3',
  4: 'px-4',
};

const paddingYClasses: Record<number, string> = {
  1: 'py-1',
  2: 'py-2',
  3: 'py-3',
  4: 'py-4',
};

// ---------------------------------------------------------------------------
// Low-level primitives
// ---------------------------------------------------------------------------

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: TableVariant;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <table
        ref={ref}
        className={cn('w-full border-collapse text-left', className)}
        {...props}
      >
        {children}
      </table>
    );
  }
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(tableHeaderClasses, className)}
    {...props}
  >
    {children}
  </thead>
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={cn('bg-surface-primary', className)} {...props}>
    {children}
  </tbody>
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-surface-secondary border-t border-border-primary', className)}
    {...props}
  >
    {children}
  </tfoot>
));
TableFooter.displayName = 'TableFooter';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  clickable?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected, clickable, className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        tableDividerClasses,
        tableHoverClasses,
        selected && tableSelectedClasses,
        clickable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
);
TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  variant?: TableVariant;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ variant = 'default', align = 'left', width, className, children, ...props }, ref) => {
    const pad = tableCellPadding[variant];
    const typo = tableTypography[variant];
    return (
      <th
        ref={ref}
        className={cn(
          typo.header,
          paddingXClasses[pad.x],
          paddingYClasses[pad.y],
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          width,
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  variant?: TableVariant;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'numeric' | 'metadata';
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    { variant = 'default', align = 'left', type = 'text', className, children, ...props },
    ref
  ) => {
    const pad = tableCellPadding[variant];
    const typo = tableTypography[variant];
    const typeClass =
      type === 'numeric' ? typo.numeric : type === 'metadata' ? typo.metadata : typo.cell;
    return (
      <td
        ref={ref}
        className={cn(
          typeClass,
          paddingXClasses[pad.x],
          paddingYClasses[pad.y],
          tableRowHeight[variant],
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);
TableCell.displayName = 'TableCell';

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

export interface TableEmptyStateProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number;
  children?: React.ReactNode;
}

export const TableEmptyState = React.forwardRef<HTMLTableRowElement, TableEmptyStateProps>(
  ({ colSpan, children, className, ...props }, ref) => (
    <tr ref={ref} {...props}>
      <td colSpan={colSpan} className={cn(tableEmptyStateClasses, className)}>
        {children || (
          <p className="text-body-md text-muted">No data available</p>
        )}
      </td>
    </tr>
  )
);
TableEmptyState.displayName = 'TableEmptyState';

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

export interface TableSkeletonProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number;
  rows?: number;
}

export const TableSkeleton = React.forwardRef<HTMLTableRowElement, TableSkeletonProps>(
  ({ colSpan, rows = 5, className, ...props }, ref) => (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} ref={i === 0 ? ref : undefined} className={cn(tableDividerClasses, className)} {...props}>
          <td colSpan={colSpan} className="px-3 py-2">
            <div className={cn(tableSkeletonClasses, 'h-4 w-full')} />
          </td>
        </tr>
      ))}
    </>
  )
);
TableSkeleton.displayName = 'TableSkeleton';

// ---------------------------------------------------------------------------
// DataTable (higher-level component)
// ---------------------------------------------------------------------------

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'numeric' | 'metadata';
  width?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T extends object> {
  columns: DataTableColumn<T>[];
  data: T[];
  variant?: TableVariant;
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: Set<string | number>;
  stickyHeader?: boolean;
  maxHeight?: string;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
  className?: string;
  tableClassName?: string;
  ariaLabel?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends object>({
  columns,
  data,
  variant = 'default',
  rowKey,
  onRowClick,
  selectedRows,
  stickyHeader = true,
  maxHeight,
  emptyState,
  footer,
  loading = false,
  loadingRows = 5,
  className,
  tableClassName,
  ariaLabel,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);

  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir || loading) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    const comparator =
      col.sortFn ||
      ((a: T, b: T) => {
        const va = (a as Record<string, unknown>)[col.key];
        const vb = (b as Record<string, unknown>)[col.key];
        if (typeof va === 'number' && typeof vb === 'number') return va - vb;
        return String(va ?? '').localeCompare(String(vb ?? ''));
      });

    const sorted = [...data].sort(comparator);
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortKey, sortDir, columns, loading]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card border border-border-primary bg-surface-primary shadow-card',
        className
      )}
    >
      <div className={cn('overflow-x-auto', maxHeight && 'overflow-y-auto')} style={{ maxHeight }}>
        <Table variant={variant} className={tableClassName} aria-label={ariaLabel}>
          <TableHeader className={cn(stickyHeader && 'sticky top-0 z-10')}>
            <tr>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  variant={variant}
                  align={col.align}
                  width={col.width}
                  className={cn(
                    col.headerClassName,
                    col.sortable && 'cursor-pointer select-none hover:bg-bg-subtle transition-colors'
                  )}
                  onClick={() => handleSort(col)}
                >
                  {col.header}
                </TableHead>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton colSpan={columns.length} rows={loadingRows} />
            ) : sortedData.length === 0 ? (
              <TableEmptyState colSpan={columns.length}>{emptyState}</TableEmptyState>
            ) : (
              sortedData.map((row, idx) => {
                const key = rowKey ? rowKey(row, idx) : idx;
                const selected = selectedRows?.has(key);
                return (
                  <TableRow
                    key={key}
                    selected={selected}
                    clickable={!!onRowClick}
                    onClick={() => onRowClick?.(row, idx)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        variant={variant}
                        align={col.align}
                        type={col.type}
                        className={col.cellClassName}
                      >
                        {col.render
                          ? col.render(row, idx)
                          : String((row as Record<string, unknown>)[col.key] ?? '\u2014')}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {footer && <TableFooter>{footer}</TableFooter>}
        </Table>
      </div>
    </div>
  );
}
