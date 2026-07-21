"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "malpractice_contrast" | "curriculum_arc" | "true_literacy_bar";
type ChapterKey = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6";

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

const CHAPTER_INFO: Record<ChapterKey, { title: string; focus: string; color: string }> = {
  ch1: { title: "Ch 1: 5-Step Workflow", focus: "Two-axis test (dignity x functional role) & category split.", color: BLUE },
  ch2: { title: "Ch 2: Mantra Prescription", focus: "Namaskāra japa, 40-day maṇḍala, teach-back method.", color: GREEN },
  ch3: { title: "Ch 3: Yantra & Gemstones", focus: "Blue Sapphire 4-thread refusal, Citrine substitute.", color: GOLD },
  ch4: { title: "Ch 4: Lal Kitab Upaya", focus: "6 Upaya families, non-resonance totke, cancellation.", color: PURPLE },
  ch5: { title: "Ch 5: Dāna & Upavāsa", focus: "5-question medical screen, Saturday Śani vrata unification.", color: GREEN },
  ch6: { title: "Ch 6: Refusal & Capstone", focus: "6 refusal types, referral 4-factor test, no-prescription.", color: GOLD },
};

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

function Module21LiteracyBarArchitectureSvg({ selectedChapter }: { selectedChapter: ChapterKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Module 21 Prescription-Discipline Literacy Bar Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Reactive Malpractice Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="300" height="130" rx="8" fill="#FDF2F0" stroke={VERMILION} strokeWidth="1.5" />
        <text x="150" y="22" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">REACTIVE MALPRACTICE (&ldquo;SELL BLUE SAPPHIRE&rdquo;)</text>
        <text x="150" y="45" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">5 Malpractice Failures (§4.1)</text>
        <text x="150" y="65" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">1. Skips Indication  2. Ignores Mismatch</text>
        <text x="150" y="82" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">3. Bypasses Safety  4. No Honest Exit</text>
        <text x="150" y="99" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">5. Cheap Disclosure Cover</text>
        <text x="150" y="117" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">Client-Pleasing Malpractice</text>
      </g>

      {/* VS Separator */}
      <text x="340" y="95" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="600">VS</text>

      {/* Disciplined Literacy Bar Box */}
      <g transform="translate(355, 25)">
        <rect x="0" y="0" width="300" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="150" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">MODULE 21 DISCIPLINED LITERACY BAR</text>
        <text x="150" y="45" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">5 Pillars of Discipline (§4.3)</text>
        <text x="150" y="65" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• 5-Step Workflow & 2-Axis Indication</text>
        <text x="150" y="82" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• 4-Dimension Safety Screening</text>
        <text x="150" y="99" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• 6 Refusal Types & Honest Exit</text>
        <text x="150" y="117" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Disciplined Matching & Honest Refusal</text>
      </g>
    </svg>
  );
}

export function PrescriptionLiteracyBarWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("malpractice_contrast");
  const [selectedChapter, setSelectedChapter] = useState<ChapterKey>("ch6");

  const resetAll = () => {
    setActiveView("malpractice_contrast");
    setSelectedChapter("ch6");
  };

  return (
    <div data-interactive="the-prescription-discipline-literacy-bar" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 21 Capstone Literacy Bar Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The Prescription-Discipline Literacy Bar
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Separating disciplined, five-step, safety-screened prescription practice from reactive, client-pleasing malpractice — and recapping Module 21’s full 6-chapter arc.
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
            Reset View
          </button>
        </div>
      </section>

      {/* Vector Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Prescription-Discipline Literacy Bar Architecture (§4.1–§4.3)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Disciplined 5-Step Matching vs Reactive Client-Pleasing Malpractice</span>
        </div>
        <Module21LiteracyBarArchitectureSvg selectedChapter={selectedChapter} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("malpractice_contrast")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "malpractice_contrast" ? VERMILION : HAIRLINE}`,
                background: activeView === "malpractice_contrast" ? "#FDF2F0" : "transparent",
                color: activeView === "malpractice_contrast" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. 5 Failures of Malpractice (§4.1)
            </button>
            <button
              type="button"
              onClick={() => setActiveView("curriculum_arc")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "curriculum_arc" ? BLUE : HAIRLINE}`,
                background: activeView === "curriculum_arc" ? "#EBF3FA" : "transparent",
                color: activeView === "curriculum_arc" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Module 21 6-Chapter Arc (§4.2)
            </button>
            <button
              type="button"
              onClick={() => setActiveView("true_literacy_bar")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "true_literacy_bar" ? GREEN : HAIRLINE}`,
                background: activeView === "true_literacy_bar" ? "#E8F5E9" : "transparent",
                color: activeView === "true_literacy_bar" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. The True Literacy Bar (§4.3)
            </button>
          </div>

          {/* View 1: 5 Failures of Malpractice */}
          {activeView === "malpractice_contrast" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Skips the Indication Step
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Starts from desired sale/expectation and never runs the two-axis dignity x functional-role chart test.
                </p>
              </div>

              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Collapses Category-Mismatch
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Gives Blue Sapphire because client wants it, ignoring that Saturn is pacify-indicated and gem is strengthen-only.
                </p>
              </div>

              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  3. Treats Safety-Screening as an Obstacle
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Bypasses heat, hardness, allergen, and medical screening to avoid losing a sale.
                </p>
              </div>

              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  4. Cannot Report &ldquo;No Prescription Needed&rdquo;
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Measures success by selling something, making honest early exit impossible.
                </p>
              </div>

              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  5. Cheap Disclosure Cover
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Treats &ldquo;I told them I get 15% commission&rdquo; as cover for an unsound referral arrangement.
                </p>
              </div>
            </div>
          )}

          {/* View 2: Curriculum Arc Explorer */}
          {activeView === "curriculum_arc" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY }}>
                Click a chapter to explore what it added to the literacy bar:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.5rem" }}>
                {(Object.keys(CHAPTER_INFO) as ChapterKey[]).map((key) => {
                  const info = CHAPTER_INFO[key];
                  const isSelected = selectedChapter === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedChapter(key)}
                      style={{
                        padding: "0.5rem 0.6rem",
                        borderRadius: "0.4rem",
                        border: `1px solid ${isSelected ? info.color : HAIRLINE}`,
                        background: isSelected ? "#FDFAF2" : SURFACE,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "0.825rem", color: isSelected ? info.color : INK_PRIMARY, fontWeight: 600 }}>
                        {info.title.split(":")[0]}
                      </strong>
                    </button>
                  );
                })}
              </div>

              {/* Selected Chapter Box */}
              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${CHAPTER_INFO[selectedChapter].color}` }}>
                <strong style={{ color: CHAPTER_INFO[selectedChapter].color, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  {CHAPTER_INFO[selectedChapter].title}
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  {CHAPTER_INFO[selectedChapter].focus}
                </p>
              </div>
            </div>
          )}

          {/* View 3: The True Literacy Bar */}
          {activeView === "true_literacy_bar" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Disciplined Matching & Honest Refusal (§4.3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  The literacy bar is <strong>not a promise that every client leaves with an elaborate plan</strong>!
                  <br />
                  The bar is a <strong>discipline of matching, screening, and honest refusal</strong> — reporting &ldquo;no intervention indicated right now&rdquo; with the exact same honesty and rigor as delivering a 4-layer master plan.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Summary Card */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Trophy size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Module 21 Mastered! (§9)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>5-Step Workflow:</strong> Chart-state → Indication → Category → Safety → Deliverable.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>6 Refusal Types:</strong> Mismatch, Instance, Over-prescription, Cancellation, Contraindication, Scope.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Honest Exit:</strong> &ldquo;No prescription needed&rdquo; is a consumer-protective output.
              </li>
              <li>
                <strong>True Bar:</strong> Disciplined matching & refusal.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
