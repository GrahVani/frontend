"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ChaldeanCategoryMeta } from "@/lib/numerology-constants";

interface CategoryOverviewCardProps {
    category: ChaldeanCategoryMeta;
    className?: string;
}

export default function CategoryOverviewCard({ category, className }: CategoryOverviewCardProps) {
    const Icon = category.icon;

    return (
        <Link
            href={category.path}
            className={cn(
                "prem-card group block relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
                className,
            )}
        >
            {/* Gold shimmer top edge for AI cards */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-active-glow/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-5 space-y-3">
                {/* Top row: icon + title + count badge */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,162,77,0.15) 0%, rgba(180,130,50,0.08) 100%)',
                                border: '1px solid rgba(201,162,77,0.25)',
                            }}
                        >
                            <Icon className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-primary group-hover:text-gold-dark transition-colors leading-tight">
                                {category.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">AI-Powered</span>
                            </div>
                        </div>
                    </div>

                    {/* Count badge */}
                    <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                            background: 'rgba(201,162,77,0.10)',
                            border: '1px solid rgba(201,162,77,0.20)',
                        }}
                    >
                        <span className="text-[14px] font-bold font-serif text-gold-dark">{category.count}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-primary/70 leading-relaxed">{category.description}</p>

                {/* Footer: features + explore */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Score
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                            Narrative
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                            Guidance
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] font-semibold text-gold-dark group-hover:text-amber-700 transition-colors">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
