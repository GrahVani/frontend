'use client';

import React, { memo, useState } from 'react';
import { Database, ChevronDown, ChevronRight, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KnowledgeTooltip } from '@/components/knowledge';

interface YogaRawDetailsProps {
    data: Record<string, unknown>;
}

const isPrimitive = (val: unknown): boolean => {
    return val === null || typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean';
};

const formatValue = (val: unknown): string => {
    if (val === null) return 'null';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
};

const JsonNode = ({ label, value, defaultOpen = false }: { label: string; value: unknown, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (isPrimitive(value)) {
        return (
            <div className="flex flex-col sm:flex-row sm:items-baseline py-1.5 border-b border-zinc-100 last:border-0">
                <span className="text-[11px] font-bold text-zinc-500 capitalize w-40 shrink-0">
                    {label.replace(/_/g, ' ')}
                </span>
                <span className="text-[12px] font-medium text-amber-900 break-words">
                    {formatValue(value)}
                </span>
            </div>
        );
    }

    // It's an object or array
    const isArray = Array.isArray(value);
    const keys = Object.keys(value as object);

    if (keys.length === 0) {
        return (
            <div className="flex py-1.5 border-b border-zinc-100 last:border-0">
                <span className="text-[11px] font-bold text-zinc-500 capitalize w-40 shrink-0">
                    {label.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] italic text-zinc-400">Empty {isArray ? 'List' : 'Object'}</span>
            </div>
        );
    }

    return (
        <div className="py-2 border-b border-zinc-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 w-full text-left focus:outline-none group"
            >
                {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-amber-500 transition-transform" />
                ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-500 transition-transform" />
                )}
                <span className="text-[11px] font-bold text-zinc-700 capitalize group-hover:text-amber-700 transition-colors">
                    {label.replace(/_/g, ' ')}
                </span>
                <span className="text-[9px] text-zinc-400 ml-auto tracking-wider">
                    {isArray ? `(${keys.length} items)` : `{${keys.length} keys}`}
                </span>
            </button>

            {isOpen && (
                <div className="mt-2 ml-4 pl-3 border-l-2 border-amber-200/60 space-y-1 animation-slide-down">
                    {keys.map((k) => (
                        <JsonNode key={k} label={isArray ? `[${k}]` : k} value={(value as any)[k]} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const YogaRawDetails = memo(function YogaRawDetails({ data }: YogaRawDetailsProps) {
    if (!data || Object.keys(data).length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
            <h3 className="font-serif font-bold text-amber-900 mb-2 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <Database className="w-4 h-4 text-amber-500" /> Advanced Data
            </h3>
            <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed max-w-lg">
                Raw astrological variables, parameters, and metadata utilized for this analysis. 
            </p>

            <div className="space-y-1 bg-surface-base rounded-xl p-4 border border-zinc-200">
                {Object.entries(data).map(([key, value]) => (
                    <JsonNode key={key} label={key} value={value} defaultOpen={false} />
                ))}
            </div>
        </div>
    );
});
