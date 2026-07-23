"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ClipboardList, GitCompare, RotateCcw, Scale, Sparkles, TriangleAlert } from "lucide-react";

type ThreadKey = "capacity" | "saturn" | "d4Friction" | "venus";
type LensKey = "table" | "counting" | "client" | "reference";

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

const THREADS: Record<ThreadKey, { label: string; short: string; detail: string; color: string; independence: string }> = {
  capacity: {
    label: "Underlying capacity",
    short: "Strong property promise",
    detail: "D1 Mars strength, 4th-house occupation, supportive aspect, and D4 Moon-lord kendra support the property theme.",
    color: GREEN,
    independence: "Genuinely convergent property-strength thread",
  },
  saturn: {
    label: "Process complication",
    short: "One Saturn fact, not two",
    detail: "Saturn as 4th lord and secondary karaka repeats the same process-level complication: paperwork, title, inheritance, or family process.",
    color: BLUE,
    independence: "One independent fact even when read from two angles",
  },
  d4Friction: {
    label: "D4 delivery friction",
    short: "Finer-grained delivery is harder",
    detail: "Mars and Venus fall in D4 dignity, giving delivery friction and a modest family/domestic texture.",
    color: GOLD,
    independence: "Independent D4 qualification of D1 promise",
  },
  venus: {
    label: "Vehicles/comfort",
    short: "Separate Venus domain",
    detail: "Venus gives a smooth D1 vehicles/material-comfort thread, with its own D4 complication.",
    color: PURPLE,
    independence: "Separate domain, not folded into land/property",
  },
};

const LENSES: Record<LensKey, { label: string; title: string; body: string; icon: ReactNode; color: string; thread: ThreadKey }> = {
  table: {
    label: "Assembly",
    title: "Group rows into independent threads",
    body: "The seven table rows reduce to four distinct findings, not seven independent proofs.",
    icon: <ClipboardList size={16} />,
    color: BLUE,
    thread: "capacity",
  },
  counting: {
    label: "Counting",
    title: "Count evidence, not lesson volume",
    body: "Eight lessons do not mean eight independent findings. Confidence tracks genuine independence.",
    icon: <Scale size={16} />,
    color: GREEN,
    thread: "saturn",
  },
  client: {
    label: "Client",
    title: "Nuance is precision, not evasion",
    body: "The final reading should name capacity, complication, D4 friction, and the separate Venus thread.",
    icon: <Sparkles size={16} />,
    color: GOLD,
    thread: "d4Friction",
  },
  reference: {
    label: "Reference",
    title: "Carry this as the Chapter 3 baseline",
    body: "This combined D1+D4 specification becomes the standing reference for Lal Kitab and KP property work.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
    thread: "venus",
  },
};

export function D4CompletePropertyReadingAssemblyLab() {
  const [threadKey, setThreadKey] = useState<ThreadKey>("capacity");
  const [lensKey, setLensKey] = useState<LensKey>("table");
  const [countIndependentOnly, setCountIndependentOnly] = useState(true);
  const [includeVenusThread, setIncludeVenusThread] = useState(true);
  const [frameNuanceAsPrecision, setFrameNuanceAsPrecision] = useState(true);

  const thread = THREADS[threadKey];
  const lens = LENSES[lensKey];

  const threadCount = useMemo(() => {
    if (!countIndependentOnly) return 7;
    return includeVenusThread ? 4 : 3;
  }, [countIndependentOnly, includeVenusThread]);

  const verdict = useMemo(() => {
    if (!countIndependentOnly) return { label: "over-counting warning", color: VERMILION };
    if (!includeVenusThread) return { label: "Venus thread omitted", color: GOLD };
    if (!frameNuanceAsPrecision) return { label: "nuance framed as hedge", color: VERMILION };
    return { label: "complete reading assembled", color: GREEN };
  }, [countIndependentOnly, frameNuanceAsPrecision, includeVenusThread]);

  const clientSummary = useMemo(() => {
    if (!countIndependentOnly) return "Repair the evidence count: the table has seven rows, but only four genuinely independent threads.";
    if (!includeVenusThread) return "Restore the separate Venus thread so vehicles and material comforts are not lost in the land/property answer.";
    if (!frameNuanceAsPrecision) return "Frame the multi-part answer as accuracy, not evasiveness. The chart genuinely gives more than one kind of finding.";
    return "Strong underlying property capacity, one consistent Saturn process-complication, real D4 delivery friction with a modest family-linked texture, and a separate Venus vehicles/comfort thread.";
  }, [countIndependentOnly, frameNuanceAsPrecision, includeVenusThread]);

  function loadLens(key: LensKey) {
    setLensKey(key);
    setThreadKey(LENSES[key].thread);
    setCountIndependentOnly(true);
    setIncludeVenusThread(true);
    setFrameNuanceAsPrecision(true);
  }

  return (
    <div data-interactive="d4-complete-property-reading-assembly-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D1 + D4 property assembly</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Convert the chapter table into a complete client reading
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Group repeated findings, count only genuinely independent threads, and keep the separate Venus comfort thread in the final answer.
            </p>
          </div>
          <button type="button" onClick={() => { setThreadKey("capacity"); setLensKey("table"); setCountIndependentOnly(true); setIncludeVenusThread(true); setFrameNuanceAsPrecision(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(LENSES) as LensKey[]).map((key) => (
            <button key={key} type="button" onClick={() => loadLens(key)} style={buttonStyle(lensKey === key, LENSES[key].color)}>
              {LENSES[key].icon}
              {LENSES[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)", gap: "1rem", alignItems: "start" }}>
        <div style={cardStyle}>
          <AssemblySvg activeThread={threadKey} threadCount={threadCount} verdict={verdict} includeVenusThread={includeVenusThread} />
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: lens.color, fontSize: "1.06rem", fontWeight: 600 }}>{lens.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{lens.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>choose thread</p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.keys(THREADS) as ThreadKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setThreadKey(key)} style={optionStyle(threadKey === key, THREADS[key].color)}>
                  <span style={{ fontWeight: 600 }}>{THREADS[key].label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{THREADS[key].short}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>assembly discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Count independent threads" body="Do not count lessons or repeated Saturn facts as new evidence." color={GREEN} value={countIndependentOnly} onToggle={() => setCountIndependentOnly((value) => !value)} />
              <ToggleRow title="Include Venus thread" body="Keep vehicles and material comforts as a separate domain." color={PURPLE} value={includeVenusThread} onToggle={() => setIncludeVenusThread((value) => !value)} />
              <ToggleRow title="Frame nuance as precision" body="Multi-part answer is accuracy, not evasiveness." color={GOLD} value={frameNuanceAsPrecision} onToggle={() => setFrameNuanceAsPrecision((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}>{verdict.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>client-facing assembly</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{clientSummary}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{thread.independence}: {thread.detail}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AssemblySvg({ activeThread, threadCount, verdict, includeVenusThread }: { activeThread: ThreadKey; threadCount: number; verdict: { label: string; color: string }; includeVenusThread: boolean }) {
  const visibleThreads = (Object.keys(THREADS) as ThreadKey[]).filter((key) => includeVenusThread || key !== "venus");
  return (
    <svg viewBox="0 0 760 520" role="img" aria-label="Complete D1 and D4 property reading assembly diagram" style={{ width: "100%", minHeight: 440, display: "block" }}>
      <rect x="12" y="12" width="736" height="496" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="700">CHART P1 D1 + D4 ASSEMBLY</text>
      <text x="380" y="92" textAnchor="middle" fill={verdict.color} fontSize="22" fontWeight="700">{verdict.label}</text>

      {visibleThreads.map((key, index) => {
        const thread = THREADS[key];
        const x = 136 + (index % 2) * 488;
        const y = 184 + Math.floor(index / 2) * 126;
        const active = key === activeThread;
        return (
          <g key={key}>
            <rect x={x - 118} y={y - 50} width="236" height="100" rx="16" fill={thread.color} fillOpacity={active ? "0.18" : "0.1"} stroke={active ? thread.color : HAIRLINE} strokeWidth={active ? "2" : "1.5"} />
            <text x={x} y={y - 17} textAnchor="middle" fill={thread.color} fontSize="15" fontWeight="700">{thread.label}</text>
            <text x={x} y={y + 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">{thread.short}</text>
            <text x={x} y={y + 35} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600">{thread.independence}</text>
          </g>
        );
      })}

      <path d="M154 428 C260 376 311 376 380 428 S522 480 606 428" fill="none" stroke={verdict.color} strokeWidth="5" strokeLinecap="round" />
      <text x="380" y="460" textAnchor="middle" fill={verdict.color} fontSize="15" fontWeight="700">Independent thread count: {threadCount}</text>
      <text x="380" y="486" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="600">Count findings, not lessons or table rows.</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function optionStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
