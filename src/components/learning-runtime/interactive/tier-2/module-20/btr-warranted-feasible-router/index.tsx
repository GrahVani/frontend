"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TimeQuality = "reliable" | "approxSmall" | "approxLarge" | "unknown";
type CrossCheck = "bothCohere" | "oneSoft" | "twoConvergent";
type FeasibilityAnchor = "events" | "window" | "consult";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const TIME_QUALITY_OPTIONS: Record<TimeQuality, { label: string; detail: string }> = {
  reliable: { label: "Reliable", detail: "Hospital record or equivalent; well-documented birth moment." },
  approxSmall: { label: "Approximate, small", detail: "±10–15 min, away from Lagna or daśā boundaries." },
  approxLarge: { label: "Approximate, large", detail: "±1–2 hr; large enough to move Lagna or houses." },
  unknown: { label: "Unknown", detail: "No recorded time; only date is known." },
};

const CROSS_CHECK_OPTIONS: Record<CrossCheck, { label: string; detail: string }> = {
  bothCohere: { label: "Both cohere", detail: "Independent cross-checks agree with the birth time." },
  oneSoft: { label: "One soft negative", detail: "A single isolated flag; not enough to justify rectification." },
  twoConvergent: { label: "Two convergent negatives", detail: "Independent doubts agree, especially if they implicate the Lagna." },
};

const ANCHORS: Record<FeasibilityAnchor, { label: string; detail: string; method: string }> = {
  events: { label: "Dated life events", detail: "Marriage, career change, childbirth, etc.", method: "Events-based rectification" },
  window: { label: "Defensible candidate window", detail: "Family recall such as 'around sunrise'.", method: "KP RPP, D60 sensitivity" },
  consult: { label: "Consultation moment", detail: "A praśna or tattva-śuddhi consultation moment.", method: "Praśna-derived / Tattva-śuddhi" },
};

interface CaseConfig {
  key: string;
  title: string;
  description: string;
  timeQuality: TimeQuality;
  crossCheck: CrossCheck;
  anchors: FeasibilityAnchor[];
  route: string;
  routeColor: string;
}

const CASES: CaseConfig[] = [
  {
    key: "a",
    title: "Reliable time, convergent negatives",
    description: "A hospital-record birth time, but two soft negatives converge and both implicate the Lagna.",
    timeQuality: "reliable",
    crossCheck: "twoConvergent",
    anchors: ["events", "window"],
    route: "Warranted and feasible → proceed to rectification.",
    routeColor: GREEN,
  },
  {
    key: "b",
    title: "Unknown time, no anchors",
    description: "No birth time is recorded, and the client cannot recall a single datable life event.",
    timeQuality: "unknown",
    crossCheck: "bothCohere",
    anchors: [],
    route: "Warranted but not feasible → decline time-dependent reading or restrict to least-sensitive layer.",
    routeColor: VERMILION,
  },
  {
    key: "c",
    title: "Small uncertainty, all positive",
    description: "Approximate time with only ±10–15 min uncertainty, away from boundaries; cross-checks cohere.",
    timeQuality: "approxSmall",
    crossCheck: "bothCohere",
    anchors: ["events", "window"],
    route: "Not warranted → proceed with a light caveat; feasibility is moot.",
    routeColor: BLUE,
  },
  {
    key: "vikram",
    title: "Vikram — around sunrise",
    description: "Family recalls 'around 6am' (window 05:45–06:15) and two dated life events.",
    timeQuality: "approxLarge",
    crossCheck: "bothCohere",
    anchors: ["events", "window"],
    route: "Warranted and feasible → rectify first, beginning with events-based testing.",
    routeColor: GREEN,
  },
];

function DecisionMatrix({ warranted, feasible }: { warranted: boolean; feasible: boolean }) {
  const markerX = warranted ? 260 : 100;
  const markerY = feasible ? 80 : 220;

  return (
    <svg width="100%" height="100%" viewBox="0 0 360 300" style={{ maxWidth: 360 }}>
      {/* quadrant backgrounds */}
      <rect x={180} y={0} width={180} height={150} fill={`${GREEN}10`} stroke={HAIRLINE} />
      <rect x={0} y={0} width={180} height={150} fill={`${BLUE}10`} stroke={HAIRLINE} />
      <rect x={180} y={150} width={180} height={150} fill={`${VERMILION}10`} stroke={HAIRLINE} />
      <rect x={0} y={150} width={180} height={150} fill={`${GOLD}10`} stroke={HAIRLINE} />

      {/* axis lines */}
      <line x1={180} y1={0} x2={180} y2={300} stroke={HAIRLINE} strokeWidth={2} />
      <line x1={0} y1={150} x2={360} y2={150} stroke={HAIRLINE} strokeWidth={2} />

      {/* labels */}
      <text x={90} y={20} fontSize={11} fill={INK_MUTED} fontWeight={700} textAnchor="middle">Not warranted</text>
      <text x={270} y={20} fontSize={11} fill={INK_MUTED} fontWeight={700} textAnchor="middle">Warranted</text>
      <text x={12} y={105} fontSize={11} fill={INK_MUTED} fontWeight={700} textAnchor="start">Feasible</text>
      <text x={12} y={255} fontSize={11} fill={INK_MUTED} fontWeight={700} textAnchor="start">Not feasible</text>

      {/* quadrant text */}
      <text x={90} y={80} fontSize={12} fill={BLUE} fontWeight={600} textAnchor="middle">Proceed / caveat</text>
      <text x={270} y={80} fontSize={12} fill={GREEN} fontWeight={600} textAnchor="middle">Rectify first</text>
      <text x={90} y={230} fontSize={12} fill={GOLD} fontWeight={600} textAnchor="middle">Caveat; consider</text>
      <text x={270} y={230} fontSize={12} fill={VERMILION} fontWeight={600} textAnchor="middle">Decline / least-sensitive</text>

      {/* marker */}
      <circle cx={markerX} cy={markerY} r={10} fill={warranted ? (feasible ? GREEN : VERMILION) : (feasible ? BLUE : GOLD)} stroke="#fff" strokeWidth={3} />
    </svg>
  );
}

function FlowArrow() {
  return (
    <svg width="100%" height="60" viewBox="0 0 360 60" style={{ maxWidth: 360 }}>
      <rect x={10} y={15} width={90} height={30} rx={6} fill={`${BLUE}14`} stroke={BLUE} />
      <text x={55} y={35} fontSize={10} fill={BLUE} fontWeight={600} textAnchor="middle">Classify time</text>
      <line x1={100} y1={30} x2={130} y2={30} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="130,30 124,24 124,36" fill={HAIRLINE} />

      <rect x={135} y={15} width={90} height={30} rx={6} fill={`${PURPLE}14`} stroke={PURPLE} />
      <text x={180} y={35} fontSize={10} fill={PURPLE} fontWeight={600} textAnchor="middle">Warranted?</text>
      <line x1={225} y1={30} x2={255} y2={30} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="255,30 249,24 249,36" fill={HAIRLINE} />

      <rect x={260} y={15} width={90} height={30} rx={6} fill={`${GREEN}14`} stroke={GREEN} />
      <text x={305} y={35} fontSize={10} fill={GREEN} fontWeight={600} textAnchor="middle">Feasible?</text>
    </svg>
  );
}

export function BtrWarrantedFeasibleRouter() {
  const [timeQuality, setTimeQuality] = useState<TimeQuality>("approxLarge");
  const [crossCheck, setCrossCheck] = useState<CrossCheck>("bothCohere");
  const [anchors, setAnchors] = useState<Record<FeasibilityAnchor, boolean>>({ events: true, window: true, consult: false });
  const [overRoutingGuard, setOverRoutingGuard] = useState(true);

  const warranted = useMemo(() => {
    if (timeQuality === "approxLarge" || timeQuality === "unknown") return true;
    if (crossCheck === "twoConvergent") return true;
    return false;
  }, [timeQuality, crossCheck]);

  const feasible = useMemo(() => Object.values(anchors).some(Boolean), [anchors]);

  const route = useMemo(() => {
    if (!warranted) {
      if (timeQuality === "reliable" && crossCheck === "oneSoft") return { text: "Proceed with a caveat.", color: BLUE };
      if (timeQuality === "approxSmall") return { text: "Proceed with a light caveat.", color: BLUE };
      return { text: "Proceed.", color: GREEN };
    }
    if (!feasible) return { text: "Decline time-dependent reading, or restrict to the least-sensitive layer.", color: VERMILION };
    return { text: "Rectify first — BTR is warranted and feasible.", color: GREEN };
  }, [warranted, feasible, timeQuality, crossCheck]);

  function reset() {
    setTimeQuality("approxLarge");
    setCrossCheck("bothCohere");
    setAnchors({ events: true, window: true, consult: false });
    setOverRoutingGuard(true);
  }

  function loadCase(c: CaseConfig) {
    setTimeQuality(c.timeQuality);
    setCrossCheck(c.crossCheck);
    setAnchors({ events: c.anchors.includes("events"), window: c.anchors.includes("window"), consult: c.anchors.includes("consult") });
  }

  function toggleAnchor(key: FeasibilityAnchor) {
    setAnchors((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div data-interactive="btr-warranted-feasible-router" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 20 · Chapter 1</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              BTR warranted vs feasible router
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Apply T2-02&apos;s routing rules, then check both questions: is rectification warranted, and is it actually feasible with the data at hand?
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 380px" }}>
          <p style={eyebrowStyle}>Decision matrix</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Warranted on the x-axis, feasible on the y-axis
          </h3>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <DecisionMatrix warranted={warranted} feasible={feasible} />
          </div>
          <div style={{ marginTop: "0.65rem", padding: "0.65rem 0.85rem", borderRadius: 8, background: `${route.color}12`, border: `1px solid ${route.color}55`, color: route.color, fontWeight: 600 }}>
            {route.text}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 380px" }}>
          <p style={eyebrowStyle}>Decision sequence</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Classify first, then ask two separate questions
          </h3>
          <div style={{ marginTop: "0.75rem" }}>
            <FlowArrow />
          </div>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            <div style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
              <span style={{ color: BLUE, fontWeight: 600 }}>Step 1:</span>{" "}
              <span style={{ color: INK_SECONDARY }}>Use T2-02 2.1.1&apos;s birth-time class and T2-02 2.2.3&apos;s cross-check verdict to decide whether BTR is warranted.</span>
            </div>
            <div style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
              <span style={{ color: PURPLE, fontWeight: 600 }}>Step 2:</span>{" "}
              <span style={{ color: INK_SECONDARY }}>If warranted, check feasibility: is there at least one anchor (dated events, candidate window, consultation moment) to rectify with?</span>
            </div>
            <div style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
              <span style={{ color: GREEN, fontWeight: 600 }}>Step 3:</span>{" "}
              <span style={{ color: INK_SECONDARY }}>Route accordingly: proceed/caveat, rectify, or decline / least-sensitive layer.</span>
            </div>
          </div>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Birth-time quality</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
            {(Object.keys(TIME_QUALITY_OPTIONS) as TimeQuality[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={timeQuality === key}
                onClick={() => setTimeQuality(key)}
                style={chipStyle(timeQuality === key, BLUE)}
              >
                {TIME_QUALITY_OPTIONS[key].label}
              </button>
            ))}
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {TIME_QUALITY_OPTIONS[timeQuality].detail}
          </p>

          <p style={{ ...eyebrowStyle, marginTop: "1rem" }}>Cross-check verdict</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
            {(Object.keys(CROSS_CHECK_OPTIONS) as CrossCheck[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={crossCheck === key}
                onClick={() => setCrossCheck(key)}
                style={chipStyle(crossCheck === key, PURPLE)}
              >
                {CROSS_CHECK_OPTIONS[key].label}
              </button>
            ))}
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {CROSS_CHECK_OPTIONS[crossCheck].detail}
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Feasibility anchors</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            What data is available to rectify with?
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {(Object.keys(ANCHORS) as FeasibilityAnchor[]).map((key) => {
              const active = anchors[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleAnchor(key)}
                  style={togglePanelStyle(active, active ? GREEN : INK_MUTED)}
                >
                  {active ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
                  <span>
                    <span style={{ fontWeight: 600 }}>{ANCHORS[key].label}</span>
                    <span style={{ color: INK_SECONDARY }}> — {ANCHORS[key].detail} ({ANCHORS[key].method})</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              background: feasible ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${feasible ? GREEN : VERMILION}55`,
              color: feasible ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {feasible
              ? "At least one rectification anchor is available."
              : "No anchor selected — every method needs something to rectify with."}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Over-routing guard</p>
        <button
          type="button"
          aria-pressed={overRoutingGuard}
          onClick={() => setOverRoutingGuard((v) => !v)}
          style={togglePanelStyle(overRoutingGuard, overRoutingGuard ? GREEN : VERMILION)}
        >
          {overRoutingGuard ? <ShieldCheck size={20} aria-hidden="true" /> : <AlertTriangle size={20} aria-hidden="true" />}
          <span>
            <span style={{ fontWeight: 600 }}>{overRoutingGuard ? "Guard held" : "Guard released"}</span>
            <span style={{ color: overRoutingGuard ? INK_SECONDARY : VERMILION }}>
              {" "}—{" "}
              {overRoutingGuard
                ? "A single isolated soft negative is still a caveat, not a BTR referral, no matter how available the toolkit now feels."
                : "Warning: over-routing to BTR on a weak signal wastes client effort and lowers the threshold T2-02 set."}
            </span>
          </span>
        </button>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Practice cases</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Click a case to load it into the router
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {CASES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => loadCase(c)}
              style={{
                ...cardStyle,
                textAlign: "left",
                cursor: "pointer",
                borderColor: c.routeColor,
                background: `${c.routeColor}08`,
              }}
            >
              <div style={{ color: c.routeColor, fontWeight: 600, fontSize: "0.9rem" }}>{c.title}</div>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{c.description}</p>
              <div style={{ marginTop: "0.55rem", padding: "0.45rem 0.55rem", borderRadius: 6, background: `${c.routeColor}14`, color: c.routeColor, fontWeight: 600, fontSize: "0.8rem" }}>
                {c.route}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function chipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
  };
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

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "26px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
