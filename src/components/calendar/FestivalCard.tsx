"use client";

import { Star, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import type { Festival } from "@/types/calendar.types";

interface FestivalCardProps {
    festival: Festival;
    className?: string;
}

const getFestivalBadge = (festival: Festival): { variant: "default" | "success" | "info" | "warning"; label: string } => {
    if (festival.is_government_holiday) return { variant: "warning", label: "Holiday" };
    if (festival.category === "MAJOR") return { variant: "success", label: "Major" };
    if (festival.category === "EKADASHI") return { variant: "info", label: "Ekadashi" };
    if (festival.category === "SANKRANTI") return { variant: "info", label: "Sankranti" };
    if (festival.category === "REGIONAL") return { variant: "info", label: "Regional" };
    return { variant: "default", label: festival.category || "Hindu" };
};

export default function FestivalCard({ festival, className }: FestivalCardProps) {
    const badge = getFestivalBadge(festival);

    return (
        <Link href={`/calendar/festivals/${festival.date}`} className="block group">
            <div className={cn("prem-card p-4 hover:shadow-md transition-all border border-transparent hover:border-gold-primary/30 relative overflow-hidden", className)}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Star className={cn("w-4 h-4", festival.category === 'MAJOR' ? "text-gold-primary" : "text-gold-primary/50")} />
                        <h3 className="text-[14px] font-serif font-bold text-primary group-hover:text-gold-dark transition-colors">
                            {festival.name} {festival.name_hi && <span className="text-[12px] text-primary ml-1 font-normal">({festival.name_hi})</span>}
                        </h3>
                    </div>
                    {badge && <Badge variant={badge.variant as any} size="sm">{badge.label}</Badge>}
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[12px] text-primary font-medium">
                        {new Date(festival.date).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
                <p className="text-[12px] text-primary mb-1 leading-relaxed line-clamp-2">{festival.description}</p>
                <div className="mt-3 text-[11px] font-bold text-gold-dark uppercase flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bottom-4">
                    <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </Link>
    );
}
