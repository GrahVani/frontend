"use client";

import Link from "next/link";
import { Users, Star, Clock, CalendarDays, ArrowRight, Sunrise, Sunset } from "lucide-react";
import { usePanchang } from "@/hooks/queries/usePanchang";
import { cn } from "@/lib/utils";

function QuickActionCard({ href, icon: Icon, title, description }: {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <Link href={href} className="group">
            <div className="bg-softwhite border border-antique rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-gold-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[url('/textures/arabesque.png')] opacity-10 pointer-events-none" />
                <div className="w-12 h-12 bg-parchment rounded-full border border-divider flex items-center justify-center mb-4 group-hover:border-gold-primary/50 transition-colors">
                    <Icon className="w-6 h-6 text-gold-dark" />
                </div>
                <h3 className="text-lg font-serif font-bold text-ink mb-1">{title}</h3>
                <p className="text-sm text-muted-refined mb-4">{description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gold-primary group-hover:text-gold-dark transition-colors">
                    Open <ArrowRight className="w-3 h-3" />
                </span>
            </div>
        </Link>
    );
}

function PanchangSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {['Tithi', 'Nakshatra', 'Yoga', 'Karana'].map((label) => (
                <div key={label} className="bg-parchment/50 rounded-lg p-3">
                    <span className="text-xs text-muted-refined font-medium block">{label}</span>
                    <div className="h-4 w-24 bg-antique/40 rounded animate-pulse mt-1" />
                </div>
            ))}
        </div>
    );
}

function PanchangWidget() {
    const { data: panchang, isLoading, isError } = usePanchang();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-softwhite border border-antique rounded-xl p-6 col-span-full lg:col-span-2">
            <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                Today&apos;s Panchang
            </h2>
            <p className="text-lg font-serif text-ink font-semibold">{dateStr}</p>

            {isLoading ? (
                <PanchangSkeleton />
            ) : isError ? (
                <div className="mt-4 bg-parchment/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-refined">Unable to load today&apos;s panchang</p>
                    <p className="text-xs text-muted-refined mt-1 italic">Please try refreshing the page</p>
                </div>
            ) : panchang ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {[
                            { label: 'Tithi', value: panchang.tithi },
                            { label: 'Nakshatra', value: panchang.nakshatra },
                            { label: 'Yoga', value: panchang.yoga },
                            { label: 'Karana', value: panchang.karana },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-parchment/50 rounded-lg p-3">
                                <span className="text-xs text-muted-refined font-medium block">{label}</span>
                                <span className="text-sm font-serif font-semibold text-ink block mt-1">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Sunrise/Sunset row */}
                    {(panchang.sunrise !== '-' || panchang.sunset !== '-') && (
                        <div className="flex gap-6 mt-3 text-xs text-muted-refined">
                            <span className="inline-flex items-center gap-1">
                                <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                                {panchang.sunrise}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Sunset className="w-3.5 h-3.5 text-orange-500" />
                                {panchang.sunset}
                            </span>
                            {panchang.vara && panchang.vara !== '-' && (
                                <span className="text-muted-refined">{panchang.vara}</span>
                            )}
                        </div>
                    )}
                </>
            ) : null}
        </div>
    );
}

function ActiveSessionsWidget() {
    return (
        <div className="bg-softwhite border border-antique rounded-xl p-6">
            <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                Today&apos;s Sessions
            </h2>
            <div className="text-4xl font-serif font-bold text-ink">0</div>
            <p className="text-sm text-muted-refined mt-1">No sessions scheduled</p>
            <Link href="/clients/bookings" className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-gold-primary hover:text-gold-dark transition-colors">
                View bookings <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    );
}

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-ink font-bold mb-2">Dashboard</h1>
                <p className="text-muted-refined font-serif italic">Your astrology command center</p>
            </div>

            {/* Panchang + Sessions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PanchangWidget />
                <ActiveSessionsWidget />
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <QuickActionCard
                        href="/clients/new"
                        icon={Users}
                        title="New Client"
                        description="Create a new client profile and birth details."
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
