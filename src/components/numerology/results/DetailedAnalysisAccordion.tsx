"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function renderSimpleValue(val: unknown): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.map(v => renderSimpleValue(v)).join(', ');
    return JSON.stringify(val);
}

function scoreColor(pct: number): string {
    if (pct >= 80) return "bg-emerald-500";
    if (pct >= 60) return "bg-amber-500";
    if (pct >= 40) return "bg-orange-400";
    return "bg-red-400";
}

function scoreTextColor(pct: number): string {
    if (pct >= 80) return "text-emerald-700";
    if (pct >= 60) return "text-amber-700";
    if (pct >= 40) return "text-orange-600";
    return "text-red-600";
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN DETECTORS
// ═══════════════════════════════════════════════════════════════════════════════

function isStringArray(v: unknown): v is string[] {
    return Array.isArray(v) && v.length > 0 && v.every(i => typeof i === 'string');
}

function isNumberArray(v: unknown): v is number[] {
    return Array.isArray(v) && v.length > 0 && v.every(i => typeof i === 'number');
}

function isHourlyTimeline(v: unknown): v is Array<Record<string, unknown>> {
    return Array.isArray(v) && v.length > 3 && typeof v[0] === 'object' && v[0] !== null && 'hour' in v[0];
}

function isActionPlanArray(v: unknown): v is Array<Record<string, unknown>> {
    if (!Array.isArray(v) || v.length === 0 || typeof v[0] !== 'object' || v[0] === null) return false;
    const item = v[0] as Record<string, unknown>;
    return ('action' in item && 'area' in item) || ('recommendation' in item && 'category' in item) || ('action' in item && 'priority' in item);
}

function isKarmicDebtArray(v: unknown): v is Array<Record<string, unknown>> {
    return Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null && 'karmic_number' in v[0];
}

function isYearCardsArray(v: unknown): v is Array<Record<string, unknown>> {
    return Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null && ('year' in v[0] || 'cycle' in v[0]) && 'theme' in v[0];
}

function isGenericObjectArray(v: unknown): v is Array<Record<string, unknown>> {
    return Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null && !Array.isArray(v[0]);
}

function isColorRecommendation(v: unknown): boolean {
    if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
    return ('primary_color' in v && 'primary_hex' in v) || ('color' in v && 'hex' in v) || ('primary_color' in v && 'secondary_colors' in v);
}

function isScoredActivities(v: unknown): boolean {
    if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
    const entries = Object.values(v);
    return entries.length >= 3 &&
        entries.every(e => typeof e === 'object' && e !== null && 'score' in (e as Record<string, unknown>)) &&
        entries.some(e => typeof e === 'object' && e !== null && 'rating' in (e as Record<string, unknown>));
}

function isPersonProfile(v: unknown): boolean {
    if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
    return 'name' in v && ('birth_number' in v || 'name_number' in v);
}

const SCORE_KEY_RE = /score|rating|alignment|compatibility|factor|index|percentage|overall|potential|suitability|quality/;

function isScoreBreakdown(v: unknown): boolean {
    if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
    const entries = Object.entries(v as Record<string, unknown>);
    if (entries.length < 2) return false;
    if (!entries.some(([k]) => SCORE_KEY_RE.test(k.toLowerCase()))) return false;
    const numericCount = entries.filter(([, val]) => typeof val === 'number').length;
    return numericCount >= entries.length * 0.4;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

function MiniBar({ value, max = 10, label }: { value: number; max?: number; label?: string }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div className="flex items-center gap-1.5">
            {label ? <span className="text-[9px] text-primary/50 w-28 shrink-0 truncate" title={label}>{label}</span> : null}
            <div className="flex-1 h-1.5 rounded-full bg-gold-primary/10 overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-500", scoreColor(pct))} style={{ width: `${pct}%` }} />
            </div>
            <span className={cn("text-[9px] font-bold min-w-[24px] text-right tabular-nums", scoreTextColor(pct))}>
                {value}{max <= 10 ? `/${max}` : ''}
            </span>
        </div>
    );
}

function StringBadges({ items, variant = 'default' }: { items: string[]; variant?: 'default' | 'positive' | 'warning' }) {
    const styles = {
        default: "bg-amber-800/[0.06] text-amber-800",
        positive: "bg-emerald-700/[0.08] text-emerald-700",
        warning: "bg-red-600/[0.08] text-red-600",
    };
    return (
        <div className="flex flex-wrap gap-0.5">
            {items.map((item, i) => (
                <span key={i} className={cn("px-1 py-px rounded text-[9px] font-medium", styles[variant])}>{item}</span>
            ))}
        </div>
    );
}

function NumBadges({ items }: { items: number[] }) {
    return (
        <div className="flex flex-wrap gap-1">
            {items.map((item, i) => (
                <span key={i} className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">{item}</span>
            ))}
        </div>
    );
}

function NumDisplay({ items }: { items: Array<{ value: number | string; label: string }> }) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map(({ value, label }, i) => (
                <div key={i} className="text-center w-12">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50/80 border border-amber-200 text-[13px] font-bold font-serif text-gold-dark">{value}</span>
                    <p className="text-[7px] font-bold uppercase tracking-wider text-amber-700/40 mt-0.5 leading-tight truncate" title={label}>{label}</p>
                </div>
            ))}
        </div>
    );
}

function KV({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-1 min-w-0">
            <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 shrink-0">{label}</span>
            <span className="text-[10px] text-primary font-medium truncate" title={value}>{value}</span>
        </div>
    );
}

function ColorPalette({ data }: { data: Record<string, unknown> }) {
    const primaryColor = (data.primary_color || data.color) as string | undefined;
    const primaryHex = (data.primary_hex || data.hex) as string | undefined;
    const secondary = data.secondary_colors as string[] | undefined;
    const secondaryHex = data.secondary_hex as string[] | undefined;
    const avoid = data.avoid_colors as string[] | undefined;
    const avoidHex = data.avoid_hex as string[] | undefined;

    return (
        <div className="space-y-1.5">
            {primaryColor ? (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg border border-gold-primary/20 shadow-sm" style={{ backgroundColor: primaryHex || '#ccc' }} />
                    <span className="text-[11px] font-semibold text-primary">{primaryColor}</span>
                    {primaryHex ? <span className="text-[8px] text-primary/30 font-mono">{primaryHex}</span> : null}
                </div>
            ) : null}
            {secondary ? (
                <div className="flex flex-wrap gap-1">
                    {secondary.map((color, i) => (
                        <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gold-primary/[0.04]">
                            <div className="w-4 h-4 rounded border border-gold-primary/15" style={{ backgroundColor: secondaryHex?.[i] || '#ccc' }} />
                            <span className="text-[9px] text-primary">{color}</span>
                        </div>
                    ))}
                </div>
            ) : null}
            {avoid ? (
                <div className="flex flex-wrap gap-1">
                    {avoid.map((color, i) => (
                        <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600/[0.05]">
                            <div className="w-4 h-4 rounded border border-red-200" style={{ backgroundColor: avoidHex?.[i] || '#666' }} />
                            <span className="text-[9px] text-red-700">{color}</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function HourlyTimeline({ data }: { data: Array<Record<string, unknown>> }) {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
            {data.map((item, idx) => {
                const timeLabel = (item.time_label || item.time_range || item.formatted || `${item.hour}:00`) as string;
                const energy = (item.energy || item.planetary_energy || item.energy_level || '') as string;
                const isPeak = Boolean(item.is_lucky_hour ?? item.is_peak ?? item.quality === 'peak');
                const score = typeof item.score === 'number' ? item.score : null;
                return (
                    <div key={idx} className={cn(
                        "rounded p-1 text-center",
                        isPeak ? "bg-amber-50 ring-1 ring-amber-200" : "bg-gold-primary/[0.04]",
                    )}>
                        <div className="flex items-center justify-center gap-0.5">
                            <span className="text-[9px] font-bold text-primary">{timeLabel.split('-')[0]?.trim() || timeLabel}</span>
                            {isPeak ? <Star className="w-2 h-2 text-amber-500 fill-amber-500" /> : null}
                        </div>
                        {score !== null ? <span className={cn("text-[8px] font-bold block", scoreTextColor(score * 10))}>{score}</span> : null}
                        {energy ? <p className="text-[6px] text-primary/30 capitalize truncate">{energy}</p> : null}
                    </div>
                );
            })}
        </div>
    );
}

function ScoredActivities({ data }: { data: Record<string, Record<string, unknown>> }) {
    const entries = Object.entries(data).sort((a, b) => ((b[1].score as number) || 0) - ((a[1].score as number) || 0));
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {entries.map(([key, item]) => (
                <MiniBar key={key} value={(item.score as number) || 0} max={10} label={formatKey(key)} />
            ))}
        </div>
    );
}

function ActionPlan({ data }: { data: Array<Record<string, unknown>> }) {
    return (
        <div className="space-y-0.5">
            {data.map((item, i) => {
                const title = (item.area || item.category || '') as string;
                const body = (item.action || item.recommendation || '') as string;
                const priority = item.priority as string | undefined;
                const pColor = !priority ? "" : priority.toLowerCase() === 'high' ? "text-red-600" : priority.toLowerCase() === 'medium' ? "text-amber-700" : "text-emerald-700";
                return (
                    <div key={i} className="flex items-start gap-1.5 text-[10px]">
                        <span className="font-bold text-amber-700/50 tabular-nums shrink-0">{i + 1}.</span>
                        <div className="flex-1 min-w-0">
                            {title ? <span className="font-semibold text-primary capitalize">{formatKey(title)}: </span> : null}
                            <span className="text-primary/60">{body}</span>
                        </div>
                        {priority ? <span className={cn("text-[7px] font-bold uppercase shrink-0", pColor)}>{priority}</span> : null}
                    </div>
                );
            })}
        </div>
    );
}

function KarmicDebt({ data }: { data: Array<Record<string, unknown>> }) {
    return (
        <div className="space-y-1.5">
            {data.map((debt, i) => (
                <div key={i} className="p-2 rounded-lg bg-purple-50/50 overflow-hidden" style={{ borderLeft: '3px solid rgb(192, 132, 252)' }}>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-[13px] font-bold font-serif">{debt.karmic_number as number}</span>
                        <div className="min-w-0">
                            {debt.name ? <p className="text-[10px] font-semibold text-primary truncate">{debt.name as string}</p> : null}
                            {debt.theme ? <p className="text-[8px] text-purple-600">{debt.theme as string}</p> : null}
                        </div>
                    </div>
                    {debt.challenge ? <p className="text-[9px] text-primary/50 mb-0.5">{debt.challenge as string}</p> : null}
                    {(debt.symptoms as string[] | undefined)?.length ? <StringBadges items={debt.symptoms as string[]} variant="warning" /> : null}
                    {(debt.resolution_path as string[] | undefined)?.length ? <div className="mt-0.5"><StringBadges items={debt.resolution_path as string[]} variant="positive" /></div> : null}
                </div>
            ))}
        </div>
    );
}

function YearCards({ data }: { data: Array<Record<string, unknown>> }) {
    return (
        <div className="flex flex-wrap gap-1">
            {data.map((item, i) => (
                <div key={i} className="px-2.5 py-1.5 rounded-lg bg-gold-primary/[0.04] text-center min-w-[70px]">
                    <p className="text-[13px] font-bold font-serif text-gold-dark">{(item.year || item.cycle) as number}</p>
                    {item.theme ? <p className="text-[8px] font-medium text-primary/40">{item.theme as string}</p> : null}
                    {item.age_range ? <p className="text-[7px] text-amber-600">{item.age_range as string}</p> : null}
                </div>
            ))}
        </div>
    );
}

function GenericCardGrid({ data }: { data: Array<Record<string, unknown>> }) {
    return (
        <div className="space-y-1">
            {data.map((item, i) => (
                <div key={i} className="p-1.5 rounded bg-gold-primary/[0.04] space-y-0.5">
                    {Object.entries(item).filter(([, v]) => v !== null && v !== undefined && v !== '').map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1">
                            <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 shrink-0">{formatKey(key)}</span>
                            <span className="text-[10px] text-primary truncate">{
                                typeof val === 'number' ? <span className="font-bold text-gold-dark">{val}</span> :
                                isStringArray(val) ? (val as string[]).join(', ') : renderSimpleValue(val)
                            }</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function PersonProfile({ data }: { data: Record<string, unknown> }) {
    const name = data.name as string | undefined;
    const entries = Object.entries(data).filter(([k, v]) => k !== 'name' && v !== null && v !== undefined && v !== '');
    const numberKeys = entries.filter(([, v]) => typeof v === 'number');
    const textKeys = entries.filter(([, v]) => typeof v === 'string');
    return (
        <div>
            <div className="flex items-center gap-2 flex-wrap">
                {name ? <span className="text-[12px] font-bold text-primary">{name}</span> : null}
                {numberKeys.map(([k, v]) => (
                    <span key={k} className="text-[10px]" title={formatKey(k)}>
                        <span className="font-medium text-amber-700/40">{formatKey(k).split(' ')[0]}</span>{' '}
                        <span className="font-bold text-gold-dark">{v as number}</span>
                    </span>
                ))}
            </div>
            {textKeys.length > 0 ? (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    {textKeys.map(([key, val]) => <KV key={key} label={formatKey(key)} value={val as string} />)}
                </div>
            ) : null}
        </div>
    );
}

function ScoreBreakdown({ data }: { data: Record<string, unknown> }) {
    const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined);
    const barEntries = entries.filter(([k, v]) => typeof v === 'number' && SCORE_KEY_RE.test(k.toLowerCase()));
    const otherEntries = entries.filter(([k, v]) => !(typeof v === 'number' && SCORE_KEY_RE.test(k.toLowerCase())));
    const maxVal = barEntries.length > 0 ? Math.max(...barEntries.map(([, v]) => v as number)) : 10;
    const max = maxVal > 10 ? 100 : 10;

    return (
        <div className="space-y-1.5">
            {barEntries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {barEntries.map(([key, val]) => <MiniBar key={key} value={val as number} max={max} label={formatKey(key)} />)}
                </div>
            ) : null}
            {otherEntries.length > 0 ? (
                <div className="space-y-0.5">
                    {otherEntries.map(([key, val]) => (
                        <div key={key}>
                            {typeof val === 'object' && val !== null ? (
                                <>
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 block">{formatKey(key)}</span>
                                    <SmartSection sectionKey={key} value={val} />
                                </>
                            ) : (
                                <KV label={formatKey(key)} value={renderSimpleValue(val)} />
                            )}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function InfoGrid({ data }: { data: Record<string, unknown> }) {
    const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '');
    const numbers: Array<[string, number]> = [];
    const strings: Array<[string, string]> = [];
    const booleans: Array<[string, boolean]> = [];
    const arrays: Array<[string, unknown]> = [];
    const objects: Array<[string, unknown]> = [];

    for (const [key, val] of entries) {
        if (typeof val === 'number') numbers.push([key, val]);
        else if (typeof val === 'string') strings.push([key, val]);
        else if (typeof val === 'boolean') booleans.push([key, val]);
        else if (Array.isArray(val)) arrays.push([key, val]);
        else if (typeof val === 'object') objects.push([key, val]);
    }

    return (
        <div className="space-y-1.5">
            {numbers.length > 0 && numbers.length <= 6 ? (
                <NumDisplay items={numbers.map(([k, v]) => ({ value: v, label: formatKey(k) }))} />
            ) : null}
            {numbers.length > 6 ? (
                <div className="grid grid-cols-3 gap-x-3 gap-y-0.5">
                    {numbers.map(([key, val]) => <KV key={key} label={formatKey(key)} value={String(val)} />)}
                </div>
            ) : null}

            {arrays.map(([key, val]) => {
                if (Array.isArray(val) && val.length === 0) return <KV key={key} label={formatKey(key)} value="None" />;
                if (isStringArray(val)) {
                    const variant = key.includes('avoid') || key.includes('challenge') || key.includes('symptom') ? 'warning' as const
                        : key.includes('strength') || key.includes('best') || key.includes('recommend') || key.includes('highlight') ? 'positive' as const
                        : 'default' as const;
                    return <div key={key}><span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 block mb-0.5">{formatKey(key)}</span><StringBadges items={val} variant={variant} /></div>;
                }
                if (isNumberArray(val)) return <div key={key}><span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 block mb-0.5">{formatKey(key)}</span><NumBadges items={val} /></div>;
                if (isGenericObjectArray(val)) return <div key={key}><span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 block mb-0.5">{formatKey(key)}</span><GenericCardGrid data={val} /></div>;
                return <KV key={key} label={formatKey(key)} value={renderSimpleValue(val)} />;
            })}

            {objects.map(([key, val]) => {
                const obj = val as Record<string, unknown>;
                if ('score' in obj && typeof obj.score === 'number') {
                    const max = (obj.out_of as number) || (obj.score > 10 ? 100 : 10);
                    return <MiniBar key={key} value={obj.score} max={max} label={formatKey(key)} />;
                }
                return (
                    <div key={key}>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 block mb-0.5">{formatKey(key)}</span>
                        <SmartSection sectionKey={key} value={val} />
                    </div>
                );
            })}

            {strings.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {strings.map(([key, val]) => <KV key={key} label={formatKey(key)} value={val} />)}
                </div>
            ) : null}

            {booleans.map(([key, val]) => <KV key={key} label={formatKey(key)} value={val ? 'Yes' : 'No'} />)}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMART SECTION DISPATCHER
// ═══════════════════════════════════════════════════════════════════════════════

function SmartSection({ sectionKey, value }: { sectionKey: string; value: unknown }) {
    if (value === null || value === undefined) return <span className="text-[9px] text-primary/30 italic">N/A</span>;
    if (typeof value === 'string') {
        if (value === '') return <span className="text-[9px] text-primary/30 italic">—</span>;
        return <p className="text-[10px] text-primary leading-snug">{value}</p>;
    }
    if (typeof value === 'number') return <MiniBar value={value} max={value > 10 ? 100 : 10} />;
    if (typeof value === 'boolean') return <span className={cn("text-[10px] font-semibold", value ? "text-emerald-700" : "text-red-600")}>{value ? 'Yes' : 'No'}</span>;

    if (Array.isArray(value) && value.length === 0) return <span className="text-[9px] text-primary/30 italic">None</span>;
    if (isStringArray(value)) {
        const variant = sectionKey.includes('avoid') || sectionKey.includes('challenge') || sectionKey.includes('symptom') ? 'warning' as const
            : sectionKey.includes('strength') || sectionKey.includes('best') || sectionKey.includes('affirmation') || sectionKey.includes('highlight') || sectionKey.includes('recommend') ? 'positive' as const
            : 'default' as const;
        return <StringBadges items={value} variant={variant} />;
    }
    if (isNumberArray(value)) return <NumBadges items={value} />;
    if (isHourlyTimeline(value)) return <HourlyTimeline data={value} />;
    if (isActionPlanArray(value)) return <ActionPlan data={value} />;
    if (isKarmicDebtArray(value)) return <KarmicDebt data={value} />;
    if (isYearCardsArray(value)) return <YearCards data={value} />;
    if (isGenericObjectArray(value)) return <GenericCardGrid data={value} />;

    if (typeof value === 'object' && !Array.isArray(value)) {
        if (isColorRecommendation(value)) return <ColorPalette data={value as Record<string, unknown>} />;
        if (isScoredActivities(value)) return <ScoredActivities data={value as Record<string, Record<string, unknown>>} />;
        if (isPersonProfile(value)) return <PersonProfile data={value as Record<string, unknown>} />;
        if (isScoreBreakdown(value)) return <ScoreBreakdown data={value as Record<string, unknown>} />;
        return <InfoGrid data={value as Record<string, unknown>} />;
    }

    return <span className="text-[9px] text-primary">{renderSimpleValue(value)}</span>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — Lightweight section grid (no prem-card per section)
// ═══════════════════════════════════════════════════════════════════════════════

interface DetailedAnalysisAccordionProps {
    analysis: Record<string, unknown>;
    className?: string;
}

export default function DetailedAnalysisAccordion({ analysis, className }: DetailedAnalysisAccordionProps) {
    const entries = Object.entries(analysis).filter(([, v]) => v !== null && v !== undefined && v !== '');
    if (entries.length === 0) return null;

    if (entries.length === 1) {
        const [key, value] = entries[0]!;
        return (
            <div className={className}>
                <div className="rounded-lg bg-gold-primary/[0.03] p-2.5">
                    <h4 className="text-[9px] font-bold uppercase tracking-wider text-amber-700/40 mb-1.5 flex items-center gap-1">
                        <span className="w-0.5 h-2.5 rounded-full bg-active-glow/30" />
                        {formatKey(key)}
                    </h4>
                    <SmartSection sectionKey={key} value={value} />
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {entries.map(([key, value]) => {
                    const needsFullWidth = isHourlyTimeline(value) ||
                        isScoredActivities(value) ||
                        (isScoreBreakdown(value) && Object.entries(value as Record<string, unknown>).filter(([, v]) => typeof v === 'number').length > 4) ||
                        (isGenericObjectArray(value) && (value as unknown[]).length > 6);
                    return (
                        <div key={key} className={cn(
                            "rounded-lg bg-gold-primary/[0.03] p-2.5 overflow-hidden",
                            needsFullWidth && "md:col-span-2 lg:col-span-3"
                        )}>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider text-amber-700/40 mb-1.5 flex items-center gap-1">
                                <span className="w-0.5 h-2.5 rounded-full bg-active-glow/30" />
                                {formatKey(key)}
                            </h4>
                            <SmartSection sectionKey={key} value={value} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
