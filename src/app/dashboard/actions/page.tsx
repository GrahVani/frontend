"use client";

import Link from "next/link";
import {
    Users, Star, Clock, CalendarDays, Heart, Search,
    FileText, PlusCircle, BarChart3, ArrowRight
} from "lucide-react";

interface ActionCardProps {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
    section: string;
}

function ActionCard({ href, icon: Icon, title, description, section }: ActionCardProps) {
    return (
        <Link href={href} className="group">
            <div className="bg-softwhite border border-antique rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-gold-primary/30 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-parchment rounded-full border border-divider flex items-center justify-center shrink-0 group-hover:border-gold-primary/50 transition-colors">
                        <Icon className="w-5 h-5 text-gold-dark" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-refined uppercase tracking-wider">{section}</span>
                </div>
                <h3 className="text-base font-serif font-bold text-ink mb-1">{title}</h3>
                <p className="text-sm text-muted-refined flex-1">{description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-gold-primary group-hover:text-gold-dark transition-colors">
                    Open <ArrowRight className="w-3 h-3" />
                </span>
            </div>
        </Link>
    );
}

const ACTIONS: ActionCardProps[] = [
    // Client Management
    {
        href: "/clients/new",
        icon: PlusCircle,
        title: "New Client",
        description: "Create a new client profile with birth details.",
        section: "Clients",
    },
    {
        href: "/clients",
        icon: Users,
        title: "Client Directory",
        description: "Browse and search all client profiles.",
        section: "Clients",
    },
    // Vedic Astrology
    {
        href: "/vedic-astrology",
        icon: Star,
        title: "Birth Chart Workbench",
        description: "Open the full Vedic astrology workbench.",
        section: "Vedic Astrology",
    },
    {
        href: "/vedic-astrology/dashas",
        icon: BarChart3,
        title: "Dasha Analysis",
        description: "Analyze planetary periods and sub-periods.",
        section: "Vedic Astrology",
    },
    // Muhurta
    {
        href: "/muhurta",
        icon: Clock,
        title: "Today's Muhurta",
        description: "View auspicious timings for today.",
        section: "Muhurta",
    },
    {
        href: "/muhurta/wedding",
        icon: Heart,
        title: "Wedding Dates",
        description: "Find auspicious dates for weddings.",
        section: "Muhurta",
    },
    // Matchmaking
    {
        href: "/matchmaking",
        icon: Heart,
        title: "New Match Analysis",
        description: "Compare two birth charts for compatibility.",
        section: "Matchmaking",
    },
    {
        href: "/matchmaking/gun-milan",
        icon: Search,
        title: "Gun Milan",
        description: "Ashta Koota 36-point compatibility scoring.",
        section: "Matchmaking",
    },
    // Calendar
    {
        href: "/calendar",
        icon: CalendarDays,
        title: "Monthly Calendar",
        description: "View the panchang calendar for this month.",
        section: "Calendar",
    },
    {
        href: "/calendar/festivals",
        icon: Star,
        title: "Festivals & Events",
        description: "Upcoming Hindu festivals and muhurtas.",
        section: "Calendar",
    },
    // Reports
    {
        href: "/vedic-astrology/reports",
        icon: FileText,
        title: "Generate Report",
        description: "Create a detailed PDF astrology report.",
        section: "Reports",
    },
];

export default function ActionsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-ink font-bold mb-1">Quick Actions</h1>
                <p className="text-muted-refined font-serif italic">Jump to any section of your astrology toolkit</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACTIONS.map((action) => (
                    <ActionCard key={action.href} {...action} />
                ))}
            </div>
        </div>
    );
}
