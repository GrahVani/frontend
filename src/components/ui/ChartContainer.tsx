"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function ChartContainer({ children, className }: ChartContainerProps) {
    return (
        <div className={cn("aspect-square max-w-[600px] w-full mx-auto", className)}>
            {children}
        </div>
    );
}
