"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FlaskConical,
    Grid3x3,
    Layers,
    Clock,
    Globe,
    History,
    HelpCircle,
    FileText,
    Compass,
} from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

export type KpSection =
    | 'dashboard'
    | 'kp-analysis'
    | 'cusps'
    | 'significators'
    | 'ruling-planets'
    | 'interlinks'
    | 'advanced-ssl'
    | 'nakshatra-nadi'
    | 'fortuna'
    | 'bhava-details'
    | 'dashas'
    | 'transit'
    | 'events'
    | 'reports';

interface KpDashboardSidebarProps {
    activeSection: KpSection;
    onSectionChange: (section: KpSection) => void;
    className?: string;
}

const SIDEBAR_ITEMS: { id: KpSection; label: React.ReactNode; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kp-analysis', label: 'Planets', icon: FlaskConical },
    { id: 'cusps', label: <KnowledgeTooltip term="kp_cusp">Cusps</KnowledgeTooltip>, icon: Compass },
    { id: 'significators', label: <KnowledgeTooltip term="kp_significator">Significators</KnowledgeTooltip>, icon: Grid3x3 },
    { id: 'ruling-planets', label: <KnowledgeTooltip term="ruling_planets">Ruling Planets</KnowledgeTooltip>, icon: Layers },
    { id: 'bhava-details', label: 'Bhava Details', icon: History },
    { id: 'interlinks', label: 'Interlinks', icon: LayoutDashboard },
    { id: 'advanced-ssl', label: <>Advanced <KnowledgeTooltip term="sub_sub_lord">SSL</KnowledgeTooltip></>, icon: FlaskConical },
    { id: 'nakshatra-nadi', label: <KnowledgeTooltip term="kp_nakshatra_nadi">Nakshatra Nadi</KnowledgeTooltip>, icon: Compass },
    { id: 'fortuna', label: <KnowledgeTooltip term="kp_fortuna">Pars Fortuna</KnowledgeTooltip>, icon: Clock },
    { id: 'dashas', label: 'Dashas', icon: History },
    { id: 'transit', label: 'Transit', icon: Globe },
    { id: 'events', label: <KnowledgeTooltip term="kp_horary">Horary</KnowledgeTooltip>, icon: HelpCircle },
    { id: 'reports', label: 'Notes', icon: FileText },
];

/**
 * KP Dashboard Sidebar Navigation
 * Left panel with scroll-to-section navigation
 */
export default function KpDashboardSidebar({
    activeSection,
    onSectionChange,
    className,
}: KpDashboardSidebarProps) {
    return (
        <div className={cn(
            "w-48 shrink-0 prem-card p-3 h-fit sticky top-32",
            className
        )}>
            <div className="mb-3 px-2">
                <p className={cn(TYPOGRAPHY.label, "text-[9px] uppercase tracking-widest")}>KP Navigation</p>
            </div>
            <nav className="space-y-0.5">
                {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-medium transition-all text-left",
                                isActive
                                    ? "bg-gold-primary/15 text-gold-dark border border-gold-primary/30 font-semibold"
                                    : "text-ink hover:text-ink hover:bg-surface-warm"
                            )}
                        >
                            <Icon className={cn(
                                "w-4 h-4 shrink-0",
                                isActive ? "text-gold-dark" : "text-ink"
                            )} />
                            <span className={cn(TYPOGRAPHY.value, "text-[13px] font-semibold")}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
