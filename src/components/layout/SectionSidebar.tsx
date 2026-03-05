"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, ChevronRight, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

export interface SidebarItem {
    name: string;
    path: string;
    icon: LucideIcon;
}

interface SectionSidebarProps {
    title: string;
    basePath: string;
    items: SidebarItem[];
}

export default function SectionSidebar({ title, basePath, items }: SectionSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            role="navigation"
            aria-label={`${title} section navigation`}
            className="w-full lg:w-64 h-full py-6 px-4 flex flex-col gap-2 border-r border-header-border/30 bg-header-gradient shadow-[inset_0_2px_4px_rgba(255,210,125,0.15),inset_0_-2px_4px_rgba(0,0,0,0.3)]"
        >
            <div className="mb-6 px-2">
                <h3 className={cn(TYPOGRAPHY.label, "!text-xs !font-bold !text-header-border tracking-widest !mb-0")}>
                    {title}
                </h3>
            </div>

            <nav className="space-y-1">
                {items.map((item) => {
                    const href = item.path.startsWith('/') ? item.path : `${basePath}/${item.path}`;
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);

                    return (
                        <Link
                            key={item.name}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-softwhite/10 text-active-glow font-bold shadow-sm border border-header-border/50"
                                    : "text-white hover:bg-softwhite/5 hover:text-active-glow"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-active-glow" : "text-header-border group-hover:text-active-glow")} />
                                <span className={cn(TYPOGRAPHY.value, "!text-sm tracking-wide !mt-0", isActive ? "!text-active-glow" : "!text-white")}>{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-active-glow" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-header-border/30 px-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 text-softwhite/70 hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className={cn(TYPOGRAPHY.value, "!text-sm !mt-0")}>Settings</span>
                </Link>
            </div>
        </aside>
    );
}
