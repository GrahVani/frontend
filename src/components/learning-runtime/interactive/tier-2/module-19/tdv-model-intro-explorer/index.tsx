"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Eye,
  Network,
  RotateCcw,
  Scale,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type PillarKey = "transit" | "dasha" | "vedha";
type VedhaStatus = "clear" | "obstructed" | "unknown";
type CitationKey = "t1_11" | "t1_12" | "t1_12_bindu" | "interactives";
type MistakeKey = "checklist" | "newIdea" | "trustClaims";

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
const PURPLE = "#6B5AA8";
const TEAL = "#2E7D7A";

const PILLARS: Record<PillarKey, { label: string; icon: ReactNode; color: string; role: string; source: string; scale: string; missing: string }> = {
  transit: {
    label: "Transit",
    icon: <Compass size={20} aria-hidden="true" />,
    color: BLUE,
    role: "Near-arc trigger — a planet is currently positioned to activate a natal point.",
    source: "T1-11 Gochara (verified real)",
    scale: "Weeks to months",
    missing: "Without transit, the window has no current ignition — a daśā-without-transit failure.",
  },
  dasha: {
    label: "Daśā",
    icon: <Scale size={20} aria-hidden="true" />,
    color: AMBER,
    role: "Long-arc window — a planetary period makes this life-domain ripe.",
    source: "T1-10 Ch5-7 / T2-18 cascade fluency",
    scale: "Months to years",
    missing: "Without daśā, a transit has no supporting window — a transit-without-daśā failure.",
  },
  vedha: {
    label: "Vedha",
    icon: <Eye size={20} aria-hidden="true" />,
    color: TEAL,
    role: "Obstruction-clear check — another planet at the counter-position can nullify the transit.",
    source: "T1-11 Chapter 5 (verified real)",
    scale: "Instantaneous condition at trigger moment",
    missing: "Without vedha clearance, the trigger may be cancelled even when T and D both hold.",
  },
};

const PILLAR_ORDER: PillarKey[] = ["transit", "dasha", "vedha"];

const CITATIONS: Record<CitationKey, { label: string; finding: string; ok: boolean }> = {
  t1_11: { label: "T1-11 checked directly", finding: "All 22 lessons exist; vedha table verified real.", ok: true },
  t1_12: { label: "T1-12 checked directly", finding: "All 18 lessons exist; transit-aṣṭakavarga source confirmed.", ok: true },
  t1_12_bindu: { label: "T1-12 bindu-table caveat", finding: "Exact per-planet bindu tables are not published; from-memory recall gets Venus/Saturn wrong by one bindu.", ok: false },
  interactives: { label: "Module overview's 6 interactive components checked", finding: "0 of 6 exist in interactive-specs/, including event-timing-window-builder already found missing under T2-18.", ok: false },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  checklist: {
    label: "T-D-V is not three independent checkbox items",
    heldText: "Held: all three must converge on the same specific claim.",
    releasedText: "Warning: checking boxes separately misses the convergence requirement.",
  },
  newIdea: {
    label: "T-D-V is not new vocabulary invented here",
    heldText: "Held: T2-01 Lesson 1.1.4 seeded the model and named T2-19; this lesson builds depth.",
    releasedText: "Warning: treating T-D-V as freshly coined misses the forward-reference this lesson fulfils.",
  },
  trustClaims: {
    label: "Neither blanket trust nor blanket suspicion of module claims is correct",
    heldText: "Held: each prerequisite and tool claim is checked on its own merits.",
    releasedText: "Warning: assuming all claims are wrong or right without checking reproduces the failure mode this lesson discloses.",
  },
};

export function TdvModelIntroExplorer() {
  const [activePillar, setActivePillar] = useState<PillarKey>("transit");
  const [claimPillars, setClaimPillars] = useState<Record<PillarKey, boolean>>({ transit: true, dasha: false, vedha: false });
  const [vedhaStatus, setVedhaStatus] = useState<VedhaStatus>("unknown");
  const [citations, setCitations] = useState<Record<CitationKey, boolean>>({
    t1_11: true, t1_12: true, t1_12_bindu: true, interactives: true,
  });
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    checklist: true, newIdea: true, trustClaims: true,
  });

  const claimComplete = Object.values(claimPillars).every(Boolean);
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setActivePillar("transit");
    setClaimPillars({ transit: true, dasha: false, vedha: false });
    setVedhaStatus("unknown");
    setCitations({ t1_11: true, t1_12: true, t1_12_bindu: true, interactives: true });
    setMistakes({ checklist: true, newIdea: true, trustClaims: true });
  }

  function toggleClaimPillar(key: PillarKey) {
    setClaimPillars((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div data-interactive="tdv-model-intro-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 opening</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The T-D-V model explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Transit, Daśā, and Vedha are three converging requirements for a high-confidence event-timing claim. This lesson keeps the promise T2-01 Lesson 1.1.4 made eighteen modules ago.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>The three pillars</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Click a pillar to see its distinct job
          </h3>
          <ThreePillarSvg active={activePillar} onSelect={setActivePillar} />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${PILLARS[activePillar].color}55`,
              background: `${PILLARS[activePillar].color}10`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: PILLARS[activePillar].color, fontWeight: 600 }}>
              {PILLARS[activePillar].icon} {PILLARS[activePillar].label}
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{PILLARS[activePillar].role}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>Source: {PILLARS[activePillar].source} · Scale: {PILLARS[activePillar].scale}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Forward-reference check" icon={<Network size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              T2-01 Lesson 1.1.4 already said: <em>&ldquo;This Transit–Daśā–Vedha interplay is the seed of the full T-D-V model developed in T2-19.&rdquo;</em>
            </p>
            <ForwardRefSvg />
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              This module does not invent T-D-V; it operationalises the same discipline as a standalone, repeatable practice.
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Claim evaluator</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          &ldquo;Saturn entering Libra is strong for Kavya.&rdquo; Which components does it actually name?
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          {PILLAR_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={claimPillars[key]}
              onClick={() => toggleClaimPillar(key)}
              style={buttonStyle(claimPillars[key], PILLARS[key].color)}
            >
              {claimPillars[key] ? <CheckCircle2 size={15} aria-hidden="true" /> : null} {PILLARS[key].label}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${claimComplete ? GREEN : VERMILION}55`,
            background: claimComplete ? `${GREEN}12` : `${VERMILION}12`,
            color: claimComplete ? GREEN : VERMILION,
          }}
        >
          {claimComplete
            ? "T-D-V complete: the claim names a trigger, a supporting window, and an obstruction check."
            : `Missing: ${PILLAR_ORDER.filter((k) => !claimPillars[k]).map((k) => PILLARS[k].label).join(", ")}. ${PILLAR_ORDER.filter((k) => !claimPillars[k]).map((k) => PILLARS[k].missing).join(" ")}`}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Kavya first-pass scenario</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Saturn in Libra, Moon/Jupiter window, Aries vedha-point occupied by natal Mars
        </h3>
        <KavyaScenarioSvg />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          {(["clear", "obstructed", "unknown"] as VedhaStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={vedhaStatus === s}
              onClick={() => setVedhaStatus(s)}
              style={buttonStyle(vedhaStatus === s, s === "clear" ? GREEN : s === "obstructed" ? VERMILION : AMBER)}
            >
              {s === "clear" ? "Vedha clear" : s === "obstructed" ? "Vedha obstructed" : "Vedha unknown"}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${vedhaStatus === "clear" ? GREEN : vedhaStatus === "obstructed" ? VERMILION : AMBER}55`,
            background: vedhaStatus === "clear" ? `${GREEN}12` : vedhaStatus === "obstructed" ? `${VERMILION}12` : `${AMBER}12`,
            color: vedhaStatus === "clear" ? GREEN : vedhaStatus === "obstructed" ? VERMILION : AMBER,
          }}
        >
          {vedhaStatus === "clear"
            ? "All three components align: a high-confidence, specific claim is now warranted."
            : vedhaStatus === "obstructed"
              ? "The trigger exists but is classically obstructed; the event-timing claim weakens or fails."
              : "The vedha status is genuinely open — Chapter 3 will resolve whether a natal planet in the vedha-point obstructs a transit."}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Citation-honesty findings</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          What this lesson checked before teaching anything
        </h3>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
          {(Object.keys(CITATIONS) as CitationKey[]).map((key) => {
            const on = citations[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setCitations((c) => ({ ...c, [key]: !c[key] }))}
                style={{
                  textAlign: "left",
                  border: `1px solid ${on ? (CITATIONS[key].ok ? GREEN : VERMILION) : HAIRLINE}`,
                  borderRadius: 8,
                  background: on ? `${CITATIONS[key].ok ? GREEN : VERMILION}10` : "transparent",
                  color: on ? (CITATIONS[key].ok ? GREEN : VERMILION) : INK_SECONDARY,
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <strong style={{ fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>{CITATIONS[key].label}</strong>
                <span style={{ color: on ? INK_PRIMARY : INK_SECONDARY }}>{CITATIONS[key].finding}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 600 }}>{MISTAKES[key].label}</strong>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
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
            background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. T-D-V is treated as convergent judgment, not isolated boxes."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function ThreePillarSvg({ active, onSelect }: { active: PillarKey; onSelect: (k: PillarKey) => void }) {
  const baseY = 220;
  const capY = 60;
  const centers: Record<PillarKey, number> = { transit: 90, dasha: 220, vedha: 350 };
  return (
    <svg viewBox="0 0 440 250" role="img" aria-label="T-D-V three pillar diagram" style={{ width: "100%", maxHeight: 260, margin: "0.65rem auto 0.25rem", display: "block" }}>
      {/* shared cap */}
      <rect x="40" y={capY} width="360" height="36" rx="8" fill={`${GOLD}18`} stroke={GOLD} strokeWidth="2" />
      <text x="220" y={capY + 23} textAnchor="middle" fill={GOLD} fontSize="14" fontWeight={600}>High-confidence event-timing claim</text>

      {PILLAR_ORDER.map((key) => {
        const cx = centers[key];
        const isActive = key === active;
        const h = baseY - (capY + 36);
        return (
          <g key={key} style={{ cursor: "pointer" }} onClick={() => onSelect(key)}>
            <rect x={cx - 34} y={capY + 36} width="68" height={h} rx="6" fill={isActive ? `${PILLARS[key].color}22` : `${PILLARS[key].color}10`} stroke={PILLARS[key].color} strokeWidth={isActive ? 3 : 2} />
            <text x={cx} y={capY + 70} textAnchor="middle" fill={PILLARS[key].color} fontSize="13" fontWeight={600}>{PILLARS[key].label}</text>
            <foreignObject x={cx - 30} y={capY + 85} width="60" height="90">
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: PILLARS[key].color }}>
                {PILLARS[key].icon}
              </div>
            </foreignObject>
          </g>
        );
      })}

      <text x="220" y={baseY + 28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>All three must bear the same specific claim</text>
    </svg>
  );
}

function ForwardRefSvg() {
  return (
    <svg viewBox="0 0 440 90" role="img" aria-label="Forward reference from T2-01 to T2-19" style={{ width: "100%", maxHeight: 100, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <rect x="20" y="20" width="120" height="50" rx="8" fill={`${BLUE}12`} stroke={BLUE} strokeWidth="2" />
      <text x="80" y="40" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={600}>T2-01 1.1.4</text>
      <text x="80" y="56" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>seeds T-D-V</text>

      <line x1="140" y1="45" x2="270" y2="45" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="270,45 264,41 264,49" fill={HAIRLINE} />
      <text x="205" y="38" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>forward-reference</text>

      <rect x="280" y="20" width="140" height="50" rx="8" fill={`${GOLD}12`} stroke={GOLD} strokeWidth="2" />
      <text x="350" y="40" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={600}>T2-19 Module 19</text>
      <text x="350" y="56" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>full operational depth</text>
    </svg>
  );
}

function KavyaScenarioSvg() {
  // Simple zodiac arc: Sagittarius (Moon), Libra (Saturn transit), Aries (vedha point + natal Mars)
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Kavya Saturn transit and vedha scenario" style={{ width: "100%", maxHeight: 220, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <path d="M 60 160 A 220 220 0 0 1 500 160" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeLinecap="round" />

      {/* Sagittarius - Moon */}
      <g transform="translate(120 70)">
        <circle r="28" fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2" />
        <text textAnchor="middle" fill={AMBER} fontSize="11" fontWeight={600}>Sagittarius</text>
        <text y="14" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>natal Moon</text>
      </g>

      {/* Libra - Saturn transit */}
      <g transform="translate(280 45)">
        <circle r="32" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="3" />
        <text textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={600}>Libra</text>
        <text y="14" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>Saturn transit</text>
        <text y="28" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>11th from Moon · uccha</text>
      </g>

      {/* Aries - vedha point, natal Mars */}
      <g transform="translate(440 70)">
        <circle r="28" fill={`${TEAL}18`} stroke={TEAL} strokeWidth="2" />
        <text textAnchor="middle" fill={TEAL} fontSize="11" fontWeight={600}>Aries</text>
        <text y="14" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>vedha-point</text>
        <text y="26" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>natal Mars</text>
      </g>

      {/* labels */}
      <text x="280" y="190" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Saturn&apos;s favourable-from-Moon transit; Aries vedha-point holds natal Mars</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
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
