"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  GitCompare,
  RefreshCcw,
  Scale,
  Table2,
} from "lucide-react";

type TabKey = "table" | "narrowing" | "integration";
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

const TABS: Record<TabKey, { label: string; icon: typeof Table2 }> = {
  table: { label: "Coherence table", icon: Table2 },
  narrowing: { label: "A vs B narrowing", icon: GitCompare },
  integration: { label: "Integration", icon: Scale },
};

const ELEMENT_COLORS: Record<string, string> = {
  Earth: "#8B6F47",
  Water: "#4A90A4",
  Fire: "#C15B39",
  Air: "#7A8FA6",
  Ether: "#9B7AA6",
};

const CANDIDATES: Record<CandidateKey, { time: string; lagna: string; lagnaElement: string; momentTattva: string; result: "coherence" | "clash"; chapter2: string; note: string }> = {
  A: {
    time: "05:48",
    lagna: "Virgo",
    lagnaElement: "Earth",
    momentTattva: "Air",
    result: "clash",
    chapter2: "tied with B",
    note: "before sunrise",
  },
  B: {
    time: "06:00",
    lagna: "Virgo",
    lagnaElement: "Earth",
    momentTattva: "Earth",
    result: "coherence",
    chapter2: "tied with A",
    note: "designed true",
  },
  C: {
    time: "06:12",
    lagna: "Libra",
    lagnaElement: "Air",
    momentTattva: "Earth",
    result: "clash",
    chapter2: "excluded",
    note: "sign change",
  },
};

function CoherenceRowSvg({ candidate }: { candidate: CandidateKey }) {
  const c = CANDIDATES[candidate];
  const coherent = c.result === "coherence";
  const strokeColor = coherent ? GREEN : VERMILION;
  const arrowId = `arrow-${candidate}`;
  return (
    <svg viewBox="0 0 460 120" role="img" aria-label={`Candidate ${candidate} tattva coherence`} style={{ width: "100%", maxHeight: 140, display: "block" }}>
      <rect x={10} y={10} width={440} height={100} rx={8} fill={`${strokeColor}08`} stroke={HAIRLINE} />
      <text x={60} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={13} fontWeight={600}>Candidate {candidate}</text>
      <text x={60} y={56} textAnchor="middle" fill={INK_MUTED} fontSize={10}>{c.time}</text>

      <circle cx={170} cy={50} r={28} fill={ELEMENT_COLORS[c.momentTattva]} />
      <text x={170} y={46} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>moment</text>
      <text x={170} y={60} textAnchor="middle" fill="#fff" fontSize={11}>{c.momentTattva}</text>

      <circle cx={290} cy={50} r={28} fill={ELEMENT_COLORS[c.lagnaElement]} />
      <text x={290} y={46} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>Lagna</text>
      <text x={290} y={60} textAnchor="middle" fill="#fff" fontSize={11}>{c.lagnaElement}</text>

      <path d="M 200 50 L 260 50" stroke={strokeColor} strokeWidth={4} strokeDasharray={coherent ? undefined : "8 6"} />
      <polygon points="250,44 260,50 250,56" fill={strokeColor} />

      <text x={390} y={48} textAnchor="middle" fill={strokeColor} fontSize={12} fontWeight={600}>{coherent ? "Coherence" : "Clash"}</text>
      <text x={390} y={64} textAnchor="middle" fill={INK_MUTED} fontSize={9}>{coherent ? "soft positive" : "soft negative"}</text>

      <defs>
        <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={strokeColor} />
        </marker>
      </defs>
    </svg>
  );
}

function NarrowingSvg() {
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="A versus B narrowing" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Chapter 2 could not distinguish A and B</text>

      <circle cx={120} cy={80} r={34} fill={`${INK_MUTED}33`} stroke={HAIRLINE} />
      <text x={120} y={76} textAnchor="middle" fill={INK_PRIMARY} fontSize={12} fontWeight={600}>A</text>
      <text x={120} y={92} textAnchor="middle" fill={INK_MUTED} fontSize={10}>tied</text>

      <circle cx={340} cy={80} r={34} fill={`${INK_MUTED}33`} stroke={HAIRLINE} />
      <text x={340} y={76} textAnchor="middle" fill={INK_PRIMARY} fontSize={12} fontWeight={600}>B</text>
      <text x={340} y={92} textAnchor="middle" fill={INK_MUTED} fontSize={10}>tied</text>

      <text x={230} y={80} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>same Virgo Lagna</text>
      <line x1={158} y1={80} x2={302} y2={80} stroke={HAIRLINE} strokeWidth={2} strokeDasharray="6 4" />

      <path d="M 120 118 C 120 150, 180 150, 200 130" fill="none" stroke={VERMILION} strokeWidth={3} />
      <text x={150} y={150} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>clash</text>

      <path d="M 340 118 C 340 150, 280 150, 260 130" fill="none" stroke={GREEN} strokeWidth={3} />
      <text x={310} y={150} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>coherence</text>

      <text x={230} y={175} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Tattva provides genuinely new discrimination</text>
    </svg>
  );
}

function IntegrationFlowSvg() {
  return (
    <svg viewBox="0 0 620 220" role="img" aria-label="Integration of Chapter 2 and tattva results" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={600} height={200} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />

      <rect x={40} y={50} width={130} height={50} rx={6} fill={`${PURPLE}18`} stroke={PURPLE} />
      <text x={105} y={72} textAnchor="middle" fill={PURPLE} fontSize={11} fontWeight={600}>Chapter 2</text>
      <text x={105} y={88} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>C excluded; A/B tied</text>

      <rect x={40} y={120} width={130} height={50} rx={6} fill={`${GOLD}18`} stroke={GOLD} />
      <text x={105} y={142} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Tattva</text>
      <text x={105} y={158} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>A clash; B coherence</text>

      <path d="M 175 75 C 240 75, 240 110, 300 110" fill="none" stroke={PURPLE} strokeWidth={3} />
      <path d="M 175 145 C 240 145, 240 110, 300 110" fill="none" stroke={GOLD} strokeWidth={3} />
      <polygon points="290,104 300,110 290,116" fill={PURPLE} />

      <rect x={300} y={80} width={180} height={60} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={390} y={105} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={600}>Interim status</text>
      <text x={390} y={125} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>C excluded; B favoured over A</text>

      <path d="M 482 110 C 540 110, 540 80, 560 80" fill="none" stroke={BLUE} strokeWidth={2} strokeDasharray="6 4" />
      <text x={585} y={84} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>KP RPP</text>
      <path d="M 482 110 C 540 110, 540 140, 560 140" fill="none" stroke={PURPLE} strokeWidth={2} strokeDasharray="6 4" />
      <text x={585} y={144} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>D60</text>

      <text x={310} y={180} textAnchor="start" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>One soft signal breaks the A/B tie — progress, not final verdict</text>
    </svg>
  );
}

function OverlapSvg({ showOverlap }: { showOverlap: boolean }) {
  const bgColor = showOverlap ? VERMILION : BLUE;
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Method independence and overlap" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${bgColor}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {showOverlap ? "Shared dependence for Candidate C" : "New information for A vs B"}
      </text>

      <circle cx={140} cy={90} r={50} fill={`${BLUE}22`} stroke={BLUE} strokeWidth={2} />
      <text x={140} y={86} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>Events-based</text>
      <text x={140} y={102} textAnchor="middle" fill={BLUE} fontSize={10}>house lords</text>

      <circle cx={320} cy={90} r={50} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
      <text x={320} y={86} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Tattva</text>
      <text x={320} y={102} textAnchor="middle" fill={GOLD} fontSize={10}>Lagna element</text>

      {showOverlap ? (
        <>
          <ellipse cx={230} cy={90} rx={50} ry={35} fill={`${VERMILION}33`} stroke={VERMILION} strokeWidth={2} />
          <text x={230} y={95} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>both use Lagna sign</text>
          <text x={230} y={140} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>For C: corroborating, not independent</text>
        </>
      ) : (
        <>
          <text x={230} y={95} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>A and B share Lagna sign</text>
          <text x={230} y={140} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>For A vs B: tattva adds non-overlapping signal</text>
        </>
      )}
    </svg>
  );
}

export function TattvaShuddhiCandidateCoherenceExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("table");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateKey>("B");
  const [showOverlap, setShowOverlap] = useState<boolean>(true);

  const reset = () => {
    setActiveTab("table");
    setSelectedCandidate("B");
    setShowOverlap(true);
  };

  return (
    <div data-interactive="tattva-shuddhi-candidate-coherence-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tattva-śuddhi application · Chapter 3</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Candidate coherence explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Run self-coherence across all three of Vikram&apos;s candidates and integrate the result honestly with Chapter 2&apos;s finding.
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

      {activeTab === "table" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Full table</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Self-coherence for all three candidates</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Candidate</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Lagna</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Lagna element</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Moment tattva</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
                    const c = CANDIDATES[key];
                    return (
                      <tr key={key} style={{ borderBottom: `1px solid ${HAIRLINE}`, cursor: "pointer", background: selectedCandidate === key ? `${GOLD}10` : undefined }}
                          onClick={() => setSelectedCandidate(key)}>
                        <td style={{ padding: "0.6rem", color: INK_PRIMARY, fontWeight: 600 }}>{key} {c.time}</td>
                        <td style={{ padding: "0.6rem", color: INK_SECONDARY }}>{c.lagna}</td>
                        <td style={{ padding: "0.6rem", color: ELEMENT_COLORS[c.lagnaElement], fontWeight: 600 }}>{c.lagnaElement}</td>
                        <td style={{ padding: "0.6rem", color: ELEMENT_COLORS[c.momentTattva], fontWeight: 600 }}>{c.momentTattva}</td>
                        <td style={{ padding: "0.6rem", color: c.result === "coherence" ? GREEN : VERMILION, fontWeight: 600 }}>
                          {c.result === "coherence" ? "Coherence" : "Clash"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Detail</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Candidate {selectedCandidate}</h3>
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={selectedCandidate === key} onClick={() => setSelectedCandidate(key)} style={buttonStyle(selectedCandidate === key, key === selectedCandidate ? GOLD : INK_MUTED)}>
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <CoherenceRowSvg candidate={selectedCandidate} />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${CANDIDATES[selectedCandidate].result === "coherence" ? GREEN : VERMILION}55`, background: `${CANDIDATES[selectedCandidate].result === "coherence" ? GREEN : VERMILION}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {CANDIDATES[selectedCandidate].result === "coherence"
                  ? `Candidate ${selectedCandidate}: ${CANDIDATES[selectedCandidate].momentTattva} moment-tattva matches ${CANDIDATES[selectedCandidate].lagnaElement} Lagna element — soft positive.`
                  : `Candidate ${selectedCandidate}: ${CANDIDATES[selectedCandidate].momentTattva} moment-tattva clashes with ${CANDIDATES[selectedCandidate].lagnaElement} Lagna element — soft negative.`}
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "narrowing" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Genuine new information</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Where the A/B tie breaks</h3>
            <NarrowingSvg />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Chapter 2 left A and B tied because they share Virgo Lagna. Tattva-śuddhi adds a non-overlapping signal: B&apos;s moment-tattva coheres with Earth, while A&apos;s clashes with Air. This is real narrowing.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Corroboration, not deepening</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>Candidate C&apos;s second soft negative</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              C was already excluded with high confidence by Chapter 2. The tattva clash is consistent, but it does not meaningfully increase confidence beyond what events-based rectification already established — C is not &quot;more excluded.&quot;
            </p>
          </section>
        </>
      )}

      {activeTab === "integration" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Honest integration</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>What the combined result licenses</h3>
            <IntegrationFlowSvg />
            <div style={{ marginTop: "0.85rem", display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Licensed:</span> Candidate B is currently favoured over Candidate A by one converging soft signal.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Not licensed:</span> Declaring B rectified. One soft signal is progress, not a verdict — final confirmation waits for KP RPP and D60.
                </p>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Independence check</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Where the methods overlap</h3>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" aria-pressed={showOverlap} onClick={() => setShowOverlap(true)} style={buttonStyle(showOverlap, VERMILION)}>
                  C overlap
                </button>
                <button type="button" aria-pressed={!showOverlap} onClick={() => setShowOverlap(false)} style={buttonStyle(!showOverlap, GREEN)}>
                  A/B new info
                </button>
              </div>
            </div>
            <OverlapSvg showOverlap={showOverlap} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${showOverlap ? VERMILION : GREEN}55`, background: `${showOverlap ? VERMILION : GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {showOverlap
                  ? "For Candidate C, both events-based house-lordship and tattva Lagna-element checks depend on the Lagna sign. The tattva clash corroborates, but does not independently deepen, the exclusion."
                  : "For A versus B, Chapter 2 could not use the shared Lagna sign to separate them. Tattva&apos;s designed moment-tattva value adds genuinely new, non-overlapping information."}
              </p>
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
