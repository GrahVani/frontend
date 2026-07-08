"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CircleDot,
  Info,
  RotateCcw,
  Scale,
  Sparkles,
} from "lucide-react";

type HouseKey = 1 | 6 | 8 | 12;
type Strength = "strong" | "moderate" | "weak";
type Aspect = "none" | "benefic" | "malefic";
type CompressionKey = "fine" | "not-fine" | "honest";
type PresetKey = "chart-h1" | "convergent" | "divergent";

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

const HOUSES: Record<
  HouseKey,
  {
    label: string;
    register: string;
    color: string;
    role: "baseline" | "dusthana";
    description: string;
  }
> = {
  1: {
    label: "1st house",
    register: "Constitution / baseline",
    color: GOLD,
    role: "baseline",
    description: "The primary constitutional register — vitality, body-type, and overall resilience.",
  },
  6: {
    label: "6th house",
    register: "Immunity / struggle",
    color: BLUE,
    role: "dusthana",
    description: "Modulates how the baseline meets disease, debt, and daily struggle.",
  },
  8: {
    label: "8th house",
    register: "Longevity-theme / transformation",
    color: VERMILION,
    role: "dusthana",
    description: "Modulates deep, hidden, or chronic processes and transformation.",
  },
  12: {
    label: "12th house",
    register: "Loss / hospitalisation-theme",
    color: PURPLE,
    role: "dusthana",
    description: "Modulates loss, confinement, and hospitalisation themes.",
  },
};

const STRENGTHS: Record<
  Strength,
  { label: string; color: string; score: number }
> = {
  strong: { label: "Strong", color: GREEN, score: 2 },
  moderate: { label: "Moderate", color: GOLD, score: 1 },
  weak: { label: "Weak", color: VERMILION, score: 0 },
};

const ASPECTS: Record<
  Aspect,
  { label: string; color: string; note: string }
> = {
  none: { label: "No aspect", color: INK_MUTED, note: "Read by house/lord dignity alone." },
  benefic: {
    label: "Benefic aspect",
    color: GREEN,
    note: "Supports the favourable side of the house's reading.",
  },
  malefic: {
    label: "Malefic aspect",
    color: VERMILION,
    note: "Temps the reading toward the less-favourable side unless the aspecting planet is strong.",
  },
};

const COMPRESSIONS: Record<
  CompressionKey,
  { label: string; feedback: string; correct: boolean }
> = {
  fine: {
    label: "You're basically fine.",
    feedback:
      "This collapses tension into a false reassurance. A synthesis with mixed dusthānas cannot honestly become a simple 'fine'.",
    correct: false,
  },
  "not-fine": {
    label: "You're not fine — the weak houses are concerning.",
    feedback:
      "This collapses tension into alarm. The 1st-house baseline is still moderate, and no single house is decisive.",
    correct: false,
  },
  honest: {
    label: "Moderately resilient overall, with some harder-won areas worth attention.",
    feedback:
      "Correct. This compresses the synthesis without distorting it: baseline named, tension held, no false binary.",
    correct: true,
  },
};

const MISTAKES = [
  {
    label: "Weighting all four houses equally",
    wrong: "The 6th, 8th, or 12th is treated as carrying the same primary weight as the 1st.",
    right:
      "The 1st house is the baseline; the three dusthānas modulate it, not compete with it.",
  },
  {
    label: "Resolving tension by picking the most favourable house",
    wrong: "When houses disagree, only the favourable ones are mentioned.",
    right:
      "Hold tension honestly — a textured, mixed statement is more useful than an artificially clean one.",
  },
  {
    label: "Collapsing synthesis into a false binary under pressure",
    wrong: "'Just tell me if I'm fine' produces an oversimplified yes/no.",
    right:
      "Compress honestly — brevity does not require binary simplification.",
  },
];

const PRESETS: Record<
  PresetKey,
  {
    label: string;
    strengths: Record<HouseKey, Strength>;
    aspects: Record<HouseKey, Aspect>;
    note: string;
    color: string;
  }
> = {
  "chart-h1": {
    label: "Chart H1",
    strengths: { 1: "moderate", 6: "moderate", 8: "moderate", 12: "weak" },
    aspects: { 1: "none", 6: "none", 8: "none", 12: "none" },
    note: "Moderate baseline with mixed dusthānas — the lesson's main tension case.",
    color: GOLD,
  },
  convergent: {
    label: "Fully convergent",
    strengths: { 1: "strong", 6: "strong", 8: "strong", 12: "strong" },
    aspects: { 1: "benefic", 6: "benefic", 8: "benefic", 12: "benefic" },
    note: "All houses agree toward resilience — still tendency-framed, not a guarantee.",
    color: GREEN,
  },
  divergent: {
    label: "Fully divergent",
    strengths: { 1: "strong", 6: "weak", 8: "moderate", 12: "weak" },
    aspects: { 1: "benefic", 6: "malefic", 8: "malefic", 12: "malefic" },
    note: "Strong baseline but the dusthānas pull in different directions — practise holding tension.",
    color: VERMILION,
  },
};

export function HealthHouseSynthesisWorkbench() {
  const [strengths, setStrengths] = useState<Record<HouseKey, Strength>>({
    1: "moderate",
    6: "moderate",
    8: "moderate",
    12: "weak",
  });
  const [aspects, setAspects] = useState<Record<HouseKey, Aspect>>({
    1: "none",
    6: "none",
    8: "none",
    12: "none",
  });
  const [selectedCompression, setSelectedCompression] = useState<CompressionKey | null>(null);
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const applyPreset = (key: PresetKey) => {
    const p = PRESETS[key];
    setStrengths({ ...p.strengths });
    setAspects({ ...p.aspects });
    setSelectedCompression(null);
  };

  const reset = () => {
    setStrengths({ 1: "moderate", 6: "moderate", 8: "moderate", 12: "weak" });
    setAspects({ 1: "none", 6: "none", 8: "none", 12: "none" });
    setSelectedCompression(null);
    setShowSloka(false);
    setOpenMistakes({});
  };

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const synthesis = useMemo(() => {
    const first = strengths[1];
    const dusthanaStrengths = [strengths[6], strengths[8], strengths[12]];
    const firstScore = STRENGTHS[first].score;
    const dusthanaScores = dusthanaStrengths.map((s) => STRENGTHS[s].score);
    const dusthanaNames = ["6th", "8th", "12th"];

    // Determine convergence / tension among dusthanas
    const allDusthanaSame = dusthanaStrengths.every((s) => s === dusthanaStrengths[0]);
    const dusthanaAlignedWithFirst = dusthanaScores.every((s) => s === firstScore);

    let pattern: "convergent" | "tension" | "mixed" = "mixed";
    if (allDusthanaSame && dusthanaAlignedWithFirst) pattern = "convergent";
    else if (!allDusthanaSame) pattern = "tension";

    const baselineText =
      first === "strong"
        ? "The constitutional baseline is resilient."
        : first === "moderate"
          ? "The constitutional baseline is moderately resilient."
          : "The constitutional baseline is less resilient and needs more support.";

    const dusthanaTexts = dusthanaNames.map((name, i) => {
      const houseKey = ([6, 8, 12] as HouseKey[])[i];
      const s = dusthanaStrengths[i];
      const a = aspects[houseKey];
      const aspectNote =
        a === "benefic"
          ? "A benefic aspect supports the favourable side."
          : a === "malefic"
            ? "A malefic aspect tempers the favourable reading."
            : "";
      const base =
        s === "strong"
          ? `The ${name} house modulates toward managing its domain well`
          : s === "moderate"
            ? `The ${name} house modulates in a mixed way`
            : `The ${name} house modulates toward harder-won outcomes`;
      return aspectNote ? `${base}; ${aspectNote}` : base;
    });

    const closing =
      pattern === "convergent"
        ? "The houses converge: this is the strongest, most confidently-tendency-framed statement the evidence permits, though still not a guarantee."
        : pattern === "tension"
          ? "The houses are in tension. Hold all four readings together rather than smoothing them into one artificially clean verdict."
          : "The picture is mixed; read each house proportionately and state the overall shape without overclaim.";

    return { pattern, baselineText, dusthanaTexts, closing };
  }, [strengths, aspects]);

  return (
    <div data-interactive="health-house-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Health-house synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Permutations and aspects
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860, fontWeight: 400 }}>
              Read the 1st, 6th, 8th, and 12th as one picture. The 1st is the baseline; the dusthānas modulate it.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ padding: "0.85rem", borderRadius: 8, background: `${GOLD}10`, border: `1px solid ${GOLD}55` }}>
        <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontWeight: 500 }}>
          Weighting principle: 1st house first
        </p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
          The 1st house is the constitutional baseline. The 6th, 8th, and 12th describe how that baseline meets struggle, transformation, and loss — they do not compete with or override the 1st.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>House strength builder</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Set each house&apos;s strength
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {([1, 6, 8, 12] as HouseKey[]).map((h) => {
              const house = HOUSES[h];
              return (
                <div key={h} style={{ border: `1px solid ${house.color}44`, borderRadius: 8, padding: "0.75rem", background: `${house.color}08` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: house.color, fontWeight: 600 }}>
                      <CircleDot size={16} />
                      {house.label} — {house.register}
                    </span>
                    <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{STRENGTHS[strengths[h]].label}</span>
                  </div>
                  <p style={{ margin: "0 0 0.5rem", color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.45 }}>{house.description}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                    {(["strong", "moderate", "weak"] as Strength[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={strengths[h] === value}
                        onClick={() => setStrengths((prev) => ({ ...prev, [h]: value }))}
                        style={strengthChipStyle(strengths[h] === value, STRENGTHS[value].color, value)}
                      >
                        {STRENGTHS[value].label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Aspect layer" icon={<Sparkles size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Aspects modulate the house/lord reading. They add support or pressure, but do not replace dignity work.
            </p>
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.7rem" }}>
              {([1, 6, 8, 12] as HouseKey[]).map((h) => (
                <div key={h}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <span style={{ color: HOUSES[h].color, fontWeight: 500, fontSize: "0.9rem" }}>{HOUSES[h].label}</span>
                    <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{ASPECTS[aspects[h]].label}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.35rem" }}>
                    {(["none", "benefic", "malefic"] as Aspect[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={aspects[h] === value}
                        onClick={() => setAspects((prev) => ({ ...prev, [h]: value }))}
                        style={aspectChipStyle(aspects[h] === value, ASPECTS[value].color, value)}
                      >
                        {ASPECTS[value].label.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.7rem", padding: "0.6rem", borderRadius: 8, background: `${BLUE}10`, border: `1px solid ${BLUE}55` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.5 }}>
                Benefic aspects support the favourable side of a house; malefic aspects temper it. Aspects layer onto dignity, never replace it.
              </p>
            </div>
          </Panel>

          <Panel title="Presets" icon={<Scale size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.entries(PRESETS) as [PresetKey, typeof PRESETS["chart-h1"]][]).map(([key, p]) => (
                <button key={key} type="button" onClick={() => applyPreset(key)} style={presetButtonStyle(p.color)}>
                  <span style={{ fontWeight: 500 }}>{p.label}</span>
                  <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>{p.note}</span>
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <section style={{ ...panelStyle, borderColor: synthesisPatternColor(synthesis.pattern), background: `${synthesisPatternColor(synthesis.pattern)}08` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Live synthesis</p>
          <span style={{ padding: "0.35rem 0.65rem", borderRadius: 8, background: `${synthesisPatternColor(synthesis.pattern)}18`, color: synthesisPatternColor(synthesis.pattern), fontSize: "0.82rem", fontWeight: 600 }}>
            {synthesis.pattern === "convergent" ? "Convergence" : synthesis.pattern === "tension" ? "Tension" : "Mixed picture"}
          </span>
        </div>
        <h3 style={{ margin: "0.15rem 0 0.6rem", color: synthesisPatternColor(synthesis.pattern), fontSize: "1.1rem", fontWeight: 600 }}>
          {synthesis.pattern === "convergent"
            ? "Houses agree"
            : synthesis.pattern === "tension"
              ? "Houses disagree"
              : "Houses point in different directions"}
        </h3>
        <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 400 }}>{synthesis.baselineText}</p>
        <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {synthesis.dusthanaTexts.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
        <p style={{ margin: "0.75rem 0 0", color: INK_PRIMARY, lineHeight: 1.55, fontWeight: 500 }}>{synthesis.closing}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.84rem", lineHeight: 1.5 }}>
          This is a constitutional-tendency picture, not a diagnosis, illness prediction, or longevity computation.
        </p>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>One-sentence compression trainer</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          &quot;Can you just tell me if I&apos;m fine or not?&quot;
        </h3>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
          Choose the compressed summary that best preserves the synthesis discipline.
        </p>
        <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.7rem" }}>
          {(Object.entries(COMPRESSIONS) as [CompressionKey, typeof COMPRESSIONS.honest][]).map(([key, c]) => (
            <button
              key={key}
              type="button"
              aria-pressed={selectedCompression === key}
              onClick={() => setSelectedCompression(key)}
              style={compressionButtonStyle(selectedCompression === key, c.correct && selectedCompression === key ? GREEN : VERMILION)}
            >
              {c.label}
            </button>
          ))}
        </div>
        {selectedCompression && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${COMPRESSIONS[selectedCompression].correct ? GREEN : VERMILION}10`, border: `1px solid ${COMPRESSIONS[selectedCompression].correct ? GREEN : VERMILION}55` }}>
            <p style={{ margin: 0, color: COMPRESSIONS[selectedCompression].correct ? GREEN : VERMILION, fontWeight: 500 }}>
              {COMPRESSIONS[selectedCompression].correct ? "Honest compression" : "Distortion detected"}
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{COMPRESSIONS[selectedCompression].feedback}</p>
          </div>
        )}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <p style={eyebrowStyle}>Teaching verse</p>
            <button type="button" aria-pressed={showSloka} onClick={() => setShowSloka((v) => !v)} style={smallChipStyle(showSloka, GOLD)}>
              {showSloka ? "Hide verse" : "Show verse"}
            </button>
          </div>
          {showSloka && (
            <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
              <p style={{ margin: 0, fontStyle: "italic" }}>
                na bhāvam ekaṁ dṛṣṭvaiva phalaṁ vadati paṇḍitaḥ |<br />
                sarva-bhāva-samāyogāt samyak nirṇayam āpnuyāt ||
              </p>
              <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
                &quot;The wise one does not declare a result having seen a single house alone; through the combination of all the houses together, one arrives at a sound judgement.&quot;
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
                Composite paraphrase of the BPHS synthesis principle.
              </p>
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Common mistakes</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Hold the synthesis discipline</h3>
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
                      <p style={{ margin: 0, color: VERMILION }}><span style={{ fontWeight: 500 }}>Overclaim:</span> {item.wrong}</p>
                      <p style={{ margin: "0.35rem 0 0" }}><span style={{ fontWeight: 500, color: GREEN }}>Honest reading:</span> {item.right}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function synthesisPatternColor(pattern: "convergent" | "tension" | "mixed"): string {
  return pattern === "convergent" ? GREEN : pattern === "tension" ? VERMILION : GOLD;
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem", boxShadow: SHADOW }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
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

function strengthChipStyle(active: boolean, color: string, value: Strength): CSSProperties {
  const alpha = value === "weak" ? "0D" : value === "moderate" ? "14" : "22";
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : `${color}${alpha}`,
    color: active ? "#fff" : color,
    padding: "0.45rem",
    fontWeight: 500,
    cursor: "pointer",
    textTransform: "capitalize",
  };
}

function aspectChipStyle(active: boolean, color: string, value: Aspect): CSSProperties {
  const alpha = value === "malefic" ? "0D" : value === "benefic" ? "14" : "0D";
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : `${color}${alpha}`,
    color: active ? "#fff" : color,
    padding: "0.4rem",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: "0.82rem",
  };
}

function presetButtonStyle(color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${color}66`,
    borderRadius: 8,
    background: `${color}10`,
    color,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

function compressionButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}10` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.7rem",
    fontWeight: 500,
    cursor: "pointer",
    lineHeight: 1.45,
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
