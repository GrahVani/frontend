"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Grid3X3,
  Layers,
  MapPinned,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type DashaKey = "vimshottari" | "sula" | "manduka" | "cakra" | "caturasiti" | "dvadasottari" | "satabdika" | "sastihayani";
type MistakeKey = "blanket" | "shortfall" | "computeAll";
type RouteChoice = "invent" | "dismiss" | "refuse" | "honest" | null;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";

const DASHAS: Record<DashaKey, {
  label: string;
  cycle: string;
  character: string;
  status: string;
  color: string;
  icon: ReactNode;
  note: string;
}> = {
  vimshottari: {
    label: "Vimśottarī",
    cycle: "120 years",
    character: "Default planetary daśā",
    status: "Computed throughout",
    color: BLUE,
    icon: <Compass size={18} aria-hidden="true" />,
    note: "Unconditional baseline. Always run first; conditionals are added to it, never substituted for it.",
  },
  sula: {
    label: "Ṣūla",
    cycle: "varies",
    character: "Sign-based, special condition",
    status: "Recognition only",
    color: AMBER,
    icon: <Grid3X3 size={18} aria-hidden="true" />,
    note: "Real system, but T1-10 10.7.1 states its exact condition varies by recension. Not computed in this module.",
  },
  manduka: {
    label: "Maṇḍūka",
    cycle: "varies",
    character: "'Frog-like' jumping pattern",
    status: "Recognition only",
    color: AMBER,
    icon: <MapPinned size={18} aria-hidden="true" />,
    note: "Named and characterised; no verified computable rule is available in the sources read for this module.",
  },
  cakra: {
    label: "Cakra",
    cycle: "varies",
    character: "'Wheel' pattern",
    status: "Recognition only",
    color: AMBER,
    icon: <RotateCcw size={18} aria-hidden="true" />,
    note: "Held at awareness level per T1-10's own 'recognition, not computation' framing.",
  },
  caturasiti: {
    label: "Caturāśīti-Sama",
    cycle: "84 years",
    character: "Equal-period system",
    status: "Recognition only",
    color: AMBER,
    icon: <Layers size={18} aria-hidden="true" />,
    note: "Cycle length known; specific activation condition and allotment not verified here.",
  },
  dvadasottari: {
    label: "Dvādaśottarī",
    cycle: "112 years",
    character: "12-multiple system",
    status: "Recognition only",
    color: AMBER,
    icon: <Layers size={18} aria-hidden="true" />,
    note: "Named in BPHS 56; not computed beyond recognition in this module.",
  },
  satabdika: {
    label: "Śatābdikā",
    cycle: "100 years",
    character: "Centennial system",
    status: "Recognition only",
    color: AMBER,
    icon: <Layers size={18} aria-hidden="true" />,
    note: "Named in BPHS 57; held at selection-criteria depth.",
  },
  sastihayani: {
    label: "Ṣaṣṭi-hāyanī",
    cycle: "60 years",
    character: "60-year Jovian cycle",
    status: "Recognition only",
    color: AMBER,
    icon: <Layers size={18} aria-hidden="true" />,
    note: "Named in BPHS 58; condition-gated like the others.",
  },
};

const DASHA_ORDER: DashaKey[] = [
  "vimshottari",
  "sula",
  "manduka",
  "cakra",
  "caturasiti",
  "dvadasottari",
  "satabdika",
  "sastihayani",
];

const MISTAKES: Record<MistakeKey, { label: string; offText: string }> = {
  blanket: {
    label: "T1-10’s gap is specific to Chapters 3-4, not the whole module",
    offText: "Warning: Chapters 5, 6, and 7 were verified genuinely real; only Chapters 3-4 are the confirmed gap.",
  },
  shortfall: {
    label: "Selection-criteria depth matches T1-10’s own stated limit",
    offText: "Warning: T1-10 10.7.1 says the goal is recognition, not hand computation. Matching that limit is responsible, not a shortfall.",
  },
  computeAll: {
    label: "Classical standing does not equal verified computability",
    offText: "Warning: a system can be genuinely classical and still lack a verified, specific rule in the sources this module has read.",
  },
};

const ROUTE_OPTIONS: { id: RouteChoice; label: string; feedback: string; ok: boolean }[] = [
  { id: "invent", label: "Invent a specific Ṣūla condition and compute it", feedback: "This invents precision T1-10 itself declined to assert.", ok: false },
  { id: "dismiss", label: "Say Ṣūla Daśā is not a real classical system", feedback: "Ṣūla is genuinely named in BPHS/T1-10; the issue is computability, not reality.", ok: false },
  { id: "refuse", label: "Refuse to answer the question", feedback: "Refusing is less useful than naming the gap and pointing to the source.", ok: false },
  { id: "honest", label: "Acknowledge the condition varies by recension and decline to invent a rule", feedback: "Correct: name what the source says and where its precision stops.", ok: true },
];

export function ParasharaSelectionCriteriaWorkbench() {
  const [selected, setSelected] = useState<DashaKey>("vimshottari");
  const [deepCompute, setDeepCompute] = useState(false);
  const [route, setRoute] = useState<RouteChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    blanket: true,
    shortfall: true,
    computeAll: true,
  });

  const allHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setSelected("vimshottari");
    setDeepCompute(false);
    setRoute(null);
    setMistakes({ blanket: true, shortfall: true, computeAll: true });
  }

  return (
    <div data-interactive="parashara-selection-criteria-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Conditional daśā selection</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Parāśara’s default-plus-conditionals hierarchy
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Vimśottarī is the baseline. Seven further daśās activate only when their own conditions are met — and are held at recognition depth, following T1-10’s own framing.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Default + conditionals landscape</p>
        <HierarchySvg />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
          {DASHA_ORDER.map((key) => {
            const d = DASHAS[key];
            const active = key === selected;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => { setSelected(key); setRoute(null); }}
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: `1px solid ${active ? d.color : HAIRLINE}`,
                  background: active ? `${d.color}10` : SURFACE,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: d.color, fontWeight: 700 }}>
                  {d.icon} {d.label}
                </div>
                <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.4 }}>
                  {d.cycle}
                </p>
              </button>
            );
          })}
        </div>
        <DetailPanel dashaKey={selected} />
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Scope-decision switch</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            How deeply should this module treat the seven conditionals?
          </h3>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button
              type="button"
              aria-pressed={!deepCompute}
              onClick={() => setDeepCompute(false)}
              style={{ ...buttonStyle(!deepCompute, GREEN), flex: 1, justifyContent: "center" }}
            >
              Selection-criteria depth
            </button>
            <button
              type="button"
              aria-pressed={deepCompute}
              onClick={() => setDeepCompute(true)}
              style={{ ...buttonStyle(deepCompute, VERMILION), flex: 1, justifyContent: "center" }}
            >
              Full computation
            </button>
          </div>
          {deepCompute ? (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
              <AlertTriangle size={20} color={VERMILION} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Full computation would require inventing precise rules that T1-10 10.7.1 explicitly says vary by recension and holds at recognition level.
                This module chooses selection-criteria depth to stay faithful to the verified source.
              </p>
            </div>
          ) : (
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Correct. The module names each conditional, gives its cycle and character, checks whether its general condition might apply,
              and stops there — exactly the depth T1-10 declares for this level. Aṣṭottarī and Yoginī are exceptions only because their full structures are verified separately.
            </p>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="Operational discipline" icon={<ShieldCheck size={18} />} color={BLUE}>
            <ol style={{ margin: 0, paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Run Vimśottarī always.</li>
              <li>Check each conditional’s own Parāśara condition.</li>
              <li>Add any that are met.</li>
              <li>Cross-validate; never override Vimśottarī.</li>
            </ol>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Route the learner’s question</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          “Can you compute Kavya’s Ṣūla Daśā?”
        </h3>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
          {ROUTE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={route === opt.id}
              onClick={() => setRoute(opt.id)}
              style={scenarioButtonStyle(route === opt.id, opt.ok ? GREEN : VERMILION)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {route && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.65rem 0.85rem",
              borderRadius: 8,
              background: ROUTE_OPTIONS.find((o) => o.id === route)?.ok ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${ROUTE_OPTIONS.find((o) => o.id === route)?.ok ? GREEN : VERMILION}55`,
              color: ROUTE_OPTIONS.find((o) => o.id === route)?.ok ? GREEN : VERMILION,
            }}
          >
            {ROUTE_OPTIONS.find((o) => o.id === route)?.feedback}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>T1-10 disclosure arc</p>
        <T1_10_ArcSvg />
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Chapters 3-4 remain the confirmed gap. Chapters 5, 6, and 7 (13 lessons total) were verified genuinely real this session,
          completing the precise, chapter-level disclosure this module began in Lesson 18.1.1.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const on = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !on }))}
                style={togglePanelStyle(on, on ? GREEN : VERMILION)}
              >
                {on ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 700 }}>{MISTAKES[key].label}</strong>
                  <span>{on ? " — discipline held." : ` ${MISTAKES[key].offText}`}</span>
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
            ? "All discipline commitments are held. The conditional-daśā scope decision is consistent and honest."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function DetailPanel({ dashaKey }: { dashaKey: DashaKey }) {
  const d = DASHAS[dashaKey];
  return (
    <div
      style={{
        marginTop: "0.85rem",
        padding: "0.85rem",
        borderRadius: 8,
        border: `1px solid ${d.color}55`,
        background: `${d.color}0A`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: d.color, fontWeight: 700 }}>
        {d.icon} {d.label}
      </div>
      <div style={{ display: "grid", gap: "0.35rem", marginTop: "0.5rem" }}>
        <KeyValue label="Cycle" value={d.cycle} />
        <KeyValue label="Character" value={d.character} />
        <KeyValue label="Status" value={d.status} />
      </div>
      <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{d.note}</p>
    </div>
  );
}

function HierarchySvg() {
  const cx = 280;
  const cy = 110;
  const radius = 80;
  const satelliteR = 210;
  const keys = DASHA_ORDER.filter((k) => k !== "vimshottari");

  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Vimshottari default with seven conditional dashas" style={{ width: "100%", maxHeight: 280, margin: "0.5rem auto 0.75rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={radius} fill={`${BLUE}12`} stroke={BLUE} strokeWidth="3" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={BLUE} fontSize="15" fontWeight={700}>Vimśottarī</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>default baseline</text>
      {keys.map((key, idx) => {
        const angle = (idx * 360) / keys.length - 90;
        const rad = (angle * Math.PI) / 180;
        const sx = cx + satelliteR * Math.cos(rad);
        const sy = cy + satelliteR * Math.sin(rad);
        const color = DASHAS[key].color;
        return (
          <g key={key}>
            <line x1={cx + radius * Math.cos(rad)} y1={cy + radius * Math.sin(rad)} x2={sx - 36 * Math.cos(rad)} y2={sy - 36 * Math.sin(rad)} stroke={HAIRLINE} strokeWidth="1.5" />
            <circle cx={sx} cy={sy} r={36} fill={`${color}12`} stroke={color} strokeWidth="2" />
            <text x={sx} y={sy - 2} textAnchor="middle" fill={color} fontSize="10" fontWeight={700}>{DASHAS[key].label}</text>
            <text x={sx} y={sy + 12} textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>{DASHAS[key].cycle}</text>
          </g>
        );
      })}
      <text x={cx} y={245} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Conditionals cross-validate, never override the default</text>
    </svg>
  );
}

function T1_10_ArcSvg() {
  return (
    <svg viewBox="0 0 560 120" role="img" aria-label="T1-10 chapter verification arc" style={{ width: "100%", maxHeight: 160, margin: "0.5rem auto 0.5rem", display: "block" }}>
      <rect x="30" y="30" width="110" height="60" rx="8" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="85" y="55" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={700}>Ch 1-2</text>
      <text x="85" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>not re-checked</text>

      <rect x="160" y="30" width="110" height="60" rx="8" fill={`${VERMILION}10`} stroke={VERMILION} strokeWidth="2" />
      <text x="215" y="55" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={700}>Ch 3-4</text>
      <text x="215" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>confirmed gap</text>

      <rect x="290" y="30" width="80" height="60" rx="8" fill={`${GREEN}10`} stroke={GREEN} strokeWidth="2" />
      <text x="330" y="55" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={700}>Ch 5</text>
      <text x="330" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>real</text>

      <rect x="390" y="30" width="70" height="60" rx="8" fill={`${GREEN}10`} stroke={GREEN} strokeWidth="2" />
      <text x="425" y="55" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={700}>Ch 6</text>
      <text x="425" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>real</text>

      <rect x="480" y="30" width="70" height="60" rx="8" fill={`${GREEN}10`} stroke={GREEN} strokeWidth="2" />
      <text x="515" y="55" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={700}>Ch 7</text>
      <text x="515" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>real</text>

      <text x="280" y="110" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Precise chapter-level disclosure: the gap is bounded to Chapters 3-4</text>
    </svg>
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
