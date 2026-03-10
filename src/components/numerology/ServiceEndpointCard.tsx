"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, User, Users, Home as HomeIcon } from "lucide-react";
import type { NumerologyEndpointMeta, NumerologyInputType } from "@/lib/numerology-constants";

const INPUT_TYPE_LABELS: Record<NumerologyInputType, { label: string; icon: React.ElementType; color: string }> = {
    base: { label: "Single", icon: User, color: "bg-blue-50 text-blue-600 border-blue-200" },
    twoPerson: { label: "Pair", icon: Users, color: "bg-purple-50 text-purple-600 border-purple-200" },
    family: { label: "Family", icon: Users, color: "bg-rose-50 text-rose-600 border-rose-200" },
    team: { label: "Team", icon: Users, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    business: { label: "Business", icon: HomeIcon, color: "bg-teal-50 text-teal-600 border-teal-200" },
    dateRange: { label: "Dates", icon: User, color: "bg-orange-50 text-orange-600 border-orange-200" },
    number: { label: "Number", icon: User, color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
    custom: { label: "Custom", icon: User, color: "bg-amber-50 text-amber-600 border-amber-200" },
};

interface ServiceEndpointCardProps {
    endpoint: NumerologyEndpointMeta;
    onClick: () => void;
}

export default function ServiceEndpointCard({ endpoint, onClick }: ServiceEndpointCardProps) {
    const Icon = endpoint.icon;
    const badge = INPUT_TYPE_LABELS[endpoint.inputType];
    const BadgeIcon = badge.icon;

    return (
        <button
            onClick={onClick}
            className={cn(
                "prem-card group text-left relative overflow-hidden transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                "flex flex-col p-4 min-h-[170px]",
            )}
        >
            {/* Gold accent top edge on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-active-glow/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Left gold accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-active-glow via-gold-primary to-active-glow/40 rounded-l" />

            {/* Top: Icon + AI badge */}
            <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,162,77,0.12) 0%, rgba(180,130,50,0.06) 100%)',
                        border: '1px solid rgba(201,162,77,0.20)',
                    }}
                >
                    <Icon className="w-4 h-4 text-amber-700" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider bg-amber-100/80 text-amber-700 border border-amber-200/60">
                    <Sparkles className="w-2 h-2" />
                    AI
                </span>
            </div>

            {/* Title */}
            <h3 className="text-[13px] font-semibold text-primary group-hover:text-gold-dark transition-colors leading-snug mb-1">
                {endpoint.name}
            </h3>

            {/* Description — clamped to 2 lines */}
            <p className="text-[11px] text-primary/55 leading-relaxed line-clamp-2 mb-auto">
                {endpoint.description}
            </p>

            {/* Bottom: Input type badge */}
            <div className="mt-3 pt-2 border-t border-gold-primary/10">
                <span className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border",
                    badge.color,
                )}>
                    <BadgeIcon className="w-2.5 h-2.5" />
                    {badge.label}
                </span>
            </div>
        </button>
    );
}
