"use client";

import React from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "golden";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: LucideIcon;
    children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-gold-primary text-ink border border-gold-dark hover:bg-gold-soft shadow-[0_2px_4px_var(--shadow-color),inset_0_1px_0_var(--gold-soft)]",
    secondary:
        "bg-transparent text-gold-primary border border-gold-primary hover:bg-gold-primary hover:text-ink",
    ghost:
        "bg-transparent text-ink/55 hover:bg-surface-warm border border-transparent",
    danger:
        "bg-status-error text-white border border-status-error hover:bg-status-error/90",
    golden:
        "bg-gradient-to-b from-gold-soft via-gold-primary to-gold-dark text-ink border border-gold-dark font-serif font-bold tracking-wide hover:from-[#F0D88A] hover:via-[#D4A85D] hover:to-[#A6843A]",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-[12px] rounded-lg",
    md: "px-4 py-2 text-[14px] rounded-xl",
    lg: "px-6 py-3 text-[16px] rounded-xl",
};

const iconSizeClasses: Record<ButtonSize, string> = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
};

export default function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon: Icon,
    disabled,
    children,
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            aria-disabled={disabled || loading || undefined}
            className={cn(
                "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {loading ? (
                <Loader2 className={cn("animate-spin", iconSizeClasses[size])} />
            ) : Icon ? (
                <Icon className={iconSizeClasses[size]} />
            ) : null}
            {children}
        </button>
    );
}
