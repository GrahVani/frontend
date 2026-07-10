"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  ClipboardList,
  FileText,
  Link2,
  Lock,
  RotateCcw,
  Scale,
  ShieldAlert,
} from "lucide-react";
import { grahas, ink, streams as learningStreams } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "../lib/layouts";

type SectionKey = "context" | "indicators" | "confidence" | "caveats" | "ethics" | "followup";
type ConfidenceMode = "single" | "twoPart" | "insufficient";
type FindingKey = "saturnDivergence" | "nadiAbsence" | "marsPseudo" | "tajikaTiming";

interface SectionMeta {
  label: string;
  role: string;
  color: string;
  icon: ReactNode;
}

interface Finding {
  key: FindingKey;
  title: string;
  rank: "high" | "medium" | "low";
  placement: SectionKey;
  color: string;
  source: string;
  body: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = ink.goldAccent;
const SHANI = grahas.shani.primary;
const MARS = grahas.mangala.primary;
const GREEN = learningStreams.tajika.primary;
const BLUE = learningStreams.kp.primary;
const RED = learningStreams["lal-kitab"].primary;
const PURPLE = learningStreams.jaimini.primary;

const SECTIONS: Record<SectionKey, SectionMeta> = {
  context: { label: "Chart Context", role: "Question, data, and method frame", color: GOLD, icon: <FileText size={17} /> },
  indicators: { label: "Indicators", role: "Traceable stream mechanisms", color: BLUE, icon: <ClipboardList size={17} /> },
  confidence: { label: "Confidence", role: "Mode chosen from Check result", color: SHANI, icon: <Scale size={17} /> },
  caveats: { label: "Caveats", role: "Scoped exclusions and low-rank notes", color: RED, icon: <ShieldAlert size={17} /> },
  ethics: { label: "Ethical Framing", role: "No overclaiming, no false precision", color: GREEN, icon: <Lock size={17} /> },
  followup: { label: "Follow-up", role: "What would sharpen or continue", color: PURPLE, icon: <BookOpenCheck size={17} /> },
};

const SECTION_ORDER: SectionKey[] = ["context", "indicators", "confidence", "caveats", "ethics", "followup"];

const FINDINGS: Finding[] = [
  {
    key: "saturnDivergence",
    title: "Saturn verdict divergence",
    rank: "high",
    placement: "confidence",
    color: SHANI,
    source: "Lessons 13.2.3, 13.3.3, 13.6.2",
    body: "Parashara gives weak-to-moderate; KP gives clean YES. Confirmed divergence requires two-part-resolved Confidence treatment.",
  },
  {
    key: "tajikaTiming",
    title: "2026 timing support",
    rank: "medium",
    placement: "confidence",
    color: GREEN,
    source: "Lesson 13.5.2 §4.3",
    body: "Dasha onset and solar return converge in 2026. It supports timing context, not a fresh verdict.",
  },
  {
    key: "nadiAbsence",
    title: "Nadi absent by gate",
    rank: "low",
    placement: "caveats",
    color: PURPLE,
    source: "Lesson 13.5.3 §4.4",
    body: "Recommend gate fails. This earns one caveat clause, not a paragraph.",
  },
  {
    key: "marsPseudo",
    title: "Mars Nek/Bad pseudo-divergence",
    rank: "low",
    placement: "caveats",
    color: MARS,
    source: "Lesson 13.6.3 §4.2",
    body: "Category-error distinction. It can be noted as resolved, never promoted to Confidence.",
  },
];

const MODE_LABELS: Record<ConfidenceMode, { label: string; color: string; rule: string }> = {
  single: {
    label: "Single-verdict",
    color: GREEN,
    rule: "Use when Check finds genuine convergence or resolves a false divergence as artefact.",
  },
  twoPart: {
    label: "Two-part-resolved",
    color: SHANI,
    rule: "Use when Check confirms a real divergence. Chart MD1's marriage question needs this mode.",
  },
  insufficient: {
    label: "Insufficient-data",
    color: RED,
    rule: "Use only when data quality blocks deciding whether a divergence is genuine or artefact.",
  },
};

export function SynthesisStatementCompositionDiscipline() {
  const [activeSection, setActiveSection] = useState<SectionKey>("confidence");
  const [mode, setMode] = useState<ConfidenceMode>("twoPart");
  const [selectedFinding, setSelectedFinding] = useState<FindingKey>("saturnDivergence");
  const [uncitedClaim, setUncitedClaim] = useState(false);
  const [dragPseudoToConfidence, setDragPseudoToConfidence] = useState(false);
  const [overweightAbsence, setOverweightAbsence] = useState(false);

  const activeFinding = FINDINGS.find((finding) => finding.key === selectedFinding) ?? FINDINGS[0];
  const activeMeta = SECTIONS[activeSection];
  const modeMeta = MODE_LABELS[mode];

  const exportState = useMemo(() => {
    if (mode !== "twoPart") {
      return { color: RED, title: "Confidence mode blocked", body: "The loaded matrix has a confirmed real divergence, so Confidence cannot be single-verdict or insufficient-data." };
    }
    if (dragPseudoToConfidence) {
      return { color: RED, title: "Placement blocked", body: "A category-error pseudo-divergence belongs in Caveats, not Confidence." };
    }
    if (overweightAbsence) {
      return { color: RED, title: "Prominence blocked", body: "A structural absence earns one caveat clause, not equal space with the central divergence." };
    }
    if (uncitedClaim) {
      return { color: RED, title: "Traceability blocked", body: "Every Indicators and Confidence claim needs a stream, mechanism, and source lesson." };
    }
    return { color: GREEN, title: "Export ready", body: "Mode, prominence, placement, and traceability match the composition rules." };
  }, [dragPseudoToConfidence, mode, overweightAbsence, uncitedClaim]);

  const previewClaim = uncitedClaim
    ? "The chart shows some tension around commitment."
    : "Saturn is named by Parashara 7th lordship, KP cuspal sub-lordship, Jaimini Darakaraka, and Lal Kitab Teva box-4, with Tajika adding partial timing support.";

  return (
    <div data-interactive="synthesis-statement-composition-discipline" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: fontFamilies.body }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>5-stream statement composition</p>
            <h2 style={{ margin: "0.22rem 0 0", color: activeMeta.color, fontSize: "1.28rem", fontWeight: 600 }}>
              Convert ranked findings into a traceable six-section statement
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Choose the confidence mode, assign prominence by rank, and block untraceable or misplaced claims before export.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveSection("confidence");
              setMode("twoPart");
              setSelectedFinding("saturnDivergence");
              setUncitedClaim(false);
              setDragPseudoToConfidence(false);
              setOverweightAbsence(false);
            }}
            style={softButtonStyle}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 540px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Statement architecture</p>
              <h3 style={{ margin: "0.16rem 0 0", color: activeMeta.color, fontSize: "1.1rem", fontWeight: 600 }}>{activeMeta.label}: {activeMeta.role}</h3>
            </div>
            <span style={pillStyle(exportState.color)}>
              {exportState.color === GREEN ? <BadgeCheck size={15} /> : <AlertTriangle size={15} />}
              {exportState.title}
            </span>
          </div>

          <StatementSvg activeSection={activeSection} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.55rem", marginTop: "0.85rem" }}>
            {SECTION_ORDER.map((key) => (
              <button key={key} type="button" onClick={() => setActiveSection(key)} aria-pressed={activeSection === key} style={sectionButtonStyle(activeSection === key, SECTIONS[key].color)}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: SECTIONS[key].color, fontWeight: 600 }}>{SECTIONS[key].icon}{SECTIONS[key].label}</span>
                <small style={{ color: INK_SECONDARY }}>{SECTIONS[key].role}</small>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.8rem", flex: "1 1 310px" }}>
          <Panel title="Confidence mode" icon={<Scale size={18} />} color={modeMeta.color}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {(Object.keys(MODE_LABELS) as ConfidenceMode[]).map((key) => (
                <button key={key} type="button" onClick={() => setMode(key)} aria-pressed={mode === key} style={choiceStyle(mode === key, MODE_LABELS[key].color)}>
                  {MODE_LABELS[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{modeMeta.rule}</p>
          </Panel>

          <Panel title="Composition guards" icon={<ShieldAlert size={18} />} color={exportState.color}>
            <button type="button" aria-pressed={dragPseudoToConfidence} onClick={() => setDragPseudoToConfidence((value) => !value)} style={toggleButtonStyle(dragPseudoToConfidence, RED)}>
              Drag Mars pseudo-divergence to Confidence
            </button>
            <button type="button" aria-pressed={overweightAbsence} onClick={() => setOverweightAbsence((value) => !value)} style={toggleButtonStyle(overweightAbsence, RED)}>
              Give Nadi absence a full paragraph
            </button>
            <button type="button" aria-pressed={uncitedClaim} onClick={() => setUncitedClaim((value) => !value)} style={toggleButtonStyle(uncitedClaim, RED)}>
              Write claim without source
            </button>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Rank sets prominence</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.7rem", marginTop: "0.8rem" }}>
          {FINDINGS.map((finding) => (
            <button key={finding.key} type="button" onClick={() => setSelectedFinding(finding.key)} aria-pressed={selectedFinding === finding.key} style={findingCardStyle(selectedFinding === finding.key, finding.color)}>
              <span style={{ color: finding.color, fontWeight: 600 }}>{finding.title}</span>
              <span style={{ color: INK_SECONDARY }}>{finding.rank === "high" ? "Full Confidence treatment" : finding.rank === "medium" ? "Supporting clause" : "Caveats clause"}</span>
              <small style={{ color: INK_MUTED }}>{finding.source}</small>
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.85rem", border: `1px solid ${activeFinding.color}55`, borderRadius: 8, padding: "0.75rem", background: `color-mix(in srgb, ${activeFinding.color} 7%, transparent)` }}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{activeFinding.body}</p>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Traceable claim preview</p>
          <div style={{ border: `1px solid ${uncitedClaim ? RED : GREEN}66`, borderRadius: 8, padding: "0.8rem", marginTop: "0.75rem", background: uncitedClaim ? `color-mix(in srgb, ${RED} 7%, transparent)` : `color-mix(in srgb, ${GREEN} 7%, transparent)` }}>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.58 }}>{previewClaim}</p>
            <p style={{ margin: "0.55rem 0 0", color: uncitedClaim ? RED : GREEN, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Link2 size={15} aria-hidden="true" />
              {uncitedClaim ? "No stream, mechanism, or source attached" : "Trace: Parashara 13.2.3, KP 13.3.3, Jaimini 13.4.1, Lal Kitab 13.5.1, Tajika 13.5.2"}
            </p>
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: exportState.color }}>
          <p style={eyebrowStyle}>Export gate</p>
          <h3 style={{ margin: "0.2rem 0 0", color: exportState.color, fontSize: "1.08rem", fontWeight: 600 }}>{exportState.title}</h3>
          <p style={bodyTextStyle}>{exportState.body}</p>
        </section>
      </div>
    </div>
  );
}

function StatementSvg({ activeSection }: { activeSection: SectionKey }) {
  const active = SECTIONS[activeSection];
  return (
    <svg viewBox="0 0 660 250" role="img" aria-label="Six section synthesis statement map" style={{ width: "100%", minHeight: 235, display: "block", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="644" height="234" rx="8" fill="rgba(255,255,255,0.22)" stroke={HAIRLINE} />
      {SECTION_ORDER.map((key, index) => {
        const meta = SECTIONS[key];
        const x = 42 + index * 102;
        const isActive = key === activeSection;
        const height = key === "confidence" ? 138 : key === "indicators" ? 118 : key === "caveats" ? 86 : 68;
        return (
          <g key={key}>
            <rect x={x} y={190 - height} width="78" height={height} rx="8" fill={`color-mix(in srgb, ${meta.color} ${isActive ? 16 : 7}%, transparent)`} stroke={isActive ? meta.color : `${meta.color}88`} strokeWidth={isActive ? 3 : 1.5} />
            <text x={x + 39} y="208" textAnchor="middle" fill={isActive ? meta.color : INK_SECONDARY} fontSize="10" fontWeight="500">{meta.label}</text>
          </g>
        );
      })}
      <path d="M90 44 C180 24, 468 24, 570 44" fill="none" stroke={active.color} strokeWidth="3" strokeLinecap="round" />
      <text x="330" y="48" textAnchor="middle" fill={active.color} fontSize="13" fontWeight="500">{active.role}</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}55`, borderRadius: 8, background: SURFACE, padding: "0.95rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.72rem" }}>{children}</div>
    </section>
  );
}

function pillStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${color}`,
    borderRadius: 999,
    padding: "0.4rem 0.62rem",
    color,
    background: `color-mix(in srgb, ${color} 8%, transparent)`,
    fontSize: "0.78rem",
    fontWeight: 500,
  };
}

function sectionButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.22)",
    color: active ? color : INK_SECONDARY,
    padding: "0.62rem",
    display: "grid",
    gap: "0.24rem",
    textAlign: "left",
  };
}

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.68rem",
    textAlign: "left",
    fontWeight: 500,
  };
}

function toggleButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    width: "100%",
    marginTop: "0.55rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.68rem",
    fontWeight: 500,
  };
}

function findingCardStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 9%, transparent)` : "rgba(255,255,255,0.22)",
    padding: "0.72rem",
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  fontSize: "0.72rem",
  fontWeight: 500,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.58rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const buttonResetStyle: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
};

const softButtonStyle: CSSProperties = {
  ...buttonResetStyle,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.54rem 0.72rem",
  fontWeight: 500,
};
