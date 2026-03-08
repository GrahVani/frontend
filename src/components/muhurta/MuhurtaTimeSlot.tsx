"use client";

import { Clock, CheckCircle, AlertTriangle, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MuhurtaQuality, MuhurtaTimeWindow } from "@/types/muhurta.types";

const QUALITY_CONFIG: Record<MuhurtaQuality, {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    label: string;
}> = {
    excellent: {
        icon: CheckCircle,
        color: "text-status-success",
        bg: "bg-status-success/10",
        border: "border-status-success/30",
        label: "Excellent",
    },
    good: {
        icon: CheckCircle,
        color: "text-gold-dark",
        bg: "bg-gold-primary/10",
        border: "border-gold-primary/30",
        label: "Good",
    },
    average: {
        icon: MinusCircle,
        color: "text-status-warning",
        bg: "bg-status-warning/10",
        border: "border-status-warning/30",
        label: "Average",
    },
    avoid: {
        icon: XCircle,
        color: "text-status-error",
        bg: "bg-status-error/10",
        border: "border-status-error/30",
        label: "Avoid",
    },
};

interface MuhurtaTimeSlotProps {
    window: MuhurtaTimeWindow;
    isActive?: boolean;
    className?: string;
}

export default function MuhurtaTimeSlot({ window: tw, isActive, className }: MuhurtaTimeSlotProps) {
    const config = QUALITY_CONFIG[tw.quality];
    const QualityIcon = config.icon;

    return (
        <div
            className={cn(
                "rounded-xl p-4 border transition-all",
                config.bg, config.border,
                isActive && "ring-2 ring-gold-primary/50",
                className
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <QualityIcon className={cn("w-4 h-4", config.color)} />
                    <h3 className="text-[14px] font-serif font-bold text-ink">{tw.name}</h3>
                </div>
                <span className={cn("text-[12px] font-medium px-2 py-0.5 rounded-full", config.bg, config.color)}>
                    {config.label}
                </span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-ink/45" />
                <span className="text-[14px] font-medium text-ink">{tw.startTime} — {tw.endTime}</span>
            </div>
            {tw.description && (
                <p className="text-[12px] text-ink/45 leading-relaxed">{tw.description}</p>
            )}
        </div>
    );
}
