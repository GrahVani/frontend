"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { AiNarrative } from "@/types/numerology.types";
import { ChevronDown, Sparkles } from "lucide-react";

interface AiNarrativePanelProps {
    narrative: AiNarrative;
    className?: string;
}

export default function AiNarrativePanel({ narrative, className }: AiNarrativePanelProps) {
    const [expanded, setExpanded] = React.useState(false);

    if (!narrative.available || !narrative.personalized_reading) {
        return null;
    }

    return (
        <div className={cn("prem-card overflow-hidden", className)}>
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gold-primary/5 transition-colors"
                aria-expanded={expanded}
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-[14px] font-semibold text-primary">AI Personalized Reading</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-amber-600 transition-transform", expanded && "rotate-180")} />
            </button>

            {expanded && (
                <div className="px-5 pb-5 border-t border-gold-primary/10">
                    <p className="text-[14px] text-primary leading-relaxed pt-4 whitespace-pre-line">
                        {narrative.personalized_reading}
                    </p>
                </div>
            )}
        </div>
    );
}
