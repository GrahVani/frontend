"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    children: React.ReactNode;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-parchment text-ink border-antique",
    success: "bg-status-success/10 text-status-success border-status-success/30",
    warning: "bg-status-warning/10 text-status-warning border-status-warning/30",
    error: "bg-status-error/10 text-status-error border-status-error/30",
    info: "bg-status-info/10 text-status-info border-status-info/30",
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
};

export default function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
    // Status variants (success/warning/error/info) get role="status" for screen readers
    const isStatusBadge = variant !== "default";

    return (
        <span
            role={isStatusBadge ? "status" : undefined}
            className={cn(
                "inline-flex items-center font-medium rounded-full border",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    );
}
