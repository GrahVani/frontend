"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Users, Star, Clock, Heart, Calendar, ChevronDown, Settings, Hash, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { SidebarItem } from "@/components/layout/SectionSidebar";
import {
    CLIENTS_General_Sidebar,
    MUHURTA_Sidebar,
    MATCHMAKING_Sidebar,
    CALENDAR_Sidebar,
    SETTINGS_Sidebar,
    NUMEROLOGY_SYSTEMS,
} from "@/config/sidebarConfig";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    subItems?: SidebarItem[];
}

const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users, subItems: CLIENTS_General_Sidebar },
    { href: "/vedic-astrology", label: "Vedic Astrology", icon: Star },
    { href: "/vedic-astrology/panchanga", label: "Panchang", icon: Sparkle },
    { href: "/muhurta", label: "Muhurta", icon: Clock, subItems: MUHURTA_Sidebar },
    { href: "/numerology", label: "Numerology", icon: Hash, subItems: NUMEROLOGY_SYSTEMS },
    { href: "/matchmaking", label: "Matchmaking", icon: Heart, subItems: MATCHMAKING_Sidebar },
    { href: "/calendar", label: "Calendar", icon: Calendar, subItems: CALENDAR_Sidebar },
    { href: "/settings", label: "Settings", icon: Settings, subItems: SETTINGS_Sidebar },
];

export default function MobileNav({ onClose }: { onClose: () => void }) {
    const pathname = usePathname();
    const overlayRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [onClose]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[60] md:hidden"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

            {/* Panel */}
            <nav
                role="navigation"
                aria-label="Mobile navigation"
                aria-expanded={true}
                className="absolute left-0 top-0 bottom-0 w-72 max-w-[80vw] bg-header-gradient shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-header-border/30">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/Logo.png"
                            alt="Grahvani Logo"
                            width={32}
                            height={32}
                            className="object-contain mix-blend-multiply"
                            unoptimized
                        />
                        <span
                            className={cn(TYPOGRAPHY.sectionTitle, "text-lg !font-bold !mb-0 tracking-[0.15em] uppercase font-serif")}
                            style={{
                                background: 'linear-gradient(to bottom, #fffb4f 0%, #ffe14a 25%, #e2b226 50%, #c18c19 75%, #b67c00 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
                            }}
                        >
                            GRAHVANI
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        aria-label="Close navigation"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Links */}
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        const Icon = item.icon;
                        const hasSubItems = isActive && item.subItems && item.subItems.length > 0;

                        return (
                            <div key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 min-h-[48px]",
                                        isActive
                                            ? "bg-softwhite/10 text-active-glow font-bold border border-header-border/40"
                                            : "text-white hover:bg-softwhite/5 hover:text-active-glow"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-active-glow" : "text-header-border")} />
                                    <span className={cn(TYPOGRAPHY.value, "!text-sm tracking-wide !mt-0 flex-1", isActive ? "!text-active-glow" : "!text-white")}>{item.label}</span>
                                    {hasSubItems && <ChevronDown className="w-3.5 h-3.5 text-active-glow/60" />}
                                </Link>

                                {/* Sub-items for active section */}
                                {hasSubItems && (
                                    <div className="ml-6 mt-1 mb-2 space-y-0.5 border-l border-header-border/20 pl-3">
                                        {item.subItems!.map((sub) => {
                                            const subHref = sub.path.startsWith('/') ? sub.path : `${item.href}/${sub.path}`;
                                            const isSubActive = pathname === subHref;
                                            const SubIcon = sub.icon;
                                            return (
                                                <Link
                                                    key={sub.name}
                                                    href={subHref}
                                                    onClick={onClose}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors",
                                                        isSubActive
                                                            ? "text-active-glow font-bold bg-softwhite/5"
                                                            : "text-white/60 hover:text-white hover:bg-softwhite/5"
                                                    )}
                                                >
                                                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{sub.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
