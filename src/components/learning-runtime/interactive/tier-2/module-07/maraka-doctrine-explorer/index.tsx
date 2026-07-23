"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCcw,
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
type Nature = "benefic" | "malefic";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORDS: Record<number, PlanetKey> = {
  0: "mars", 1: "venus", 2: "mercury", 3: "moon", 4: "sun", 5: "mercury",
  6: "venus", 7: "mars", 8: "jupiter", 9: "saturn", 10: "saturn", 11: "jupiter",
};

const PLANET_INFO: Record<PlanetKey, { label: string; color: string; nature: Nature }> = {
  sun: { label: "Sun", color: VERMILION, nature: "malefic" },
  moon: { label: "Moon", color: BLUE, nature: "benefic" },
  mars: { label: "Mars", color: VERMILION, nature: "malefic" },
  mercury: { label: "Mercury", color: GREEN, nature: "benefic" },
  jupiter: { label: "Jupiter", color: GREEN, nature: "benefic" },
  venus: { label: "Venus", color: GOLD, nature: "benefic" },
  saturn: { label: "Saturn", color: PURPLE, nature: "malefic" },
};

const MISTAKES = [
  {
    label: "Treating \"maraka\" as meaning \"will cause death\"",
    wrong: "A learner reads \"maraka = killer house\" and concludes that a maraka planet's daśā automatically signals grave danger.",
    right: "Maraka is a structural classification assigned by house-lordship; it must be read alongside strength, affliction, and timing — never, by itself, a prediction.",
  },
  {
    label: "Assuming only natural malefics can be marakas",
    wrong: "A learner searches only Sun/Mars/Saturn for maraka candidates and overlooks a benefic 2nd or 7th lord.",
    right: "Identify the 2nd/7th lord first, by lordship, regardless of natural character; assess severity as a separate, second step.",
  },
  {
    label: "Forgetting to check the Dwi-Maraka Na Maraka exception",
    wrong: "For an Aries- or Libra-lagna chart, a learner names Venus or Mars as \"the maraka\" without checking that this planet rules both houses and is therefore exempt.",
    right: "Always check whether the 2nd and 7th lords are the same planet before proceeding; if they are, the analysis looks to the 8th lord and house-occupants instead.",
  },
];

const CHAIN_STEPS = [
  {
    label: "8th house",
    note: "Direct house of longevity (āyu).",
    color: BLUE,
  },
  {
    label: "3rd house",
    note: "8th-from-the-8th — the continuation of longevity.",
    color: GOLD,
  },
  {
    label: "2nd house",
    note: "12th-from-the-3rd — loss of longevity continuance.",
    color: VERMILION,
  },
  {
    label: "7th house",
    note: "12th-from-the-8th — loss of longevity itself.",
    color: VERMILION,
  },
];

export function MarakaDoctrineExplorer() {
  const [lagna, setLagna] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [severityMode, setSeverityMode] = useState<Nature>("benefic");
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const secondSign = (lagna + 1) % 12;
  const seventhSign = (lagna + 6) % 12;
  const secondLord = SIGN_LORDS[secondSign];
  const seventhLord = SIGN_LORDS[seventhSign];
  const sameLord = secondLord === seventhLord;

  const toggleMistake = (index: number) => setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));
  const reset = () => {
    setLagna(0);
    setActiveStep(0);
    setSeverityMode("benefic");
    setOpenMistakes({});
  };

  return (
    <div data-interactive="maraka-doctrine-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Maraka doctrine explorer</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Why the 2nd and 7th houses are called maraka sthānas
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              Maraka is a structural classification by house-lordship, not a prediction. Trace the classical derivation, test any lagna, and see the one clean exception.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Definition</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
            Maraka = structural, not predictive
          </h3>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
            From Sanskrit <em>mṛ</em> (&quot;to die&quot;), <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>maraka</strong> names a planet that rules a maraka house. It identifies heightened significance for longevity-related timing analysis — never, by itself, an assertion that something will happen.
          </p>
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Dwi-Maraka Na Maraka</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: PURPLE, fontSize: "1.1rem", fontWeight: 600 }}>
            The double-maraka exception
          </h3>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
            If a single planet rules both the 2nd and 7th houses, its maraka potency is cancelled rather than doubled. This applies to exactly two lagnas:
          </p>
          <ul style={{ margin: "0.6rem 0 0", paddingLeft: "1.2rem", color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 400 }}>
            <li><strong style={{ color: VERMILION, fontWeight: 600 }}>Aries lagna</strong> — 2nd Taurus &amp; 7th Libra both ruled by Venus</li>
            <li><strong style={{ color: VERMILION, fontWeight: 600 }}>Libra lagna</strong> — 2nd Scorpio &amp; 7th Aries both ruled by Mars</li>
          </ul>
        </section>
      </div>

      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bhavat-bhavam chain</p>
            <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
              Click each step to see the derivation
            </h3>
          </div>
          <div style={{ display: "flex", gap: "0.45rem" }}>
            {CHAIN_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={activeStep === i}
                onClick={() => setActiveStep(i)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `1px solid ${activeStep === i ? CHAIN_STEPS[i].color : HAIRLINE}`,
                  background: activeStep === i ? CHAIN_STEPS[i].color : "transparent",
                  color: activeStep === i ? "#fff" : INK_SECONDARY,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <ChainSvg activeStep={activeStep} />
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${CHAIN_STEPS[activeStep].color}10`, border: `1px solid ${CHAIN_STEPS[activeStep].color}55` }}>
          <p style={{ margin: 0, color: CHAIN_STEPS[activeStep].color, fontWeight: 500 }}>{CHAIN_STEPS[activeStep].label}</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>{CHAIN_STEPS[activeStep].note}</p>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 0.8fr) minmax(300px, 1fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Lagna inspector</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Pick a lagna to find its maraka lords
          </h3>
          <select
            value={lagna}
            onChange={(e) => setLagna(Number(e.target.value))}
            style={{ width: "100%", padding: "0.55rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, marginBottom: "0.75rem" }}
          >
            {SIGNS.map((s, i) => (
              <option key={s} value={i}>{s} lagna</option>
            ))}
          </select>

          <LagnaWheel lagna={lagna} secondSign={secondSign} seventhSign={seventhSign} />

          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <LordCard title="2nd house" sign={secondSign} lord={secondLord} maraka />
            <LordCard title="7th house" sign={seventhSign} lord={seventhLord} maraka />
          </div>

          {sameLord ? (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${PURPLE}10`, border: `1px solid ${PURPLE}55`, display: "flex", alignItems: "start", gap: "0.6rem" }}>
              <CheckCircle2 size={18} style={{ color: PURPLE, flexShrink: 0 }} />
              <p style={{ margin: 0, color: PURPLE, fontWeight: 500 }}>
                Dwi-Maraka Na Maraka applies: {PLANET_INFO[secondLord].label} rules both houses, so its maraka status is cancelled.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}55`, display: "flex", alignItems: "start", gap: "0.6rem" }}>
              <Info size={18} style={{ color: GREEN, flexShrink: 0 }} />
              <p style={{ margin: 0, color: GREEN, fontWeight: 500 }}>
                Different lords rule the 2nd and 7th. Both {PLANET_INFO[secondLord].label} and {PLANET_INFO[seventhLord].label} are maraka by lordship.
              </p>
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Function vs. severity</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            Lordship decides classification; nature decides sharpness
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <button type="button" aria-pressed={severityMode === "benefic"} onClick={() => setSeverityMode("benefic")} style={smallChipStyle(severityMode === "benefic", GREEN)}>
              Natural benefic as maraka
            </button>
            <button type="button" aria-pressed={severityMode === "malefic"} onClick={() => setSeverityMode("malefic")} style={smallChipStyle(severityMode === "malefic", VERMILION)}>
              Natural malefic as maraka
            </button>
          </div>
          <div style={{ padding: "0.75rem", borderRadius: 8, background: severityMode === "benefic" ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${severityMode === "benefic" ? GREEN : VERMILION}55` }}>
            <p style={{ margin: 0, color: severityMode === "benefic" ? GREEN : VERMILION, fontWeight: 500 }}>
              {severityMode === "benefic" ? "Benefic maraka lord" : "Malefic maraka lord"}
            </p>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
              {severityMode === "benefic"
                ? "Still a maraka, because lordship confers the classification. Its periods tend to manifest more mildly — health disturbance that resolves, financial or relational strain, or other 2nd/7th-house matters — rather than acute danger."
                : "Still classified by lordship, but its periods tend to act more sharply and acutely. The classification is the same; the expected severity is greater."}
            </p>
          </div>
        </section>
      </div>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Three ways this doctrine is misread
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

      <section style={{ ...panelStyle, background: `${VERMILION}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
          <AlertTriangle size={20} aria-hidden="true" style={{ color: VERMILION, flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: VERMILION, fontWeight: 600 }}>Ethical boundary</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Maraka classification is a chart-reading category. It is never, by itself, a death prediction — that separation is the ethical centre of this chapter.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LordCard({ title, sign, lord, maraka }: { title: string; sign: number; lord: PlanetKey; maraka?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: 6, border: `1px solid ${maraka ? VERMILION : HAIRLINE}`, background: maraka ? `${VERMILION}08` : "transparent" }}>
      <div>
        <p style={{ margin: 0, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: INK_MUTED, fontWeight: 600 }}>{title}</p>
        <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontWeight: 500 }}>{SIGNS[sign]}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: INK_MUTED, fontWeight: 600 }}>Lord</p>
        <p style={{ margin: "0.15rem 0 0", color: PLANET_INFO[lord].color, fontWeight: 500 }}>{PLANET_INFO[lord].label}</p>
      </div>
    </div>
  );
}

function LagnaWheel({ lagna, secondSign, seventhSign }: { lagna: number; secondSign: number; seventhSign: number }) {
  const cx = 100;
  const cy = 100;
  const r = 70;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Zodiac wheel highlighting lagna, 2nd, and 7th houses">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      {SIGNS.map((_, i) => {
        const angle = (i - lagna) * 30 * (Math.PI / 180) - Math.PI / 2;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + (r - 15) * Math.cos(angle);
        const y2 = cy + (r - 15) * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth={1} />;
      })}
      {[lagna, secondSign, seventhSign].map((sign, idx) => {
        const angle = (idx === 0 ? 0 : idx === 1 ? 1 : 6) * 30 * (Math.PI / 180) - Math.PI / 2;
        const x = cx + (r - 28) * Math.cos(angle);
        const y = cy + (r - 28) * Math.sin(angle);
        const label = idx === 0 ? "L" : idx === 1 ? "2" : "7";
        const color = idx === 0 ? BLUE : VERMILION;
        return (
          <g key={sign}>
            <circle cx={x} cy={y} r={14} fill={`${color}20`} stroke={color} strokeWidth={2} />
            <text x={x} y={y + 4} textAnchor="middle" fill={color} fontSize="11" fontWeight={600}>{label}</text>
          </g>
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={500}>Lagna at top</text>
    </svg>
  );
}

function ChainSvg({ activeStep }: { activeStep: number }) {
  const nodes = [
    { id: 8, label: "8th", x: 60, y: 80, color: BLUE },
    { id: 3, label: "3rd", x: 180, y: 80, color: GOLD },
    { id: 2, label: "2nd", x: 300, y: 30, color: VERMILION },
    { id: 7, label: "7th", x: 300, y: 130, color: VERMILION },
  ];
  return (
    <svg
      viewBox="0 0 380 170"
      role="img"
      aria-label="Bhavat-bhavam chain deriving 2nd and 7th houses from the 8th"
      style={{ display: "block", width: "min(100%, 520px)", margin: "0.75rem auto 0" }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={GOLD} />
        </marker>
      </defs>
      <line x1={100} y1={80} x2={155} y2={80} stroke={GOLD} strokeWidth={2} markerEnd="url(#arrowhead)" />
      <text x={130} y={70} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={500}>8th-from-8th</text>

      <line x1={205} y1={70} x2={270} y2={45} stroke={GOLD} strokeWidth={2} markerEnd="url(#arrowhead)" />
      <text x={250} y={55} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={500}>12th-from-3rd</text>

      <line x1={205} y1={90} x2={270} y2={115} stroke={GOLD} strokeWidth={2} markerEnd="url(#arrowhead)" />
      <text x={250} y={125} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={500}>12th-from-8th</text>

      {nodes.map((node) => {
        const isActive =
          (activeStep === 0 && node.id === 8) ||
          (activeStep === 1 && node.id === 3) ||
          (activeStep === 2 && node.id === 2) ||
          (activeStep === 3 && node.id === 7);
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={22} fill={isActive ? `${node.color}30` : `${node.color}10`} stroke={node.color} strokeWidth={isActive ? 3 : 1} />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fill={isActive ? node.color : INK_MUTED} fontSize="12" fontWeight={600}>{node.label}</text>
          </g>
        );
      })}
    </svg>
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
