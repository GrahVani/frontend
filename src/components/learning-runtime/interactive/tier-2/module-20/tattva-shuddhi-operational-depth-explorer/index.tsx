"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  CircleDot,
  Flame,
  Layers,
  Mountain,
  RefreshCcw,
  ShieldAlert,
  Wind,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "doctrine" | "tattvas" | "scope";
type TattvaKey = "earth" | "water" | "fire" | "air" | "ether";
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

const TABS: Record<TabKey, { label: string; icon: typeof BookOpen }> = {
  doctrine: { label: "Doctrine comparison", icon: ArrowLeftRight },
  tattvas: { label: "Five tattvas", icon: Layers },
  scope: { label: "Scope honesty", icon: ShieldAlert },
};

const TATTVA: Record<TattvaKey, { label: string; sanskrit: string; signs: string; icon: typeof Mountain; color: string }> = {
  earth: { label: "Earth", sanskrit: "Pṛthvī", signs: "Taurus, Virgo, Capricorn", icon: Mountain, color: "#8B6F47" },
  water: { label: "Water", sanskrit: "Jala", signs: "Cancer, Scorpio, Pisces", icon: CircleDot, color: "#4A90A4" },
  fire: { label: "Fire", sanskrit: "Tejas", signs: "Aries, Leo, Sagittarius", icon: Flame, color: "#C15B39" },
  air: { label: "Air", sanskrit: "Vāyu", signs: "Gemini, Libra, Aquarius", icon: Wind, color: "#7A8FA6" },
  ether: { label: "Ether", sanskrit: "Ākāśa", signs: "— (pervades / subtle)", icon: Layers, color: "#9B7AA6" },
};

const CANDIDATES: Record<CandidateKey, { time: string; lagna: string; lagnaElement: TattvaKey; momentTattva: TattvaKey; note: string }> = {
  A: { time: "05:48", lagna: "Virgo", lagnaElement: "earth", momentTattva: "water", note: "before sunrise" },
  B: { time: "06:00", lagna: "Virgo", lagnaElement: "earth", momentTattva: "earth", note: "designed true" },
  C: { time: "06:12", lagna: "Libra", lagnaElement: "air", momentTattva: "fire", note: "sign change" },
};

function DoctrineComparisonSvg({ mode }: { mode: "diagnostic" | "rectification" }) {
  return (
    <svg viewBox="0 0 620 220" role="img" aria-label="Tattva-shuddhi doctrine comparison" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={600} height={200} rx={8} fill={`${mode === "diagnostic" ? BLUE : PURPLE}08`} stroke={HAIRLINE} />
      <text x={310} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {mode === "diagnostic" ? "T2-02 diagnostic depth" : "Chapter 3 rectification depth"}
      </text>

      {mode === "diagnostic" ? (
        <>
          <circle cx={120} cy={110} r={42} fill={`${BLUE}18`} stroke={BLUE} strokeWidth={3} />
          <text x={120} y={105} textAnchor="middle" fill={BLUE} fontSize={12} fontWeight={600}>Consultation</text>
          <text x={120} y={122} textAnchor="middle" fill={BLUE} fontSize={11}>moment</text>

          <circle cx={500} cy={110} r={42} fill={`${GREEN}18`} stroke={GREEN} strokeWidth={3} />
          <text x={500} y={105} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={600}>Known chart</text>
          <text x={500} y={122} textAnchor="middle" fill={GREEN} fontSize={11}>already trusted</text>

          <path d="M 165 110 C 250 80, 370 80, 455 110" fill="none" stroke={GOLD} strokeWidth={4} markerEnd="url(#arrow-doctrine)" />
          <polygon points="445,102 455,110 445,118" fill={GOLD} />
          <text x={310} y={88} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Compare moment tattva</text>
          <text x={310} y={104} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>to chart Lagna tattva</text>

          <text x={310} y={178} textAnchor="middle" fill={INK_SECONDARY} fontSize={12} fontWeight={600}>External reference moment · chart is already trusted</text>
        </>
      ) : (
        <>
          <circle cx={120} cy={110} r={42} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth={3} />
          <text x={120} y={105} textAnchor="middle" fill={PURPLE} fontSize={12} fontWeight={600}>Birth moment</text>
          <text x={120} y={122} textAnchor="middle" fill={PURPLE} fontSize={11}>candidate time</text>

          <circle cx={500} cy={110} r={42} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth={3} />
          <text x={500} y={105} textAnchor="middle" fill={PURPLE} fontSize={12} fontWeight={600}>Same birth</text>
          <text x={500} y={122} textAnchor="middle" fill={PURPLE} fontSize={11}>produces Lagna</text>

          <path d="M 165 110 C 250 80, 370 80, 455 110" fill="none" stroke={GOLD} strokeWidth={4} markerEnd="url(#arrow-doctrine)" />
          <polygon points="445,102 455,110 445,118" fill={GOLD} />
          <text x={310} y="88" textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Same comparison logic</text>
          <text x={310} y={104} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>self-referential</text>

          <text x={310} y={178} textAnchor="middle" fill={INK_SECONDARY} fontSize={12} fontWeight={600}>No external reference · moment and chart are the same candidate</text>
        </>
      )}
      <defs>
        <marker id="arrow-doctrine" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={GOLD} />
        </marker>
      </defs>
    </svg>
  );
}

function TattvasSvg({ active }: { active: TattvaKey }) {
  const order: TattvaKey[] = ["earth", "water", "fire", "air", "ether"];
  const centerX = 230;
  const centerY = 110;
  const radius = 80;
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label="Five tattvas and their sign triplicities" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={440} height={200} rx={8} fill={`${TATTVA[active].color}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Pañca-bhūta in the chart</text>

      {order.map((key, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const isActive = key === active;
        return (
          <g key={key}>
            <circle cx={x} cy={y} r={isActive ? 30 : 24} fill={isActive ? TATTVA[key].color : `${TATTVA[key].color}44`} stroke={TATTVA[key].color} strokeWidth={3} />
            <text x={x} y={y - 4} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={600}>{TATTVA[key].label}</text>
            <text x={x} y={y + 8} textAnchor="middle" fill="#fff" fontSize={8}>{TATTVA[key].sanskrit}</text>
          </g>
        );
      })}

      <text x={230} y={180} textAnchor="middle" fill={INK_SECONDARY} fontSize={12} fontWeight={600}>
        {active === "ether" ? "Ākāśa pervades; its correspondence is subtle, not triplicity-bound." : `${TATTVA[active].label} signs: ${TATTVA[active].signs}`}
      </text>
    </svg>
  );
}

function SelfCoherenceSvg({ candidate }: { candidate: CandidateKey }) {
  const c = CANDIDATES[candidate];
  const coherent = c.lagnaElement === c.momentTattva;
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Candidate self-coherence check" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${coherent ? GREEN : VERMILION}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Candidate {candidate} self-coherence
      </text>

      <circle cx={120} cy={90} r={36} fill={TATTVA[c.momentTattva].color} />
      <text x={120} y={85} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>Birth moment</text>
      <text x={120} y={100} textAnchor="middle" fill="#fff" fontSize={10}>{TATTVA[c.momentTattva].label}</text>

      <circle cx={340} cy={90} r={36} fill={TATTVA[c.lagnaElement].color} />
      <text x={340} y={85} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>Lagna</text>
      <text x={340} y={100} textAnchor="middle" fill="#fff" fontSize={10}>{c.lagna} · {TATTVA[c.lagnaElement].label}</text>

      {coherent ? (
        <>
          <path d="M 160 90 L 300 90" stroke={GREEN} strokeWidth={4} markerEnd="url(#arrow-coherence)" />
          <polygon points="290,84 300,90 290,96" fill={GREEN} />
          <text x={230} y={145} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={600}>Soft positive — coherence</text>
        </>
      ) : (
        <>
          <path d="M 160 90 L 300 90" stroke={VERMILION} strokeWidth={4} strokeDasharray="8 6" markerEnd="url(#arrow-incoherence)" />
          <polygon points="290,84 300,90 290,96" fill={VERMILION} />
          <text x={230} y={145} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={600}>Soft negative — clash</text>
        </>
      )}
      <defs>
        <marker id="arrow-coherence" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={GREEN} />
        </marker>
        <marker id="arrow-incoherence" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={VERMILION} />
        </marker>
      </defs>
    </svg>
  );
}

function ScopeBoundarySvg() {
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Tattva-shuddhi checker scope boundary" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Existing tool boundary</text>

      <rect x={40} y={60} width={160} height={60} rx={6} fill={`${BLUE}18`} stroke={BLUE} />
      <text x={120} y={85} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>tattva-shuddhi-checker</text>
      <text x={120} y={103} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>diagnostic-only</text>

      <rect x={260} y={60} width={160} height={60} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} strokeDasharray="8 4" />
      <text x={340} y={85} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>Full rectification</text>
      <text x={340} y={103} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>out of scope</text>

      <path d="M 205 90 L 255 90" stroke={VERMILION} strokeWidth={3} strokeDasharray="6 4" />
      <text x={230} y={145} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={600}>Must not perform or imply full rectification</text>
    </svg>
  );
}

export function TattvaShuddhiOperationalDepthExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("doctrine");
  const [mode, setMode] = useState<"diagnostic" | "rectification">("diagnostic");
  const [activeTattva, setActiveTattva] = useState<TattvaKey>("earth");
  const [candidate, setCandidate] = useState<CandidateKey>("B");

  const reset = () => {
    setActiveTab("doctrine");
    setMode("diagnostic");
    setActiveTattva("earth");
    setCandidate("B");
  };

  const c = CANDIDATES[candidate];
  const coherent = c.lagnaElement === c.momentTattva;

  return (
    <div data-interactive="tattva-shuddhi-operational-depth-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tattva-śuddhi · Chapter 3</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Operational depth explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              See how T2-02&apos;s diagnostic Tattva-śuddhi doctrine is extended, self-referentially, into a rectification-depth signal.
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
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Comparison</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Diagnostic versus rectification use</h3>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" aria-pressed={mode === "diagnostic"} onClick={() => setMode("diagnostic")} style={buttonStyle(mode === "diagnostic", BLUE)}>
                  T2-02 diagnostic
                </button>
                <button type="button" aria-pressed={mode === "rectification"} onClick={() => setMode("rectification")} style={buttonStyle(mode === "rectification", PURPLE)}>
                  Chapter 3 extension
                </button>
              </div>
            </div>
            <DoctrineComparisonSvg mode={mode} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${mode === "diagnostic" ? BLUE : PURPLE}55`, background: `${mode === "diagnostic" ? BLUE : PURPLE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {mode === "diagnostic"
                  ? "At diagnostic depth, an external consultation moment is compared against an already-trusted chart. The chart is fixed; the moment is the variable."
                  : "At rectification depth, the same coherence logic is turned self-referential: each candidate's own birth moment is compared against the Lagna element that same moment produces."}
              </p>
            </div>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>What stays the same</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>Core comparison logic</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                The underlying operation — moment tattva compared to chart/Lagna tattva, coherence as soft positive, clash as soft negative — is unchanged from T2-02.
              </p>
            </section>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>What changes</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>What is being compared</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                The moment and the chart are no longer two different events. For each candidate, the birth moment <em>is</em> the moment and <em>produces</em> the Lagna. This is a disclosed extension, not existing coverage.
              </p>
            </section>
          </div>
        </>
      )}

      {activeTab === "tattvas" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Five tattvas</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Elements and sign triplicities</h3>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {(Object.keys(TATTVA) as TattvaKey[]).map((key) => {
                  const Icon = TATTVA[key].icon;
                  return (
                    <button key={key} type="button" aria-pressed={activeTattva === key} onClick={() => setActiveTattva(key)} style={tattvaChipStyle(activeTattva === key, TATTVA[key].color)}>
                      <Icon size={14} aria-hidden="true" /> {TATTVA[key].label}
                    </button>
                  );
                })}
              </div>
            </div>
            <TattvasSvg active={activeTattva} />
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Self-coherence preview</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Apply the check to a candidate</h3>
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={candidate === key} onClick={() => setCandidate(key)} style={buttonStyle(candidate === key, BLUE)}>
                    {key} {CANDIDATES[key].time}
                  </button>
                ))}
              </div>
            </div>
            <SelfCoherenceSvg candidate={candidate} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${coherent ? GREEN : VERMILION}55`, background: `${coherent ? GREEN : VERMILION}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {coherent
                  ? `Candidate ${candidate} (${c.time}, ${c.lagna} Lagna) receives a soft positive: the illustrative birth-moment tattva ${TATTVA[c.momentTattva].label} matches the Lagna element ${TATTVA[c.lagnaElement].label}. This is one input, not a verdict.`
                  : `Candidate ${candidate} (${c.time}, ${c.lagna} Lagna) shows a soft negative: the illustrative birth-moment tattva ${TATTVA[c.momentTattva].label} clashes with the Lagna element ${TATTVA[c.lagnaElement].label}. Still only one soft signal.`}
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "scope" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Citation honesty</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>The existing checker cannot be reused here</h3>
            <ScopeBoundarySvg />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                The <code style={{ background: `${HAIRLINE}55`, padding: "0.1rem 0.3rem", borderRadius: 4 }}>tattva-shuddhi-checker</code> spec states explicitly: diagnostic-only; computes only the coherence signal; must not perform or imply full rectification. This chapter therefore does its calculative work by hand, beginning in Lesson 20.3.2.
              </p>
            </div>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Epistemic frame</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>Practised / claimed / verified</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                The technique is practised and traditional. Its claim that moment-tattva reflects chart truth is classical. Its independent verification by controlled study is not established. This frame carries forward unchanged at rectification depth.
              </p>
            </section>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Convergence rule</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>Still a soft signal</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Extending the context of use does not extend the weight of any single result. A tattva self-coherence result must converge with Chapter 2&apos;s events-based result (and later methods) before it supports any stronger conclusion.
              </p>
            </section>
          </div>
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

function tattvaChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.4rem 0.65rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.85rem",
  };
}
