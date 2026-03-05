import { Pencil, Zap, Compass, Star } from 'lucide-react';
import { Client } from '@/types/client';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

interface ClientHeaderProps {
    client: Client;
}

export default function ClientHeader({ client }: ClientHeaderProps) {
    return (
        <div className="relative overflow-hidden bg-ink-abyss border-b border-header-border/30 shadow-2xl">
            {/* Subtle Gradient Glow */}
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-header-border/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-6 lg:py-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* Header Left: Name & Birth Metadata */}
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex w-14 h-14 rounded-full bg-gradient-to-br from-header-border to-ink border border-active-glow/30 items-center justify-center text-white shadow-xl">
                            <span className={cn(TYPOGRAPHY.sectionTitle, "text-2xl !font-bold !text-white !mb-0")}>{(client.firstName || client.fullName || '?').charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                                <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-3xl !font-bold !text-white tracking-tight !mb-0")}>
                                    {client.firstName || ''} {client.lastName || client.fullName || ''}
                                </h1>
                                <div className={cn(TYPOGRAPHY.label, "bg-active-glow/10 !text-active-glow !text-[9px] px-2 py-0.5 rounded-full border border-active-glow/30 !font-black tracking-widest !mb-0")}>
                                    Primary record
                                </div>
                            </div>
                            <div className={cn(TYPOGRAPHY.label, "flex flex-wrap items-center gap-3 !text-white/60 !text-[11px] tracking-widest !font-bold !mt-0")}>
                                <span>{(client.dateOfBirth || client.birthDate) ? new Date(client.dateOfBirth || client.birthDate || '').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-header-border/40" />
                                <span>{client.timeOfBirth || client.birthTime || 'Unknown'} IST</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-header-border/40" />
                                <span className="!text-active-glow">{client.placeOfBirth || client.birthPlace || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Header Right: Quick State Indicators */}
                    <div className="flex items-center gap-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <MetadataTag icon={Compass} label="Asc" value="Cancer" />
                            <MetadataTag icon={Star} label="Rashi" value={client.rashi || "Unknown"} orange />
                            <MetadataTag icon={Zap} label="Dasha" value="Jup-Sat" />
                        </div>
                        <button className="ml-2 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-active-glow transition-all" title="Edit Client">
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetadataTag({ icon: Icon, label, value, orange = false }: { icon: React.ElementType, label: string, value: string, orange?: boolean }) {
    return (
        <div className={cn(
            "px-4 py-2 rounded-xl border flex flex-col min-w-[90px] transition-all",
            orange ? "bg-header-border/10 border-header-border/40" : "bg-white/5 border-white/10"
        )}>
            <span className={cn(TYPOGRAPHY.label, "text-[8px] !font-black tracking-tighter !text-white/60 !mb-0.5")}>{label}</span>
            <span className={cn(TYPOGRAPHY.value, "text-xs !font-bold tracking-wide !mt-0", orange ? "text-active-glow" : "!text-white/80")}>{value}</span>
        </div>
    );
}
