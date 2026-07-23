"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  GitCompare,
  Layers,
  RefreshCcw,
  Route,
  Search,
} from "lucide-react";

type TabKey = "spans" | "candidates" | "convergence" | "guard";
type CandidateKey = "A" | "B" | "C";

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

const TABS: Record<TabKey, { label: string; icon: typeof Route }> = {
  spans: { label: "Sub-lord spans", icon: Search },
  candidates: { label: "Candidates", icon: Layers },
  convergence: { label: "Convergence", icon: GitCompare },
  guard: { label: "Guard", icon: AlertTriangle },
};

const SPANS = [
  { lord: "Mars", start: 173.333, end: 174.111, width: 0.778 },
  { lord: "Rāhu", start: 174.111, end: 176.111, width: 2.0 },
  { lord: "Jupiter", start: 176.111, end: 177.889, width: 1.778 },
  { lord: "Saturn", start: 177.889, end: 180.0, width: 2.111 },
  { lord: "Mercury", start: 180.0, end: 181.889, width: 1.889 },
  { lord: "Ketu", start: 181.889, end: 182.667, width: 0.778 },
  { lord: "Venus", start: 182.667, end: 184.889, width: 2.222 },
  { lord: "Sun", start: 184.889, end: 185.556, width: 0.667 },
  { lord: "Moon", start: 185.556, end: 186.667, width: 1.111 },
];

const CANDIDATES: Record<CandidateKey, { time: string; lagna: string; absoluteDeg: number; subLord: string; overlap: boolean; note: string; classicalSet: string[]; roles: string[] }> = {
  A: {
    time: "05:48",
    lagna: "24°30′ Virgo",
    absoluteDeg: 174.5,
    subLord: "Rāhu",
    overlap: false,
    note: "Rāhu is new to A's classical set; the set expands.",
    classicalSet: ["Mercury", "Mars", "Jupiter", "Venus"],
    roles: ["Lagna sign-lord Mercury", "Lagna star-lord Mars", "Moon sign-lord Jupiter", "Moon star-lord Venus", "Day-lord Mars"],
  },
  B: {
    time: "06:00",
    lagna: "27°30′ Virgo",
    absoluteDeg: 177.5,
    subLord: "Jupiter",
    overlap: true,
    note: "Jupiter already holds Moon sign-lord; now it fills two roles.",
    classicalSet: ["Mercury", "Mars", "Jupiter", "Venus"],
    roles: ["Lagna sign-lord Mercury", "Lagna star-lord Mars", "Moon sign-lord Jupiter", "Moon star-lord Venus", "Day-lord Mercury"],
  },
  C: {
    time: "06:12",
    lagna: "0°30′ Libra",
    absoluteDeg: 180.5,
    subLord: "Mercury",
    overlap: true,
    note: "Mercury already holds day-lord; now it fills two roles.",
    classicalSet: ["Venus", "Mars", "Jupiter", "Mercury"],
    roles: ["Lagna sign-lord Venus", "Lagna star-lord Mars", "Moon sign-lord Jupiter", "Moon star-lord Venus", "Day-lord Mercury"],
  },
};

const METHODS = [
  { chapter: "Chapter 2", method: "House-lordship", input: "Which house a daśā lord rules", result: "C excluded; A/B tied" },
  { chapter: "Chapter 3", method: "Tattva-śuddhi", input: "Element of moment vs Lagna element", result: "B favoured over A" },
  { chapter: "Chapter 4", method: "Sub-lord overlap", input: "Exact Lagna degree through 249-fold subdivision", result: "B's RP set more concentrated than A's" },
];

function SpanSvg({ selectedCandidate }: { selectedCandidate: CandidateKey }) {
  const c = CANDIDATES[selectedCandidate];
  const totalWidth = 186.667 - 173.333;
  const leftPad = 40;
  const chartWidth = 380;
  const scale = chartWidth / totalWidth;
  const xFor = (deg: number) => leftPad + (deg - 173.333) * scale;
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label="Chitra nakshatra sub-lord spans" style={{ width: "100%", maxHeight: 240, display: "block" }}>
      <rect x={10} y={10} width={440} height={200} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Chitra nakṣatra sub-lord spans</text>

      <text x={leftPad} y={60} textAnchor="start" fill={INK_MUTED} fontSize={10}>173.333°</text>
      <text x={leftPad + chartWidth} y={60} textAnchor="end" fill={INK_MUTED} fontSize={10}>186.667°</text>

      {SPANS.map((s, i) => {
        const x1 = xFor(s.start);
        const x2 = xFor(s.end);
        const w = x2 - x1;
        const y = 80 + (i % 3) * 28;
        const active = c.absoluteDeg >= s.start && c.absoluteDeg < s.end;
        return (
          <g key={s.lord}>
            <rect x={x1} y={y} width={w} height={22} rx={4} fill={active ? GREEN : `${INK_MUTED}22`} stroke={active ? GREEN : HAIRLINE} />
            <text x={(x1 + x2) / 2} y={y + 15} textAnchor="middle" fill={active ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>{s.lord}</text>
          </g>
        );
      })}

      {/* Candidate marker */}
      <line x1={xFor(c.absoluteDeg)} y1={70} x2={xFor(c.absoluteDeg)} y2={165} stroke={VERMILION} strokeWidth={2} strokeDasharray="4 4" />
      <polygon points={`${xFor(c.absoluteDeg) - 5},70 ${xFor(c.absoluteDeg) + 5},70 ${xFor(c.absoluteDeg)},78`} fill={VERMILION} />
      <text x={xFor(c.absoluteDeg)} y={180} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Candidate {selectedCandidate} · {c.absoluteDeg}° · {c.subLord}</text>
    </svg>
  );
}

function CandidateSvg({ candidate }: { candidate: CandidateKey }) {
  const c = CANDIDATES[candidate];
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label={`Candidate ${candidate} six role RP set`} style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${c.overlap ? GREEN : GOLD}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Candidate {candidate} · 6-role RP set</text>

      <circle cx={140} cy={95} r={50} fill={`${INK_MUTED}22`} stroke={HAIRLINE} />
      <text x={140} y={88} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>Classical 5-role</text>
      {c.classicalSet.map((p, i) => (
        <text key={p} x={140} y={106 + i * 14} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>{p}</text>
      ))}

      <path d="M 198 95 L 252 95" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="244,89 254,95 244,101" fill={INK_MUTED} />

      <circle cx={320} cy={95} r={38} fill={c.overlap ? `${GREEN}22` : `${GOLD}22`} stroke={c.overlap ? GREEN : GOLD} strokeWidth={2} />
      <text x={320} y={91} textAnchor="middle" fill={c.overlap ? GREEN : GOLD} fontSize={11} fontWeight={600}>+ sub-lord</text>
      <text x={320} y={109} textAnchor="middle" fill={INK_PRIMARY} fontSize={12} fontWeight={600}>{c.subLord}</text>

      <text x={230} y={168} textAnchor="middle" fill={c.overlap ? GREEN : GOLD} fontSize={11} fontWeight={600}>
        {c.overlap ? "Reinforces an existing role" : "New, non-reinforcing planet"}
      </text>
    </svg>
  );
}

function ConvergenceSvg() {
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label="Independent convergence of three methods" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${PURPLE}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Three independent paths</text>

      <circle cx={100} cy={90} r={34} fill={`${BLUE}22`} stroke={BLUE} strokeWidth={2} />
      <text x={100} y={86} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>Ch 2</text>
      <text x={100} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>house lords</text>

      <circle cx={230} cy={90} r={34} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
      <text x={230} y={86} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Ch 3</text>
      <text x={230} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>tattva</text>

      <circle cx={360} cy={90} r={34} fill={`${PURPLE}22`} stroke={PURPLE} strokeWidth={2} />
      <text x={360} y={86} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>Ch 4</text>
      <text x={360} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>sub-lord</text>

      <path d="M 138 90 C 170 90, 190 60, 210 70" fill="none" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 268 90 C 300 90, 270 60, 250 70" fill="none" stroke={HAIRLINE} strokeWidth={2} />

      <text x={230} y={158} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={600}>B favoured over A · independent convergence</text>
      <text x={230} y={175} textAnchor="middle" fill={INK_MUTED} fontSize={10}>C remains excluded on Chapter 2 grounds</text>
    </svg>
  );
}

function GuardSvg() {
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Guard against over generalisation" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Do not over-generalise</text>

      <rect x={50} y={60} width={160} height={50} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
      <text x={130} y={80} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Not a universal law</text>
      <text x={130} y={98} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>this chart&apos;s alignment only</text>

      <path d="M 220 85 L 240 85" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="232,79 242,85 232,91" fill={GREEN} />

      <rect x={250} y={60} width={160} height={50} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={330} y={80} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>What generalises</text>
      <text x={330} y={98} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>compute, check overlap, weigh</text>

      <text x={230} y={140} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>The method travels; this chart&apos;s particular answer does not</text>
    </svg>
  );
}

export function KpRppSubLordRefinementExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("spans");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateKey>("B");

  const reset = () => {
    setActiveTab("spans");
    setSelectedCandidate("B");
  };

  return (
    <div data-interactive="kp-rpp-sub-lord-refinement-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP RPP · Chapter 4</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Sub-lord refinement explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              When the classical five roles tie, the Lagna sub-lord is where KP already points for a finer resolution.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "spans" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Sub-lord spans</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>Chitra nakṣatra · 173.333°–186.667° absolute</h3>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={selectedCandidate === key} onClick={() => setSelectedCandidate(key)} style={buttonStyle(selectedCandidate === key, key === selectedCandidate ? BLUE : INK_MUTED)}>
                  Candidate {key} {CANDIDATES[key].time}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <SpanSvg selectedCandidate={selectedCandidate} />
            <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Sub-lord</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Start (°)</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>End (°)</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Width (°)</th>
                  </tr>
                </thead>
                <tbody>
                  {SPANS.map((s) => {
                    const active = CANDIDATES[selectedCandidate].absoluteDeg >= s.start && CANDIDATES[selectedCandidate].absoluteDeg < s.end;
                    return (
                      <tr key={s.lord} style={{ borderBottom: `1px solid ${HAIRLINE}`, background: active ? `${GREEN}10` : undefined }}>
                        <td style={{ padding: "0.55rem", color: active ? GREEN : INK_PRIMARY, fontWeight: 600 }}>{s.lord}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{s.start.toFixed(3)}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{s.end.toFixed(3)}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{s.width.toFixed(3)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {activeTab === "candidates" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Candidate comparison</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>Sub-lord and overlap status</h3>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={selectedCandidate === key} onClick={() => setSelectedCandidate(key)} style={buttonStyle(selectedCandidate === key, key === selectedCandidate ? PURPLE : INK_MUTED)}>
                  Candidate {key}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <CandidateSvg candidate={selectedCandidate} />
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${CANDIDATES[selectedCandidate].overlap ? GREEN : GOLD}55`, background: `${CANDIDATES[selectedCandidate].overlap ? GREEN : GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: CANDIDATES[selectedCandidate].overlap ? GREEN : GOLD, fontWeight: 600 }}>{CANDIDATES[selectedCandidate].overlap ? "Overlap" : "No overlap"}:</span> {CANDIDATES[selectedCandidate].note}
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: BLUE, fontWeight: 600 }}>Computed, not designed:</span> this sub-lord falls out of the 4-step algorithm applied to the Lagna degree fixed in Chapter 1 for unrelated reasons.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "convergence" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Independent convergence</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>Three mutually independent paths lean toward B</h3>
            <ConvergenceSvg />
          </section>

          <section style={cardStyle}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Source</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Method</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Input</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {METHODS.map((m) => (
                    <tr key={m.chapter} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <td style={{ padding: "0.6rem", color: INK_PRIMARY, fontWeight: 600 }}>{m.chapter}</td>
                      <td style={{ padding: "0.6rem", color: INK_SECONDARY }}>{m.method}</td>
                      <td style={{ padding: "0.6rem", color: INK_SECONDARY }}>{m.input}</td>
                      <td style={{ padding: "0.6rem", color: m.chapter === "Chapter 4" ? PURPLE : INK_SECONDARY, fontWeight: 600 }}>{m.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Why this is convergence, not corroboration:</span> none of these computations uses the output of another. They share no underlying dependency, so their agreement is genuinely new evidence.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "guard" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Guard</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>This chart&apos;s alignment is not a universal law</h3>
            <GuardSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Discipline</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Do not claim:</span> &quot;The correct candidate&apos;s sub-lord always overlaps an existing RP role.&quot; No such rule exists in T1-16 or this curriculum.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Do claim:</span> the reusable method — compute the sub-lord, check for role overlap, and weigh what you find in context.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}
