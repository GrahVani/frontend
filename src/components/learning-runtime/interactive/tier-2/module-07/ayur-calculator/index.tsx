"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
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
type Mode = "pinda" | "amsa" | "naisargika";

interface PlanetDef {
  key: PlanetKey;
  label: string;
  baseYears: number;
  exaltDeg: number;
  combustionOrb: number;
  krura: boolean;
}

const PLANETS: PlanetDef[] = [
  { key: "sun", label: "Sun", baseYears: 19, exaltDeg: 10, combustionOrb: 15, krura: true },
  { key: "moon", label: "Moon", baseYears: 25, exaltDeg: 33, combustionOrb: 12, krura: false },
  { key: "mars", label: "Mars", baseYears: 15, exaltDeg: 298, combustionOrb: 17, krura: true },
  { key: "mercury", label: "Mercury", baseYears: 12, exaltDeg: 165, combustionOrb: 14, krura: false },
  { key: "jupiter", label: "Jupiter", baseYears: 15, exaltDeg: 95, combustionOrb: 11, krura: false },
  { key: "venus", label: "Venus", baseYears: 21, exaltDeg: 357, combustionOrb: 10, krura: false },
  { key: "saturn", label: "Saturn", baseYears: 20, exaltDeg: 200, combustionOrb: 15, krura: true },
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
  amsaX2?: boolean;
}

interface LagnaInput {
  sign: number;
  deg: number;
  min: number;
}

const DEFAULT_LAGNA: LagnaInput = { sign: 2, deg: 14, min: 20 };

const DEFAULT_PLANETS: Record<PlanetKey, PlanetInput> = {
  sun: { sign: 2, deg: 12, min: 0, retrograde: false, amsaX2: false },
  moon: { sign: 3, deg: 15, min: 0, retrograde: false, amsaX2: false },
  mars: { sign: 2, deg: 20, min: 0, retrograde: false, amsaX2: false },
  mercury: { sign: 10, deg: 10, min: 0, retrograde: false, amsaX2: false },
  jupiter: { sign: 3, deg: 8, min: 0, retrograde: false, amsaX2: false },
  venus: { sign: 4, deg: 5, min: 0, retrograde: false, amsaX2: false },
  saturn: { sign: 0, deg: 18, min: 0, retrograde: false, amsaX2: false },
};

const PINDA_MISTAKES = [
  {
    label: "Misapplying the arc-formula branch",
    wrong: "The raw arc is used directly without checking the 180° branch.",
    right:
      "Raw arc < 180° → effective arc = 360° − raw; raw arc ≥ 180° → effective arc = raw, unchanged.",
  },
  {
    label: "Applying Krurodaya to every krūra graha in the lagna",
    wrong: "All krūra grahas sharing the lagna sign are reduced.",
    right: "Only the single krūra graha closest to the exact lagna degree undergoes Krurodaya.",
  },
  {
    label: "Forgetting Śatru-kṣetra and Astaṅgata exemptions",
    wrong: "Retrograde planets are reduced for enemy signs; Venus/Saturn are reduced for combustion.",
    right: "Retrograde planets are exempt from Śatru-kṣetra; Venus and Saturn are exempt from Astaṅgata.",
  },
];

const AMSA_MISTAKES = [
  {
    label: "Applying Piṇḍāyu's multiplicative harana rule to Aṁśāyu",
    wrong: "Śatru-kṣetra and Astaṅgata are multiplied together.",
    right: "Aṁśāyu uses the larger reduction only, not the product.",
  },
  {
    label: "Missing the exalted trigger for the ×3 bharana",
    wrong: "A planet exalted but not in its own sign is not given ×3.",
    right: "Retrograde, exalted, and own-sign are three independent ×3 triggers.",
  },
  {
    label: "Looking for a Krurodaya-style reduction in Aṁśāyu",
    wrong: "A learner applies a lagna-degree-based reduction.",
    right: "Aṁśāyu has no Krurodaya haraṇa; the lagna contributes only its base-formula figure.",
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

export function AyurCalculator() {
  const [mode, setMode] = useState<Mode>("pinda");
  const [lagna, setLagna] = useState<LagnaInput>(DEFAULT_LAGNA);
  const [planets, setPlanets] = useState<Record<PlanetKey, PlanetInput>>(DEFAULT_PLANETS);
  const [beneficAspectsLagna, setBeneficAspectsLagna] = useState(false);
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const applyPreset = (preset: "chart-h1" | "sun-exalt" | "sun-debilitation") => {
    if (preset === "chart-h1") {
      setLagna(DEFAULT_LAGNA);
      setPlanets(DEFAULT_PLANETS);
    } else if (preset === "sun-exalt") {
      setLagna({ sign: 0, deg: 0, min: 0 });
      setPlanets({
        ...DEFAULT_PLANETS,
        sun: { sign: 0, deg: 10, min: 0, retrograde: false, amsaX2: false },
      });
    } else {
      setLagna({ sign: 0, deg: 0, min: 0 });
      setPlanets({
        ...DEFAULT_PLANETS,
        sun: { sign: 6, deg: 10, min: 0, retrograde: false, amsaX2: false },
      });
    }
  };

  const reset = () => {
    setLagna(DEFAULT_LAGNA);
    setPlanets(DEFAULT_PLANETS);
    setBeneficAspectsLagna(false);
    setShowSloka(false);
    setOpenMistakes({});
  };

  const updatePlanet = (key: PlanetKey, patch: Partial<PlanetInput>) =>
    setPlanets((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const updateLagna = (patch: Partial<LagnaInput>) =>
    setLagna((prev) => ({ ...prev, ...patch }));

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const pinda = useMemo(() => computePinda(lagna, planets, beneficAspectsLagna), [lagna, planets, beneficAspectsLagna]);
  const amsa = useMemo(() => computeAmsa(lagna, planets), [lagna, planets]);

  const active = mode === "pinda" ? pinda : amsa;
  const mistakes = mode === "pinda" ? PINDA_MISTAKES : AMSA_MISTAKES;

  return (
    <div data-interactive="ayur-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Āyur calculator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Work the full classical arithmetic
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              Compute Piṇḍāyu or Aṁśāyu step by step. The final figure is for silent calibration only.
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
            Silent calibration only — never share this number with a client as an age, life expectancy, or death-date.
          </p>
        </div>
      </section>

      <ModeTabs mode={mode} onChange={setMode} />

      {mode === "naisargika" && (
        <section style={{ ...panelStyle, background: `${PURPLE}0A` }}>
          <p style={{ margin: 0, color: PURPLE, fontWeight: 500 }}>
            Naisargikāyu mode is covered in Lesson 7.3.4. Switch back to Piṇḍāyu or Aṁśāyu to use the calculator.
          </p>
        </section>
      )}

      {mode !== "naisargika" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 0.75fr) minmax(300px, 1fr)", gap: "1rem", alignItems: "start" }}>
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
                    color={planet.krura ? VERMILION : GREEN}
                    value={planets[planet.key]}
                    onChange={(patch) => updatePlanet(planet.key, patch)}
                    retrogradeToggle
                    retrograde={planets[planet.key].retrograde}
                    onToggleRetrograde={() => updatePlanet(planet.key, { retrograde: !planets[planet.key].retrograde })}
                    amsaX2Toggle={mode === "amsa"}
                    amsaX2={planets[planet.key].amsaX2 || false}
                    onToggleAmsaX2={() => updatePlanet(planet.key, { amsaX2: !planets[planet.key].amsaX2 })}
                  />
                ))}
              </div>

              {mode === "pinda" && (
                <div style={{ marginTop: "0.85rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: INK_SECONDARY, fontWeight: 400 }}>
                    <input
                      type="checkbox"
                      checked={beneficAspectsLagna}
                      onChange={(e) => setBeneficAspectsLagna(e.target.checked)}
                    />
                    A benefic aspects the lagna (halves Krurodaya if triggered)
                  </label>
                </div>
              )}

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
              {mode === "pinda" ? (
                <>
                  <p style={eyebrowStyle}>Base-year reference</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem" }}>
                    {PLANETS.map((p) => (
                      <div key={p.key} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "0.5rem", textAlign: "center" }}>
                        <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500, fontSize: "0.9rem" }}>{p.label}</p>
                        <p style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "0.85rem" }}>{p.baseYears} years</p>
                        <p style={{ margin: "0.2rem 0 0", color: INK_MUTED, fontSize: "0.75rem" }}>Uccha {p.exaltDeg}°</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p style={eyebrowStyle}>Aṁśāyu base formula</p>
                  <div style={{ padding: "0.75rem", borderRadius: 8, background: `${BLUE}10`, border: `1px solid ${BLUE}55` }}>
                    <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>
                      Base = ((longitude × 60) ÷ 200) mod 12
                    </p>
                    <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.88rem" }}>
                      Convert longitude to arc-minutes, divide by 200, then reduce modulo 12. The lagna uses the same formula with no bharana or harana.
                    </p>
                  </div>
                </>
              )}
            </section>
          </div>

          <section style={panelStyle}>
            <p style={eyebrowStyle}>Computation table</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ color: INK_MUTED, borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.5rem", fontWeight: 600 }}>Body</th>
                    {mode === "pinda" ? (
                      <>
                        <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>Raw arc</th>
                        <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>Eff. arc</th>
                        <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>Base years</th>
                      </>
                    ) : (
                      <>
                        <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>Arc-min</th>
                        <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>÷200</th>
                        <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>mod 12</th>
                        <th style={{ textAlign: "center", padding: "0.5rem", fontWeight: 600 }}>Bharana</th>
                      </>
                    )}
                    <th style={{ textAlign: "center", padding: "0.5rem", fontWeight: 600 }}>Śatru</th>
                    <th style={{ textAlign: "center", padding: "0.5rem", fontWeight: 600 }}>Astaṅgata</th>
                    <th style={{ textAlign: "center", padding: "0.5rem", fontWeight: 600 }}>Cakrapāta</th>
                    <th style={{ textAlign: "right", padding: "0.5rem", fontWeight: 600 }}>Post-harana</th>
                  </tr>
                </thead>
                <tbody>
                  {active.rows.map((row) => (
                    <tr key={row.key} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <td style={{ padding: "0.5rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.label}</td>
                      {mode === "pinda" ? (
                        <>
                          <td style={{ textAlign: "right", padding: "0.5rem", color: INK_SECONDARY }}>{(row as PindaRow).raw.toFixed(1)}°</td>
                          <td style={{ textAlign: "right", padding: "0.5rem", color: INK_SECONDARY }}>{(row as PindaRow).eff.toFixed(1)}°</td>
                          <td style={{ textAlign: "right", padding: "0.5rem", color: INK_PRIMARY }}>{(row as PindaRow).base.toFixed(3)}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ textAlign: "right", padding: "0.5rem", color: INK_SECONDARY }}>{(row as AmsaRow).arcMin.toFixed(1)}′</td>
                          <td style={{ textAlign: "right", padding: "0.5rem", color: INK_SECONDARY }}>{(row as AmsaRow).div200.toFixed(3)}</td>
                          <td style={{ textAlign: "right", padding: "0.5rem", color: INK_PRIMARY }}>{(row as AmsaRow).base.toFixed(3)}</td>
                          <td style={{ textAlign: "center", padding: "0.5rem" }}>
                            {(row as AmsaRow).bharanaFactor !== 1 ? (
                              <span style={{ color: GREEN, fontWeight: 500 }}>×{(row as AmsaRow).bharanaFactor}</span>
                            ) : (
                              <span style={{ color: INK_MUTED }}>—</span>
                            )}
                          </td>
                        </>
                      )}
                      <td style={{ textAlign: "center", padding: "0.5rem" }}>
                        {row.satruApplied ? <span style={{ color: VERMILION, fontWeight: 500 }}>−1/3</span> : <span style={{ color: INK_MUTED }}>—</span>}
                      </td>
                      <td style={{ textAlign: "center", padding: "0.5rem" }}>
                        {row.astaApplied ? <span style={{ color: VERMILION, fontWeight: 500 }}>−1/2</span> : <span style={{ color: INK_MUTED }}>—</span>}
                      </td>
                      <td style={{ textAlign: "center", padding: "0.5rem" }}>
                        {row.cakraApplied ? (
                          <span style={{ color: VERMILION, fontWeight: 500 }}>×{row.cakraFactor.toFixed(2)}</span>
                        ) : (
                          <span style={{ color: INK_MUTED }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right", padding: "0.5rem", color: INK_PRIMARY, fontWeight: 500 }}>{row.post.toFixed(3)}</td>
                    </tr>
                  ))}
                  {mode === "amsa" && (
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}`, background: `${BLUE}08` }}>
                      <td style={{ padding: "0.5rem", color: INK_PRIMARY, fontWeight: 500 }}>Lagna</td>
                      <td style={{ textAlign: "right", padding: "0.5rem", color: INK_SECONDARY }}>{amsa.lagna.arcMin.toFixed(1)}′</td>
                      <td style={{ textAlign: "right", padding: "0.5rem", color: INK_SECONDARY }}>{amsa.lagna.div200.toFixed(3)}</td>
                      <td style={{ textAlign: "right", padding: "0.5rem", color: INK_PRIMARY }}>{amsa.lagna.base.toFixed(3)}</td>
                      <td style={{ textAlign: "center", padding: "0.5rem" }}><span style={{ color: INK_MUTED }}>—</span></td>
                      <td style={{ textAlign: "center", padding: "0.5rem" }}><span style={{ color: INK_MUTED }}>—</span></td>
                      <td style={{ textAlign: "center", padding: "0.5rem" }}><span style={{ color: INK_MUTED }}>—</span></td>
                      <td style={{ textAlign: "center", padding: "0.5rem" }}><span style={{ color: INK_MUTED }}>—</span></td>
                      <td style={{ textAlign: "right", padding: "0.5rem", color: INK_PRIMARY, fontWeight: 500 }}>{amsa.lagna.base.toFixed(3)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 400 }}>
              {mode === "pinda"
                ? "Cakrapāta is applied only to the strongest base-year occupant of each 7th–12th house."
                : "Aṁśāyu uses the larger of Śatru-kṣetra and Astaṅgata only, not their product. Cakrapāta applies independently."}
            </p>
          </section>

          {mode === "pinda" && (
            <section style={panelStyle}>
              <p style={eyebrowStyle}>Krurodaya</p>
              {pinda.krurodaya.applies ? (
                <div>
                  <p style={{ margin: 0, color: VERMILION, fontWeight: 500 }}>
                    Triggered — closest krūra graha: {pinda.krurodaya.closest}
                  </p>
                  <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    {pinda.krurodaya.waived
                      ? "Waived because a benefic occupies the lagna and is closer to the lagna degree."
                      : `Reduction: ${pinda.krurodaya.reduction.toFixed(3)} years${beneficAspectsLagna ? " (halved by benefic aspect)" : ""}`}
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                  No krūra graha occupies the lagna sign, so Krurodaya does not apply.
                </p>
              )}
            </section>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {mode === "pinda" && (
              <section style={panelStyle}>
                <p style={eyebrowStyle}>Lagna contribution</p>
                <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>
                  {pinda.lagnaContribution.toFixed(3)} Sāvana years
                </p>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5, fontWeight: 400 }}>
                  Signs gained from Aries plus degrees-within-sign ÷ 30.
                </p>
              </section>
            )}

            <section style={{ ...panelStyle, borderColor: `${GOLD}66`, background: `${GOLD}0A` }}>
              <p style={eyebrowStyle}>Final output</p>
              <p style={{ margin: 0, color: GOLD, fontWeight: 600, fontSize: "1.3rem" }}>
                {active.savana.toFixed(3)} Sāvana years
              </p>
              <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, fontWeight: 500 }}>
                {active.solar.toFixed(3)} solar years ≈ {formatYMD(active.solar)}
              </p>
            </section>
          </div>

          <section style={panelStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {active.boundaryOk ? (
                <CheckCircle2 size={20} aria-hidden="true" style={{ color: GREEN }} />
              ) : (
                <Info size={20} aria-hidden="true" style={{ color: INK_MUTED }} />
              )}
              <p style={{ margin: 0, color: active.boundaryOk ? GREEN : INK_MUTED, fontWeight: 500 }}>
                {mode === "pinda"
                  ? active.boundaryOk
                    ? "Boundary-case check passed: exact exaltation gives full years and exact debilitation gives half years."
                    : "No planet is currently placed exactly at exaltation or debilitation for the boundary-case check."
                  : active.boundaryOk
                    ? "Boundary check: at least one base figure lands exactly at 0.000 (valid in Aṁśāyu)."
                    : "No Aṁśāyu base figure is currently exactly 0.000."}
              </p>
            </div>
          </section>
        </>
      )}

      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Teaching verse</p>
          <button type="button" aria-pressed={showSloka} onClick={() => setShowSloka((v) => !v)} style={smallChipStyle(showSloka, GOLD)}>
            {showSloka ? "Hide verse" : "Show verse"}
          </button>
        </div>
        {showSloka && (
          <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
            {mode === "pinda" ? (
              <>
                <p style={{ margin: 0, fontStyle: "italic" }}>
                  ekonaviṁśatiḥ sūryaś candraḥ pañcaviṁśatiḥ smṛtaḥ |<br />
                  ucce pūrṇaṁ nīce cārdhaṁ trairāśika-vidhānataḥ ||
                </p>
                <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
                  &quot;Nineteen for the Sun, twenty-five is recalled for the Moon — full at exaltation, and half at debilitation, by the rule-of-three method.&quot;
                </p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
                  Composite paraphrase of the BPHS Piṇḍāyu base-year verse.
                </p>
              </>
            ) : mode === "amsa" ? (
              <>
                <p style={{ margin: 0, fontStyle: "italic" }}>
                  navāṁśa-tulya-varṣāṇi dvādaśena viśodhya ca |<br />
                  astatve śatrubhe caiva mahad ekaṁ na tu dvayam ||
                </p>
                <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
                  &quot;Years equal to the navāṁśas gained, reduced by multiples of twelve — and in combustion and in an enemy sign alike, the greater alone, not both.&quot;
                </p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
                  Composite paraphrase of the BPHS Aṁśāyu formula and harana rule.
                </p>
              </>
            ) : (
              <p style={{ margin: 0, color: INK_MUTED }}>Select Piṇḍāyu or Aṁśāyu to see the teaching verse.</p>
            )}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          {mode === "pinda" ? "Three places the arithmetic goes wrong" : "Aṁśāyu-specific errors to avoid"}
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {mistakes.map((item, index) => {
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
                      <span style={{ fontWeight: 500 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 500, color: GREEN }}>Honest reading:</span> {item.right}
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

interface BaseRow {
  key: PlanetKey;
  label: string;
  satruApplied: boolean;
  astaApplied: boolean;
  cakraApplied: boolean;
  cakraFactor: number;
  post: number;
}

interface PindaRow extends BaseRow {
  raw: number;
  eff: number;
  base: number;
}

interface AmsaRow extends BaseRow {
  arcMin: number;
  div200: number;
  base: number;
  bharanaFactor: number;
}

interface PindaResult {
  rows: PindaRow[];
  krurodaya: { applies: boolean; reduction: number; closest: PlanetKey | null; waived: boolean };
  lagnaContribution: number;
  savana: number;
  solar: number;
  boundaryOk: boolean;
}

interface AmsaResult {
  rows: AmsaRow[];
  lagna: { arcMin: number; div200: number; base: number };
  savana: number;
  solar: number;
  boundaryOk: boolean;
}

function computePinda(lagna: LagnaInput, planets: Record<PlanetKey, PlanetInput>, beneficAspectsLagna: boolean): PindaResult {
  const sunAbs = toAbs(planets.sun);

  const baseRows = PLANETS.map((planet) => {
    const abs = toAbs(planets[planet.key]);
    const raw = mod360(abs - planet.exaltDeg);
    const eff = effectiveArc(raw);
    const base = planet.baseYears * (eff / 360);
    const house = ((planets[planet.key].sign - lagna.sign + 12) % 12) + 1;
    return { planet, abs, raw, eff, base, house };
  });

  const houseMaxBase: Record<number, number> = {};
  baseRows.forEach(({ house, base }) => {
    if (house >= 7 && house <= 12) {
      houseMaxBase[house] = Math.max(houseMaxBase[house] ?? 0, base);
    }
  });

  const rows = baseRows.map(({ planet, abs, raw, eff, base, house }) => {
    const input = planets[planet.key];
    const lord = SIGN_LORDS[input.sign];
    const enemy = ENEMIES[planet.key].includes(lord);
    const satruApplied = enemy && !input.retrograde;
    const satruFactor = satruApplied ? 2 / 3 : 1;

    const combustible = planet.key !== "sun" && planet.key !== "venus" && planet.key !== "saturn";
    const distToSun = arcDistance(abs, sunAbs);
    const astaApplied = combustible && distToSun <= planet.combustionOrb;
    const astaFactor = astaApplied ? 1 / 2 : 1;

    const cakraHouse = house >= 7 && house <= 12;
    const strongestInHouse = cakraHouse && base >= (houseMaxBase[house] ?? 0) - 1e-9;
    const cakraFactor =
      cakraHouse && strongestInHouse
        ? planet.krura
          ? CAKRA_FACTORS[house].krura
          : CAKRA_FACTORS[house].subha
        : 1;

    const post = base * satruFactor * astaFactor * cakraFactor;

    return {
      key: planet.key,
      label: planet.label,
      raw,
      eff,
      base,
      satruApplied,
      astaApplied,
      cakraApplied: cakraHouse && strongestInHouse && cakraFactor !== 1,
      cakraFactor,
      post,
    };
  });

  const subtotal = rows.reduce((sum, r) => sum + r.post, 0);

  const lagnaMinutes = lagna.deg * 60 + lagna.min;
  const kruraInLagna = PLANETS.filter(
    (p) => p.krura && planets[p.key].sign === lagna.sign
  ).map((p) => ({
    key: p.key,
    distMin: Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes),
  }));

  let krurodaya = { applies: false, reduction: 0, closest: null as PlanetKey | null, waived: false };
  if (kruraInLagna.length > 0) {
    kruraInLagna.sort((a, b) => a.distMin - b.distMin);
    const closestKey = kruraInLagna[0].key;
    const closestDist = kruraInLagna[0].distMin;
    let reduction = subtotal * (lagnaMinutes / 21600);

    const beneficsInLagna = PLANETS.filter(
      (p) => !p.krura && planets[p.key].sign === lagna.sign
    ).map((p) => Math.abs(planets[p.key].deg * 60 + planets[p.key].min - lagnaMinutes));
    const beneficCloser = beneficsInLagna.some((d) => d < closestDist);

    if (beneficCloser) {
      krurodaya = { applies: true, reduction: 0, closest: closestKey, waived: true };
    } else {
      if (beneficAspectsLagna) reduction *= 0.5;
      krurodaya = { applies: true, reduction, closest: closestKey, waived: false };
    }
  }

  const postKrurodaya = subtotal - krurodaya.reduction;
  const lagnaContribution = lagna.sign + (lagna.deg + lagna.min / 60) / 30;
  const savana = postKrurodaya + lagnaContribution;
  const solar = savana * (360 / 365);

  const boundaryOk = PLANETS.every((p) => {
    const abs = toAbs(planets[p.key]);
    const raw = mod360(abs - p.exaltDeg);
    const eff = effectiveArc(raw);
    const base = p.baseYears * (eff / 360);
    const atExalt = Math.abs(raw) < 0.001;
    const atDebilit = Math.abs(raw - 180) < 0.001;
    return (!atExalt || Math.abs(base - p.baseYears) < 0.001) && (!atDebilit || Math.abs(base - p.baseYears / 2) < 0.001);
  });

  return { rows, krurodaya, lagnaContribution, savana, solar, boundaryOk };
}

function computeAmsa(lagna: LagnaInput, planets: Record<PlanetKey, PlanetInput>): AmsaResult {
  const lagnaAbs = toAbs(lagna);
  const sunAbs = toAbs(planets.sun);

  function amsaBase(abs: number) {
    const arcMin = abs * 60;
    const div200 = arcMin / 200;
    const base = div200 % 12;
    return { arcMin, div200, base };
  }

  const baseRows = PLANETS.map((planet) => {
    const abs = toAbs(planets[planet.key]);
    const { arcMin, div200, base } = amsaBase(abs);
    const house = ((planets[planet.key].sign - lagna.sign + 12) % 12) + 1;
    return { planet, abs, arcMin, div200, base, house };
  });

  const houseMaxBase: Record<number, number> = {};
  baseRows.forEach(({ house, base }) => {
    if (house >= 7 && house <= 12) {
      houseMaxBase[house] = Math.max(houseMaxBase[house] ?? 0, base);
    }
  });

  const rows = baseRows.map(({ planet, abs, arcMin, div200, base, house }) => {
    const input = planets[planet.key];

    // Bharana
    const exaltSign = Math.floor(planet.exaltDeg / 30);
    const x3 = input.retrograde || input.sign === exaltSign || OWN_SIGNS[planet.key].includes(input.sign);
    const x2 = !x3 && (input.amsaX2 || false);
    const bharanaFactor = x3 ? 3 : x2 ? 2 : 1;
    const afterBharana = base * bharanaFactor;

    // Harana: max rule
    const lord = SIGN_LORDS[input.sign];
    const enemy = ENEMIES[planet.key].includes(lord);
    const satruApplied = enemy && !input.retrograde;
    const satruFactor = satruApplied ? 2 / 3 : 1;

    const combustible = planet.key !== "sun" && planet.key !== "venus" && planet.key !== "saturn";
    const distToSun = arcDistance(abs, sunAbs);
    const astaApplied = combustible && distToSun <= planet.combustionOrb;
    const astaFactor = astaApplied ? 1 / 2 : 1;

    const haranaFactor = satruApplied && astaApplied ? Math.min(satruFactor, astaFactor) : satruApplied ? satruFactor : astaApplied ? astaFactor : 1;

    const afterHarana = afterBharana * haranaFactor;

    // Cakrapāta
    const cakraHouse = house >= 7 && house <= 12;
    const strongestInHouse = cakraHouse && base >= (houseMaxBase[house] ?? 0) - 1e-9;
    const cakraFactor =
      cakraHouse && strongestInHouse
        ? planet.krura
          ? CAKRA_FACTORS[house].krura
          : CAKRA_FACTORS[house].subha
        : 1;

    const post = afterHarana * cakraFactor;

    return {
      key: planet.key,
      label: planet.label,
      arcMin,
      div200,
      base,
      bharanaFactor,
      satruApplied,
      astaApplied,
      cakraApplied: cakraHouse && strongestInHouse && cakraFactor !== 1,
      cakraFactor,
      post,
    };
  });

  const planetTotal = rows.reduce((sum, r) => sum + r.post, 0);
  const lagnaAmsa = amsaBase(lagnaAbs);
  const savana = planetTotal + lagnaAmsa.base;
  const solar = savana * (360 / 365);

  const boundaryOk = PLANETS.some((p) => {
    const abs = toAbs(planets[p.key]);
    const { base } = amsaBase(abs);
    return Math.abs(base) < 0.0001;
  });

  return { rows, lagna: lagnaAmsa, savana, solar, boundaryOk };
}

function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const tabs: { key: Mode; label: string; color: string }[] = [
    { key: "pinda", label: "Piṇḍāyu", color: GOLD },
    { key: "amsa", label: "Aṁśāyu", color: BLUE },
    { key: "naisargika", label: "Naisargikāyu", color: PURPLE },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          aria-pressed={mode === tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            border: `1px solid ${mode === tab.key ? tab.color : HAIRLINE}`,
            borderRadius: 8,
            background: mode === tab.key ? tab.color : "transparent",
            color: mode === tab.key ? "#fff" : INK_SECONDARY,
            padding: "0.5rem 0.75rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {tab.label}
        </button>
      ))}
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
  amsaX2Toggle,
  amsaX2,
  onToggleAmsaX2,
}: {
  label: string;
  color: string;
  value: { sign: number; deg: number; min: number };
  onChange: (patch: Partial<{ sign: number; deg: number; min: number }>) => void;
  retrogradeToggle?: boolean;
  retrograde?: boolean;
  onToggleRetrograde?: () => void;
  amsaX2Toggle?: boolean;
  amsaX2?: boolean;
  onToggleAmsaX2?: () => void;
}) {
  return (
    <div style={{ display: "grid", gap: "0.35rem", padding: "0.5rem", borderRadius: 6, background: `${color}08`, border: `1px solid ${color}33` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ color, fontWeight: 500 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {retrogradeToggle && onToggleRetrograde && (
            <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: INK_SECONDARY, cursor: "pointer" }}>
              <input type="checkbox" checked={retrograde || false} onChange={onToggleRetrograde} />
              Retro
            </label>
          )}
          {amsaX2Toggle && onToggleAmsaX2 && (
            <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: INK_SECONDARY, cursor: "pointer" }}>
              <input type="checkbox" checked={amsaX2 || false} onChange={onToggleAmsaX2} />
              ×2
            </label>
          )}
        </div>
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
