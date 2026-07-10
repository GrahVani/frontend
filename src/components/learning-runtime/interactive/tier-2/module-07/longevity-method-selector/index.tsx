"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Info,
  Moon,
  RotateCcw,
  Scale,
  Sun,
  UserRound,
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

type Factor = "lagna" | "sun" | "moon";
type Strength = "weak" | "moderate" | "strong";
type MethodKey = "amsa" | "pinda" | "naisargika";

const FACTORS: Record<
  Factor,
  { label: string; icon: ReactNode; color: string; method: MethodKey }
> = {
  lagna: { label: "Lagna", icon: <UserRound size={18} aria-hidden="true" />, color: BLUE, method: "amsa" },
  sun: { label: "Sun", icon: <Sun size={18} aria-hidden="true" />, color: GOLD, method: "pinda" },
  moon: { label: "Moon", icon: <Moon size={18} aria-hidden="true" />, color: PURPLE, method: "naisargika" },
};

const METHODS: Record<
  MethodKey,
  {
    name: string;
    devanagari: string;
    trigger: string;
    color: string;
    description: string;
  }
> = {
  pinda: {
    name: "Piṇḍāyu",
    devanagari: "पिण्डायुः",
    trigger: "Sun strongest",
    color: GOLD,
    description: "Computed from each planet's position relative to its exaltation degree, with reduction (harana) factors.",
  },
  amsa: {
    name: "Aṁśāyu",
    devanagari: "अंशायुः",
    trigger: "Lagna strongest",
    color: BLUE,
    description: "Computed from navāṁśa-scale positions of the planets and lagna, with its own increase and reduction rules.",
  },
  naisargika: {
    name: "Naisargikāyu",
    devanagari: "नैसर्गिकायुः",
    trigger: "Moon strongest",
    color: PURPLE,
    description: "Uses the same arc formula as Piṇḍāyu, but with a different natural base-year table per planet.",
  },
};

const STRENGTHS: Record<Strength, { label: string; score: number; color: string }> = {
  weak: { label: "Weak", score: 1, color: VERMILION },
  moderate: { label: "Moderate", score: 2, color: GOLD },
  strong: { label: "Strong", score: 3, color: GREEN },
};

const DEFAULT_STRENGTHS: Record<Factor, Strength> = {
  lagna: "moderate",
  sun: "moderate",
  moon: "strong",
};

const PRESETS: Record<string, Record<Factor, Strength>> = {
  "chart-h1": DEFAULT_STRENGTHS,
  "lagna-dominant": { lagna: "strong", sun: "moderate", moon: "moderate" },
  "sun-dominant": { lagna: "moderate", sun: "strong", moon: "moderate" },
  "moon-dominant": { lagna: "moderate", sun: "moderate", moon: "strong" },
  "all-comparable": { lagna: "strong", sun: "strong", moon: "strong" },
  "lagna-sun-tie": { lagna: "strong", sun: "strong", moon: "moderate" },
};

const MISTAKES = [
  {
    label: "Averaging all three methods by default",
    wrong: "Every chart's longevity is computed as a simple average of all three methods.",
    right:
      "Apply the selection rule first; reserve averaging for genuinely comparable-strength cases.",
  },
  {
    label: "Selecting the method after computing all three",
    wrong: "All three methods are computed first, then the primary is chosen based on the result.",
    right:
      "Select the primary method before computation, based on which of Lagna/Sun/Moon is strongest.",
  },
  {
    label: "Forgetting the chapter's ethical frame",
    wrong: "The computed number is treated as a client-facing age or life expectancy.",
    right:
      "Every figure is for the practitioner's silent, internal calibration only — never a client-facing number.",
  },
];

export function LongevityMethodSelector() {
  const [strengths, setStrengths] = useState<Record<Factor, Strength>>(DEFAULT_STRENGTHS);
  const [clientFacing, setClientFacing] = useState(false);
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const applyPreset = (key: keyof typeof PRESETS) => setStrengths({ ...PRESETS[key] });

  const reset = () => {
    setStrengths(DEFAULT_STRENGTHS);
    setClientFacing(false);
    setShowSloka(false);
    setOpenMistakes({});
  };

  const setFactorStrength = (factor: Factor, value: Strength) =>
    setStrengths((prev) => ({ ...prev, [factor]: value }));

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const { primaryMethods, tiedFactors, hasTie, maxScore } = useMemo(() => {
    const entries = (Object.entries(strengths) as [Factor, Strength][]).map(
      ([factor, strength]) => ({ factor, strength, score: STRENGTHS[strength].score })
    );
    const max = Math.max(...entries.map((e) => e.score));
    const tied = entries.filter((e) => e.score === max);
    const methods = tied.map((e) => FACTORS[e.factor].method);
    return {
      primaryMethods: methods,
      tiedFactors: tied.map((e) => e.factor),
      hasTie: tied.length > 1,
      maxScore: max,
    };
  }, [strengths]);

  const primaryMethod = primaryMethods[0];

  return (
    <div data-interactive="longevity-method-selector" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Longevity computation — chapter opener</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Choose the method before the arithmetic
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              BPHS ties the primary longevity method to whichever of Lagna, Sun, or Moon is strongest. This tool practises that choice before any formula is introduced.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Strength builder</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            Set Lagna, Sun, and Moon strength
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.88rem" }}>
            Use a simplified dignity-and-placement comparison. Full Ṣaḍbala is the most rigorous way; this is enough to learn the rule.
          </p>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            {(Object.entries(FACTORS) as [Factor, typeof FACTORS.lagna][]).map(([factor, data]) => (
              <div
                key={factor}
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 8,
                  padding: "0.75rem",
                  background: SURFACE,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.45rem" }}>
                  <span style={{ color: data.color }}>{data.icon}</span>
                  <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{data.label}</span>
                  <span style={{ marginLeft: "auto", color: STRENGTHS[strengths[factor]].color, fontSize: "0.85rem", fontWeight: 500 }}>
                    {STRENGTHS[strengths[factor]].label}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                  {(["weak", "moderate", "strong"] as Strength[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={strengths[factor] === value}
                      onClick={() => setFactorStrength(factor, value)}
                      style={strengthChipStyle(strengths[factor] === value, STRENGTHS[value].color)}
                    >
                      {STRENGTHS[value].label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "0.85rem" }}>
            <p style={eyebrowStyle}>Presets</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.55rem" }}>
              <button type="button" onClick={() => applyPreset("chart-h1")} style={presetButtonStyle(PURPLE)}>
                Chart H1
              </button>
              <button type="button" onClick={() => applyPreset("lagna-dominant")} style={presetButtonStyle(BLUE)}>
                Lagna dominant
              </button>
              <button type="button" onClick={() => applyPreset("sun-dominant")} style={presetButtonStyle(GOLD)}>
                Sun dominant
              </button>
              <button type="button" onClick={() => applyPreset("moon-dominant")} style={presetButtonStyle(PURPLE)}>
                Moon dominant
              </button>
              <button type="button" onClick={() => applyPreset("all-comparable")} style={presetButtonStyle(GREEN)}>
                All comparable
              </button>
              <button type="button" onClick={() => applyPreset("lagna-sun-tie")} style={presetButtonStyle(GOLD)}>
                Lagna–Sun tie
              </button>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          {(Object.entries(METHODS) as [MethodKey, typeof METHODS.pinda][]).map(([key, method]) => {
            const isPrimary = primaryMethods.includes(key);
            return (
              <div
                key={key}
                style={{
                  border: `1px solid ${isPrimary ? method.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: isPrimary ? `${method.color}0A` : SURFACE,
                  padding: "0.85rem",
                  boxShadow: isPrimary ? SHADOW : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span style={{ color: method.color, fontWeight: 600, fontSize: "1.05rem" }}>
                    {method.name}{" "}
                    <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>({method.devanagari})</span>
                  </span>
                  {isPrimary && (
                    <span style={{ padding: "0.2rem 0.5rem", borderRadius: 6, background: `${method.color}18`, color: method.color, fontSize: "0.75rem", fontWeight: 500 }}>
                      {hasTie ? "Averaged" : "Primary"}
                    </span>
                  )}
                </div>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5, fontWeight: 400 }}>
                  {method.description}
                </p>
                <p style={{ margin: "0.45rem 0 0", color: method.color, fontSize: "0.82rem", fontWeight: 500 }}>
                  Trigger: {method.trigger}
                </p>
              </div>
            );
          })}
        </section>
      </div>

      <section style={{ ...panelStyle, borderColor: hasTie ? `${GOLD}66` : `${METHODS[primaryMethod].color}66`, background: hasTie ? `${GOLD}0A` : `${METHODS[primaryMethod].color}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.75rem" }}>
          <Scale size={24} aria-hidden="true" style={{ color: hasTie ? GOLD : METHODS[primaryMethod].color, flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: hasTie ? GOLD : METHODS[primaryMethod].color, fontWeight: 600, fontSize: "1.1rem" }}>
              {hasTie
                ? "Averaging rule applies"
                : `${METHODS[primaryMethod].name} is primary`}
            </p>
            <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
              {hasTie
                ? `${tiedFactors.map((f) => FACTORS[f].label).join(" and ")} are equally strong at score ${maxScore}. Average the corresponding methods: ${primaryMethods.map((m) => METHODS[m].name).join(" and ")}.`
                : `${FACTORS[tiedFactors[0]].label} is the strongest factor, so ${METHODS[primaryMethod].name} is the primary method. Compute this first; the others remain cross-checks.`}
            </p>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Ethical frame</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
          What is the computed number for?
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            type="button"
            aria-pressed={!clientFacing}
            onClick={() => setClientFacing(false)}
            style={smallChipStyle(!clientFacing, GREEN)}
          >
            Silent internal calibration
          </button>
          <button
            type="button"
            aria-pressed={clientFacing}
            onClick={() => setClientFacing(true)}
            style={smallChipStyle(clientFacing, VERMILION)}
          >
            Client-facing number
          </button>
        </div>
        {clientFacing ? (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55` }}>
            <p style={{ margin: 0, color: VERMILION, fontWeight: 500 }}>Discipline warning</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              This chapter&apos;s numbers are never spoken to a client as an age, life expectancy, or death-date. They inform the practitioner&apos;s own silent calibration only.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}55` }}>
            <p style={{ margin: 0, color: GREEN, fontWeight: 500 }}>Correct frame</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              A longer figure may modestly increase confidence in certain readings; a shorter one may increase attentiveness to caution-appropriate framing — internally, silently, never disclosed.
            </p>
          </div>
        )}
      </section>

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
              lagna-sūryendu-ṣu yo balī tat-paddhatiḥ pradhānā |<br />
              tulya-bale tu saṁyojya phalam ekaṁ prakalpayet ||
            </p>
            <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
              &quot;Among Lagna, Sun, and Moon, whichever is strong — that one&apos;s method is primary. When equal in strength, combine them and form a single result.&quot;
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
              Composite teaching paraphrase of the BPHS choice-of-method and averaging doctrine, not a verbatim quotation.
            </p>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Hold the selection discipline
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

function strengthChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : `${color}14`,
    color: active ? "#fff" : color,
    padding: "0.45rem",
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
