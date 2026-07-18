"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type CheckKey = "backward" | "sameRoot" | "tierHonesty" | "unfavourable" | "fabricate";
type ModeKey = "reverse" | "triangulated";
type CommitmentKey = "notHighConfidence" | "intuitionIsAThread" | "processNotLength";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const CHECKS: { key: CheckKey; label: string; detail: string }[] = [
  {
    key: "backward",
    label: "Runs the process backward",
    detail:
      "Starts from a desired conclusion and searches for a time that produces it, instead of letting evidence discriminate among candidates.",
  },
  {
    key: "sameRoot",
    label: "Ignores same-root evidence",
    detail:
      "Counts several 'passing' checks that are quietly built from the same underlying degree as independent confirmation.",
  },
  {
    key: "tierHonesty",
    label: "Never reports an honest tier",
    detail:
      "Reports whatever confidence sounds best, instead of counting what genuinely converges.",
  },
  {
    key: "unfavourable",
    label: "Cannot survive an unfavourable candidate",
    detail:
      "Has no honest way to report 'this didn't work' because failure was never an option it was designed to produce.",
  },
  {
    key: "fabricate",
    label: "Treats missing sources as invitations to fabricate",
    detail:
      "Invents a plausible-sounding reading where honest practice would disclose the sourcing boundary.",
  },
];

const CHAPTERS = [
  {
    title: "Chapter 1",
    added:
      "Named the seven methods and the triangulation discipline, plus the three traps before any method was run.",
  },
  {
    title: "Chapter 2",
    added:
      "Ran events-based rectification to completion, excluding Candidate C and leaving A and B honestly tied.",
  },
  {
    title: "Chapter 3",
    added:
      "Ran Tattva-śuddhi as the first independent-discrimination thread, favouring Candidate B.",
  },
  {
    title: "Chapter 4",
    added:
      "Ran KP Ruling Planets at classical and sub-lord depth, catching a citation error and producing the second independent thread.",
  },
  {
    title: "Chapter 5",
    added:
      "Ran three varied secondary methods, introducing silence, same-root reliability, and the reliability-versus-weight distinction.",
  },
  {
    title: "Chapter 6",
    added:
      "Formalised the tier system, distinguished divergence from limited convergence, completed D60 within sourcing bounds, and issued the final moderate verdict.",
  },
];

const COMMITMENTS: Record<
  CommitmentKey,
  { label: string; heldText: string; releasedText: string }
> = {
  notHighConfidence: {
    label: "The bar is discipline, not a promise of strong confidence",
    heldText:
      "Held: seven-method triangulation does not guarantee strong-tier verdicts; it guarantees honest counting and disclosure.",
    releasedText:
      "Warning: reading the module as a promise of confident results misrepresents its actual claim.",
  },
  intuitionIsAThread: {
    label: "Practitioner intuition is one thread, not a verdict",
    heldText:
      "Held: experienced intuition is valuable, but it is a weak-tier lead until checked by independent confirmation.",
    releasedText:
      "Warning: unchecked expertise reported with more confidence than it can self-verify is itself a form of reverse-engineering.",
  },
  processNotLength: {
    label: "Rigour is what is counted, not the number of steps",
    heldText:
      "Held: a long, elaborate process can still be reverse-engineered; the bar is independent evidence and honest disclosure.",
    releasedText:
      "Warning: assuming length equals rigour lets 'adjust until it fits' dress itself up as disciplined work.",
  },
};

const CANDIDATES = [
  {
    key: "A",
    label: "Candidate A · 05:48",
    status: "Honest named alternative",
    color: BLUE,
    detail: "Never excluded, never independently favoured over B.",
  },
  {
    key: "B",
    label: "Candidate B · 06:00",
    status: "Favoured at moderate confidence",
    color: GREEN,
    detail: "Two independent threads converge; cross-checked for reliability.",
  },
  {
    key: "C",
    label: "Candidate C · 06:12",
    status: "Excluded in Chapter 2",
    color: VERMILION,
    detail: "A documented event could not be explained under this candidate.",
  },
];

function LiteracyMeter({ count }: { count: number }) {
  const total = CHECKS.length;
  const pct = (count / total) * 100;
  return (
    <svg width="100%" height="40" viewBox="0 0 400 40" style={{ maxWidth: 480, display: "block" }}>
      <rect x="0" y="10" width="400" height="20" rx="10" fill={`${VERMILION}18`} stroke={HAIRLINE} />
      <rect
        x="0"
        y="10"
        width={(pct / 100) * 400}
        height="20"
        rx="10"
        fill={pct === 100 ? GREEN : pct >= 60 ? GOLD : VERMILION}
      />
      <text x="200" y="25" fontSize="11" fill="#fff" fontWeight={600} textAnchor="middle">
        {count}/{total} literacy checks applied
      </text>
    </svg>
  );
}

function ChapterArc({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const cx = 52;
  const gap = 60;

  return (
    <svg width="100%" height="96" viewBox="0 0 360 96" style={{ maxWidth: 400, display: "block" }}>
      <line
        x1={cx}
        y1="48"
        x2={cx + (CHAPTERS.length - 1) * gap}
        y2="48"
        stroke={HAIRLINE}
        strokeWidth={2}
      />
      {CHAPTERS.map((c, i) => {
        const x = cx + i * gap;
        const isActive = i === active;
        return (
          <g key={c.title} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
            <circle
              cx={x}
              cy="48"
              r={isActive ? 16 : 11}
              fill={isActive ? GOLD : "transparent"}
              stroke={isActive ? GOLD : HAIRLINE}
              strokeWidth={2}
            />
            <text
              x={x}
              y="52"
              fontSize={isActive ? 11 : 9}
              fill={isActive ? "#fff" : INK_MUTED}
              fontWeight={600}
              textAnchor="middle"
            >
              {i + 1}
            </text>
            <text x={x} y="84" fontSize="9" fill={INK_MUTED} textAnchor="middle">
              {c.title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ProcessFlowSvg({ mode }: { mode: ModeKey }) {
  const reverse = mode === "reverse";
  return (
    <svg
      viewBox="0 0 560 220"
      role="img"
      aria-label={
        reverse
          ? "Reverse-engineered flow: desired reading adjusts birth time"
          : "Triangulated flow: candidates are tested by independent evidence"
      }
      style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0.85rem", display: "block" }}
    >
      <rect x="24" y="24" width="512" height="172" rx="8" fill={`${reverse ? VERMILION : GREEN}0D`} stroke={HAIRLINE} />

      {reverse ? (
        <>
          <rect x="60" y="80" width="130" height="56" rx="8" fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="3" />
          <text x="125" y="108" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={600}>
            Desired reading
          </text>
          <text x="125" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">
            what you want to say
          </text>

          <path
            d="M 200 108 L 260 108"
            stroke={VERMILION}
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#arrowReverse)"
          />
          <text x="230" y="96" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight={600}>
            adjust time
          </text>

          <rect x="280" y="80" width="130" height="56" rx="8" fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="3" />
          <text x="345" y="108" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={600}>
            Birth time
          </text>
          <text x="345" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">
            until it fits
          </text>

          <path
            d="M 420 108 L 480 108"
            stroke={VERMILION}
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#arrowReverse)"
          />

          <rect x="490" y="80" width="50" height="56" rx="8" fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="3" />
          <text x="515" y="114" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={600}>
            ✓
          </text>

          <text x="280" y="178" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>
            Conclusion first, evidence second
          </text>

          <defs>
            <marker id="arrowReverse" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill={VERMILION} />
            </marker>
          </defs>
        </>
      ) : (
        <>
          <rect x="44" y="80" width="110" height="56" rx="8" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="3" />
          <text x="99" y="108" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={600}>
            Candidates
          </text>
          <text x="99" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">
            A, B, C
          </text>

          <path d="M 160 108 L 220 108" stroke={GREEN} strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowTri)" />
          <text x="190" y="96" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>
            test
          </text>

          <rect x="230" y="80" width="120" height="56" rx="8" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="3" />
          <text x="290" y="108" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight={600}>
            Evidence threads
          </text>
          <text x="290" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">
            independent + same-root
          </text>

          <path d="M 356 108 L 416 108" stroke={GREEN} strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrowTri)" />
          <text x="386" y="96" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>
            count
          </text>

          <rect x="426" y="80" width="100" height="56" rx="8" fill={`${GOLD}18`} stroke={GOLD} strokeWidth="3" />
          <text x="476" y="108" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight={600}>
            Verdict
          </text>
          <text x="476" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">
            disclosed tier
          </text>

          <text x="280" y="178" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>
            Evidence first, conclusion last
          </text>

          <defs>
            <marker id="arrowTri" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill={GREEN} />
            </marker>
          </defs>
        </>
      )}
    </svg>
  );
}

function CandidateSvg({ selected }: { selected: string }) {
  return (
    <svg
      viewBox="0 0 560 160"
      role="img"
      aria-label="Candidate verdict summary: A alternative, B moderate, C excluded"
      style={{ width: "100%", maxHeight: 200, margin: "0.4rem auto 0.85rem", display: "block" }}
    >
      <rect x="24" y="24" width="512" height="112" rx="8" fill={`${GOLD}0D`} stroke={HAIRLINE} />

      <circle cx="110" cy="80" r="34" fill={selected === "A" ? `${BLUE}18` : "transparent"} stroke={selected === "A" ? BLUE : HAIRLINE} strokeWidth={selected === "A" ? 4 : 2} />
      <text x="110" y="76" textAnchor="middle" fill={selected === "A" ? BLUE : INK_SECONDARY} fontSize="13" fontWeight={600}>
        A
      </text>
      <text x="110" y="92" textAnchor="middle" fill={selected === "A" ? BLUE : INK_MUTED} fontSize="10">
        05:48
      </text>

      <circle cx="280" cy="80" r="42" fill={selected === "B" ? `${GREEN}18` : "transparent"} stroke={selected === "B" ? GREEN : HAIRLINE} strokeWidth={selected === "B" ? 4 : 2} />
      <text x="280" y="76" textAnchor="middle" fill={selected === "B" ? GREEN : INK_SECONDARY} fontSize="14" fontWeight={600}>
        B
      </text>
      <text x="280" y="93" textAnchor="middle" fill={selected === "B" ? GREEN : INK_MUTED} fontSize="10">
        06:00
      </text>
      <text x="280" y="138" textAnchor="middle" fill={selected === "B" ? GREEN : "transparent"} fontSize="11" fontWeight={600}>
        {selected === "B" ? "Working time" : ""}
      </text>

      <circle cx="450" cy="80" r="34" fill={selected === "C" ? `${VERMILION}18` : "transparent"} stroke={selected === "C" ? VERMILION : HAIRLINE} strokeWidth={selected === "C" ? 4 : 2} />
      <text x="450" y="76" textAnchor="middle" fill={selected === "C" ? VERMILION : INK_SECONDARY} fontSize="13" fontWeight={600}>
        C
      </text>
      <text x="450" y="92" textAnchor="middle" fill={selected === "C" ? VERMILION : INK_MUTED} fontSize="10">
        06:12
      </text>

      <path d="M 150 80 L 230 80" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M 330 80 L 410 80" stroke={HAIRLINE} strokeWidth="2" />
    </svg>
  );
}

export function BtrMasterSkillLiteracyBar() {
  const [checks, setChecks] = useState<Record<CheckKey, boolean>>({
    backward: false,
    sameRoot: false,
    tierHonesty: false,
    unfavourable: false,
    fabricate: false,
  });
  const [mode, setMode] = useState<ModeKey>("reverse");
  const [activeChapter, setActiveChapter] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState("B");
  const [commitments, setCommitments] = useState<Record<CommitmentKey, boolean>>({
    notHighConfidence: true,
    intuitionIsAThread: true,
    processNotLength: true,
  });

  const checkedCount = useMemo(
    () => Object.values(checks).filter(Boolean).length,
    [checks]
  );
  const allCommitmentsHeld = Object.values(commitments).every(Boolean);

  function reset() {
    setChecks({ backward: false, sameRoot: false, tierHonesty: false, unfavourable: false, fabricate: false });
    setMode("reverse");
    setActiveChapter(0);
    setSelectedCandidate("B");
    setCommitments({ notHighConfidence: true, intuitionIsAThread: true, processNotLength: true });
  }

  function toggleCheck(key: CheckKey) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div data-interactive="btr-master-skill-literacy-bar" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 20 · Closing capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The BTR master-skill literacy bar
            </h2>
            <p style={{ margin: "0.15rem 0 0", color: INK_MUTED, fontSize: "0.92rem" }}>
              जन्मसमय-शुद्धि-प्रवीणता-मानदण्डः
            </p>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              See what separates seven-method triangulated rectification from &ldquo;adjust the time until it fits,&rdquo; and trace the six-chapter arc that built the bar.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>The malpractice move</p>
          <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
            &ldquo;Let&apos;s nudge the birth time forward twenty minutes &mdash; there, now it fits.&rdquo;
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            This single move looks like rectification, but it starts from the reading already wanted and searches for a time that produces it. The discipline this module built exists to make that difference visible and nameable.
          </p>
          <div style={{ marginTop: "0.85rem" }}>
            <LiteracyMeter count={checkedCount} />
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: checkedCount === 5 ? `${GREEN}12` : `${GOLD}12`,
              border: `1px solid ${checkedCount === 5 ? GREEN : GOLD}55`,
              color: checkedCount === 5 ? GREEN : GOLD,
              fontWeight: 600,
            }}
          >
            {checkedCount === 5
              ? "All five literacy checks applied. The move is now framed as malpractice against the module's bar."
              : `${5 - checkedCount} check(s) still missing. The move can still pass for legitimate rectification.`}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Five checks</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            What &ldquo;adjust until it fits&rdquo; skips
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {CHECKS.map((c) => {
              const checked = checks[c.key];
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => toggleCheck(c.key)}
                  style={togglePanelStyle(checked, checked ? GREEN : VERMILION)}
                >
                  {checked ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                  <span>
                    <span style={{ fontWeight: 600 }}>{c.label}</span>
                    <span style={{ color: checked ? INK_SECONDARY : VERMILION }}> — {c.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
          <div>
            <p style={eyebrowStyle}>Process comparison</p>
            <h3 style={{ margin: "0.15rem 0 0", color: mode === "reverse" ? VERMILION : GREEN, fontSize: "1.15rem", fontWeight: 600 }}>
              {mode === "reverse" ? "Reverse-engineered rectification" : "Triangulated rectification"}
            </h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" aria-pressed={mode === "reverse"} onClick={() => setMode("reverse")} style={buttonStyle(mode === "reverse", VERMILION)}>
              Adjust until it fits
            </button>
            <button type="button" aria-pressed={mode === "triangulated"} onClick={() => setMode("triangulated")} style={buttonStyle(mode === "triangulated", GREEN)}>
              Seven-method triangulation
            </button>
          </div>
        </div>
        <ProcessFlowSvg mode={mode} />
        <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          {mode === "reverse"
            ? "The desired conclusion comes first; the birth time is merely adjusted until the chart cooperates."
            : "Candidates are tested by independent and same-root evidence; the verdict reports only what honestly converges."}
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Module arc</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          What each chapter added to the literacy bar
        </h3>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
          <ChapterArc active={activeChapter} onSelect={setActiveChapter} />
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.85rem",
            borderRadius: 8,
            background: `${GOLD}10`,
            border: `1px solid ${GOLD}55`,
            color: INK_PRIMARY,
            lineHeight: 1.55,
          }}
        >
          <span style={{ color: GOLD, fontWeight: 600 }}>{CHAPTERS[activeChapter].title}:</span>{" "}
          {CHAPTERS[activeChapter].added}.
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
          <div>
            <p style={eyebrowStyle}>Candidate verdict</p>
            <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem", fontWeight: 600 }}>
              The honest final count from six chapters of work
            </h3>
          </div>
          <span style={{ color: GOLD, fontWeight: 600 }}>Moderate indication · 2 independent threads</span>
        </div>
        <CandidateSvg selected={selectedCandidate} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "0.55rem" }}>
          {CANDIDATES.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={selectedCandidate === c.key}
              onClick={() => setSelectedCandidate(c.key)}
              style={{
                border: `1px solid ${selectedCandidate === c.key ? c.color : HAIRLINE}`,
                borderRadius: 8,
                background: selectedCandidate === c.key ? `${c.color}12` : "transparent",
                padding: "0.65rem",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontWeight: 600, color: c.color }}>{c.label}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: c.color }}>{c.status}</span>
              </div>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>{c.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Common misreadings of the literacy bar
        </h3>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(COMMITMENTS) as CommitmentKey[]).map((key) => {
            const held = commitments[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setCommitments((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <span style={{ fontWeight: 600 }}>{COMMITMENTS[key].label}</span>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? COMMITMENTS[key].heldText : COMMITMENTS[key].releasedText}</span>
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
            background: allCommitmentsHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allCommitmentsHeld ? GREEN : VERMILION}55`,
            color: allCommitmentsHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allCommitmentsHeld
            ? "All discipline commitments are held. The bar is honesty under complexity, not a guarantee of certainty."
            : `${Object.keys(COMMITMENTS).length - Object.values(commitments).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem", fontWeight: 600 }}>
          What the literacy bar actually delivers
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          The module does not promise that seven-method triangulation reliably produces strong-tier verdicts. Vikram&apos;s own case reached only a{" "}
          <span style={{ color: GOLD, fontWeight: 600 }}>moderate</span> indication after six chapters. What the module delivers is discipline: distinguishing independent from same-root evidence; counting converging threads; reporting silence and non-discrimination as real findings; declining to fabricate a source; and naming exactly what new evidence would be needed to reach a stronger tier.
        </p>
      </section>
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
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
