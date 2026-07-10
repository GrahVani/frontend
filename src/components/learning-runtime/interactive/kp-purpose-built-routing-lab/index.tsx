"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  GitBranch,
  Layers3,
  ListChecks,
  RotateCcw,
  Route,
  ShieldAlert,
  Split,
} from "lucide-react";

type ComponentKey = "whether" | "quality";
type RouteKey = "kp" | "parashara" | "jaimini" | "all";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const COMPONENTS: Record<ComponentKey, { label: string; nature: string; correctRoute: RouteKey; reason: string }> = {
  whether: {
    label: "Whether promise activates",
    nature: "Cuspal, pointed, binary",
    correctRoute: "kp",
    reason: "KP is purpose-built for cuspal yes/no judgment, so its finding is weighted for this sub-question.",
  },
  quality: {
    label: "What is it like and why",
    nature: "Broad, character, multi-factor",
    correctRoute: "parashara",
    reason: "Parashara and Jaimini-style broad mechanisms carry the character and quality reading; KP precision does not become a general rank claim.",
  },
};

const ROUTES: Record<RouteKey, { label: string; note: string }> = {
  kp: {
    label: "KP",
    note: "Cuspal sub-lord yes/no machinery fits pointed binary sub-questions.",
  },
  parashara: {
    label: "Parashara/Jaimini",
    note: "Broad strength, character, and multi-factor readings fit quality questions.",
  },
  jaimini: {
    label: "Jaimini only",
    note: "Useful for dharma/path and karaka emphasis, but this lesson pairs it with broad reading rather than isolating it here.",
  },
  all: {
    label: "All streams equally",
    note: "Equal reporting is required, but equal weighting for every sub-question misses purpose-built routing.",
  },
};

export function KpPurposeBuiltRoutingLab() {
  const [component, setComponent] = useState<ComponentKey>("whether");
  const [route, setRoute] = useState<RouteKey>("kp");
  const [splitFirst, setSplitFirst] = useState(true);
  const [weightNotExclude, setWeightNotExclude] = useState(true);
  const [fitnessNotRank, setFitnessNotRank] = useState(true);
  const [discloseStream, setDiscloseStream] = useState(true);
  const [oneStreamPerJudgement, setOneStreamPerJudgement] = useState(true);

  const selected = COMPONENTS[component];
  const routeMatches = route === selected.correctRoute || (component === "quality" && route === "jaimini");

  const status = useMemo(() => {
    if (!splitFirst) return { label: "bundle not split", icon: <ShieldAlert size={18} /> };
    if (!weightNotExclude) return { label: "stream excluded", icon: <ShieldAlert size={18} /> };
    if (!fitnessNotRank) return { label: "rank claim leaking", icon: <ShieldAlert size={18} /> };
    if (!discloseStream) return { label: "stream undisclosed", icon: <ShieldAlert size={18} /> };
    if (!oneStreamPerJudgement) return { label: "judgement conflated", icon: <ShieldAlert size={18} /> };
    if (!routeMatches) return { label: "route mismatch", icon: <ShieldAlert size={18} /> };
    return { label: "purpose-built routing ready", icon: <BadgeCheck size={18} /> };
  }, [discloseStream, fitnessNotRank, oneStreamPerJudgement, routeMatches, splitFirst, weightNotExclude]);

  const synthesisLine = useMemo(() => {
    if (!splitFirst) return "Repair first: split the bundled marriage question before assigning stream weight.";
    if (!weightNotExclude) return "Repair first: weighting changes emphasis for one sub-question; it never removes other streams from the write-up.";
    if (!fitnessNotRank) return "Repair first: say purpose-built fitness, not KP often prevails.";
    if (!discloseStream) return "Repair first: name which stream answered which sub-question.";
    if (!oneStreamPerJudgement) return "Repair first: keep each sub-judgement inside one stream's own method.";
    if (!routeMatches) return `${ROUTES[route].label} is not the best fit for ${selected.label}. ${selected.reason}`;
    return `${selected.label}: ${ROUTES[route].label} is weighted because the sub-question is ${selected.nature.toLowerCase()}. The other streams remain reported as layered evidence.`;
  }, [discloseStream, fitnessNotRank, oneStreamPerJudgement, route, routeMatches, selected, splitFirst, weightNotExclude]);

  return (
    <div data-interactive="kp-purpose-built-routing-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Purpose-built routing</p>
            <h2 style={headingStyle}>Split the question before weighting the stream</h2>
            <p style={bodyStyle}>
              Practice adapting the KP router from whole-consultation choice to sub-question-level weighting inside a five-stream synthesis.
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
          <p style={eyebrowStyle}>Question split</p>
          <RoutingDiagram component={component} route={route} />
          <div style={buttonGridStyle}>
            {(Object.keys(COMPONENTS) as ComponentKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setComponent(key)} style={choiceStyle(component === key)} aria-pressed={component === key}>
                {COMPONENTS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected sub-question</p>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selected.label}</p>
            <p style={smallTextStyle}>{selected.nature}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.55rem" }}>{selected.reason}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Choose weighting route</p>
          <div style={routeGridStyle}>
            {(Object.keys(ROUTES) as RouteKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setRoute(key)} style={choiceStyle(route === key)} aria-pressed={route === key}>
                {ROUTES[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.75rem" }}>{ROUTES[route].note}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Honesty guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={splitFirst} onChange={setSplitFirst} label="Split bundled question first" icon={<Split size={16} />} />
            <ToggleRow checked={weightNotExclude} onChange={setWeightNotExclude} label="Weight, do not exclude" icon={<Layers3 size={16} />} />
            <ToggleRow checked={fitnessNotRank} onChange={setFitnessNotRank} label="Fitness, not rank" icon={<Route size={16} />} />
            <ToggleRow checked={discloseStream} onChange={setDiscloseStream} label="Disclose stream per finding" icon={<ListChecks size={16} />} />
            <ToggleRow checked={oneStreamPerJudgement} onChange={setOneStreamPerJudgement} label="One stream per judgement" icon={<GitBranch size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setComponent("whether");
              setRoute("kp");
              setSplitFirst(true);
              setWeightNotExclude(true);
              setFitnessNotRank(true);
              setDiscloseStream(true);
              setOneStreamPerJudgement(true);
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
          <BadgeCheck size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Weighted synthesis line</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{synthesisLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoutingDiagram({ component, route }: { component: ComponentKey; route: RouteKey }) {
  const leftActive = component === "whether";
  const rightActive = component === "quality";

  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="Bundled marriage question split into sub-question routes" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="174" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="238" y="28" width="204" height="42" rx="8" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x="340" y="54" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Will marriage occur?</text>
      <path d="M 300 74 C 250 94, 210 104, 158 126" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" />
      <path d="M 380 74 C 430 94, 470 104, 522 126" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" />
      <rect x="54" y="116" width="208" height="48" rx="8" fill={SURFACE} stroke={leftActive ? ACCENT : HAIRLINE} strokeWidth={leftActive ? 2 : 1} />
      <text x="158" y="137" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>Whether</text>
      <text x="158" y="154" textAnchor="middle" fontSize="9" fill={INK_SECONDARY}>KP weighted</text>
      <rect x="418" y="116" width="208" height="48" rx="8" fill={SURFACE} stroke={rightActive ? ACCENT : HAIRLINE} strokeWidth={rightActive ? 2 : 1} />
      <text x="522" y="137" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>Quality and why</text>
      <text x="522" y="154" textAnchor="middle" fontSize="9" fill={INK_SECONDARY}>Broad streams weighted</text>
      <text x="340" y="102" textAnchor="middle" fontSize="10" fill={INK_MUTED}>selected route: {ROUTES[route].label}</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>{icon}{label}</span>
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

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.52rem",
  marginTop: "0.85rem",
};

const routeGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.52rem",
  marginTop: "0.85rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.25rem",
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.58,
  maxWidth: 940,
};

const smallTextStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.86rem",
  lineHeight: 1.48,
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  color: INK_PRIMARY,
  fontSize: "0.98rem",
  fontWeight: 500,
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "0.9rem",
  marginTop: "0.85rem",
};

const statusPillStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  color: INK_PRIMARY,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.38rem",
  padding: "0.42rem 0.68rem",
  fontSize: "0.78rem",
  fontWeight: 500,
  background: SURFACE,
  whiteSpace: "nowrap",
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
};

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 42,
    padding: "0.55rem 0.62rem",
    fontSize: "0.84rem",
    fontWeight: 500,
    textAlign: "center",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.62rem 0.7rem",
    color: checked ? INK_PRIMARY : INK_MUTED,
    cursor: "pointer",
    background: checked ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
  };
}

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
  fontWeight: 500,
};
