"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  Boxes,
  Compass,
  GitCompare,
  Layers3,
  LockKeyhole,
  Map,
  RotateCcw,
  Scale,
  ShieldAlert,
} from "lucide-react";

type RouteKey = "subquestion" | "native" | "padded";
type LensKey = "karakamsha" | "ninth";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const ROUTES: Record<RouteKey, { label: string; verdict: string; detail: string; icon: ReactNode }> = {
  subquestion: {
    label: "Sub-question weighting",
    verdict: "Chapter 3 pattern",
    detail: "Use when one client sentence bundles separable sub-questions, as with KP for whether and Parashara for quality.",
    icon: <GitCompare size={16} />,
  },
  native: {
    label: "Native-domain routing",
    verdict: "This lesson's pattern",
    detail: "Use when one stream owns a chart-relative tool built for the question's exact shape, while other streams offer adjacent commentary.",
    icon: <Compass size={16} />,
  },
  padded: {
    label: "Padded matrix cell",
    verdict: "Repair this",
    detail: "Do not manufacture weak entries just to make every row look full; that is cosmetic consistency, not rigor.",
    icon: <ShieldAlert size={16} />,
  },
};

const LENSES: Record<LensKey, { label: string; kind: string; note: string }> = {
  karakamsha: {
    label: "Karakamsha",
    kind: "chart-relative ranking",
    note: "Atmakaraka is found by the chart's internal degree ranking; the tool is individually tailored.",
  },
  ninth: {
    label: "Parashara 9th house",
    kind: "fixed structural position",
    note: "The 9th house is a real dharma indicator, but it answers a neighbouring structural question.",
  },
};

export function JaiminiNativeDomainRoutingLab() {
  const [route, setRoute] = useState<RouteKey>("native");
  const [lens, setLens] = useState<LensKey>("karakamsha");
  const [commentaryWelcomed, setCommentaryWelcomed] = useState(true);
  const [fullMatrixForced, setFullMatrixForced] = useState(false);
  const [superiorityClaim, setSuperiorityClaim] = useState(false);

  const selectedRoute = ROUTES[route];
  const selectedLens = LENSES[lens];

  const status = useMemo(() => {
    if (route === "padded" || fullMatrixForced || superiorityClaim || !commentaryWelcomed) {
      return { label: "routing needs repair", icon: <ShieldAlert size={18} /> };
    }
    return { label: "native-domain route honest", icon: <BadgeCheck size={18} /> };
  }, [commentaryWelcomed, fullMatrixForced, route, superiorityClaim]);

  const outputLine = useMemo(() => {
    if (route === "subquestion") return "This is the Chapter 3 pattern. It fits bundled marriage sub-questions, but it is not the dharma-path problem in this lesson.";
    if (route === "padded" || fullMatrixForced) return "Repair: a thin or empty matrix cell is honest when only one stream is purpose-built; do not pad it to look complete.";
    if (superiorityClaim) return "Repair: this is a fit claim, not a rank claim. Jaimini is purpose-built here, not universally superior.";
    if (!commentaryWelcomed) return "Repair: do not silence Parashara. Its 9th-house commentary may be real; it is just not a verdict-level rival to the Karakamsha.";
    return "Routing statement: Chart MD1's dharma-path question is routed natively to Jaimini because the Atmakaraka and Karakamsha are chart-relative, individually ranked tools. Parashara 9th-house commentary remains welcome, but absence of a full verdict-level comparison is not a gap.";
  }, [commentaryWelcomed, fullMatrixForced, route, superiorityClaim]);

  return (
    <div data-interactive="jaimini-native-domain-routing-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini native-domain routing</p>
            <h2 style={headingStyle}>Route the dharma question without padding the matrix</h2>
            <p style={bodyStyle}>
              Compare routing shapes, inspect fixed and chart-relative dharma lenses, and keep a thin matrix cell honest instead of cosmetic.
            </p>
          </div>
          <span style={statusPillStyle}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Routing shape selector</p>
          <RoutingDiagram active={route} />
          <div style={routeGridStyle}>
            {(Object.keys(ROUTES) as RouteKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setRoute(key)} style={choiceStyle(route === key)} aria-pressed={route === key}>
                {ROUTES[key].icon}
                {ROUTES[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected route</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selectedRoute.icon}</span>
            <p style={panelTitleStyle}>{selectedRoute.verdict}</p>
            <p style={smallTextStyle}>{selectedRoute.detail}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Dharma lens comparison</p>
          <div style={buttonGridStyle}>
            {(Object.keys(LENSES) as LensKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setLens(key)} style={choiceStyle(lens === key)} aria-pressed={lens === key}>
                <Map size={16} />
                {LENSES[key].label}
              </button>
            ))}
          </div>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selectedLens.kind}</p>
            <p style={smallTextStyle}>{selectedLens.note}</p>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Routing guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={commentaryWelcomed} onChange={setCommentaryWelcomed} label="Cross-stream commentary welcomed" icon={<Layers3 size={16} />} />
            <ToggleRow checked={!fullMatrixForced} onChange={(checked) => setFullMatrixForced(!checked)} label="No forced full matrix row" icon={<Boxes size={16} />} />
            <ToggleRow checked={!superiorityClaim} onChange={(checked) => setSuperiorityClaim(!checked)} label="Fit claim, not rank claim" icon={<Scale size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setRoute("native");
              setLens("karakamsha");
              setCommentaryWelcomed(true);
              setFullMatrixForced(false);
              setSuperiorityClaim(false);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <LockKeyhole size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Matrix-cell discipline</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{outputLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoutingDiagram({ active }: { active: RouteKey }) {
  return (
    <svg viewBox="0 0 680 230" role="img" aria-label="Routing shapes for Jaimini native-domain questions" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="214" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="54" y="64" width="168" height="72" rx="8" fill={SURFACE} stroke={active === "subquestion" ? ACCENT : HAIRLINE} strokeWidth={active === "subquestion" ? 2 : 1} />
      <text x="138" y="90" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Split question</text>
      <text x="138" y="108" textAnchor="middle" fontSize="10" fill={INK_MUTED}>multiple sub-answers</text>
      <text x="138" y="124" textAnchor="middle" fontSize="10" fill={INK_MUTED}>Chapter 3 shape</text>

      <rect x="256" y="42" width="168" height="116" rx="8" fill={SURFACE} stroke={active === "native" ? ACCENT : HAIRLINE} strokeWidth={active === "native" ? 2 : 1} />
      <text x="340" y="76" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Native domain</text>
      <text x="340" y="94" textAnchor="middle" fontSize="10" fill={INK_MUTED}>one purpose-built tool</text>
      <text x="340" y="112" textAnchor="middle" fontSize="10" fill={INK_MUTED}>commentary welcome</text>
      <text x="340" y="130" textAnchor="middle" fontSize="10" fill={INK_MUTED}>this lesson shape</text>

      <rect x="458" y="64" width="168" height="72" rx="8" fill={SURFACE} stroke={active === "padded" ? ACCENT : HAIRLINE} strokeWidth={active === "padded" ? 2 : 1} />
      <text x="542" y="90" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Padded row</text>
      <text x="542" y="108" textAnchor="middle" fontSize="10" fill={INK_MUTED}>looks complete</text>
      <text x="542" y="124" textAnchor="middle" fontSize="10" fill={INK_MUTED}>but fabricates fit</text>

      <path d="M 222 100 L 256 100" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" />
      <path d="M 424 100 L 458 100" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" />
      <text x="340" y="192" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Ask the same honest routing question; do not require every row to look identical.</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>
        {icon}
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)",
  gap: "1rem",
};

const routeGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "0.5rem",
  margin: "0.85rem 0",
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.9rem",
  minHeight: "8.8rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  letterSpacing: 0,
  textTransform: "uppercase",
  color: ACCENT,
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  fontSize: "1.35rem",
  lineHeight: 1.22,
  color: INK_PRIMARY,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.48rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.95rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.28rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.45,
  fontSize: "0.86rem",
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1rem",
  lineHeight: 1.32,
  fontWeight: 500,
};

const statusPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  padding: "0.45rem 0.7rem",
  color: INK_SECONDARY,
  background: SURFACE,
  fontSize: "0.86rem",
  whiteSpace: "nowrap",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
};

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...softButtonStyle,
    borderColor: active ? ACCENT : HAIRLINE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.62rem 0.72rem",
    background: SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
  };
}

