"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Award,
  Compass,
  Eye,
  Info,
  Layers,
  MapPinned,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const AMBER = "#D97706";

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
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const PLANET_COLORS: Record<string, string> = {
  Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Mercury: GREEN, Jupiter: GOLD, Venus: GREEN, Saturn: PURPLE,
};

const ORBS: Record<string, number> = {
  Sun: 15, Moon: 12, Mars: 8, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 9,
};

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

const DIGNITY_DATA: Record<string, { own: number[]; exalt: number; debil: number }> = {
  Sun: { own: [4], exalt: 0, debil: 6 },
  Moon: { own: [3], exalt: 1, debil: 7 },
  Mercury: { own: [2, 5], exalt: 5, debil: 11 },
  Venus: { own: [1, 6], exalt: 11, debil: 5 },
  Mars: { own: [0, 7], exalt: 9, debil: 3 },
  Jupiter: { own: [8, 11], exalt: 3, debil: 9 },
  Saturn: { own: [9, 10], exalt: 6, debil: 0 },
  Rahu: { own: [], exalt: 5, debil: 11 },
  Ketu: { own: [], exalt: 11, debil: 5 },
};

interface YearPoint {
  planet: string;
  longitude: number;
}

interface ChartSet {
  key: string;
  label: string;
  natalLagnaIndex: number;
  varshaLagnaLongitude: number;
  yearN: number;
  dayBirth: boolean;
  natalOccupants: string[];
  yearPoints: YearPoint[];
  stipulatedVarshesha?: string;
  notes?: string;
}

const KAVYA_CHART: ChartSet = {
  key: "kavya",
  label: "Kavya — year 30",
  natalLagnaIndex: 3,
  varshaLagnaLongitude: 280,
  yearN: 30,
  dayBirth: true,
  natalOccupants: ["Moon", "Ketu"],
  yearPoints: [
    { planet: "Sun", longitude: 110 },
    { planet: "Moon", longitude: 200 },
    { planet: "Saturn", longitude: 302 },
    { planet: "Jupiter", longitude: 350 },
    { planet: "Venus", longitude: 95 },
  ],
  stipulatedVarshesha: "Venus",
  notes: "Two qualifiers (Sun, Venus) and Jupiter misses by exactly 1°. Final tie-break is stipulated.",
};

const MEERA_CHART: ChartSet = {
  key: "meera",
  label: "Meera — year 25",
  natalLagnaIndex: 6,
  varshaLagnaLongitude: 320,
  yearN: 25,
  dayBirth: false,
  natalOccupants: [],
  yearPoints: [
    { planet: "Venus", longitude: 290 },
    { planet: "Saturn", longitude: 140 },
    { planet: "Mercury", longitude: 265 },
    { planet: "Moon", longitude: 80 },
  ],
  notes: "Office overlap: Venus holds Janma-Lagneśa and Munthā-pati. Three qualifiers; final tie-break deliberately left open.",
};

const DEFAULT_CUSTOM: ChartSet = {
  key: "custom",
  label: "Custom chart",
  natalLagnaIndex: 3,
  varshaLagnaLongitude: 280,
  yearN: 30,
  dayBirth: true,
  natalOccupants: ["Moon", "Ketu"],
  yearPoints: [
    { planet: "Sun", longitude: 110 },
    { planet: "Moon", longitude: 200 },
    { planet: "Saturn", longitude: 302 },
    { planet: "Jupiter", longitude: 350 },
    { planet: "Venus", longitude: 95 },
  ],
};

const ASPECT_ANGLES = [0, 60, 90, 120, 180];
const ALL_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

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

function munthaHouse(yearN: number): number {
  if (yearN <= 0) return 1;
  return ((yearN - 1) % 12) + 1;
}

function lordForSign(signIndex: number): string {
  return SIGN_LORDS[signIndex];
}

function triRasiPati(varsaSignIndex: number, dayBirth: boolean): string {
  const element = varsaSignIndex % 4; // 0 fire, 1 earth, 2 air, 3 water
  if (dayBirth) {
    if (element === 0) return "Sun";
    if (element === 1) return "Venus";
    if (element === 2) return "Saturn";
    return "Mars";
  }
  if (element === 0) return "Jupiter";
  if (element === 1) return "Moon";
  if (element === 2) return "Mercury";
  return "Venus";
}

function dinaRatriPati(dayBirth: boolean): string {
  return dayBirth ? "Sun" : "Moon";
}

function classifyDignity(planet: string, sign: number): { label: string; color: string; description: string } {
  const data = DIGNITY_DATA[planet];
  if (!data) return { label: "Neutral", color: INK_MUTED, description: "No strong dignity classification in this simplified model." };
  if (data.own.includes(sign)) return { label: "Own sign", color: GREEN, description: "The planet is in one of its own signs; it has steady resources to carry the theme." };
  if (data.exalt === sign) return { label: "Exalted", color: GREEN, description: "The planet is exalted; its supportive capacity is heightened." };
  if (data.debil === sign) return { label: "Debilitated", color: VERMILION, description: "The planet is debilitated; support for the theme is strained." };
  return { label: "Neutral", color: INK_MUTED, description: "The planet is in a sign where it is neither especially strong nor weak." };
}

function smallestSeparation(a: number, b: number): number {
  const diff = Math.abs(normalizeDeg(a) - normalizeDeg(b));
  return diff > 180 ? 360 - diff : diff;
}

function nearestAspect(separation: number): { angle: number; diff: number } {
  let best = ASPECT_ANGLES[0];
  let bestDiff = Math.abs(separation - best);
  for (const angle of ASPECT_ANGLES) {
    const diff = Math.abs(separation - angle);
    if (diff < bestDiff) {
      best = angle;
      bestDiff = diff;
    }
  }
  return { angle: best, diff: bestDiff };
}

interface Candidate {
  office: string;
  planet: string;
  basis: string;
  longitude: number;
}

function getCandidates(chart: ChartSet): Candidate[] {
  const munthaSign = (chart.natalLagnaIndex + munthaHouse(chart.yearN) - 1 + 12) % 12;
  const varsaSign = signIndex(chart.varshaLagnaLongitude);
  const point = (planet: string) => chart.yearPoints.find((p) => p.planet === planet)?.longitude ?? 0;
  return [
    { office: "Janma-Lagneśa", planet: lordForSign(chart.natalLagnaIndex), basis: "Lord of natal Lagna", longitude: point(lordForSign(chart.natalLagnaIndex)) },
    { office: "Varṣa-Lagneśa", planet: lordForSign(varsaSign), basis: "Lord of varṣa Lagna", longitude: point(lordForSign(varsaSign)) },
    { office: "Munthā-pati", planet: lordForSign(munthaSign), basis: "Lord of munthā sign", longitude: point(lordForSign(munthaSign)) },
    { office: "Tri-Rāśi-pati", planet: triRasiPati(varsaSign, chart.dayBirth), basis: `${["Fire", "Earth", "Air", "Water"][varsaSign % 4]}-triplicity ${chart.dayBirth ? "day" : "night"}-ruler`, longitude: point(triRasiPati(varsaSign, chart.dayBirth)) },
    { office: "Dina-Rātri-pati", planet: dinaRatriPati(chart.dayBirth), basis: `${chart.dayBirth ? "Day" : "Night"}-birth luminary`, longitude: point(dinaRatriPati(chart.dayBirth)) },
  ];
}

function evaluateCandidate(candidate: Candidate, lagnaLongitude: number) {
  const separation = smallestSeparation(candidate.longitude, lagnaLongitude);
  const { angle, diff } = nearestAspect(separation);
  const orb = ORBS[candidate.planet] ?? 7;
  const qualifies = diff <= orb;
  return { separation, nearestAspect: angle, diff, orb, qualifies };
}

function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function MunthaVarsheshaWorkbench() {
  const [preset, setPreset] = useState<"kavya" | "meera" | "compare" | "custom">("kavya");
  const [customChart, setCustomChart] = useState<ChartSet>(DEFAULT_CUSTOM);
  const [showNatalLayer, setShowNatalLayer] = useState(true);
  const [showLordLayer, setShowLordLayer] = useState(true);
  const [showOrbArcs, setShowOrbArcs] = useState(true);

  const baseChart = preset === "custom" ? customChart : preset === "meera" ? MEERA_CHART : KAVYA_CHART;

  const munthaHouseNum = munthaHouse(baseChart.yearN);
  const munthaSignIndex = (baseChart.natalLagnaIndex + munthaHouseNum - 1 + 12) % 12;
  const munthaLord = lordForSign(munthaSignIndex);
  const varsaSignIndex = signIndex(baseChart.varshaLagnaLongitude);

  const lordYearPoint = baseChart.yearPoints.find((p) => p.planet === munthaLord);
  const lordSignIndex = lordYearPoint ? signIndex(lordYearPoint.longitude) : -1;
  const lordHouseFromVarsha = lordSignIndex >= 0 ? (lordSignIndex - varsaSignIndex + 12) % 12 + 1 : 0;
  const lordDignity = lordYearPoint ? classifyDignity(munthaLord, lordSignIndex) : null;

  const candidates = useMemo(() => getCandidates(baseChart), [baseChart]);
  const evaluated = useMemo(
    () => candidates.map((c) => ({ ...c, ...evaluateCandidate(c, baseChart.varshaLagnaLongitude) })),
    [candidates, baseChart.varshaLagnaLongitude]
  );
  const qualifiers = evaluated.filter((e) => e.qualifies);

  const isMunthaLagna = munthaHouseNum === 1;

  const reset = () => {
    setPreset("kavya");
    setCustomChart(DEFAULT_CUSTOM);
    setShowNatalLayer(true);
    setShowLordLayer(true);
    setShowOrbArcs(true);
  };

  const setCustomField = <K extends keyof ChartSet>(field: K, value: ChartSet[K]) => {
    setCustomChart((prev) => ({ ...prev, [field]: value }));
  };

  const setCustomYearPoint = (planet: string, longitude: number) => {
    setCustomChart((prev) => ({
      ...prev,
      yearPoints: prev.yearPoints.map((p) => (p.planet === planet ? { ...p, longitude } : p)),
    }));
  };

  return (
    <div data-interactive="muntha-varshesha-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Munthā + Varṣeśa worked example</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Run the full four-step workflow end-to-end
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Consolidate munthā computation, natal cross-reference, munthā-lord dignity, five-office Varṣeśa selection,
              and year-character integration. Compare Kavya&apos;s and Meera&apos;s genuinely different outcomes.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Preset selector */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Chart preset</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.6rem" }}>
          {[
            { key: "kavya", label: "Kavya year 30" },
            { key: "meera", label: "Meera year 25" },
            { key: "compare", label: "Compare both" },
            { key: "custom", label: "Build your own" },
          ].map((p) => (
            <button key={p.key} type="button" aria-pressed={preset === p.key} onClick={() => setPreset(p.key as typeof preset)} style={smallChipStyle(preset === p.key, GOLD)}>
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {preset === "compare" ? (
        <CompareView />
      ) : (
        <>
          {preset === "custom" && (
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Custom inputs</p>
              <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.6rem" }}>
                <div style={workbenchTwoColumnStyle}>
                  <label style={fieldStyle}>
                    <span style={fieldLabelStyle}>Natal Lagna sign</span>
                    <select value={customChart.natalLagnaIndex} onChange={(e) => setCustomField("natalLagnaIndex", Number(e.target.value))} style={inputStyle}>
                      {RASHI_NAMES.map((name, idx) => (
                        <option key={name} value={idx}>{idx + 1} — {name}</option>
                      ))}
                    </select>
                  </label>
                  <label style={fieldStyle}>
                    <span style={fieldLabelStyle}>Varṣa Lagna sign</span>
                    <select value={signIndex(customChart.varshaLagnaLongitude)} onChange={(e) => setCustomField("varshaLagnaLongitude", Number(e.target.value) * 30)} style={inputStyle}>
                      {RASHI_NAMES.map((name, idx) => (
                        <option key={name} value={idx}>{idx + 1} — {name}</option>
                      ))}
                    </select>
                  </label>
                  <label style={fieldStyle}>
                    <span style={fieldLabelStyle}>Target year N</span>
                    <input type="number" min={1} max={120} value={customChart.yearN} onChange={(e) => setCustomField("yearN", clampInt(parseInt(e.target.value, 10), 1, 120))} style={inputStyle} />
                  </label>
                  <label style={fieldStyle}>
                    <span style={fieldLabelStyle}>Birth time</span>
                    <select value={customChart.dayBirth ? "day" : "night"} onChange={(e) => setCustomField("dayBirth", e.target.value === "day")} style={inputStyle}>
                      <option value="day">Day birth</option>
                      <option value="night">Night birth</option>
                    </select>
                  </label>
                </div>

                <div>
                  <span style={fieldLabelStyle}>Natal occupants of munthā sign</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.35rem" }}>
                    {ALL_PLANETS.map((planet) => {
                      const active = customChart.natalOccupants.includes(planet);
                      return (
                        <button key={planet} type="button" aria-pressed={active} onClick={() => {
                          setCustomChart((prev) => ({
                            ...prev,
                            natalOccupants: active ? prev.natalOccupants.filter((p) => p !== planet) : [...prev.natalOccupants, planet],
                          }));
                        }} style={smallChipStyle(active, BLUE)}>
                          {planet}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span style={fieldLabelStyle}>Office-holder longitudes in year chart</span>
                  <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.35rem" }}>
                    {getCandidates(customChart).map((c) => (
                      <label key={c.office} style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>{c.office} — {c.planet}</span>
                        <input type="number" min={0} max={360} step={0.1} value={c.longitude} onChange={(e) => setCustomYearPoint(c.planet, clampNumber(parseFloat(e.target.value), 0, 360))} style={inputStyle} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Step 1: Muntha */}
          <div style={workbenchDiagramLayoutStyle}>
            <section style={{ ...cardStyle, flex: "2 1 460px" }}>
              <p style={eyebrowStyle}>Step 1 — Munthā computation</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
                <MiniFact icon={<Compass size={16} />} title="Year N" body={String(baseChart.yearN)} color={GOLD} />
                <MiniFact icon={<MapPinned size={16} />} title="Munthā house" body={`House ${munthaHouseNum}`} color={GOLD} />
                <MiniFact icon={<Sparkles size={16} />} title="Munthā sign" body={RASHI_NAMES[munthaSignIndex]} color={GOLD} />
                <MiniFact icon={<Scale size={16} />} title="Munthā lord" body={munthaLord} color={GOLD} />
              </div>
              <div style={{ marginTop: "0.85rem", padding: "0.65rem 0.8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "rgba(156, 122, 47, 0.04)" }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{HOUSE_THEMES[munthaHouseNum]}</p>
              </div>
            </section>

            <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
              <Panel title="Layer switches" icon={<Layers size={18} />} color={BLUE}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button type="button" aria-pressed={showNatalLayer} onClick={() => setShowNatalLayer((v) => !v)} style={smallChipStyle(showNatalLayer, BLUE)}>
                    Natal cross-ref
                  </button>
                  <button type="button" aria-pressed={showLordLayer} onClick={() => setShowLordLayer((v) => !v)} style={smallChipStyle(showLordLayer, GREEN)}>
                    Lord condition
                  </button>
                </div>
              </Panel>
            </section>
          </div>

          {/* Step 2: Natal cross-reference */}
          {showNatalLayer && (
            <section style={{ ...cardStyle, borderColor: `${BLUE}66`, background: `${BLUE}0A` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Layers size={18} color={BLUE} />
                <p style={{ ...eyebrowStyle, margin: 0, color: BLUE }}>Step 2 — Natal cross-reference</p>
              </div>
              {isMunthaLagna ? (
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                  The munthā-house is the natal Lagna itself this year. The cross-reference is trivial: the year&apos;s domain-theme is anchored to the native&apos;s own first-house identity and physical focus.
                </p>
              ) : baseChart.natalOccupants.length > 0 ? (
                <>
                  <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                    {RASHI_NAMES[munthaSignIndex]} is natally occupied, giving the year-theme pre-existing weight.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {baseChart.natalOccupants.map((p) => (
                      <span key={p} style={{ padding: "0.35rem 0.65rem", borderRadius: 999, border: `1px solid ${PLANET_COLORS[p] ?? HAIRLINE}`, background: `${PLANET_COLORS[p] ?? HAIRLINE}12`, color: PLANET_COLORS[p] ?? INK_PRIMARY, fontWeight: 600, fontSize: "0.82rem" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                  {RASHI_NAMES[munthaSignIndex]} is natally empty this year. The year-theme is a more purely transient foreground shift.
                </p>
              )}
            </section>
          )}

          {/* Step 3: Muntha-lord condition */}
          {showLordLayer && lordDignity && (
            <section style={{ ...cardStyle, borderColor: `${GREEN}66`, background: `${GREEN}0A` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Scale size={18} color={GREEN} />
                <p style={{ ...eyebrowStyle, margin: 0, color: GREEN }}>Step 3 — Munthā-lord condition</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "0.65rem" }}>
                <MiniFact icon={<MapPinned size={16} />} title="Planet" body={munthaLord} color={GREEN} />
                <MiniFact icon={<Sparkles size={16} />} title="Year sign" body={RASHI_NAMES[lordSignIndex]} color={lordDignity.color} />
                <MiniFact icon={<Compass size={16} />} title="Year house" body={`House ${lordHouseFromVarsha}`} color={GREEN} />
                <MiniFact icon={<Scale size={16} />} title="Dignity" body={lordDignity.label} color={lordDignity.color} />
              </div>
              <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{lordDignity.description}</p>
            </section>
          )}

          {/* Step 4: Varṣeśa selection */}
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Step 4 — Varṣeśa selection</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "0.6rem 0 0.75rem" }}>
              <button type="button" aria-pressed={showOrbArcs} onClick={() => setShowOrbArcs((v) => !v)} style={smallChipStyle(showOrbArcs, BLUE)}>
                <Eye size={14} />
                Orb arcs
              </button>
            </div>

            <div style={workbenchDiagramLayoutStyle}>
              <section style={{ ...cardStyle, flex: "2 1 460px", border: `1px solid ${HAIRLINE}` }}>
                <AspectDial evaluated={evaluated} lagnaLongitude={baseChart.varshaLagnaLongitude} showOrbArcs={showOrbArcs} />
              </section>

              <section style={{ display: "grid", gap: "0.75rem", flex: "1 1 280px" }}>
                {evaluated.map((e) => {
                  const overlapCount = candidates.filter((c) => c.planet === e.planet).length;
                  return (
                    <div key={e.planet + e.office} style={{ padding: "0.65rem 0.8rem", border: `1px solid ${e.qualifies ? GREEN : HAIRLINE}`, borderRadius: 6, background: e.qualifies ? "rgba(47, 125, 85, 0.06)" : "transparent" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, color: PLANET_COLORS[e.planet] ?? INK_PRIMARY }}>{e.planet}</span>
                        {overlapCount > 1 && <span style={{ fontSize: "0.7rem", color: AMBER, fontWeight: 600 }}>Holds {overlapCount} offices</span>}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: INK_MUTED }}>{e.office}</div>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem", fontSize: "0.78rem" }}>
                        <span style={{ color: INK_SECONDARY }}>sep {e.separation.toFixed(1)}°</span>
                        <span style={{ color: INK_SECONDARY }}>aspect {e.nearestAspect}°</span>
                        <span style={{ color: e.qualifies ? GREEN : INK_MUTED, fontWeight: 600 }}>{e.qualifies ? "Qualifies" : "No"}</span>
                      </div>
                    </div>
                  );
                })}
              </section>
            </div>

            {/* Varṣeśa result */}
            <div style={{ marginTop: "1rem", padding: "0.85rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "rgba(156, 122, 47, 0.04)" }}>
              {baseChart.stipulatedVarshesha ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", alignItems: "center" }}>
                  <span style={{ color: INK_SECONDARY }}>Stipulated Varṣeśa:</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.75rem", borderRadius: 999, border: `1px solid ${GREEN}`, background: `${GREEN}12`, color: GREEN, fontWeight: 600 }}>
                    <Award size={14} />
                    {baseChart.stipulatedVarshesha}
                  </span>
                  <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{baseChart.notes}</span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <Info size={18} color={PURPLE} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                    <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Open tie-break.</strong>{" "}
                    {qualifiers.length} candidates qualify. Exact Pañcavargīya-bala point-values are not independently verifiable,
                    so this case is deliberately left open rather than stipulated.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Year-character integration */}
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Sparkles size={18} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Year-character integration</p>
            </div>
            <div style={workbenchTwoColumnStyle}>
              <MiniFact icon={<Award size={16} />} title="Varṣeśa tone" body={baseChart.stipulatedVarshesha ? `${baseChart.stipulatedVarshesha} carries its natural year-tone.` : "Open: multiple qualifiers; tone depends on final Varṣeśa."} color={GREEN} />
              <MiniFact icon={<MapPinned size={16} />} title="Munthā domain" body={`House ${munthaHouseNum} — ${HOUSE_THEMES[munthaHouseNum].split(":")[0]}`} color={GOLD} />
              <div style={{ gridColumn: "1 / -1", padding: "0.75rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "rgba(156, 122, 47, 0.04)" }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Integrated reading:</strong>{" "}
                  {baseChart.notes}
                </p>
              </div>
            </div>
          </section>

          {/* Scope marker */}
          <section style={{ ...cardStyle, borderColor: `${PURPLE}66`, background: `${PURPLE}0A` }}>
            <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
              <ShieldAlert size={18} color={PURPLE} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
              <div>
                <p style={{ margin: 0, color: PURPLE, fontWeight: 600 }}>What this chapter does not yet establish</p>
                <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  After this workflow the chart has munthā, natal cross-reference, munthā-lord dignity, and Varṣeśa analysis up to the honest limit of the point-value gap. It does not yet include Sahams, the 16 Tājika yogas, or māsika/dinika breakdowns — those come in Chapters 3 and 4.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ─────────────── Compare view ─────────────── */

function CompareView() {
  const kavyaMuntha = munthaHouse(KAVYA_CHART.yearN);
  const kavyaSign = (KAVYA_CHART.natalLagnaIndex + kavyaMuntha - 1 + 12) % 12;
  const kavyaCandidates = getCandidates(KAVYA_CHART);
  const kavyaEval = kavyaCandidates.map((c) => ({ ...c, ...evaluateCandidate(c, KAVYA_CHART.varshaLagnaLongitude) }));

  const meeraMuntha = munthaHouse(MEERA_CHART.yearN);
  const meeraSign = (MEERA_CHART.natalLagnaIndex + meeraMuntha - 1 + 12) % 12;
  const meeraCandidates = getCandidates(MEERA_CHART);
  const meeraEval = meeraCandidates.map((c) => ({ ...c, ...evaluateCandidate(c, MEERA_CHART.varshaLagnaLongitude) }));

  const rows = [
    { label: "Natal Lagna", kavya: RASHI_NAMES[KAVYA_CHART.natalLagnaIndex], meera: RASHI_NAMES[MEERA_CHART.natalLagnaIndex] },
    { label: "Varṣa Lagna", kavya: RASHI_NAMES[signIndex(KAVYA_CHART.varshaLagnaLongitude)], meera: RASHI_NAMES[signIndex(MEERA_CHART.varshaLagnaLongitude)] },
    { label: "Munthā house", kavya: `House ${kavyaMuntha}`, meera: `House ${meeraMuntha}` },
    { label: "Munthā sign", kavya: RASHI_NAMES[kavyaSign], meera: RASHI_NAMES[meeraSign] },
    { label: "Munthā lord", kavya: lordForSign(kavyaSign), meera: lordForSign(meeraSign) },
    { label: "Office overlap", kavya: "None", meera: "Venus holds Janma-Lagneśa + Munthā-pati" },
    { label: "Aspect qualifiers", kavya: `${kavyaEval.filter((e) => e.qualifies).length} (Sun, Venus)`, meera: `${meeraEval.filter((e) => e.qualifies).length} (Saturn, Mercury, Moon)` },
    { label: "Exact aspects", kavya: "None", meera: "Saturn 180°, Moon 120°" },
    { label: "Varṣeśa result", kavya: "Venus (stipulated)", meera: "Deliberately open" },
  ];

  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Compare Kavya and Meera</p>
      <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", minWidth: 520 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: 600, color: INK_MUTED }}>Dimension</th>
              <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: 600, color: GOLD }}>Kavya year 30</th>
              <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: 600, color: BLUE }}>Meera year 25</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td style={{ padding: "0.55rem 0.5rem", color: INK_PRIMARY, fontWeight: 600 }}>{row.label}</td>
                <td style={{ padding: "0.55rem 0.5rem", color: INK_SECONDARY }}>{row.kavya}</td>
                <td style={{ padding: "0.55rem 0.5rem", color: INK_SECONDARY }}>{row.meera}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
        The same four-step workflow produces genuinely different patterns on two independent charts. Kavya&apos;s chart shows a near-miss and a stipulated tie-break; Meera&apos;s shows an office-overlap and a three-qualifier open tie-break.
      </p>
    </section>
  );
}

/* ─────────────── Aspect Dial SVG ─────────────── */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function AspectDial({ evaluated, lagnaLongitude, showOrbArcs }: { evaluated: Array<ReturnType<typeof evaluateCandidate> & Candidate>; lagnaLongitude: number; showOrbArcs: boolean }) {
  const cx = 200;
  const cy = 200;
  const outerR = 140;
  const innerR = 58;

  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Aspect qualification dial around varsha lagna" style={{ width: "100%", maxHeight: 380, display: "block" }}>
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR} fill={`${GOLD}0A`} stroke={HAIRLINE} strokeWidth="1.2" />
      {[0, 60, 90, 120, 180, 240, 270, 300].map((angle) => {
        const pos = polarToCartesian(cx, cy, outerR, angle);
        return <line key={angle} x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={HAIRLINE} strokeWidth="1" strokeDasharray="4 4" />;
      })}
      {showOrbArcs &&
        evaluated.map((e, idx) => {
          const radius = innerR + ((outerR - innerR) * (0.3 + (idx % 5) * 0.15));
          const arcPath = describeArc(cx, cy, radius, e.nearestAspect - e.orb, e.nearestAspect + e.orb);
          const color = e.qualifies ? GREEN : e.planet === "Jupiter" ? AMBER : INK_MUTED;
          return <path key={`orb-${e.planet}`} d={arcPath} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity={0.35} />;
        })}
      {evaluated.map((e, index) => {
        const radius = innerR + ((outerR - innerR) * (0.35 + (index % 5) * 0.12));
        const pos = polarToCartesian(cx, cy, radius, e.separation);
        const color = e.qualifies ? GREEN : e.planet === "Jupiter" ? AMBER : INK_MUTED;
        return (
          <g key={e.planet}>
            <circle cx={pos.x} cy={pos.y} r={9} fill={color} stroke="#fff" strokeWidth="2" />
            <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="#fff" fontSize="8" fontWeight={600}>
              {e.planet.slice(0, 2)}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={16} fill={BLUE} stroke="#fff" strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="8" fontWeight={600}>VL</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>
        {formatDms(lagnaLongitude)} {RASHI_NAMES[signIndex(lagnaLongitude)]}
      </text>
      <g transform="translate(16, 340)">
        <circle cx="6" cy="6" r={6} fill={GREEN} />
        <text x="18" y="9" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>Qualifies</text>
        <circle cx="84" cy="6" r={6} fill={AMBER} />
        <text x="96" y="9" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>Near-miss</text>
        <circle cx="168" cy="6" r={6} fill={INK_MUTED} />
        <text x="180" y="9" fill={INK_SECONDARY} fontSize="10" fontWeight={500}>No aspect</text>
      </g>
    </svg>
  );
}

/* ─────────────── Shared helpers ─────────────── */

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 999,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.82rem",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}
