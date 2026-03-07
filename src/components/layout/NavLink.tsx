"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

interface NavLinkProps {
    href: string;
    label: string;
    active: boolean;
}

export default function NavLink({ href, label, active }: NavLinkProps) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
                TYPOGRAPHY.tableHeader,
                "px-4 py-2 !font-semibold transition-all duration-300 relative",
                active ? "text-active-glow text-shadow-glow" : "text-white hover:text-active-glow"
            )}
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
