"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Heart,
  Home,
  Info,
  Moon,
  RotateCcw,
  Star,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type Mode = "reference" | "candidate";
type LimbKey = "tithi" | "vara" | "nakshatra" | "yoga" | "karana";
type Category = "favoured" | "acceptable" | "avoided";

type TriadPlanetKey = "venus" | "moon" | "jupiter";

interface LimbData {
  label: string;
  categories: Record<Category, string[]>;
}

const PANCA_LIMBS: Record<LimbKey, LimbData> = {
  tithi: {
    label: "Tithi",
    categories: {
      favoured: ["Bhadrā (2nd / 7th / 12th)", "Pūrṇā (5th / 10th / 15th)"],
      acceptable: ["Nandā (1st / 6th / 11th)"],
      avoided: ["Riktā (4th / 9th / 14th)"],
    },
  },
  vara: {
    label: "Vāra",
    categories: {
      favoured: ["Monday (Moon)", "Wednesday (Mercury)", "Thursday (Jupiter)", "Friday (Venus)"],
      acceptable: ["Sunday"],
      avoided: ["Tuesday", "Saturday"],
    },
  },
  nakshatra: {
    label: "Nakṣatra",
    categories: {
      favoured: [
        "Sthira class: Rohiṇī, Uttaraphālgunī, Uttarāṣāḍhā, Uttarabhādrapadā",
        "Mṛdu class: Mṛgaśīrṣā, Citrā, Anurādhā, Revatī",
      ],
      acceptable: ["Hasta", "Puṣya", "Svātī", "Punarvasu"],
      avoided: ["Ugra class", "Tīkṣṇa class"],
    },
  },
  yoga: {
    label: "Yoga",
    categories: {
      favoured: ["Dhruva", "Sukarmā", "Vṛddhi", "Brahma", "Śubha", "Sādhya"],
      acceptable: ["Unlisted yogas (e.g. Saubhāgya): neutral"],
      avoided: ["Vyatīpāta", "Vaidhṛti", "Parigha (tradition-variant)"],
    },
  },
  karana: {
    label: "Karaṇa",
    categories: {
      favoured: ["Bava", "Bālava", "Kaulava (especially)", "Taitila", "Garaja"],
      acceptable: ["Neutral karaṇas (e.g. Vaṇija)"],
      avoided: ["Viṣṭi (Bhadrā-mukha)"],
    },
  },
};

const LAGNA_PREFERENCE: Record<string, { label: string; tier: "extra" | "favoured" | "acceptable" | "avoided"; color: string }> = {
  aries: { label: "Aries", tier: "acceptable", color: BLUE },
  taurus: { label: "Taurus", tier: "extra", color: GOLD },
  gemini: { label: "Gemini", tier: "acceptable", color: BLUE },
  cancer: { label: "Cancer", tier: "extra", color: GOLD },
  leo: { label: "Leo", tier: "favoured", color: GREEN },
  virgo: { label: "Virgo", tier: "acceptable", color: BLUE },
  libra: { label: "Libra", tier: "acceptable", color: BLUE },
  scorpio: { label: "Scorpio", tier: "favoured", color: GREEN },
  sagittarius: { label: "Sagittarius", tier: "acceptable", color: BLUE },
  capricorn: { label: "Capricorn", tier: "avoided", color: VERMILION },
  aquarius: { label: "Aquarius", tier: "favoured", color: GREEN },
  pisces: { label: "Pisces", tier: "acceptable", color: BLUE },
};

const SIGNS = [
  { key: "aries", angle: 0 },
  { key: "taurus", angle: 30 },
  { key: "gemini", angle: 60 },
  { key: "cancer", angle: 90 },
  { key: "leo", angle: 120 },
  { key: "virgo", angle: 150 },
  { key: "libra", angle: 180 },
  { key: "scorpio", angle: 210 },
  { key: "sagittarius", angle: 240 },
  { key: "capricorn", angle: 270 },
  { key: "aquarius", angle: 300 },
  { key: "pisces", angle: 330 },
] as const;

const TRIAD_LABELS = [
  "Own / exalted / friendly sign",
  "Favourable house placement",
  "Non-combust",
  "Benefic aspect environment",
];

const TRIAD_META: Record<TriadPlanetKey, { label: string; color: string; icon: typeof Star }> = {
  venus: { label: "Venus", color: GOLD, icon: Heart },
  moon: { label: "Moon", color: BLUE, icon: Moon },
  jupiter: { label: "Jupiter", color: GREEN, icon: Star },
};

const CANDIDATE_OPTIONS = {
  tithi: ["Bhadrā", "Pūrṇā", "Nandā", "Riktā", "Other tithi"],
  vara: ["Monday", "Wednesday", "Thursday", "Friday", "Sunday", "Tuesday", "Saturday"],
  nakshatra: [
    "Mṛgaśīrṣā",
    "Rohiṇī",
    "Uttaraphālgunī",
    "Uttarāṣāḍhā",
    "Uttarabhādrapadā",
    "Citrā",
    "Anurādhā",
    "Revatī",
    "Hasta",
    "Puṣya",
    "Svātī",
    "Punarvasu",
    "Ugra class",
    "Tīkṣṇa class",
    "Other nakṣatra",
  ],
  yoga: ["Saubhāgya", "Dhruva", "Sukarmā", "Vṛddhi", "Brahma", "Śubha", "Sādhya", "Vyatīpāta", "Vaidhṛti", "Parigha", "Other yoga"],
  karana: ["Vaṇija", "Bava", "Bālava", "Kaulava", "Taitila", "Garaja", "Viṣṭi", "Other karaṇa"],
  lagna: ["Aquarius", "Taurus", "Leo", "Scorpio", "Cancer", "Capricorn", "Aries", "Gemini", "Virgo", "Libra", "Sagittarius", "Pisces"],
};

const FAV_TITHI = new Set(["Bhadrā", "Pūrṇā"]);
const AV_TITHI = new Set(["Riktā"]);

const FAV_VARA = new Set(["Monday", "Wednesday", "Thursday", "Friday"]);
const AV_VARA = new Set(["Tuesday", "Saturday"]);

const FAV_NAK = new Set([
  "Mṛgaśīrṣā",
  "Rohiṇī",
  "Uttaraphālgunī",
  "Uttarāṣāḍhā",
  "Uttarabhādrapadā",
  "Citrā",
  "Anurādhā",
  "Revatī",
]);
const AV_NAK = new Set(["Ugra class", "Tīkṣṇa class"]);

const FAV_YOGA = new Set(["Dhruva", "Sukarmā", "Vṛddhi", "Brahma", "Śubha", "Sādhya"]);
const AV_YOGA = new Set(["Vyatīpāta", "Vaidhṛti", "Parigha"]);

const FAV_KAR = new Set(["Bava", "Bālava", "Kaulava", "Taitila", "Garaja"]);
const AV_KAR = new Set(["Viṣṭi"]);

function limbStatus(limb: LimbKey, value: string): Category {
  if (limb === "tithi") {
    if (FAV_TITHI.has(value)) return "favoured";
    if (AV_TITHI.has(value)) return "avoided";
    return "acceptable";
  }
  if (limb === "vara") {
    if (FAV_VARA.has(value)) return "favoured";
    if (AV_VARA.has(value)) return "avoided";
    return "acceptable";
  }
  if (limb === "nakshatra") {
    if (FAV_NAK.has(value)) return "favoured";
    if (AV_NAK.has(value)) return "avoided";
    return "acceptable";
  }
  if (limb === "yoga") {
    if (FAV_YOGA.has(value)) return "favoured";
    if (AV_YOGA.has(value)) return "avoided";
    return "acceptable";
  }
  if (FAV_KAR.has(value)) return "favoured";
  if (AV_KAR.has(value)) return "avoided";
  return "acceptable";
}

function lagnaStatus(sign: string): Category {
  const pref = LAGNA_PREFERENCE[sign.toLowerCase()];
  if (!pref) return "acceptable";
  if (pref.tier === "avoided") return "avoided";
  if (pref.tier === "extra" || pref.tier === "favoured") return "favoured";
  return "acceptable";
}

function categoryColor(status: Category): string {
  if (status === "favoured") return GREEN;
  if (status === "avoided") return VERMILION;
  return INK_MUTED;
}

function CategoryChip({ status }: { status: Category }) {
  const color = categoryColor(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.125rem 0.5rem",
        borderRadius: "9999px",
        border: `1px solid ${color}`,
        color,
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}
    >
      {status === "favoured" ? <CheckCircle2 size={10} /> : null}
      {status === "avoided" ? <XCircle size={10} /> : null}
      {status === "acceptable" ? <Info size={10} /> : null}
      {status}
    </span>
  );
}

function LagnaWheel() {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 78;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Lagna sign preference wheel for gṛha-praveśa" style={{ width: "100%", maxWidth: 260 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1} />
        {SIGNS.map(({ key, angle }) => {
          const pref = LAGNA_PREFERENCE[key];
          const rad = ((angle - 90) * Math.PI) / 180;
          const x = cx + (r - 18) * Math.cos(rad);
          const y = cy + (r - 18) * Math.sin(rad);
          return (
            <g key={key}>
              <circle cx={x} cy={y} r={14} fill={`${pref.color}15`} stroke={pref.color} strokeWidth={2} />
              <text x={x} y={y + 3} textAnchor="middle" fontSize={9} fill={pref.color} fontWeight={600}>
                {pref.label.slice(0, 3)}
              </text>
            </g>
          );
        })}
        <text x={cx} y={cy - r - 12} textAnchor="middle" fontSize={10} fill={INK_MUTED} fontWeight={500}>
          Sthira (fixed) signs most-favoured
        </text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
        <LegendDot color={GOLD} label="Extra-strong (Taurus / Cancer)" />
        <LegendDot color={GREEN} label="Most-favoured Sthira" />
        <LegendDot color={BLUE} label="Acceptable" />
        <LegendDot color={VERMILION} label="Avoided (Capricorn)" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: INK_SECONDARY }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function ReferencePanel({ activeLimb, setActiveLimb, showCompare, setShowCompare }: { activeLimb: LimbKey; setActiveLimb: (key: LimbKey) => void; showCompare: boolean; setShowCompare: (value: boolean) => void }) {
  const data = PANCA_LIMBS[activeLimb];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {(Object.keys(PANCA_LIMBS) as LimbKey[]).map((key) => (
          <button key={key} type="button" aria-pressed={activeLimb === key} onClick={() => setActiveLimb(key)} style={smallChipStyle(activeLimb === key, GOLD)}>
            {PANCA_LIMBS[key].label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
        <CategoryCard title="Favoured" items={data.categories.favoured} color={GREEN} />
        <CategoryCard title="Acceptable" items={data.categories.acceptable} color={INK_MUTED} />
        <CategoryCard title="Avoided" items={data.categories.avoided} color={VERMILION} />
      </div>

      {activeLimb === "tithi" ? (
        <div style={cardStyle}>
          <button
            type="button"
            onClick={() => setShowCompare(!showCompare)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              background: "transparent",
              border: "none",
              color: INK_PRIMARY,
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Info size={16} color={PURPLE} />
              {`Marriage vs gṛha-praveśa tithi contrast`}
            </span>
            <ChevronDown size={14} color={INK_MUTED} style={{ transform: showCompare ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </button>
          {showCompare ? (
            <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem" }}>
              <div style={{ padding: "0.65rem", borderRadius: 6, border: `1px solid ${HAIRLINE}` }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Marriage (Lesson 16.2.1)</div>
                <div style={{ fontSize: "0.85rem", color: GREEN, marginBottom: "0.2rem" }}>Favoured: Pūrṇā</div>
                <div style={{ fontSize: "0.85rem", color: INK_MUTED, marginBottom: "0.2rem" }}>Acceptable: Bhadrā</div>
                <div style={{ fontSize: "0.85rem", color: VERMILION }}>Avoided: Riktā</div>
              </div>
              <div style={{ padding: "0.65rem", borderRadius: 6, border: `1px solid ${GREEN}` }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GREEN, marginBottom: "0.35rem" }}>Gṛha-praveśa (this lesson)</div>
                <div style={{ fontSize: "0.85rem", color: GREEN, marginBottom: "0.2rem" }}>Favoured: Bhadrā + Pūrṇā</div>
                <div style={{ fontSize: "0.85rem", color: INK_MUTED, marginBottom: "0.2rem" }}>Acceptable: Nandā</div>
                <div style={{ fontSize: "0.85rem", color: VERMILION }}>Avoided: Riktā</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CategoryCard({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, padding: "0.75rem", background: `${color}08` }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color, marginBottom: "0.45rem" }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: "1rem", color: INK_PRIMARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TriadDrill({
  triad,
  setTriad,
}: {
  triad: Record<TriadPlanetKey, boolean[]>;
  setTriad: (value: Record<TriadPlanetKey, boolean[]>) => void;
}) {
  function toggle(planet: TriadPlanetKey, index: number) {
    setTriad({
      ...triad,
      [planet]: triad[planet].map((value, i) => (i === index ? !value : value)),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`Each planet must be independently strong, not merely present. Toggle the four criteria to see the status flip.`}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
        {(Object.keys(TRIAD_META) as TriadPlanetKey[]).map((key) => {
          const meta = TRIAD_META[key];
          const Icon = meta.icon;
          const checks = triad[key];
          const strong = checks.every(Boolean);
          return (
            <div key={key} style={{ ...cardStyle, borderColor: strong ? meta.color : HAIRLINE }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Icon size={18} color={meta.color} />
                <span style={{ fontSize: "1rem", fontWeight: 600, color: meta.color }}>{meta.label}</span>
                <span style={{ marginLeft: "auto" }}>
                  <CategoryChip status={strong ? "favoured" : "avoided"} />
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {TRIAD_LABELS.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={checks[idx]}
                    onClick={() => toggle(key, idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      padding: "0.35rem 0.5rem",
                      borderRadius: 6,
                      border: `1px solid ${checks[idx] ? meta.color : HAIRLINE}`,
                      background: checks[idx] ? `${meta.color}10` : "transparent",
                      color: checks[idx] ? meta.color : INK_SECONDARY,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                    {checks[idx] ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CandidateScreen({
  candidate,
  setCandidate,
  triad,
}: {
  candidate: Record<LimbKey | "lagna", string>;
  setCandidate: (value: Record<LimbKey | "lagna", string>) => void;
  triad: Record<TriadPlanetKey, boolean[]>;
}) {
  const limbStatuses = useMemo(() => {
    return (Object.keys(PANCA_LIMBS) as LimbKey[]).map((key) => ({
      limb: key,
      label: PANCA_LIMBS[key].label,
      value: candidate[key],
      status: limbStatus(key, candidate[key]),
    }));
  }, [candidate]);

  const lagna = lagnaStatus(candidate.lagna);
  const allFavoured = limbStatuses.every((item) => item.status === "favoured") && lagna === "favoured";
  const anyAvoided = limbStatuses.some((item) => item.status === "avoided") || lagna === "avoided";
  const triadStrong = (Object.keys(triad) as TriadPlanetKey[]).every((key) => triad[key].every(Boolean));

  let verdict: { text: string; color: string; icon: typeof CheckCircle2 } = {
    text: "First-pass clear with honest neutral notes",
    color: GREEN,
    icon: CheckCircle2,
  };
  if (anyAvoided) verdict = { text: "Avoided factor present — candidate fails first pass", color: VERMILION, icon: XCircle };
  else if (!allFavoured) verdict = { text: "Acceptable/neutral factors — still viable but not flawless", color: GOLD, icon: Info };
  if (allFavoured && triadStrong) verdict = { text: "Strong first-pass candidate (triad also strong)", color: GREEN, icon: CheckCircle2 };

  const Icon = verdict.icon;

  function update(key: LimbKey | "lagna", value: string) {
    setCandidate({ ...candidate, [key]: value });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
        {(Object.keys(PANCA_LIMBS) as LimbKey[]).map((key) => (
          <SelectField
            key={key}
            label={PANCA_LIMBS[key].label}
            value={candidate[key]}
            options={CANDIDATE_OPTIONS[key]}
            onChange={(value) => update(key, value)}
          />
        ))}
        <SelectField label="Lagna" value={candidate.lagna} options={CANDIDATE_OPTIONS.lagna} onChange={(value) => update("lagna", value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
        {limbStatuses.map((item) => (
          <div key={item.limb} style={{ padding: "0.5rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
            <div style={{ fontSize: "0.72rem", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{item.label}</div>
            <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 500, marginTop: "0.15rem" }}>{item.value}</div>
            <div style={{ marginTop: "0.25rem" }}>
              <CategoryChip status={item.status} />
            </div>
          </div>
        ))}
        <div style={{ padding: "0.5rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
          <div style={{ fontSize: "0.72rem", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>Lagna</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 500, marginTop: "0.15rem" }}>{candidate.lagna}</div>
          <div style={{ marginTop: "0.25rem" }}>
            <CategoryChip status={lagna} />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0.75rem 1rem",
          borderRadius: 8,
          border: `1px solid ${verdict.color}`,
          background: `${verdict.color}10`,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Icon size={22} color={verdict.color} />
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: verdict.color }}>{verdict.text}</div>
          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>
            {triadStrong
              ? "Triad strength: all three planets strong."
              : "Triad strength: toggle the criteria above to confirm each planet's own strength."}
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label style={fieldLabelStyle}>
      {label}
      <div style={{ position: "relative", marginTop: "0.35rem" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} color={INK_MUTED} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </label>
  );
}

export function GrhaPraveshaClassicalConditionsWorkbench() {
  const [mode, setMode] = useState<Mode>("reference");
  const [activeLimb, setActiveLimb] = useState<LimbKey>("tithi");
  const [showCompare, setShowCompare] = useState(false);
  const [candidate, setCandidate] = useState<Record<LimbKey | "lagna", string>>({
    tithi: "Bhadrā",
    vara: "Thursday",
    nakshatra: "Mṛgaśīrṣā",
    yoga: "Saubhāgya",
    karana: "Vaṇija",
    lagna: "Aquarius",
  });
  const [triad, setTriad] = useState<Record<TriadPlanetKey, boolean[]>>({
    venus: [true, true, true, true],
    moon: [true, true, true, true],
    jupiter: [true, true, true, true],
  });

  function handleReset() {
    setMode("reference");
    setActiveLimb("tithi");
    setShowCompare(false);
    setCandidate({
      tithi: "Bhadrā",
      vara: "Thursday",
      nakshatra: "Mṛgaśīrṣā",
      yoga: "Saubhāgya",
      karana: "Vaṇija",
      lagna: "Aquarius",
    });
    setTriad({ venus: [true, true, true, true], moon: [true, true, true, true], jupiter: [true, true, true, true] });
  }

  return (
    <div data-interactive="grha-pravesha-classical-conditions-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Gṛha-praveśa classical conditions</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              Explore the housewarming pañcāṅga table, lagna preference, and triad-strength drill
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`This workbench loads T1-23 Lesson 23.4.3's gṛha-praveśa-specific values and lets you screen the Sharma family's own candidate live.`}
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-23 Lesson 23.4.3 §4.2 / §4.5, verbatim
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button type="button" aria-pressed={mode === "reference"} onClick={() => setMode("reference")} style={buttonStyle(mode === "reference", GOLD)}>
          <BookOpen size={14} />
          Reference table
        </button>
        <button type="button" aria-pressed={mode === "candidate"} onClick={() => setMode("candidate")} style={buttonStyle(mode === "candidate", GREEN)}>
          <Home size={14} />
          Sharma candidate screen
        </button>
      </div>

      {mode === "reference" ? (
        <div style={workbenchDiagramLayoutStyle}>
          <section style={{ ...cardStyle, flex: "2 1 460px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <ReferencePanel activeLimb={activeLimb} setActiveLimb={setActiveLimb} showCompare={showCompare} setShowCompare={setShowCompare} />
          </section>
          <section style={{ ...cardStyle, flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={eyebrowStyle}>Lagna preference</p>
            <LagnaWheel />
            <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {`4th house is most-central. Sthira signs are most-favoured; Cancer and Taurus carry extra-strong status. Capricorn is specifically avoided.`}
            </div>
          </section>
        </div>
      ) : null}

      {mode === "candidate" ? (
        <div style={workbenchDiagramLayoutStyle}>
          <section style={{ ...cardStyle, flex: "2 1 460px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <CandidateScreen candidate={candidate} setCandidate={setCandidate} triad={triad} />
          </section>
          <section style={{ ...cardStyle, flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={eyebrowStyle}>Triad strength drill</p>
            <TriadDrill triad={triad} setTriad={setTriad} />
          </section>
        </div>
      ) : null}

      <div
        style={{
          ...cardStyle,
          borderColor: GOLD,
          background: `${GOLD}08`,
          fontSize: "0.85rem",
          color: INK_SECONDARY,
          lineHeight: 1.6,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontWeight: 600, color: GOLD }}>
          <Info size={14} />
          Honest scope note
        </span>
        {` A neutral yoga or karaṇa is not rounded up to favourable. The Sharma candidate's Saubhāgya yoga and Vaṇija karaṇa are honestly named neutral, exactly as the lesson does.`}
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.45rem 0.85rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
});

const smallChipStyle = (active: boolean, color: string): CSSProperties => ({
  padding: "0.35rem 0.55rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_SECONDARY,
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
});

const fieldLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "0.45rem 2rem 0.45rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "transparent",
  color: INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  appearance: "none",
  cursor: "pointer",
};
