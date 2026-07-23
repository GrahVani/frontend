"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Compass,
  Layers,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const AMBER = "#D97706";
const VERMILION = "#A23A1E";

const RASHI_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGN_LORDS = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

const HOUSE_THEMES: Record<number, string> = {
  1: "Self & identity: personal beginnings, vitality, and physical focus.",
  2: "Speech & finance: resources, family, and vocal expression.",
  3: "Efforts & siblings: courage, communications, and short journeys.",
  4: "Home & emotion: domestic environment and inner happiness.",
  5: "Intellect & children: creativity, scholarship, and progeny.",
  6: "Service & discipline: healing, challenges, routine, and debt management.",
  7: "Relationship & partnership: legal bonds and public contracts.",
  8: "Depth & transformation: research, major changes, and longevity awareness.",
  9: "Higher wisdom & dharma: philosophy, mentorship, and righteous action.",
  10: "Career & action: professional responsibilities and public visibility.",
  11: "Gains & aspirations: goals, secondary income, and supportive networks.",
  12: "Retreat & charity: solitude, contemplation, letting go, and distant connections.",
};

const HOUSE_PATHS: Record<number, string> = {
  1: "M 100,0 L 50,50 L 100,100 L 150,50 Z",
  2: "M 0,0 L 100,0 L 50,50 Z",
  3: "M 0,0 L 0,100 L 50,50 Z",
  4: "M 0,100 L 50,50 L 100,100 L 50,150 Z",
  5: "M 0,200 L 0,100 L 50,150 Z",
  6: "M 0,200 L 100,200 L 50,150 Z",
  7: "M 100,200 L 50,150 L 100,100 L 150,150 Z",
  8: "M 200,200 L 100,200 L 150,150 Z",
  9: "M 200,200 L 200,100 L 150,150 Z",
  10: "M 200,100 L 150,50 L 100,100 L 150,150 Z",
  11: "M 200,0 L 200,100 L 150,50 Z",
  12: "M 200,0 L 100,0 L 150,50 Z",
};

const HOUSE_LABEL_POS: Record<number, { x: number; y: number }> = {
  1: { x: 100, y: 45 },
  2: { x: 50, y: 22 },
  3: { x: 22, y: 50 },
  4: { x: 45, y: 100 },
  5: { x: 22, y: 150 },
  6: { x: 50, y: 178 },
  7: { x: 100, y: 155 },
  8: { x: 150, y: 178 },
  9: { x: 178, y: 150 },
  10: { x: 155, y: 100 },
  11: { x: 178, y: 50 },
  12: { x: 150, y: 22 },
};

interface ChartPoint {
  id: string;
  name: string;
  longitude: number;
}

interface CrossCheckScenario {
  key: string;
  label: string;
  natalLagnaIndex: number;
  yearN: number;
  points: ChartPoint[];
}

const CROSS_CHECK_SCENARIOS: CrossCheckScenario[] = [
  {
    key: "kavya-30",
    label: "Kavya — year 30",
    natalLagnaIndex: 3, // Cancer
    yearN: 30,
    points: [
      { id: "su", name: "Sun", longitude: 110 },
      { id: "mo", name: "Moon", longitude: 15 },
      { id: "me", name: "Mercury", longitude: 118 },
      { id: "ve", name: "Venus", longitude: 95 },
      { id: "ma", name: "Mars", longitude: 200 },
      { id: "ju", name: "Jupiter", longitude: 350 },
      { id: "sa", name: "Saturn", longitude: 302 },
      { id: "ra", name: "Rahu", longitude: 80 },
      { id: "ke", name: "Ketu", longitude: 260 },
    ],
  },
  {
    key: "meera-25",
    label: "Meera — year 25",
    natalLagnaIndex: 6, // Libra
    yearN: 25,
    points: [
      { id: "ra", name: "Rahu", longitude: 10 },
      { id: "ju", name: "Jupiter", longitude: 50 },
      { id: "mo", name: "Moon", longitude: 80 },
      { id: "ma", name: "Mars", longitude: 110 },
      { id: "sa", name: "Saturn", longitude: 140 },
      { id: "ke", name: "Ketu", longitude: 190 },
      { id: "su", name: "Sun", longitude: 260 },
      { id: "me", name: "Mercury", longitude: 265 },
      { id: "ve", name: "Venus", longitude: 290 },
    ],
  },
];

function normalizeDeg(deg: number): number {
  let v = deg % 360;
  if (v < 0) v += 360;
  return v;
}

function signIndex(deg: number): number {
  return Math.floor(normalizeDeg(deg) / 30) % 12;
}

function formatDms(deg: number): string {
  const normalized = normalizeDeg(deg);
  const inSign = normalized % 30;
  const d = Math.floor(inSign);
  const m = Math.floor((inSign - d) * 60);
  const s = Math.round(((inSign - d) * 60 - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}′ ${s.toString().padStart(2, "0")}″`;
}

function munthaHouseCorrected(yearN: number): number {
  if (yearN <= 0) return 1;
  return ((yearN - 1) % 12) + 1;
}

function munthaHouseOld(yearN: number): number {
  if (yearN <= 0) return 1;
  return (yearN % 12) || 12;
}

function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function TajikaMunthaConceptExplorer() {
  const [natalLagna, setNatalLagna] = useState<number>(3); // Cancer for Kavya default
  const [startYearN, setStartYearN] = useState<number>(28);
  const [yearCount, setYearCount] = useState<number>(10);
  const [useOldFormula, setUseOldFormula] = useState<boolean>(false);
  const [scenarioKey, setScenarioKey] = useState<string>("kavya-30");
  const [customLagna, setCustomLagna] = useState<number>(3);
  const [customYear, setCustomYear] = useState<number>(30);
  const [customRows, setCustomRows] = useState<ChartPoint[]>([
    { id: "su", name: "Sun", longitude: 110 },
    { id: "mo", name: "Moon", longitude: 15 },
    { id: "me", name: "Mercury", longitude: 118 },
    { id: "ma", name: "Mars", longitude: 200 },
  ]);

  const currentScenario = useMemo(
    () => CROSS_CHECK_SCENARIOS.find((s) => s.key === scenarioKey) ?? CROSS_CHECK_SCENARIOS[0],
    [scenarioKey]
  );

  const isCustomScenario = scenarioKey === "custom";

  const crossCheckLagna = isCustomScenario ? customLagna : currentScenario.natalLagnaIndex;
  const crossCheckYear = isCustomScenario ? customYear : currentScenario.yearN;
  const crossCheckPoints = isCustomScenario ? customRows : currentScenario.points;

  const activeYearN = startYearN;
  const activeHouse = useMemo(
    () => (useOldFormula ? munthaHouseOld(activeYearN) : munthaHouseCorrected(activeYearN)),
    [activeYearN, useOldFormula]
  );
  const activeSign = (natalLagna + activeHouse - 1 + 12) % 12;
  const oldHouseForComparison = useMemo(
    () => (useOldFormula ? munthaHouseCorrected(activeYearN) : munthaHouseOld(activeYearN)),
    [activeYearN, useOldFormula]
  );
  const oldSignForComparison = (natalLagna + oldHouseForComparison - 1 + 12) % 12;

  const trajectory = useMemo(() => {
    const items = [];
    for (let i = 0; i < yearCount; i += 1) {
      const n = startYearN + i;
      const house = munthaHouseCorrected(n);
      const sign = (natalLagna + house - 1 + 12) % 12;
      const isCycleReturn = n > 1 && house === 1;
      const isHouse12 = house === 12;
      items.push({ n, house, sign, isCycleReturn, isHouse12 });
    }
    return items;
  }, [startYearN, yearCount, natalLagna]);

  const crossCheckMunthaSign = (crossCheckLagna + munthaHouseCorrected(crossCheckYear) - 1 + 12) % 12;
  const crossCheckMatches = useMemo(() => {
    return crossCheckPoints.map((pt) => {
      const ptSign = signIndex(pt.longitude);
      return { ...pt, sign: ptSign, match: ptSign === crossCheckMunthaSign };
    });
  }, [crossCheckPoints, crossCheckMunthaSign]);

  const reset = () => {
    setNatalLagna(3);
    setStartYearN(28);
    setYearCount(10);
    setUseOldFormula(false);
    setScenarioKey("kavya-30");
    setCustomLagna(3);
    setCustomYear(30);
    setCustomRows([
      { id: "su", name: "Sun", longitude: 110 },
      { id: "mo", name: "Moon", longitude: 15 },
      { id: "me", name: "Mercury", longitude: 118 },
      { id: "ma", name: "Mars", longitude: 200 },
    ]);
  };

  const handleCustomRowChange = (id: string, longitude: number) => {
    setCustomRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, longitude } : row))
    );
  };

  const handleCustomNameChange = (id: string, name: string) => {
    setCustomRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, name } : row))
    );
  };

  const addCustomRow = () => {
    const id = `pt-${customRows.length + 1}`;
    setCustomRows((prev) => [...prev, { id, name: "Planet", longitude: 0 }]);
  };

  const removeCustomRow = (id: string) => {
    setCustomRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div data-interactive="tajika-muntha-concept-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 17 — Tājika year-point refinement</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Munthā progression rule revisited at depth
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The Munthā advances one whole sign per completed varṣa-year, starting from the natal Lagna in year 1.
              Use the corrected {""}
              <code style={{ fontFamily: "monospace", fontSize: "0.85em" }}>N mod 12</code> rule (0-remainder = 12th house)
              so cycle returns fall on 13, 25, 37…, not the off-by-one 12, 24, 36… trap.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Inputs + active chart */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Controls</p>
          <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.75rem" }}>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Natal Lagna sign</span>
              <select
                value={natalLagna}
                onChange={(e) => setNatalLagna(Number(e.target.value))}
                style={inputStyle}
              >
                {RASHI_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {idx + 1} — {name}
                  </option>
                ))}
              </select>
            </label>

            <div style={workbenchTwoColumnStyle as CSSProperties}>
              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Start year N</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={startYearN}
                  onChange={(e) => setStartYearN(clampInt(parseInt(e.target.value, 10), 1, 120))}
                  style={inputStyle}
                />
              </label>
              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Years to show</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={yearCount}
                  onChange={(e) => setYearCount(clampInt(parseInt(e.target.value, 10), 1, 30))}
                  style={inputStyle}
                />
              </label>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 0.6rem",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 6,
                cursor: "pointer",
                background: useOldFormula ? "rgba(162, 58, 30, 0.04)" : "rgba(47, 125, 85, 0.04)",
              }}
            >
              <input
                type="checkbox"
                checked={useOldFormula}
                onChange={(e) => setUseOldFormula(e.target.checked)}
                style={{ accentColor: useOldFormula ? VERMILION : GREEN }}
              />
              <span style={{ fontSize: "0.85rem", color: useOldFormula ? VERMILION : GREEN, fontWeight: 600 }}>
                Show off-by-one (old) formula for comparison
              </span>
            </label>

            <div style={{ ...cardStyle, background: "rgba(156, 122, 47, 0.04)", borderColor: HAIRLINE }}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Corrected rule:</strong>{" "}
                <code style={{ fontFamily: "monospace", fontSize: "0.9em" }}>
                  House = ((N − 1) mod 12) + 1
                </code>
                . Year 1 = Lagna, year 12 = 12th house, year 13 = back to Lagna.
              </p>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <p style={{ ...eyebrowStyle, margin: 0 }}>Active year N = {activeYearN}</p>
            <span style={{ fontSize: "0.78rem", color: INK_MUTED }}>
              Lagna = {RASHI_NAMES[natalLagna]}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "1rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="220" height="220" viewBox="0 0 200 200" role="img" aria-label="North Indian diamond chart showing Munthā house">
                <rect x="0" y="0" width="200" height="200" fill="none" stroke={HAIRLINE} strokeWidth="1.5" rx="4" />
                {Object.keys(HOUSE_PATHS).map((hStr) => {
                  const h = Number(hStr);
                  const pos = HOUSE_LABEL_POS[h];
                  const sign = (natalLagna + h - 1 + 12) % 12;
                  const isMuntha = h === activeHouse;
                  const isLagna = h === 1;
                  return (
                    <g key={h}>
                      <path
                        d={HOUSE_PATHS[h]}
                        fill={isMuntha ? `${GOLD}18` : isLagna ? `${BLUE}0C` : "none"}
                        stroke={isMuntha ? GOLD : isLagna ? BLUE : HAIRLINE}
                        strokeWidth={isMuntha ? 2.4 : 1.2}
                        style={{ transition: "all 250ms ease" }}
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 7}
                        fill={isMuntha ? GOLD : INK_MUTED}
                        fontSize="10"
                        fontWeight={isMuntha ? 700 : 500}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {sign + 1}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y + 7}
                        fill={isMuntha ? GOLD : INK_SECONDARY}
                        fontSize="7.5"
                        fontWeight={isMuntha ? 700 : 400}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {isMuntha ? "MUNTHA" : `H${h}`}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <p style={{ fontSize: "0.7rem", color: INK_MUTED, margin: "0.4rem 0 0", textAlign: "center" }}>
                Outer numbers = sign indexes. H1 is the center-top Lagna diamond.
              </p>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div style={{ ...cardStyle, borderColor: HAIRLINE, background: "rgba(156, 122, 47, 0.04)" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: ACCENT, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Computation
                </p>
                <p style={{ margin: "0.4rem 0 0", fontFamily: "monospace", fontSize: "0.95rem", color: INK_PRIMARY }}>
                  N = {activeYearN}; remainder = {activeYearN % 12 === 0 ? 0 : activeYearN % 12}
                </p>
                <p style={{ margin: "0.2rem 0 0", fontFamily: "monospace", fontSize: "1.05rem", color: GOLD, fontWeight: 600 }}>
                  → House {activeHouse} ({RASHI_NAMES[activeSign]})
                </p>
                {useOldFormula && (
                  <p style={{ margin: "0.35rem 0 0", fontSize: "0.78rem", color: VERMILION }}>
                    Old formula would give House {oldHouseForComparison} ({RASHI_NAMES[oldSignForComparison]}).
                  </p>
                )}
              </div>

              <div style={{ ...cardStyle, borderColor: HAIRLINE }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: ACCENT, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Theme — House {activeHouse}
                </p>
                <p style={{ margin: "0.4rem 0 0", fontSize: "0.9rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  {HOUSE_THEMES[activeHouse]}
                </p>
                {[6, 8, 12].includes(activeHouse) && (
                  <div
                    style={{
                      marginTop: "0.6rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.78rem",
                      color: AMBER,
                      fontWeight: 600,
                    }}
                  >
                    <ShieldAlert size={14} />
                    Challenging house — apply non-fatalism protocol.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Trajectory runner */}
      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Compass size={18} color={GOLD} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Multi-year trajectory runner</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: 560 }}>
            <thead>
              <tr style={{ color: INK_MUTED, textAlign: "left", borderBottom: `1px solid ${HAIRLINE}` }}>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Year N</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>N mod 12</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Munthā house</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Munthā sign</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Lord</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {trajectory.map((item) => {
                const rowStyle: CSSProperties = {
                  background: item.isCycleReturn
                    ? "rgba(47, 125, 85, 0.06)"
                    : item.isHouse12
                    ? "rgba(184, 132, 33, 0.06)"
                    : "transparent",
                };
                return (
                  <tr key={item.n} style={rowStyle}>
                    <td style={{ padding: "0.5rem", fontWeight: item.n === activeYearN ? 700 : 400, color: item.n === activeYearN ? GOLD : INK_PRIMARY }}>
                      {item.n}
                    </td>
                    <td style={{ padding: "0.5rem", color: INK_SECONDARY, fontFamily: "monospace" }}>
                      {item.n % 12 === 0 ? 0 : item.n % 12}
                    </td>
                    <td style={{ padding: "0.5rem", color: INK_PRIMARY }}>House {item.house}</td>
                    <td style={{ padding: "0.5rem", color: INK_PRIMARY }}>{RASHI_NAMES[item.sign]}</td>
                    <td style={{ padding: "0.5rem", color: INK_SECONDARY }}>{SIGN_LORDS[item.sign]}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {item.isCycleReturn ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: GREEN, fontWeight: 600, fontSize: "0.78rem" }}>
                          <Award size={13} />
                          Cycle return
                        </span>
                      ) : item.isHouse12 ? (
                        <span style={{ color: GOLD, fontWeight: 600, fontSize: "0.78rem" }}>12th-house close-out</span>
                      ) : (
                        <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>Progression</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ margin: "0.6rem 0 0", fontSize: "0.75rem", color: INK_MUTED }}>
          Cycle returns (green) occur when N mod 12 = 1: 13, 25, 37, 49, 61, 73, 85, 97.
          Years where N mod 12 = 0 (12, 24, 36…) place Munthā in the 12th house, one year before the return.
        </p>
      </section>

      {/* Cross-check panel */}
      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Layers size={18} color={GOLD} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Chart cross-check panel</p>
        </div>
        <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
          Given a varṣaphala chart, compute the Munthā sign and flag any planets sharing that sign.
          This catches the common mistake of conflating the Munthā house with its sign when planets are crowded nearby.
        </p>

        <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1rem" }}>
          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>Scenario</span>
            <select
              value={scenarioKey}
              onChange={(e) => setScenarioKey(e.target.value)}
              style={inputStyle}
            >
              {CROSS_CHECK_SCENARIOS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
              <option value="custom">Custom chart</option>
            </select>
          </label>

          {isCustomScenario && (
            <div style={workbenchTwoColumnStyle as CSSProperties}>
              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Custom natal Lagna</span>
                <select
                  value={customLagna}
                  onChange={(e) => setCustomLagna(Number(e.target.value))}
                  style={inputStyle}
                >
                  {RASHI_NAMES.map((name, idx) => (
                    <option key={name} value={idx}>
                      {idx + 1} — {name}
                    </option>
                  ))}
                </select>
              </label>
              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Custom year N</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={customYear}
                  onChange={(e) => setCustomYear(clampInt(parseInt(e.target.value, 10), 1, 120))}
                  style={inputStyle}
                />
              </label>
            </div>
          )}
        </div>

        <div
          style={{
            ...cardStyle,
            borderColor: HAIRLINE,
            background: "rgba(156, 122, 47, 0.04)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>
              Natal Lagna
            </p>
            <p style={{ margin: "0.15rem 0 0", fontWeight: 600, color: INK_PRIMARY }}>{RASHI_NAMES[crossCheckLagna]}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>
              Year N
            </p>
            <p style={{ margin: "0.15rem 0 0", fontWeight: 600, color: INK_PRIMARY }}>{crossCheckYear}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>
              Munthā house
            </p>
            <p style={{ margin: "0.15rem 0 0", fontWeight: 600, color: INK_PRIMARY }}>House {munthaHouseCorrected(crossCheckYear)}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>
              Munthā sign
            </p>
            <p style={{ margin: "0.15rem 0 0", fontWeight: 600, color: GOLD }}>{RASHI_NAMES[crossCheckMunthaSign]}</p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ color: INK_MUTED, textAlign: "left", borderBottom: `1px solid ${HAIRLINE}` }}>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Point</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Longitude</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Sign</th>
                <th style={{ padding: "0.45rem 0.5rem", fontWeight: 600 }}>Match?</th>
              </tr>
            </thead>
            <tbody>
              {crossCheckMatches.map((pt) => (
                <tr
                  key={pt.id}
                  style={{
                    background: pt.match ? "rgba(47, 125, 85, 0.06)" : "transparent",
                  }}
                >
                  <td style={{ padding: "0.5rem", color: INK_PRIMARY }}>
                    {isCustomScenario ? (
                      <input
                        type="text"
                        value={pt.name}
                        onChange={(e) => handleCustomNameChange(pt.id, e.target.value)}
                        style={{ ...inputStyle, minWidth: 90, padding: "0.25rem 0.4rem" }}
                      />
                    ) : (
                      pt.name
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", color: INK_SECONDARY, fontFamily: "monospace" }}>
                    {isCustomScenario ? (
                      <input
                        type="number"
                        step={0.01}
                        min={0}
                        max={360}
                        value={pt.longitude}
                        onChange={(e) =>
                          handleCustomRowChange(pt.id, clampNumber(parseFloat(e.target.value), 0, 360))
                        }
                        style={{ ...inputStyle, minWidth: 80, padding: "0.25rem 0.4rem" }}
                      />
                    ) : (
                      formatDms(pt.longitude)
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", color: INK_PRIMARY }}>{RASHI_NAMES[pt.sign]}</td>
                  <td style={{ padding: "0.5rem" }}>
                    {pt.match ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: GREEN, fontWeight: 600, fontSize: "0.78rem" }}>
                        <CheckCircle2 size={13} />
                        In Munthā sign
                      </span>
                    ) : (
                      <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isCustomScenario && (
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button type="button" onClick={addCustomRow} style={buttonStyle(false, ACCENT)}>
              Add point
            </button>
            {customRows.length > 1 && (
              <button
                type="button"
                onClick={() => removeCustomRow(customRows[customRows.length - 1].id)}
                style={buttonStyle(false, VERMILION)}
              >
                Remove last
              </button>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 0.9rem",
            borderRadius: 6,
            border: `1px solid ${HAIRLINE}`,
            background: "rgba(156, 122, 47, 0.04)",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            <ChevronRight size={14} style={{ verticalAlign: "text-bottom", marginRight: "0.25rem" }} />
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Interpretation guard:</strong> planets in the Munthā sign
            colour the year-theme, but they do not replace it. Always state the house-domain first, then note the planetary accents,
            and keep the statement non-fatalistic.
          </p>
        </div>
      </section>
    </div>
  );
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/* ─────────────── Styles ─────────────── */

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "0.3rem",
};

const fieldLabelStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const inputStyle: CSSProperties = {
  padding: "0.5rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "#ffffff",
  color: INK_PRIMARY,
  fontSize: "0.9rem",
  fontWeight: 500,
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
