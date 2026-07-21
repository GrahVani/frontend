"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  GitCompare,
  RefreshCcw,
  Route,
  Scale,
  Search,
  ShieldCheck,
} from "lucide-react";

type TabKey = "doctrine" | "extension" | "candidates" | "provenance";
type RoleKey = "lagna-sign" | "lagna-star" | "moon-sign" | "moon-star" | "day" | "sub-lord";
type CandidateKey = "A" | "B" | "C";
type ModeKey = "prasna" | "candidate";

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
  doctrine: { label: "Five roles", icon: Scale },
  extension: { label: "Extension", icon: GitCompare },
  candidates: { label: "Vikram's candidates", icon: Search },
  provenance: { label: "Provenance", icon: ShieldCheck },
};

const ROLES: Record<RoleKey, { label: string; readFrom: string; planet: string; color: string }> = {
  "lagna-sign": { label: "Lagna sign-lord", readFrom: "Rising rāśi", planet: "Mercury", color: BLUE },
  "lagna-star": { label: "Lagna star-lord", readFrom: "Nakṣatra of rising degree", planet: "Mars", color: VERMILION },
  "moon-sign": { label: "Moon sign-lord", readFrom: "Moon's rāśi", planet: "Jupiter", color: PURPLE },
  "moon-star": { label: "Moon star-lord", readFrom: "Moon's nakṣatra", planet: "Venus", color: GOLD },
  day: { label: "Day (vāra) lord", readFrom: "Lord of Hindu day", planet: "Mercury", color: GREEN },
  "sub-lord": { label: "Lagna sub-lord", readFrom: "4-step sub-identification", planet: "—", color: INK_MUTED },
};

const CANDIDATES: Record<CandidateKey, { time: string; lagna: string; note: string }> = {
  A: { time: "05:48", lagna: "Virgo", note: "pre-sunrise" },
  B: { time: "06:00", lagna: "Virgo", note: "post-sunrise" },
  C: { time: "06:12", lagna: "Libra", note: "post-sunrise" },
};

const EVENT_LORDS = [
  { event: "Marriage", lord: "Jupiter", role: "Moon sign-lord" },
  { event: "Career change", lord: "Mercury", role: "Lagna sign-lord + day-lord" },
];

function DoctrineSvg({ selectedRole }: { selectedRole: RoleKey }) {
  const r = ROLES[selectedRole];
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Five RP roles" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${r.color}08`} stroke={HAIRLINE} />
      <text x={230} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Ruling Planet roles</text>

      {(Object.keys(ROLES) as RoleKey[]).map((key, i) => {
        const role = ROLES[key];
        const active = key === selectedRole;
        const x = 60 + (i % 3) * 140;
        const y = 70 + (i < 3 ? 0 : 60);
        return (
          <g key={key}>
            <circle cx={x} cy={y} r={22} fill={active ? role.color : `${INK_MUTED}33`} stroke={active ? role.color : HAIRLINE} strokeWidth={active ? 3 : 2} />
            <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={600}>{role.planet === "—" ? "S" : role.planet.slice(0, 2)}</text>
            <text x={x} y={y + 40} textAnchor="middle" fill={active ? role.color : INK_MUTED} fontSize={9} fontWeight={600}>{role.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ExtensionSvg({ mode }: { mode: ModeKey }) {
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label="Extension from praśna moment to candidate birth moment" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${mode === "candidate" ? PURPLE : BLUE}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {mode === "candidate" ? "Candidate birth moment" : "Praśna / now moment"}
      </text>

      <rect x={40} y={60} width={140} height={60} rx={6} fill={SURFACE} stroke={mode === "candidate" ? PURPLE : BLUE} />
      <text x={110} y={84} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>
        {mode === "candidate" ? "Candidate B" : "Question arrives"}
      </text>
      <text x={110} y={104} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>
        {mode === "candidate" ? "06:00 IST (hypothesis)" : "Known instant"}
      </text>

      <path d="M 190 90 L 270 90" stroke={HAIRLINE} strokeWidth={2} strokeDasharray={mode === "candidate" ? "6 4" : undefined} />
      <polygon points="262,84 272,90 262,96" fill={mode === "candidate" ? PURPLE : BLUE} />

      <rect x={280} y={60} width={140} height={60} rx={6} fill={`${mode === "candidate" ? PURPLE : BLUE}18`} stroke={mode === "candidate" ? PURPLE : BLUE} />
      <text x={350} y={84} textAnchor="middle" fill={mode === "candidate" ? PURPLE : BLUE} fontSize={11} fontWeight={600}>RP set</text>
      <text x={350} y={104} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>
        {mode === "candidate" ? "Does it help discriminate?" : "Confirm / time the matter"}
      </text>

      <text x={230} y={160} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        {mode === "candidate"
          ? "Same computation, new question: which candidate do the planets prefer?"
          : "T1-16's original use: a known moment, read for a matter unfolding from it."}
      </text>
    </svg>
  );
}

function CandidatesSvg({ candidate }: { candidate: CandidateKey }) {
  const c = CANDIDATES[candidate];
  const sharedSet = ["Jupiter", "Mars", "Mercury", "Venus"];
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={`Candidate ${candidate} RP set`} style={{ width: "100%", maxHeight: 240, display: "block" }}>
      <rect x={10} y={10} width={440} height={200} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={230} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Candidate {candidate} · {c.time} · {c.lagna}</text>

      <circle cx={120} cy={95} r={45} fill={`${INK_MUTED}22`} stroke={HAIRLINE} />
      <text x={120} y={88} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>Classical RP set</text>
      {sharedSet.map((p, i) => (
        <text key={p} x={120} y={108 + i * 14} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>{p}</text>
      ))}

      <path d="M 175 95 L 245 95" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="237,89 247,95 237,101" fill={INK_MUTED} />

      <rect x={260} y={50} width={170} height={110} rx={6} fill={SURFACE} stroke={HAIRLINE} />
      <text x={345} y={74} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>Membership check</text>
      {EVENT_LORDS.map((e, i) => (
        <text key={e.event} x={270} y={96 + i * 26} textAnchor="start" fill={GREEN} fontSize={10} fontWeight={600}>
          ✓ {e.lord} ({e.event})
        </text>
      ))}
      <text x={270} y={145} textAnchor="start" fill={INK_MUTED} fontSize={9}>Both event-lords are members</text>

      <text x={230} y={195} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        Identical across A/B/C · cannot discriminate candidates yet
      </text>
    </svg>
  );
}

function ProvenanceSvg() {
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Component provenance check" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Citation-honesty check</text>

      <rect x={40} y={60} width={180} height={50} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
      <text x={130} y={80} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>ruling-planets-of-the-moment</text>
      <text x={130} y={98} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>module overview claim</text>
      <text x={130} y={128} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>✗ not found</text>

      <rect x={240} y={60} width={180} height={50} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={330} y={80} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>ruling-planets-calculator</text>
      <text x={330} y={98} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>real T1-16 spec</text>
      <text x={330} y={128} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>✓ exists</text>

      <text x={230} y={155} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Check the actual file before relying on a component claim</text>
    </svg>
  );
}

export function KpRppRectificationDepthExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("doctrine");
  const [selectedRole, setSelectedRole] = useState<RoleKey>("lagna-sign");
  const [mode, setMode] = useState<ModeKey>("candidate");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateKey>("B");

  const reset = () => {
    setActiveTab("doctrine");
    setSelectedRole("lagna-sign");
    setMode("candidate");
    setSelectedCandidate("B");
  };

  return (
    <div data-interactive="kp-rpp-rectification-depth-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP RPP · Chapter 4</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Ruling Planets at rectification depth
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Reproduce T1-16&apos;s five RP roles, see the disclosed birth-moment extension, inspect Vikram&apos;s identical candidate sets, and check the component-provenance claim.
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

      {activeTab === "doctrine" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>T1-16 doctrine</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>Five roles + refining sub-lord</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Role</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Read from</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Candidate B</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(ROLES) as RoleKey[]).map((key) => {
                    const r = ROLES[key];
                    return (
                      <tr key={key} style={{ borderBottom: `1px solid ${HAIRLINE}`, cursor: "pointer", background: selectedRole === key ? `${r.color}10` : undefined }}
                          onClick={() => setSelectedRole(key)}>
                        <td style={{ padding: "0.6rem", color: r.color, fontWeight: 600 }}>{r.label}</td>
                        <td style={{ padding: "0.6rem", color: INK_SECONDARY }}>{r.readFrom}</td>
                        <td style={{ padding: "0.6rem", color: INK_PRIMARY, fontWeight: 600 }}>{r.planet}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section style={cardStyle}>
            <DoctrineSvg selectedRole={selectedRole} />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${ROLES[selectedRole].color}55`, background: `${ROLES[selectedRole].color}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {selectedRole === "sub-lord"
                  ? "The Lagna sub-lord is the standard sixth, refining RP. It becomes decisive when the classical five-role set is identical across candidates."
                  : `${ROLES[selectedRole].label}: ${ROLES[selectedRole].readFrom}. For Candidate B this gives ${ROLES[selectedRole].planet}.${ROLES[selectedRole].planet === "Mercury" ? " Mercury fills two roles here, an internal overlap that strengthens its RP status." : ""}`}
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Key rules</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Overlap as strength:</span> a planet filling two or more roles is especially strong, because the moment points at it from several directions.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Confirm, not override:</span> RPs raise or lower confidence in an independently-derived verdict — they never manufacture one by themselves.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "extension" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Disclosed extension</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>From known moment to candidate birth moment</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={mode === "prasna"} onClick={() => setMode("prasna")} style={buttonStyle(mode === "prasna", BLUE)}>
                Praśna / now
              </button>
              <button type="button" aria-pressed={mode === "candidate"} onClick={() => setMode("candidate")} style={buttonStyle(mode === "candidate", PURPLE)}>
                Candidate moment
              </button>
            </div>
          </section>

          <section style={cardStyle}>
            <ExtensionSvg mode={mode} />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${mode === "candidate" ? PURPLE : BLUE}55`, background: `${mode === "candidate" ? PURPLE : BLUE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {mode === "candidate"
                  ? "This is a genuine repurposing of T1-16&apos;s computation. It must be named as an extension every time it is used, not folded silently into the RP method."
                  : "T1-16 16.5.2 computes RPs for a known moment — a live reading or the instant a question reaches the astrologer."}
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Parallel with Chapter 3</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Same kind of move</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Chapter 3 turned Tattva-śuddhi&apos;s external-vs-internal comparison into a self-comparison. This chapter turns a known-moment RP computation into a candidate-moment computation. Different mechanism, same disclosed-extension discipline.
            </p>
          </section>
        </>
      )}

      {activeTab === "candidates" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Vikram&apos;s case</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>Classical RP set is identical across candidates</h3>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={selectedCandidate === key} onClick={() => setSelectedCandidate(key)} style={buttonStyle(selectedCandidate === key, key === selectedCandidate ? BLUE : INK_MUTED)}>
                  Candidate {key} {CANDIDATES[key].time}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <CandidatesSvg candidate={selectedCandidate} />
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>What it confirms:</span> both event-lords (Jupiter for marriage, Mercury for career) are members of the shared RP set — the method&apos;s general expectation holds for Vikram&apos;s real timeline.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>What it cannot do:</span> an identical set cannot discriminate A from B from C. That requires the finer Lagna sub-lord resolution of Lesson 20.4.3.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "provenance" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Citation honesty</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>The module overview&apos;s stale component name</h3>
            <ProvenanceSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Real T1-16 components</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>Three actual specs exist</h3>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              <li><code>ruling-planets-role-explorer.md</code> — Lesson 16.5.1</li>
              <li><code>ruling-planets-calculator.md</code> — Lesson 16.5.2</li>
              <li><code>ruling-planets-confirmation-workbench.md</code> — Lesson 16.5.3</li>
            </ul>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                The calculator is the closest fit for candidate-moment computation, but none is scoped to birth-time-candidate use specifically. Check the actual file before relying on a claim about it.
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
