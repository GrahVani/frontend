"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';

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
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 py-2">
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
                    <span key={href} className="flex items-center gap-1.5">
                        {index > 0 && <ChevronRight className="w-3 h-3 text-bronze/40 shrink-0" />}
                        {isLast ? (
                            <span className={cn(TYPOGRAPHY.breadcrumb, "text-ink font-bold")} aria-current="page">
                                {label}
                            </span>
                        ) : (
                            <Link href={href} className={cn(TYPOGRAPHY.breadcrumb, "text-bronze/60 hover:text-bronze transition-colors")}>
                                {label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
