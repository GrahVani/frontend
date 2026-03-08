"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const SEGMENT_LABELS: Record<string, string> = {
    'dashboard': 'Dashboard',
    'clients': 'Clients',
    'vedic-astrology': 'Vedic Astrology',
    'muhurta': 'Muhurta',
    'matchmaking': 'Matchmaking',
    'calendar': 'Calendar',
    'settings': 'Settings',
    'client': 'Client',
    'overview': 'Overview',
    'kp': 'KP System',
    'workbench': 'Work Bench',
    'divisional': 'Divisional Charts',
    'dashas': 'Dashas',
    'yoga-dosha': 'Yogas & Doshas',
    'ashtakavarga': 'Ashtakavarga',
    'shadbala': 'Shadbala',
    'transits': 'Gochar',
    'remedies': 'Upaya',
    'chakras': 'Sudarshan Chakra',
    'comparison': 'Compatibility',
    'pushkara-navamsha': 'Pushkara Navamsha',
    'reports': 'Reports',
    'notes': 'Notes',
    'customize': 'Customize',
    'panchanga': 'Panchanga',
    'charts': 'Charts',
    'planets': 'Planets',
    'planet-position': 'Planet Position',
    'new': 'New',
    'profile': 'Profile',
};

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    // Don't show breadcrumbs on single-segment paths (top-level pages)
    if (segments.length <= 1) return null;

    return (
        <nav aria-label="Breadcrumb"
             className="flex items-center gap-2 py-3 mb-1">
            {/* Home anchor */}
            <Link href="/dashboard"
                  className="p-1.5 rounded-md hover:bg-surface-warm/50 transition-colors shrink-0"
                  aria-label="Home">
                <Home className="w-4 h-4 text-ink/40 hover:text-gold-dark transition-colors" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-ink/25 shrink-0" />

            {segments.map((segment, index) => {
                const href = '/' + segments.slice(0, index + 1).join('/');
                const isLast = index === segments.length - 1;

                // Skip UUID-like segments (client IDs) but still render separator
                if (/^[0-9a-f]{8,}/.test(segment) || /^\d+$/.test(segment)) {
                    return null;
                }

                const label = SEGMENT_LABELS[segment]
                    || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                return (
                    <span key={href} className="flex items-center gap-2">
                        {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-ink/25 shrink-0" />}
                        {isLast ? (
                            <span className="text-[14px] font-semibold text-ink px-2 py-1 rounded-md"
                                  style={{ background: 'rgba(201,162,77,0.10)', border: '1px solid rgba(201,162,77,0.18)' }}
                                  aria-current="page">
                                {label}
                            </span>
                        ) : (
                            <Link href={href}
                                  className="text-[14px] font-medium text-ink/60 hover:text-gold-dark px-2 py-1 rounded-md hover:bg-surface-warm/40 transition-all">
                                {label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
