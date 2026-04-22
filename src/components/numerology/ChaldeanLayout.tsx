"use client";

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { ChevronDown } from "lucide-react";
import { CHALDEAN_CATEGORIES } from "@/lib/numerology-constants";
import { Calculator } from "lucide-react";
import { useVedicClient } from "@/context/VedicClientContext";

// Primary nav items (first 8 categories visible, rest in "More")
const PRIMARY_COUNT = 8;
const primaryCategories = CHALDEAN_CATEGORIES.slice(0, PRIMARY_COUNT);
const overflowCategories = CHALDEAN_CATEGORIES.slice(PRIMARY_COUNT);

// Extra items that go in the "More" dropdown
const EXTRA_ITEMS = [
    ...overflowCategories.map(c => ({ name: c.name, path: c.path, icon: c.icon })),
    { name: 'Raw Calculators', path: '/numerology/chaldean/raw-calculators', icon: Calculator },
];

function ChaldeanSubHeader({ pathname, hasClientBar }: { pathname: string; hasClientBar: boolean }) {
    const [isMoreOpen, setIsMoreOpen] = React.useState(false);
    const moreRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("sticky left-0 right-0 z-40 h-12 bg-header-gradient flex items-center px-4 md:px-6 gap-4", hasClientBar ? "top-24" : "top-14")} role="navigation" aria-label="Chaldean numerology sections">
            {/* Top Border Indicator */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gold-primary opacity-10" />

            {/* Bottom Ornament */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-primary to-transparent shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />

            {/* Navigation Items */}
            <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto no-scrollbar h-full" aria-label="Chaldean numerology sub-navigation">
                {primaryCategories.map((item) => {
                    const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

                    return (
                        <Link
                            key={item.key}
                            href={item.path}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                TYPOGRAPHY.tableHeader,
                                "flex items-center px-3 py-2 transition-all duration-300 relative group shrink-0 whitespace-nowrap !font-medium",
                                isActive
                                    ? "text-active-glow text-shadow-glow"
                                    : "text-white hover:text-active-glow"
                            )}
                        >
                            <span>{item.name}</span>
                            {isActive && (
                                <>
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-active-glow to-transparent shadow-[0_0_10px_2px_rgba(255,210,125,0.5)]" />
                                    <span
                                        className="absolute inset-0 -z-10 rounded-lg opacity-20 blur-md pointer-events-none [background:radial-gradient(ellipse_at_center,var(--active-glow)_0%,transparent_70%)]"
                                    />
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* "More" Dropdown */}
            {EXTRA_ITEMS.length > 0 && (
                <div ref={moreRef} className="relative shrink-0 flex items-center h-full">
                    <button
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        aria-haspopup="true"
                        aria-expanded={isMoreOpen}
                        aria-label="More navigation options"
                        className={cn(
                            TYPOGRAPHY.tableHeader,
                            "flex items-center gap-1 px-3 py-2 transition-all duration-300 !font-medium",
                            isMoreOpen
                                ? "text-active-glow"
                                : "text-white hover:text-active-glow"
                        )}
                    >
                        <span>More</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isMoreOpen && "rotate-180")} />
                    </button>

                    {isMoreOpen && (
                        <div role="menu" aria-label="Additional navigation" className="absolute top-full right-0 mt-0 w-48 bg-surface-warm border border-gold-primary/30 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                            {EXTRA_ITEMS.map((item) => {
                                const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        role="menuitem"
                                        onClick={() => setIsMoreOpen(false)}
                                        className={cn(
                                            TYPOGRAPHY.tableHeader,
                                            "flex items-center gap-3 px-4 py-3 transition-all !capitalize",
                                            isActive
                                                ? "text-gold-dark bg-gold-primary/10 !font-bold"
                                                : "text-primary hover:text-gold-dark hover:bg-gold-primary/5"
                                        )}
                                    >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ChaldeanLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { openClients } = useVedicClient();
    const hasClientBar = openClients.length > 0;

    return (
        <div className={cn("flex flex-col min-h-screen bg-luxury-radial relative", hasClientBar ? "pt-24" : "pt-14")}>
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[url('/textures/aged-paper.png')] bg-blend-multiply"
            />

            {/* Sub-Header Hub — always visible for category navigation */}
            <ChaldeanSubHeader pathname={pathname} hasClientBar={hasClientBar} />

            {/* Main Content Area */}
            <main className="flex-1 relative transition-all duration-500" aria-label="Chaldean numerology content">
                <div className="p-1 sm:p-2 lg:p-4 w-full h-full pb-10">
                    <PageContainer variant="wide">
                        {children}
                    </PageContainer>
                </div>
            </main>
        </div>
    );
}
