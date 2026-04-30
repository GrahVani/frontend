"use client";

import Link from "next/link";
import {
    Users, Clock, ArrowRight, UserPlus, BarChart3,
    ChevronRight, Sparkles, Star, CalendarDays, Sun, Moon, AlertTriangle,
} from "lucide-react";
import {
    usePanchang, useChoghadiya, useHora, useMuhurta, useLagnaTimes,
    type PanchangDetail, type PanchangData, type MuhurtaData,
    type ChoghadiyaPeriod, type HoraPeriod, type LagnaPeriod,
} from "@/hooks/queries/usePanchang";
import { useRecentClients, useDashboardStats } from "@/hooks/queries/useDashboard";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from '@/components/knowledge';
import { useVedicClient, type VedicClientDetails } from "@/context/VedicClientContext";
import { useRouter } from "next/navigation";
import type { Client } from "@/types/client";
import { NowBadge } from "@/components/common/Badges";

/* ═══════════════════════════════════════════════════════════════════
   SYMBOL & COLOR MAPS
   ═══════════════════════════════════════════════════════════════════ */

const PLANET_SYM: Record<string, string> = {
    Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃',
    Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};
const ZODIAC_SYM: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};
const PLANET_CLR: Record<string, string> = {
    Sun: '#B8650A', Moon: '#4A6FA5', Mars: '#A93226', Mercury: '#2D8B4E',
    Jupiter: '#B8860B', Venus: '#7E57C2', Saturn: '#455A64', Rahu: '#5D4037', Ketu: '#795548',
};
const PLANET_BG: Record<string, string> = {
    Sun: 'rgba(184,101,10,0.22)', Moon: 'rgba(74,111,165,0.22)', Mars: 'rgba(169,50,38,0.22)',
    Mercury: 'rgba(45,139,78,0.22)', Jupiter: 'rgba(184,134,11,0.22)', Venus: 'rgba(126,87,194,0.22)',
    Saturn: 'rgba(69,90,100,0.20)', Rahu: 'rgba(93,64,55,0.18)', Ketu: 'rgba(121,85,72,0.18)',
};
const PLANET_ABBR: Record<string, string> = {
    Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
    Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};
const ELEMENT_CLR: Record<string, string> = {
    Fire: '#B74C3A', Earth: '#4A7856', Air: '#3A6EA5', Water: '#2E8B8B',
};
const ELEMENT_BG: Record<string, string> = {
    Fire: 'rgba(183,76,58,0.22)', Earth: 'rgba(74,120,86,0.22)',
    Air: 'rgba(58,110,165,0.22)', Water: 'rgba(46,139,139,0.22)',
};
const SIGN_ELEMENT: Record<string, string> = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};
const PANCH_ACCENT: Record<string, string> = {
    Tithi: '#4A6FA5', Nakshatra: '#B8860B', Yoga: '#2E8B8B',
    Karana: '#8B5A2B', Vara: '#B8650A',
};

/* ═══════════════════════════════════════════════════════════════════
   NATURE COLOR SYSTEM (3-color semantic)
   ═══════════════════════════════════════════════════════════════════ */

function resolveNature(nature: string) {
    const k = nature.toLowerCase();
    if (k.includes('shubha') && !k.includes('ashubha'))
        return { solid: '#5B7A4A', light: 'rgba(91,122,74,0.22)', text: '#4A6741' };
    if (k.includes('ashubha') || k.includes('inauspicious'))
        return { solid: '#9B4A3A', light: 'rgba(155,74,58,0.22)', text: '#8B3A3A' };
    return { solid: '#B7891F', light: 'rgba(183,137,31,0.20)', text: '#8B6914' };
}

/* ═══════════════════════════════════════════════════════════════════
   TIME HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function timeToMin(t: string): number {
    if (!t || t === '-') return 0;
    const [h, m] = t.split(':').map(Number);
    return isNaN(h) || isNaN(m) ? 0 : h * 60 + m;
}

function durFromTimes(start: string, end: string): number {
    if (!start || start === '-' || !end || end === '-') return 0;
    let s = timeToMin(start), e = timeToMin(end);
    if (e <= s) e += 24 * 60;
    return e - s;
}

function shortTime(t: string): string {
    if (!t || t === '-') return '-';
    const p = t.split(':');
    return p.length >= 2 ? `${p[0]}:${p[1]}` : t;
}

function getGreeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function todayDate(): string {
    return new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getInitials(n: string): string {
    return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getWindowStatus(start: string, end: string): 'active' | 'upcoming' | 'passed' {
    if (!start || start === '-' || !end || end === '-') return 'passed';
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const s = timeToMin(start);
    let e = timeToMin(end);
    if (e <= s) e += 24 * 60;
    let adj = nowMin;
    if (adj < s && e > 24 * 60) adj += 24 * 60;
    if (adj >= s && adj <= e) return 'active';
    if (adj < s) return 'upcoming';
    return 'passed';
}

function calcProgress(start: string, end: string): number {
    if (!start || start === '-' || !end || end === '-') return 0;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const s = timeToMin(start);
    let e = timeToMin(end);
    if (e <= s) e += 24 * 60;
    let adj = nowMin;
    if (adj < s && e > 24 * 60) adj += 24 * 60;
    const total = e - s;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(100, ((adj - s) / total) * 100));
}

function calcRemaining(start: string, end: string): string {
    if (!start || start === '-' || !end || end === '-') return '';
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const s = timeToMin(start);
    let e = timeToMin(end);
    if (e <= s) e += 24 * 60;
    let adj = nowMin;
    if (adj < s && e > 24 * 60) adj += 24 * 60;
    const rem = e - adj;
    if (rem <= 0) return 'ended';
    const h = Math.floor(rem / 60);
    const m = rem % 60;
    return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

/* ═══════════════════════════════════════════════════════════════════
   UI PRIMITIVES
   ═══════════════════════════════════════════════════════════════════ */


const ROW_BORDER: React.CSSProperties = { borderBottom: '1px solid rgba(220, 201, 166, 0.15)' };

function ProgressRing({ progress, color, size = 68, strokeWidth = 4 }: {
    progress: number; color: string; size?: number; strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return (
        <svg width={size} height={size} className="transform -rotate-90" style={{ filter: `drop-shadow(0 0 6px ${color}30)` }}>
            <circle cx={size / 2} cy={size / 2} r={radius}
                stroke="rgba(186,164,126,0.12)" strokeWidth={strokeWidth} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={radius}
                stroke={color} strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   PANCHANG CARD — Rich, accented individual card
   ═══════════════════════════════════════════════════════════════════ */

function PanchangCard({ detail, label, icon, accent, term }: {
    detail: PanchangDetail; label: string; icon: string; accent: string; term?: string;
}) {
    const pct = typeof detail.progress === 'number' ? Math.min(100, detail.progress) : null;
    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden relative" style={{ borderTop: `3px solid ${accent}` }}>
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${accent}30 0%, ${accent}08 50%, transparent 100%)` }} />
            <div className="relative p-5">
                <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-[24px] leading-none" style={{ color: accent }}>{icon}</span>
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: accent }}>
                        {term ? <KnowledgeTooltip term={term} unstyled>{label}</KnowledgeTooltip> : label}
                    </span>
                    {typeof detail.number === 'number' && (
                        <span className="text-[10px] font-mono font-bold ml-auto px-1.5 py-0.5 rounded"
                            style={{ color: accent, backgroundColor: `${accent}15` }}>
                            #{detail.number}
                        </span>
                    )}
                </div>
                <div className="text-[22px] font-serif font-bold text-amber-900 leading-tight">{detail.name}</div>

                {/* Primary metadata: paksha, pada, lord, type */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2.5">
                    {detail.paksha && <span className="text-[12px] font-bold" style={{ color: accent }}>{detail.paksha}</span>}
                    {detail.pada && (
                        <span className="text-[11px] text-amber-900 font-bold">
                            Pada <span className="font-bold" style={{ color: accent }}>{detail.pada}</span>
                        </span>
                    )}
                    {detail.lord && (
                        <span className="text-[11px] font-bold" style={{ color: PLANET_CLR[detail.lord] || accent }}>
                            {PLANET_SYM[detail.lord] || ''} {detail.lord}
                        </span>
                    )}
                    {detail.type && <span className="text-[11px] text-amber-900 font-bold capitalize">{detail.type}</span>}
                </div>

                {/* Extended metadata: deity, gana, symbol */}
                {(detail.deity || detail.gana || detail.symbol) && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5">
                        {detail.deity && (
                            <span className="text-[10px] text-amber-900 font-bold">
                                <span className="font-bold" style={{ color: accent }}>Deity:</span> {detail.deity}
                            </span>
                        )}
                        {detail.gana && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ color: accent, backgroundColor: `${accent}15` }}>
                                {detail.gana}
                            </span>
                        )}
                        {detail.symbol && (
                            <span className="text-[10px] text-amber-900 font-bold italic">{detail.symbol}</span>
                        )}
                    </div>
                )}

                {/* Meaning / significance */}
                {detail.meaning && (
                    <p className="text-[10px] text-amber-900 font-bold mt-1.5 italic leading-relaxed line-clamp-2">{detail.meaning}</p>
                )}
                {detail.special && (
                    <p className="text-[10px] font-bold mt-1.5 leading-relaxed" style={{ color: accent }}>
                        ★ {detail.special}
                    </p>
                )}

                {((detail.endTime && detail.endTime !== '-') || pct !== null) && (
                    <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${accent}25` }}>
                        {detail.endTime && detail.endTime !== '-' && (
                            <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-bold">
                                <Clock className="w-3 h-3" style={{ color: accent }} />
                                Ends <span className="font-mono font-bold text-amber-900">{shortTime(detail.endTime)}</span>
                            </div>
                        )}
                        {pct !== null && (
                            <div className="flex items-center gap-2 ml-auto">
                                <div className="w-16 h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${accent}25` }}>
                                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: accent }} />
                                </div>
                                <span className="text-[10px] font-bold" style={{ color: accent }}>{Math.round(pct)}%</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   LIVE COSMIC PULSE — Commanding current-state dashboard
   Progress rings, muhurta warnings, temporal awareness.
   ═══════════════════════════════════════════════════════════════════ */

function NowStrip({ hora, chog, lagna, muhurta }: {
    hora?: HoraPeriod; chog?: ChoghadiyaPeriod; lagna?: LagnaPeriod; muhurta?: MuhurtaData;
}) {
    if (!hora && !chog && !lagna) return null;

    const warnings: { name: string; end: string; icon: string }[] = [];
    const blessings: { name: string; end: string }[] = [];
    if (muhurta) {
        if (muhurta.rahuKaal && getWindowStatus(muhurta.rahuKaal.start, muhurta.rahuKaal.end) === 'active')
            warnings.push({ name: 'Rahu Kaal', end: muhurta.rahuKaal.end, icon: '☊' });
        if (muhurta.gulikaKaal && getWindowStatus(muhurta.gulikaKaal.start, muhurta.gulikaKaal.end) === 'active')
            warnings.push({ name: 'Gulika Kaal', end: muhurta.gulikaKaal.end, icon: '◉' });
        if (muhurta.yamaganda && getWindowStatus(muhurta.yamaganda.start, muhurta.yamaganda.end) === 'active')
            warnings.push({ name: 'Yamaganda', end: muhurta.yamaganda.end, icon: '⚠' });
        if (muhurta.abhijitMuhurat && getWindowStatus(muhurta.abhijitMuhurat.start, muhurta.abhijitMuhurat.end) === 'active')
            blessings.push({ name: 'Abhijit Muhurat', end: muhurta.abhijitMuhurat.end });
    }

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm glass-shimmer relative overflow-hidden"
            style={{
                borderLeft: '4px solid var(--gold-primary)',
                background: 'linear-gradient(135deg, rgba(201,162,77,0.10) 0%, rgba(255,253,249,0.45) 30%, rgba(250,245,234,0.35) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(62,42,31,0.06)',
            }}>
            <div className="px-6 pt-4 pb-1 flex items-center gap-2">
                <NowBadge />
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-amber-700">Live Cosmic Pulse</span>
            </div>

            {warnings.length > 0 && (
                <div className="mx-6 mt-2 px-4 py-2.5 rounded-lg flex items-center gap-3"
                    style={{ background: 'rgba(155,74,58,0.12)', border: '1px solid rgba(155,74,58,0.25)' }}>
                    <AlertTriangle className="w-4 h-4 text-[#9B4A3A] shrink-0" />
                    <div className="text-[11px] font-bold text-[#8B3A3A]">
                        {warnings.map((w, i) => (
                            <span key={i}>
                                {i > 0 && <span className="text-[#9B4A3A]/30 mx-1.5">·</span>}
                                {w.icon} {MUHURTA_TERM[w.name] ? <KnowledgeTooltip term={MUHURTA_TERM[w.name]} unstyled>{w.name}</KnowledgeTooltip> : w.name} active until {shortTime(w.end)}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {blessings.length > 0 && (
                <div className="mx-6 mt-2 px-4 py-2.5 rounded-lg flex items-center gap-3"
                    style={{ background: 'rgba(91,122,74,0.12)', border: '1px solid rgba(91,122,74,0.25)' }}>
                    <Star className="w-4 h-4 text-[#5B7A4A] shrink-0" />
                    <div className="text-[11px] font-bold text-[#4A6741]">
                        {blessings.map((b, i) => (
                            <span key={i}>
                                {i > 0 && <span className="text-[#5B7A4A]/30 mx-1.5">·</span>}
                                ★ {MUHURTA_TERM[b.name] ? <KnowledgeTooltip term={MUHURTA_TERM[b.name]} unstyled>{b.name}</KnowledgeTooltip> : b.name} active until {shortTime(b.end)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-5 pt-3">
                {chog && (() => {
                    const nc = resolveNature(chog.nature);
                    const prog = calcProgress(chog.start, chog.end);
                    const rem = calcRemaining(chog.start, chog.end);
                    return (
                        <div className="flex items-center gap-4 rounded-xl p-3.5"
                            style={{ background: nc.light, border: `1px solid ${nc.solid}40` }}>
                            <div className="relative shrink-0">
                                <ProgressRing progress={prog} color={nc.solid} />
                                <span className="absolute inset-0 flex items-center justify-center text-[20px]">⏳</span>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-amber-900"><KnowledgeTooltip term="choghadiya" unstyled>Choghadiya</KnowledgeTooltip></div>
                                <div className="text-[18px] font-serif font-bold text-amber-900 leading-tight">{chog.type}</div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
                                    style={{ color: nc.text, backgroundColor: `${nc.solid}15` }}>
                                    {chog.nature}
                                </span>
                                <div className="text-[11px] font-mono font-bold text-amber-900 mt-1.5">
                                    {shortTime(chog.start)} → {shortTime(chog.end)}
                                </div>
                                {rem && rem !== 'ended' && (
                                    <div className="text-[10px] font-bold mt-0.5" style={{ color: nc.solid }}>{rem}</div>
                                )}
                            </div>
                        </div>
                    );
                })()}
                {hora && (() => {
                    const hc = PLANET_CLR[hora.planet] || '#C9A24D';
                    const hbg = PLANET_BG[hora.planet] || 'rgba(201,162,77,0.15)';
                    const prog = hora.progress || calcProgress(hora.start, hora.end);
                    const rem = calcRemaining(hora.start, hora.end);
                    return (
                        <div className="flex items-center gap-4 rounded-xl p-3.5"
                            style={{ background: hbg, border: `1px solid ${hc}40` }}>
                            <div className="relative shrink-0">
                                <ProgressRing progress={prog} color={hc} />
                                <span className="absolute inset-0 flex items-center justify-center text-[20px]"
                                    style={{ color: hc }}>
                                    {PLANET_SYM[hora.planet] || '·'}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-amber-900">Planetary <KnowledgeTooltip term="hora" unstyled>Hora</KnowledgeTooltip></div>
                                <div className="text-[18px] font-serif font-bold text-amber-900 leading-tight">{hora.planet}</div>
                                {hora.nature && hora.nature !== '-' && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
                                        style={{ color: hc, backgroundColor: `${hc}15` }}>
                                        {hora.nature}
                                    </span>
                                )}
                                <div className="text-[11px] font-mono font-bold text-amber-900 mt-1.5">
                                    {shortTime(hora.start)} → {shortTime(hora.end)}
                                </div>
                                {rem && rem !== 'ended' && (
                                    <div className="text-[10px] font-bold mt-0.5" style={{ color: hc }}>{rem}</div>
                                )}
                            </div>
                        </div>
                    );
                })()}
                {lagna && (() => {
                    const elem = SIGN_ELEMENT[lagna.lagnaName] || '';
                    const ec = ELEMENT_CLR[elem] || '#C9A24D';
                    const ebg = ELEMENT_BG[elem] || 'rgba(201,162,77,0.15)';
                    const prog = lagna.progress || calcProgress(lagna.start, lagna.end);
                    const rem = calcRemaining(lagna.start, lagna.end);
                    return (
                        <div className="flex items-center gap-4 rounded-xl p-3.5"
                            style={{ background: ebg, border: `1px solid ${ec}40` }}>
                            <div className="relative shrink-0">
                                <ProgressRing progress={prog} color={ec} />
                                <span className="absolute inset-0 flex items-center justify-center text-[20px]"
                                    style={{ color: ec }}>
                                    {ZODIAC_SYM[lagna.lagnaName] || '★'}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-amber-900">Rising Sign (<KnowledgeTooltip term="lagna" unstyled>Lagna</KnowledgeTooltip>)</div>
                                <div className="text-[18px] font-serif font-bold text-amber-900 leading-tight">{lagna.lagnaName}</div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
                                    style={{ color: ec, backgroundColor: `${ec}18` }}>
                                    {elem}
                                </span>
                                <div className="text-[11px] font-mono font-bold text-amber-900 mt-1.5">
                                    {shortTime(lagna.start)} → {shortTime(lagna.end)}
                                </div>
                                {rem && rem !== 'ended' && (
                                    <div className="text-[10px] font-bold mt-0.5" style={{ color: ec }}>{rem}</div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MUHURTA WINDOW — Single prominent timing card
   ═══════════════════════════════════════════════════════════════════ */

const MUHURTA_TERM: Record<string, string> = {
    'Rahu Kaal': 'rahu_kaal', 'Gulika Kaal': 'gulika_kaal',
    'Yamaganda': 'yamaghanta', 'Abhijit Muhurat': 'abhijit_muhurta',
};

function MuhurtaWindow({ name, start, end, variant, icon, quality, description }: {
    name: string; start: string; end: string;
    variant: 'auspicious' | 'inauspicious' | 'mixed'; icon: string;
    quality?: string; description?: string;
}) {
    const status = getWindowStatus(start, end);
    const isActive = status === 'active';
    const dur = durFromTimes(start, end);
    const hrs = Math.floor(dur / 60);
    const mins = dur % 60;
    const muhurtaTerm = MUHURTA_TERM[name];

    const V = {
        auspicious: { border: '#5B7A4A', text: '#4A6741', bg: 'rgba(91,122,74,0.06)', activeBg: 'rgba(91,122,74,0.14)', badge: 'Auspicious' },
        inauspicious: { border: '#9B4A3A', text: '#8B3A3A', bg: 'rgba(155,74,58,0.06)', activeBg: 'rgba(155,74,58,0.14)', badge: 'Avoid' },
        mixed: { border: '#B7891F', text: '#8B6914', bg: 'rgba(183,137,31,0.06)', activeBg: 'rgba(183,137,31,0.12)', badge: 'Mixed' },
    }[variant];

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden relative" style={{ borderLeft: `4px solid ${V.border}` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: isActive ? V.activeBg : V.bg }} />
            <div className="relative p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[18px]" style={{ color: V.text }}>{icon}</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: V.text }}>{muhurtaTerm ? <KnowledgeTooltip term={muhurtaTerm} unstyled>{name}</KnowledgeTooltip> : name}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ color: V.text, backgroundColor: `${V.border}15`, border: `1px solid ${V.border}25` }}>
                        {V.badge}
                    </span>
                </div>

                {quality && quality !== '-' && (
                    <div className="text-[10px] font-semibold mb-2.5 italic" style={{ color: V.text }}>{quality}</div>
                )}

                <div className="text-[24px] font-mono font-bold text-amber-900 tracking-tight">
                    {shortTime(start)}
                    <span className="text-amber-900/60 mx-2.5 text-[16px] font-normal">&rarr;</span>
                    {shortTime(end)}
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] font-bold text-amber-900">
                        {hrs > 0 ? `${hrs}h ` : ''}{mins}m duration
                    </span>
                    {isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{ color: '#fff', backgroundColor: V.border }}>
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                            </span>
                            ACTIVE
                        </span>
                    ) : (
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider",
                            status === 'upcoming' ? 'text-amber-700' : 'text-amber-900/80')}>
                            {status === 'upcoming' ? 'Upcoming' : 'Passed'}
                        </span>
                    )}
                </div>

                {description && description !== '-' && (
                    <p className="text-[10px] text-amber-900 font-medium mt-2.5 pt-2.5 leading-relaxed line-clamp-2"
                        style={{ borderTop: `1px solid ${V.border}18` }}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MUHURTA SECTION — Sun/Moon header + Window cards grid
   ═══════════════════════════════════════════════════════════════════ */

function MuhurtaSection({ muhurta, panchang }: {
    muhurta: MuhurtaData; panchang?: PanchangData;
}) {
    const sunrise = panchang?.sunrise || muhurta.sunrise;
    const sunset = panchang?.sunset || muhurta.sunset;

    type WinDef = { name: string; start: string; end: string; variant: 'auspicious' | 'inauspicious' | 'mixed'; icon: string; quality?: string; description?: string };
    const windows: WinDef[] = [];
    if (muhurta.abhijitMuhurat) windows.push({ name: 'Abhijit Muhurat', start: muhurta.abhijitMuhurat.start, end: muhurta.abhijitMuhurat.end, variant: 'auspicious', icon: '★', quality: muhurta.abhijitMuhurat.quality, description: muhurta.abhijitMuhurat.description });
    if (muhurta.rahuKaal) windows.push({ name: 'Rahu Kaal', start: muhurta.rahuKaal.start, end: muhurta.rahuKaal.end, variant: 'inauspicious', icon: '☊', quality: muhurta.rahuKaal.quality, description: muhurta.rahuKaal.description });
    if (muhurta.gulikaKaal) windows.push({ name: 'Gulika Kaal', start: muhurta.gulikaKaal.start, end: muhurta.gulikaKaal.end, variant: 'inauspicious', icon: '◉', quality: muhurta.gulikaKaal.quality, description: muhurta.gulikaKaal.description });
    if (muhurta.yamaganda) windows.push({ name: 'Yamaganda', start: muhurta.yamaganda.start, end: muhurta.yamaganda.end, variant: 'inauspicious', icon: '⚠', quality: muhurta.yamaganda.quality, description: muhurta.yamaganda.description });
    if (muhurta.pradoshKaal) windows.push({ name: 'Pradosh Kaal', start: muhurta.pradoshKaal.start, end: muhurta.pradoshKaal.end, variant: 'mixed', icon: '☾', quality: muhurta.pradoshKaal.quality, description: muhurta.pradoshKaal.description });

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-serif font-bold text-amber-900"><KnowledgeTooltip term="muhurta">Muhurta</KnowledgeTooltip> Windows</h3>
                <div className="flex items-center gap-4 text-[12px]">
                    <div className="flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-[#D4880F]" />
                        <span className="text-[10px] text-amber-900 font-bold hidden sm:inline">Rise</span>
                        <span className="font-mono font-bold text-amber-900">{shortTime(sunrise)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-[#C97A2F]/60" />
                        <span className="text-[10px] text-amber-900 font-bold hidden sm:inline">Set</span>
                        <span className="font-mono font-bold text-amber-900">{shortTime(sunset)}</span>
                    </div>
                    {panchang?.moonrise && panchang.moonrise !== '-' && (
                        <div className="flex items-center gap-1.5 hidden lg:flex">
                            <Moon className="w-4 h-4 text-[#4A6FA5]" />
                            <span className="font-mono font-bold text-amber-900">{shortTime(panchang.moonrise)}</span>
                        </div>
                    )}
                    {muhurta.dayDuration && (
                        <span className="text-[10px] text-amber-900 font-bold font-mono hidden lg:inline">
                            Day: {muhurta.dayDuration}
                        </span>
                    )}
                </div>
            </div>

            {windows.length > 0 && (
                <div className={cn("grid gap-4",
                    windows.length <= 3 ? "grid-cols-1 sm:grid-cols-3" :
                        windows.length === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
                            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                )}>
                    {windows.map((w, i) => <MuhurtaWindow key={i} {...w} />)}
                </div>
            )}

            {muhurta.durMuhurats.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-4 pt-4" style={{ borderTop: '1px solid rgba(186,164,126,0.20)' }}>
                    {muhurta.durMuhurats.map((d, i) => (
                        <span key={i} className="text-[11px] font-bold inline-flex items-center gap-1.5 rounded-lg px-3 py-2"
                            style={{ color: '#8B3A3A', backgroundColor: 'rgba(155,74,58,0.12)', border: '1px solid rgba(155,74,58,0.35)' }}>
                            <AlertTriangle className="w-3 h-3" />
                            {d.name}: {shortTime(d.start)} &ndash; {shortTime(d.end)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   HORIZONTAL TIMELINE BAR — Reusable proportional segments
   ═══════════════════════════════════════════════════════════════════ */

interface TSegment {
    label: string;
    duration: number;
    solid: string;
    light: string;
    textColor: string;
    isCurrent: boolean;
}

function TimelineBar({ segments, phase, startTime, endTime }: {
    segments: TSegment[];
    phase: 'day' | 'night';
    startTime: string;
    endTime: string;
}) {
    const total = segments.reduce((s, seg) => s + seg.duration, 0);
    if (total === 0 || segments.length === 0) return null;
    const isDay = phase === 'day';
    const totalHrs = Math.floor(total / 60);
    const totalMins = total % 60;

    // Now-marker position within this phase
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const sMin = timeToMin(startTime);
    let eMin = timeToMin(endTime);
    if (eMin <= sMin) eMin += 24 * 60;
    let adjNow = nowMin;
    if (adjNow < sMin && eMin > 24 * 60) adjNow += 24 * 60;
    const totalSpan = eMin - sMin;
    const nowPct = totalSpan > 0 ? ((adjNow - sMin) / totalSpan) * 100 : -1;
    const showNow = nowPct >= 0 && nowPct <= 100;

    return (
        <div className="mt-5">
            {/* Atmospheric phase header */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-3"
                style={{
                    background: isDay
                        ? 'linear-gradient(90deg, rgba(212,136,15,0.08) 0%, rgba(201,162,77,0.04) 40%, transparent 80%)'
                        : 'linear-gradient(90deg, rgba(74,111,165,0.08) 0%, rgba(90,123,165,0.04) 40%, transparent 80%)',
                    borderLeft: `3px solid ${isDay ? 'rgba(212,136,15,0.40)' : 'rgba(74,111,165,0.35)'}`,
                }}>
                {isDay
                    ? <Sun className="w-4 h-4 text-[#D4880F]" />
                    : <Moon className="w-4 h-4 text-[#4A6FA5]" />}
                <span className={cn("text-[11px] font-bold tracking-[0.08em] uppercase",
                    isDay ? 'text-[#9C7A2F]' : 'text-[#5A7BA5]')}>
                    {isDay ? 'Day Periods' : 'Night Periods'}
                </span>
                <span className="text-[10px] text-amber-900/30">
                    · {segments.length} periods
                </span>
                <span className="text-[10px] font-mono text-amber-900/30 ml-auto">
                    {shortTime(startTime)} → {shortTime(endTime)}
                </span>
                <span className="text-[10px] font-mono text-amber-900/30 ml-2">
                    {totalHrs}h {totalMins}m
                </span>
            </div>

            {/* Timeline bar with now marker */}
            <div className="relative">
                <div className="flex h-[46px] rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(186,164,126,0.30)' }}>
                    {segments.map((seg, i) => {
                        const pct = (seg.duration / total) * 100;
                        return (
                            <div
                                key={i}
                                className="h-full flex items-center justify-center overflow-hidden"
                                style={{
                                    width: `${pct}%`,
                                    minWidth: '3px',
                                    backgroundColor: seg.isCurrent ? seg.solid : seg.light,
                                    borderRight: i < segments.length - 1 ? '1px solid rgba(186,164,126,0.20)' : 'none',
                                    ...(seg.isCurrent ? {
                                        boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.35), 0 0 16px ${seg.solid}35`,
                                        zIndex: 1,
                                        position: 'relative' as const,
                                    } : {}),
                                }}
                                title={seg.label}
                            >
                                {pct > 6 && (
                                    <span className="text-[12px] font-bold truncate px-1"
                                        style={{ color: seg.isCurrent ? '#FFFDF9' : seg.textColor }}>
                                        {seg.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                {showNow && (
                    <div className="absolute top-0 bottom-0 z-10 pointer-events-none"
                        style={{ left: `${nowPct}%` }}>
                        <div className="w-[3px] h-full rounded-full"
                            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, var(--gold-primary) 40%, rgba(255,255,255,0.95) 100%)' }} />
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-white absolute -top-1 -left-[4px]"
                            style={{ backgroundColor: 'var(--gold-primary)', boxShadow: '0 0 8px rgba(201,162,77,0.5)' }} />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   CURRENT STATUS CALLOUT — Shown above each timeline
   ═══════════════════════════════════════════════════════════════════ */

function CurrentCallout({ children, borderColor, bgColor, progress, remaining }: {
    children: React.ReactNode; borderColor: string; bgColor: string;
    progress?: number; remaining?: string;
}) {
    return (
        <div className="rounded-xl p-4 mt-4 flex gap-4"
            style={{
                background: `linear-gradient(135deg, ${bgColor} 0%, rgba(255,253,249,0.30) 60%, transparent 100%)`,
                backdropFilter: 'blur(12px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
                borderLeft: `4px solid ${borderColor}`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), 0 0 0 1px ${borderColor}25, 0 4px 16px ${borderColor}18`,
            }}>
            {typeof progress === 'number' && (
                <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="relative">
                        <ProgressRing progress={progress} color={borderColor} size={56} strokeWidth={3.5} />
                        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold font-mono"
                            style={{ color: borderColor }}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                    {remaining && remaining !== 'ended' && (
                        <span className="text-[9px] font-bold mt-1.5 whitespace-nowrap" style={{ color: borderColor }}>{remaining}</span>
                    )}
                </div>
            )}
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   CHOGHADIYA TIMELINE
   ═══════════════════════════════════════════════════════════════════ */

function ChoghadiyaTimeline({ periods, current }: {
    periods: ChoghadiyaPeriod[]; current?: ChoghadiyaPeriod;
}) {
    if (periods.length === 0) return null;
    const day = periods.filter((_, i) => i < 8);
    const night = periods.filter((_, i) => i >= 8);

    function toSeg(ps: ChoghadiyaPeriod[]): TSegment[] {
        return ps.map(p => {
            const nc = resolveNature(p.nature);
            return {
                label: p.type,
                duration: p.durationMinutes || durFromTimes(p.start, p.end),
                solid: nc.solid, light: nc.light, textColor: nc.text,
                isCurrent: !!p.isCurrent,
            };
        });
    }

    const nc = current ? resolveNature(current.nature) : null;

    function renderPeriodCards(ps: ChoghadiyaPeriod[]) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {ps.map((p, j) => {
                    const pnc = resolveNature(p.nature);
                    const dur = p.durationMinutes || durFromTimes(p.start, p.end);
                    return (
                        <div key={j} className="rounded-lg overflow-hidden relative transition-opacity"
                            style={{
                                backgroundColor: p.isCurrent ? `${pnc.solid}30` : pnc.light,
                                borderLeft: `${p.isCurrent ? 4 : 3}px solid ${pnc.solid}`,
                                ...(p.isCurrent ? { boxShadow: `0 0 0 2px ${pnc.solid}, 0 0 18px ${pnc.solid}30, 0 0 40px ${pnc.solid}15` } : {}),
                                ...(getWindowStatus(p.start, p.end) === 'passed' && !p.isCurrent ? { opacity: 0.4 } : {}),
                            }}>
                            {p.isCurrent && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: pnc.solid }} />
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: pnc.solid }} />
                                </span>
                            )}
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold" style={{ color: pnc.text }}>{p.type}</span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                        style={{ color: pnc.text, backgroundColor: `${pnc.solid}18`, border: `1px solid ${pnc.solid}30` }}>
                                        {p.nature}
                                    </span>
                                </div>
                                {p.quality && p.quality !== '-' && (
                                    <div className="text-[10px] font-semibold mt-1" style={{ color: pnc.text }}>{p.quality}</div>
                                )}
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-[11px] font-mono font-bold text-amber-900">
                                        {shortTime(p.start)} – {shortTime(p.end)}
                                    </span>
                                    <span className="text-[10px] font-bold text-amber-900">{dur}m</span>
                                </div>
                                {p.deity && p.deity !== '-' && (
                                    <div className="text-[10px] text-amber-900 font-bold mt-1.5">
                                        <span className="font-bold" style={{ color: pnc.text }}>Deity:</span> {p.deity}
                                    </div>
                                )}
                                {p.bestFor && p.bestFor !== '-' && (
                                    <p className="text-[10px] text-amber-900 font-bold mt-1.5 line-clamp-2 leading-relaxed">
                                        <span className="font-bold uppercase tracking-wider" style={{ color: '#5B7A4A' }}>Best: </span>
                                        {p.bestFor}
                                    </p>
                                )}
                                {p.avoid && p.avoid !== '-' && (
                                    <p className="text-[10px] text-amber-900 font-bold mt-1 line-clamp-1 leading-relaxed">
                                        <span className="font-bold uppercase tracking-wider" style={{ color: '#9B4A3A' }}>Avoid: </span>
                                        {p.avoid}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-serif font-bold text-amber-900"><KnowledgeTooltip term="choghadiya">Choghadiya</KnowledgeTooltip></h3>
                {current && <NowBadge />}
            </div>

            {current && nc && (
                <CurrentCallout borderColor={nc.solid} bgColor={nc.light}
                    progress={calcProgress(current.start, current.end)}
                    remaining={calcRemaining(current.start, current.end)}>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div>
                            <span className="text-[18px] font-serif font-bold text-amber-900">{current.type}</span>
                            <span className="text-[12px] font-semibold ml-2" style={{ color: nc.text }}>{current.nature}</span>
                            {current.quality && current.quality !== '-' && (
                                <span className="text-[11px] ml-2" style={{ color: nc.text }}>&middot; {current.quality}</span>
                            )}
                        </div>
                        <span className="text-[12px] font-bold text-amber-900">{current.deity}</span>
                        <span className="text-[13px] font-mono font-bold text-amber-900 ml-auto">
                            {shortTime(current.start)} &ndash; {shortTime(current.end)}
                        </span>
                    </div>
                    {current.description && current.description !== '-' && (
                        <p className="text-[11px] text-amber-900 font-medium mt-1.5 leading-relaxed">{current.description}</p>
                    )}
                    {current.bestFor && current.bestFor !== '-' && (
                        <p className="text-[11px] text-amber-900 font-bold mt-1.5 leading-relaxed">
                            <span className="font-bold uppercase text-[9px] tracking-wider mr-1" style={{ color: '#5B7A4A' }}>Best for:</span>
                            {current.bestFor}
                        </p>
                    )}
                    {current.avoid && current.avoid !== '-' && (
                        <p className="text-[11px] text-amber-900 font-bold mt-1 leading-relaxed">
                            <span className="font-bold uppercase text-[9px] tracking-wider mr-1" style={{ color: '#9B4A3A' }}>Avoid:</span>
                            {current.avoid}
                        </p>
                    )}
                </CurrentCallout>
            )}

            {day.length > 0 && (
                <>
                    <TimelineBar segments={toSeg(day)} phase="day"
                        startTime={day[0].start} endTime={day[day.length - 1].end} />
                    {renderPeriodCards(day)}
                </>
            )}
            {night.length > 0 && (
                <>
                    <TimelineBar segments={toSeg(night)} phase="night"
                        startTime={night[0].start} endTime={night[night.length - 1].end} />
                    {renderPeriodCards(night)}
                </>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   HORA TIMELINE
   ═══════════════════════════════════════════════════════════════════ */

function HoraTimeline({ periods, current }: {
    periods: HoraPeriod[]; current?: HoraPeriod;
}) {
    if (periods.length === 0) return null;
    const day = periods.filter((_, i) => i < 12);
    const night = periods.filter((_, i) => i >= 12);

    function toSeg(ps: HoraPeriod[]): TSegment[] {
        return ps.map(h => ({
            label: PLANET_ABBR[h.planet] || h.planet.slice(0, 2),
            duration: durFromTimes(h.start, h.end),
            solid: PLANET_CLR[h.planet] || '#C9A24D',
            light: PLANET_BG[h.planet] || 'rgba(201,162,77,0.20)',
            textColor: PLANET_CLR[h.planet] || '#C9A24D',
            isCurrent: h.isCurrent,
        }));
    }

    const pc = current ? PLANET_CLR[current.planet] || '#C9A24D' : null;

    function rankStars(rank: number): string {
        if (rank <= 2) return '★★★';
        if (rank <= 4) return '★★';
        if (rank <= 6) return '★';
        return '○';
    }

    function renderHoraCards(ps: HoraPeriod[]) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                {ps.map((h, j) => {
                    const hpc = PLANET_CLR[h.planet] || '#C9A24D';
                    const hpbg = PLANET_BG[h.planet] || 'rgba(201,162,77,0.15)';
                    const dur = durFromTimes(h.start, h.end);
                    return (
                        <div key={j} className="rounded-lg overflow-hidden relative transition-opacity"
                            style={{
                                backgroundColor: h.isCurrent ? `${hpc}30` : hpbg,
                                borderLeft: `${h.isCurrent ? 4 : 3}px solid ${hpc}`,
                                ...(h.isCurrent ? { boxShadow: `0 0 0 2px ${hpc}, 0 0 18px ${hpc}30, 0 0 40px ${hpc}15` } : {}),
                                ...(getWindowStatus(h.start, h.end) === 'passed' && !h.isCurrent ? { opacity: 0.4 } : {}),
                            }}>
                            {h.isCurrent && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: hpc }} />
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: hpc }} />
                                </span>
                            )}
                            <div className="p-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[18px] leading-none" style={{ color: hpc }}>{PLANET_SYM[h.planet] || '·'}</span>
                                    <span className="text-[13px] font-bold text-amber-900">{h.planet}</span>
                                    {h.sanskritName && h.sanskritName !== '-' && (
                                        <span className="text-[9px] italic font-bold text-amber-900 ml-auto">{h.sanskritName.split('/')[0]}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-[11px] font-mono font-bold text-amber-900">
                                        {shortTime(h.start)} – {shortTime(h.end)}
                                    </span>
                                    <span className="text-[10px] font-bold text-amber-900">{dur}m</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                    {h.nature && h.nature !== '-' && (
                                        <span className="text-[10px] font-bold" style={{ color: hpc }}>{h.nature}</span>
                                    )}
                                    {h.quality && h.quality !== '-' && (
                                        <span className="text-[10px] text-amber-900 font-bold">{h.quality}</span>
                                    )}
                                    {h.rank < 99 && (
                                        <span className="text-[10px] ml-auto" style={{ color: hpc }}>{rankStars(h.rank)}</span>
                                    )}
                                </div>
                                {h.bestFor && h.bestFor !== '-' && (
                                    <p className="text-[10px] text-amber-900 font-bold mt-1.5 line-clamp-2 leading-relaxed">
                                        <span className="font-bold uppercase tracking-wider" style={{ color: '#5B7A4A' }}>Best: </span>
                                        {h.bestFor}
                                    </p>
                                )}
                                {h.avoid && h.avoid !== '-' && (
                                    <p className="text-[10px] text-amber-900 font-bold mt-1 line-clamp-1 leading-relaxed">
                                        <span className="font-bold uppercase tracking-wider" style={{ color: '#9B4A3A' }}>Avoid: </span>
                                        {h.avoid}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-serif font-bold text-amber-900">Planetary <KnowledgeTooltip term="hora">Hora</KnowledgeTooltip></h3>
                {current && <NowBadge />}
            </div>

            {current && pc && (
                <CurrentCallout borderColor={pc} bgColor={PLANET_BG[current.planet] || 'rgba(201,162,77,0.08)'}
                    progress={current.progress || calcProgress(current.start, current.end)}
                    remaining={calcRemaining(current.start, current.end)}>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-[24px]" style={{ color: pc }}>{PLANET_SYM[current.planet]}</span>
                            <span className="text-[18px] font-serif font-bold text-amber-900">{current.planet}</span>
                            <span className="text-[12px] text-amber-900/45">{current.sanskritName.split('/')[0]}</span>
                        </div>
                        <span className="text-[13px] font-mono font-semibold text-amber-900 ml-auto">
                            {shortTime(current.start)} &ndash; {shortTime(current.end)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {current.nature && current.nature !== '-' && (
                            <span className="text-[11px] font-semibold" style={{ color: pc }}>{current.nature}</span>
                        )}
                        {current.quality && current.quality !== '-' && (
                            <span className="text-[11px] text-amber-900/85">{current.quality}</span>
                        )}
                        {current.rank < 99 && (
                            <span className="text-[12px]" style={{ color: pc }}>{rankStars(current.rank)}</span>
                        )}
                    </div>
                    {current.bestFor && current.bestFor !== '-' && (
                        <p className="text-[11px] text-amber-900/40 mt-1.5 leading-relaxed">
                            <span className="font-bold uppercase text-[9px] tracking-wider mr-1" style={{ color: '#5B7A4A' }}>Best for:</span>
                            {current.bestFor}
                        </p>
                    )}
                    {current.avoid && current.avoid !== '-' && (
                        <p className="text-[11px] text-amber-900/40 mt-1 leading-relaxed">
                            <span className="font-bold uppercase text-[9px] tracking-wider mr-1" style={{ color: '#9B4A3A' }}>Avoid:</span>
                            {current.avoid}
                        </p>
                    )}
                </CurrentCallout>
            )}

            {day.length > 0 && (
                <>
                    <TimelineBar segments={toSeg(day)} phase="day"
                        startTime={day[0].start} endTime={day[day.length - 1].end} />
                    {renderHoraCards(day)}
                </>
            )}
            {night.length > 0 && (
                <>
                    <TimelineBar segments={toSeg(night)} phase="night"
                        startTime={night[0].start} endTime={night[night.length - 1].end} />
                    {renderHoraCards(night)}
                </>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   LAGNA JOURNEY — Rising sign transitions across the day
   ═══════════════════════════════════════════════════════════════════ */

function LagnaJourney({ schedule, current }: {
    schedule: LagnaPeriod[]; current?: LagnaPeriod;
}) {
    if (schedule.length === 0) return null;
    const total = schedule.reduce((s, l) => s + (l.durationMinutes || 0), 0);
    if (total === 0) return null;

    const curElem = current ? SIGN_ELEMENT[current.lagnaName] : null;
    const curColor = curElem ? ELEMENT_CLR[curElem] : '#C9A24D';
    const curBg = curElem ? ELEMENT_BG[curElem] : 'rgba(201,162,77,0.08)';

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-serif font-bold text-amber-900"><KnowledgeTooltip term="lagna">Lagna</KnowledgeTooltip> Journey</h3>
                {current && <NowBadge />}
            </div>

            {current && (
                <CurrentCallout borderColor={curColor} bgColor={curBg}
                    progress={current.progress || calcProgress(current.start, current.end)}
                    remaining={calcRemaining(current.start, current.end)}>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-[24px]" style={{ color: curColor }}>{ZODIAC_SYM[current.lagnaName] || '·'}</span>
                            <span className="text-[18px] font-serif font-bold text-amber-900">{current.lagnaName}</span>
                            {current.sanskritName && current.sanskritName !== '-' && (
                                <span className="text-[12px] text-amber-900 font-bold italic">{current.sanskritName}</span>
                            )}
                        </div>
                        <span className="text-[13px] font-mono font-bold text-amber-900 ml-auto">
                            {shortTime(current.start)} &ndash; {shortTime(current.end)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-amber-900">
                            {PLANET_SYM[current.lord] || ''} {current.lord}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: curColor, backgroundColor: `${curColor}18`, border: `1px solid ${curColor}30` }}>
                            {curElem}
                        </span>
                        {current.quality && current.quality !== '-' && (
                            <span className="text-[11px] font-bold text-amber-900">{current.quality}</span>
                        )}
                        <span className="text-[11px] font-bold text-amber-900 ml-auto">{current.durationMinutes}m</span>
                    </div>
                    {current.characteristics && current.characteristics !== '-' && (
                        <p className="text-[11px] text-amber-900 font-medium mt-1.5 leading-relaxed">{current.characteristics}</p>
                    )}
                    {current.bestFor && current.bestFor !== '-' && (
                        <p className="text-[11px] text-amber-900 font-bold mt-1 leading-relaxed">
                            <span className="font-bold uppercase text-[9px] tracking-wider mr-1" style={{ color: '#5B7A4A' }}>Best for:</span>
                            {current.bestFor}
                        </p>
                    )}
                    {current.avoidFor && current.avoidFor !== '-' && (
                        <p className="text-[11px] text-amber-900 font-bold mt-1 leading-relaxed">
                            <span className="font-bold uppercase text-[9px] tracking-wider mr-1" style={{ color: '#9B4A3A' }}>Avoid:</span>
                            {current.avoidFor}
                        </p>
                    )}
                </CurrentCallout>
            )}

            {/* Timeline overview bar */}
            {(() => {
                const tStart = schedule[0].start;
                const tEnd = schedule[schedule.length - 1].end;
                const tDur = durFromTimes(tStart, tEnd);
                const tHrs = Math.floor(tDur / 60);
                const tMins = tDur % 60;
                const now2 = new Date();
                const now2Min = now2.getHours() * 60 + now2.getMinutes();
                const tsMin = timeToMin(tStart);
                let teMin = timeToMin(tEnd);
                if (teMin <= tsMin) teMin += 24 * 60;
                let adj2 = now2Min;
                if (adj2 < tsMin && teMin > 24 * 60) adj2 += 24 * 60;
                const tSpan = teMin - tsMin;
                const lNowPct = tSpan > 0 ? ((adj2 - tsMin) / tSpan) * 100 : -1;
                const lShowNow = lNowPct >= 0 && lNowPct <= 100;

                return (
                    <div className="mt-5">
                        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg mb-3"
                            style={{
                                background: 'linear-gradient(90deg, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.06) 40%, transparent 80%)',
                                borderLeft: '3px solid rgba(201,162,77,0.45)',
                            }}>
                            <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9C7A2F]">24-Hour Transit</span>
                            <span className="text-[10px] text-amber-900 font-bold">· {schedule.length} signs</span>
                            <span className="text-[10px] font-mono font-bold text-amber-900 ml-auto">
                                {shortTime(tStart)} → {shortTime(tEnd)}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-900 ml-2">{tHrs}h {tMins}m</span>
                        </div>
                        <div className="relative">
                            <div className="flex h-[46px] rounded-xl overflow-hidden"
                                style={{ border: '1px solid rgba(186,164,126,0.30)' }}>
                                {schedule.map((l, i) => {
                                    const elem = SIGN_ELEMENT[l.lagnaName] || '';
                                    const eColor = ELEMENT_CLR[elem] || '#C9A24D';
                                    const eBg = ELEMENT_BG[elem] || 'rgba(201,162,77,0.18)';
                                    const pct = total > 0 ? ((l.durationMinutes || 0) / total) * 100 : 0;

                                    return (
                                        <div
                                            key={i}
                                            className="h-full flex items-center justify-center gap-0.5 overflow-hidden"
                                            style={{
                                                width: `${pct}%`,
                                                minWidth: '3px',
                                                backgroundColor: l.isCurrent ? eColor : eBg,
                                                borderRight: i < schedule.length - 1 ? '1px solid rgba(186,164,126,0.20)' : 'none',
                                                ...(l.isCurrent ? {
                                                    boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.35), 0 0 16px ${eColor}35`,
                                                    zIndex: 1, position: 'relative' as const,
                                                } : {}),
                                            }}
                                            title={`${l.lagnaName} (${shortTime(l.start)} – ${shortTime(l.end)}, ${l.durationMinutes}m)`}
                                        >
                                            {pct > 5 && (
                                                <span className="text-[14px] leading-none"
                                                    style={{ color: l.isCurrent ? '#FFFDF9' : eColor }}>
                                                    {ZODIAC_SYM[l.lagnaName] || '·'}
                                                </span>
                                            )}
                                            {pct > 9 && (
                                                <span className="text-[10px] font-bold"
                                                    style={{ color: l.isCurrent ? 'rgba(255,255,255,0.8)' : eColor }}>
                                                    {l.lagnaName.slice(0, 3)}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {lShowNow && (
                                <div className="absolute top-0 bottom-0 z-10 pointer-events-none"
                                    style={{ left: `${lNowPct}%` }}>
                                    <div className="w-[3px] h-full rounded-full"
                                        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, var(--gold-primary) 40%, rgba(255,255,255,0.95) 100%)' }} />
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-white absolute -top-1 -left-[4px]"
                                        style={{ backgroundColor: 'var(--gold-primary)', boxShadow: '0 0 8px rgba(201,162,77,0.5)' }} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Detail cards for each sign transition */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                {schedule.map((l, i) => {
                    const elem = SIGN_ELEMENT[l.lagnaName] || '';
                    const eColor = ELEMENT_CLR[elem] || '#C9A24D';
                    const eBg = ELEMENT_BG[elem] || 'rgba(201,162,77,0.12)';
                    return (
                        <div key={i} className="rounded-lg overflow-hidden relative transition-opacity"
                            style={{
                                backgroundColor: l.isCurrent ? `${eColor}30` : eBg,
                                borderLeft: `${l.isCurrent ? 4 : 3}px solid ${eColor}`,
                                ...(l.isCurrent ? { boxShadow: `0 0 0 2px ${eColor}, 0 0 18px ${eColor}30, 0 0 40px ${eColor}15` } : {}),
                                ...(getWindowStatus(l.start, l.end) === 'passed' && !l.isCurrent ? { opacity: 0.4 } : {}),
                            }}>
                            {l.isCurrent && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: eColor }} />
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: eColor }} />
                                </span>
                            )}
                            <div className="p-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[18px] leading-none" style={{ color: eColor }}>{ZODIAC_SYM[l.lagnaName] || '·'}</span>
                                    <span className="text-[13px] font-bold text-amber-900">{l.lagnaName}</span>
                                    {l.sanskritName && l.sanskritName !== '-' && (
                                        <span className="text-[9px] italic font-bold text-amber-900 ml-auto">{l.sanskritName}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-amber-900">
                                        {PLANET_SYM[l.lord] || ''} {l.lord}
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                        style={{ color: eColor, backgroundColor: `${eColor}18`, border: `1px solid ${eColor}30` }}>
                                        {elem}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-[11px] font-mono font-bold text-amber-900">
                                        {shortTime(l.start)} – {shortTime(l.end)}
                                    </span>
                                    <span className="text-[10px] font-bold text-amber-900">{l.durationMinutes}m</span>
                                </div>
                                {l.quality && l.quality !== '-' && (
                                    <div className="text-[10px] text-amber-900 font-bold mt-1">{l.quality}</div>
                                )}
                                {l.bestFor && l.bestFor !== '-' && (
                                    <p className="text-[10px] text-amber-900 font-bold mt-1.5 line-clamp-2 leading-relaxed">
                                        <span className="font-bold uppercase tracking-wider" style={{ color: '#5B7A4A' }}>Best: </span>
                                        {l.bestFor}
                                    </p>
                                )}
                                {l.characteristics && l.characteristics !== '-' && (
                                    <p className="text-[10px] text-amber-900 font-bold mt-1 line-clamp-1">{l.characteristics}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   RECENT CLIENTS CARD
   ═══════════════════════════════════════════════════════════════════ */

function RecentClientsCard() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recentData, isLoading } = useRecentClients(5) as { data: any; isLoading: boolean };
    const clients: Client[] = recentData?.clients || [];
    const { setClientDetails } = useVedicClient();
    const router = useRouter();

    const handleClientSelect = (c: Client) => {
        const details: VedicClientDetails = {
            id: c.id,
            name: c.fullName,
            gender: c.gender || "male",
            dateOfBirth: c.birthDate || "",
            timeOfBirth: c.birthTime || "",
            placeOfBirth: {
                city: c.birthPlace || "",
                latitude: c.birthLatitude,
                longitude: c.birthLongitude
            }
        };
        setClientDetails(details);
        router.push("/vedic-astrology/overview");
    };

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(186,164,126,0.25)', background: 'linear-gradient(180deg, rgba(201,162,77,0.04) 0%, transparent 100%)' }}>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700/85" />
                    <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase text-amber-900">Recent Clients</h3>
                </div>
                <Link href="/clients" className="text-[10px] font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="px-5 py-3"><div className="h-4 bg-amber-50/40 rounded animate-pulse w-28" /></div>
                    ))
                ) : clients.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <p className="text-[12px] text-amber-900 font-bold">No clients yet</p>
                        <Link href="/clients/new" className="inline-flex items-center gap-1 mt-2 text-[12px] font-bold text-amber-600">
                            <UserPlus className="w-3.5 h-3.5" /> Add first client
                        </Link>
                    </div>
                ) : clients.map(c => (
                    <button
                        key={c.id}
                        onClick={() => handleClientSelect(c)}
                        className="w-full flex items-center gap-3 px-5 h-12 hover:bg-[var(--bg-hover)] transition-colors group text-left"
                        style={ROW_BORDER}
                    >
                        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-600/10 flex items-center justify-center text-[10px] font-bold text-amber-700 shrink-0 group-hover:border-amber-600/40">
                            {getInitials(c.fullName)}
                        </div>
                        <span className="text-[14px] font-medium text-amber-900 truncate flex-1">{c.fullName}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-900/80 group-hover:text-amber-600 shrink-0" />
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   QUICK ACTIONS CARD
   ═══════════════════════════════════════════════════════════════════ */

function QuickActionsCard() {
    const actions = [
        { href: '/clients/new', icon: UserPlus, title: 'New Client' },
        { href: '/vedic-astrology', icon: Star, title: 'Vedic Charts' },
        { href: '/muhurta', icon: Sparkles, title: 'Muhurta' },
        { href: '/matchmaking', icon: Users, title: 'Matchmaking' },
        { href: '/calendar', icon: CalendarDays, title: 'Calendar' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4"
                style={{ borderBottom: '1px solid rgba(186,164,126,0.25)', background: 'linear-gradient(180deg, rgba(201,162,77,0.04) 0%, transparent 100%)' }}>
                <Sparkles className="w-4 h-4 text-amber-700/85" />
                <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase text-amber-900">Quick Actions</h3>
            </div>
            {actions.map(({ href, icon: Icon, title }) => (
                <Link key={href} href={href}
                    className="flex items-center gap-3 px-5 h-12 hover:bg-[var(--bg-hover)] transition-colors group"
                    style={ROW_BORDER}>
                    <div className="w-7 h-7 rounded-lg bg-amber-50/60 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:border-amber-600/40">
                        <Icon className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <span className="text-[14px] font-medium text-amber-900">{title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-900/80 ml-auto group-hover:text-amber-600" />
                </Link>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   SKELETONS
   ═══════════════════════════════════════════════════════════════════ */


function TimelineSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6">
            <div className="h-4 w-32 bg-amber-50/40 rounded animate-pulse mb-4" />
            <div className="h-[46px] bg-amber-50/30 rounded-xl animate-pulse" />
            <div className="grid grid-cols-4 gap-3 mt-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-amber-50/20 rounded-lg animate-pulse" />
                ))}
            </div>
            <div className="h-[46px] bg-amber-50/25 rounded-xl animate-pulse mt-4" />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
    const { user } = useAuth();
    const { data: stats } = useDashboardStats();
    const { data: panchang, isLoading: pLoading, isError: pError } = usePanchang();
    const { data: muhurta, isLoading: mLoading } = useMuhurta();
    const { data: chogData, isLoading: chogLoading } = useChoghadiya();
    const { data: horaData, isLoading: horaLoading } = useHora();
    const { data: lagnaData, isLoading: lagnaLoading } = useLagnaTimes();
    const firstName = user?.name?.split(' ')[0] || 'Astrologer';

    return (
        <div className="space-y-6 pb-12">
            {/* ── Greeting ── */}
            <div>
                <h1 className="text-[30px] font-serif text-amber-900 font-bold leading-tight tracking-tight">
                    {getGreeting()}, {firstName}
                </h1>
                <p className="text-[14px] text-amber-900 font-serif font-bold italic mt-1.5">
                    {todayDate()}
                    {panchang?.vara?.name && panchang.vara.name !== '-' && (
                        <span className="not-italic font-bold ml-2" style={{ color: PANCH_ACCENT.Vara }}>
                            {panchang.vara.name}
                        </span>
                    )}
                </p>
            </div>

            {/* ── Clients + Actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentClientsCard />
                <QuickActionsCard />
            </div>

            {/* ── NOW Status Strip ── */}
            <NowStrip chog={chogData?.current} hora={horaData?.current} lagna={lagnaData?.current} muhurta={muhurta} />

            {/* ── Muhurta Windows (dramatic section) ── */}
            {mLoading ? <TimelineSkeleton /> : muhurta && (
                <MuhurtaSection muhurta={muhurta} panchang={panchang} />
            )}

            {/* ── Choghadiya Timeline ── */}
            {chogLoading ? <TimelineSkeleton /> : chogData && chogData.day.length > 0 && (
                <ChoghadiyaTimeline periods={chogData.day} current={chogData.current} />
            )}

            {/* ── Hora Timeline ── */}
            {horaLoading ? <TimelineSkeleton /> : horaData && horaData.periods.length > 0 && (
                <HoraTimeline periods={horaData.periods} current={horaData.current} />
            )}

            {/* ── Lagna Journey ── */}
            {lagnaLoading ? <TimelineSkeleton /> : lagnaData && lagnaData.schedule.length > 0 && (
                <LagnaJourney schedule={lagnaData.schedule} current={lagnaData.current} />
            )}

        </div>
    );
}
