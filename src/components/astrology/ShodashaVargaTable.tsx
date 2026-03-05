"use client";

import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface ShodashaVargaTableProps {
    data: Record<string, unknown>;
    className?: string;
}

const VARGA_ORDER = [
    { key: 'D1', name: 'Janma' },
    { key: 'D2', name: 'Hora' },
    { key: 'D3', name: 'Dreshkana' },
    { key: 'D4', name: 'Chaturthamsha' },
    { key: 'D7', name: 'Saptamsha' },
    { key: 'D9', name: 'Navamsha' },
    { key: 'D10', name: 'Dashamsha' },
    { key: 'D12', name: 'Dwadashamsha' },
    { key: 'D16', name: 'Shodashamsha' },
    { key: 'D20', name: 'Vimshamsha' },
    { key: 'D24', name: 'Chaturvimshamsha' },
    { key: 'D27', name: 'Saptavimshamsha' },
    { key: 'D30', name: 'Trimshamsha' },
    { key: 'D40', name: 'Khavedamsha' },
    { key: 'D45', name: 'Akshavedamsha' },
    { key: 'D60', name: 'Shashtiamsha' }
];

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const DIGNITIES: Record<string, { own: string[], exalted: string, debilitated: string }> = {
    'Sun': { own: ['Leo'], exalted: 'Aries', debilitated: 'Libra' },
    'Moon': { own: ['Cancer'], exalted: 'Taurus', debilitated: 'Scorpio' },
    'Mars': { own: ['Aries', 'Scorpio'], exalted: 'Capricorn', debilitated: 'Cancer' },
    'Mercury': { own: ['Gemini', 'Virgo'], exalted: 'Virgo', debilitated: 'Pisces' },
    'Jupiter': { own: ['Sagittarius', 'Pisces'], exalted: 'Cancer', debilitated: 'Capricorn' },
    'Venus': { own: ['Taurus', 'Libra'], exalted: 'Pisces', debilitated: 'Virgo' },
    'Saturn': { own: ['Capricorn', 'Aquarius'], exalted: 'Libra', debilitated: 'Aries' },
    'Rahu': { own: ['Aquarius'], exalted: 'Taurus', debilitated: 'Scorpio' },
    'Ketu': { own: ['Scorpio'], exalted: 'Scorpio', debilitated: 'Taurus' }
};

const SIGN_ABBR: Record<string, string> = {
    'Aries': 'Ar', 'Taurus': 'Ta', 'Gemini': 'Ge', 'Cancer': 'Ca',
    'Leo': 'Le', 'Virgo': 'Vi', 'Libra': 'Li', 'Scorpio': 'Sc',
    'Sagittarius': 'Sa', 'Capricorn': 'Cp', 'Aquarius': 'Aq', 'Pisces': 'Pi'
};

const getDignity = (planet: string, sign: string): 'exalted' | 'own' | 'debilitated' | 'neutral' => {
    if (!planet || !sign || planet === 'Ascendant') return 'neutral';
    const d = DIGNITIES[planet];
    if (!d) return 'neutral';
    const s = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
    if (d.exalted === s) return 'exalted';
    if (d.own.includes(s)) return 'own';
    if (d.debilitated === s) return 'debilitated';
    return 'neutral';
};

const DIGNITY_STYLE: Record<string, string> = {
    exalted: 'text-emerald-700 font-bold',
    own: 'text-green-600 font-semibold',
    debilitated: 'text-red-500',
    neutral: 'text-primary'
};

export default function ShodashaVargaTable({ data, className }: ShodashaVargaTableProps) {
    if (!data) return null;

    const summary = (data.shodasha_varga_summary || data.shodasha_varga_signs || data) as Record<string, Record<string, unknown>>;

    const getSign = (planet: string, varga: string): string => {
        const pd = summary[planet];
        if (!pd) return '-';
        const v = pd[varga] as Record<string, unknown> | string | undefined;
        if (!v) return '-';
        return typeof v === 'object' && v.sign ? String(v.sign) : String(v);
    };

    // ðŸŒŸ Calculate Dignity Scores for each planet
    const dignityScores = PLANETS.map(p => {
        let exalted = 0, own = 0, debilitated = 0, total = 0;
        VARGA_ORDER.forEach(v => {
            const sign = getSign(p, v.key);
            if (sign !== '-') {
                total++;
                const d = getDignity(p, sign);
                if (d === 'exalted') exalted++;
                else if (d === 'own') own++;
                else if (d === 'debilitated') debilitated++;
            }
        });
        const score = (exalted * 2) + own - debilitated; // Weighted score
        return { planet: p, exalted, own, debilitated, total, score };
    });

    const strongestPlanet = dignityScores.reduce((a, b) => a.score > b.score ? a : b);
    const weakestPlanet = dignityScores.reduce((a, b) => a.score < b.score ? a : b);

    return (
        <div className={cn("w-full bg-softwhite rounded-xl border border-border-warm shadow-card p-4", className)}>
            {/* Header with Legend */}
            <div className="flex items-center justify-between mb-4">
                <h2 className={TYPOGRAPHY.sectionTitle}>Shodashavarga summary</h2>
                <div className="flex gap-3 text-xs font-medium font-sans">
                    <span className="text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>Exalted</span>
                    <span className="text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>Own</span>
                    <span className="text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Debilitated</span>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border-warm max-w-7xl mx-auto">
                <table className="w-full border-collapse text-xs" role="table" aria-label="Shodasha Varga summary showing planetary signs across 16 divisional charts">
                    <thead>
                        <tr className="bg-amber-50/30 border-b border-border-warm">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-3 text-left border-r border-border-warm w-28")}>Varga</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-1 text-center border-r border-border-warm")}>Asc</th>
                            {PLANETS.map(p => (
                                <th key={p} className={cn(TYPOGRAPHY.tableHeader, "py-2 px-1 text-center border-r border-border-warm")}>
                                    {p.substring(0, 3)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {VARGA_ORDER.map((v, i) => (
                            <tr key={v.key} className={cn("border-b border-border-warm", i % 2 === 1 && "bg-parchment/30")}>
                                <td className={cn(TYPOGRAPHY.dateAndDuration, "py-1.5 px-3 border-r border-border-warm")}>
                                    <span className="font-bold mr-1.5">{v.key}</span>
                                    <span>{v.name}</span>
                                </td>
                                <td className={cn(TYPOGRAPHY.dateAndDuration, "py-1.5 text-center border-r border-border-warm")}>
                                    {SIGN_ABBR[getSign('Ascendant', v.key).charAt(0).toUpperCase() + getSign('Ascendant', v.key).slice(1).toLowerCase()] || getSign('Ascendant', v.key).substring(0, 2)}
                                </td>
                                {PLANETS.map(p => {
                                    const sign = getSign(p, v.key);
                                    const abbr = SIGN_ABBR[sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()] || sign.substring(0, 2);
                                    const dignity = getDignity(p, sign);
                                    return (
                                        <td key={p} className={cn(TYPOGRAPHY.dateAndDuration, "py-1.5 text-center border-r border-border-warm")}>
                                            <span className={cn("font-medium", DIGNITY_STYLE[dignity])}>
                                                {sign === '-' ? '-' : abbr}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ðŸŒŸ NEW: Dignity Score Cards */}
            <div className="mt-6">
                <div className={cn(TYPOGRAPHY.label, "mb-2")}>Planetary dignity score (across 16 Vargas)</div>
                <div className="grid grid-cols-9 gap-2" role="group" aria-label="Planetary dignity scores across 16 Vargas">
                    {dignityScores.map(ps => (
                        <div key={ps.planet} className={cn(
                            "rounded-lg p-2 text-center border",
                            ps.score > 3 ? "bg-green-50 border-green-200" :
                                ps.score < 0 ? "bg-red-50 border-red-200" :
                                    "bg-softwhite border-border-warm"
                        )}>
                            <div className={cn(TYPOGRAPHY.label, "mb-0")}>{ps.planet.substring(0, 3)}</div>
                            <div className={cn(TYPOGRAPHY.value, "text-lg")}>{ps.score}</div>
                            <div className={cn(TYPOGRAPHY.subValue, "flex justify-center gap-1 text-[9px] mt-0.5")}>
                                {ps.exalted > 0 && <span className="text-emerald-600">{ps.exalted}E</span>}
                                {ps.own > 0 && <span className="text-green-600">{ps.own}O</span>}
                                {ps.debilitated > 0 && <span className="text-red-500">{ps.debilitated}D</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="flex justify-between mt-3 text-xs font-medium font-sans">
                <span className="text-emerald-700">â­ Strongest: {strongestPlanet.planet} (Score: {strongestPlanet.score})</span>
                <span className="text-red-600">âš  Weakest: {weakestPlanet.planet} (Score: {weakestPlanet.score})</span>
            </div>
        </div>
    );
}

