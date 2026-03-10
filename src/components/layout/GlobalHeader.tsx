"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Clock, ChevronDown, Menu, Bell } from "lucide-react";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";
import NavLink, { type NavSubItem } from "@/components/layout/NavLink";
import GlobalSettingsModal from "@/components/layout/GlobalSettingsModal";
import { CLIENTS_General_Sidebar, NUMEROLOGY_SYSTEMS } from "@/config/sidebarConfig";

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

export default function GlobalHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const { user, logout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
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
        if (path === "/" && pathname === "/dashboard") return true;
        if (path === "/dashboard" && pathname === "/dashboard") return true;
        if (path !== "/" && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14" role="banner">
            <div className="relative h-full w-full flex items-center justify-between px-5 lg:px-8 bg-header-gradient"
                 style={{
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 20px rgba(42,24,16,0.35), 0 1px 4px rgba(42,24,16,0.25)',
                 }}>
                {/* Top light edge — glass refraction */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {/* Bottom warm glow edge */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-active-glow/30 to-transparent" />

                {/* LEFT: Brand + Navigation */}
                <div className="flex items-center gap-5 md:gap-7">
                    <button
                        onClick={() => setIsMobileNavOpen(true)}
                        className="md:hidden header-icon-btn"
                        aria-label="Open navigation menu"
                        aria-expanded={isMobileNavOpen}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <Link href="/dashboard" className="group flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden relative"
                             style={{
                                 background: 'linear-gradient(135deg, rgba(201,162,77,0.25) 0%, rgba(85,37,15,0.6) 100%)',
                                 border: '1px solid rgba(208,140,96,0.45)',
                                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 0 10px rgba(201,162,77,0.15)',
                             }}>
                            <span className="text-active-glow font-serif font-bold text-lg leading-none">G</span>
                        </div>
                        <span className="text-white font-semibold text-[17px] tracking-wide group-hover:text-active-glow transition-colors hidden sm:inline">
                            Grahvani
                        </span>
                    </Link>

                    {/* Glass separator between brand and nav */}
                    <div className="header-divider hidden md:block" />

                    <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                        <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
                        <NavLink href="/clients" label="Clients" active={isActive("/clients")} subItems={CLIENT_SUB_ITEMS} />
                        <NavLink href="/vedic-astrology" label="Vedic Astrology" active={isActive("/vedic-astrology")} />
                        <NavLink href="/muhurta" label="Muhurta" active={isActive("/muhurta")} />
                        <NavLink href="/matchmaking" label="Matchmaking" active={isActive("/matchmaking")} />
                        <NavLink href="/numerology" label="Numerology" active={isActive("/numerology")} subItems={NUMEROLOGY_SUB_ITEMS} />
                        <NavLink href="/calendar" label="Calendar" active={isActive("/calendar")} />
                    </nav>
                </div>

                {/* RIGHT: Context + Actions + Profile */}
                <div className="flex items-center gap-3 lg:gap-4">
                    {/* Ayanamsa & Time chip */}
                    <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg"
                         style={{
                             background: 'rgba(255,255,255,0.06)',
                             border: '1px solid rgba(208,140,96,0.18)',
                         }}>
                        <span className="text-[11px] font-semibold tracking-wider text-white/85">{settings.ayanamsa}</span>
                        <div className="w-[1px] h-3.5 bg-white/15" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-active-glow/70" />
                            <span className="text-[11px] font-mono font-semibold text-active-glow/90 tracking-wide" suppressHydrationWarning>
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
                            <Bell className="w-[18px] h-[18px]" />
                        </button>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="header-icon-btn group"
                            aria-label="Ayanamsa & chart settings"
                            title="Ayanamsa & chart settings"
                        >
                            <Settings className="w-[18px] h-[18px] group-hover:rotate-45 transition-transform duration-500" />
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
                                "w-3.5 h-3.5 text-white/50 transition-all duration-300 group-hover:text-white/80",
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

            {isSettingsOpen && (
                <GlobalSettingsModal onClose={() => setIsSettingsOpen(false)} router={router} />
            )}

            {isMobileNavOpen && (
                <MobileNav onClose={() => setIsMobileNavOpen(false)} />
            )}
        </header>
    );
}
