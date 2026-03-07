"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, Clock, ChevronDown, Menu } from "lucide-react";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";
import NavLink from "@/components/layout/NavLink";
import GlobalSettingsModal from "@/components/layout/GlobalSettingsModal";

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
        <header className="fixed top-0 left-0 right-0 z-50 h-12" role="banner">
            <div className="relative h-full w-full flex items-center justify-between px-4 lg:px-8 bg-header-gradient shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-header-border opacity-30" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-header-border to-transparent" />

                {/* LEFT: Brand + Navigation */}
                <div className="flex items-center gap-4 md:gap-8">
                    <button
                        onClick={() => setIsMobileNavOpen(true)}
                        className="md:hidden text-white hover:text-active-glow transition-colors p-1"
                        aria-label="Open navigation menu"
                        aria-expanded={isMobileNavOpen}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link href="/dashboard" className="group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-header-border flex items-center justify-center bg-ink-deep">
                                <span className={cn(TYPOGRAPHY.value, "text-white !font-bold text-lg leading-none pt-1")}>G</span>
                            </div>
                            <span className={cn(TYPOGRAPHY.profileName, "!text-white tracking-wide group-hover:!text-header-border transition-colors")}>
                                Grahvani
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                        <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
                        <NavLink href="/clients" label="Clients" active={isActive("/clients")} />
                        <NavLink href="/vedic-astrology" label="Vedic Astrology" active={isActive("/vedic-astrology")} />
                        <NavLink href="/muhurta" label="Muhurta" active={isActive("/muhurta")} />
                        <NavLink href="/matchmaking" label="Matchmaking" active={isActive("/matchmaking")} />
                        <NavLink href="/calendar" label="Calendar" active={isActive("/calendar")} />
                    </nav>
                </div>

                {/* RIGHT: Utilities + Profile */}
                <div className="flex items-center gap-4 lg:gap-6">
                    <div className="hidden lg:flex flex-col items-end mr-2 text-right">
                        <span className={cn(TYPOGRAPHY.subValue, "!text-white tracking-wider !mt-0")}>{settings.ayanamsa} Ayanamsa</span>
                        <div className="flex items-center gap-1.5 text-white">
                            <Clock className="w-3 h-3" />
                            <span className={cn(TYPOGRAPHY.subValue, "!text-white tracking-wider !mt-0")} suppressHydrationWarning>
                                {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                            </span>
                        </div>
                    </div>

                    <div className="hidden lg:block h-8 w-[1px] bg-header-border/30" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-white hover:text-softwhite transition-colors relative group"
                            aria-label="Open global settings"
                        >
                            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-header-border rounded-full border border-mahogany" />
                        </button>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 pl-2 border-l border-header-border/30 group"
                            aria-haspopup="true"
                            aria-expanded={isProfileOpen}
                            aria-label="User menu"
                        >
                            <div className="w-8 h-8 rounded-full bg-ink-deep border border-header-border flex items-center justify-center text-softwhite font-serif text-sm group-hover:bg-ink transition-colors overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-header-border transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} aria-hidden="true" />
                                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-surface-modal rounded-2xl shadow-2xl border border-header-border/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2" role="menu" aria-label="User menu">
                                    <div className="p-5 bg-gradient-to-br from-copper-dark to-mahogany text-white">
                                        <p className={cn(TYPOGRAPHY.profileName, "!text-white !font-bold truncate")} title={user?.name || user?.email || ''}>
                                            {user?.name || user?.email}
                                        </p>
                                        <p className={cn(TYPOGRAPHY.profileDetail, "!text-active-glow/70 !tracking-wide mt-1 truncate")} title={`${user?.role || 'Astrologer'} • ${user?.email || ''}`}>
                                            {user?.role || 'Astrologer'} • {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/profile" role="menuitem" className="flex items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-bg-hover rounded-xl transition-colors font-medium" onClick={() => setIsProfileOpen(false)}>
                                            <User className="w-4 h-4 text-header-border" />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link href="/settings" role="menuitem" className="flex items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-bg-hover rounded-xl transition-colors font-medium" onClick={() => setIsProfileOpen(false)}>
                                            <Settings className="w-4 h-4 text-header-border" />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="h-[1px] bg-header-border/10 my-2 mx-2" role="separator" />
                                        <button
                                            role="menuitem"
                                            onClick={() => { setIsProfileOpen(false); logout(); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 rounded-xl transition-colors font-bold"
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
