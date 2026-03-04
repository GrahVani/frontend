"use client";

import React from "react";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useVedicClient } from "@/context/VedicClientContext";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { SidebarItem } from "@/components/layout/SectionSidebar";
import { clientApi } from "@/lib/api";
import { VedicClientDetails } from "@/context/VedicClientContext";
import {
    LayoutDashboard,
    Compass,
    Map,
    History,
    FileText,
    GitCompare,
    LayoutTemplate,
    Orbit,
    Globe,
    Gem,
    NotebookPen,
    User,
    ArrowLeft,
    ChevronDown,
    Shield,
    Layers,
    Sparkles,
    FlaskConical,
    Hash,
    Heart,
    HelpCircle
} from "lucide-react";

// ============================================================================
// Navigation Items with Jyotish Terminology + System Compatibility
// ============================================================================
interface NavItem extends SidebarItem {
    systemFilter?: string[];
    isOverflow?: boolean;
}

const VEDIC_NAV_ITEMS: NavItem[] = [
    { name: "Kundali", path: "/overview", icon: LayoutTemplate },
    { name: "Work Bench", path: "/workbench", icon: LayoutDashboard },
    { name: "Divisional Charts", path: "/divisional", icon: Map, systemFilter: ['Lahiri', 'Raman', 'Yukteswar', 'Bhasin'] },
    { name: "Dashas", path: "/dashas", icon: History },
    { name: "Yogas & Doshas", path: "/yoga-dosha", icon: Sparkles, systemFilter: ['Lahiri'] },
    { name: "Ashtakavargas", path: "/ashtakavarga", icon: Shield, systemFilter: ['Lahiri', 'Raman', 'Yukteswar', 'Bhasin'] },
    { name: "Shadbala", path: "/shadbala", icon: Orbit, systemFilter: ['Lahiri'] },
    { name: "Gochar", path: "/transits", icon: Globe, systemFilter: ['Lahiri', 'Yukteswar', 'Bhasin'] },
    { name: "Upaya", path: "/remedies", icon: Gem, systemFilter: ['Lahiri'] },
    { name: "Sudarshan Chakra", path: "/chakras", icon: Layers },
    { name: "KP System", path: "/kp", icon: FlaskConical, systemFilter: ['KP'] },
    { name: "Ashtakavarga", path: "/kp?tab=ashtakavarga", icon: Shield, systemFilter: ['KP'] },
    { name: "Horary", path: "/kp?tab=horary", icon: HelpCircle, systemFilter: ['KP'] },
    { name: "Compatibility", path: "/comparison", icon: Heart, isOverflow: true },
    { name: "Pushkara Navamsha", path: "/pushkara-navamsha", icon: Sparkles, isOverflow: true, systemFilter: ['Lahiri'] },
    { name: "Phala Jyotish", path: "/reports", icon: FileText, isOverflow: true },
    { name: "Notes", path: "/notes", icon: NotebookPen, isOverflow: true },
];

// ============================================================================
// Sub-Header Navigation Bar
// ============================================================================
function VedicSubHeader({ clientDetails, setClientDetails, pathname, router, ayanamsa }: {
    clientDetails: VedicClientDetails | null;
    setClientDetails: (d: VedicClientDetails | null) => void;
    pathname: string;
    router: ReturnType<typeof useRouter>;
    ayanamsa: string;
}) {
    const searchParams = useSearchParams();
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

    const filteredPrimaryItems = VEDIC_NAV_ITEMS.filter(item => {
        if (item.isOverflow) return false;
        const capabilities = clientApi.getSystemCapabilities(ayanamsa);
        if (item.name === "Divisional Charts" && !capabilities.hasDivisional) return false;
        if (item.name === "Ashtakavargas" && !capabilities.hasAshtakavarga) return false;
        if (item.name === "Shadbala" && capabilities.features.shadbala.length === 0) return false;
        if (item.name === "Gochar" && !capabilities.charts.special.includes('transit')) return false;
        if (item.name === "Sudarshan Chakra" && !capabilities.charts.special.includes('sudarshana')) return false;
        if (item.name === "KP System" && (!capabilities.hasHorary && ayanamsa !== 'KP')) return false;
        if (item.systemFilter && !item.systemFilter.includes(ayanamsa)) return false;
        return true;
    });

    const filteredOverflowItems = VEDIC_NAV_ITEMS.filter(item => {
        if (!item.isOverflow) return false;
        const capabilities = clientApi.getSystemCapabilities(ayanamsa);
        if (item.name === "Compatibility" && !capabilities.hasCompatibility) return false;
        if (item.name === "Numerology" && !capabilities.hasNumerology) return false;
        if (item.systemFilter && !item.systemFilter.includes(ayanamsa)) return false;
        return true;
    });

    return (
        <div className="sticky top-14 left-0 right-0 z-40 h-12 bg-header-gradient flex items-center px-4 md:px-6 gap-4" role="navigation" aria-label="Vedic astrology sections">
            {/* Top Border Indicator */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-header-border opacity-10" />

            {/* Bottom Ornament */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-header-border to-transparent shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />

            {/* Navigation Items */}
            <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto no-scrollbar h-full" aria-label="Vedic astrology sub-navigation">
                {filteredPrimaryItems.map((item) => {
                    const href = item.path === "" ? "/vedic-astrology" : `/vedic-astrology${item.path}`;
                    let isActive = pathname === href;

                    if (item.path.includes('?')) {
                        const [purePath, queryString] = item.path.split('?');
                        const fullPurePath = `/vedic-astrology${purePath}`;
                        const itemParams = new URLSearchParams(queryString);
                        const pathMatches = pathname === fullPurePath;
                        let paramsMatch = true;
                        itemParams.forEach((value, key) => {
                            if (searchParams.get(key) !== value) paramsMatch = false;
                        });
                        isActive = pathMatches && paramsMatch;
                    } else if (pathname === href) {
                        if (Array.from(searchParams.keys()).length > 0 && pathname === href) {
                            isActive = false;
                        } else {
                            isActive = true;
                        }
                    }

                    return (
                        <Link
                            key={item.name}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "flex items-center px-3 py-2 transition-all duration-300 relative group shrink-0 whitespace-nowrap font-serif text-sm font-medium tracking-wide",
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
            {filteredOverflowItems.length > 0 && (
                <div ref={moreRef} className="relative shrink-0 flex items-center h-full">
                    <button
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        aria-haspopup="true"
                        aria-expanded={isMoreOpen}
                        aria-label="More navigation options"
                        className={cn(
                            "flex items-center gap-1 px-3 py-2 transition-all duration-300 font-serif text-sm font-medium tracking-wide",
                            isMoreOpen
                                ? "text-active-glow"
                                : "text-white hover:text-active-glow"
                        )}
                    >
                        <span>More</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isMoreOpen && "rotate-180")} />
                    </button>

                    {isMoreOpen && (
                        <div role="menu" aria-label="Additional navigation" className="absolute top-full right-0 mt-0 w-48 bg-surface-warm border border-header-border/30 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredOverflowItems.map((item) => {
                                const href = `/vedic-astrology${item.path}`;
                                const isActive = pathname === href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={href}
                                        role="menuitem"
                                        onClick={() => setIsMoreOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-serif transition-all",
                                            isActive
                                                ? "text-header-border bg-header-border/10 font-bold"
                                                : "text-secondary hover:text-header-border hover:bg-header-border/5"
                                        )}
                                    >
                                        {Icon && <Icon className="w-4 h-4 opacity-70" />}
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Client Profile Card (Right) */}
            {clientDetails && (
                <div className="flex items-center gap-4 pl-6 border-l border-header-border/20 shrink-0 h-10 ml-4">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push(`/vedic-astrology/overview`)}
                    >
                        <div className="hidden sm:block text-right">
                            <h2 className="text-white font-serif font-semibold text-md tracking-wide group-hover:text-active-glow transition-colors">{clientDetails.name}</h2>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-ink-deep border border-header-border/30 flex items-center justify-center text-active-glow font-serif font-bold text-sm shadow-[0_0_15px_rgba(208,140,96,0.1)] group-hover:border-active-glow/50 transition-all">
                            {clientDetails.name.charAt(0)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main Layout Wrapper
// ============================================================================
export default function VedicLayout({ children }: { children: React.ReactNode }) {
    const { isClientSet, clientDetails, setClientDetails, isInitialized } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const pathname = usePathname();
    const router = useRouter();

    React.useEffect(() => {
        if (isInitialized && !isClientSet && pathname !== "/vedic-astrology") {
            router.push("/vedic-astrology");
        }
    }, [isInitialized, isClientSet, pathname, router]);

    if ((!isInitialized || !isClientSet) && pathname !== "/vedic-astrology") {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen pt-14 bg-luxury-radial relative">
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[url('/textures/aged-paper.png')] bg-blend-multiply"
            />

            {/* Sub-Header Hub */}
            {pathname !== "/vedic-astrology" && (
                <VedicSubHeader
                    clientDetails={clientDetails}
                    setClientDetails={setClientDetails}
                    pathname={pathname}
                    router={router}
                    ayanamsa={ayanamsa}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 transition-all duration-500" aria-label="Vedic astrology content">
                <div className="p-1 sm:p-2 lg:p-2 w-full h-full pb-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
