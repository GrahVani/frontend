import React from "react";

export function NowBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-amber-700 bg-amber-600/20 ring-1 ring-amber-600/20 px-2.5 py-0.5 rounded-full shrink-0">
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600" />
            </span>
            NOW
        </span>
    );
}
