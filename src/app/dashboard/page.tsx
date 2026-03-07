"use client";

import Link from "next/link";
import {
    Users, Star, Clock, CalendarDays, ArrowRight, Sunrise, Sunset,
    UserPlus, BarChart3, ChevronRight,
} from "lucide-react";
import { usePanchang } from "@/hooks/queries/usePanchang";
import { useRecentClients, useDashboardStats } from "@/hooks/queries/useDashboard";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { Client } from "@/types/client";

// ─── Helpers ──────────────────────────────────────────────────────

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function formatDate(): { full: string; weekday: string; day: string; month: string } {
    const now = new Date();
    return {
        full: now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        weekday: now.toLocaleDateString('en-IN', { weekday: 'long' }),
        day: String(now.getDate()),
        month: now.toLocaleDateString('en-IN', { month: 'short' }),
    };
}

function getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Sub-components ───────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, href }: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    href?: string;
}) {
    const content = (
        <div className={cn(
            "bg-softwhite border border-antique rounded-xl p-5 flex items-center gap-4 transition-all",
            href && "hover:shadow-md hover:border-gold-primary/30 cursor-pointer group"
        )}>
            <div className="w-11 h-11 bg-parchment rounded-full border border-divider flex items-center justify-center shrink-0 group-hover:border-gold-primary/40 transition-colors">
                <Icon className="w-5 h-5 text-gold-dark" />
            </div>
            <div className="min-w-0">
                <div className="text-2xl font-serif font-bold text-ink leading-none">{value}</div>
                <div className="text-xs text-muted-refined mt-1 font-medium">{label}</div>
            </div>
            {href && <ChevronRight className="w-4 h-4 text-muted-refined ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}

function PanchangSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {['Tithi', 'Nakshatra', 'Yoga', 'Karana'].map((label) => (
                <div key={label} className="bg-parchment/50 rounded-lg p-3">
                    <span className="text-[10px] text-muted-refined font-medium uppercase tracking-wider block">{label}</span>
                    <div className="h-4 w-20 bg-antique/40 rounded animate-pulse mt-1.5" />
                </div>
            ))}
        </div>
    );
}

function PanchangWidget() {
    const { data: panchang, isLoading, isError } = usePanchang();
    const date = formatDate();

    return (
        <div className="bg-softwhite border border-antique rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase">
                    Today&apos;s Panchang
                </h2>
                <Link href="/calendar" className="text-[10px] font-medium text-gold-primary hover:text-gold-dark transition-colors inline-flex items-center gap-1">
                    Full Calendar <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <p className="text-lg font-serif text-ink font-semibold">{date.full}</p>

            {isLoading ? (
                <PanchangSkeleton />
            ) : isError ? (
                <div className="mt-4 bg-parchment/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-refined">Panchang data is temporarily unavailable</p>
                    <p className="text-xs text-muted-refined mt-1 italic">The service is being updated — please check back shortly</p>
                </div>
            ) : panchang ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {[
                            { label: 'Tithi', value: panchang.tithi },
                            { label: 'Nakshatra', value: panchang.nakshatra },
                            { label: 'Yoga', value: panchang.yoga },
                            { label: 'Karana', value: panchang.karana },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-parchment/50 rounded-lg p-3">
                                <span className="text-[10px] text-muted-refined font-medium uppercase tracking-wider block">{label}</span>
                                <span className="text-sm font-serif font-semibold text-ink block mt-1">{typeof value === 'object' && value !== null ? (value as { name?: string }).name || '-' : String(value)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-muted-refined">
                        {panchang.sunrise && panchang.sunrise !== '-' && (
                            <span className="inline-flex items-center gap-1">
                                <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                                {panchang.sunrise}
                            </span>
                        )}
                        {panchang.sunset && panchang.sunset !== '-' && (
                            <span className="inline-flex items-center gap-1">
                                <Sunset className="w-3.5 h-3.5 text-orange-500" />
                                {panchang.sunset}
                            </span>
                        )}
                        {panchang.rahuKaal && panchang.rahuKaal !== '-' && (
                            <span className="text-red-700/60">
                                Rahu Kaal: {panchang.rahuKaal}
                            </span>
                        )}
                        {panchang.vara && panchang.vara !== '-' && (
                            <span>{panchang.vara}</span>
                        )}
                    </div>
                </>
            ) : null}
        </div>
    );
}

function RecentClientsWidget() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- paginated API response shape
    const { data, isLoading } = useRecentClients(5) as { data: any; isLoading: boolean };
    const clients: Client[] = data?.clients || [];

    if (isLoading) {
        return (
            <div className="bg-softwhite border border-antique rounded-xl p-6">
                <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                    Recent Clients
                </h2>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-9 h-9 rounded-full bg-antique/40" />
                            <div className="flex-1">
                                <div className="h-3.5 w-28 bg-antique/40 rounded" />
                                <div className="h-2.5 w-20 bg-antique/30 rounded mt-1.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-softwhite border border-antique rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase">
                    Recent Clients
                </h2>
                <Link href="/clients" className="text-[10px] font-medium text-gold-primary hover:text-gold-dark transition-colors inline-flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {clients.length === 0 ? (
                <div className="text-center py-6">
                    <Users className="w-8 h-8 text-antique mx-auto mb-2" />
                    <p className="text-sm text-muted-refined">No clients yet</p>
                    <Link href="/clients/new" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-gold-primary hover:text-gold-dark transition-colors">
                        <UserPlus className="w-3 h-3" /> Add your first client
                    </Link>
                </div>
            ) : (
                <div className="space-y-1">
                    {clients.map((client) => (
                        <Link
                            key={client.id}
                            href={`/clients/${client.id}`}
                            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-parchment/60 transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-full bg-parchment border border-divider flex items-center justify-center shrink-0 text-xs font-bold text-gold-dark group-hover:border-gold-primary/40 transition-colors">
                                {getInitials(client.fullName)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-ink truncate">{client.fullName}</div>
                                <div className="text-[10px] text-muted-refined">
                                    {client.birthPlace || client.gender || 'No details'}
                                </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-refined opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function QuickActionCard({ href, icon: Icon, title, description }: {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <Link href={href} className="group">
            <div className="bg-softwhite border border-antique rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-gold-primary/30 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[url('/textures/arabesque.png')] opacity-10 pointer-events-none" />
                <div className="w-10 h-10 bg-parchment rounded-full border border-divider flex items-center justify-center mb-3 group-hover:border-gold-primary/50 transition-colors">
                    <Icon className="w-5 h-5 text-gold-dark" />
                </div>
                <h3 className="text-base font-serif font-bold text-ink mb-1">{title}</h3>
                <p className="text-xs text-muted-refined mb-3 leading-relaxed">{description}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gold-primary group-hover:text-gold-dark transition-colors">
                    Open <ArrowRight className="w-3 h-3" />
                </span>
            </div>
        </Link>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────

export default function Dashboard() {
    const { user } = useAuth();
    const { data: stats } = useDashboardStats();
    const firstName = user?.name?.split(' ')[0] || 'Astrologer';

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-serif text-ink font-bold">
                        {getGreeting()}, {firstName}
                    </h1>
                    <p className="text-muted-refined font-serif italic mt-1">
                        {formatDate().full}
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Clients" value={stats?.totalClients ?? '—'} icon={Users} href="/clients" />
                <StatCard label="Today's Sessions" value={stats?.todaySessions ?? 0} icon={Clock} />
                <StatCard label="Charts Generated" value={stats?.chartsGenerated ?? 0} icon={BarChart3} />
                <StatCard label="Follow-ups" value={stats?.pendingFollowUps ?? 0} icon={CalendarDays} />
            </div>

            {/* Panchang + Recent Clients Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PanchangWidget />
                <RecentClientsWidget />
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionCard
                        href="/clients/new"
                        icon={UserPlus}
                        title="New Client"
                        description="Create a client profile with birth details."
                    />
                    <QuickActionCard
                        href="/vedic-astrology"
                        icon={Star}
                        title="Vedic Astrology"
                        description="Open the birth chart workbench."
                    />
                    <QuickActionCard
                        href="/muhurta"
                        icon={Clock}
                        title="Muhurta"
                        description="Find auspicious timings for events."
                    />
                    <QuickActionCard
                        href="/calendar"
                        icon={CalendarDays}
                        title="Calendar"
                        description="View panchang and planetary transits."
                    />
                </div>
            </div>
        </div>
    );
}
