"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronUp, ChevronDown } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DataGridColumn<T> {
    key: string;
    header: React.ReactNode;
    /** Render function for cell content. Falls back to `row[key]` */
    render?: (row: T, index: number) => React.ReactNode;
    /** Text alignment */
    align?: 'left' | 'center' | 'right';
    /** Additional header className */
    headerClassName?: string;
    /** Additional cell className */
    cellClassName?: string;
    /** Fixed width (Tailwind class like "w-20") */
    width?: string;
    /** Enable sorting on this column */
    sortable?: boolean;
    /** Sort comparator. Default: string/number comparison on `row[key]` */
    sortFn?: (a: T, b: T) => number;
}

export interface DataGridProps<T> {
    columns: DataGridColumn<T>[];
    data: T[];
    /** Unique key extractor per row. Default: index */
    rowKey?: (row: T, index: number) => string | number;
    /** Called when a row is clicked */
    onRowClick?: (row: T, index: number) => void;
    /** Row className — can be a string or a function of (row, index) */
    rowClassName?: string | ((row: T, index: number) => string);
    /** Highlight predicate — rows matching get `highlightClassName` */
    highlightRow?: (row: T, index: number) => boolean;
    highlightClassName?: string;
    /** Show striped (alternating) row backgrounds */
    striped?: boolean;
    /** Enable sticky header (default: true) */
    stickyHeader?: boolean;
    /** Max height constraint for vertical scroll (CSS value) */
    maxHeight?: string;
    /** Show scroll shadow indicators (default: true) */
    scrollShadows?: boolean;
    /** Custom empty state */
    emptyState?: React.ReactNode;
    /** Optional footer row(s) */
    footer?: React.ReactNode;
    /** Container className */
    className?: string;
    /** Table className */
    tableClassName?: string;
    /** ARIA label for the table */
    ariaLabel?: string;
    /** Header row className override */
    headerClassName?: string;
    /** Cell padding override (Tailwind class like "px-3 py-2") */
    cellPadding?: string;
    /** Compact mode — tighter padding */
    compact?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DataGrid<T extends object>({
    columns,
    data,
    rowKey,
    onRowClick,
    rowClassName,
    highlightRow,
    highlightClassName = 'bg-header-border/5',
    striped = false,
    stickyHeader = true,
    maxHeight,
    scrollShadows = true,
    emptyState,
    footer,
    className,
    tableClassName,
    ariaLabel,
    headerClassName,
    cellPadding,
    compact = false,
}: DataGridProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);

    const pad = cellPadding || (compact ? 'px-2 py-1.5' : 'px-3 py-2');

    // --- Scroll shadow detection ---
    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 1);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !scrollShadows) return;
        updateScrollState();
        el.addEventListener('scroll', updateScrollState, { passive: true });
        const ro = new ResizeObserver(updateScrollState);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            ro.disconnect();
        };
    }, [scrollShadows, updateScrollState]);

    // --- Sorting ---
    const handleSort = (col: DataGridColumn<T>) => {
        if (!col.sortable) return;
        if (sortKey === col.key) {
            setSortDir(prev => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
            if (sortDir === 'desc') setSortKey(null);
        } else {
            setSortKey(col.key);
            setSortDir('asc');
        }
    };

    const sortedData = React.useMemo(() => {
        if (!sortKey || !sortDir) return data;
        const col = columns.find(c => c.key === sortKey);
        if (!col) return data;

        const comparator = col.sortFn || ((a: T, b: T) => {
            const va = (a as Record<string, unknown>)[col.key];
            const vb = (b as Record<string, unknown>)[col.key];
            if (typeof va === 'number' && typeof vb === 'number') return va - vb;
            return String(va ?? '').localeCompare(String(vb ?? ''));
        });

        const sorted = [...data].sort(comparator);
        return sortDir === 'desc' ? sorted.reverse() : sorted;
    }, [data, sortKey, sortDir, columns]);

    // --- Render ---
    const alignClass = (align?: string) =>
        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

    return (
        <div className={cn('relative rounded-xl overflow-hidden', className)}>
            {/* Left scroll shadow */}
            {scrollShadows && canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-4 z-20 pointer-events-none bg-gradient-to-r from-black/[0.06] to-transparent" />
            )}
            {/* Right scroll shadow */}
            {scrollShadows && canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-4 z-20 pointer-events-none bg-gradient-to-l from-black/[0.06] to-transparent" />
            )}

            <div
                ref={scrollRef}
                className={cn(
                    'overflow-x-auto',
                    maxHeight && 'overflow-y-auto',
                )}
                style={maxHeight ? { maxHeight } : undefined}
            >
                <table
                    className={cn('w-full border-collapse', tableClassName)}
                    role="table"
                    aria-label={ariaLabel}
                >
                    <thead className={cn(
                        stickyHeader && 'sticky top-0 z-10',
                    )}>
                        <tr className={cn(
                            'bg-ink/5 border-b border-header-border/20',
                            headerClassName,
                        )}>
                            {columns.map(col => {
                                const isSorted = sortKey === col.key;
                                return (
                                    <th
                                        key={col.key}
                                        className={cn(
                                            TYPOGRAPHY.tableHeader,
                                            pad,
                                            alignClass(col.align),
                                            col.width,
                                            col.headerClassName,
                                            col.sortable && 'cursor-pointer select-none hover:bg-ink/[0.03] transition-colors',
                                        )}
                                        onClick={() => handleSort(col)}
                                        aria-sort={isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                                    >
                                        <span className={cn('inline-flex items-center gap-1', col.align === 'center' && 'justify-center', col.align === 'right' && 'justify-end')}>
                                            {col.header}
                                            {col.sortable && (
                                                <span className="inline-flex flex-col -space-y-1">
                                                    <ChevronUp className={cn('w-3 h-3', isSorted && sortDir === 'asc' ? 'text-header-border' : 'text-primary/20')} />
                                                    <ChevronDown className={cn('w-3 h-3', isSorted && sortDir === 'desc' ? 'text-header-border' : 'text-primary/20')} />
                                                </span>
                                            )}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-header-border/10">
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="py-12 text-center">
                                    {emptyState || (
                                        <p className={cn(TYPOGRAPHY.subValue, 'opacity-50')}>No data available</p>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((row, idx) => {
                                const key = rowKey ? rowKey(row, idx) : idx;
                                const isHighlighted = highlightRow?.(row, idx);
                                const rowCls = typeof rowClassName === 'function' ? rowClassName(row, idx) : rowClassName;

                                return (
                                    <tr
                                        key={key}
                                        className={cn(
                                            'hover:bg-ink/5 transition-colors',
                                            striped && idx % 2 === 1 && 'bg-parchment/30',
                                            isHighlighted && highlightClassName,
                                            onRowClick && 'cursor-pointer',
                                            rowCls,
                                        )}
                                        onClick={() => onRowClick?.(row, idx)}
                                    >
                                        {columns.map(col => (
                                            <td
                                                key={col.key}
                                                className={cn(
                                                    pad,
                                                    alignClass(col.align),
                                                    col.width,
                                                    col.cellClassName,
                                                )}
                                            >
                                                {col.render
                                                    ? col.render(row, idx)
                                                    : String((row as Record<string, unknown>)[col.key] ?? '\u2014')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>

                    {footer && (
                        <tfoot>{footer}</tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
