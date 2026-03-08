"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "animate-pulse rounded-lg bg-gradient-to-r from-parchment via-parchment-soft to-parchment bg-[length:200%_100%]",
                className
            )}
        />
    );
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div aria-hidden="true"
             className={cn("prem-card p-6 space-y-4", className)}>
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <div className="flex gap-3 pt-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
    return (
        <div aria-hidden="true" className={cn("space-y-0", className)}>
            {/* Header */}
            <div className="flex gap-4 pb-3 mb-3"
                 style={{ borderBottom: '1px solid rgba(220,201,166,0.20)' }}>
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={`h-${i}`} className="h-3.5 flex-1 rounded-md" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, r) => (
                <div key={`r-${r}`} className="flex gap-4 py-2.5"
                     style={{ borderBottom: r < rows - 1 ? '1px solid rgba(220,201,166,0.10)' : 'none' }}>
                    {Array.from({ length: cols }).map((_, c) => (
                        <Skeleton key={`r-${r}-c-${c}`} className="h-3.5 flex-1 rounded-md" />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonChart({ className }: { className?: string }) {
    return (
        <div aria-hidden="true" className={cn("prem-card p-6 flex flex-col items-center gap-4", className)}>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="w-64 h-64 rounded-xl" />
            <div className="flex gap-4 w-full">
                <Skeleton className="h-4 flex-1 rounded-md" />
                <Skeleton className="h-4 flex-1 rounded-md" />
                <Skeleton className="h-4 flex-1 rounded-md" />
            </div>
        </div>
    );
}
