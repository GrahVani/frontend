"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  FileQuestion,
  Lock,
  Map,
  OctagonAlert,
  RefreshCcw,
  ShieldCheck,
  Timer,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type CandidateKey = "B" | "C";
type ViewKey = "wheel" | "table";
type MasterClaimKey = "precondition" | "notAccuracy" | "notGuarantee" | "notSuperiority";
type WorkflowStepKey = "collect" | "classify" | "verify";

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
const MOON = "#5A6B8A";

const SIGNS = [
  { key: "aries", label: "Aries", lord: "Mars", symbol: "♈" },
  { key: "taurus", label: "Taurus", lord: "Venus", symbol: "♉" },
  { key: "gemini", label: "Gemini", lord: "Mercury", symbol: "♊" },
  { key: "cancer", label: "Cancer", lord: "Moon", symbol: "♋" },
  { key: "leo", label: "Leo", lord: "Sun", symbol: "♌" },
  { key: "virgo", label: "Virgo", lord: "Mercury", symbol: "♍" },
  { key: "libra", label: "Libra", lord: "Venus", symbol: "♎" },
  { key: "scorpio", label: "Scorpio", lord: "Mars", symbol: "♏" },
  { key: "sagittarius", label: "Sagittarius", lord: "Jupiter", symbol: "♐" },
  { key: "capricorn", label: "Capricorn", lord: "Saturn", symbol: "♑" },
  { key: "aquarius", label: "Aquarius", lord: "Saturn", symbol: "♒" },
  { key: "pisces", label: "Pisces", lord: "Jupiter", symbol: "♓" },
] as const;

const CANDIDATES: Record<CandidateKey, { time: string; lagnaSign: string; lagnaDegree: string; label: string }> = {
  B: { time: "06:00", lagnaSign: "virgo", lagnaDegree: "27°30'", label: "Candidate B (designed true)" },
  C: { time: "06:12", lagnaSign: "libra", lagnaDegree: "0°30'", label: "Candidate C (twelve minutes later)" },
};

const LORD_COLORS: Record<string, string> = {
  Sun: GOLD,
  Moon: MOON,
  Mars: VERMILION,
  Mercury: GREEN,
  Jupiter: BLUE,
  Venus: PURPLE,
  Saturn: "#4A4A4A",
};

const MASTER_CLAIMS: Record<MasterClaimKey, { label: string; means: string; doesNot: string; color: string }> = {
  precondition: {
    label: "Sequencing precondition",
    means: "No house-based technique can be trusted until the Lagna is trustworthy.",
    doesNot: "It is not a claim that BTR is harder or more important than every other skill.",
    color: BLUE,
  },
  notAccuracy: {
    label: "Not an accuracy guarantee",
    means: "Correct rectification removes a map error; it does not test predictive accuracy.",
    doesNot: "It does not mean the curriculum's methods are proven to predict real-world events.",
    color: VERMILION,
  },
  notGuarantee: {
    label: "Not a reading guarantee",
    means: "A perfect rectification can still be followed by a misjudged yoga or mistimed dasa.",
    doesNot: "It does not replace interpretive skill; it only makes that skill apply to the right chart.",
    color: GOLD,
  },
  notSuperiority: {
    label: "Not predictive superiority",
    means: "Master skill refers to order of operations, not outcome dominance.",
    doesNot: "It does not mean rectified charts produce reliable predictions the curriculum has never tested.",
    color: PURPLE,
  },
};

function getSignIndex(key: string) {
  return SIGNS.findIndex((s) => s.key === key);
}

function getHouseMap(lagnaKey: string) {
  const lagnaIndex = getSignIndex(lagnaKey);
  return Array.from({ length: 12 }, (_, i) => {
    const sign = SIGNS[(lagnaIndex + i) % 12];
    return { house: i + 1, sign: sign.label, signKey: sign.key, lord: sign.lord };
  });
}

function LagnaWheel({ candidate }: { candidate: CandidateKey }) {
  const cx = 180;
  const cy = 180;
  const outerR = 140;
  const innerR = 110;
  const lagnaIndex = getSignIndex(CANDIDATES[candidate].lagnaSign);
  const lagnaDeg = CANDIDATES[candidate].lagnaDegree;

  return (
    <svg width="100%" height="100%" viewBox="0 0 360 360" style={{ maxWidth: 360, display: "block", margin: "0 auto" }}>
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={innerR} fill={`${GOLD}08`} stroke={HAIRLINE} />
      {SIGNS.map((s, i) => {
        const startAngle = i * 30 - 90;
        const startRad = (startAngle * Math.PI) / 180;
        const isLagna = i === lagnaIndex;
        const x1 = cx + innerR * Math.cos(startRad);
        const y1 = cy + innerR * Math.sin(startRad);
        const x2 = cx + outerR * Math.cos(startRad);
        const y2 = cy + outerR * Math.sin(startRad);
        const labelAngle = (startAngle + 15) * (Math.PI / 180);
        const lx = cx + (innerR + 14) * Math.cos(labelAngle);
        const ly = cy + (innerR + 14) * Math.sin(labelAngle);
        return (
          <g key={s.key}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth={1} />
            <text x={lx} y={ly + 4} textAnchor="middle" fill={isLagna ? GOLD : INK_MUTED} fontSize={10} fontWeight={600}>
              {s.symbol}
            </text>
          </g>
        );
      })}
      <line x1={cx} y1={cy - innerR} x2={cx} y2={cy + innerR} stroke={HAIRLINE} strokeWidth={1} />
      <line x1={cx - innerR} y1={cy} x2={cx + innerR} y2={cy} stroke={HAIRLINE} strokeWidth={1} />

      {(() => {
        const angle = lagnaIndex * 30 - 90;
        const rad = (angle * Math.PI) / 180;
        const mx = cx + (innerR - 24) * Math.cos(rad);
        const my = cy + (innerR - 24) * Math.sin(rad);
        return (
          <g>
            <circle cx={mx} cy={my} r={18} fill={`${GOLD}20`} stroke={GOLD} strokeWidth={3} />
            <text x={mx} y={my - 3} textAnchor="middle" fill={GOLD} fontSize={9} fontWeight={600}>Lagna</text>
            <text x={mx} y={my + 9} textAnchor="middle" fill={INK_PRIMARY} fontSize={9} fontWeight={600}>{lagnaDeg}</text>
          </g>
        );
      })()}

      <text x={cx} y={cy + 4} textAnchor="middle" fill={GOLD} fontSize={14} fontWeight={600}>
        {SIGNS[lagnaIndex].label} rising
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle" fill={INK_MUTED} fontSize={11}>
        {CANDIDATES[candidate].time} — {candidate === "B" ? "designed true" : "12 min later"}
      </text>
    </svg>
  );
}

function HouseTable({ candidate }: { candidate: CandidateKey }) {
  const mapB = useMemo(() => getHouseMap(CANDIDATES.B.lagnaSign), []);
  const mapC = useMemo(() => getHouseMap(CANDIDATES.C.lagnaSign), []);
  const rows = candidate === "B" ? mapB : mapC;

  return (
    <div style={{ display: "grid", gap: "0.45rem" }}>
      {rows.map((row) => {
        const otherLord = candidate === "B" ? mapC[row.house - 1].lord : mapB[row.house - 1].lord;
        const changed = row.lord !== otherLord;
        const emphasized = [1, 7, 10].includes(row.house);
        return (
          <div
            key={row.house}
            style={{
              display: "grid",
              gridTemplateColumns: "42px 1fr 1fr",
              gap: "0.65rem",
              alignItems: "center",
              padding: "0.55rem 0.7rem",
              borderRadius: 6,
              border: `1px solid ${changed ? `${LORD_COLORS[row.lord]}55` : HAIRLINE}`,
              background: changed ? `${LORD_COLORS[row.lord]}10` : "transparent",
            }}
          >
            <span style={{ color: emphasized ? GOLD : INK_MUTED, fontWeight: 600, fontSize: "0.85rem" }}>
              {row.house}{row.house === 1 ? "st" : row.house === 2 ? "nd" : row.house === 3 ? "rd" : "th"}
            </span>
            <span style={{ color: INK_PRIMARY, fontSize: "0.9rem" }}>{row.sign}</span>
            <span style={{ color: LORD_COLORS[row.lord], fontWeight: 600, fontSize: "0.9rem" }}>{row.lord}</span>
          </div>
        );
      })}
    </div>
  );
}

function PropagationSvg() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-label="One Lagna error propagates to every downstream house-based technique" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={20} y={30} width={520} height={140} rx={8} fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <circle cx={90} cy={100} r={40} fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth={3} />
      <text x={90} y={96} textAnchor="middle" fill={VERMILION} fontSize={13} fontWeight={600}>Birth time</text>
      <text x={90} y={112} textAnchor="middle" fill={INK_PRIMARY} fontSize={11}>12 min error</text>
      <line x1={132} y1={100} x2={200} y2={100} stroke={VERMILION} strokeWidth={3} strokeLinecap="round" />
      <polygon points="200,100 192,94 192,106" fill={VERMILION} />
      <rect x={210} y={68} width={120} height={64} rx={8} fill={`${GOLD}14`} stroke={GOLD} />
      <text x={270} y={95} textAnchor="middle" fill={GOLD} fontSize={13} fontWeight={600}>Wrong Lagna</text>
      <text x={270} y={113} textAnchor="middle" fill={INK_PRIMARY} fontSize={11}>Virgo to Libra</text>
      <line x1={332} y1={100} x2={400} y2={100} stroke={VERMILION} strokeWidth={3} strokeLinecap="round" />
      <polygon points="400,100 392,94 392,106" fill={VERMILION} />
      <rect x={410} y={55} width={120} height={90} rx={8} fill={`${PURPLE}12`} stroke={PURPLE} />
      <text x={470} y={82} textAnchor="middle" fill={PURPLE} fontSize={12} fontWeight={600}>Every house</text>
      <text x={470} y={102} textAnchor="middle" fill={INK_PRIMARY} fontSize={11}>lord rewrites</text>
      <text x={470} y={122} textAnchor="middle" fill={INK_MUTED} fontSize={10}>yoga · dasa · aspect</text>
      <text x={280} y={172} textAnchor="middle" fill={INK_MUTED} fontSize={12} fontWeight={600}>Downstream skill is applied to the wrong map</text>
    </svg>
  );
}

export function BtrAsMasterSkillCostOfBadData() {
  const [candidate, setCandidate] = useState<CandidateKey>("B");
  const [view, setView] = useState<ViewKey>("wheel");
  const [activeClaims, setActiveClaims] = useState<Record<MasterClaimKey, boolean>>({
    precondition: true,
    notAccuracy: true,
    notGuarantee: true,
    notSuperiority: true,
  });
  const [workflowSteps, setWorkflowSteps] = useState<Record<WorkflowStepKey, boolean>>({
    collect: true,
    classify: false,
    verify: false,
  });
  const [revealDiagnosis, setRevealDiagnosis] = useState(false);

  const mapB = useMemo(() => getHouseMap(CANDIDATES.B.lagnaSign), []);
  const mapC = useMemo(() => getHouseMap(CANDIDATES.C.lagnaSign), []);
  const changedHouses = useMemo(
    () => mapB.filter((row, i) => row.lord !== mapC[i].lord).map((row) => row.house),
    [mapB, mapC]
  );
  const unchangedPlanets = ["Jupiter", "Mars", "Mercury", "Moon"];

  function reset() {
    setCandidate("B");
    setView("wheel");
    setActiveClaims({ precondition: true, notAccuracy: true, notGuarantee: true, notSuperiority: true });
    setWorkflowSteps({ collect: true, classify: false, verify: false });
    setRevealDiagnosis(false);
  }

  function toggleClaim(key: MasterClaimKey) {
    setActiveClaims((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleStep(key: WorkflowStepKey) {
    setWorkflowSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const allClaimsHeld = Object.values(activeClaims).every(Boolean);
  const workflowMissing = workflowSteps.collect && !workflowSteps.classify && !workflowSteps.verify;
  const workflowComplete = workflowSteps.collect && workflowSteps.classify && workflowSteps.verify;

  return (
    <div data-interactive="btr-as-master-skill-cost-of-bad-data" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 20 · Chapter 1</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              BTR as master skill — the cost of bad data
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              One upstream Lagna error silently rewrites every house the rest of the curriculum reads. Trace it on Vikram&apos;s two already-verified candidates.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 420px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Candidate comparison</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
                Toggle between 06:00 and 06:12
              </h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={candidate === "B"} onClick={() => setCandidate("B")} style={buttonStyle(candidate === "B", GREEN)}>
                06:00 Candidate B
              </button>
              <button type="button" aria-pressed={candidate === "C"} onClick={() => setCandidate("C")} style={buttonStyle(candidate === "C", VERMILION)}>
                06:12 Candidate C
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
            {view === "wheel" ? <LagnaWheel candidate={candidate} /> : <HouseTable candidate={candidate} />}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem", justifyContent: "center" }}>
            <button type="button" aria-pressed={view === "wheel"} onClick={() => setView("wheel")} style={smallChipStyle(view === "wheel", GOLD)}>
              Lagna wheel
            </button>
            <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")} style={smallChipStyle(view === "table", PURPLE)}>
              House-lord table
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px", display: "grid", gap: "0.85rem" }}>
          <Panel title="What changes" icon={<OctagonAlert size={18} />} color={VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Under Candidate {candidate}, the Lagna is {SIGNS[getSignIndex(CANDIDATES[candidate].lagnaSign)].label} at {CANDIDATES[candidate].lagnaDegree}. Every house sign and lord shifts by one sign.
            </p>
            <div style={{ marginTop: "0.65rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem" }}>
              <MiniFact icon={<Map size={16} />} title="7th house" body={`${candidate === "B" ? "Pisces · Jupiter" : "Aries · Mars"}`} color={VERMILION} />
              <MiniFact icon={<Map size={16} />} title="10th house" body={`${candidate === "B" ? "Gemini · Mercury" : "Cancer · Moon"}`} color={VERMILION} />
            </div>
          </Panel>

          <Panel title="What does not change" icon={<CircleDot size={18} />} color={GREEN}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The planets themselves stay at the same absolute degrees. Only the house map they are read through moves.
            </p>
            <div style={{ marginTop: "0.55rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {unchangedPlanets.map((p) => (
                <span key={p} style={{ padding: "0.25rem 0.55rem", borderRadius: 6, background: `${LORD_COLORS[p]}14`, color: LORD_COLORS[p], fontSize: "0.8rem", fontWeight: 600 }}>
                  {p}
                </span>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Propagation diagram</p>
        <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
          One point of failure, every house downstream
        </h3>
        <PropagationSvg />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "0.65rem", marginTop: "0.5rem" }}>
          <MiniFact icon={<Timer size={16} />} title="Time error" body="Only 12 minutes" color={VERMILION} />
          <MiniFact icon={<Map size={16} />} title="Lagna shift" body="Virgo 27°30' to Libra 0°30'" color={GOLD} />
          <MiniFact icon={<OctagonAlert size={16} />} title="Houses rewritten" body={`${changedHouses.length} of 12 house lords change`} color={PURPLE} />
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Master skill — what it means</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Click each card to hold or release the bound
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {(Object.keys(MASTER_CLAIMS) as MasterClaimKey[]).map((key) => {
              const held = activeClaims[key];
              const claim = MASTER_CLAIMS[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={held}
                  onClick={() => toggleClaim(key)}
                  style={togglePanelStyle(held, held ? claim.color : VERMILION)}
                >
                  {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
                  <span>
                    <span style={{ fontWeight: 600, color: held ? claim.color : VERMILION }}>{claim.label}</span>
                    <span style={{ color: held ? INK_SECONDARY : VERMILION, display: "block", marginTop: "0.2rem" }}>
                      {held ? claim.means : claim.doesNot}
                    </span>
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
              background: allClaimsHeld ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${allClaimsHeld ? GREEN : VERMILION}55`,
              color: allClaimsHeld ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {allClaimsHeld
              ? "All four bounds held. 'Master skill' is a sequencing claim, not an accuracy or superiority claim."
              : `${Object.keys(MASTER_CLAIMS).length - Object.values(activeClaims).filter(Boolean).length} bound(s) released — review the warnings.`}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Workflow evaluator</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Collection is not verification
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            A practitioner says: &ldquo;I always ask for the birth time and cast from what the client gives me.&rdquo; Toggle the steps this workflow actually performs.
          </p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            <button type="button" aria-pressed={workflowSteps.collect} onClick={() => toggleStep("collect")} style={togglePanelStyle(workflowSteps.collect, workflowSteps.collect ? GREEN : VERMILION)}>
              {workflowSteps.collect ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              <span>
                <span style={{ fontWeight: 600 }}>Collect the reported time</span>
                <span style={{ color: INK_SECONDARY, display: "block" }}>The practitioner does this.</span>
              </span>
            </button>
            <button type="button" aria-pressed={workflowSteps.classify} onClick={() => toggleStep("classify")} style={togglePanelStyle(workflowSteps.classify, workflowSteps.classify ? GREEN : VERMILION)}>
              {workflowSteps.classify ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              <span>
                <span style={{ fontWeight: 600 }}>Classify as reliable / approximate / unknown</span>
                <span style={{ color: INK_SECONDARY, display: "block" }}>T2-02 2.1.1 routing step.</span>
              </span>
            </button>
            <button type="button" aria-pressed={workflowSteps.verify} onClick={() => toggleStep("verify")} style={togglePanelStyle(workflowSteps.verify, workflowSteps.verify ? GREEN : VERMILION)}>
              {workflowSteps.verify ? <ShieldCheck size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
              <span>
                <span style={{ fontWeight: 600 }}>Verify and triangulate the time</span>
                <span style={{ color: INK_SECONDARY, display: "block" }}>The actual master skill.</span>
              </span>
            </button>
          </div>
          <button type="button" onClick={() => setRevealDiagnosis((v) => !v)} style={{ ...buttonStyle(false, GOLD), marginTop: "0.75rem" }}>
            <FileQuestion size={16} aria-hidden="true" />
            {revealDiagnosis ? "Hide diagnosis" : "Reveal diagnosis"}
          </button>
          {revealDiagnosis && (
            <div
              style={{
                marginTop: "0.65rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: workflowComplete ? `${GREEN}12` : `${VERMILION}12`,
                border: `1px solid ${workflowComplete ? GREEN : VERMILION}55`,
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              {(() => {
                if (workflowComplete) {
                  return "Correct workflow. Collection, classification, and verification are all present. This practitioner treats 'I have a number' and 'I have a trustworthy number' as different steps.";
                }
                if (workflowMissing) {
                  return "This is the flawed workflow from Section 4.4. It collects a time but never classifies or verifies it, so it silently skips the master skill even though it looks diligent.";
                }
                return "Partial workflow. Collection alone is not enough; classification and verification together are what make BTR the master skill.";
              })()}
            </div>
          )}
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${BLUE}66`, background: `${BLUE}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.65rem" }}>
          <Lock size={20} style={{ color: BLUE, flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, color: BLUE, fontWeight: 600 }}>Critical insight</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              Near a sign boundary, the size of a time error and the size of its consequence are unrelated. Twelve minutes moved Vikram&apos;s Lagna from Virgo to Libra — a different sign, a different lord for every house, with no planet itself having moved. Rectification is the precondition every other technique rests on; it is not a substitute for interpretive skill or a tested claim of predictive accuracy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.65rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.35, fontSize: "0.9rem" }}>{body}</p>
    </div>
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

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
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
