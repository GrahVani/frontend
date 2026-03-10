"use client";

import React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientAutoFillProps {
    onFill: (data: { full_name: string; birth_date: string }) => void;
    className?: string;
}

/**
 * Optionally pre-fills name + birth date from the Vedic client context.
 * Falls back gracefully if no client is selected.
 */
export default function ClientAutoFill({ onFill, className }: ClientAutoFillProps) {
    // Lazy-import to avoid hard dependency on VedicClientContext
    const [clientData, setClientData] = React.useState<{ name: string; dateOfBirth: string } | null>(null);

    React.useEffect(() => {
        try {
            const stored = sessionStorage.getItem('vedicClientDetails');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.name && parsed?.dateOfBirth) {
                    setClientData({ name: parsed.name, dateOfBirth: parsed.dateOfBirth });
                }
            }
        } catch {
            // No client data available — that's fine
        }
    }, []);

    if (!clientData) return null;

    return (
        <button
            type="button"
            onClick={() => onFill({ full_name: clientData.name, birth_date: clientData.dateOfBirth })}
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium",
                "bg-gold-primary/10 border border-gold-primary/30 text-gold-dark",
                "hover:bg-gold-primary/20 transition-colors",
                className,
            )}
        >
            <User className="w-3.5 h-3.5" />
            <span>Fill from {clientData.name}</span>
        </button>
    );
}
