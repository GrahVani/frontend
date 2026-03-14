"use client";

import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface ShodashaVargaTableProps {
    data: Record<string, unknown>;
    className?: string;
}

const VARGA_ORDER = [
    { key: 'D1', name: 'Janma', termKey: 'varga_d1_rasi' },
    { key: 'D2', name: 'Hora', termKey: 'varga_d2_hora' },
    { key: 'D3', name: 'Dreshkana', termKey: 'varga_d3_dreshkana' },
    { key: 'D4', name: 'Chaturthamsha', termKey: 'varga_d4_chaturthamsha' },
    { key: 'D7', name: 'Saptamsha', termKey: 'varga_d7_saptamsha' },
    { key: 'D9', name: 'Navamsha', termKey: 'varga_d9_navamsha' },
    { key: 'D10', name: 'Dashamsha', termKey: 'varga_d10_dashamsha' },
    { key: 'D12', name: 'Dwadashamsha', termKey: 'varga_d12_dwadashamsha' },
    { key: 'D16', name: 'Shodashamsha', termKey: 'varga_d16_shodashamsha' },
    { key: 'D20', name: 'Vimshamsha', termKey: 'varga_d20_vimshamsha' },
    { key: 'D24', name: 'Chaturvimshamsha', termKey: 'varga_d24_chaturvimshamsha' },
    { key: 'D27', name: 'Saptavimshamsha', termKey: 'varga_d27_saptavimshamsha' },
    { key: 'D30', name: 'Trimshamsha', termKey: 'varga_d30_trimshamsha' },
    { key: 'D40', name: 'Khavedamsha', termKey: 'varga_d40_khavedamsha' },
    { key: 'D45', name: 'Akshavedamsha', termKey: 'varga_d45_akshavedamsha' },
    { key: 'D60', name: 'Shashtiamsha', termKey: 'varga_d60_shashtiamsha' }
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
    neutral: 'text-ink'
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
        <div className={cn("w-full bg-surface-warm rounded-xl border border-gold-primary/15 p-2", className)}>
            {/* Header with Legend */}
            <div className="flex items-center justify-between mb-0.5">
                <h2 className={TYPOGRAPHY.sectionTitle}><KnowledgeTooltip term="varga_chart">Shodashavarga</KnowledgeTooltip> summary</h2>
                <div className="flex gap-3 text-[12px] font-medium font-sans">
                    <span className="text-ink flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span><KnowledgeTooltip term="dignity_exalted">Exalted</KnowledgeTooltip></span>
                    <span className="text-ink flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span><KnowledgeTooltip term="dignity_own">Own</KnowledgeTooltip></span>
                    <span className="text-ink flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><KnowledgeTooltip term="dignity_debilitated">Debilitated</KnowledgeTooltip></span>
                </div>
            </div>
            <div className="rounded-xl border border-gold-primary/15 w-full overflow-x-auto">
                <table className="w-full border-collapse text-[12px]" role="table" aria-label="Shodasha Varga summary showing planetary signs across 16 divisional charts">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-amber-50/30 border-b border-gold-primary/15">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1 px-2 text-left border-r border-gold-primary/15 w-28")}>Varga</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1 px-1 text-center border-r border-gold-primary/15")}>Asc</th>
                            {PLANETS.map(p => (
                                <th key={p} className={cn(TYPOGRAPHY.tableHeader, "py-1 px-1 text-center border-r border-gold-primary/15")}>
                                    {p.substring(0, 3)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {VARGA_ORDER.map((v, i) => (
                            <tr key={v.key} className={cn("border-b border-gold-primary/15", i % 2 === 1 && "bg-surface-warm/30")}>
                                <td className={cn(TYPOGRAPHY.dateAndDuration, "py-0.5 px-2 border-r border-gold-primary/15")}>
                                    <span className="font-bold mr-1.5">{v.key}</span>
                                    <span><KnowledgeTooltip term={v.termKey}>{v.name}</KnowledgeTooltip></span>
                                </td>
                                <td className={cn(TYPOGRAPHY.dateAndDuration, "py-0.5 text-center border-r border-gold-primary/15")}>
                                    {SIGN_ABBR[getSign('Ascendant', v.key).charAt(0).toUpperCase() + getSign('Ascendant', v.key).slice(1).toLowerCase()] || getSign('Ascendant', v.key).substring(0, 2)}
                                </td>
                                {PLANETS.map(p => {
                                    const sign = getSign(p, v.key);
                                    const abbr = SIGN_ABBR[sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()] || sign.substring(0, 2);
                                    const dignity = getDignity(p, sign);
                                    return (
                                        <td key={p} className={cn(TYPOGRAPHY.dateAndDuration, "py-0.5 text-center border-r border-gold-primary/15")}>
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

        </div>
    );
}

