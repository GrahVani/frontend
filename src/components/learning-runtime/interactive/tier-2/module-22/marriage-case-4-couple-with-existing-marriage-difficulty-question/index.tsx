"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CheckCircle2,
  HeartHandshake,
  Info,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt" | "arc" | "boundary";
type ArcStage = "onset" | "peak" | "easing";
type VerdictChoice = "timed" | "separation" | "divorce" | null;

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

const CARD_STYLE: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "0.75rem",
  padding: "1.25rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const EYEBROW_STYLE: CSSProperties = {
  fontSize: "0.725rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: INK_MUTED,
  margin: 0,
};

const BODY_STYLE: CSSProperties = {
  margin: 0,
  fontSize: "0.85rem",
  color: INK_PRIMARY,
  lineHeight: 1.5,
};

const ARC_STAGE_CONTENT: Record<ArcStage, { label: string; body: string }> = {
  onset: {
    label: "Onset — the transit begins",
    body: "Saturn begins pressing the 7th axis and the Sade Sati–type phase opens. The strain has a beginning — it was not always here, and the client can usually feel when it started.",
  },
  peak: {
    label: "Peak — why this year is hard",
    body: "Saturn mahādaśā and the Saturn transit agree: the very planet gripping the 7th is running its period while transiting the marriage axis. This is the acute pressure Anil reports — real, and at its heaviest.",
  },
  easing: {
    label: "Easing — the transit moves on",
    body: "A transit is a passage, not a permanent state. As Saturn moves off the 7th axis the acute pressure eases. The affliction is kālaja — born of time, not everlasting (§5).",
  },
};

const FIFTH_PART_CHECKS = [
  { key: "validate", label: "Validates the pain honestly", hint: "names the hard year as real, not imagined" },
  { key: "arc", label: "Names the timed arc", hint: "a phase tied to a period that passes" },
  { key: "refuse", label: "Explicitly refuses the ending", hint: "no divorce prediction, stated as a boundary" },
  { key: "route", label: "Routes the repair to a therapist", hint: "couples therapy alongside patience" },
  { key: "nodoom", label: "Free of doom language", hint: "no alarm, no fatalism, no verdict" },
] as const;

function MarriageCase4ArchitectureSvg({ activeView, onSelect }: { activeView: ViewKey; onSelect: (view: ViewKey) => void }) {
  const box = (
    x: number,
    view: ViewKey,
    tint: string,
    color: string,
    title: string,
    lines: string[],
    footer: string,
    footerColor: string,
  ) => {
    const active = activeView === view;
    return (
      <g transform={`translate(${x}, 20)`} onClick={() => onSelect(view)} style={{ cursor: "pointer" }} role="button" aria-label={`Open ${title} panel`}>
        <rect x="0" y="0" width="200" height="140" rx="8" fill={tint} stroke={color} strokeWidth={active ? 2.5 : 1.25} opacity={active ? 1 : 0.72} />
        <text x="100" y="22" textAnchor="middle" fill={color} fontSize="10" fontWeight="600">{title}</text>
        {lines.map((line, i) => (
          <text key={i} x="100" y={44 + i * 16} textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">{line}</text>
        ))}
        <text x="100" y="126" textAnchor="middle" fill={footerColor} fontSize="9" fontWeight="600">{footer}</text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Existing-marriage-difficulty reading architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="8" width="660" height="164" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />
      {box(25, "attempt", "#FFF3E0", VERMILION, "AFFLICTION STACK (§4.2)", [
        "7th lord Saturn — cold, own-sign, in 7th",
        "Debilitated Mars aspects the 7th (from 1st)",
        "Venus kāraka in the 6th (discord house)",
      ], "Strain is real — not minimised", VERMILION)}
      <path d="M 230 90 L 250 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />
      {box(250, "arc", "#EBF3FA", BLUE, "TIMED ARC (§6)", [
        "Saturn mahādaśā running",
        "Saturn transiting the 7th axis",
        "Sade Sati–type phase — onset, peak, easing",
      ], "kālaja — born of time, has an arc", BLUE)}
      <path d="M 455 90 L 475 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />
      {box(475, "boundary", "#E8F5E9", GREEN, "DISCIPLINED OUTPUT (§6)", [
        "Moderate tier: difficult timed phase",
        "Refuses the ending — never decreed",
        "Repair routed to a couples therapist",
      ], "No doom — validation and care", GREEN)}
    </svg>
  );
}

function TimedArcSvg({ whyNowActive, stage, onStage }: { whyNowActive: boolean; stage: ArcStage; onStage: (s: ArcStage) => void }) {
  const stroke = whyNowActive ? BLUE : HAIRLINE;
  const stages: Array<{ key: ArcStage; cx: number; cy: number; label: string }> = [
    { key: "onset", cx: 120, cy: 172, label: "Onset" },
    { key: "peak", cx: 340, cy: 52, label: "Peak — this year" },
    { key: "easing", cx: 560, cy: 145, label: "Easing" },
  ];

  return (
    <svg viewBox="0 0 680 240" role="img" aria-label="Timed arc of the Saturn phase over the marriage axis" style={{ width: "100%", maxHeight: 260, margin: "0.25rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="220" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />
      <text x="340" y="34" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">ACUTE PRESSURE ON THE MARRIAGE — TRANSIT-DRIVEN, THEREFORE TIMED</text>
      <line x1="55" y1="200" x2="635" y2="200" stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="60" y="218" fill={INK_MUTED} fontSize="9" fontWeight="500">transit begins</text>
      <text x="310" y="218" fill={INK_MUTED} fontSize="9" fontWeight="500">now</text>
      <text x="540" y="218" fill={INK_MUTED} fontSize="9" fontWeight="500">transit moves on</text>
      <path
        d="M 60 175 C 160 170, 250 58, 340 52 C 430 58, 540 138, 620 148"
        fill="none"
        stroke={stroke}
        strokeWidth={whyNowActive ? 4 : 3}
        strokeLinecap="round"
        strokeDasharray={whyNowActive ? undefined : "6 6"}
      />
      {stages.map((s) => {
        const active = stage === s.key;
        const color = whyNowActive ? (s.key === "peak" ? VERMILION : s.key === "easing" ? GREEN : BLUE) : INK_MUTED;
        return (
          <g key={s.key} onClick={() => onStage(s.key)} style={{ cursor: "pointer" }} role="button" aria-label={`Arc stage: ${s.label}`}>
            <circle cx={s.cx} cy={s.cy} r={active ? 13 : 9} fill={active ? color : "#fff"} stroke={color} strokeWidth="2.5" opacity={whyNowActive ? 1 : 0.6} />
            <text x={s.cx} y={s.cy - 20} textAnchor="middle" fill={color} fontSize="10" fontWeight="600">{s.label}</text>
          </g>
        );
      })}
      {!whyNowActive && (
        <text x="340" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="500">
          Natal affliction alone reads static — enable the daśā + transit to see why the pressure is timed
        </text>
      )}
    </svg>
  );
}

export function ExistingMarriageDifficultyCaseWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student attempt state (§4.3)
  const [studentAffliction, setStudentAffliction] = useState("");
  const [studentArc, setStudentArc] = useState("");
  const [studentBoundary, setStudentBoundary] = useState("");
  const [studentOneLine, setStudentOneLine] = useState("");

  // Tab 2 — affliction & arc state
  const [dashaOn, setDashaOn] = useState(true);
  const [transitOn, setTransitOn] = useState(true);
  const [arcStage, setArcStage] = useState<ArcStage>("peak");

  // Tab 3 — boundary & scope state
  const [verdict, setVerdict] = useState<VerdictChoice>(null);
  const [therapistRoute, setTherapistRoute] = useState(false);
  const [fifthPart, setFifthPart] = useState<Record<string, boolean>>({});

  const whyNowActive = dashaOn && transitOn;
  const doomAttempted = verdict === "separation" || verdict === "divorce";
  const boundaryHeld = verdict === "timed";
  const checkedCount = FIFTH_PART_CHECKS.filter((c) => fifthPart[c.key]).length;
  const allFifthPart = checkedCount === FIFTH_PART_CHECKS.length;
  const canFinalise = boundaryHeld && therapistRoute && allFifthPart;

  const resetAll = () => {
    setActiveView("attempt");
    setIsUnsealed(false);
    setStudentAffliction("");
    setStudentArc("");
    setStudentBoundary("");
    setStudentOneLine("");
    setDashaOn(true);
    setTransitOn(true);
    setArcStage("peak");
    setVerdict(null);
    setTherapistRoute(false);
    setFifthPart({});
  };

  const tabButton = (view: ViewKey, color: string, label: string) => (
    <button
      type="button"
      onClick={() => setActiveView(view)}
      style={{
        padding: "0.4rem 0.8rem",
        fontSize: "0.85rem",
        borderRadius: "0.3rem",
        border: `1px solid ${activeView === view ? color : HAIRLINE}`,
        background: activeView === view ? "#FDFAF2" : "transparent",
        color: activeView === view ? color : INK_SECONDARY,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );

  return (
    <div data-interactive="marriage-case-4-couple-with-existing-marriage-difficulty-question" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Chapter 2 Case 4 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Marriage Case 4: Existing-Marriage Difficulty — a Timed Phase, Never a Decreed Ending
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Anil asks: <em>&quot;My marriage has been very hard this past year — is it going to end?&quot;</em> Read the strain honestly, frame it as a timed phase with an arc, refuse the divorce prediction, and route the repair to a couples therapist.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAll}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "0.5rem",
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              color: GOLD,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset Workbench
          </button>
        </div>
      </section>

      {/* Architecture vector diagram — boxes are clickable and switch the panel below */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Difficult-Marriage Reading Architecture (§4.2–§6)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Click a stage to open its panel — affliction stack, timed arc, disciplined output</span>
        </div>
        <MarriageCase4ArchitectureSvg activeView={activeView} onSelect={setActiveView} />
      </section>

      {/* Main interactive layout */}
      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            {tabButton("attempt", GOLD, "1. Sealed Attempt Protocol")}
            {tabButton("arc", BLUE, "2. Affliction & Timed Arc")}
            {tabButton("boundary", GREEN, "3. Boundary & Scope Routing")}
          </div>

          {/* View 1: Attempt-then-compare */}
          {activeView === "attempt" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {!isUnsealed ? (
                <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.5rem" }}>
                    <Lock size={18} />
                    <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Sealed Attempt Workspace (§4.3)</strong>
                  </div>
                  <p style={{ ...BODY_STYLE, marginBottom: "0.8rem" }}>
                    Record your own reading of Anil&apos;s chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. The affliction — what stresses the marriage (7th, 7th lord, Venus, Mars)?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cold own-sign Saturn as 7th lord in the 7th; debilitated Mars aspecting the 7th; Venus kāraka in the 6th"
                        value={studentAffliction}
                        onChange={(e) => setStudentAffliction(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. The timing and arc — why is now hard, and does the phase end?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Saturn mahādaśā + Saturn transit over the 7th axis; transit-driven, so it eases as it moves on"
                        value={studentArc}
                        onChange={(e) => setStudentArc(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. The boundary — what will you refuse to predict, and where does the repair route?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Refuse any separation/divorce prediction; route the relationship repair to a couples therapist"
                        value={studentBoundary}
                        onChange={(e) => setStudentBoundary(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        4. Your one-line answer to Anil — honest, kind, free of doom:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. This is a genuinely hard but timed phase — not an ending — and the repair work deserves real support"
                        value={studentOneLine}
                        onChange={(e) => setStudentOneLine(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsUnsealed(true)}
                    style={{
                      marginTop: "1rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: GREEN,
                      color: "#FFF",
                      border: "none",
                      borderRadius: "0.4rem",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Unlock size={16} />
                    Unseal & Compare Solution
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                      <CheckCircle2 size={18} />
                      <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Solution Side-by-Side Comparison (§6)</strong>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "0.75rem", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${HAIRLINE}` }}>
                        <strong style={{ color: GOLD, display: "block", marginBottom: "0.2rem", fontWeight: 600 }}>Your Attempt:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong style={{ fontWeight: 600 }}>Affliction:</strong> {studentAffliction || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong style={{ fontWeight: 600 }}>Timing / arc:</strong> {studentArc || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong style={{ fontWeight: 600 }}>Boundary:</strong> {studentBoundary || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong style={{ fontWeight: 600 }}>One-line:</strong> {studentOneLine || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem", fontWeight: 600 }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong style={{ fontWeight: 600 }}>Affliction:</strong> cold 7th-lord Saturn in the 7th, debilitated Mars aspecting the 7th, Venus kāraka in the 6th — strain is real</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong style={{ fontWeight: 600 }}>Timing / arc:</strong> Saturn daśā + Saturn transit over the 7th axis; onset → peak → easing</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong style={{ fontWeight: 600 }}>Boundary:</strong> no ending predicted — outside the chart&apos;s certainty and self-fulfilling; repair routed to a couples therapist</p>
                        <p style={{ margin: 0 }}>• <strong style={{ fontWeight: 600 }}>Tier:</strong> Moderate in a difficult, timed phase — never an ending</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: Affliction & timed arc */}
          {activeView === "arc" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <button
                  type="button"
                  aria-pressed={dashaOn}
                  onClick={() => setDashaOn((v) => !v)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    gap: "0.65rem",
                    alignItems: "start",
                    textAlign: "left",
                    border: `1px solid ${dashaOn ? PURPLE : HAIRLINE}`,
                    borderRadius: "0.5rem",
                    background: dashaOn ? `${PURPLE}14` : "transparent",
                    color: dashaOn ? PURPLE : INK_SECONDARY,
                    padding: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span>
                    <strong style={{ fontWeight: 600 }}>Saturn mahādaśā running</strong>
                    <span style={{ display: "block", fontSize: "0.82rem", color: INK_SECONDARY, marginTop: "0.15rem" }}>
                      The period of the very planet whose grip on the 7th is being felt — the daśā lord is the 7th lord.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={transitOn}
                  onClick={() => setTransitOn((v) => !v)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    gap: "0.65rem",
                    alignItems: "start",
                    textAlign: "left",
                    border: `1px solid ${transitOn ? BLUE : HAIRLINE}`,
                    borderRadius: "0.5rem",
                    background: transitOn ? `${BLUE}14` : "transparent",
                    color: transitOn ? BLUE : INK_SECONDARY,
                    padding: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span>
                    <strong style={{ fontWeight: 600 }}>Saturn transiting the 7th axis (Sade Sati–type)</strong>
                    <span style={{ display: "block", fontSize: "0.82rem", color: INK_SECONDARY, marginTop: "0.15rem" }}>
                      The acute pressure is transit-driven — a passage over the marriage axis, not a fixed state.
                    </span>
                  </span>
                </button>
              </div>

              <TimedArcSvg whyNowActive={whyNowActive} stage={arcStage} onStage={setArcStage} />

              <div style={{ background: whyNowActive ? "#EBF3FA" : "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${whyNowActive ? BLUE : GOLD}` }}>
                <strong style={{ color: whyNowActive ? BLUE : GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  {ARC_STAGE_CONTENT[arcStage].label}
                </strong>
                <p style={BODY_STYLE}>
                  {whyNowActive
                    ? ARC_STAGE_CONTENT[arcStage].body
                    : "With the daśā and transit switched off, only the static natal affliction remains. Mistake #3 (§8) is reading that static picture as permanent — the acute difficulty here is transit-driven, so it carries an arc: a beginning, a peak, and an easing."}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.55rem" }}>
                <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: "0.5rem", background: `${VERMILION}0F`, padding: "0.7rem" }}>
                  <strong style={{ color: VERMILION, fontWeight: 600, fontSize: "0.85rem" }}>Cold 7th lord</strong>
                  <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.4 }}>Saturn strong in own sign in the 7th — stable, but dutiful, distant, delaying.</p>
                </div>
                <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: "0.5rem", background: `${VERMILION}0F`, padding: "0.7rem" }}>
                  <strong style={{ color: VERMILION, fontWeight: 600, fontSize: "0.85rem" }}>Debilitated Mars aspect</strong>
                  <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.4 }}>Mars in Cancer (1st) casts its 7th aspect on the 7th — friction, misdirected frustration.</p>
                </div>
                <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: "0.5rem", background: `${VERMILION}0F`, padding: "0.7rem" }}>
                  <strong style={{ color: VERMILION, fontWeight: 600, fontSize: "0.85rem" }}>Venus kāraka in the 6th</strong>
                  <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.4 }}>The marriage significator sits in the discord house — a legible strain signature.</p>
                </div>
              </div>

              <div style={{ background: "#EDE9F6", padding: "0.75rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <p style={{ ...BODY_STYLE, color: INK_SECONDARY }}>
                  <strong style={{ color: PURPLE, fontWeight: 600 }}>KP layer (§6):</strong> the 7th cuspal sub-lord reflects a strained-but-not-severed 7th — KP corroborates <em>difficulty</em>, never <em>dissolution</em>.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Boundary & scope routing */}
          {activeView === "boundary" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  1. Hold the boundary — try to finalise a verdict
                </strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button
                    type="button"
                    aria-pressed={verdict === "timed"}
                    onClick={() => setVerdict("timed")}
                    style={{
                      border: `1px solid ${verdict === "timed" ? GREEN : HAIRLINE}`,
                      borderRadius: "0.4rem",
                      background: verdict === "timed" ? GREEN : "transparent",
                      color: verdict === "timed" ? "#fff" : INK_SECONDARY,
                      padding: "0.45rem 0.7rem",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Difficult, timed phase with an arc
                  </button>
                  <button
                    type="button"
                    aria-pressed={verdict === "separation"}
                    onClick={() => setVerdict("separation")}
                    style={{
                      border: `1px solid ${verdict === "separation" ? VERMILION : HAIRLINE}`,
                      borderRadius: "0.4rem",
                      background: verdict === "separation" ? VERMILION : "transparent",
                      color: verdict === "separation" ? "#fff" : INK_SECONDARY,
                      padding: "0.45rem 0.7rem",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Separation is likely
                  </button>
                  <button
                    type="button"
                    aria-pressed={verdict === "divorce"}
                    onClick={() => setVerdict("divorce")}
                    style={{
                      border: `1px solid ${verdict === "divorce" ? VERMILION : HAIRLINE}`,
                      borderRadius: "0.4rem",
                      background: verdict === "divorce" ? VERMILION : "transparent",
                      color: verdict === "divorce" ? "#fff" : INK_SECONDARY,
                      padding: "0.45rem 0.7rem",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    I see divorce ahead
                  </button>
                </div>

                {doomAttempted && (
                  <div style={{ marginTop: "0.65rem", background: "#F9E8E3", border: `1px solid ${VERMILION}`, borderRadius: "0.4rem", padding: "0.65rem", display: "grid", gridTemplateColumns: "24px 1fr", gap: "0.5rem", alignItems: "start" }}>
                    <ShieldAlert size={18} color={VERMILION} aria-hidden="true" />
                    <p style={{ ...BODY_STYLE, color: VERMILION }}>
                      Blocked — a decreed ending is outside the chart&apos;s certainty, and pronouncing it can become self-fulfilling: a client told their marriage will end may withdraw the effort that would have saved it (§6, mistake #1). Reframe as a timed phase with an arc.
                    </p>
                  </div>
                )}
                {boundaryHeld && (
                  <div style={{ marginTop: "0.65rem", background: "#E8F5E9", border: `1px solid ${GREEN}`, borderRadius: "0.4rem", padding: "0.65rem", display: "grid", gridTemplateColumns: "24px 1fr", gap: "0.5rem", alignItems: "start" }}>
                    <ShieldCheck size={18} color={GREEN} aria-hidden="true" />
                    <p style={{ ...BODY_STYLE, color: GREEN }}>
                      Boundary held — moderate confidence in a difficult, timed phase. No prediction of ending is offered; that sits outside both the chart&apos;s certainty and the practitioner&apos;s remit.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-pressed={therapistRoute}
                onClick={() => setTherapistRoute((v) => !v)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr",
                  gap: "0.65rem",
                  alignItems: "start",
                  textAlign: "left",
                  border: `1px solid ${therapistRoute ? GREEN : HAIRLINE}`,
                  borderRadius: "0.5rem",
                  background: therapistRoute ? `${GREEN}14` : "transparent",
                  color: therapistRoute ? GREEN : INK_SECONDARY,
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <HeartHandshake size={18} aria-hidden="true" />
                <span>
                  <strong style={{ fontWeight: 600 }}>2. Route the repair — couples-therapist referral in the scope field</strong>
                  <span style={{ display: "block", fontSize: "0.82rem", color: INK_SECONDARY, marginTop: "0.15rem" }}>
                    Astrology times the phase and counsels patience; it cannot repair communication and resentment. That work belongs to a qualified couples therapist — scope-of-competence, not a withdrawal of care.
                  </span>
                </span>
              </button>

              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  3. Draft the fifth part — the ethical framing (§6)
                </strong>
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  {FIFTH_PART_CHECKS.map((check) => {
                    const on = Boolean(fifthPart[check.key]);
                    return (
                      <button
                        key={check.key}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setFifthPart((prev) => ({ ...prev, [check.key]: !prev[check.key] }))}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "24px 1fr",
                          gap: "0.55rem",
                          alignItems: "start",
                          textAlign: "left",
                          border: `1px solid ${on ? BLUE : HAIRLINE}`,
                          borderRadius: "0.4rem",
                          background: on ? `${BLUE}14` : "transparent",
                          padding: "0.55rem 0.65rem",
                          cursor: "pointer",
                        }}
                      >
                        <CheckCircle2 size={17} color={on ? BLUE : INK_MUTED} aria-hidden="true" />
                        <span>
                          <strong style={{ fontWeight: 600, fontSize: "0.84rem", color: on ? BLUE : INK_PRIMARY }}>{check.label}</strong>
                          <span style={{ display: "block", fontSize: "0.8rem", color: INK_SECONDARY }}>{check.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: INK_MUTED }}>{checkedCount} of {FIFTH_PART_CHECKS.length} framing elements present.</p>
              </div>

              {canFinalise ? (
                <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                  <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                    Reading finalised — ethical close (§6, part 5)
                  </strong>
                  <p style={{ ...BODY_STYLE, lineHeight: 1.55 }}>
                    &quot;This past year has genuinely been a hard phase for your marriage — the chart reflects that, so your experience is not imagined. What it also shows is that this is a <em>timed</em> difficulty, tied to a period that passes, not a fixed sentence — and I will not predict that your marriage will end, because the chart does not say that and because that is not a thing I would ever pronounce over a marriage that is still yours to work on. The pressure has an arc and eases. The repair itself is best supported by a couples therapist, alongside patience through this phase.&quot;
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "0.82rem", color: INK_MUTED, lineHeight: 1.5 }}>
                  The protocol finalises only when the verdict is a timed phase (never a decreed ending), the therapist referral is in the scope field, and all five framing elements are present.
                  {[
                    !boundaryHeld && "hold the boundary",
                    !therapistRoute && "add the therapist referral",
                    !allFifthPart && "complete the fifth-part framing",
                  ].filter(Boolean).length > 0 && (
                    <> Still needed: {[
                      !boundaryHeld && "hold the boundary",
                      !therapistRoute && "add the therapist referral",
                      !allFifthPart && "complete the fifth-part framing",
                    ].filter(Boolean).join(" · ")}.</>
                  )}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px", alignContent: "start" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Info size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Key Takeaways (§9)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong style={{ fontWeight: 600 }}>Afflictions time difficulty;</strong> they do not fate an ending — never predict divorce.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong style={{ fontWeight: 600 }}>Self-fulfilling risk:</strong> refusing the decreed ending is ethics, not only accuracy.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong style={{ fontWeight: 600 }}>Timed phase with an arc:</strong> a Saturn transit over the 7th, not a permanent state.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong style={{ fontWeight: 600 }}>Validate honestly:</strong> false comfort that denies the strain is its own failure.
              </li>
              <li>
                <strong style={{ fontWeight: 600 }}>Scope routing:</strong> astrology times the phase; the repair belongs to a couples therapist.
              </li>
            </ul>
          </div>

          <div style={{ ...CARD_STYLE, borderColor: `${GOLD}66`, background: "#FDFAF2" }}>
            <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Verse Anchor (§5)</p>
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
              <em>kālajo na tu śāśvataḥ</em>
            </p>
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              &quot;Born of time, not everlasting&quot; — a timed affliction has an arc; the honest reading names the arc and its easing, never a permanent verdict of ending.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
