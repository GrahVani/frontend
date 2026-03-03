"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Settings, Clock, User, ChevronDown, Menu } from "lucide-react";
import GoldenButton from "@/components/GoldenButton";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function GlobalHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { ayanamsa, chartStyle, recentClientIds, updateSettings } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const { user, logout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdowns/modals on Escape
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
            {/* Main Header Container */}
            <div
                className="relative h-full w-full flex items-center justify-between px-4 lg:px-8 bg-header-gradient shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
                {/* Top Gold Border (Subtle) */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-header-border opacity-30" />

                {/* Bottom Gold Border (Ornamental) */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-header-border to-transparent" />

                {/* LEFT ZONE: Identity & Navigation */}
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMobileNavOpen(true)}
                        className="md:hidden text-white hover:text-active-glow transition-colors p-1"
                        aria-label="Open navigation menu"
                        aria-expanded={isMobileNavOpen}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Brand Mark */}
                    <Link href="/dashboard" className="group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-header-border flex items-center justify-center bg-ink-deep">
                                <span className="font-serif text-white font-bold text-lg leading-none pt-1">G</span>
                            </div>
                            <span className="font-serif text-xl font-semibold text-white tracking-wide group-hover:text-header-border transition-colors">
                                Grahvani
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                        <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
                        <NavLink href="/clients" label="Clients" active={isActive("/clients")} />
                        <NavLink href="/vedic-astrology" label="Vedic Astrology" active={isActive("/vedic-astrology")} />
                        <NavLink href="/muhurta" label="Muhurta" active={isActive("/muhurta")} />
                        <NavLink href="/matchmaking" label="Matchmaking" active={isActive("/matchmaking")} />
                        <NavLink href="/calendar" label="Calendar" active={isActive("/calendar")} />
                    </nav>
                </div>

                {/* RIGHT ZONE: Utilities & Profile */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Time / Ayanamsa Display (Static) */}
                    <div className="hidden lg:flex flex-col items-end mr-2 text-right">
                        <span className="text-xs font-serif text-white tracking-wider">{settings.ayanamsa} Ayanamsa</span>
                        <div className="flex items-center gap-1.5 text-white">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-serif tracking-wider" suppressHydrationWarning>
                                {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block h-8 w-[1px] bg-header-border/30" />

                    {/* System Icons */}
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

                        {/* Profile Dropdown Menu */}
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-64 bg-surface-modal rounded-2xl shadow-2xl border border-header-border/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2" role="menu" aria-label="User menu">
                                    <div className="p-5 bg-gradient-to-br from-copper-dark to-mahogany text-white">
                                        <p className="font-serif font-bold text-lg leading-tight truncate">
                                            {user?.name || user?.email}
                                        </p>
                                        <p className="text-active-glow/70 text-xs tracking-widest mt-1 truncate">
                                            {user?.role || 'Astro Seeker'} • {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            href="/profile"
                                            role="menuitem"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-bg-hover rounded-xl transition-colors font-medium"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="w-4 h-4 text-header-border" />
                                            <span>My Journey</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            role="menuitem"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-bg-hover rounded-xl transition-colors font-medium"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings className="w-4 h-4 text-header-border" />
                                            <span>Sanctum Settings</span>
                                        </Link>
                                        <div className="h-[1px] bg-header-border/10 my-2 mx-2" role="separator" />
                                        <button
                                            role="menuitem"
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 rounded-xl transition-colors font-bold"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Leave Sanctum</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Settings Modal */}
            <GlobalSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} router={router} />

            {/* Mobile Navigation Drawer */}
            <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
        </header>
    );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`
                px-4 py-2 font-serif text-sm font-semibold tracking-wide transition-all duration-300 relative
                ${active
                    ? 'text-active-glow text-shadow-glow'
                    : 'text-white hover:text-active-glow'
                }
            `}
        >
            {label}
            {active && (
                <>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-active-glow to-transparent shadow-[0_0_10px_2px_rgba(255,210,125,0.5)]" />
                    <span
                        className="absolute inset-0 -z-10 rounded-lg opacity-20 blur-md pointer-events-none [background:radial-gradient(ellipse_at_center,var(--active-glow)_0%,transparent_70%)]"
                    />
                </>
            )}
        </Link>
    );
}

function GlobalSettingsModal({ isOpen, onClose, router }: { isOpen: boolean; onClose: () => void; router: AppRouterInstance }) {
    const { ayanamsa, chartStyle, recentClientIds, updateSettings } = useAstrologerStore();

    const settings = React.useMemo(() => ({
        ayanamsa,
        chartStyle,
        recentClientIds
    }), [ayanamsa, chartStyle, recentClientIds]);

    const [tempSettings, setTempSettings] = React.useState(settings);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) setTempSettings(settings);
    }, [isOpen, settings]);

    if (!isOpen) return null;

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            const systemChanged = tempSettings.ayanamsa !== settings.ayanamsa;
            updateSettings(tempSettings);
            setIsSaving(false);
            onClose();

            if (systemChanged) {
                router.push('/vedic-astrology/overview');
            }
        }, 600);
    };

    const AYANAMSAS = [
        { id: 'Lahiri', label: 'Lahiri (Chitra Paksha)', desc: 'Most widely used in Vedic Astrology' },
        { id: 'KP', label: 'KP (Krishnamurti)', desc: 'Preferred for Stellar/Nakshatra precision' },
        { id: 'Raman', label: 'Raman', desc: 'BV Raman traditional ayanamsa' },
        { id: 'Yukteswar', label: 'Sri Yukteswar', desc: 'Galactic Center based precision' },
        { id: 'Bhasin', label: 'Bhasin', desc: 'J.N. Bhasin ayanamsa system' },
        { id: 'Tropical', label: 'Tropical (Sayana)', desc: 'Western Zodiac aligned' },
    ];

    const settingsTitleId = React.useId();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" role="dialog" aria-modal="true" aria-labelledby={settingsTitleId}>
            <div className="w-full max-w-2xl bg-surface-modal rounded-[2rem] shadow-2xl overflow-hidden border border-header-border/30 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-copper-dark to-mahogany flex items-center justify-between shrink-0">
                    <div>
                        <h2 id={settingsTitleId} className="text-2xl font-serif text-white font-bold tracking-wide">Global Preference Matrix</h2>
                        <p className="text-active-glow/80 text-xs uppercase tracking-widest mt-1">System-wide Astronomical Constants</p>
                    </div>
                    <button onClick={onClose} aria-label="Close settings" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                        <ChevronDown className="w-6 h-6 rotate-90" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    <section>
                        <h3 className="text-header-border text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-header-border" />
                            Ayanamsa System
                            <span className="flex-1 h-[1px] bg-header-border/20" />
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label="Ayanamsa system selection">
                            {AYANAMSAS.map((a) => (
                                <button
                                    key={a.id}
                                    role="radio"
                                    aria-checked={tempSettings.ayanamsa === a.id}
                                    onClick={() => setTempSettings(prev => ({ ...prev, ayanamsa: a.id as typeof prev.ayanamsa }))}
                                    className={`relative p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] group ${tempSettings.ayanamsa === a.id
                                        ? 'bg-copper-dark border-copper-dark shadow-lg'
                                        : 'bg-white border-header-border/20 hover:border-header-border hover:bg-bg-hover'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-serif font-bold ${tempSettings.ayanamsa === a.id ? 'text-white' : 'text-ink'
                                            }`}>{a.label}</span>
                                        {tempSettings.ayanamsa === a.id && (
                                            <div className="w-4 h-4 rounded-full bg-active-glow flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-copper-dark" />
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed ${tempSettings.ayanamsa === a.id ? 'text-white/60' : 'text-bronze/60'
                                        }`}>{a.desc}</p>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-8 bg-softwhite border-t border-header-border/10 flex items-center justify-between shrink-0">
                    <span className="text-xs text-bronze font-medium italic">Changes reflect immediately across all open modules.</span>
                    <div className="flex gap-4">
                        <button onClick={onClose} aria-label="Cancel settings changes" className="px-6 py-3 rounded-xl text-bronze text-xs font-bold uppercase tracking-wider hover:bg-bronze/5 transition-colors">
                            Cancel
                        </button>
                        <GoldenButton
                            topText={isSaving ? "Saving" : "Update"}
                            bottomText={isSaving ? "..." : "Matrix"}
                            onClick={handleSave}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
