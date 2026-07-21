"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Mode = "mode2" | "mode3";
type DraftKey = "mode2" | "mode3" | "compound";
type DiagnosisStep = "dashaPresent" | "transitPresent" | "connected" | "vedhaMentioned";
type MistakeKey = "termPresence" | "vagueTransit" | "wrongFix";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";


const MODE_DATA: Record<Mode, { label: string; color: string; tagline: string; signature: string; example: string; fix: string }> = {
  mode2: {
    label: "Mode 2 — Daśā-without-transit",
    color: VERMILION,
    tagline: "Has the window, lacks the trigger",
    signature: "Naming an event (often a date) from an active daśā alone, with no confirmed transit trigger.",
    example: "Kavya's Moon/Jupiter antardaśā is running now — this is when she marries.",
    fix: "Treat the window as ripeness, not a dated event. Identify the specific transit that will trigger it (e.g., Saturn into Libra, once vedha-cleared).",
  },
  mode3: {
    label: "Mode 3 — Transit-without-daśā",
    color: BLUE,
    tagline: "Has the trigger, lacks the window",
    signature: "Predicting an event from a transit with no active daśā window behind it.",
    example: "Saturn is entering Libra, favourable-from-Moon and Saturn's exaltation sign, so a major positive event is coming for Kavya.",
    fix: "State the transit only in relation to the specific daśā window it activates. Slow transits happen for everyone; relevance requires a current window.",
  },
};

const DRAFTS: Record<DraftKey, { label: string; text: string; mode: Mode | "compound"; connected: boolean; vedhaMentioned: boolean; diagnosis: string; rewrite: string }> = {
  mode2: {
    label: "Mode 2 draft",
    text: "Kavya's Moon/Jupiter antardaśā is running now — this is when she marries.",
    mode: "mode2",
    connected: false,
    vedhaMentioned: false,
    diagnosis: "The daśā window is real (Weak-tier support per Module 18), but no transit trigger is named. Ripe window treated as dated event.",
    rewrite: "Kavya's Moon/Jupiter antardaśā carries Weak-tier support for relationship matters. Whether it becomes a dated event depends on a specific transit trigger, such as Saturn entering Libra, being confirmed and vedha-cleared.",
  },
  mode3: {
    label: "Mode 3 draft",
    text: "Saturn is entering Libra — favourable-from-Moon and Saturn's exaltation sign — so a major positive event is coming for Kavya.",
    mode: "mode3",
    connected: false,
    vedhaMentioned: false,
    diagnosis: "The transit is astronomically accurate and classically favourable, but no daśā window is named. Trigger without relevance to this chart's current ripeness.",
    rewrite: "Saturn is entering Libra, favourable-from-Moon. For this to be Kavya's event, it must fall inside a daśā window that makes the relevant life-domain ripe — such as her Moon/Jupiter antardaśā — and the vedha-point must be clear.",
  },
  compound: {
    label: "Compound / disguised draft",
    text: "Kavya's Moon/Jupiter antardaśā is active — historically favourable for relationship matters. Saturn is also entering Libra around this time. Given both facts, a marriage-relevant event should be expected within this antardaśā.",
    mode: "compound",
    connected: false,
    vedhaMentioned: false,
    diagnosis: "Both daśā and transit are mentioned, but the transit is only 'around this time,' not explicitly tied to the specific point the antardaśā made ripe. This is a disguised Mode 2 plus an unaddressed vedha risk.",
    rewrite: "Kavya's Moon/Jupiter antardaśā carries Weak-tier support for relationship matters. Saturn's transit into Libra is classically favourable, but whether it activates the specific point this antardaśā made ripe, and whether Aries (the vedha-point, holding her natal Mars) obstructs it, is not yet established.",
  },
};

const AUDIT_STEPS: Record<DiagnosisStep, { label: string; question: string }> = {
  dashaPresent: { label: "Daśā present", question: "Does the draft name a specific active daśā window?" },
  transitPresent: { label: "Transit present", question: "Does the draft name a specific current transit?" },
  connected: { label: "Explicitly connected", question: "Does the draft explicitly connect the transit to the specific point the daśā made ripe?" },
  vedhaMentioned: { label: "Vedha acknowledged", question: "Does the draft note whether the vedha-point is clear?" },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  termPresence: {
    label: "Do not scan for term-presence; scan for connection",
    heldText: "Held: a draft can mention both daśā and transit and still be flawed if they are not explicitly connected.",
    releasedText: "Warning: presence of both terms feels sufficient but does not satisfy the T-D-V convergence requirement.",
  },
  vagueTransit: {
    label: "A vague transit reference is functionally no transit",
    heldText: "Held: 'around this time' does not connect the transit to the window's specific point.",
    releasedText: "Warning: vague mentions give an illusion of coverage without functional T-D-V support.",
  },
  wrongFix: {
    label: "Adding the missing term is not enough; the connection must be real",
    heldText: "Held: the corrective move states the transit in relation to the specific window it activates.",
    releasedText: "Warning: inserting an unrelated daśā reference creates a different disconnected draft, not a fix.",
  },
};

export function TdvModesTwoThreeExplorer() {
  const [mode, setMode] = useState<Mode>("mode2");
  const [selectedDraft, setSelectedDraft] = useState<DraftKey>("mode2");
  const [audit, setAudit] = useState<Record<DiagnosisStep, boolean>>({
    dashaPresent: true,
    transitPresent: false,
    connected: false,
    vedhaMentioned: false,
  });
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    termPresence: true, vagueTransit: true, wrongFix: true,
  });

  const draft = DRAFTS[selectedDraft];
  const allMistakesHeld = Object.values(mistakes).every(Boolean);
  const auditComplete = Object.values(audit).every(Boolean);

  function reset() {
    setMode("mode2");
    setSelectedDraft("mode2");
    setAudit({ dashaPresent: true, transitPresent: false, connected: false, vedhaMentioned: false });
    setMistakes({ termPresence: true, vagueTransit: true, wrongFix: true });
  }

  function toggleAudit(key: DiagnosisStep) {
    setAudit((a) => ({ ...a, [key]: !a[key] }));
  }

  return (
    <div data-interactive="tdv-modes-two-three-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Failure modes 2 &amp; 3</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Mirror-image diagnostic explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Mode 2 has the window but no trigger. Mode 3 has the trigger but no window. The reliable self-audit checks whether the transit is explicitly connected to the point the daśā made ripe.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Mirror-image modes</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Select a mode to see its signature and fix
          </h3>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {(["mode2", "mode3"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                style={buttonStyle(mode === m, MODE_DATA[m].color)}
              >
                {MODE_DATA[m].label}
              </button>
            ))}
          </div>
          <MirrorSvg activeMode={mode} />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${MODE_DATA[mode].color}55`,
              background: `${MODE_DATA[mode].color}10`,
            }}
          >
            <div style={{ color: MODE_DATA[mode].color, fontWeight: 600 }}>{MODE_DATA[mode].tagline}</div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{MODE_DATA[mode].signature}</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, lineHeight: 1.55 }}>Example: <em>{MODE_DATA[mode].example}</em></p>
            <p style={{ margin: "0.45rem 0 0", color: GREEN, lineHeight: 1.55 }}>Fix: {MODE_DATA[mode].fix}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Self-audit checklist" icon={<Lightbulb size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The reliable question is not &ldquo;are both terms present?&rdquo; but &ldquo;is the connection explicit?&rdquo;
            </p>
            <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.65rem" }}>
              {(Object.keys(AUDIT_STEPS) as DiagnosisStep[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={audit[key]}
                  onClick={() => toggleAudit(key)}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${audit[key] ? GREEN : HAIRLINE}`,
                    borderRadius: 8,
                    background: audit[key] ? `${GREEN}10` : "transparent",
                    color: audit[key] ? GREEN : INK_SECONDARY,
                    padding: "0.65rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>{AUDIT_STEPS[key].label}</strong>
                  <span style={{ color: audit[key] ? INK_PRIMARY : INK_SECONDARY }}>{AUDIT_STEPS[key].question}</span>
                </button>
              ))}
            </div>
            <div
              style={{
                marginTop: "0.65rem",
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                background: auditComplete ? `${GREEN}12` : `${AMBER}12`,
                border: `1px solid ${auditComplete ? GREEN : AMBER}55`,
                color: auditComplete ? GREEN : AMBER,
                fontWeight: 600,
              }}
            >
              {auditComplete
                ? "All four audit checks pass. The draft is T-D-V-complete (though vedha-cleared still needs actual determination)."
                : `${Object.values(audit).filter(Boolean).length} of ${Object.keys(audit).length} checks pass. The missing checks are where a mode-2 or mode-3 flaw can hide.`}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Draft diagnosis exercise</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Choose a Kavya draft and see the diagnosis and rewrite
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          {(Object.keys(DRAFTS) as DraftKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={selectedDraft === key}
              onClick={() => setSelectedDraft(key)}
              style={buttonStyle(selectedDraft === key, DRAFTS[key].mode === "compound" ? AMBER : MODE_DATA[DRAFTS[key].mode as Mode].color)}
            >
              {DRAFTS[key].label}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${draft.mode === "compound" ? AMBER : MODE_DATA[draft.mode as Mode].color}55`,
            background: `${draft.mode === "compound" ? AMBER : MODE_DATA[draft.mode as Mode].color}10`,
          }}
        >
          <div style={{ color: draft.mode === "compound" ? AMBER : MODE_DATA[draft.mode as Mode].color, fontWeight: 600, marginBottom: "0.35rem" }}>
            {draft.mode === "compound" ? "Disguised Mode 2 + unaddressed Vedha" : MODE_DATA[draft.mode as Mode].label}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}><strong style={{ fontWeight: 600 }}>Draft:</strong> {draft.text}</p>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}><strong style={{ fontWeight: 600 }}>Diagnosis:</strong> {draft.diagnosis}</p>
          <p style={{ margin: "0.45rem 0 0", color: GREEN, lineHeight: 1.55 }}><strong style={{ fontWeight: 600 }}>Rewrite:</strong> {draft.rewrite}</p>
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
            ? "All discipline commitments are held. The self-audit targets explicit connection, not term presence."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function MirrorSvg({ activeMode }: { activeMode: Mode }) {
  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Mode 2 and Mode 3 mirror diagram" style={{ width: "100%", maxHeight: 260, margin: "0.65rem auto 0.25rem", display: "block" }}>
      {/* Mode 2 box */}
      <rect x="30" y="30" width="220" height="200" rx="8" fill={activeMode === "mode2" ? `${VERMILION}10` : "transparent"} stroke={activeMode === "mode2" ? VERMILION : HAIRLINE} strokeWidth="2" />
      <text x="140" y="60" textAnchor="middle" fill={activeMode === "mode2" ? VERMILION : INK_MUTED} fontSize="13" fontWeight={600}>Mode 2</text>
      <rect x="70" y="90" width="140" height="50" rx="6" fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2" />
      <text x="140" y="112" textAnchor="middle" fill={AMBER} fontSize="12" fontWeight={600}>Daśā window</text>
      <text x="140" y="128" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>present</text>
      <rect x="70" y="160" width="140" height="50" rx="6" fill={`${HAIRLINE}22`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 4" />
      <text x="140" y="182" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Transit trigger</text>
      <text x="140" y="198" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>missing</text>

      {/* Mode 3 box */}
      <rect x="310" y="30" width="220" height="200" rx="8" fill={activeMode === "mode3" ? `${BLUE}10` : "transparent"} stroke={activeMode === "mode3" ? BLUE : HAIRLINE} strokeWidth="2" />
      <text x="420" y="60" textAnchor="middle" fill={activeMode === "mode3" ? BLUE : INK_MUTED} fontSize="13" fontWeight={600}>Mode 3</text>
      <rect x="350" y="90" width="140" height="50" rx="6" fill={`${HAIRLINE}22`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 4" />
      <text x="420" y="112" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Daśā window</text>
      <text x="420" y="128" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>missing</text>
      <rect x="350" y="160" width="140" height="50" rx="6" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x="420" y="182" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={600}>Transit trigger</text>
      <text x="420" y="198" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>present</text>

      {/* mirror label */}
      <text x="280" y="245" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Mirror images — one has the window, the other the trigger</text>
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
