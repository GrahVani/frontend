"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { FolderOpen, Scale, Search, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "workbench" | "taxonomy" | "jupiter" | "case-file";
type WeekdayKey = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

type Sign = { name: string; start: number; lord: Planet };
type Nakshatra = { name: string; start: number; lord: Planet };

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const MUTED = "#5C4A2A"; // resolved --gl-ink-on-cream-muted for alpha contexts
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const TABS: Record<TabKey, { label: string; icon: typeof Search }> = {
  workbench: { label: "Consultation overlay", icon: Search },
  taxonomy: { label: "Two-tier taxonomy", icon: Scale },
  jupiter: { label: "What if Jupiter?", icon: Sparkles },
  "case-file": { label: "Case file", icon: FolderOpen },
};

const SIGNS: Sign[] = [
  { name: "Aries", start: 0, lord: "Mars" },
  { name: "Taurus", start: 30, lord: "Venus" },
  { name: "Gemini", start: 60, lord: "Mercury" },
  { name: "Cancer", start: 90, lord: "Moon" },
  { name: "Leo", start: 120, lord: "Sun" },
  { name: "Virgo", start: 150, lord: "Mercury" },
  { name: "Libra", start: 180, lord: "Venus" },
  { name: "Scorpio", start: 210, lord: "Mars" },
  { name: "Sagittarius", start: 240, lord: "Jupiter" },
  { name: "Capricorn", start: 270, lord: "Saturn" },
  { name: "Aquarius", start: 300, lord: "Saturn" },
  { name: "Pisces", start: 330, lord: "Jupiter" },
];

const NAKSHATRAS: Nakshatra[] = [
  { name: "Aśvinī", start: 0, lord: "Ketu" },
  { name: "Bharaṇī", start: 13.3333, lord: "Venus" },
  { name: "Kṛttikā", start: 26.6667, lord: "Sun" },
  { name: "Rohiṇī", start: 40, lord: "Moon" },
  { name: "Mṛgaśīrṣa", start: 53.3333, lord: "Mars" },
  { name: "Ārdrā", start: 66.6667, lord: "Rahu" },
  { name: "Punarvasu", start: 80, lord: "Jupiter" },
  { name: "Puṣya", start: 93.3333, lord: "Saturn" },
  { name: "Āśleṣā", start: 106.6667, lord: "Mercury" },
  { name: "Maghā", start: 120, lord: "Ketu" },
  { name: "Pūrva Phālgunī", start: 133.3333, lord: "Venus" },
  { name: "Uttara Phālgunī", start: 146.6667, lord: "Sun" },
  { name: "Hasta", start: 160, lord: "Moon" },
  { name: "Chitrā", start: 173.3333, lord: "Mars" },
  { name: "Svātī", start: 186.6667, lord: "Rahu" },
  { name: "Viśākhā", start: 200, lord: "Jupiter" },
  { name: "Anurādhā", start: 213.3333, lord: "Saturn" },
  { name: "Jyeṣṭhā", start: 226.6667, lord: "Mercury" },
  { name: "Mūla", start: 240, lord: "Ketu" },
  { name: "Pūrva Aṣāḍhā", start: 253.3333, lord: "Venus" },
  { name: "Uttara Aṣāḍhā", start: 266.6667, lord: "Sun" },
  { name: "Śravaṇa", start: 280, lord: "Moon" },
  { name: "Dhaniṣṭhā", start: 293.3333, lord: "Mars" },
  { name: "Śatabhiṣaj", start: 306.6667, lord: "Rahu" },
  { name: "Pūrva Bhādrapadā", start: 320, lord: "Jupiter" },
  { name: "Uttara Bhādrapadā", start: 333.3333, lord: "Saturn" },
  { name: "Revatī", start: 346.6667, lord: "Mercury" },
];

const DAY_LORD: Record<WeekdayKey, Planet> = {
  Sunday: "Sun",
  Monday: "Moon",
  Tuesday: "Mars",
  Wednesday: "Mercury",
  Thursday: "Jupiter",
  Friday: "Venus",
  Saturday: "Saturn",
};

const SIGNIFICATORS: Planet[] = ["Jupiter", "Mercury", "Mars", "Rahu"];

const PLANET_COLORS: Record<Planet, string> = {
  Sun: VERMILION,
  Moon: BLUE,
  Mars: VERMILION,
  Mercury: GREEN,
  Jupiter: GOLD,
  Venus: GREEN,
  Saturn: PURPLE,
  Rahu: PURPLE,
  Ketu: PURPLE,
};

const PRESETS = {
  vikram: {
    label: "Vikram's consultation — 2026-07-10, Jaipur",
    lagnaDeg: 285,
    moonDeg: 38,
    weekday: "Saturday" as WeekdayKey,
  },
  jupiter: {
    label: "Jupiter-confirming hypothetical — 2026-07-16, Jaipur",
    lagnaDeg: 250,
    moonDeg: 135,
    weekday: "Thursday" as WeekdayKey,
  },
  custom: {
    label: "Custom longitude input",
    lagnaDeg: 0,
    moonDeg: 0,
    weekday: "Monday" as WeekdayKey,
  },
};

function signAt(deg: number): Sign {
  const idx = Math.floor(deg / 30) % 12;
  return SIGNS[idx];
}

function nakshatraAt(deg: number): Nakshatra {
  const span = 40 / 3;
  const idx = Math.floor(deg / span) % 27;
  return NAKSHATRAS[idx];
}

function degToDms(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′`;
}

function useWorkbenchState() {
  const [activeTab, setActiveTab] = useState<TabKey>("workbench");
  const [preset, setPreset] = useState<keyof typeof PRESETS>("vikram");
  const [lagnaDeg, setLagnaDeg] = useState(PRESETS.vikram.lagnaDeg);
  const [moonDeg, setMoonDeg] = useState(PRESETS.vikram.moonDeg);
  const [weekday, setWeekday] = useState<WeekdayKey>(PRESETS.vikram.weekday);

  const applyPreset = (key: keyof typeof PRESETS) => {
    setPreset(key);
    if (key !== "custom") {
      const p = PRESETS[key];
      setLagnaDeg(p.lagnaDeg);
      setMoonDeg(p.moonDeg);
      setWeekday(p.weekday);
    }
  };

  const reset = () => {
    setActiveTab("workbench");
    applyPreset("vikram");
  };

  const lagnaSign = signAt(lagnaDeg);
  const lagnaStar = nakshatraAt(lagnaDeg);
  const moonSign = signAt(moonDeg);
  const moonStar = nakshatraAt(moonDeg);
  const dayLord = DAY_LORD[weekday];

  const rpSet: Planet[] = Array.from(
    new Set([lagnaSign.lord, lagnaStar.lord, moonSign.lord, moonStar.lord, dayLord])
  );

  const overlap = rpSet.filter((p) => SIGNIFICATORS.includes(p));
  const classification = overlap.length === 0 ? "silent" : "partial";

  return {
    activeTab,
    setActiveTab,
    preset,
    applyPreset,
    reset,
    lagnaDeg,
    setLagnaDeg,
    moonDeg,
    setMoonDeg,
    weekday,
    setWeekday,
    lagnaSign,
    lagnaStar,
    moonSign,
    moonStar,
    dayLord,
    rpSet,
    overlap,
    classification,
  };
}

function PlanetBadge({ planet, dim }: { planet: Planet; dim?: boolean }) {
  const color = PLANET_COLORS[planet];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.25rem 0.6rem",
        borderRadius: 12,
        border: `1px solid ${dim ? HAIRLINE : color}`,
        background: dim ? `${MUTED}15` : `${color}15`,
        color: dim ? INK_MUTED : color,
        fontWeight: 600,
        fontSize: "0.88rem",
        minWidth: 56,
      }}
    >
      {planet}
    </span>
  );
}

function RoleRow({ label, planet }: { label: string; planet: Planet }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", justifyContent: "space-between" }}>
      <span style={{ color: INK_SECONDARY, fontSize: "0.92rem" }}>{label}</span>
      <PlanetBadge planet={planet} />
    </div>
  );
}

function OverlaySvg({
  rpSet,
  overlap,
}: {
  rpSet: Planet[];
  overlap: Planet[];
}) {
  return (
    <svg viewBox="0 0 640 220" role="img" aria-label="Ruling Planet overlay pipeline" style={{ width: "100%", maxHeight: 240, display: "block" }}>
      <rect x={10} y={10} width={620} height={200} rx={8} fill={BLUE} fillOpacity={0.03} stroke={HAIRLINE} />
      <text x={320} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Consultation-moment RP overlay
      </text>

      {/* Left source column */}
      <text x={80} y={62} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Cast moment
      </text>
      <rect x={30} y={72} width={100} height={24} rx={5} fill={SURFACE} stroke={HAIRLINE} />
      <text x={80} y={88} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>
        Lagna roles
      </text>
      <rect x={30} y={102} width={100} height={24} rx={5} fill={SURFACE} stroke={HAIRLINE} />
      <text x={80} y={118} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>
        Moon roles
      </text>
      <rect x={30} y={132} width={100} height={24} rx={5} fill={SURFACE} stroke={HAIRLINE} />
      <text x={80} y={148} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>
        Day lord
      </text>

      {/* Arrow to RP set */}
      <path d="M 140 120 L 250 120" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="242,114 252,120 242,126" fill={GOLD} />

      {/* RP set box */}
      <rect x={260} y={80} width={120} height={80} rx={6} fill={GOLD} fillOpacity={0.06} stroke={GOLD} />
      <text x={320} y={102} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>
        RP set
      </text>
      <text x={320} y={130} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>
        {rpSet.join(" · ")}
      </text>
      <text x={320} y={148} textAnchor="middle" fill={INK_MUTED} fontSize={9}>
        distinct roles
      </text>

      {/* Arrow to significators */}
      <path d="M 390 120 L 460 120" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="452,114 462,120 452,126" fill={overlap.length ? GREEN : VERMILION} />

      {/* Right significators */}
      <text x={530} y={62} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Established
      </text>
      {SIGNIFICATORS.map((p, i) => {
        const y = 80 + i * 32;
        const present = rpSet.includes(p);
        return (
          <g key={p}>
            <rect x={480} y={y} width={100} height={24} rx={5} fill={present ? PLANET_COLORS[p] : INK_MUTED} fillOpacity={present ? 0.09 : 0.08} stroke={present ? PLANET_COLORS[p] : HAIRLINE} />
            <text x={530} y={y + 16} textAnchor="middle" fill={present ? PLANET_COLORS[p] : INK_MUTED} fontSize={10} fontWeight={600}>
              {p}
            </text>
            <text x={590} y={y + 16} fill={present ? GREEN : INK_MUTED} fontSize={12} fontWeight={600}>
              {present ? "✓" : "—"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TaxonomySvg() {
  return (
    <svg viewBox="0 0 620 180" role="img" aria-label="Two-tier taxonomy for candidate ranking" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={600} height={160} rx={8} fill={GOLD} fillOpacity={0.03} stroke={HAIRLINE} />
      <text x={310} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Structural limit: no negating house-set for a candidate
      </text>

      {/* Full four-tier taxonomy */}
      <text x={170} y={68} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        Full T2-15 taxonomy (has negating set)
      </text>
      <rect x={40} y={80} width={120} height={34} rx={5} fill={GREEN} fillOpacity={0.08} stroke={GREEN} />
      <text x={100} y={102} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>
        Confirmation
      </text>
      <rect x={170} y={80} width={120} height={34} rx={5} fill={GOLD} fillOpacity={0.08} stroke={GOLD} />
      <text x={230} y={102} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>
        Partial
      </text>
      <rect x={300} y={80} width={120} height={34} rx={5} fill={INK_MUTED} fillOpacity={0.15} stroke={HAIRLINE} />
      <text x={360} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Silent
      </text>
      <rect x={430} y={80} width={120} height={34} rx={5} fill={VERMILION} fillOpacity={0.08} stroke={VERMILION} />
      <text x={490} y={102} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
        Tension
      </text>

      {/* Two-tier fallback */}
      <text x={310} y={148} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        BTR candidate-ranking fallback: present or absent only
      </text>
      <rect x={170} y={120} width={110} height={28} rx={5} fill={GREEN} fillOpacity={0.08} stroke={GREEN} />
      <text x={225} y={138} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>
        Present
      </text>
      <rect x={340} y={120} width={110} height={28} rx={5} fill={INK_MUTED} fillOpacity={0.15} stroke={HAIRLINE} />
      <text x={395} y={138} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Absent
      </text>
    </svg>
  );
}

function JupiterScenarioSvg() {
  return (
    <svg viewBox="0 0 620 200" role="img" aria-label="Jupiter overlap does not single out one candidate" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={600} height={180} rx={8} fill={GOLD} fillOpacity={0.03} stroke={HAIRLINE} />
      <text x={310} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        A Jupiter overlap has two levels of specificity
      </text>

      <circle cx={120} cy={100} r={34} fill={GOLD} fillOpacity={0.09} stroke={GOLD} strokeWidth={2} />
      <text x={120} y={96} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>
        Jupiter
      </text>
      <text x={120} y={112} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        in RP set
      </text>

      <path d="M 160 100 L 220 100" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="212,94 222,100 212,106" fill={GOLD} />

      <rect x={230} y={60} width={160} height={70} rx={6} fill={SURFACE} stroke={BLUE} />
      <text x={310} y={84} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>
        General significance
      </text>
      <text x={310} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        Marriage antardaśā lord
      </text>
      <text x={310} y={118} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        Relevant to A and B both
      </text>

      <path d="M 390 95 L 450 95" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="442,89 452,95 442,101" fill={PURPLE} />

      <rect x={460} y={60} width={140} height={70} rx={6} fill={SURFACE} stroke={PURPLE} />
      <text x={530} y={84} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>
        Specific significance
      </text>
      <text x={530} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        Candidate B&apos;s own
      </text>
      <text x={530} y={118} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        Lagna sub-lord
      </text>

      <text x={310} y={165} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        Report both levels; do not let the specific one erase the general one.
      </text>
    </svg>
  );
}

function CaseFileSvg() {
  return (
    <svg viewBox="0 0 620 200" role="img" aria-label="Case file status across chapters" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={600} height={180} rx={8} fill={BLUE} fillOpacity={0.03} stroke={HAIRLINE} />
      <text x={310} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Candidate status across chapters
      </text>

      {[
        { chapter: "Chapter 2", a: "plausible, tied", b: "plausible, tied", c: "excluded" },
        { chapter: "Chapter 3", a: "less favoured", b: "currently favoured", c: "excluded" },
        { chapter: "Chapter 4", a: "plausible, not excluded", b: "more strongly favoured", c: "excluded, untouched" },
        { chapter: "Chapter 5", a: "unchanged", b: "unchanged", c: "unchanged", note: "silent non-confirmation" },
      ].map((row, i) => {
        const y = 62 + i * 32;
        const silent = row.note != null;
        return (
          <g key={row.chapter}>
            <text x={90} y={y + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
              {row.chapter}
            </text>
            <circle cx={190} cy={y + 10} r={13} fill={row.a.includes("favoured") ? GOLD : MUTED} fillOpacity={row.a.includes("favoured") ? 1 : 0.13} stroke={row.a.includes("favoured") ? GOLD : HAIRLINE} />
            <text x={190} y={y + 14} textAnchor="middle" fill={row.a.includes("favoured") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>
              A
            </text>
            <circle cx={260} cy={y + 10} r={13} fill={row.b.includes("favoured") ? GREEN : MUTED} fillOpacity={row.b.includes("favoured") ? 1 : 0.13} stroke={row.b.includes("favoured") ? GREEN : HAIRLINE} />
            <text x={260} y={y + 14} textAnchor="middle" fill={row.b.includes("favoured") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>
              B
            </text>
            <circle cx={330} cy={y + 10} r={13} fill={row.c.includes("excluded") ? VERMILION : MUTED} fillOpacity={row.c.includes("excluded") ? 1 : 0.13} stroke={row.c.includes("excluded") ? VERMILION : HAIRLINE} />
            <text x={330} y={y + 14} textAnchor="middle" fill={row.c.includes("excluded") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>
              C
            </text>
            <text x={430} y={y + 14} textAnchor="start" fill={silent ? BLUE : INK_MUTED} fontSize={10} fontWeight={600}>
              {row.note ?? "—"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DisclosureBlock({ rpSet, overlap, classification }: { rpSet: Planet[]; overlap: Planet[]; classification: string }) {
  const base =
    "Vikram's Chapters 1–4 findings were reached entirely through events-based, tattva-coherence, and KP Ruling-Planet analysis. " +
    "A further Ruling Planet overlay — computed for the actual consultation moment, a KP-native cross-check applied here by explicit choice and disclosed as such — ";

  let sentence = "";
  if (classification === "silent") {
    sentence =
      base +
      "shows none of the four previously-established significant planets present. This is silent non-confirmation: neither support nor contradiction for any candidate.";
  } else if (overlap.includes("Jupiter")) {
    sentence =
      base +
      "shows Jupiter present. Jupiter is significant to two findings: it is the marriage antardaśā lord (relevant to Candidates A and B alike) and Candidate B's own Lagna sub-lord. " +
      "The overlap corroborates the marriage-timing story generally and echoes B's sub-lord finding specifically; it does not, by itself, newly discriminate A from B.";
  } else {
    sentence =
      base +
      `shows ${overlap.join(" and ")} present. This is partial confirmation at the level of the established significator(s), not a final discrimination between candidates.`;
  }

  return (
    <div
      style={{
        padding: "0.75rem",
        borderRadius: 8,
        border: `1px solid ${classification === "silent" ? BLUE : GREEN}55`,
        background: `${classification === "silent" ? BLUE : GREEN}10`,
      }}
    >
      <p style={{ margin: "0 0 0.5rem", color: classification === "silent" ? BLUE : GREEN, fontWeight: 600 }}>
        Disclosure sentence
      </p>
      <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontStyle: "italic" }}>&quot;{sentence}&quot;</p>
      <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.88rem" }}>
        RP set: {rpSet.join(", ")}
      </p>
    </div>
  );
}

export function KpHoraryWorkbenchGeneral() {
  const {
    activeTab,
    setActiveTab,
    preset,
    applyPreset,
    reset,
    lagnaDeg,
    setLagnaDeg,
    moonDeg,
    setMoonDeg,
    weekday,
    setWeekday,
    lagnaSign,
    lagnaStar,
    moonSign,
    moonStar,
    dayLord,
    rpSet,
    overlap,
    classification,
  } = useWorkbenchState();

  return (
    <div data-interactive="kp-horary-workbench-general" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP Ruling Planets · Chapter 5</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Consultation-moment overlay workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Cast a certain consultation moment, compute its Ruling Planet set, and classify the result against the four planets already established in Vikram&apos;s case.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "workbench" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Workbench</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Build the overlay and read the result
            </h3>

            <div style={workbenchDiagramLayoutStyle}>
              <div style={{ flex: "1 1 360px", minWidth: 280 }}>
                <OverlaySvg rpSet={rpSet} overlap={overlap} />
              </div>

              <div style={{ flex: "1 1 260px", display: "grid", gap: "0.75rem", minWidth: 260 }}>
                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                  <p style={{ margin: "0 0 0.5rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>Preset consultation moment</p>
                  <div style={{ display: "grid", gap: "0.4rem" }}>
                    {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={preset === key}
                        onClick={() => applyPreset(key)}
                        style={{
                          textAlign: "left",
                          padding: "0.45rem 0.65rem",
                          borderRadius: 6,
                          border: `1px solid ${preset === key ? GOLD : HAIRLINE}`,
                          background: preset === key ? `${GOLD}15` : SURFACE,
                          color: preset === key ? GOLD : INK_PRIMARY,
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {PRESETS[key].label}
                      </button>
                    ))}
                  </div>
                </div>

                {preset === "custom" && (
                  <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, display: "grid", gap: "0.6rem" }}>
                    <label style={{ display: "grid", gap: "0.25rem" }}>
                      <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Lagna longitude (0–359°)</span>
                      <input
                        type="range"
                        min={0}
                        max={359}
                        value={lagnaDeg}
                        onChange={(e) => setLagnaDeg(Number(e.target.value))}
                        style={{ width: "100%" }}
                      />
                      <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{degToDms(lagnaDeg)} {lagnaSign.name}</span>
                    </label>
                    <label style={{ display: "grid", gap: "0.25rem" }}>
                      <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Moon longitude (0–359°)</span>
                      <input
                        type="range"
                        min={0}
                        max={359}
                        value={moonDeg}
                        onChange={(e) => setMoonDeg(Number(e.target.value))}
                        style={{ width: "100%" }}
                      />
                      <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{degToDms(moonDeg)} {moonSign.name}</span>
                    </label>
                    <label style={{ display: "grid", gap: "0.25rem" }}>
                      <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Weekday</span>
                      <select
                        value={weekday}
                        onChange={(e) => setWeekday(e.target.value as WeekdayKey)}
                        style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
                      >
                        {Object.keys(DAY_LORD).map((d) => (
                          <option key={d} value={d}>
                            {d} — lord {DAY_LORD[d as WeekdayKey]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                <button
                  type="button"
                  disabled
                  style={{
                    ...buttonStyle(false, INK_MUTED),
                    opacity: 0.65,
                    cursor: "not-allowed",
                    justifyContent: "center",
                  }}
                  title="Tension tier is unavailable for candidate-ranking overlays"
                >
                  Enable tension check (unavailable)
                </button>
                <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  The tension tier requires a negating house-set, which a BTR candidate-ranking does not have.
                </p>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Computed roles</p>
            <div style={{ display: "grid", gap: "0.55rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <div style={{ padding: "0.6rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>LAGNA</p>
                <RoleRow label={`${degToDms(lagnaDeg)} ${lagnaSign.name}`} planet={lagnaSign.lord} />
                <div style={{ marginTop: "0.35rem" }}>
                  <RoleRow label={`${lagnaStar.name} nakṣatra`} planet={lagnaStar.lord} />
                </div>
              </div>
              <div style={{ padding: "0.6rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>MOON</p>
                <RoleRow label={`${degToDms(moonDeg)} ${moonSign.name}`} planet={moonSign.lord} />
                <div style={{ marginTop: "0.35rem" }}>
                  <RoleRow label={`${moonStar.name} nakṣatra`} planet={moonStar.lord} />
                </div>
              </div>
              <div style={{ padding: "0.6rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>DAY</p>
                <RoleRow label={weekday} planet={dayLord} />
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Classification</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.35rem 0.7rem",
                  borderRadius: 20,
                  background: classification === "silent" ? `${BLUE}15` : `${GREEN}15`,
                  color: classification === "silent" ? BLUE : GREEN,
                  fontWeight: 600,
                  fontSize: "0.92rem",
                }}
              >
                {classification === "silent" ? "Silent non-confirmation" : "Partial confirmation"}
              </span>
              <span style={{ color: INK_SECONDARY, fontSize: "0.92rem" }}>
                {overlap.length === 0
                  ? "None of the four established significators appear in the RP set."
                  : `Overlap: ${overlap.join(", ")}`}
              </span>
            </div>
            <DisclosureBlock rpSet={rpSet} overlap={overlap} classification={classification} />
          </section>
        </>
      )}

      {activeTab === "taxonomy" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Structural limit</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              Why only present or absent applies here
            </h3>
            <TaxonomySvg />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                T2-15 15.6.3 disclosed that the full four-tier taxonomy needs a negating house-set. A BTR candidate-ranking has no such set, so this lesson inherits the same two-tier fallback T2-15 used for Tājika overlays: each established planet is either present or absent.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Discipline</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Report silence plainly.</span> A silent non-confirmation is information about what this specific check found, not a non-event.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Do not invent tension.</span> The greyed-out tension check is unavailable for a structural reason, not a data reason.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "jupiter" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Hypothetical</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              What a confirming Jupiter result would look like
            </h3>
            <JupiterScenarioSvg />
            <div style={{ marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={() => {
                  applyPreset("jupiter");
                  setActiveTab("workbench");
                }}
                style={buttonStyle(false, GOLD)}
              >
                Load the Jupiter-confirming preset
              </button>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Reading the overlap</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: BLUE, fontWeight: 600 }}>General level:</span> Jupiter is the marriage antardaśā lord. Candidates A and B share the same house-lordship story from Chapter 2, so this level applies to both.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: PURPLE, fontWeight: 600 }}>Specific level:</span> Jupiter is also Candidate B&apos;s own Lagna sub-lord from Chapter 4. This is the more pointed echo, but it does not, by itself, newly discriminate A from B.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>Disclosure discipline:</span> The finding is reported at both levels, and the same-root-versus-independent-data question from Lesson 20.5.2 is flagged before it is forgotten.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "case-file" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Case file</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Silence is recorded with the same visual weight as a finding
            </h3>
            <CaseFileSvg />
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                borderRadius: 8,
                border: `1px solid ${BLUE}55`,
                background: `${BLUE}10`,
              }}
            >
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: BLUE, fontWeight: 600 }}>Chapter 5 entry:</span> Consultation-moment RP overlay {rpSet.join(", ")} — silent non-confirmation. No candidate status changes; the honest contribution is that nothing changed.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Client statement</p>
            <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontStyle: "italic" }}>
                &quot;I also ran a Ruling-Planet overlay on the moment of our consultation — a real, certain moment. It did not add either support or contradiction to the existing lean. So the current picture stays exactly where it was: two candidates remain plausible, and the lean toward the earlier one is unchanged.&quot;
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}
