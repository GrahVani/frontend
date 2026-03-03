"use client";

import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastData {
    id: string;
    message: string;
    variant: ToastVariant;
    duration?: number;
}

const variantConfig: Record<ToastVariant, { icon: React.ElementType; className: string }> = {
    success: {
        icon: CheckCircle,
        className: "border-status-success/30 bg-status-success/5 text-status-success",
    },
    error: {
        icon: XCircle,
        className: "border-status-error/30 bg-status-error/5 text-status-error",
    },
    warning: {
        icon: AlertTriangle,
        className: "border-status-warning/30 bg-status-warning/5 text-status-warning",
    },
    info: {
        icon: Info,
        className: "border-status-info/30 bg-status-info/5 text-status-info",
    },
};

export function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
    const config = variantConfig[toast.variant];
    const Icon = config.icon;

    React.useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 5000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onDismiss]);

    const isError = toast.variant === 'error' || toast.variant === 'warning';

    return (
        <div
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
            aria-atomic="true"
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm",
                "animate-in slide-in-from-right-full fade-in duration-300",
                "font-sans text-sm font-medium max-w-md",
                config.className
            )}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="flex-1">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-20 right-4 z-[200] flex flex-col gap-2"
            aria-live="polite"
        >
            {toasts.slice(0, 3).map((toast) => (
                <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}
