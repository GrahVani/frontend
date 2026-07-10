"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  Users,
  Scale,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  ArrowRight,
} from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const AMBER = "#B8860B";
const SLATE = "#5A6B7D";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function toDMS(decimalDeg: number): string {
  const d = Math.floor(Math.abs(decimalDeg));
  const mFull = (Math.abs(decimalDeg) - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${m.toString().padStart(2, "0")}′${s.toString().padStart(2, "0")}″`;
}

function computeLahiri(year: number): number {
  const yearsFromAlignment = year - 285;
  const arcSeconds = yearsFromAlignment * 50.2388;
  return arcSeconds / 3600;
}

type ConventionKey =
  | "lahiri"
  | "krishnamurti"
  | "raman"
  | "yukteshwar"
  | "pushya"
  | "surya"
  | "tropical";

interface ConventionData {
  key: ConventionKey;
  name: string;
  devanagari: string;
  founder: string;
  years: string;
  currentEraApprox: string;
  diffFromLahiri: string;
  offsetDeg: number;
  color: string;
  alignmentEpoch: string;
  referenceStar: string;
  community: string;
  description: string;
  detail: string;
}

const CONVENTIONS: Record<ConventionKey, ConventionData> = {
  lahiri: {
    key: "lahiri",
    name: "Lahiri",
    devanagari: "लाहिरी",
    founder: "N.C. Lahiri",
    years: "1906–1980",
    currentEraApprox: "~24°19′ (2026)",
    diffFromLahiri: "0° (baseline)",
    offsetDeg: 0,
    color: GOLD,
    alignmentEpoch: "~285 CE",
    referenceStar: "Spica (Citrā) at 180° Libra",
    community: "Indian government standard; most Parāśari, Lal Kitab, Jaiminī revival practitioners",
    description: "Indian government standard since 1955; based on Spica-at-180° Libra alignment epoch ~285 CE.",
    detail:
      "Nirmala Chandra Lahiri (1906–1980) was a Bengal-based astronomer-astrologer who served on the Indian Calendar Reform Committee (1952–1955). The committee adopted his ayanāṁśa as the official Indian standard. It is anchored to Spica (Alpha Virginis) at sidereal 180° Libra, with a mean precession rate of ~50.2388 arc-seconds per year. Today it is the most widely used convention across India and the global Vedic-astrology community.",
  },
  krishnamurti: {
    key: "krishnamurti",
    name: "Krishnamurti",
    devanagari: "कृष्णमूर्ति",
    founder: "K.S. Krishnamurti",
    years: "1908–1972",
    currentEraApprox: "~24°13′ (2026)",
    diffFromLahiri: "~6′ less",
    offsetDeg: -0.1,
    color: INDIGO,
    alignmentEpoch: "Same as Lahiri (offset −6′)",
    referenceStar: "Same as Lahiri (Spica anchor)",
    community: "KP-stream practitioners; stellar astrology community",
    description:
      "KP-stream convention specified in KP Reader I–VI; ~6 arc-minutes less than Lahiri. Foundation of KP horary 1-249 sub-lord system.",
    detail:
      "K.S. Krishnamurti (1908–1972) founded the KP system of stellar astrology. He specified an ayanāṁśa approximately 6 arc-minutes less than Lahiri. This small difference is operationally critical for KP's Cusp Sub-Lord (CSL) methodology and the 1-249 horary number system, where sub-lord boundaries are defined against Krishnamurti-specific positions. Per the modern-primary doctrine, the KP methodology and Krishnamurti ayanāṁśa are operationally inseparable.",
  },
  raman: {
    key: "raman",
    name: "Raman",
    devanagari: "रमण",
    founder: "B.V. Raman",
    years: "1912–1998",
    currentEraApprox: "~22°55′ (2026)",
    diffFromLahiri: "~1°24′ less",
    offsetDeg: -1.4,
    color: VERMILION,
    alignmentEpoch: "~397 CE (per Raman specification)",
    referenceStar: "Derived from Raman's own computational framework",
    community: "Raman-lineage practitioners; Astrological Magazine tradition",
    description:
      "B.V. Raman's convention; current-era ~22°55′ (≈1°24′ less than Lahiri). Used by Raman-lineage practitioners and some traditional Indian-context astrologers.",
    detail:
      "Bangalore Venkata Raman (1912–1998) edited the Astrological Magazine for over 60 years and authored foundational textbooks including Hindu Predictive Astrology and Three Hundred Important Combinations. He specified his own ayanāṁśa convention, which yields values approximately 1°24′ less than Lahiri in the current era. The Raman lineage applies this convention consistently across Vimśottarī and other predictive methodologies.",
  },
  yukteshwar: {
    key: "yukteshwar",
    name: "Yukteshwar",
    devanagari: "युक्तेश्वर",
    founder: "Sri Yukteshwar Giri",
    years: "1855–1936",
    currentEraApprox: "~22°42′ (2026)",
    diffFromLahiri: "~1°37′ less",
    offsetDeg: -1.6167,
    color: JADE,
    alignmentEpoch: "Per The Holy Science (1894) framework",
    referenceStar: "Yukteshwar's astronomical-spiritual framework specification",
    community: "Self-Realization Fellowship (SRF) lineage; Yogananda disciples",
    description:
      "Sri Yukteshwar's convention per The Holy Science (1894); current-era ~22°42′ (≈1°37′ less than Lahiri). Used by SRF lineage and some Western-Vedic-fusion contexts.",
    detail:
      "Sri Yukteshwar Giri (1855–1936) was a yoga master and the guru of Paramahansa Yogananda. In his 1894 work The Holy Science, he presented an astronomical-spiritual framework that included a specific ayanāṁśa convention. This yields values approximately 1°37′ less than Lahiri in the current era. The Self-Realization Fellowship (SRF) lineage and related Western-Vedic-fusion practitioners use this convention.",
  },
  pushya: {
    key: "pushya",
    name: "Pushya-pakṣa",
    devanagari: "पुष्य-पक्ष",
    founder: "Traditional (no single founder)",
    years: "Ancient–present",
    currentEraApprox: "~26°15′ (2026)",
    diffFromLahiri: "~1°56′ more",
    offsetDeg: 1.9333,
    color: AMBER,
    alignmentEpoch: "Earlier than 285 CE (Pushya-nakṣatra anchored)",
    referenceStar: "Pushya nakṣatra (δ Cancri / Asellus Australis)",
    community: "Some traditional Indian regional practitioners; scholarly contexts",
    description:
      "Traditional alignment-epoch convention based on Pushya nakṣatra; current-era ~26°15′ (≈1°56′ more than Lahiri). Used by some traditional regional practitioners.",
    detail:
      "The Pushya-pakṣa ayanāṁśa is a traditional convention anchored to the Pushya nakṣatra (the 8th of 27 nakṣatras, associated with δ Cancri / Asellus Australis). Rather than having a single modern founder, it is sustained through traditional regional practitioner usage. Its alignment epoch is earlier than the Lahiri ~285 CE epoch, producing current-era values approximately 1°56′ greater than Lahiri. Some scholarly contexts engage with this convention when studying traditional nakṣatra-anchored alignment reasoning.",
  },
  surya: {
    key: "surya",
    name: "Sūrya Siddhānta-derived",
    devanagari: "सूर्यसिद्धान्त-जन्य",
    founder: "Classical tradition (multiple interpreters)",
    years: "Classical–present",
    currentEraApprox: "~24°05′ (2026, varies)",
    diffFromLahiri: "~14′ less (varies)",
    offsetDeg: -0.2333,
    color: SLATE,
    alignmentEpoch: "Varies per specific Sūrya Siddhānta interpretation",
    referenceStar: "Varies per specific derivation",
    community: "Scholarly classical-tradition researchers; some traditional practitioners",
    description:
      "Multiple historical conventions derived directly from Sūrya Siddhānta calculations; varies per interpretation. Used by scholars and some traditional practitioners engaging classical computation.",
    detail:
      "The Sūrya Siddhānta-derived ayanāṁśa conventions are computed directly from the classical Indian astronomical text Sūrya Siddhānta, using its trepidation model and precession parameters. Because different scholars and traditional interpreters apply slightly different computational methods and alignment assumptions, there is no single Sūrya Siddhānta-derived value — it varies per specific interpretation. In the current era, values typically cluster near but slightly less than Lahiri (around 14 arc-minutes less for common derivations). These conventions are used by researchers engaging classical Indian astronomical computation directly and by some traditional practitioners.",
  },
  tropical: {
    key: "tropical",
    name: "Tropical (Zero Ayanāṁśa)",
    devanagari: "ट्रॉपिकल (शून्य अयनांश)",
    founder: "Western astronomical tradition",
    years: "Ancient–present",
    currentEraApprox: "0°00′00″ (by definition)",
    diffFromLahiri: "−Lahiri (no offset)",
    offsetDeg: 0,
    color: "#888888",
    alignmentEpoch: "N/A (no sidereal offset)",
    referenceStar: "Vernal equinox = 0° Aries (tropical)",
    community: "Some Western-Vedic-fusion experimentalists; cross-tradition explorers",
    description:
      "Western-tropical-Vedic experimental practice; treats sidereal positions = tropical positions (no offset). Minority within Vedic-astrology landscape.",
    detail:
      "The Tropical (zero ayanāṁśa) approach is an experimental practice used by some Western-Vedic-fusion practitioners. It applies Vedic-astrology interpretive methods to tropical (Western-astrology) positions without any sidereal offset. This means the vernal equinox is treated as 0° Aries, and all rāśi, nakṣatra, and varga positions are computed from tropical coordinates directly. It is a minority approach within the Vedic-astrology landscape and is typically used with transparent flagging as an experimental cross-tradition exploration.",
  },
};

const COMMUNITY_MAP = [
  {
    context: "General Parāśari work",
    ayanamsha: "Lahiri",
    community: "Most Indian + global Vedic astrologers",
    color: GOLD,
  },
  {
    context: "KP work (sub-lord, CSL, horary 1-249)",
    ayanamsha: "Krishnamurti",
    community: "KP-stream practitioners",
    color: INDIGO,
  },
  {
    context: "Lal Kitab work",
    ayanamsha: "Lahiri (typically)",
    community: "Lal Kitab regional practitioners",
    color: GOLD,
  },
  {
    context: "Jaiminī revival (SJC, BVB)",
    ayanamsha: "Lahiri (typically)",
    community: "SJC + BVB Delhi lineages",
    color: GOLD,
  },
  {
    context: "Raman lineage work",
    ayanamsha: "Raman",
    community: "Raman-lineage practitioners",
    color: VERMILION,
  },
  {
    context: "Yukteshwar / SRF lineage work",
    ayanamsha: "Yukteshwar",
    community: "Self-Realization Fellowship",
    color: JADE,
  },
  {
    context: "Traditional Pushya-tradition work",
    ayanamsha: "Pushya-pakṣa",
    community: "Some traditional regional practitioners",
    color: AMBER,
  },
  {
    context: "Scholarly classical-tradition engagement",
    ayanamsha: "Sūrya Siddhānta-derived",
    community: "Researchers + classical scholars",
    color: SLATE,
  },
  {
    context: "Western-Vedic-fusion experimentalist",
    ayanamsha: "Varies (mostly Lahiri; sometimes Tropical)",
    community: "Cross-tradition explorers",
    color: "#888888",
  },
];

const RULES = [
  "Use the ayanāṁśa specified by the methodology you are applying — not by personal preference.",
  "Within a single chart analysis, use exactly one ayanāṁśa consistently.",
  "When doing cross-stream synthesis, compute separate chart versions and flag transparently.",
  "For high-precision work (nakṣatra boundaries, varga, daśā), use engine-precision computation.",
];

const FAILURE_MODES = [
  {
    label: "Single-convention supremacism",
    description: "Treating one ayanāṁśa as universally 'correct' and dismissing all others as wrong.",
  },
  {
    label: "Cross-convention relativism",
    description: "Treating all ayanāṁśas as interchangeable 'opinions' with no operational consequences.",
  },
  {
    label: "Operational mixing",
    description: "Applying one methodology's analysis using a different methodology's ayanāṁśa without flagging.",
  },
];

/* ─── Timeline data for SVG ─── */
const TIMELINE_CONVENTIONS = [
  { key: "pushya" as ConventionKey, epoch: 100, label: "Pushya-pakṣa\n(earlier epoch)", y: 30 },
  { key: "lahiri" as ConventionKey, epoch: 285, label: "Lahiri\n(~285 CE)", y: 70 },
  { key: "krishnamurti" as ConventionKey, epoch: 285, label: "Krishnamurti\n(same epoch)", y: 110 },
  { key: "raman" as ConventionKey, epoch: 397, label: "Raman\n(~397 CE)", y: 70 },
  { key: "yukteshwar" as ConventionKey, epoch: 1894, label: "Yukteshwar\n(1894, spec)", y: 110 },
];

function TimelineSVG() {
  const W = 700;
  const H = 160;
  const PAD = 40;
  const axisY = 140;
  const xForYear = (y: number) => PAD + ((y / 2000) * (W - 2 * PAD));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Axis */}
      <line x1={PAD} y1={axisY} x2={W - PAD} y2={axisY} stroke={INK_MUTED} strokeWidth={1} />
      {[0, 500, 1000, 1500, 2000].map((y) => (
        <g key={y}>
          <line
            x1={xForYear(y)}
            y1={axisY - 4}
            x2={xForYear(y)}
            y2={axisY + 4}
            stroke={INK_MUTED}
            strokeWidth={1}
          />
          <text
            x={xForYear(y)}
            y={axisY + 16}
            textAnchor="middle"
            fill={INK_SECONDARY}
            fontSize={11}
          >
            {y === 0 ? "0 CE" : `${y} CE`}
          </text>
        </g>
      ))}

      {/* Markers */}
      {TIMELINE_CONVENTIONS.map((c) => {
        const cx = xForYear(c.epoch);
        const conv = CONVENTIONS[c.key];
        return (
          <g key={c.key}>
            <line
              x1={cx}
              y1={axisY}
              x2={cx}
              y2={c.y}
              stroke={conv.color}
              strokeWidth={1.5}
              strokeDasharray="3 2"
            />
            <circle cx={cx} cy={c.y} r={5} fill={conv.color} stroke="#fff" strokeWidth={1.5} />
            <text
              x={cx}
              y={c.y - 10}
              textAnchor="middle"
              fill={conv.color}
              fontSize={10}
              fontWeight={600}
            >
              {conv.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ComparativeAyanamshaExplorer() {
  const [tab, setTab] = useState<
    "compare" | "conventions" | "timeline" | "communities" | "discipline"
  >("compare");
  const [year, setYear] = useState(2026);
  const [expanded, setExpanded] = useState<ConventionKey | null>(null);

  const lahiriDeg = useMemo(() => computeLahiri(year), [year]);

  const comparisonRows = useMemo(() => {
    const rows = Object.values(CONVENTIONS).map((c) => {
      let deg: number;
      if (c.key === "tropical") {
        deg = 0;
      } else {
        deg = lahiriDeg + c.offsetDeg;
      }
      const diff = c.key === "lahiri" ? 0 : c.key === "tropical" ? -lahiriDeg : c.offsetDeg;
      return {
        ...c,
        deg,
        diff,
        diffText:
          c.key === "lahiri"
            ? "baseline"
            : c.key === "tropical"
            ? `−${toDMS(lahiriDeg)}`
            : `${diff >= 0 ? "+" : ""}${toDMS(Math.abs(diff))}`,
      };
    });
    return rows;
  }, [lahiriDeg]);

  const tabs = [
    { key: "compare" as const, label: "Compare", icon: BarChart3 },
    { key: "conventions" as const, label: "Conventions", icon: Info },
    { key: "timeline" as const, label: "Timeline", icon: Star },
    { key: "communities" as const, label: "Communities", icon: Users },
    { key: "discipline" as const, label: "Discipline", icon: ShieldAlert },
  ];

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => {
          const active = tab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                active ? "text-white" : ""
              }`}
              style={{
                backgroundColor: active ? INDIGO : "var(--gl-surface-2)",
                color: active ? "#fff" : INK_SECONDARY,
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ─── Compare tab ─── */}
      {tab === "compare" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <label className="block text-sm font-medium mb-2" style={{ color: INK_SECONDARY }}>
              Select year for comparison
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={285}
                max={2100}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="flex-1 accent-[#4A6FA5]"
              />
              <span className="text-lg font-bold tabular-nums" style={{ color: INDIGO, minWidth: 56 }}>
                {year}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${INK_MUTED}` }}>
                  <th className="text-left py-2 px-3 font-semibold">Convention</th>
                  <th className="text-left py-2 px-3 font-semibold">Ayanāṁśa (DMS)</th>
                  <th className="text-left py-2 px-3 font-semibold">Decimal</th>
                  <th className="text-left py-2 px-3 font-semibold">Diff vs Lahiri</th>
                  <th className="text-left py-2 px-3 font-semibold">Founder / Origin</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.key}
                    className="transition-colors hover:opacity-90"
                    style={{
                      borderBottom: `1px solid ${INK_MUTED}30`,
                    }}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: row.color }}
                        />
                        <span className="font-semibold">{row.name}</span>
                        <span className="text-xs" style={{ color: INK_MUTED }}>
                          {row.devanagari}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">{toDMS(row.deg)}</td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">{row.deg.toFixed(4)}°</td>
                    <td
                      className="py-2.5 px-3 font-mono tabular-nums"
                      style={{ color: row.key === "lahiri" ? INK_MUTED : row.diff > 0 ? VERMILION : JADE }}
                    >
                      {row.diffText}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: INK_SECONDARY }}>
                      {row.founder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs px-1" style={{ color: INK_MUTED }}>
            <Info size={12} className="inline mr-1" />
            Values are approximate (current-era offsets from Lahiri baseline). For precise computation, use Astro Engine endpoints. Tropical = 0° by definition; diff shows Lahiri value negated.
          </p>
        </div>
      )}

      {/* ─── Conventions tab ─── */}
      {tab === "conventions" && (
        <div className="space-y-3">
          {Object.values(CONVENTIONS).map((c) => {
            const isOpen = expanded === c.key;
            return (
              <div
                key={c.key}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "var(--gl-surface-1)",
                  borderLeft: `4px solid ${c.color}`,
                }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : c.key)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <div>
                      <div className="font-semibold text-base">
                        {c.name}{" "}
                        <span className="text-sm font-normal" style={{ color: INK_MUTED }}>
                          {c.devanagari}
                        </span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: INK_SECONDARY }}>
                        {c.founder} · {c.years} · {c.currentEraApprox}
                      </div>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    <p className="text-sm leading-relaxed">{c.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: INK_MUTED }}>
                          Alignment Epoch
                        </div>
                        <div>{c.alignmentEpoch}</div>
                      </div>
                      <div className="p-3 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: INK_MUTED }}>
                          Reference Star / Basis
                        </div>
                        <div>{c.referenceStar}</div>
                      </div>
                      <div className="p-3 rounded sm:col-span-2" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: INK_MUTED }}>
                          Practitioner Community
                        </div>
                        <div>{c.community}</div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {c.detail}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Timeline tab ─── */}
      {tab === "timeline" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            This timeline shows the approximate alignment epochs for each ayanāṁśa convention. The epoch is the historical date at which the convention places 0° Aries aligned with the tropical vernal equinox.
          </p>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <TimelineSVG />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {TIMELINE_CONVENTIONS.map((c) => {
              const conv = CONVENTIONS[c.key];
              return (
                <div key={c.key} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: conv.color }} />
                  <span style={{ color: INK_SECONDARY }}>
                    <strong style={{ color: INK_PRIMARY }}>{conv.name}</strong> — {conv.alignmentEpoch}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CONVENTIONS.surya.color }} />
              <span style={{ color: INK_SECONDARY }}>
                <strong style={{ color: INK_PRIMARY }}>Sūrya Siddhānta-derived</strong> — varies per interpretation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CONVENTIONS.tropical.color }} />
              <span style={{ color: INK_SECONDARY }}>
                <strong style={{ color: INK_PRIMARY }}>Tropical</strong> — no epoch (zero offset)
              </span>
            </div>
          </div>
          <p className="text-xs" style={{ color: INK_MUTED }}>
            <Info size={12} className="inline mr-1" />
            The Sūrya Siddhānta-derived conventions do not have a single fixed epoch — different interpreters derive different alignment dates from the classical text. Tropical has no epoch because it defines 0° Aries at the vernal equinox with no sidereal offset.
          </p>
        </div>
      )}

      {/* ─── Communities tab ─── */}
      {tab === "communities" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            Each ayanāṁśa convention is operationally coupled to specific practitioner communities and methodological lineages. This mapping shows the primary community for each convention.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${INK_MUTED}` }}>
                  <th className="text-left py-2 px-3 font-semibold">Methodology Context</th>
                  <th className="text-left py-2 px-3 font-semibold">Ayanāṁśa</th>
                  <th className="text-left py-2 px-3 font-semibold">Primary Community</th>
                </tr>
              </thead>
              <tbody>
                {COMMUNITY_MAP.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `1px solid ${INK_MUTED}30` }}
                    className="hover:opacity-90 transition-opacity"
                  >
                    <td className="py-2.5 px-3">{row.context}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${row.color}18`,
                          color: row.color,
                        }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
                        {row.ayanamsha}
                      </span>
                    </td>
                    <td className="py-2.5 px-3" style={{ color: INK_SECONDARY }}>
                      {row.community}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight size={16} style={{ color: INDIGO }} />
              <span className="font-semibold text-sm">Preview: Which Ayanāṁśa When?</span>
            </div>
            <p className="text-sm" style={{ color: INK_SECONDARY }}>
              The full operational decision framework — translating this comparative knowledge into practitioner-level decision-making — is the subject of{" "}
              <strong>Lesson 2.2.6</strong>. There you will learn the 7-step practitioner flowchart, the do-not-mix discipline, and edge-case handling for multi-lineage practitioners.
            </p>
          </div>
        </div>
      )}

      {/* ─── Discipline tab ─── */}
      {tab === "discipline" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Scale size={16} style={{ color: INDIGO }} />
              Four Operational Rules
            </h4>
            <div className="space-y-2">
              {RULES.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: "var(--gl-surface-1)" }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: INDIGO }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <ShieldAlert size={16} style={{ color: VERMILION }} />
              Three Failure Modes to Avoid
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FAILURE_MODES.map((fm, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--gl-surface-1)",
                    borderTop: `3px solid ${VERMILION}`,
                  }}
                >
                  <div className="font-semibold text-sm mb-1.5" style={{ color: VERMILION }}>
                    {fm.label}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                    {fm.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: `${JADE}10` }}>
            <p className="text-sm leading-relaxed">
              <strong>Remember:</strong> The multi-ayanāṁśa-convention honesty discipline is not about
              declaring one convention "correct" and others "wrong." It is about{" "}
              <em>operational integrity</em> — matching the right ayanāṁśa to the right methodology,
              and being transparent when you work across multiple conventions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
