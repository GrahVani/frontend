"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { BookOpen, FolderOpen, MoveRight, Search, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "constructor" | "candidates" | "sensitivity" | "sourcing";
type Movement = "movable" | "fixed" | "dual";
type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

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

const TABS: Record<TabKey, { label: string; icon: typeof Search }> = {
  constructor: { label: "Constructor", icon: Search },
  candidates: { label: "Vikram's candidates", icon: FolderOpen },
  sensitivity: { label: "48-second sensitivity", icon: MoveRight },
  sourcing: { label: "Sourcing", icon: BookOpen },
};

const SIGNS: {
  name: string;
  lord: Planet;
  movement: Movement;
  index: number;
}[] = [
  { name: "Aries", lord: "Mars", movement: "movable", index: 0 },
  { name: "Taurus", lord: "Venus", movement: "fixed", index: 1 },
  { name: "Gemini", lord: "Mercury", movement: "dual", index: 2 },
  { name: "Cancer", lord: "Moon", movement: "movable", index: 3 },
  { name: "Leo", lord: "Sun", movement: "fixed", index: 4 },
  { name: "Virgo", lord: "Mercury", movement: "dual", index: 5 },
  { name: "Libra", lord: "Venus", movement: "movable", index: 6 },
  { name: "Scorpio", lord: "Mars", movement: "fixed", index: 7 },
  { name: "Sagittarius", lord: "Jupiter", movement: "dual", index: 8 },
  { name: "Capricorn", lord: "Saturn", movement: "movable", index: 9 },
  { name: "Aquarius", lord: "Saturn", movement: "fixed", index: 10 },
  { name: "Pisces", lord: "Jupiter", movement: "dual", index: 11 },
];

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

const CANDIDATES = {
  A: { label: "Candidate A", sign: "Virgo", deg: 24, min: 30 },
  B: { label: "Candidate B", sign: "Virgo", deg: 27, min: 30 },
  C: { label: "Candidate C", sign: "Libra", deg: 0, min: 30 },
};

const NADI_SIZE = 0.2; // 12 arc-minutes

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function degToDecimal(deg: number, min: number): number {
  return deg + min / 60;
}

function computeNadiamsa(signName: string, deg: number, min: number) {
  const sign = SIGNS.find((s) => s.name === signName)!;
  const d = degToDecimal(deg, min);
  let division = 1;

  if (sign.movement === "movable") {
    division = Math.floor(d / NADI_SIZE) + 1;
  } else if (sign.movement === "fixed") {
    division = 150 - Math.floor(d / NADI_SIZE);
  } else {
    if (d >= 15) {
      division = Math.floor((d - 15) / NADI_SIZE) + 1;
    } else {
      division = 76 + Math.floor(d / NADI_SIZE);
    }
  }

  division = Math.max(1, Math.min(150, division));

  let assignedIndex: number;
  if (sign.movement === "fixed") {
    assignedIndex = mod(sign.index - (division - 1), 12);
  } else {
    assignedIndex = mod(sign.index + (division - 1), 12);
  }
  const assignedSign = SIGNS[assignedIndex];

  return { division, assignedSign, lord: assignedSign.lord };
}

function computeSegment(signName: string, division: number): { start: number; end: number } {
  const sign = SIGNS.find((s) => s.name === signName)!;
  if (sign.movement === "movable") {
    return { start: (division - 1) * NADI_SIZE, end: division * NADI_SIZE };
  }
  if (sign.movement === "fixed") {
    return { start: 30 - division * NADI_SIZE, end: 30 - (division - 1) * NADI_SIZE };
  }
  // dual
  if (division <= 75) {
    return { start: 15 + (division - 1) * NADI_SIZE, end: 15 + division * NADI_SIZE };
  }
  const d2 = division - 75;
  return { start: (d2 - 1) * NADI_SIZE, end: d2 * NADI_SIZE };
}

function SignBadge({ sign, color }: { sign: string; color?: string }) {
  const c = color ?? GOLD;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.25rem 0.6rem",
        borderRadius: 12,
        border: `1px solid ${c}`,
        background: `${c}15`,
        color: c,
        fontWeight: 600,
        fontSize: "0.88rem",
      }}
    >
      {sign}
    </span>
  );
}

function PlanetBadge({ planet }: { planet: Planet }) {
  const c = PLANET_COLORS[planet];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.25rem 0.6rem",
        borderRadius: 12,
        border: `1px solid ${c}`,
        background: `${c}15`,
        color: c,
        fontWeight: 600,
        fontSize: "0.88rem",
      }}
    >
      {planet}
    </span>
  );
}

function NadiamsaRulerSvg({
  signName,
  deg,
  min,
}: {
  signName: string;
  deg: number;
  min: number;
}) {
  const sign = SIGNS.find((s) => s.name === signName)!;
  const d = degToDecimal(deg, min);
  const { division, assignedSign } = computeNadiamsa(signName, deg, min);
  const seg = computeSegment(signName, division);

  const leftX = 60;
  const rightX = 540;
  const width = rightX - leftX;
  const toX = (degree: number) => leftX + (degree / 30) * width;
  const y = 90;
  const barH = 40;

  return (
    <svg viewBox="0 0 600 200" role="img" aria-label="Nadiamsa division within the sign" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={580} height={180} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={300} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {sign.name} · {sign.movement} sign · 150 divisions of 12′
      </text>

      {/* Main bar */}
      <rect x={leftX} y={y} width={width} height={barH} rx={5} fill={SURFACE} stroke={HAIRLINE} />

      {/* Midpoint line for dual */}
      {sign.movement === "dual" && (
        <line x1={toX(15)} y1={y - 8} x2={toX(15)} y2={y + barH + 8} stroke={GOLD} strokeWidth={2} strokeDasharray="4 3" />
      )}

      {/* Current division segment */}
      <rect x={toX(seg.start)} y={y + 4} width={Math.max(2, toX(seg.end) - toX(seg.start))} height={barH - 8} rx={3} fill={`${GOLD}30`} stroke={GOLD} strokeWidth={2} />

      {/* Current degree marker */}
      <line x1={toX(d)} y1={y - 12} x2={toX(d)} y2={y + barH + 12} stroke={VERMILION} strokeWidth={2} />
      <circle cx={toX(d)} cy={y - 18} r={5} fill={VERMILION} />

      {/* Labels */}
      <text x={leftX} y={y + barH + 32} textAnchor="start" fill={INK_MUTED} fontSize={10} fontWeight={600}>
        0°
      </text>
      <text x={rightX} y={y + barH + 32} textAnchor="end" fill={INK_MUTED} fontSize={10} fontWeight={600}>
        30°
      </text>
      {sign.movement === "dual" && (
        <text x={toX(15)} y={y - 26} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>
          midpoint 15°
        </text>
      )}

      {/* Result callout */}
      <text x={300} y={158} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>
        Division {division} of 150 → {assignedSign.name} ({assignedSign.lord})
      </text>
    </svg>
  );
}

function SameRootSvg() {
  return (
    <svg viewBox="0 0 620 220" role="img" aria-label="Same-root versus independent-data convergence" style={{ width: "100%", maxHeight: 240, display: "block" }}>
      <rect x={10} y={10} width={600} height={200} rx={8} fill={`${PURPLE}08`} stroke={HAIRLINE} />
      <text x={310} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Counting evidence honestly
      </text>

      {/* Root */}
      <circle cx={120} cy={110} r={34} fill={`${BLUE}18`} stroke={BLUE} strokeWidth={2} />
      <text x={120} y={106} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>
        Lagna degree
      </text>
      <text x={120} y={122} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        same input
      </text>

      {/* Branches */}
      <path d="M 155 100 C 200 100, 200 70, 245 70" stroke={HAIRLINE} strokeWidth={2} fill="none" />
      <path d="M 155 120 C 200 120, 200 150, 245 150" stroke={HAIRLINE} strokeWidth={2} fill="none" />

      <rect x={250} y={48} width={130} height={44} rx={6} fill={SURFACE} stroke={GOLD} />
      <text x={315} y={68} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>
        KP sub-lord
      </text>
      <text x={315} y={84} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        Chapter 4
      </text>

      <rect x={250} y={128} width={130} height={44} rx={6} fill={SURFACE} stroke={GOLD} />
      <text x={315} y={148} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>
        Nāḍiāṁśa
      </text>
      <text x={315} y={164} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        Chapter 5
      </text>

      <text x={315} y={195} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Same-root, different-resolution agreement = one thread
      </text>

      {/* Independent branch */}
      <path d="M 155 110 L 420 110" stroke={HAIRLINE} strokeWidth={2} strokeDasharray="6 4" />
      <polygon points="412,104 422,110 412,116" fill={GREEN} />
      <rect x={430} y={80} width={150} height={60} rx={6} fill={SURFACE} stroke={GREEN} />
      <text x={505} y={104} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>
        Tattva coherence
      </text>
      <text x={505} y={122} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        independent input
      </text>
      <text x={505} y={138} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        Chapter 3
      </text>

      <text x={310} y={100} textAnchor="middle" fill={INK_MUTED} fontSize={9}>
        vs
      </text>
    </svg>
  );
}

function CandidateRow({
  label,
  signName,
  deg,
  min,
}: {
  label: string;
  signName: string;
  deg: number;
  min: number;
}) {
  const { division, assignedSign, lord } = computeNadiamsa(signName, deg, min);
  const established = SIGNIFICATORS.includes(lord);
  return (
    <tr>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>{label}</td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
        {signName} {deg}°{String(min).padStart(2, "0")}′
      </td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>{division}/150</td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}` }}>
        <SignBadge sign={assignedSign.name} color={established ? GREEN : INK_MUTED} />
      </td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}` }}>
        <PlanetBadge planet={lord} />
      </td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: established ? GREEN : INK_MUTED, fontWeight: 600 }}>
        {established ? "established" : "unconnected"}
      </td>
    </tr>
  );
}

function SourcingBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
      <p style={{ margin: "0 0 0.35rem", color: GOLD, fontWeight: 600 }}>Sourcing disclosure</p>
      <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
        This tool computes the sign-level Nāḍiāṁśa division using the movable/fixed/dual rule found in modern Tamil Nāḍi-tradition compilations (Santhanam, B.V. Raman, 1998 <i>Vedic Astrology</i> note). It does not display a named Nāḍi table (Mahā/Madhya/Antya Nāḍi etc.) because that table was not verified against a primary source this session.
      </p>
    </div>
  );
}

export function DivisionalChartConstructor() {
  const [activeTab, setActiveTab] = useState<TabKey>("constructor");
  const [selectedSign, setSelectedSign] = useState<string>("Virgo");
  const [deg, setDeg] = useState<number>(24);
  const [min, setMin] = useState<number>(30);
  const [showSourcing, setShowSourcing] = useState<boolean>(true);

  const setPreset = (key: keyof typeof CANDIDATES) => {
    const c = CANDIDATES[key];
    setSelectedSign(c.sign);
    setDeg(c.deg);
    setMin(c.min);
  };

  const reset = () => {
    setActiveTab("constructor");
    setPreset("A");
    setShowSourcing(true);
  };

  const nudge = (deltaMin: number) => {
    let total = deg * 60 + min + deltaMin;
    if (total < 0) total = 0;
    if (total >= 30 * 60) total = 30 * 60 - 1;
    const dms = { deg: Math.floor(total / 60), min: total % 60 };
    setDeg(dms.deg);
    setMin(dms.min);
  };

  const result = computeNadiamsa(selectedSign, deg, min);
  const seg = computeSegment(selectedSign, result.division);
  const established = SIGNIFICATORS.includes(result.lord);

  return (
    <div data-interactive="divisional-chart-constructor" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Nāḍiāṁśa · Chapter 5</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              D150 divisional chart constructor
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compute the Nāḍiāṁśa division and assigned sign for any Lagna degree, and see how 12′ of arc maps to 48 seconds of birth time.
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

      {showSourcing && <SourcingBanner visible />}

      {activeTab === "constructor" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Input</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Enter a Lagna degree
            </h3>
            <div style={workbenchDiagramLayoutStyle}>
              <div style={{ flex: "1 1 360px", minWidth: 280 }}>
                <NadiamsaRulerSvg signName={selectedSign} deg={deg} min={min} />
              </div>
              <div style={{ flex: "1 1 260px", display: "grid", gap: "0.75rem", minWidth: 260 }}>
                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, display: "grid", gap: "0.6rem" }}>
                  <label style={{ display: "grid", gap: "0.25rem" }}>
                    <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Sign</span>
                    <select
                      value={selectedSign}
                      onChange={(e) => setSelectedSign(e.target.value)}
                      style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
                    >
                      {SIGNS.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name} ({s.movement})
                        </option>
                      ))}
                    </select>
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <label style={{ flex: 1, display: "grid", gap: "0.25rem" }}>
                      <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Degrees</span>
                      <input
                        type="number"
                        min={0}
                        max={29}
                        value={deg}
                        onChange={(e) => setDeg(Math.max(0, Math.min(29, Number(e.target.value) || 0)))}
                        style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
                      />
                    </label>
                    <label style={{ flex: 1, display: "grid", gap: "0.25rem" }}>
                      <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>Minutes</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={min}
                        onChange={(e) => setMin(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                        style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, display: "grid", gap: "0.5rem" }}>
                  <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem" }}>Preset candidates</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {(Object.keys(CANDIDATES) as (keyof typeof CANDIDATES)[]).map((key) => (
                      <button key={key} type="button" onClick={() => setPreset(key)} style={buttonStyle(false, GOLD)}>
                        {CANDIDATES[key].label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={() => setShowSourcing((v) => !v)} style={buttonStyle(showSourcing, GOLD)}>
                  <Sparkles size={15} aria-hidden="true" />
                  {showSourcing ? "Hide sourcing banner" : "Show sourcing banner"}
                </button>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Result</p>
            <div style={{ display: "grid", gap: "0.55rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>MOVEMENT RULE</p>
                <SignBadge sign={SIGNS.find((s) => s.name === selectedSign)!.movement} color={BLUE} />
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>DIVISION</p>
                <p style={{ margin: 0, color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
                  {result.division}<span style={{ color: INK_MUTED, fontSize: "0.9rem" }}>/150</span>
                </p>
                <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>
                  segment {seg.start.toFixed(1)}°–{seg.end.toFixed(1)}°
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>ASSIGNED SIGN</p>
                <SignBadge sign={result.assignedSign.name} />
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>SIGN LORD</p>
                <PlanetBadge planet={result.lord} />
                <p style={{ margin: "0.35rem 0 0", color: established ? GREEN : INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>
                  {established ? "Established significator" : "Not established in this case"}
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "candidates" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Vikram&apos;s case</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              All three candidates produce distinct divisions and signs
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Candidate</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Lagna</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Division</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Assigned sign</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Lord</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <CandidateRow label="A" signName={CANDIDATES.A.sign} deg={CANDIDATES.A.deg} min={CANDIDATES.A.min} />
                  <CandidateRow label="B" signName={CANDIDATES.B.sign} deg={CANDIDATES.B.deg} min={CANDIDATES.B.min} />
                  <CandidateRow label="C" signName={CANDIDATES.C.sign} deg={CANDIDATES.C.deg} min={CANDIDATES.C.min} />
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Candidate B</span> lands in Scorpio, ruled by Mars — the mahādaśā lord shared by both dated events. <span style={{ color: GOLD, fontWeight: 600 }}>Candidate C</span> lands in Sagittarius/Jupiter, already significant through the marriage antardaśā but ambiguous for C. <span style={{ color: INK_MUTED, fontWeight: 600 }}>Candidate A</span> lands in Leo/Sun, unconnected to the established case.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Same-root caution</p>
            <SameRootSvg />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: PURPLE, fontWeight: 600 }}>Count correctly.</span> The sub-lord and Nāḍiāṁśa findings share the same root input (the Lagna degree). They are one evidentiary thread read through two lenses, not two independent votes.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "sensitivity" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Boundary test</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
              One Nāḍiāṁśa division passes in 48 seconds
            </h3>
            <div style={workbenchDiagramLayoutStyle}>
              <div style={{ flex: "1 1 360px", minWidth: 280 }}>
                <NadiamsaRulerSvg signName={selectedSign} deg={deg} min={min} />
              </div>
              <div style={{ flex: "1 1 260px", display: "grid", gap: "0.75rem", minWidth: 260 }}>
                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, display: "grid", gap: "0.6rem" }}>
                  <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.9rem" }}>Nudge the Lagna by one arc-minute</p>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button type="button" onClick={() => nudge(-1)} style={{ ...buttonStyle(false, VERMILION), flex: 1, justifyContent: "center" }}>
                      −1′
                    </button>
                    <button type="button" onClick={() => nudge(1)} style={{ ...buttonStyle(false, GREEN), flex: 1, justifyContent: "center" }}>
                      +1′
                    </button>
                  </div>
                </div>
                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                  <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>CURRENT INPUT</p>
                  <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600 }}>
                    {selectedSign} {deg}°{String(min).padStart(2, "0")}′
                  </p>
                  <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY }}>
                    Division {result.division} of 150 · {result.assignedSign.name} ({result.lord})
                  </p>
                </div>
                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                    <span style={{ color: VERMILION, fontWeight: 600 }}>Sensitivity:</span> Lagna moves about 1° in four minutes, so 12′ takes 48 seconds. A small birth-time error can flip the assigned sign entirely.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Try this</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: BLUE, fontWeight: 600 }}>Candidate A:</span> 24°30′ Virgo is division 48 (Leo). Step to 24°31′ and the division is still 48. Step to 24°36′ and it becomes 49 — one division later, 48 seconds of birth time.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>Candidate B:</span> 27°30′ Virgo is division 63 (Scorpio/Mars). Nudge across a boundary to see how quickly the lord can change.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "sourcing" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Honest sourcing</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              What is reproduced and what is withheld
            </h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Implemented:</span> the sign-level computation rule — 150 divisions of 12′ each, with movable signs counting forward from 0°, fixed signs backward from 30°, and dual signs from the midpoint outward. Independently checked: Aries division 150 → Virgo.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Withheld:</span> any specific Nāḍi-name table (Mahā Nāḍi, Madhya Nāḍi, Antya Nāḍi, etc.). Those tables appear in modern compilations but were not verified against a primary source this session, so the tool refuses to present them as certain.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: BLUE, fontWeight: 600 }}>Citable modern sources:</span> R. Santhanam, <i>Devakeralam</i>; B.V. Raman, <i>The Astrological Magazine</i>; &quot;A Note on Nadi Amshas&quot;, <i>Vedic Astrology</i> magazine, Nov-Dec 1998.
                </p>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Banner control</p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setShowSourcing((v) => !v)} style={buttonStyle(showSourcing, GOLD)}>
                <Sparkles size={15} aria-hidden="true" />
                {showSourcing ? "Hide sourcing banner" : "Show sourcing banner"}
              </button>
              <span style={{ color: INK_SECONDARY, fontSize: "0.9rem" }}>
                The banner is on by default so the limitation is never hidden.
              </span>
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
