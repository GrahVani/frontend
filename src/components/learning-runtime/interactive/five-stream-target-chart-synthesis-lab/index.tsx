"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, Layers3, LockKeyhole, RotateCcw, ShieldAlert, Split, Workflow } from "lucide-react";

type StreamKey = "parashara" | "kp" | "jaimini" | "lal" | "tajika";
type ViewKey = "session" | "substrate" | "verdict" | "dharma" | "open";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const STREAMS: Record<StreamKey, { label: string; role: string; finding: string; thread: string }> = {
  parashara: { label: "Parasari", role: "baseline diagnosis", finding: "Saturn as strained 7th lord; weak-to-moderate tier", thread: "marriage" },
  kp: { label: "KP", role: "activation test", finding: "Saturn as 7th cuspal sub-lord; clean YES", thread: "marriage" },
  jaimini: { label: "Jaimini", role: "substrate and dharma", finding: "Saturn DK; Mars AK Karakamsha dharma thread", thread: "both" },
  lal: { label: "Lal Kitab", role: "remedy texture", finding: "Saturn box 4 confirms texture; Mars box 10 stays separate", thread: "both" },
  tajika: { label: "Tajika", role: "annual timescale", finding: "7th-house Muntha; Saturn candidate, not confirmed Varsesha", thread: "marriage partial" },
};

const VIEWS: Record<ViewKey, { label: string; title: string; detail: string; icon: ReactNode }> = {
  session: { label: "Session order", title: "Assemble, do not recompute", detail: "Each panel cites an already-computed finding from Chapters 2-5.", icon: <Workflow size={16} /> },
  substrate: { label: "Substrate", title: "Saturn four ways and counting", detail: "Parasari, KP, Jaimini, and Lal Kitab converge fully on Saturn; Tajika adds partial Saturn candidacy.", icon: <Layers3 size={16} /> },
  verdict: { label: "Verdict", title: "Still bifurcated", detail: "KP says clean YES; Parasari remains weak-to-moderate. Corroboration is not extra votes.", icon: <GitCompare size={16} /> },
  dharma: { label: "Dharma", title: "Mars thread stays separate", detail: "Karakamsha, Lal Kitab box 10, and Punya Saham resonate around vocation, not marriage.", icon: <Split size={16} /> },
  open: { label: "Open items", title: "Completeness has edges", detail: "Varsesha is not confirmed, dasha timing for the featured year is not run, and the verdict remains bifurcated.", icon: <LockKeyhole size={16} /> },
};

export function FiveStreamTargetChartSynthesisLab() {
  const [stream, setStream] = useState<StreamKey>("parashara");
  const [view, setView] = useState<ViewKey>("substrate");
  const [assembleOnly, setAssembleOnly] = useState(true);
  const [axesSeparate, setAxesSeparate] = useState(true);
  const [threadsSeparate, setThreadsSeparate] = useState(true);
  const [partialNamed, setPartialNamed] = useState(true);

  const selectedStream = STREAMS[stream];
  const selectedView = VIEWS[view];

  const status = useMemo(() => {
    if (!assembleOnly || !axesSeparate || !threadsSeparate || !partialNamed) return { label: "synthesis needs repair", icon: <ShieldAlert size={18} /> };
    return { label: "5-stream synthesis scoped", icon: <BadgeCheck size={18} /> };
  }, [assembleOnly, axesSeparate, partialNamed, threadsSeparate]);

  const outputLine = useMemo(() => {
    if (!assembleOnly) return "Repair: this lesson assembles already-computed findings; do not introduce fresh derivations here.";
    if (!axesSeparate) return "Repair: Saturn substrate convergence does not answer the separate verdict-style divergence.";
    if (!threadsSeparate) return "Repair: Mars dharma-thread evidence cannot raise the marriage-confidence tier.";
    if (!partialNamed) return "Repair: name the open edges, especially Tajika Varsesha candidacy rather than confirmation.";
    return "Five-stream synthesis: the marriage thread shows strong Saturn substrate convergence across four complete mechanisms plus one partial Tajika timing thread; the verdict remains bifurcated, with KP clean YES and Parasari weak-to-moderate. The Mars dharma thread is real and separate. Nadi remains correctly absent.";
  }, [assembleOnly, axesSeparate, partialNamed, threadsSeparate]);

  return (
    <div data-interactive="five-stream-target-chart-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Full 5-stream target chart synthesis</p>
            <h2 style={headingStyle}>Run the session without blending the threads</h2>
            <p style={bodyStyle}>Select streams, inspect synthesis views, and preserve the difference between substrate, verdict, dharma, and open edges.</p>
          </div>
          <span style={statusPillStyle}>{status.icon}{status.label}</span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Five-stream session map</p>
          <StreamDiagram active={stream} />
          <div style={buttonGridStyle}>
            {(Object.keys(STREAMS) as StreamKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setStream(key)} style={choiceStyle(stream === key)} aria-pressed={stream === key}>
                {STREAMS[key].label}
              </button>
            ))}
          </div>
        </div>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected stream</p>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selectedStream.label}</p>
            <p style={smallTextStyle}>{selectedStream.role}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>{selectedStream.finding}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>Thread: {selectedStream.thread}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis views</p>
          <div style={buttonGridStyle}>
            {(Object.keys(VIEWS) as ViewKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setView(key)} style={choiceStyle(view === key)} aria-pressed={view === key}>
                {VIEWS[key].icon}{VIEWS[key].label}
              </button>
            ))}
          </div>
        </div>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected view</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selectedView.icon}</span>
            <p style={panelTitleStyle}>{selectedView.title}</p>
            <p style={smallTextStyle}>{selectedView.detail}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={assembleOnly} onChange={setAssembleOnly} label="Assemble, do not recompute" icon={<Workflow size={16} />} />
            <ToggleRow checked={axesSeparate} onChange={setAxesSeparate} label="Substrate and verdict kept separate" icon={<GitCompare size={16} />} />
            <ToggleRow checked={threadsSeparate} onChange={setThreadsSeparate} label="Marriage and dharma threads kept separate" icon={<Split size={16} />} />
            <ToggleRow checked={partialNamed} onChange={setPartialNamed} label="Open partials named" icon={<LockKeyhole size={16} />} />
          </div>
          <button type="button" onClick={() => { setStream("parashara"); setView("substrate"); setAssembleOnly(true); setAxesSeparate(true); setThreadsSeparate(true); setPartialNamed(true); }} style={{ ...softButtonStyle, marginTop: "0.9rem" }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis-output line</p>
          <p style={bodyStyle}>{outputLine}</p>
        </div>
      </section>
    </div>
  );
}

function StreamDiagram({ active }: { active: StreamKey }) {
  const keys = Object.keys(STREAMS) as StreamKey[];
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="Five stream synthesis session map" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="204" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {keys.map((key, index) => {
        const x = 44 + index * 126;
        const selected = active === key;
        return (
          <g key={key}>
            {index > 0 ? <path d={`M ${x - 34} 88 L ${x - 10} 88`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" /> : null}
            <rect x={x} y="54" width="104" height="68" rx="8" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x + 52} y="79" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{STREAMS[key].label}</text>
            <text x={x + 52} y="98" textAnchor="middle" fontSize="9" fill={INK_MUTED}>{index + 1}</text>
          </g>
        );
      })}
      <rect x="104" y="156" width="204" height="30" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="206" y="176" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Marriage: Saturn substrate</text>
      <rect x="372" y="156" width="204" height="30" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="474" y="176" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Dharma: Mars thread</text>
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

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)", gap: "1rem" };
const buttonGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const factPanelStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.9rem", minHeight: "10.5rem", background: SURFACE };
const eyebrowStyle: CSSProperties = { margin: 0, fontSize: "0.78rem", letterSpacing: 0, textTransform: "uppercase", color: ACCENT, fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.25rem 0 0", fontSize: "1.35rem", lineHeight: 1.22, color: INK_PRIMARY, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.48rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" };
const smallTextStyle: CSSProperties = { margin: "0.28rem 0 0", color: INK_MUTED, lineHeight: 1.45, fontSize: "0.86rem" };
const panelTitleStyle: CSSProperties = { margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1rem", lineHeight: 1.32, fontWeight: 500 };
const statusPillStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 999, padding: "0.45rem 0.7rem", color: INK_SECONDARY, background: SURFACE, fontSize: "0.86rem", whiteSpace: "nowrap" };
const softButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.72rem", background: SURFACE, color: INK_PRIMARY, cursor: "pointer", font: "inherit", fontSize: "0.9rem" };

function choiceStyle(active: boolean): CSSProperties {
  return { ...softButtonStyle, justifyContent: "flex-start", borderColor: active ? ACCENT : HAIRLINE, color: active ? INK_PRIMARY : INK_SECONDARY };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.72rem", background: SURFACE, color: checked ? INK_PRIMARY : INK_MUTED };
}

