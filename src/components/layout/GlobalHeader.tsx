"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Clock, ChevronDown, Menu, Bell, Heart, Hash, Calendar } from "lucide-react";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";
import NavLink, { type NavSubItem } from "@/components/layout/NavLink";
import GlobalSettingsModal from "@/components/layout/GlobalSettingsModal";
import ClientSwitcherBar from "@/components/layout/ClientSwitcherBar";
import { CLIENTS_General_Sidebar, NUMEROLOGY_SYSTEMS, CALENDAR_Sidebar } from "@/config/sidebarConfig";
import { useVedicClient } from "@/context/VedicClientContext";
import { X, UserCheck, Lock } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const CLIENT_SUB_ITEMS: NavSubItem[] = CLIENTS_General_Sidebar.map((s) => ({
    name: s.name,
    path: s.path,
    icon: s.icon,
}));

const NUMEROLOGY_SUB_ITEMS: NavSubItem[] = NUMEROLOGY_SYSTEMS.map((s) => ({
    name: s.name,
    path: s.path,
    icon: s.icon,
}));

const CALENDAR_SUB_ITEMS: NavSubItem[] = CALENDAR_Sidebar.map((s) => ({
    name: s.name,
    path: s.path,
    icon: s.icon,
}));

export default function GlobalHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { ayanamsa, chartStyle, recentClientIds, updateSettings } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const { user, logout } = useAuth();
    const { isClientSet, clientDetails, clearClientDetails } = useVedicClient();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
    const toast = useToast();
    const searchParams = useSearchParams();
    const redirectParam = searchParams.get('redirect');

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdowns on Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isSettingsOpen) setIsSettingsOpen(false);
                if (isProfileOpen) setIsProfileOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen, isProfileOpen]);

    // Hide header on authentication pages
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    const isActive = (path: string) => {
        // Special case for Workbench (Customize)
        if (path === "/vedic-astrology/customize") {
            if (pathname === "/vedic-astrology/customize") return true;
            if (pathname === "/vedic-astrology" && redirectParam === "/vedic-astrology/customize") return true;
            return false;
        }

        // Dashboard logic
        if (path === "/" && (pathname === "/dashboard" || pathname?.startsWith("/clients"))) return true;
        if (path === "/dashboard" && (pathname === "/dashboard" || pathname?.startsWith("/clients"))) return true;

        // Shared Vedic layout check
        const isVedicPath = pathname?.startsWith("/vedic-astrology");

        // KP Tab logic: highlight if ayanamsa is KP AND we are within the vedic system
        if (path === "/vedic-astrology/kp-tab") {
            return isVedicPath && ayanamsa === 'KP';
        }

        // Vedic Astrology Tab logic: highlight if NOT KP and within the vedic system
        if (path === "/vedic-astrology/vedic-tab") {
            // Exceptions for other specific tabs like Panchang or Workbench
            if (pathname?.startsWith("/vedic-astrology/panchanga") || pathname?.startsWith("/vedic-astrology/customize")) return false;
            return isVedicPath && ayanamsa !== 'KP';
        }

        // Generic path matching for other tabs
        if (path !== "/" && pathname?.startsWith(path)) return true;
        return false;
    };

    const handleProtectedClick = (e: React.MouseEvent, overrideHandler?: (e: React.MouseEvent) => void) => {
        if (!isClientSet) {
            e.preventDefault();
            toast.warning("Please select a client from Dashboard to continue.");
            if (pathname !== "/dashboard") {
                router.push("/dashboard");
            }
            return;
        }
        if (overrideHandler) overrideHandler(e);
    };

    const handleKPClick = (e: React.MouseEvent) => {
        handleProtectedClick(e, () => {
            if (ayanamsa !== 'KP') {
                updateSettings({ ayanamsa: 'KP' });
            }
        });
    };

    const handleVedicClick = (e: React.MouseEvent) => {
        handleProtectedClick(e, () => {
            if (ayanamsa === 'KP') {
                updateSettings({ ayanamsa: 'Lahiri' });
            }
        });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14" role="banner">
            <div className="relative h-full w-full flex items-center justify-between px-1 lg:px-4 bg-header-gradient"
                style={{
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 20px rgba(42,24,16,0.35), 0 1px 4px rgba(42,24,16,0.25)',
                }}>
                {/* Top light edge — glass refraction */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {/* Bottom warm glow edge */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-active-glow/30 to-transparent" />

                {/* LEFT: Brand + Navigation */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setIsMobileNavOpen(true)}
                        className="md:hidden header-icon-btn"
                        aria-label="Open navigation menu"
                        aria-expanded={isMobileNavOpen}
                    >
                        <Menu className="w-5 h-5 text-white" />
                    </button>

                    <Link href="/dashboard" className="group flex items-center gap-1 -ml-3">
                        <div className="relative flex items-center py-1">
                            <Image
                                src="/Logo.png"
                                alt="Grahvani Logo"
                                width={180}
                                height={90}
                                className="object-contain contrast-[1.1] brightness-[1.1] select-none"
                                style={{
                                    height: '52px',
                                    width: 'auto',
                                    maxWidth: 'none',
                                    display: 'block'
                                }}
                                priority
                                unoptimized
                            />
                        </div>
                        <span
                            className="font-serif font-bold text-[22px] tracking-[0.12em] uppercase hidden lg:inline -ml-1 select-none"
                            style={{
                                background: 'linear-gradient(to bottom, #fffb4f 0%, #ffe14a 25%, #e2b226 50%, #c18c19 75%, #b67c00 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))',
                                display: 'inline-block',
                                lineHeight: '1.2'
                            }}
                        >
                            GRAHVANI
                        </span>
                    </Link>

                    {/* Glass separator between brand and nav */}
                    <div className="header-divider hidden md:block" />

                    <nav className="hidden md:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
                        <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
                        <NavLink href={isClientSet ? "/vedic-astrology/customize" : "/vedic-astrology?redirect=/vedic-astrology/customize"} label="Workbench" active={isActive("/vedic-astrology/customize")} onClick={handleProtectedClick} isLocked={!isClientSet} />
                        <NavLink href={isClientSet ? "/vedic-astrology/overview" : "/vedic-astrology"} label="Vedic Astrology" active={isActive("/vedic-astrology/vedic-tab")} onClick={handleVedicClick} isLocked={!isClientSet} />
                        <NavLink href={isClientSet ? "/vedic-astrology/overview" : "/vedic-astrology/overview"} label="KP" active={isActive("/vedic-astrology/kp-tab")} onClick={handleKPClick} isLocked={!isClientSet} />
                        <NavLink href="/vedic-astrology/panchanga" label="Panchang" active={isActive("/vedic-astrology/panchanga")} onClick={handleProtectedClick} isLocked={!isClientSet} />
                        <NavLink href="/muhurta" label="Muhurta" active={isActive("/muhurta")} onClick={handleProtectedClick} isLocked={!isClientSet} />
                        
                        {/* Overflowing Items Grouped */}
                        <NavLink 
                            href="#" 
                            label="More" 
                            active={isActive("/matchmaking") || isActive("/numerology") || isActive("/calendar")}
                            subItems={[
                                { name: "Matchmaking", path: "/matchmaking", icon: Heart },
                                { name: "Numerology", path: "/numerology", icon: Hash },
                                { name: "Calendar", path: "/calendar", icon: Calendar },
                            ]}
                        />
                    </nav>
                </div>

                {/* RIGHT: Context + Actions + Profile */}
                <div className="flex items-center gap-3 lg:gap-4">
                    {/* Client chip removed — replaced by ClientSwitcherBar below */}

                    {/* Ayanamsa & Time chip */}
                    <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(208,140,96,0.18)',
                        }}>
                        <span className="text-[11px] font-semibold tracking-wider text-white">{settings.ayanamsa}</span>
                        <div className="w-[1px] h-3.5 bg-white/15" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="text-[11px] font-mono font-semibold text-white tracking-wide" suppressHydrationWarning>
                                {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                            </span>
                        </div>
                    </div>

                    <div className="header-divider hidden lg:block" />

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                        <button
                            className="header-icon-btn"
                            aria-label="Notifications"
                            title="Notifications"
                        >
                            <Bell className="w-[18px] h-[18px] text-white" />
                        </button>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="header-icon-btn group"
                            aria-label="Ayanamsa & chart settings"
                            title="Ayanamsa & chart settings"
                        >
                            <Settings className="w-[18px] h-[18px] text-white group-hover:rotate-45 transition-transform duration-500" />
                        </button>
                    </div>

                    <div className="header-divider" />

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 rounded-xl py-1 px-1.5 group hover:bg-white/[0.06] transition-all duration-200"
                            aria-haspopup="true"
                            aria-expanded={isProfileOpen}
                            aria-label="User menu"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-serif overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(201,162,77,0.30) 0%, rgba(85,37,15,0.50) 100%)',
                                    border: '1px solid rgba(208,140,96,0.40)',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                                    color: '#FFD27D',
                                }}>
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold">{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
                                )}
                            </div>
                            <ChevronDown className={cn(
                                "w-3.5 h-3.5 text-white transition-all duration-300 group-hover:text-white",
                                isProfileOpen && "rotate-180"
                            )} />
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} aria-hidden="true" />
                                <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(255,249,240,0.97) 0%, rgba(250,239,216,0.98) 100%)',
                                        backdropFilter: 'blur(20px) saturate(1.4)',
                                        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                                        border: '1px solid rgba(208,140,96,0.20)',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(42,24,16,0.20), 0 2px 8px rgba(42,24,16,0.12)',
                                    }}
                                    role="menu" aria-label="User menu">
                                    <div className="p-5" style={{ background: 'linear-gradient(135deg, rgba(152,82,47,0.95) 0%, rgba(118,58,31,0.97) 100%)' }}>
                                        <p className="text-white font-bold text-[15px] truncate" title={user?.name || user?.email || ''}>
                                            {user?.name || user?.email}
                                        </p>
                                        <p className="text-active-glow/80 text-[12px] font-medium tracking-wide mt-1 truncate" title={`${user?.role || 'Astrologer'} • ${user?.email || ''}`}>
                                            {user?.role || 'Astrologer'} &middot; {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/profile" role="menuitem" className="flex items-center gap-3 px-4 py-3 text-[13px] text-ink hover:bg-bg-hover rounded-xl transition-colors font-medium" onClick={() => setIsProfileOpen(false)}>
                                            <User className="w-4 h-4 text-copper-dark" />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link href="/settings" role="menuitem" className="flex items-center gap-3 px-4 py-3 text-[13px] text-ink hover:bg-bg-hover rounded-xl transition-colors font-medium" onClick={() => setIsProfileOpen(false)}>
                                            <Settings className="w-4 h-4 text-copper-dark" />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="h-[1px] bg-border-divider/40 my-2 mx-3" role="separator" />
                                        <button
                                            role="menuitem"
                                            onClick={() => { setIsProfileOpen(false); logout(); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-700 hover:bg-red-50 rounded-xl transition-colors font-bold"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Client Switcher Bar — multi-client tabs */}
            <ClientSwitcherBar />

            {isSettingsOpen && (
                <GlobalSettingsModal onClose={() => setIsSettingsOpen(false)} router={router} />
            )}

            {isMobileNavOpen && (
                <MobileNav onClose={() => setIsMobileNavOpen(false)} />
            )}
        </header>
    );
}
