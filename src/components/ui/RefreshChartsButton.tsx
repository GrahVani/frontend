"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshChartsButtonProps {
    onClick: () => void;
    isRefreshing?: boolean;
    className?: string;
}

export default function RefreshChartsButton({ onClick, isRefreshing, className }: RefreshChartsButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isRefreshing}
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors",
                "text-ink/45 border-gold-primary/20 hover:border-gold-primary/50 hover:text-gold-dark",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className,
            )}
            title="Refresh chart data"
        >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
    );
}
