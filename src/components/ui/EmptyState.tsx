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
        <div role="status" aria-label={title} className={cn("flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-500", className)}>
            {Icon && (
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                     style={{
                         background: 'linear-gradient(135deg, rgba(201,162,77,0.14) 0%, rgba(139,90,43,0.07) 100%)',
                         border: '1px solid rgba(201,162,77,0.20)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(139,90,43,0.06)',
                     }}>
                    <Icon className="w-6 h-6 text-gold-dark/60" aria-hidden="true" />
                </div>
            )}
            <h3 className="text-[17px] font-serif font-bold text-ink mb-1.5">{title}</h3>
            {description && <p className="text-[13px] text-ink/45 max-w-sm leading-relaxed font-medium">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

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
