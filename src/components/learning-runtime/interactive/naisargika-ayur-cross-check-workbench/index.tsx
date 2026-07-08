"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type PrimarySeat = "lagna" | "sun" | "moon";

interface PlanetDef {
  key: PlanetKey;
  label: string;
  pindaYears: number;
  naisargikaYears: number;
  exaltDeg: number;
  combustionOrb: number;
  krura: boolean;
  color: string;
}

const PLANETS: PlanetDef[] = [
  { key: "sun", label: "Sun", pindaYears: 19, naisargikaYears: 20, exaltDeg: 10, combustionOrb: 15, krura: true, color: VERMILION },
  { key: "moon", label: "Moon", pindaYears: 25, naisargikaYears: 1, exaltDeg: 33, combustionOrb: 12, krura: false, color: BLUE },
  { key: "mars", label: "Mars", pindaYears: 15, naisargikaYears: 2, exaltDeg: 298, combustionOrb: 17, krura: true, color: VERMILION },
  { key: "mercury", label: "Mercury", pindaYears: 12, naisargikaYears: 9, exaltDeg: 165, combustionOrb: 14, krura: false, color: GREEN },
  { key: "jupiter", label: "Jupiter", pindaYears: 15, naisargikaYears: 18, exaltDeg: 95, combustionOrb: 11, krura: false, color: GREEN },
  { key: "venus", label: "Venus", pindaYears: 21, naisargikaYears: 20, exaltDeg: 357, combustionOrb: 10, krura: false, color: GOLD },
  { key: "saturn", label: "Saturn", pindaYears: 20, naisargikaYears: 50, exaltDeg: 200, combustionOrb: 15, krura: true, color: PURPLE },
];

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORDS: Record<number, PlanetKey> = {
  0: "mars", 1: "venus", 2: "mercury", 3: "moon", 4: "sun", 5: "mercury",
  6: "venus", 7: "mars", 8: "jupiter", 9: "saturn", 10: "saturn", 11: "jupiter",
};

const ENEMIES: Record<PlanetKey, PlanetKey[]> = {
  sun: ["saturn", "venus"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
};

const OWN_SIGNS: Record<PlanetKey, number[]> = {
  sun: [5],
  moon: [3],
  mars: [0, 7],
  mercury: [2, 5],
  jupiter: [8, 11],
  venus: [1, 6],
  saturn: [9, 10],
};

const CAKRA_FACTORS: Record<number, { krura: number; subha: number }> = {
  7: { krura: 5 / 6, subha: 11 / 12 },
  8: { krura: 4 / 5, subha: 9 / 10 },
  9: { krura: 3 / 4, subha: 7 / 8 },
  10: { krura: 2 / 3, subha: 5 / 6 },
  11: { krura: 1 / 2, subha: 3 / 4 },
  12: { krura: 0, subha: 1 / 2 },
};

interface PlanetInput {
  sign: number;
  deg: number;
  min: number;
  retrograde: boolean;
}

interface LagnaInput {
  sign: number;
  deg: number;
  min: number;
}

const DEFAULT_LAGNA: LagnaInput = { sign: 2, deg: 14, min: 20 };

const DEFAULT_PLANETS: Record<PlanetKey, PlanetInput> = {
  sun: { sign: 2, deg: 12, min: 0, retrograde: false },
  moon: { sign: 3, deg: 15, min: 0, retrograde: false },
  mars: { sign: 2, deg: 20, min: 0, retrograde: false },
  mercury: { sign: 10, deg: 10, min: 0, retrograde: false },
  jupiter: { sign: 3, deg: 8, min: 0, retrograde: false },
  venus: { sign: 4, deg: 5, min: 0, retrograde: false },
  saturn: { sign: 0, deg: 18, min: 0, retrograde: false },
};

const MISTAKES = [
  {
    label: "Treating Naisargikāyu as an entirely new procedure",
    wrong: "Re-deriving the arc formula and haranas from scratch for Naisargikāyu.",
    right: "Naisargikāyu reuses Piṇḍāyu's exact machinery — only the base-year table changes.",
  },
  {
    label: "Post-hoc averaging when methods disagree",
    wrong: "Averaging three divergent results as a tidy resolution.",
    right: "Distinguish the genuine structural averaging rule from ad hoc post-hoc averaging, which has no classical basis.",
  },
  {
    label: "Quietly favouring the most convenient number",
    wrong: "Gravitating toward whichever result is most reassuring.",
    right: "Report divergence honestly and trust the classically-selected method on its own structural grounds.",
  },
];

function toAbs(input: { sign: number; deg: number; min: number }) {
  return input.sign * 30 + input.deg + input.min / 60;
}

function mod360(value: number) {
  let v = value % 360;
  if (v < 0) v += 360;
  return v;
}

function effectiveArc(rawArc: number) {
  return rawArc < 180 ? 360 - rawArc : rawArc;
}

function arcDistance(a: number, b: number) {
  const diff = Math.abs(a - b);
  return Math.min(diff, 360 - diff);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatYMD(solarYears: number) {
  const years = Math.floor(solarYears);
  const remainingDays = (solarYears - years) * 365;
  const daysPerMonth = 365 / 12;
  const months = Math.floor(remainingDays / daysPerMonth);
  const days = Math.round(remainingDays - months * daysPerMonth);
  return `${years}y ${months}m ${days}d`;
}

interface MethodResult {
  solar: number;
  savana: number;
}

function computePinda(lagna: LagnaInput, planets: Record<PlanetKey, PlanetInput>): MethodResult {
  const sunAbs = toAbs(planets.sun);
  const lagnaMinutes = lagna.deg * 60 + lagna.min;

  const baseRows = PLANETS.map((planet) => {
    const abs = toAbs(planets[planet.key]);
    const raw = mod360(abs - planet.exaltDeg);
    const eff = effectiveArc(raw);
    const base = planet.pindaYears * (eff / 360);
    const house = ((planets[planet.key].sign - lagna.sign + 12) % 12) + 1;
    return { planet, abs, base, house };
  });

  const houseMaxBase: Record<number, number> = {};
  baseRows.forEach(({ house, base }) => {
    if (house >= 7 && house <= 12) houseMaxBase[house] = Math.max(houseMaxBase[house] ?? 0, base);
  });

  let subtotal = 0;
  baseRows.forEach(({ planet, abs, base, house }) => {
    const input = planets[planet.key];
    const lord = SIGN_LORDS[input.sign];
    const satru = ENEMIES[planet.key].includes(lord) && !input.retrograde;
    const asta = planet.key !== "sun" && planet.key !== "venus" && planet.key !== "saturn" && arcDistance(abs, sunAbs) <= planet.combustionOrb;
    const cakraHouse = house >= 7 && house <= 12;
    const strongest = cakraHouse && base >= (houseMaxBase[house] ?? 0) - 1e-9;
    const cakraFactor = cakraHouse && strongest ? (planet.krura ? CAKRA_FACTORS[house].krura : CAKRA_FACTORS[house].subha) : 1;
    subtotal += base * (satru ? 2 / 3 : 1) * (asta ? 1 / 2 : 1) * cakraFactor;
  });

  const kruraInLagna = PLANETS.filter((p) => p.krura && planets[p.key].sign === lagna.sign).map((p) => ({
    key: p.key,
    distMin: Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes),
  }));
  if (kruraInLagna.length > 0) {
    kruraInLagna.sort((a, b) => a.distMin - b.distMin);
    const closestDist = kruraInLagna[0].distMin;
    const beneficsCloser = PLANETS.filter((p) => !p.krura && planets[p.key].sign === lagna.sign).some(
      (p) => Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes) < closestDist
    );
    if (!beneficsCloser) subtotal -= subtotal * (lagnaMinutes / 21600);
  }

  const lagnaContribution = lagna.sign + (lagna.deg + lagna.min / 60) / 30;
  const savana = subtotal + lagnaContribution;
  return { savana, solar: savana * (360 / 365) };
}

function computeAmsa(lagna: LagnaInput, planets: Record<PlanetKey, PlanetInput>): MethodResult {
  const sunAbs = toAbs(planets.sun);
  let planetTotal = 0;

  const bases = PLANETS.map((planet) => {
    const abs = toAbs(planets[planet.key]);
    const arcMin = abs * 60;
    const div200 = arcMin / 200;
    const base = div200 % 12;
    const house = ((planets[planet.key].sign - lagna.sign + 12) % 12) + 1;
    return { planet, abs, base, house };
  });

  const houseMaxBase: Record<number, number> = {};
  bases.forEach(({ house, base }) => {
    if (house >= 7 && house <= 12) houseMaxBase[house] = Math.max(houseMaxBase[house] ?? 0, base);
  });

  bases.forEach(({ planet, abs, base, house }) => {
    const input = planets[planet.key];
    const exaltSign = Math.floor(planet.exaltDeg / 30);
    const bharana = input.retrograde || input.sign === exaltSign || OWN_SIGNS[planet.key].includes(input.sign) ? 3 : 1;
    const afterBharana = base * bharana;

    const lord = SIGN_LORDS[input.sign];
    const satru = ENEMIES[planet.key].includes(lord) && !input.retrograde;
    const asta = planet.key !== "sun" && planet.key !== "venus" && planet.key !== "saturn" && arcDistance(abs, sunAbs) <= planet.combustionOrb;
    const satruFactor = satru ? 2 / 3 : 1;
    const astaFactor = asta ? 1 / 2 : 1;
    const haranaFactor = satru && asta ? Math.min(satruFactor, astaFactor) : satru ? satruFactor : asta ? astaFactor : 1;

    const cakraHouse = house >= 7 && house <= 12;
    const strongest = cakraHouse && base >= (houseMaxBase[house] ?? 0) - 1e-9;
    const cakraFactor = cakraHouse && strongest ? (planet.krura ? CAKRA_FACTORS[house].krura : CAKRA_FACTORS[house].subha) : 1;

    planetTotal += afterBharana * haranaFactor * cakraFactor;
  });

  const lagnaBase = ((toAbs(lagna) * 60) / 200) % 12;
  const savana = planetTotal + lagnaBase;
  return { savana, solar: savana * (360 / 365) };
}

function computeNaisargika(lagna: LagnaInput, planets: Record<PlanetKey, PlanetInput>): MethodResult {
  const sunAbs = toAbs(planets.sun);
  const lagnaMinutes = lagna.deg * 60 + lagna.min;

  const baseRows = PLANETS.map((planet) => {
    const abs = toAbs(planets[planet.key]);
    const raw = mod360(abs - planet.exaltDeg);
    const eff = effectiveArc(raw);
    const base = planet.naisargikaYears * (eff / 360);
    const house = ((planets[planet.key].sign - lagna.sign + 12) % 12) + 1;
    return { planet, abs, base, house };
  });

  const houseMaxBase: Record<number, number> = {};
  baseRows.forEach(({ house, base }) => {
    if (house >= 7 && house <= 12) houseMaxBase[house] = Math.max(houseMaxBase[house] ?? 0, base);
  });

  let subtotal = 0;
  baseRows.forEach(({ planet, abs, base, house }) => {
    const input = planets[planet.key];
    const lord = SIGN_LORDS[input.sign];
    const satru = ENEMIES[planet.key].includes(lord) && !input.retrograde;
    const asta = planet.key !== "sun" && planet.key !== "venus" && planet.key !== "saturn" && arcDistance(abs, sunAbs) <= planet.combustionOrb;
    const cakraHouse = house >= 7 && house <= 12;
    const strongest = cakraHouse && base >= (houseMaxBase[house] ?? 0) - 1e-9;
    const cakraFactor = cakraHouse && strongest ? (planet.krura ? CAKRA_FACTORS[house].krura : CAKRA_FACTORS[house].subha) : 1;
    subtotal += base * (satru ? 2 / 3 : 1) * (asta ? 1 / 2 : 1) * cakraFactor;
  });

  const kruraInLagna = PLANETS.filter((p) => p.krura && planets[p.key].sign === lagna.sign).map((p) => ({
    key: p.key,
    distMin: Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes),
  }));
  if (kruraInLagna.length > 0) {
    kruraInLagna.sort((a, b) => a.distMin - b.distMin);
    const closestDist = kruraInLagna[0].distMin;
    const beneficsCloser = PLANETS.filter((p) => !p.krura && planets[p.key].sign === lagna.sign).some(
      (p) => Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes) < closestDist
    );
    if (!beneficsCloser) subtotal -= subtotal * (lagnaMinutes / 21600);
  }

  const lagnaContribution = lagna.sign + (lagna.deg + lagna.min / 60) / 30;
  const savana = subtotal + lagnaContribution;
  return { savana, solar: savana * (360 / 365) };
}

export function NaisargikaAyurCrossCheckWorkbench() {
  const [lagna, setLagna] = useState<LagnaInput>(DEFAULT_LAGNA);
  const [planets, setPlanets] = useState<Record<PlanetKey, PlanetInput>>(DEFAULT_PLANETS);
  const [primarySeat, setPrimarySeat] = useState<PrimarySeat>("moon");
  const [selectedTablePlanet, setSelectedTablePlanet] = useState<PlanetKey | null>("saturn");
  const [showAveragingTrap, setShowAveragingTrap] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const updatePlanet = (key: PlanetKey, patch: Partial<PlanetInput>) =>
    setPlanets((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  const updateLagna = (patch: Partial<LagnaInput>) => setLagna((prev) => ({ ...prev, ...patch }));

  const reset = () => {
    setLagna(DEFAULT_LAGNA);
    setPlanets(DEFAULT_PLANETS);
    setPrimarySeat("moon");
    setSelectedTablePlanet("saturn");
    setShowAveragingTrap(false);
    setOpenMistakes({});
  };

  const applyPreset = (preset: "chart-h1" | "sun-exalt" | "sun-debilitation") => {
    if (preset === "chart-h1") {
      setLagna(DEFAULT_LAGNA);
      setPlanets(DEFAULT_PLANETS);
      setPrimarySeat("moon");
    } else if (preset === "sun-exalt") {
      setLagna({ sign: 0, deg: 0, min: 0 });
      setPlanets({ ...DEFAULT_PLANETS, sun: { sign: 0, deg: 10, min: 0, retrograde: false } });
    } else {
      setLagna({ sign: 0, deg: 0, min: 0 });
      setPlanets({ ...DEFAULT_PLANETS, sun: { sign: 6, deg: 10, min: 0, retrograde: false } });
    }
  };

  const pinda = useMemo(() => computePinda(lagna, planets), [lagna, planets]);
  const amsa = useMemo(() => computeAmsa(lagna, planets), [lagna, planets]);
  const naisargika = useMemo(() => computeNaisargika(lagna, planets), [lagna, planets]);

  const methodMap: Record<Exclude<PrimarySeat, "lagna">, keyof typeof results> = {
    sun: "amsa",
    moon: "naisargika",
  };
  const results = { pinda: pinda.solar, amsa: amsa.solar, naisargika: naisargika.solar };
  const primaryMethod = primarySeat === "lagna" ? "pinda" : methodMap[primarySeat];
  const primaryValue = results[primaryMethod];
  const values = [pinda.solar, amsa.solar, naisargika.solar];
  const spread = Math.max(...values) - Math.min(...values);
  const converged = spread <= 5;
  const sorted = [...values].sort((a, b) => a - b);
  const primaryIsOutlier = primaryValue <= sorted[0] + spread * 0.25 || primaryValue >= sorted[2] - spread * 0.25;

  const toggleMistake = (index: number) => setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div data-interactive="naisargika-ayur-cross-check-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Naisargikāyu and method cross-check</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Same machinery, new table — then compare all three methods honestly
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              Compute Naisargikāyu using Piṇḍāyu&apos;s exact procedure with a distinctive base-year table, then cross-check it against Piṇḍāyu and Aṁśāyu.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55`, display: "flex", alignItems: "start", gap: "0.6rem" }}>
          <AlertTriangle size={18} aria-hidden="true" style={{ color: VERMILION, flexShrink: 0 }} />
          <p style={{ margin: 0, color: VERMILION, fontWeight: 500 }}>
            Silent calibration only — the cross-check is for your own internal uncertainty, never a client-facing pronouncement.
          </p>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Base-year table</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            Distinctive Naisargikāyu weights
          </h3>
          <BaseYearTable selected={selectedTablePlanet} onSelect={setSelectedTablePlanet} />
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.88rem" }}>
            The seven values sum to <strong style={{ fontWeight: 600 }}>120</strong> — the same total as the Vimśottarī daśā cycle. Saturn carries the highest weight; the Moon and Mars the lowest.
          </p>
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Machinery comparison</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
            Only the input table changes
          </h3>
          <MachinerySvg />
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.88rem" }}>
            Arc formula, Śatru-kṣetra, Astaṅgata, Cakrapāta, Krurodaya, and lagna contribution are identical. The new content is almost entirely the table.
          </p>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 0.8fr) minmax(300px, 1fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Inputs</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            Lagna and planets
          </h3>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <PositionRow label="Lagna" color={BLUE} value={lagna} onChange={updateLagna} />
            {PLANETS.map((planet) => (
              <PositionRow
                key={planet.key}
                label={planet.label}
                color={planet.color}
                value={planets[planet.key]}
                onChange={(patch) => updatePlanet(planet.key, patch)}
                retrogradeToggle
                retrograde={planets[planet.key].retrograde}
                onToggleRetrograde={() => updatePlanet(planet.key, { retrograde: !planets[planet.key].retrograde })}
              />
            ))}
          </div>
          <div style={{ marginTop: "0.85rem" }}>
            <p style={eyebrowStyle}>Presets</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button type="button" onClick={() => applyPreset("chart-h1")} style={presetButtonStyle(BLUE)}>
                Chart H1
              </button>
              <button type="button" onClick={() => applyPreset("sun-exalt")} style={presetButtonStyle(GOLD)}>
                Sun exaltation
              </button>
              <button type="button" onClick={() => applyPreset("sun-debilitation")} style={presetButtonStyle(VERMILION)}>
                Sun debilitation
              </button>
            </div>
          </div>
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Naisargikāyu computation</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: PURPLE, fontSize: "1.1rem", fontWeight: 600 }}>
            Step-by-step with the new table
          </h3>
          <NaisargikaTable lagna={lagna} planets={planets} />
        </section>
      </div>

      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Three-method cross-check</p>
            <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
              Compare Piṇḍāyu, Aṁśāyu, and Naisargikāyu
            </h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" aria-pressed={primarySeat === "lagna"} onClick={() => setPrimarySeat("lagna")} style={smallChipStyle(primarySeat === "lagna", BLUE)}>
              Lagna → Piṇḍāyu
            </button>
            <button type="button" aria-pressed={primarySeat === "sun"} onClick={() => setPrimarySeat("sun")} style={smallChipStyle(primarySeat === "sun", GOLD)}>
              Sun → Aṁśāyu
            </button>
            <button type="button" aria-pressed={primarySeat === "moon"} onClick={() => setPrimarySeat("moon")} style={smallChipStyle(primarySeat === "moon", PURPLE)}>
              Moon → Naisargikāyu
            </button>
          </div>
        </div>

        <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          <CrossCheckSvg values={results} primaryMethod={primaryMethod} />
          <div style={{ display: "grid", gap: "0.65rem" }}>
            <ResultCard label="Piṇḍāyu" value={pinda.solar} color={BLUE} primary={primaryMethod === "pinda"} />
            <ResultCard label="Aṁśāyu" value={amsa.solar} color={GOLD} primary={primaryMethod === "amsa"} />
            <ResultCard label="Naisargikāyu" value={naisargika.solar} color={PURPLE} primary={primaryMethod === "naisargika"} />
          </div>
        </div>

        <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: converged ? `${GREEN}10` : `${GOLD}10`, border: `1px solid ${converged ? GREEN : GOLD}55` }}>
          <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
            {converged ? <CheckCircle2 size={18} style={{ color: GREEN, flexShrink: 0 }} /> : <Info size={18} style={{ color: GOLD, flexShrink: 0 }} />}
            <div>
              <p style={{ margin: 0, color: converged ? GREEN : GOLD, fontWeight: 500 }}>
                {converged ? "Convergence" : "Divergence"} — spread = {spread.toFixed(2)} solar years
              </p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                {converged
                  ? "The three methods land close together. That is a modest confidence-supporting signal, but still not a precise pronouncement."
                  : "The three methods differ substantially. This is common and expected — report it honestly rather than selecting the most convenient figure."}
                {primaryIsOutlier && (
                  <span style={{ color: VERMILION }}>
                    {" "}The classically-selected primary method is numerically the outlier here — trust it on structural grounds (which vitality-seat is strongest), not popularity.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.85rem" }}>
          <button type="button" aria-pressed={showAveragingTrap} onClick={() => setShowAveragingTrap((v) => !v)} style={togglePanelStyle(showAveragingTrap, VERMILION)}>
            <Scale size={18} aria-hidden="true" />
            <span>
              <span style={{ fontWeight: 600 }}>Ad-hoc averaging trap</span>
              <span>{showAveragingTrap ? "" : " — why not just average all three?"}</span>
            </span>
          </button>
          {showAveragingTrap && (
            <div style={{ marginTop: "0.5rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55`, color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
              Averaging three disagreeing numbers sounds reasonable, but it is not classical doctrine. Lesson 7.3.1&apos;s genuine averaging rule applies only when Lagna, Sun, and Moon are comparably strong — a structural condition checked before computation. Post-hoc averaging after seeing disagreement invents a fourth method with no textual basis and can override a real structural judgment.
            </div>
          )}
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Teaching verse</p>
        <div style={{ color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
          <p style={{ margin: 0, fontStyle: "italic", color: INK_PRIMARY }}>
            ekaṁ dve nava viṁśaṁ ca aṣṭādaśa tathā śatam |<br />
            naisargikaṁ śaner uccaṁ śīghrage mandam ucyate ||
          </p>
          <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
            &quot;One, two, nine, twenty, and eighteen thus — the natural longevity of Saturn is high; for the swift-moving [Moon], it is said to be little.&quot;
          </p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
            Composite paraphrase of the BPHS Naisargikāyu base-year verse.
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Three ways this reasoning goes wrong
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {MISTAKES.map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => toggleMistake(index)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 600 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 600, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function BaseYearTable({ selected, onSelect }: { selected: PlanetKey | null; onSelect: (key: PlanetKey) => void }) {
  const max = 50;
  return (
    <div style={{ display: "grid", gap: "0.45rem" }}>
      {PLANETS.map((p) => {
        const isSelected = selected === p.key;
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => onSelect(p.key)}
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr 50px",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.55rem 0.7rem",
              borderRadius: 6,
              border: `1px solid ${isSelected ? p.color : HAIRLINE}`,
              background: isSelected ? `${p.color}12` : "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ color: p.color, fontWeight: 500 }}>{p.label}</span>
            <div style={{ height: 10, borderRadius: 5, background: `${p.color}25`, overflow: "hidden" }}>
              <div style={{ width: `${(p.naisargikaYears / max) * 100}%`, height: "100%", background: p.color }} />
            </div>
            <span style={{ color: INK_PRIMARY, fontWeight: 500, textAlign: "right" }}>{p.naisargikaYears}</span>
          </button>
        );
      })}
      {selected && (
        <div style={{ marginTop: "0.35rem", padding: "0.55rem 0.7rem", borderRadius: 6, background: `${PLANETS.find((p) => p.key === selected)?.color}10`, border: `1px solid ${PLANETS.find((p) => p.key === selected)?.color}44` }}>
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5, fontWeight: 400 }}>
            <strong style={{ color: PLANETS.find((p) => p.key === selected)?.color, fontWeight: 500 }}>
              {PLANETS.find((p) => p.key === selected)?.label}
            </strong>
            {" — "}
            {selected === "saturn"
              ? "Saturn's 50 years is the highest weight: slow, distant, enduring."
              : selected === "moon" || selected === "mars"
                ? "The swiftest bodies receive the smallest natural-longevity weights."
                : "Mid-range weight in the natural-longevity table."}
          </p>
        </div>
      )}
    </div>
  );
}

function MachinerySvg() {
  return (
    <svg viewBox="0 0 360 120" role="img" aria-label="Both methods share the same machinery and differ only in the base-year table">
      <text x="10" y="20" fill={INK_MUTED} fontSize="10" fontWeight={600}>Piṇḍāyu</text>
      <rect x="10" y="30" width="60" height="20" rx="4" fill={`${BLUE}20`} stroke={BLUE} />
      <text x="40" y="44" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight={500}>Arc</text>
      <rect x="80" y="30" width="60" height="20" rx="4" fill={`${VERMILION}20`} stroke={VERMILION} />
      <text x="110" y="44" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={500}>Haranas</text>
      <rect x="150" y="30" width="80" height="20" rx="4" fill={`${GOLD}20`} stroke={GOLD} />
      <text x="190" y="44" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={500}>Pinda table</text>
      <rect x="240" y="30" width="60" height="20" rx="4" fill={`${GREEN}20`} stroke={GREEN} />
      <text x="270" y="44" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight={500}>Lagna</text>
      <text x="310" y="44" fill={INK_PRIMARY} fontSize="10" fontWeight={500}>→ result</text>

      <text x="10" y="80" fill={INK_MUTED} fontSize="10" fontWeight={600}>Naisargikāyu</text>
      <rect x="10" y="90" width="60" height="20" rx="4" fill={`${BLUE}20`} stroke={BLUE} />
      <text x="40" y="104" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight={500}>Arc</text>
      <rect x="80" y="90" width="60" height="20" rx="4" fill={`${VERMILION}20`} stroke={VERMILION} />
      <text x="110" y="104" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={500}>Haranas</text>
      <rect x="150" y="90" width="80" height="20" rx="4" fill={`${PURPLE}20`} stroke={PURPLE} />
      <text x="190" y="104" textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight={500}>Naisargika table</text>
      <rect x="240" y="90" width="60" height="20" rx="4" fill={`${GREEN}20`} stroke={GREEN} />
      <text x="270" y="104" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight={500}>Lagna</text>
      <text x="310" y="104" fill={INK_PRIMARY} fontSize="10" fontWeight={500}>→ result</text>
    </svg>
  );
}

function NaisargikaTable({ lagna, planets }: { lagna: LagnaInput; planets: Record<PlanetKey, PlanetInput> }) {
  const sunAbs = toAbs(planets.sun);
  const rows = useMemo(() => {
    const baseRows = PLANETS.map((planet) => {
      const abs = toAbs(planets[planet.key]);
      const raw = mod360(abs - planet.exaltDeg);
      const eff = effectiveArc(raw);
      const base = planet.naisargikaYears * (eff / 360);
      const house = ((planets[planet.key].sign - lagna.sign + 12) % 12) + 1;
      return { planet, abs, raw, eff, base, house };
    });
    const houseMaxBase: Record<number, number> = {};
    baseRows.forEach(({ house, base }) => {
      if (house >= 7 && house <= 12) houseMaxBase[house] = Math.max(houseMaxBase[house] ?? 0, base);
    });
    return baseRows.map(({ planet, raw, eff, base, house }) => {
      const input = planets[planet.key];
      const lord = SIGN_LORDS[input.sign];
      const satru = ENEMIES[planet.key].includes(lord) && !input.retrograde;
      const asta = planet.key !== "sun" && planet.key !== "venus" && planet.key !== "saturn" && arcDistance(input.sign * 30 + input.deg + input.min / 60, sunAbs) <= planet.combustionOrb;
      const cakraHouse = house >= 7 && house <= 12;
      const strongest = cakraHouse && base >= (houseMaxBase[house] ?? 0) - 1e-9;
      const cakraFactor = cakraHouse && strongest ? (planet.krura ? CAKRA_FACTORS[house].krura : CAKRA_FACTORS[house].subha) : 1;
      const post = base * (satru ? 2 / 3 : 1) * (asta ? 1 / 2 : 1) * cakraFactor;
      return { key: planet.key, label: planet.label, raw, eff, base, satru, asta, cakra: cakraHouse && strongest && cakraFactor !== 1, cakraFactor, post };
    });
  }, [lagna, planets, sunAbs]);

  const total = rows.reduce((sum, r) => sum + r.post, 0);
  const lagnaContribution = lagna.sign + (lagna.deg + lagna.min / 60) / 30;
  const krurodaya = computeKrurodaya(lagna, planets, total);
  const postKrurodaya = total - krurodaya.reduction;
  const savana = postKrurodaya + lagnaContribution;
  const solar = savana * (360 / 365);

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ color: INK_MUTED, borderBottom: `1px solid ${HAIRLINE}` }}>
              <th style={{ textAlign: "left", padding: "0.5rem", fontWeight: 600 }}>Planet</th>
              <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>Base</th>
              <th style={{ textAlign: "center", padding: "0.5rem", fontWeight: 600 }}>Śatru</th>
              <th style={{ textAlign: "center", padding: "0.5rem", fontWeight: 600 }}>Asta</th>
              <th style={{ textAlign: "center", padding: "0.5rem", fontWeight: 600 }}>Cakra</th>
              <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>Post</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td style={{ padding: "0.5rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.label}</td>
                <td style={{ textAlign: "right", padding: "0.5rem", color: INK_SECONDARY }}>{row.base.toFixed(3)}</td>
                <td style={{ textAlign: "center", padding: "0.5rem" }}>{row.satru ? <span style={{ color: VERMILION, fontWeight: 500 }}>−1/3</span> : <span style={{ color: INK_MUTED }}>—</span>}</td>
                <td style={{ textAlign: "center", padding: "0.5rem" }}>{row.asta ? <span style={{ color: VERMILION, fontWeight: 500 }}>−1/2</span> : <span style={{ color: INK_MUTED }}>—</span>}</td>
                <td style={{ textAlign: "center", padding: "0.5rem" }}>{row.cakra ? <span style={{ color: VERMILION, fontWeight: 500 }}>×{row.cakraFactor.toFixed(2)}</span> : <span style={{ color: INK_MUTED }}>—</span>}</td>
                <td style={{ textAlign: "right", padding: "0.5rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.post.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
        <MiniFact icon={<SlidersHorizontal size={16} />} title="Subtotal" body={`${total.toFixed(3)} y`} color={INK_PRIMARY} />
        <MiniFact icon={<AlertTriangle size={16} />} title="Krurodaya" body={`−${krurodaya.reduction.toFixed(3)} y`} color={VERMILION} />
        <MiniFact icon={<ShieldCheck size={16} />} title="Lagna" body={`+${lagnaContribution.toFixed(3)} y`} color={GREEN} />
        <MiniFact icon={<CheckCircle2 size={16} />} title="Solar total" body={`${solar.toFixed(3)} y`} color={PURPLE} />
      </div>
    </div>
  );
}

function computeKrurodaya(lagna: LagnaInput, planets: Record<PlanetKey, PlanetInput>, subtotal: number) {
  const lagnaMinutes = lagna.deg * 60 + lagna.min;
  const kruraInLagna = PLANETS.filter((p) => p.krura && planets[p.key].sign === lagna.sign).map((p) => ({
    key: p.key,
    distMin: Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes),
  }));
  if (kruraInLagna.length === 0) return { reduction: 0 };
  kruraInLagna.sort((a, b) => a.distMin - b.distMin);
  const closestDist = kruraInLagna[0].distMin;
  const beneficsCloser = PLANETS.filter((p) => !p.krura && planets[p.key].sign === lagna.sign).some(
    (p) => Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes) < closestDist
  );
  if (beneficsCloser) return { reduction: 0 };
  return { reduction: subtotal * (lagnaMinutes / 21600) };
}

function CrossCheckSvg({ values, primaryMethod }: { values: { pinda: number; amsa: number; naisargika: number }; primaryMethod: keyof typeof values }) {
  const labels = ["Piṇḍāyu", "Aṁśāyu", "Naisargikāyu"];
  const keys: (keyof typeof values)[] = ["pinda", "amsa", "naisargika"];
  const colors = [BLUE, GOLD, PURPLE];
  const max = Math.max(10, ...keys.map((k) => values[k]));
  const barHeight = 24;
  const gap = 36;
  const width = 320;
  const height = 140;
  const plotLeft = 90;
  const plotRight = width - 20;
  const plotWidth = plotRight - plotLeft;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Cross-check bar chart of the three longevity methods">
      {keys.map((key, i) => {
        const val = values[key];
        const barWidth = (val / max) * plotWidth;
        const y = 20 + i * gap;
        const isPrimary = primaryMethod === key;
        return (
          <g key={key}>
            <text x={plotLeft - 10} y={y + barHeight / 1.4} textAnchor="end" fill={INK_PRIMARY} fontSize="11" fontWeight={500}>
              {labels[i]}
            </text>
            <rect x={plotLeft} y={y} width={barWidth} height={barHeight} rx="4" fill={colors[i]} opacity={isPrimary ? 1 : 0.6} stroke={isPrimary ? colors[i] : "none"} strokeWidth={2} />
            <text x={plotLeft + barWidth + 6} y={y + barHeight / 1.4} fill={INK_PRIMARY} fontSize="11" fontWeight={500}>
              {val.toFixed(2)}y
            </text>
            {isPrimary && (
              <text x={plotLeft + barWidth / 2} y={y - 5} textAnchor="middle" fill={colors[i]} fontSize="10" fontWeight={600}>
                primary
              </text>
            )}
          </g>
        );
      })}
      <line x1={plotLeft} y1={height - 16} x2={plotRight} y2={height - 16} stroke={HAIRLINE} strokeWidth={1} />
      <text x={plotLeft} y={height - 4} fill={INK_MUTED} fontSize="9" fontWeight={500}>0</text>
      <text x={plotRight} y={height - 4} textAnchor="end" fill={INK_MUTED} fontSize="9" fontWeight={500}>{max.toFixed(0)}y</text>
    </svg>
  );
}

function ResultCard({ label, value, color, primary }: { label: string; value: number; color: string; primary: boolean }) {
  return (
    <div style={{ border: `1px solid ${primary ? color : HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: primary ? `${color}10` : SURFACE }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: primary ? color : INK_SECONDARY, fontWeight: 500 }}>{label}</span>
        {primary && <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color, fontWeight: 600 }}>Primary</span>}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "1.15rem" }}>{value.toFixed(3)} solar years</p>
      <p style={{ margin: "0.2rem 0 0", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 400 }}>{formatYMD(value)}</p>
    </div>
  );
}

function PositionRow({
  label,
  color,
  value,
  onChange,
  retrogradeToggle,
  retrograde,
  onToggleRetrograde,
}: {
  label: string;
  color: string;
  value: { sign: number; deg: number; min: number };
  onChange: (patch: Partial<{ sign: number; deg: number; min: number }>) => void;
  retrogradeToggle?: boolean;
  retrograde?: boolean;
  onToggleRetrograde?: () => void;
}) {
  return (
    <div style={{ display: "grid", gap: "0.35rem", padding: "0.5rem", borderRadius: 6, background: `${color}08`, border: `1px solid ${color}33` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ color, fontWeight: 500 }}>{label}</span>
        {retrogradeToggle && onToggleRetrograde && (
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: INK_SECONDARY, cursor: "pointer" }}>
            <input type="checkbox" checked={retrograde || false} onChange={onToggleRetrograde} />
            Retro
          </label>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 0.8fr", gap: "0.4rem" }}>
        <select
          value={value.sign}
          onChange={(e) => onChange({ sign: Number(e.target.value) })}
          style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
        >
          {SIGNS.map((s, i) => (
            <option key={s} value={i}>{s}</option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          max={29}
          value={value.deg}
          onChange={(e) => onChange({ deg: clamp(Number(e.target.value), 0, 29) })}
          style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
          placeholder="°"
        />
        <input
          type="number"
          min={0}
          max={59}
          value={value.min}
          onChange={(e) => onChange({ min: clamp(Number(e.target.value), 0, 59) })}
          style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
          placeholder="′"
        />
      </div>
    </div>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.6rem", borderRadius: 6, background: `${color}10`, border: `1px solid ${color}33` }}>
      <span style={{ color }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: INK_MUTED, fontWeight: 600 }}>{title}</p>
        <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontWeight: 500 }}>{body}</p>
      </div>
    </div>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function presetButtonStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}66`,
    borderRadius: 8,
    background: `${color}10`,
    color,
    padding: "0.55rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}15` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem 0.75rem",
    cursor: "pointer",
    textAlign: "left",
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
