"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Moon,
    Orbit,
    FileText,
    GitCompare,
    Settings,
    ChevronRight,
    LayoutTemplate
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

interface ClientSidebarProps {
    basePath: string;
}

export default function ClientSidebar({ basePath }: ClientSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', path: '/overview', icon: LayoutTemplate },
        { name: 'Charts', path: '/charts', icon: LayoutDashboard },
        { name: 'Planet Position', path: '/planet-position', icon: Orbit },
        { name: 'Dashas', path: '/dashas', icon: Moon },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Comparison', path: '/comparison', icon: GitCompare },
    ];

    return (
        <aside
            className="w-full h-full py-6 md:px-1.5 lg:px-4 flex flex-col gap-2 border-r border-header-border/30 bg-header-gradient shadow-[inset_0_2px_4px_rgba(255,210,125,0.15),inset_0_-2px_4px_rgba(0,0,0,0.3)]"
        >
            <div className="mb-6 px-2 hidden lg:block">
                <h3 className={cn(TYPOGRAPHY.label, "!text-xs !font-bold !text-header-border tracking-widest !mb-0")}>
                    Workspace
                </h3>
            </div>

            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const fullPath = `${basePath}${item.path}`;
                    const isActive = pathname.startsWith(fullPath);

                    return (
                        <Link
                            key={item.name}
                            href={fullPath}
                            title={item.name}
                            className={cn(
                                "flex items-center md:justify-center lg:justify-between px-3 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-softwhite/10 text-active-glow font-bold shadow-sm border border-header-border/50"
                                    : "text-white hover:bg-softwhite/5 hover:text-active-glow"
                            )}
                        >
                            <div className="flex items-center gap-3 md:gap-0 lg:gap-3">
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-active-glow" : "text-header-border group-hover:text-active-glow")} />
                                <span className={cn(TYPOGRAPHY.value, "!text-sm tracking-wide !mt-0 hidden lg:inline", isActive ? "!text-active-glow" : "!text-white")}>{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-active-glow hidden lg:block" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-header-border/30 px-2 md:px-0 lg:px-2">
                <Link
                    href={`${basePath}/settings`}
                    title="Settings"
                    className="flex items-center md:justify-center lg:justify-start gap-3 text-softwhite/70 hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    <span className={cn(TYPOGRAPHY.value, "!text-sm !mt-0 hidden lg:inline")}>Settings</span>
                </Link>
            </div>
        </aside>
    );
}
