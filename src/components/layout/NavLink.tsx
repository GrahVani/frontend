"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavSubItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

interface NavLinkProps {
    href: string;
    label: string;
    active: boolean;
    subItems?: NavSubItem[];
    onClick?: (e: React.MouseEvent) => void;
    isLocked?: boolean;
}

export default function NavLink({ href, label, active, subItems, onClick, isLocked }: NavLinkProps) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    // Close on outside click
    React.useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Close on Escape
    React.useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open]);

    const hasDropdown = subItems && subItems.length > 0;

    const baseClass = cn(
        "px-2 lg:px-3 py-1.5 rounded-lg font-semibold text-[14px] tracking-wide transition-all duration-300 relative inline-flex items-center gap-1",
        active
            ? "nav-glass-pill text-white text-shadow-glow"
            : "text-white hover:text-white hover:bg-white/[0.06]"
    );

    // Simple link (no dropdown)
    if (!hasDropdown) {
        return (
            <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={baseClass}
                onClick={onClick}
                title={isLocked ? "Please select a client from Dashboard to unlock" : undefined}
            >
                {label}
                {active && (
                    <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-active-glow shadow-[0_0_8px_2px_rgba(255,210,125,0.4)]" />
                )}
            </Link>
        );
    }

    // Link with dropdown — chevron is integrated inside the pill
    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={`${label} menu`}
                className={cn(baseClass, "cursor-pointer pr-2.5 gap-1.5")}
                title={isLocked ? "Please select a client from Dashboard to unlock" : undefined}
            >
                <div className="flex items-center gap-1">
                    <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClick) onClick(e);
                        }}
                        className="hover:underline underline-offset-2 decoration-white/30"
                    >
                        {label}
                    </Link>
                </div>
                <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 shrink-0",
                    "text-white",
                    open && "rotate-180"
                )} />
                {active && (
                    <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-active-glow shadow-[0_0_8px_2px_rgba(255,210,125,0.4)]" />
                )}
            </button>

            {open && (
                <div
                    className="absolute top-full left-0 mt-3 w-56 rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                        background: 'linear-gradient(180deg, rgba(85,37,15,0.96) 0%, rgba(65,28,12,0.98) 100%)',
                        backdropFilter: 'blur(24px) saturate(1.6)',
                        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                        border: '1px solid rgba(208,140,96,0.25)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 40px rgba(42,24,16,0.50), 0 2px 8px rgba(42,24,16,0.30)',
                    }}
                    role="menu"
                    aria-label={`${label} sub-menu`}
                >
                    <div className="p-1.5">
                        {subItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    role="menuitem"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-white/80 hover:text-active-glow hover:bg-white/[0.08] transition-all duration-150"
                                >
                                    <Icon className="w-4 h-4 text-header-border/70 shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
