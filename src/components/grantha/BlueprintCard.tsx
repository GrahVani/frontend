"use client";

import React from 'react';
import { FileText, Sparkles, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Blueprint } from '@/types/grantha';

interface BlueprintCardProps {
    blueprint: Blueprint;
    onGenerate: (blueprint: Blueprint) => void;
}

export default function BlueprintCard({ blueprint, onGenerate }: BlueprintCardProps) {
    return (
        <div className="prem-card rounded-2xl p-6 hover:shadow-lg transition-all group">
            {/* Icon */}
            <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center text-ink mb-4 group-hover:bg-gold-primary group-hover:text-white transition-colors">
                {blueprint.isSystem ? (
                    <FileText className="w-6 h-6" />
                ) : (
                    <Sparkles className="w-6 h-6" />
                )}
            </div>

            {/* Title & Description */}
            <h4 className="font-bold text-ink font-serif text-[18px] mb-2 leading-tight">
                {blueprint.name}
            </h4>
            <p className="text-[14px] text-gold-dark mb-4 min-h-[40px] line-clamp-2">
                {blueprint.description}
            </p>

            {/* Metadata badges */}
            <div className="flex items-center gap-3 mb-5 text-[12px] text-ink/55 font-semibold">
                {blueprint.estimatedPages != null && (
                    <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        ~{blueprint.estimatedPages} pages
                    </span>
                )}
            </div>

            {/* Cost badge */}
            {blueprint.estimatedCost != null && blueprint.estimatedCost > 0 && (
                <div className="mb-4">
                    <span
                        className="px-3 py-1 text-[11px] font-bold text-gold-dark uppercase tracking-wider rounded-full"
                        style={{
                            background: 'rgba(201,162,77,0.14)',
                            border: '1px solid rgba(201,162,77,0.28)',
                        }}
                    >
                        ~${blueprint.estimatedCost.toFixed(2)}
                    </span>
                </div>
            )}

            {/* Generate button */}
            <button
                onClick={() => onGenerate(blueprint)}
                className={cn(
                    "w-full py-3 rounded-lg font-bold text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    "bg-gold-primary text-white hover:bg-gold-dark shadow-sm hover:shadow-md"
                )}
            >
                <Sparkles className="w-4 h-4" />
                Generate Report
            </button>
        </div>
    );
}
