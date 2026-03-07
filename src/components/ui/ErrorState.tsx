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
            <div className={cn("flex items-center gap-3 bg-status-error/10 border border-status-error/30 rounded-lg px-4 py-3", className)} role="alert">
                <AlertTriangle className="w-4 h-4 text-status-error shrink-0" />
                <p className="text-sm text-ink flex-1">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-xs font-medium text-gold-dark hover:text-gold-primary transition-colors flex items-center gap-1"
                    >
                        <RefreshCw className="w-3 h-3" />
                        {retryLabel}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={cn("bg-status-error/5 border border-status-error/20 rounded-xl p-8 text-center", className)} role="alert">
            <AlertTriangle className="w-8 h-8 text-status-error mx-auto mb-3" />
            <h3 className="text-lg font-serif font-semibold text-ink mb-1">{title}</h3>
            <p className="text-sm text-muted-refined mb-4 max-w-md mx-auto">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-antique text-ink hover:border-gold-primary/50 hover:text-gold-dark transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {retryLabel}
                </button>
            )}
        </div>
    );
}
