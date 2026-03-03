"use client";

import React from "react";
import { Users, Database, Construction, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div role="status" aria-label={title} className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
            {Icon && (
                <div className="w-16 h-16 rounded-full bg-parchment border border-antique flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-gold-dark" />
                </div>
            )}
            <h3 className="text-lg font-serif font-bold text-ink mb-1">{title}</h3>
            {description && <p className="text-sm text-muted-refined max-w-sm">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

// Pre-built variants
export function NoClientsEmpty({ action }: { action?: React.ReactNode }) {
    return (
        <EmptyState
            icon={Users}
            title="No clients yet"
            description="Create your first client to begin generating birth charts and predictions."
            action={action}
        />
    );
}

export function NoDataEmpty({ title = "No data available" }: { title?: string }) {
    return (
        <EmptyState
            icon={Database}
            title={title}
            description="There is nothing to display at this time."
        />
    );
}

export function ComingSoonEmpty({ title = "Coming soon" }: { title?: string }) {
    return (
        <EmptyState
            icon={Construction}
            title={title}
            description="This feature is under development and will be available in a future update."
        />
    );
}
