"use client";

import React from "react";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: DialogVariant;
    onConfirm: () => void;
    onCancel: () => void;
}

const variantConfig: Record<DialogVariant, { icon: React.ElementType; confirmClass: string }> = {
    danger: {
        icon: XCircle,
        confirmClass: "bg-status-error text-white hover:bg-status-error/90",
    },
    warning: {
        icon: AlertTriangle,
        confirmClass: "bg-status-warning text-white hover:bg-status-warning/90",
    },
    info: {
        icon: Info,
        confirmClass: "bg-gold-primary text-ink hover:bg-gold-soft",
    },
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "info",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const confirmRef = React.useRef<HTMLButtonElement>(null);
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const config = variantConfig[variant];
    const Icon = config.icon;

    // Focus trap + Escape
    React.useEffect(() => {
        if (!open) return;
        confirmRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
            if (e.key === "Tab" && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={dialogRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-desc"
                className="w-full max-w-md bg-surface-modal rounded-2xl shadow-2xl border border-header-border/20 animate-in zoom-in-95 duration-300"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            variant === "danger" && "bg-status-error/10 text-status-error",
                            variant === "warning" && "bg-status-warning/10 text-status-warning",
                            variant === "info" && "bg-gold-primary/10 text-gold-primary"
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 id="confirm-title" className="text-lg font-serif font-bold text-ink">{title}</h3>
                            <p id="confirm-desc" className="text-sm text-secondary mt-1">{description}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-secondary hover:bg-parchment transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        onClick={onConfirm}
                        className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-colors", config.confirmClass)}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
