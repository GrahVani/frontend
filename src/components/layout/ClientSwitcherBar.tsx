"use client";

import React from "react";
import { X, Plus, Search, UserCheck, MapPin, Calendar } from "lucide-react";
import { useVedicClient, type VedicClientDetails } from "@/context/VedicClientContext";
import { useClients } from "@/hooks/queries/useClients";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ============================================================================
// Quick Search Popover — inline client picker from the "+" button
// ============================================================================
function AddClientPopover({ onClose }: { onClose: () => void }) {
    const [search, setSearch] = React.useState("");
    const { data: searchResults, isLoading } = useClients({ search: search.trim(), limit: 8 });
    const { setClientDetails, openClients } = useVedicClient();
    const router = useRouter();
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clients: any[] = searchResults?.clients || [];

    // Already-open client IDs for dimming
    const openIds = new Set(openClients.map(c => c.id).filter(Boolean));

    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);

    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelect = (c: any) => {
        const details: VedicClientDetails = {
            id: c.id,
            name: c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
            gender: c.gender || "male",
            dateOfBirth: c.dateOfBirth || c.birthDate || "",
            timeOfBirth: c.timeOfBirth || c.birthTime || "12:00",
            placeOfBirth: {
                city: c.placeOfBirth || c.birthPlace || "",
                latitude: c.birthLatitude,
                longitude: c.birthLongitude,
            },
            rashi: c.rashi,
        };
        setClientDetails(details);
        router.push("/vedic-astrology/overview");
        onClose();
    };

    return (
        <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-1.5 w-72 rounded-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
                background: 'linear-gradient(180deg, rgba(255,249,240,0.97) 0%, rgba(250,239,216,0.98) 100%)',
                backdropFilter: 'blur(20px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                border: '1px solid rgba(208,140,96,0.20)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(42,24,16,0.20), 0 2px 8px rgba(42,24,16,0.12)',
            }}
        >
            {/* Search input */}
            <div className="flex items-center gap-2 px-3 py-2.5"
                style={{ borderBottom: '1px solid rgba(186,164,126,0.25)' }}>
                <Search className="w-3.5 h-3.5 text-amber-700/60 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search clients…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 text-[13px] text-ink bg-transparent outline-none placeholder:text-ink/70 font-medium"
                />
            </div>

            {/* Results */}
            <div className="max-h-[280px] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                        <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-600 rounded-full animate-spin" />
                    </div>
                ) : clients.length === 0 ? (
                    <div className="text-center py-6 px-4">
                        <p className="text-[12px] text-ink/90 font-medium">
                            {search.trim() ? 'No clients found' : 'Type to search clients'}
                        </p>
                    </div>
                ) : (
                    clients.map((c) => {
                        const name = c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown';
                        const isOpen = openIds.has(c.id);
                        const birthPlace = c.placeOfBirth || c.birthPlace;
                        const birthDate = c.dateOfBirth || c.birthDate;
                        return (
                            <button
                                key={c.id}
                                onClick={() => handleSelect(c)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gold-primary/5",
                                    isOpen && "opacity-50"
                                )}
                                style={{ borderBottom: '1px solid rgba(186,164,126,0.12)' }}
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-serif font-bold text-amber-800"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(180, 83, 9, 0.08) 100%)',
                                        border: '1px solid rgba(217, 119, 6, 0.20)',
                                    }}>
                                    {name[0]?.toUpperCase() || '?'}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-semibold text-ink truncate">{name}</span>
                                        {isOpen && <UserCheck className="w-3 h-3 text-amber-600 shrink-0" />}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {birthPlace && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-ink/75 font-medium">
                                                <MapPin className="w-2.5 h-2.5" />
                                                <span className="truncate max-w-[80px]">{birthPlace}</span>
                                            </span>
                                        )}
                                        {birthDate && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-ink/75 font-medium">
                                                <Calendar className="w-2.5 h-2.5" />
                                                {new Date(birthDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Client Tab — single tab in the switcher bar
// ============================================================================
function ClientTab({
    client,
    isActive,
    onSwitch,
    onClose,
    canClose,
}: {
    client: VedicClientDetails;
    isActive: boolean;
    onSwitch: () => void;
    onClose: () => void;
    canClose: boolean;
}) {
    const initial = client.name?.[0]?.toUpperCase() || '?';

    return (
        <div
            className={cn("client-tab", isActive && "client-tab-active")}
            onClick={onSwitch}
            role="tab"
            aria-selected={isActive}
            aria-label={`Switch to ${client.name}`}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSwitch(); } }}
        >
            {/* Avatar circle */}
            <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-serif font-bold"
                style={{
                    background: isActive
                        ? 'linear-gradient(135deg, rgba(255,210,125,0.35) 0%, rgba(201,162,77,0.25) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                    border: isActive
                        ? '1px solid rgba(255,210,125,0.45)'
                        : '1px solid rgba(255,255,255,0.15)',
                    color: isActive ? '#FFD27D' : 'rgba(255,255,255,0.7)',
                }}
            >
                {initial}
            </div>

            {/* Client name */}
            <span
                className={cn(
                    "text-[13px] font-semibold truncate max-w-[100px]",
                    isActive ? "text-white text-shadow-glow" : "text-white"
                )}
            >
                {client.name}
            </span>

            {/* Close button */}
            {canClose && (
                <button
                    className="client-tab-close"
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    aria-label={`Close ${client.name}`}
                    title={`Close ${client.name}`}
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}

// ============================================================================
// ClientSwitcherBar — the main exported component
// ============================================================================
export default function ClientSwitcherBar() {
    const { openClients, clientDetails, switchToClient, removeOpenClient } = useVedicClient();
    const [isAddOpen, setIsAddOpen] = React.useState(false);

    // Don't render if no clients are open
    if (openClients.length === 0) return null;

    const activeKey = clientDetails?.id || clientDetails?.name;

    return (
        <div
            className="fixed top-14 left-0 right-0 z-[49] h-10 bg-client-bar flex items-center px-2 lg:px-4 gap-1"
            role="tablist"
            aria-label="Open clients"
        >
            {/* Top border line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            {/* Add client button */}
            <div className="relative shrink-0">
                <button
                    onClick={() => setIsAddOpen(!isAddOpen)}
                    className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200",
                        isAddOpen
                            ? "bg-white/12 border border-gold-primary/30"
                            : "border border-white/10 hover:bg-white/8 hover:border-white/20"
                    )}
                    aria-label="Add client"
                    title="Add client"
                >
                    <Plus className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        isAddOpen ? "text-active-glow rotate-45" : "text-white/60"
                    )} />
                </button>

                {isAddOpen && <AddClientPopover onClose={() => setIsAddOpen(false)} />}
            </div>

            {/* Divider */}
            <div className="w-[1px] h-5 bg-white/10 shrink-0 mx-1" />

            {/* Client tabs — scrollable */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {openClients.map((client) => {
                    const key = client.id || client.name;
                    const isActive = key === activeKey;
                    return (
                        <ClientTab
                            key={key}
                            client={client}
                            isActive={isActive}
                            onSwitch={() => switchToClient(key)}
                            onClose={() => removeOpenClient(key)}
                            canClose={openClients.length > 1 || !isActive}
                        />
                    );
                })}
            </div>

            {/* Client count badge */}
            {openClients.length > 1 && (
                <div className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                    <span className="text-[10px] font-bold text-white/50">{openClients.length}</span>
                    <span className="text-[9px] text-white/35 font-medium">open</span>
                </div>
            )}
        </div>
    );
}
