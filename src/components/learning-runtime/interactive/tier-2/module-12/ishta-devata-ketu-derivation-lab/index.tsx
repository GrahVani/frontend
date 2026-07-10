"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, GitCompare, HeartHandshake, MapPinned, RotateCcw, Route, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type StepKey = "karakamsha" | "twelfth" | "occupant" | "deity" | "convergence";
type ModeKey = "chartS1" | "fallback";

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

const STEPS: Record<StepKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  karakamsha: {
    label: "Karakamsha",
    title: "Begin from Virgo",
    body: "Chart S1 Karakamsha is Virgo, supplied by Saturn's D9 sign from the previous lesson.",
    icon: <MapPinned size={16} />,
    color: BLUE,
  },
  twelfth: {
    label: "12th",
    title: "Count the moksha door",
    body: "The 12th from Virgo is Leo. Do not count from Taurus birth Lagna or from Virgo itself.",
    icon: <Route size={16} />,
    color: GOLD,
  },
  occupant: {
    label: "Occupant",
    title: "Ketu occupies Leo",
    body: "An occupant is present, so the derivation stops there. Sign-lord and aspect fallback are not needed for Chart S1.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
  deity: {
    label: "Deity",
    title: "Ketu maps to Ganesha",
    body: "From the planet-to-deity table, Ketu indicates Ganesha for this derivation.",
    icon: <Sparkles size={16} />,
    color: GREEN,
  },
  convergence: {
    label: "Converge",
    title: "Two unrelated routes meet on Ketu",
    body: "D1 12th-house Ketu and Karakamsha-derived Ketu agree narrowly on the moksha-door graha.",
    icon: <GitCompare size={16} />,
    color: VERMILION,
  },
};

const STEP_ORDER: StepKey[] = ["karakamsha", "twelfth", "occupant", "deity", "convergence"];

export function IshtaDevataKetuDerivationLab() {
  const [stepKey, setStepKey] = useState<StepKey>("karakamsha");
  const [modeKey, setModeKey] = useState<ModeKey>("chartS1");
  const [countFromKarakamsha, setCountFromKarakamsha] = useState(true);
  const [occupantFirst, setOccupantFirst] = useState(true);
  const [narrowConvergence, setNarrowConvergence] = useState(true);
  const [offerNotImpose, setOfferNotImpose] = useState(true);

  const step = STEPS[stepKey];
  const fallbackMode = modeKey === "fallback";

  const status = useMemo(() => {
    if (!countFromKarakamsha) return { label: "wrong count origin", color: VERMILION };
    if (!occupantFirst) return { label: "fallback used too early", color: GOLD };
    if (!narrowConvergence) return { label: "convergence overstated", color: GOLD };
    if (!offerNotImpose) return { label: "imposition risk", color: VERMILION };
    return { label: fallbackMode ? "fallback practice ready" : "Ganesha derivation ready", color: GREEN };
  }, [countFromKarakamsha, fallbackMode, narrowConvergence, occupantFirst, offerNotImpose]);

  const reading = useMemo(() => {
    if (!countFromKarakamsha) return "Restart from the Karakamsha, not the birth Lagna. The Ishta-devata count begins from Virgo for Chart S1.";
    if (!occupantFirst) return "Use the occupant first. Chart S1 has Ketu in the 12th from Karakamsha, so sign-lord fallback is not needed.";
    if (!narrowConvergence) return "Keep the convergence narrow: both routes select Ketu for moksha-door symbolism, not overall chart control.";
    if (!offerNotImpose) return "Offer the indication respectfully. It is not a religious obligation or replacement for existing devotion.";
    if (fallbackMode) return "Fallback example: Sagittarius Karakamsha gives Scorpio as 12th. If empty, read Mars as sign-lord first; aspects only color secondarily.";
    return "Chart S1 derivation: Virgo Karakamsha to Leo 12th; Ketu occupies Leo; Ketu maps to Ganesha, with a narrow D1 12th-house Ketu convergence.";
  }, [countFromKarakamsha, fallbackMode, narrowConvergence, occupantFirst, offerNotImpose]);

  return (
    <div data-interactive="ishta-devata-ketu-derivation-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Ishta-devata derivation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Derive Chart S1 from the 12th-from-Karakamsha without merging the routes
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Follow Virgo to Leo, identify Ketu, map Ketu to Ganesha, and keep the D1 twelfth-house convergence precise and respectful.
            </p>
          </div>
          <span style={{ border: `1px solid ${status.color}`, color: status.color, borderRadius: 999, padding: "0.42rem 0.68rem", fontSize: "0.78rem", fontWeight: 600, background: "color-mix(in srgb, currentColor 8%, transparent)", whiteSpace: "nowrap" }}>
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.78fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={eyebrowStyle}>Derivation chain</p>
              <h3 style={{ margin: "0.22rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>{step.title}</h3>
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {(["chartS1", "fallback"] as ModeKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setModeKey(key)} style={{ ...pillStyle, borderColor: modeKey === key ? BLUE : HAIRLINE, color: modeKey === key ? BLUE : INK_SECONDARY }} aria-pressed={modeKey === key}>
                  {key === "chartS1" ? "Chart S1" : "Fallback"}
                </button>
              ))}
            </div>
          </div>

          <DerivationDiagram active={stepKey} fallbackMode={fallbackMode} onSelect={setStepKey} />

          <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{step.body}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={countFromKarakamsha} onChange={setCountFromKarakamsha} label="Count from Karakamsha" icon={<MapPinned size={16} />} />
            <ToggleRow checked={occupantFirst} onChange={setOccupantFirst} label="Use occupant before fallback" icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={narrowConvergence} onChange={setNarrowConvergence} label="Keep convergence narrow" icon={<GitCompare size={16} />} />
            <ToggleRow checked={offerNotImpose} onChange={setOfferNotImpose} label="Offer, never impose" icon={<HeartHandshake size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setStepKey("karakamsha");
              setModeKey("chartS1");
              setCountFromKarakamsha(true);
              setOccupantFirst(true);
              setNarrowConvergence(true);
              setOfferNotImpose(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Two-route convergence</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "0.85rem" }}>
          <FactCard label="Karakamsha route" body="Virgo Karakamsha -> Leo 12th -> Ketu occupant -> Ganesha." color={GREEN} />
          <FactCard label="D1 route" body="Taurus birth Lagna -> Aries 12th -> Ketu as moksha-karaka occupant." color={BLUE} />
          <FactCard label="Boundary" body="This supports a narrow moksha-door convergence, not Ketu as chart ruler." color={VERMILION} />
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <Sparkles size={20} /> : <TriangleAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Derived statement</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactCard({ label, body, color }: { label: string; body: string; color: string }) {
  return (
    <article style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: "rgba(255,255,255,0.32)" }}>
      <p style={{ margin: 0, color, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{body}</p>
    </article>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.7rem", color: checked ? INK_PRIMARY : INK_MUTED, cursor: "pointer" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>{icon}{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function DerivationDiagram({ active, fallbackMode, onSelect }: { active: StepKey; fallbackMode: boolean; onSelect: (key: StepKey) => void }) {
  const labels = fallbackMode
    ? ["Sagittarius", "Scorpio", "empty", "Mars", "Skanda"]
    : ["Virgo", "Leo", "Ketu", "Ganesha", "Ketu x2"];
  return (
    <svg viewBox="0 0 620 154" role="img" aria-label="Ishta-devata derivation chain" style={{ width: "100%", height: "auto", marginTop: "0.8rem" }}>
      <rect x="8" y="8" width="604" height="136" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      {STEP_ORDER.map((key, index) => {
        const x = 72 + index * 119;
        const item = STEPS[key];
        const selected = active === key;
        return (
          <g key={key} onClick={() => onSelect(key)} style={{ cursor: "pointer" }}>
            {index > 0 ? <ArrowRight x={x - 78} y="60" width={18} height={18} color={HAIRLINE} /> : null}
            <circle cx={x} cy="70" r={selected ? 27 : 22} fill={selected ? item.color : SURFACE} stroke={item.color} strokeWidth="2" />
            <text x={x} y="74" textAnchor="middle" fontSize="10" fontWeight="600" fill={selected ? "white" : item.color}>{labels[index]}</text>
            <text x={x} y="116" textAnchor="middle" fontSize="10" fill={selected ? item.color : INK_MUTED}>{item.label}</text>
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

const pillStyle: CSSProperties = {
  ...buttonReset,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  background: "transparent",
  padding: "0.45rem 0.68rem",
  fontSize: "0.8rem",
  fontWeight: 600,
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
