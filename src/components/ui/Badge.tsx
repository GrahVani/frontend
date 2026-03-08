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

const variantStyles: Record<BadgeVariant, { className: string; style?: React.CSSProperties }> = {
    default: {
        className: "text-ink/70",
        style: {
            background: 'linear-gradient(135deg, rgba(201,162,77,0.08) 0%, rgba(201,162,77,0.04) 100%)',
            border: '1px solid rgba(201,162,77,0.18)',
        },
    },
    success: {
        className: "text-status-success",
        style: {
            background: 'rgba(45,106,79,0.08)',
            border: '1px solid rgba(45,106,79,0.20)',
        },
    },
    warning: {
        className: "text-status-warning",
        style: {
            background: 'rgba(181,137,31,0.08)',
            border: '1px solid rgba(181,137,31,0.20)',
        },
    },
    error: {
        className: "text-status-error",
        style: {
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.18)',
        },
    },
    info: {
        className: "text-status-info",
        style: {
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.18)',
        },
    },
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-[12px]",
};

export default function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
    const isStatusBadge = variant !== "default";
    const config = variantStyles[variant];

    return (
        <span
            role={isStatusBadge ? "status" : undefined}
            className={cn(
                "inline-flex items-center font-semibold rounded-full",
                config.className,
                sizeClasses[size],
                className
            )}
            style={config.style}
        >
            {children}
        </span>
    );
}
