"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users } from "lucide-react";
import { TYPOGRAPHY } from "@/design-tokens/typography";

export default function DashboardTabs() {
    const pathname = usePathname();

    const tabs = [
        { 
            name: 'Overview', 
            href: '/dashboard', 
            icon: LayoutDashboard,
            isActive: pathname === '/dashboard'
        },
        { 
            name: 'Clients', 
            href: '/clients', 
            icon: Users,
            isActive: pathname?.startsWith('/clients')
        },
    ];

    return (
        <div className="w-full mb-0 border-b border-header-border/10 px-4">
            <nav className="flex items-center gap-1 sm:gap-4" role="tablist" aria-label="Dashboard sections">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            role="tab"
                            aria-selected={tab.isActive}
                            aria-current={tab.isActive ? "page" : undefined}
                            className={cn(
                                "group relative flex items-center gap-2.5 px-4 py-3 transition-all duration-300",
                                tab.isActive 
                                    ? "text-ink font-bold" 
                                    : "text-ink/40 hover:text-ink/70"
                            )}
                        >
                            <Icon className={cn(
                                "w-4.5 h-4.5 transition-colors",
                                tab.isActive ? "text-ink" : "text-ink/30 group-hover:text-ink/50"
                            )} />
                            <span className={cn(
                                TYPOGRAPHY.value, 
                                "!text-[15px] tracking-widest uppercase font-serif !mt-0",
                                tab.isActive ? "!text-ink" : "!text-inherit"
                            )}>
                                {tab.name}
                            </span>
                            
                            {/* Animated underline */}
                            {tab.isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-dark shadow-[0_0_8px_rgba(201,162,77,0.3)] animate-in fade-in slide-in-from-bottom-1" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
