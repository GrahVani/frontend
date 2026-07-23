"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Headphones,
  HelpCircle,
  Layers,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Volume2,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = "step1_2" | "step3" | "step4" | "step5";
type RationaleMode = "accessible" | "jargon";
type MandalaMode = "checkpoint" | "outcome";
type LayerKey = "guru_mantra" | "yellow_sapphire" | "saturn_dana" | "saturn_upavasa";

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

const STEPS: Record<StepKey, { title: string; subtitle: string; icon: ReactNode; color: string }> = {
  step1_2: {
    title: "Steps 1–2: Chart-State → Indication",
    subtitle: "5th-house trikoṇa lord Jupiter in enemy sign, Antardaśā-active → Strengthen (timely)",
    icon: <Sparkles size={16} aria-hidden="true" />,
    color: BLUE,
  },
  step3: {
    title: "Step 3: Category & Mantra Selection",
    subtitle: "Resonance family → Cheaper/simplest-first → Oṁ Bṛhaspataye Namaḥ",
    icon: <Layers size={16} aria-hidden="true" />,
    color: PURPLE,
  },
  step4: {
    title: "Step 4: Safety-Check (Both Halves)",
    subtitle: "Teach-back pronunciation verified + Open namaskāra form cleared",
    icon: <ShieldCheck size={16} aria-hidden="true" />,
    color: GREEN,
  },
  step5: {
    title: "Step 5: Final Prescription Deliverable",
    subtitle: "Four-part document written out with accessible rationale & review checkpoint",
    icon: <FileCheck2 size={16} aria-hidden="true" />,
    color: GOLD,
  },
};

const REMEDY_LAYERS: Record<LayerKey, { name: string; category: string; status: "finished" | "open"; resolvedIn: string; color: string; detail: string }> = {
  guru_mantra: {
    name: "Guru Mantra",
    category: "Resonance (Mantra)",
    status: "finished",
    resolvedIn: "Module 21, Chapter 2 (Lesson 21.2.4)",
    color: GREEN,
    detail: "Oṁ Bṛhaspataye Namaḥ — all 4 safety stages cleared and Step-5 prescription written out in full.",
  },
  yellow_sapphire: {
    name: "Yellow Sapphire",
    category: "Resonance (Gemstone)",
    status: "open",
    resolvedIn: "Module 21, Chapter 3 (Gemstone prescription)",
    color: GOLD,
    detail: "Category confirmed as secondary strengthener; full safety-check (heat, hardness, ethics, cost) pending.",
  },
  saturn_dana: {
    name: "Saturn Dāna",
    category: "Pacification (Charity)",
    status: "open",
    resolvedIn: "Module 21, Chapter 5 (Dāna & Upavāsa screening)",
    color: PURPLE,
    detail: "Category confirmed for leading Saturn affliction; practical screening and recipient ethics pending.",
  },
  saturn_upavasa: {
    name: "Saturn Upavāsa",
    category: "Pacification (Fasting)",
    status: "open",
    resolvedIn: "Module 21, Chapter 5 (Dāna & Upavāsa screening)",
    color: BLUE,
    detail: "Category confirmed as secondary pacifier; medical contraindication screening pending.",
  },
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

function PrescriptionWorkflowSvg({ activeStep, onSelectStep }: { activeStep: StepKey; onSelectStep: (step: StepKey) => void }) {
  return (
    <svg viewBox="0 0 680 160" role="img" aria-label="Prescription Workflow Architecture" style={{ width: "100%", maxHeight: 180, margin: "0.4rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="140" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Step 1-2 Box */}
      <g transform="translate(25, 25)" onClick={() => onSelectStep("step1_2")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="135" height="110" rx="8" fill={activeStep === "step1_2" ? "#EBF3FA" : "#FFF"} stroke={BLUE} strokeWidth={activeStep === "step1_2" ? 2.5 : 1} />
        <text x="67" y="25" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">STEPS 1–2</text>
        <text x="67" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Chart State</text>
        <text x="67" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Strengthen (Ju)</text>
        <text x="67" y="92" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Inspect</text>
      </g>

      <path d="M 167 80 L 182 80" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="3 3" />

      {/* Step 3 Box */}
      <g transform="translate(187, 25)" onClick={() => onSelectStep("step3")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="135" height="110" rx="8" fill={activeStep === "step3" ? "#F5F2FC" : "#FFF"} stroke={PURPLE} strokeWidth={activeStep === "step3" ? 2.5 : 1} />
        <text x="67" y="25" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="600">STEP 3</text>
        <text x="67" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Category</text>
        <text x="67" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Resonance (Mantra)</text>
        <text x="67" y="92" textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight="600">Inspect</text>
      </g>

      <path d="M 329 80 L 344 80" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="3 3" />

      {/* Step 4 Box */}
      <g transform="translate(349, 25)" onClick={() => onSelectStep("step4")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="135" height="110" rx="8" fill={activeStep === "step4" ? "#E8F5E9" : "#FFF"} stroke={GREEN} strokeWidth={activeStep === "step4" ? 2.5 : 1} />
        <text x="67" y="25" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="600">STEP 4</text>
        <text x="67" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Safety Check</text>
        <text x="67" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Both Halves Cleared</text>
        <text x="67" y="92" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Inspect</text>
      </g>

      <path d="M 491 80 L 506 80" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="3 3" />

      {/* Step 5 Box */}
      <g transform="translate(511, 25)" onClick={() => onSelectStep("step5")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="145" height="110" rx="8" fill={activeStep === "step5" ? "#FFF8E1" : "#FFF"} stroke={GOLD} strokeWidth={activeStep === "step5" ? 2.5 : 1} />
        <text x="72" y="25" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="600">STEP 5 DELIVERABLE</text>
        <text x="72" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Prescription</text>
        <text x="72" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">4 Required Parts</text>
        <text x="72" y="92" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">Inspect</text>
      </g>
    </svg>
  );
}

export function WorkedExampleMantraPrescriptionWorkbench() {
  const [activeStep, setActiveStep] = useState<StepKey>("step5");
  const [rationaleMode, setRationaleMode] = useState<RationaleMode>("accessible");
  const [mandalaMode, setMandalaMode] = useState<MandalaMode>("checkpoint");
  const [activeLayer, setActiveLayer] = useState<LayerKey>("guru_mantra");

  const resetAll = () => {
    setActiveStep("step5");
    setRationaleMode("accessible");
    setMandalaMode("checkpoint");
    setActiveLayer("guru_mantra");
  };

  return (
    <div data-interactive="worked-example-mantra-prescription-with-pronunciation-verification" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Worked Example & Step 5 Deliverable Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Rohan’s Guru Mantra: Retracing the Chain to a Finished Prescription
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Closing Chapter 2 by synthesizing all four previous lessons: retracing Rohan’s Jupiter case end-to-end and constructing the 4-part Step 5 prescription deliverable with a 40-day maṇḍala review checkpoint.
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

      {/* SVG Pipeline Navigation */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Prescription Workflow Architecture</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Click any step box below to inspect its logic and output</span>
        </div>
        <PrescriptionWorkflowSvg activeStep={activeStep} onSelectStep={setActiveStep} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Step Details & Deliverable Builder */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ color: STEPS[activeStep].color }}>{STEPS[activeStep].icon}</div>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: STEPS[activeStep].color }}>
                {STEPS[activeStep].title}
              </h3>
            </div>
            <span style={{ fontSize: "0.8rem", background: "#FDFAF2", border: `1px solid ${HAIRLINE}`, borderRadius: "0.4rem", padding: "0.2rem 0.6rem", color: INK_SECONDARY }}>
              Rohan’s Case File
            </span>
          </div>

          <p style={{ margin: "0 0 1.25rem", color: INK_SECONDARY, fontSize: "0.925rem", lineHeight: 1.55 }}>
            {STEPS[activeStep].subtitle}
          </p>

          {/* Active Step Specific Content */}
          {activeStep === "step1_2" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FAF5E8", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ display: "block", color: BLUE, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Chart-State Evaluation
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, fontSize: "0.875rem", lineHeight: 1.5 }}>
                  <li><strong>House rulership:</strong> Jupiter rules 5th house (trikoṇa lord = functional benefic).</li>
                  <li><strong>Sign placement:</strong> Sits in enemy sign (weak, but not debilitated).</li>
                  <li><strong>Activation status:</strong> Currently holds Antardaśā-lord status.</li>
                </ul>
              </div>

              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ display: "block", color: GREEN, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Two-Axis Indication Result
                </strong>
                <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.875rem", lineHeight: 1.5 }}>
                  Functional-benefic × weak → <strong>STRENGTHEN</strong>. Antardaśā activation marks it as <strong>TIMELY</strong> (Lesson 21.1.2 §4.4).
                </p>
              </div>
            </div>
          )}

          {activeStep === "step3" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FAF5E8", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ display: "block", color: PURPLE, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Category & Cost Sequencing
                </strong>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.875rem", lineHeight: 1.5 }}>
                  Strengthen-direction routes to the <strong>resonance family</strong> (mantra, yantra, ratna). Cheaper-first and simplest-first sequencing puts mantra ahead of a gemstone (Lesson 21.1.3 §4.5).
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ display: "block", color: GOLD, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Navagraha Table Match
                </strong>
                <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.875rem", lineHeight: 1.5 }}>
                  Jupiter matches to the standard devotional salutation form: <strong>Oṁ Bṛhaspataye Namaḥ</strong> (Lesson 21.2.1 §4.4).
                </p>
              </div>
            </div>
          )}

          {activeStep === "step4" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ display: "block", color: GREEN, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Halves 1 & 2 Cleared
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: INK_PRIMARY, fontSize: "0.875rem", lineHeight: 1.5 }}>
                  <li><strong>Pronunciation:</strong> Teach-back method applied; Rohan’s reproduction stable across two attempts with audio resource provided (Lesson 21.2.2).</li>
                  <li><strong>Contraindications:</strong> Open namaskāra form, no purity/time barrier, no medical concerns (Lesson 21.2.3).</li>
                </ul>
              </div>
            </div>
          )}

          {activeStep === "step5" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem" }}>
                <p style={EYEBROW_STYLE}>The 4 Required Deliverable Parts (§4.2)</p>
              </div>

              {/* Part 1: Mantra & Audio */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600 }}>1. The Mantra & Audio Resource</strong>
                  <span style={{ fontSize: "0.75rem", color: GREEN, background: "#E8F5E9", padding: "0.15rem 0.5rem", borderRadius: "0.25rem" }}>Verified</span>
                </div>
                <p style={{ margin: "0.4rem 0 0", fontSize: "1.05rem", color: INK_PRIMARY, fontFamily: "serif" }}>
                  Oṁ Bṛhaspataye Namaḥ
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.4rem", fontSize: "0.8rem", color: INK_MUTED }}>
                  <Headphones size={14} /> Audio track attached for daily reference self-correction
                </div>
              </div>

              {/* Part 2: Rationale Toggle */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600 }}>2. Rationale Language</strong>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <button
                      type="button"
                      onClick={() => setRationaleMode("accessible")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${rationaleMode === "accessible" ? BLUE : HAIRLINE}`,
                        background: rationaleMode === "accessible" ? BLUE : "transparent",
                        color: rationaleMode === "accessible" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Accessible (Correct)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRationaleMode("jargon")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${rationaleMode === "jargon" ? VERMILION : HAIRLINE}`,
                        background: rationaleMode === "jargon" ? VERMILION : "transparent",
                        color: rationaleMode === "jargon" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Chart Jargon (Avoid)
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "0.6rem", padding: "0.75rem", background: rationaleMode === "accessible" ? "#EBF3FA" : "#FDF2F0", borderRadius: "0.4rem", borderLeft: `3px solid ${rationaleMode === "accessible" ? BLUE : VERMILION}` }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    {rationaleMode === "accessible" ? (
                      <span>
                        &ldquo;Jupiter, in your chart, governs the area of creative and expansive growth your 5th house represents — the stalled project you mentioned. Jupiter is capable in your chart but currently under-supported. This mantra is a support practice aimed at that specific area, not a general-purpose fix.&rdquo;
                      </span>
                    ) : (
                      <span>
                        &ldquo;Your 5th lord Jupiter is a functional trikoṇa-lord placed in an enemy sign holding Antardaśā status, requiring a resonance strengthener under cheap-first rules.&rdquo; (Opaque to client!)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Part 3: Practice Discipline & Maṇḍala Checkpoint */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600 }}>3. Practice Discipline & Review Point</strong>
                  <button
                    type="button"
                    onClick={() => setMandalaMode(mandalaMode === "checkpoint" ? "outcome" : "checkpoint")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.2rem 0.5rem",
                      fontSize: "0.75rem",
                      borderRadius: "0.25rem",
                      border: `1px solid ${HAIRLINE}`,
                      background: SURFACE,
                      color: INK_SECONDARY,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    {mandalaMode === "checkpoint" ? <ToggleLeft size={16} color={GREEN} /> : <ToggleRight size={16} color={VERMILION} />}
                    <span>{mandalaMode === "checkpoint" ? "Checkpoint Mode" : "Results Claim (Mistake)"}</span>
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", margin: "0.6rem 0" }}>
                  <div style={{ background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Daily Count (Mala)</span>
                    <strong style={{ color: PURPLE, fontSize: "0.95rem", fontWeight: 600 }}>108 Repetitions</strong>
                  </div>
                  <div style={{ background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Review Cycle (Maṇḍala)</span>
                    <strong style={{ color: PURPLE, fontSize: "0.95rem", fontWeight: 600 }}>40-Day Checkpoint</strong>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "0.825rem", color: mandalaMode === "checkpoint" ? INK_SECONDARY : VERMILION, lineHeight: 1.45 }}>
                  {mandalaMode === "checkpoint" ? (
                    <span><strong>Pedagogical doctrine:</strong> The 40-day maṇḍala is a practice-management review checkpoint (&ldquo;how is this going?&rdquo;), giving a natural point to adjust or conclude rather than running indefinitely by default.</span>
                  ) : (
                    <span><strong>Common Mistake #3:</strong> Treating 40 days as a promised results-timeline (&ldquo;you will see changes in 40 days&rdquo;) false-precision claim. Avoid this!</span>
                  )}
                </p>
              </div>

              {/* Part 4: Mitigation Framing */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  4. Mitigation-Not-Cure Framing
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  Restating T1-15 foundational doctrine: This practice is a support and mitigation measure, not a guaranteed or magical fix, and does not replace Rohan&apos;s own active effort on his stalled creative project.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Remedy Layers Status Panel */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Layers size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Rohan’s 4 Remedy Layers Tracker</p>
            </div>
            <p style={{ margin: "0 0 0.85rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Honest reporting of open layers (§4.4): 1 layer finished, 3 honestly open. Click to inspect where each layer resolves.
            </p>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.keys(REMEDY_LAYERS) as LayerKey[]).map((key) => {
                const layer = REMEDY_LAYERS[key];
                const isSelected = activeLayer === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveLayer(key)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "0.4rem",
                      border: `1px solid ${isSelected ? layer.color : HAIRLINE}`,
                      background: isSelected ? "#FDFAF2" : SURFACE,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 500 }}>
                        {layer.name}
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>{layer.category}</span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.725rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "0.25rem",
                        fontWeight: 600,
                        background: layer.status === "finished" ? "#E8F5E9" : "#FFF8E1",
                        color: layer.status === "finished" ? GREEN : GOLD,
                        border: `1px solid ${layer.status === "finished" ? GREEN : GOLD}`,
                      }}
                    >
                      {layer.status === "finished" ? "FINISHED" : "OPEN"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Layer Details Card */}
          <div style={{ ...CARD_STYLE, borderLeft: `4px solid ${REMEDY_LAYERS[activeLayer].color}` }}>
            <span style={{ ...EYEBROW_STYLE, color: REMEDY_LAYERS[activeLayer].color }}>Selected Layer Details</span>
            <h4 style={{ margin: "0.2rem 0 0.4rem", fontSize: "1rem", fontWeight: 600, color: INK_PRIMARY }}>
              {REMEDY_LAYERS[activeLayer].name}
            </h4>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              {REMEDY_LAYERS[activeLayer].detail}
            </p>
            <div style={{ fontSize: "0.775rem", color: INK_MUTED, borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.4rem" }}>
              <strong>Resolved in:</strong> {REMEDY_LAYERS[activeLayer].resolvedIn}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
