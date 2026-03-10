"use client";

import { Sparkles } from "lucide-react";
import type { ChaldeanCategoryMeta, NumerologyEndpointMeta } from "@/lib/numerology-constants";

interface CategoryPageHeaderProps {
    category: ChaldeanCategoryMeta;
    endpoints: NumerologyEndpointMeta[];
}

export default function CategoryPageHeader({ category, endpoints }: CategoryPageHeaderProps) {
    const Icon = category.icon;

    return (
        <div className="prem-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-active-glow to-transparent" />
            <div className="p-4 md:p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(180,130,50,0.08) 100%)',
                        border: '1px solid rgba(201,162,77,0.25)',
                    }}
                >
                    <Icon className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[18px] font-bold font-serif text-primary">{category.name}</h1>
                    <p className="text-[12px] text-amber-800/60 mt-0.5 truncate">{category.description}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[11px] font-bold text-amber-700">{endpoints.length} Analyses</span>
                </div>
            </div>
        </div>
    );
}
