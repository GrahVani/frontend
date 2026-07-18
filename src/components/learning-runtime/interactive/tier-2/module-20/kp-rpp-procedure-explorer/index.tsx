"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  GitCompare,
  RefreshCcw,
  Route,
  Scale,
  Search,
  Table2,
} from "lucide-react";

type TabKey = "procedure" | "candidates" | "events" | "verdict";
type StepKey = 0 | 1 | 2 | 3;
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
  procedure: { label: "Four-step procedure", icon: Route },
  candidates: { label: "Candidate table", icon: Table2 },
  events: { label: "Event-lord check", icon: Search },
  verdict: { label: "What it means", icon: Scale },
};

const STEPS: Record<StepKey, { title: string; detail: string; color: string }> = {
  0: { title: "Cast each candidate", detail: "Treat each candidate birth time and place as if a question had been asked at that exact instant.", color: BLUE },
  1: { title: "Read the five roles", detail: "Lagna sign-lord, Lagna star-lord, Moon sign-lord, Moon star-lord, and the sunrise-based day-lord.", color: PURPLE },
  2: { title: "Compile the distinct RP set", detail: "List the distinct planets, noting any role overlap that strengthens a planet's RP status.", color: GOLD },
  3: { title: "Check against known events", detail: "Ask whether each dated event's antardaśā lord is a member of the candidate's RP set.", color: GREEN },
};

const CANDIDATES: Record<CandidateKey, { time: string; lagna: string; vāra: string; signLord: string; starLord: string; moonSignLord: string; moonStarLord: string; dayLord: string; overlap: string }> = {
  A: {
    time: "05:48",
    lagna: "Virgo",
    vāra: "Tuesday (pre-sunrise)",
    signLord: "Mercury",
    starLord: "Mars",
    moonSignLord: "Jupiter",
    moonStarLord: "Venus",
    dayLord: "Mars",
    overlap: "Mars fills Lagna star-lord and day-lord",
  },
  B: {
    time: "06:00",
    lagna: "Virgo",
    vāra: "Wednesday",
    signLord: "Mercury",
    starLord: "Mars",
    moonSignLord: "Jupiter",
    moonStarLord: "Venus",
    dayLord: "Mercury",
    overlap: "Mercury fills Lagna sign-lord and day-lord",
  },
  C: {
    time: "06:12",
    lagna: "Libra",
    vāra: "Wednesday",
    signLord: "Venus",
    starLord: "Mars",
    moonSignLord: "Jupiter",
    moonStarLord: "Venus",
    dayLord: "Mercury",
    overlap: "Venus fills Lagna sign-lord and Moon star-lord",
  },
};

const EVENTS = [
  { event: "Marriage", age: "27.46–28.39", bhukti: "Jupiter", type: "antardaśā" },
  { event: "Career change", age: "29.50–30.49", bhukti: "Mercury", type: "antardaśā" },
  { event: "Both events", age: "—", bhukti: "Mars", type: "mahādaśā" },
];

const HOUSE_LORDSHIP: Record<CandidateKey, { marriage: string; career: string }> = {
  A: { marriage: "strong", career: "strong" },
  B: { marriage: "strong", career: "strong" },
  C: { marriage: "weak", career: "none" },
};

function ProcedureSvg({ step }: { step: StepKey }) {
  const items = Object.values(STEPS);
  return (
    <svg viewBox="0 0 620 150" role="img" aria-label="Four-step RP procedure" style={{ width: "100%", maxHeight: 170, display: "block" }}>
      <rect x={10} y={10} width={600} height={130} rx={8} fill={`${STEPS[step].color}08`} stroke={HAIRLINE} />
      {items.map((s, i) => {
        const x = 95 + i * 140;
        const active = i <= step;
        return (
          <g key={s.title}>
            <circle cx={x} cy={55} r={22} fill={active ? s.color : `${INK_MUTED}33`} stroke={active ? s.color : HAIRLINE} strokeWidth={active ? 3 : 2} />
            <text x={x} y={60} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>{i + 1}</text>
            <text x={x} y={92} textAnchor="middle" fill={active ? INK_PRIMARY : INK_MUTED} fontSize={9} fontWeight={600}>{s.title}</text>
            {i < 3 && (
              <line x1={x + 26} y1={55} x2={x + 114} y2={55} stroke={active ? s.color : HAIRLINE} strokeWidth={active ? 3 : 2} strokeDasharray={active ? undefined : "6 4"} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function CandidateDetailSvg({ candidate }: { candidate: CandidateKey }) {
  const c = CANDIDATES[candidate];
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label={`Candidate ${candidate} RP role diagram`} style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Candidate {candidate} · {c.time} · {c.lagna}</text>

      <circle cx={120} cy={90} r={45} fill={`${INK_MUTED}22`} stroke={HAIRLINE} />
      <text x={120} y={84} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>RP set</text>
      {[c.signLord, c.starLord, c.moonSignLord, c.moonStarLord, c.dayLord]
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((p, i) => (
          <text key={p} x={120} y={104 + i * 14} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>{p}</text>
        ))}

      <path d="M 175 90 L 245 90" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="237,84 247,90 237,96" fill={GOLD} />

      <rect x={260} y={55} width={170} height={110} rx={6} fill={SURFACE} stroke={GOLD} />
      <text x={345} y={78} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Natural overlap</text>
      <text x={345} y={100} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>{c.overlap.split(" fills ")[0]}</text>
      <text x={345} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>fills two roles</text>
      <text x={345} y={145} textAnchor="middle" fill={INK_MUTED} fontSize={9}>before sub-lord</text>
    </svg>
  );
}

function EventCheckSvg({ showHouse }: { showHouse: boolean }) {
  return (
    <svg viewBox="0 0 500 180" role="img" aria-label="Event lord membership check" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={480} height={160} rx={8} fill={`${GREEN}08`} stroke={HAIRLINE} />
      <text x={250} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {showHouse ? "RP check vs house-lordship" : "RP event-lord membership"}
      </text>

      {(Object.keys(CANDIDATES) as CandidateKey[]).map((key, i) => {
        const x = 70 + i * 140;
        const hl = HOUSE_LORDSHIP[key];
        return (
          <g key={key}>
            <circle cx={x} cy={80} r={30} fill={`${BLUE}18`} stroke={BLUE} />
            <text x={x} y={76} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>{key}</text>
            <text x={x} y={92} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>RP check ✓</text>
            {showHouse && (
              <text x={x} y={130} textAnchor="middle" fill={hl.marriage === "strong" && hl.career === "strong" ? GREEN : VERMILION} fontSize={10} fontWeight={600}>
                {hl.marriage === "strong" && hl.career === "strong" ? "House: pass" : "House: fail"}
              </text>
            )}
          </g>
        );
      })}

      <text x={250} y={160} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        {showHouse
          ? "Candidate C passes RP membership while failing house-lordship"
          : "All candidates pass both antardaśā-lord membership checks"}
      </text>
    </svg>
  );
}

function VerdictSvg() {
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="What the procedure establishes" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Result shape</text>

      <rect x={40} y={60} width={180} height={80} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={130} y={82} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>Establishes</text>
      <text x={130} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>RPP expectation holds</text>
      <text x={130} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>for Vikram&apos;s real timeline</text>

      <rect x={240} y={60} width={180} height={80} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
      <text x={330} y={82} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>Does not establish</text>
      <text x={330} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>which candidate is correct</text>
      <text x={330} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>identical set across A/B/C</text>
    </svg>
  );
}

export function KpRppProcedureExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("procedure");
  const [step, setStep] = useState<StepKey>(0);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateKey>("A");
  const [showHouse, setShowHouse] = useState<boolean>(false);

  const reset = () => {
    setActiveTab("procedure");
    setStep(0);
    setSelectedCandidate("A");
    setShowHouse(false);
  };

  return (
    <div data-interactive="kp-rpp-procedure-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP RPP · Chapter 4</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Candidate-moment RP procedure
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Cast each candidate as its own praśna moment, compile the RP set, and check it against Chapter 2&apos;s independently-dated events.
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

      {activeTab === "procedure" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Four-step procedure</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>From cast to event check</h3>
            <ProcedureSvg step={step} />
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(STEPS) as unknown as StepKey[]).map((s) => (
                <button key={s} type="button" aria-pressed={step === s} onClick={() => setStep(s)} style={buttonStyle(step === s, STEPS[s].color)}>
                  {s + 1}. {STEPS[s].title}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Step detail</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: STEPS[step].color, fontSize: "1.15rem", fontWeight: 600 }}>{step + 1}. {STEPS[step].title}</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{STEPS[step].detail}</p>
          </section>
        </>
      )}

      {activeTab === "candidates" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Candidate table</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>RP roles for Vikram&apos;s three candidates</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Candidate</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Lagna</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Sign-lord</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Star-lord</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Moon sign</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Moon star</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Day-lord</th>
                    <th style={{ textAlign: "left", padding: "0.55rem", color: INK_MUTED, fontWeight: 600 }}>Distinct set</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
                    const c = CANDIDATES[key];
                    const set = Array.from(new Set([c.signLord, c.starLord, c.moonSignLord, c.moonStarLord, c.dayLord])).join(", ");
                    return (
                      <tr key={key} style={{ borderBottom: `1px solid ${HAIRLINE}`, cursor: "pointer", background: selectedCandidate === key ? `${BLUE}10` : undefined }}
                          onClick={() => setSelectedCandidate(key)}>
                        <td style={{ padding: "0.55rem", color: INK_PRIMARY, fontWeight: 600 }}>{key} {c.time}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{c.lagna}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{c.signLord}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{c.starLord}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{c.moonSignLord}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{c.moonStarLord}</td>
                        <td style={{ padding: "0.55rem", color: INK_SECONDARY }}>{c.dayLord}</td>
                        <td style={{ padding: "0.55rem", color: GOLD, fontWeight: 600 }}>{`{${set}}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Detail</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>Candidate {selectedCandidate}</h3>
            <CandidateDetailSvg candidate={selectedCandidate} />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {CANDIDATES[selectedCandidate].overlap}. The distinct set is the same four planets as the other candidates; only the role-assignment differs.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "events" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>IDENTIFY doctrine</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>Event-lord membership check</h3>
              </div>
              <button type="button" aria-pressed={showHouse} onClick={() => setShowHouse(!showHouse)} style={buttonStyle(showHouse, showHouse ? VERMILION : BLUE)}>
                <GitCompare size={15} aria-hidden="true" /> {showHouse ? "Hide house overlay" : "Show house overlay"}
              </button>
            </div>
          </section>

          <section style={cardStyle}>
            <EventCheckSvg showHouse={showHouse} />
            <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Event</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Period-lord</th>
                    {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                      <th key={key} style={{ textAlign: "center", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EVENTS.map((e) => (
                    <tr key={e.event} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <td style={{ padding: "0.6rem", color: INK_PRIMARY, fontWeight: 600 }}>{e.event}</td>
                      <td style={{ padding: "0.6rem", color: INK_SECONDARY }}>{e.bhukti} ({e.type})</td>
                      {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
                        const c = CANDIDATES[key];
                        const set = new Set([c.signLord, c.starLord, c.moonSignLord, c.moonStarLord, c.dayLord]);
                        const member = set.has(e.bhukti);
                        return (
                          <td key={key} style={{ padding: "0.6rem", textAlign: "center", color: member ? GREEN : VERMILION, fontWeight: 600 }}>
                            {member ? "✓ member" : "✗ not member"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showHouse && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>House-lordship overlay:</span> Candidates A and B pass Chapter 2&apos;s house-lordship test strongly; Candidate C fails it. Yet all three pass the coarser RP-membership check. The two tests answer different questions.
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "verdict" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Result shape</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>What the procedure establishes and what it cannot</h3>
            <VerdictSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Precision</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Confirms:</span> RPP&apos;s general expectation holds for Vikram&apos;s independently-dated events at every candidate Lagna. This is a modest, legitimate increase in confidence that the overall chart construction is sound.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Cannot:</span> discriminate A, B, or C. The identical classical RP set was disclosed in Chapter 1; this honest outcome motivates Lesson 20.4.3&apos;s finer sub-lord resolution.
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
