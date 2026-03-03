"use client";

import { Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { Festival } from "@/types/calendar.types";

interface FestivalCardProps {
    festival: Festival;
    className?: string;
}

const TYPE_BADGE: Record<Festival["type"], { variant: "default" | "success" | "info"; label: string }> = {
    hindu: { variant: "default", label: "Hindu" },
    vedic: { variant: "success", label: "Vedic" },
    regional: { variant: "info", label: "Regional" },
};

export default function FestivalCard({ festival, className }: FestivalCardProps) {
    const badge = TYPE_BADGE[festival.type];

    return (
        <div className={cn("bg-softwhite border border-antique rounded-xl p-4 hover:shadow-sm transition-shadow", className)}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gold-primary" />
                    <h3 className="text-sm font-serif font-bold text-ink">{festival.name}</h3>
                </div>
                <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-muted-refined" />
                <span className="text-xs text-muted-refined">
                    {new Date(festival.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>
            <p className="text-xs text-muted-refined mb-1">{festival.description}</p>
            <p className="text-xs text-gold-dark font-serif italic">{festival.significance}</p>
        </div>
    );
}
