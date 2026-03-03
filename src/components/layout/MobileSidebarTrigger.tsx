"use client";

import React from "react";
import { Menu } from "lucide-react";

interface MobileSidebarTriggerProps {
    onClick: () => void;
}

export default function MobileSidebarTrigger({ onClick }: MobileSidebarTriggerProps) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden fixed bottom-6 left-6 z-50 w-12 h-12 bg-header-gradient rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform border border-header-border/30"
            aria-label="Open section menu"
        >
            <Menu className="w-5 h-5" />
        </button>
    );
}
