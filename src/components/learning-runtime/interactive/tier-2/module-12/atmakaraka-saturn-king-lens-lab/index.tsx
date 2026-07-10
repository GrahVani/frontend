"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Crown, GitCompare, MapPinned, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type PanelKey = "ranking" | "separation" | "convergence" | "forward";
type GrahaKey = "Saturn" | "Jupiter" | "Venus" | "Moon" | "Mercury" | "Sun" | "Mars";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const BASE_GRAHAS: Array<{ key: GrahaKey; degree: number; sign: string; color: string }> = [
  { key: "Saturn", degree: 27, sign: "Capricorn", color: GREEN },
  { key: "Jupiter", degree: 20, sign: "Sagittarius", color: BLUE },
  { key: "Venus", degree: 18, sign: "Aquarius", color: GOLD },
  { key: "Moon", degree: 15, sign: "Pisces", color: PURPLE },
  { key: "Mercury", degree: 12, sign: "Libra", color: GREEN },
  { key: "Sun", degree: 10, sign: "Leo", color: VERMILION },
  { key: "Mars", degree: 8, sign: "Gemini", color: VERMILION },
];

const PANELS: Record<PanelKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  ranking: {
    label: "Ranking",
    title: "Degree alone selects the king",
    body: "Among the seven grahas, the highest within-sign degree receives the Atmakaraka crown. Dignity is not part of this selection step.",
    icon: <Crown size={16} />,
    color: GOLD,
  },
  separation: {
    label: "Separate",
    title: "Selection and condition are two facts",
    body: "Saturn is AK because 27 degrees is highest. Saturn is also own-sign in its own 9th house. Both are true, but neither explains the other.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  convergence: {
    label: "Converge",
    title: "One degree expresses through four lenses",
    body: "AK status, D20 exaltation, D60 outlier, and the shared D1 degree are traceable findings, not a dignity-caused selection story.",
    icon: <Orbit size={16} />,
    color: PURPLE,
  },
  forward: {
    label: "Forward",
    title: "AK leads to Karakamsha",
    body: "Saturn's D9 sign is Virgo. That becomes the Karakamsha-Lagna, the starting point for the next lesson.",
    icon: <MapPinned size={16} />,
    color: GREEN,
  },
};

const CONVERGENCE = [
  { label: "AK", body: "Saturn has the highest seven-graha degree.", color: GOLD },
  { label: "D20", body: "Saturn is exalted in Libra in the mantra house.", color: GREEN },
  { label: "D60", body: "Saturn index 55 is the high-end outlier.", color: PURPLE },
  { label: "D1", body: "All three trace to Saturn's 27 degree position.", color: BLUE },
] as const;

export function AtmakarakaSaturnKingLensLab() {
  const [panelKey, setPanelKey] = useState<PanelKey>("ranking");
  const [jupiterDegree, setJupiterDegree] = useState(20);
  const [degreeOnly, setDegreeOnly] = useState(true);
  const [separateDignity, setSeparateDignity] = useState(true);
  const [avoidCauseStory, setAvoidCauseStory] = useState(true);
  const [dispositionOnly, setDispositionOnly] = useState(true);

  const ranked = useMemo(() => {
    return BASE_GRAHAS.map((graha) => (graha.key === "Jupiter" ? { ...graha, degree: jupiterDegree } : graha)).sort((a, b) => b.degree - a.degree);
  }, [jupiterDegree]);

  const ak = ranked[0];
  const panel = PANELS[panelKey];
  const saturnIsAk = ak.key === "Saturn";

  const status = useMemo(() => {
    if (!degreeOnly) return { label: "selection rule polluted", color: VERMILION };
    if (!separateDignity) return { label: "selection and condition merged", color: GOLD };
    if (!avoidCauseStory) return { label: "false cause story", color: GOLD };
    if (!dispositionOnly) return { label: "destiny overclaim", color: VERMILION };
    return { label: saturnIsAk ? "Saturn crowned correctly" : "Jupiter hypothetical active", color: saturnIsAk ? GREEN : BLUE };
  }, [avoidCauseStory, degreeOnly, dispositionOnly, saturnIsAk, separateDignity]);

  const reading = useMemo(() => {
    if (!degreeOnly) return "Select the Atmakaraka by degree alone. Do not use dignity, house, or preference to choose the king.";
    if (!separateDignity) return "Say the two facts separately: Saturn is AK by degree; Saturn is own-sign in the 9th by placement.";
    if (!avoidCauseStory) return "Do not say dignity caused AK status. The shared cause of the convergence is Saturn's 27 degree position, not own-sign dignity.";
    if (!dispositionOnly) return "Read Saturn as a disciplined dharma orientation, not as a guaranteed or singular destiny.";
    if (!saturnIsAk) return "In this hypothetical, Jupiter becomes AK because its degree is now highest. Saturn's own-sign 9th-house dignity remains unchanged.";
    return "Chart S1: Saturn is AK by degree alone. Its own-sign 9th-house dignity is separate, and the four-technique Saturn convergence is now fully confirmed.";
  }, [avoidCauseStory, degreeOnly, dispositionOnly, saturnIsAk, separateDignity]);

  return (
    <div data-interactive="atmakaraka-saturn-king-lens-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Atmakaraka king lens</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Crown the king by degree, then read dignity as a separate condition
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Rank the seven grahas for Chart S1, test the Jupiter hypothetical, and keep Saturn selection, dignity, convergence, and Karakamsha link in separate lanes.
            </p>
          </div>
          <span
            style={{
              border: `1px solid ${status.color}`,
              color: status.color,
              borderRadius: 999,
              padding: "0.42rem 0.68rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: "color-mix(in srgb, currentColor 8%, transparent)",
              whiteSpace: "nowrap",
            }}
          >
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.8fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Seven-graha degree ranking</p>
          <RankingDiagram ranked={ranked} />
          <div style={{ marginTop: "0.9rem" }}>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Jupiter hypothetical degree: {jupiterDegree} deg
              <input type="range" min={20} max={29} step={1} value={jupiterDegree} onChange={(event) => setJupiterDegree(Number(event.target.value))} aria-label="Jupiter hypothetical degree" />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.6rem", marginTop: "0.9rem" }}>
            <FactCard label="Selection" body={`${ak.key} is AK because ${ak.degree} deg is highest.`} color={ak.color} />
            <FactCard label="Condition" body="Saturn remains own-sign in its own 9th house." color={GREEN} />
            <FactCard label="Forward link" body="Saturn D9 sign Virgo becomes Karakamsha." color={BLUE} />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Discipline toggles</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={degreeOnly} onChange={setDegreeOnly} label="Select by degree only" icon={<Crown size={16} />} />
            <ToggleRow checked={separateDignity} onChange={setSeparateDignity} label="Keep dignity separate" icon={<GitCompare size={16} />} />
            <ToggleRow checked={avoidCauseStory} onChange={setAvoidCauseStory} label="Avoid dignity-cause story" icon={<Scale size={16} />} />
            <ToggleRow checked={dispositionOnly} onChange={setDispositionOnly} label="Read disposition, not destiny" icon={<ShieldCheck size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setPanelKey("ranking");
              setJupiterDegree(20);
              setDegreeOnly(true);
              setSeparateDignity(true);
              setAvoidCauseStory(true);
              setDispositionOnly(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.6rem" }}>
          {(Object.keys(PANELS) as PanelKey[]).map((key) => {
            const item = PANELS[key];
            const active = key === panelKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPanelKey(key)}
                style={{
                  ...buttonReset,
                  border: `1px solid ${active ? item.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent",
                  color: active ? item.color : INK_SECONDARY,
                  padding: "0.75rem",
                  minHeight: 96,
                }}
                aria-pressed={active}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.38rem", fontSize: "0.78rem", fontWeight: 600 }}>
                  {item.icon}
                  {item.label}
                </span>
                <span style={{ display: "block", marginTop: "0.4rem", color: active ? INK_PRIMARY : INK_SECONDARY, lineHeight: 1.35 }}>{item.title}</span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{panel.body}</p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Four-technique convergence</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.75rem", marginTop: "0.85rem" }}>
          {CONVERGENCE.map((item) => (
            <article key={item.label} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: "rgba(255,255,255,0.32)" }}>
              <p style={{ margin: 0, color: item.color, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{item.label}</p>
              <p style={{ margin: "0.28rem 0 0", color: INK_SECONDARY, lineHeight: 1.48, fontSize: "0.92rem" }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN || status.color === BLUE ? <Sparkles size={20} /> : <TriangleAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Reading statement</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactCard({ label, body, color }: { label: string; body: string; color: string }) {
  return (
    <article style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: "rgba(255,255,255,0.32)" }}>
      <p style={{ margin: 0, color, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: "0.28rem 0 0", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.9rem" }}>{body}</p>
    </article>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        border: `1px solid ${checked ? GREEN : HAIRLINE}`,
        borderRadius: 8,
        padding: "0.62rem 0.7rem",
        color: checked ? INK_PRIMARY : INK_MUTED,
        cursor: "pointer",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>
        {icon}
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function RankingDiagram({ ranked }: { ranked: Array<{ key: GrahaKey; degree: number; sign: string; color: string }> }) {
  const maxDegree = 30;
  return (
    <svg viewBox="0 0 620 250" role="img" aria-label="Atmakaraka degree ranking diagram" style={{ width: "100%", height: "auto", marginTop: "0.8rem" }}>
      <rect x="8" y="8" width="604" height="232" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <text x="310" y="32" textAnchor="middle" fontSize="12" fill={INK_MUTED}>
        highest within-sign degree receives the crown
      </text>
      {ranked.map((graha, index) => {
        const y = 58 + index * 25;
        const width = (graha.degree / maxDegree) * 430;
        const crowned = index === 0;
        return (
          <g key={graha.key}>
            <text x="36" y={y + 5} fontSize="12" fill={crowned ? graha.color : INK_SECONDARY}>
              {index + 1}. {graha.key}
            </text>
            <rect x="150" y={y - 11} width="430" height="16" rx="8" fill="rgba(255,255,255,0.5)" stroke={HAIRLINE} />
            <rect x="150" y={y - 11} width={width} height="16" rx="8" fill={graha.color} opacity={crowned ? 0.92 : 0.5} />
            <text x="590" y={y + 4} textAnchor="end" fontSize="11" fill={INK_MUTED}>
              {graha.degree} deg
            </text>
            {crowned ? <Crown x={118} y={y - 17} width={18} height={18} color={GOLD} /> : null}
          </g>
        );
      })}
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 600,
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
};

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.55rem 0.72rem",
  fontSize: "0.86rem",
  fontWeight: 600,
};
