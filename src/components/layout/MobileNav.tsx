"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Users, Star, Clock, Heart, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/vedic-astrology", label: "Vedic Astrology", icon: Star },
    { href: "/muhurta", label: "Muhurta", icon: Clock },
    { href: "/matchmaking", label: "Matchmaking", icon: Heart },
    { href: "/calendar", label: "Calendar", icon: Calendar },
];

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const pathname = usePathname();
    const overlayRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

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
                aria-expanded={isOpen}
                className="absolute left-0 top-0 bottom-0 w-72 bg-header-gradient shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-header-border/30">
                    <span className="font-serif text-xl font-bold text-white tracking-wide">Grahvani</span>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        aria-label="Close navigation"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Links */}
                <div className="flex-1 py-4 px-3 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
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
                                <span className="font-serif text-sm tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
