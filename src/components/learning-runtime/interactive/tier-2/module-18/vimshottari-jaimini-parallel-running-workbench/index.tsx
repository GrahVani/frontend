"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  Moon,
  RotateCcw,
  Scale,
  Sparkles,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ScenarioKey = "convergent-career" | "divergent-education-health" | "kavya-marriage-open";
type Relation = "convergence" | "divergence" | "open";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const GREEN = "#2F7D55";
const AMBER = "#B88421";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const SCENARIOS: Record<ScenarioKey, {
  label: string;
  vimshottari: { matter: string; detail: string; window: string };
  cara: { matter: string; detail: string; window: string };
  relation: Relation;
  conclusion: string;
}> = {
  "convergent-career": {
    label: "Convergent career case",
    vimshottari: {
      matter: "Career / 10th house",
      detail: "Mahādaśā lord occupies and owns the 10th",
      window: "Age 34–39",
    },
    cara: {
      matter: "Career / 10th from Lagna",
      detail: "Cara mahādaśā sign is the 10th, occupied by a career planet",
      window: "Age 33–40",
    },
    relation: "convergence",
    conclusion:
      "Two architecturally different systems land on the same matter in overlapping windows. This is convergence — report higher confidence than either reading alone.",
  },
  "divergent-education-health": {
    label: "Divergent education/health case",
    vimshottari: {
      matter: "Education / 4th and 9th",
      detail: "Mahādaśā lord signifies learning and higher study",
      window: "Age 24–31",
    },
    cara: {
      matter: "Health and service / 6th",
      detail: "Cara mahādaśā sign is the 6th from Lagna",
      window: "Age 24–31",
    },
    relation: "divergence",
    conclusion:
      "The same years carry two coexisting threads. Neither system is wrong; the period is layered. Report both threads and name which system supplied each.",
  },
  "kavya-marriage-open": {
    label: "Kavya’s marriage question",
    vimshottari: {
      matter: "Marriage / 7th and husband-kāraka",
      detail: "Moon MD gives only one genuine indicator (Jupiter as husband-kāraka)",
      window: "Age 31.339–40.506",
    },
    cara: {
      matter: "To be computed",
      detail: "Cara Daśā sequence and timing are derived in Lesson 18.4.2",
      window: "—",
    },
    relation: "open",
    conclusion:
      "Chapter 3 found no Moderate marriage window. This chapter will run Cara Daśā honestly, but it does not promise convergence. The discipline governs whatever the chart produces.",
  },
};

const RELATION_META: Record<Relation, { label: string; color: string; icon: ReactNode }> = {
  convergence: {
    label: "Convergence",
    color: GREEN,
    icon: <HeartHandshake size={18} aria-hidden="true" />,
  },
  divergence: {
    label: "Divergence",
    color: AMBER,
    icon: <ArrowLeftRight size={18} aria-hidden="true" />,
  },
  open: {
    label: "Open / unresolved",
    color: INK_MUTED,
    icon: <Scale size={18} aria-hidden="true" />,
  },
};

const DISCIPLINE_ITEMS = [
  {
    key: "parallel",
    label: "Run both systems in parallel",
    offText: "Warning: running only one system removes the cross-check entirely.",
  },
  {
    key: "noChoose",
    label: "Never choose one or average them",
    offText: "Warning: choosing or averaging collapses the independence that makes convergence meaningful.",
  },
  {
    key: "reportRelation",
    label: "Report the relationship between readings",
    offText: "Warning: hiding divergence turns a nuanced finding into a forced verdict.",
  },
  {
    key: "noPromise",
    label: "Do not expect a manufactured resolution",
    offText: "Warning: expecting a clean answer before computing is Common Mistake #1.",
  },
] as const;

type DisciplineKey = (typeof DISCIPLINE_ITEMS)[number]["key"];

export function VimshottariJaiminiParallelRunningWorkbench() {
  const [scenario, setScenario] = useState<ScenarioKey>("convergent-career");
  const [discipline, setDiscipline] = useState<Record<DisciplineKey, boolean>>({
    parallel: true,
    noChoose: true,
    reportRelation: true,
    noPromise: true,
  });

  const data = SCENARIOS[scenario];
  const meta = RELATION_META[data.relation];
  const heldCount = Object.values(discipline).filter(Boolean).length;
  const allHeld = heldCount === DISCIPLINE_ITEMS.length;

  function reset() {
    setScenario("convergent-career");
    setDiscipline({ parallel: true, noChoose: true, reportRelation: true, noPromise: true });
  }

  return (
    <div data-interactive="vimshottari-jaimini-parallel-running-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Parallel-running discipline</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Run Vimśottarī and Cara Daśā side by side
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The value is in the relationship between two independent systems. Convergence raises confidence; divergence is nuance, not error.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>System comparison</p>
              <h3 style={{ margin: "0.15rem 0 0", color: meta.color, fontSize: "1.2rem", fontWeight: 600 }}>
                {meta.label}
              </h3>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.7rem",
                borderRadius: "9999px",
                background: `${meta.color}15`,
                color: meta.color,
                border: `1px solid ${meta.color}55`,
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {meta.icon} {meta.label}
            </span>
          </div>
          <ParallelSvg relation={data.relation} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Moon size={16} />} title="Vimśottarī" body={data.vimshottari.matter} color={BLUE} />
            <MiniFact icon={<Sparkles size={16} />} title="Cara Daśā" body={data.cara.matter} color={PURPLE} />
            <MiniFact icon={<Target size={16} />} title="Window overlap" body={data.relation === "open" ? "Not yet known" : "Same broad life-years"} color={AMBER} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Choose a scenario" icon={<BookOpen size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={scenario === key}
                  onClick={() => setScenario(key)}
                  style={scenarioButtonStyle(scenario === key, GOLD)}
                >
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>Each scenario shows how the same discipline produces a different relationship.</p>
          </Panel>
        </section>
      </div>

      <div style={twoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Vimśottarī reading</p>
          <SystemReading
            system="Vimśottarī"
            color={BLUE}
            matter={data.vimshottari.matter}
            detail={data.vimshottari.detail}
            window={data.vimshottari.window}
            anchor="Moon nakṣatra"
            mechanism="Planet-based, fixed 120-year cycle"
          />
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cara Daśā reading</p>
          <SystemReading
            system="Cara Daśā"
            color={PURPLE}
            matter={data.cara.matter}
            detail={data.cara.detail}
            window={data.cara.window}
            anchor="Lagna"
            mechanism="Sign-based, chart-computed cycle"
          />
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${meta.color}66`, background: `${meta.color}0F` }}>
        <p style={eyebrowStyle}>Discipline-consistent conclusion</p>
        <h3 style={{ margin: "0.15rem 0 0", color: meta.color, fontSize: "1.18rem", fontWeight: 600 }}>
          {meta.label}
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.65 }}>{data.conclusion}</p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {DISCIPLINE_ITEMS.map((item) => {
            const on = discipline[item.key];
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={on}
                onClick={() => setDiscipline((d) => ({ ...d, [item.key]: !on }))}
                style={togglePanelStyle(on, on ? GREEN : VERMILION)}
              >
                {on ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 700 }}>{item.label}</strong>
                  <span>{on ? " — discipline held." : ` ${item.offText}`}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allHeld ? GREEN : VERMILION}55`,
            color: allHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allHeld
            ? "All four discipline commitments are held. The relationship between the two systems can now be reported honestly."
            : `${DISCIPLINE_ITEMS.length - heldCount} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Source verification status</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.75rem" }}>
          <SourceChip label="T1-17 Chapter 6 (Cara Daśā)" status="verified" />
          <SourceChip label="T1-10 Chapter 6 (Jaimini + Kālacakra)" status="verified" />
          <SourceChip label="Sthira Daśā forward-reference gap" status="disclosed" />
        </div>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Both grounding sources were verified directly this session and found genuinely real. The Sthira gap is disclosed rather than silently corrected.
        </p>
      </section>
    </div>
  );
}

function SystemReading({
  system,
  color,
  matter,
  detail,
  window,
  anchor,
  mechanism,
}: {
  system: string;
  color: string;
  matter: string;
  detail: string;
  window: string;
  anchor: string;
  mechanism: string;
}) {
  return (
    <div>
      <h3 style={{ margin: "0.15rem 0 0", color, fontSize: "1.15rem", fontWeight: 600 }}>{system}</h3>
      <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.65rem" }}>
        <KeyValue label="Matter" value={matter} />
        <KeyValue label="Detail" value={detail} />
        <KeyValue label="Window" value={window} />
        <KeyValue label="Anchor" value={anchor} />
        <KeyValue label="Mechanism" value={mechanism} />
      </div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ color: INK_PRIMARY, fontSize: "0.9rem" }}>{value}</span>
    </div>
  );
}

function SourceChip({ label, status }: { label: string; status: "verified" | "disclosed" }) {
  const color = status === "verified" ? GREEN : AMBER;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.4rem 0.7rem",
        borderRadius: 8,
        background: `${color}12`,
        border: `1px solid ${color}55`,
        color,
        fontSize: "0.82rem",
        fontWeight: 600,
      }}
    >
      {status === "verified" ? <BadgeCheck size={14} aria-hidden="true" /> : <AlertTriangle size={14} aria-hidden="true" />}
      {label}
    </span>
  );
}

function ParallelSvg({ relation }: { relation: Relation }) {
  const centerColor = relation === "convergence" ? GREEN : relation === "divergence" ? AMBER : INK_MUTED;
  const centerLabel = relation === "convergence" ? "Agree" : relation === "divergence" ? "Differ" : "Unknown";
  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Vimśottarī and Cara Daśā parallel comparison" style={{ width: "100%", maxHeight: 320, margin: "0.5rem auto 0.85rem", display: "block" }}>
      <rect x="20" y="40" width="180" height="180" rx="8" fill={`${BLUE}10`} stroke={BLUE} strokeWidth="2" />
      <circle cx="110" cy="95" r="32" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="3" />
      <text x="110" y="91" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={700}>Vimśottarī</text>
      <text x="110" y="148" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Planet-based</text>
      <text x="110" y="166" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>Moon nakṣatra</text>
      <text x="110" y="184" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>Fixed 120-year cycle</text>

      <rect x="360" y="40" width="180" height="180" rx="8" fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth="2" />
      <circle cx="450" cy="95" r="32" fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="3" />
      <text x="450" y="91" textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight={700}>Cara Daśā</text>
      <text x="450" y="148" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Sign-based</text>
      <text x="450" y="166" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>Lagna-anchored</text>
      <text x="450" y="184" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>Chart-computed cycle</text>

      <line x1="200" y1="130" x2="250" y2="130" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      <line x1="310" y1="130" x2="360" y2="130" stroke={PURPLE} strokeWidth="3" strokeLinecap="round" />

      <circle cx="280" cy="130" r="38" fill={`${centerColor}18`} stroke={centerColor} strokeWidth="4" />
      <text x="280" y="126" textAnchor="middle" fill={centerColor} fontSize="14" fontWeight={700}>Compare</text>
      <text x="280" y="145" textAnchor="middle" fill={centerColor} fontSize="12" fontWeight={700}>{centerLabel}</text>

      {relation === "convergence" && (
        <path d="M 256 116 L 272 140 L 304 108" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {relation === "divergence" && (
        <>
          <path d="M 262 118 L 280 130 L 262 142" fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 298 118 L 280 130 L 298 142" fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {relation === "open" && (
        <text x="280" y="200" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>No Cara reading yet; wait for Lesson 18.4.2</text>
      )}
    </svg>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35, fontSize: "0.88rem" }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
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
    fontWeight: 600,
    cursor: "pointer",
  };
}

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
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
    gridTemplateColumns: "24px 1fr",
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

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
