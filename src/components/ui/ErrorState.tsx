"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
    compact?: boolean;
    className?: string;
}

export default function ErrorState({
    title = "Something went wrong",
    message = "An error occurred while loading this section. Please try again.",
    onRetry,
    retryLabel = "Try Again",
    compact = false,
    className,
}: ErrorStateProps) {
    if (compact) {
        return (
            <div className={cn("flex items-center gap-3 rounded-xl px-4 py-3", className)}
                 style={{
                     background: 'rgba(220,38,38,0.06)',
                     border: '1px solid rgba(220,38,38,0.18)',
                 }}
                 role="alert">
                <AlertTriangle className="w-4 h-4 text-status-error shrink-0" />
                <p className="text-[13px] text-ink/80 flex-1 font-medium">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-[12px] font-semibold text-gold-dark hover:text-gold-primary transition-colors flex items-center gap-1"
                    >
                        <RefreshCw className="w-3 h-3" />
                        {retryLabel}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={cn("prem-card p-8 text-center", className)} role="alert">
            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{
                     background: 'rgba(220,38,38,0.08)',
                     border: '1px solid rgba(220,38,38,0.15)',
                 }}>
                <AlertTriangle className="w-5 h-5 text-status-error" />
            </div>
            <h3 className="text-[17px] font-serif font-bold text-ink mb-1.5">{title}</h3>
            <p className="text-[13px] text-ink/45 mb-5 max-w-md mx-auto font-medium">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold rounded-xl text-ink/70 hover:text-gold-dark transition-all"
                    style={{
                        background: 'rgba(250,245,234,0.50)',
                        border: '1px solid rgba(220,201,166,0.35)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                    }}
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {retryLabel}
                </button>
            )}
        </div>
    );
}
