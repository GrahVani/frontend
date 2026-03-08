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

const variantConfig: Record<DialogVariant, { icon: React.ElementType; iconBg: string; confirmClass: string }> = {
    danger: {
        icon: XCircle,
        iconBg: 'rgba(220,38,38,0.08)',
        confirmClass: "bg-status-error text-white hover:bg-status-error/90",
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'rgba(181,137,31,0.10)',
        confirmClass: "bg-status-warning text-white hover:bg-status-warning/90",
    },
    info: {
        icon: Info,
        iconBg: 'rgba(201,162,77,0.12)',
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={dialogRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-desc"
                className="w-full max-w-md rounded-2xl animate-in zoom-in-95 duration-300"
                style={{
                    background: 'linear-gradient(165deg, rgba(255,253,249,0.95) 0%, rgba(250,245,234,0.92) 50%, rgba(255,253,249,0.93) 100%)',
                    border: '1px solid rgba(220,201,166,0.35)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 25px 60px rgba(62,46,22,0.18), 0 8px 24px rgba(62,46,22,0.10)',
                }}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                             style={{
                                 background: config.iconBg,
                                 border: `1px solid ${variant === 'danger' ? 'rgba(220,38,38,0.15)' : variant === 'warning' ? 'rgba(181,137,31,0.18)' : 'rgba(201,162,77,0.20)'}`,
                             }}>
                            <Icon className={cn("w-5 h-5",
                                variant === "danger" && "text-status-error",
                                variant === "warning" && "text-status-warning",
                                variant === "info" && "text-gold-dark"
                            )} />
                        </div>
                        <div className="pt-0.5">
                            <h3 id="confirm-title" className="text-[17px] font-serif font-bold text-ink">{title}</h3>
                            <p id="confirm-desc" className="text-[13px] text-ink/55 mt-1.5 leading-relaxed font-medium">{description}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-ink/55 hover:text-ink/80 hover:bg-surface-warm/50 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        onClick={onConfirm}
                        className={cn("px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all", config.confirmClass)}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
