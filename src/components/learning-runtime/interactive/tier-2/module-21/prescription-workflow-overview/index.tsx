"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gem,
  Heart,
  Layers,
  Music,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type GrahaKey = "saturn" | "jupiter" | "sun" | "mercury";
type CategoryKey = "gem" | "mantra" | "dana" | "upavasa" | "puja";
type CommitmentKey = "fixedOrder" | "noActionValid" | "categoriesUnchanged";

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

const STEPS = [
  { title: "Chart-state", detail: "Sign, house, dignity, aspects, lordship, daśā activation — observation before interpretation." },
  { title: "Remedial indication", detail: "Strengthen a functional benefic that is under-delivering, pacify a malefic acting out, or record no action." },
  { title: "Category selection", detail: "Choose the seven categories that match the indicated direction, often in combination." },
  { title: "Safety-check", detail: "Screen gemstone, mantra, fasting, and conflict-of-interest conditions before anything is delivered." },
  { title: "Final prescription", detail: "Name the remedy, explain it, source it honestly, frame it as mitigation not cure, and document." },
];

const CATEGORIES: Record<CategoryKey, { label: string; icon: ReactNode; action: "strengthen" | "pacify"; color: string }> = {
  gem: { label: "Ratna (gemstone)", icon: <Gem size={15} aria-hidden="true" />, action: "strengthen", color: BLUE },
  mantra: { label: "Mantra", icon: <Music size={15} aria-hidden="true" />, action: "strengthen", color: GREEN },
  dana: { label: "Dāna (charity)", icon: <Heart size={15} aria-hidden="true" />, action: "pacify", color: PURPLE },
  upavasa: { label: "Upavāsa (fasting)", icon: <UtensilsCrossed size={15} aria-hidden="true" />, action: "pacify", color: VERMILION },
  puja: { label: "Pūjā / Vrata", icon: <Sparkles size={15} aria-hidden="true" />, action: "pacify", color: GOLD },
};

const GRAHAS: Record<GrahaKey, {
  label: string;
  devanagari: string;
  short: string;
  color: string;
  sign: string;
  house: number;
  dignity: string;
  lordship: string;
  state: "strengthen" | "pacify" | "no-action";
  stateReason: string;
  recommended: CategoryKey[];
  hazardous: CategoryKey[];
  safety: string[];
  prescription: string;
}> = {
  saturn: {
    label: "Saturn (Śani)",
    devanagari: "शनिः",
    short: "Sa",
    color: BLUE,
    sign: "Aries",
    house: 6,
    dignity: "Debilitated",
    lordship: "3rd, 4th",
    state: "pacify",
    stateReason: "Natural malefic, debilitated in a difficult house; rules a kendra but no trikoṇa, so it is not a functional benefic.",
    recommended: ["dana", "upavasa", "puja"],
    hazardous: ["gem"],
    safety: ["No gemstone — it would amplify the malefic", "Fasting screened for medical contraindications", "Charity recipient is appropriate"],
    prescription: "Pacify Saturn through Saturday discipline, Śani dāna, and structured appeasement — not a blue sapphire.",
  },
  jupiter: {
    label: "Jupiter (Guru)",
    devanagari: "गुरुः",
    short: "Ju",
    color: GOLD,
    sign: "Gemini",
    house: 8,
    dignity: "In enemy's sign",
    lordship: "2nd, 5th (trikoṇa)",
    state: "strengthen",
    stateReason: "Functional benefic through the 5th lordship, currently under-delivering from a difficult 8th-house placement.",
    recommended: ["gem", "mantra", "puja"],
    hazardous: [],
    safety: ["Gemstone heat, hardness, allergen and cost screening", "Mantra pronunciation and initiation eligibility verified"],
    prescription: "Strengthen Jupiter with yellow-sapphire consideration after full screening, plus Guru mantra — framed as mitigation, not cure.",
  },
  sun: {
    label: "Sun (Sūrya)",
    devanagari: "सूर्यः",
    short: "Su",
    color: VERMILION,
    sign: "Leo",
    house: 10,
    dignity: "Own sign",
    lordship: "10th",
    state: "no-action",
    stateReason: "Well-placed in own sign in the 10th; no remedial indication on first pass.",
    recommended: [],
    hazardous: [],
    safety: [],
    prescription: "No remedy indicated. Continue ordinary life practice and observation.",
  },
  mercury: {
    label: "Mercury (Budha)",
    devanagari: "बुधः",
    short: "Me",
    color: GREEN,
    sign: "Virgo",
    house: 11,
    dignity: "Exalted",
    lordship: "8th, 11th",
    state: "no-action",
    stateReason: "Exalted in Virgo in the 11th; strong and well-placed.",
    recommended: [],
    hazardous: [],
    safety: [],
    prescription: "No remedy indicated.",
  },
};

const COMMITMENTS: Record<CommitmentKey, { label: string; heldText: string; releasedText: string }> = {
  fixedOrder: {
    label: "Run the five steps in fixed order",
    heldText: "Held: chart-state → indication → category → safety → prescription, every time.",
    releasedText: "Warning: reversing the order lets client pressure or product profit drive the conclusion.",
  },
  noActionValid: {
    label: "Treat 'no remedy indicated' as a valid outcome",
    heldText: "Held: a chart with nine grahas will not usually need nine remedies.",
    releasedText: "Warning: universal-prescription tendency prescribes something for every graha to please the client.",
  },
  categoriesUnchanged: {
    label: "Remember T1-15 categories are unchanged — only authorization has changed",
    heldText: "Held: mantra is still mantra; ratna is still ratna. What is new is the workflow and the ethics it carries.",
    releasedText: "Warning: treating this module as teaching new remedy types misses that it teaches responsible application.",
  },
};

function WorkflowSvg({ activeStep }: { activeStep: number }) {
  const cy = 42;
  const startX = 50;
  const gap = 115;

  return (
    <svg width="100%" height="84" viewBox="0 0 560 84" style={{ maxWidth: 620, margin: "0.4rem auto 0.85rem", display: "block" }}>
      {STEPS.map((_, i) => {
        if (i === STEPS.length - 1) return null;
        const x1 = startX + i * gap;
        const x2 = startX + (i + 1) * gap;
        return (
          <line
            key={i}
            x1={x1}
            y1={cy}
            x2={x2}
            y2={cy}
            stroke={activeStep > i ? GOLD : HAIRLINE}
            strokeWidth={activeStep > i ? 4 : 2}
            strokeLinecap="round"
          />
        );
      })}
      {STEPS.map((step, i) => {
        const x = startX + i * gap;
        const isActive = i + 1 === activeStep;
        const isCompleted = activeStep > i + 1;
        return (
          <g key={step.title} style={{ cursor: "pointer" }}>
            <circle
              cx={x}
              cy={cy}
              r={isActive ? 20 : 14}
              fill={isActive ? GOLD : isCompleted ? `${GOLD}18` : "transparent"}
              stroke={isActive || isCompleted ? GOLD : HAIRLINE}
              strokeWidth={isActive ? 3 : 2}
            />
            <text
              x={x}
              y={cy + (isActive ? 5 : 4)}
              textAnchor="middle"
              fill={isActive ? "#fff" : isCompleted ? GOLD : INK_MUTED}
              fontSize={isActive ? 12 : 10}
              fontWeight={600}
            >
              {isCompleted ? <>&#10003;</> : i + 1}
            </text>
            <text x={x} y="78" textAnchor="middle" fill={isActive ? GOLD : INK_MUTED} fontSize="10" fontWeight={600}>
              {step.title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function PlanetSelector({ selected, onSelect }: { selected: GrahaKey; onSelect: (key: GrahaKey) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
      {(Object.keys(GRAHAS) as GrahaKey[]).map((key) => {
        const g = GRAHAS[key];
        const isSelected = selected === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              border: `1px solid ${isSelected ? g.color : HAIRLINE}`,
              borderRadius: 8,
              background: isSelected ? `${g.color}12` : "transparent",
              color: isSelected ? g.color : INK_SECONDARY,
              padding: "0.55rem 0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: g.color,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "#fff",
              }}
            >
              {g.short}
            </span>
            <span>{g.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function PrescriptionWorkflowOverview() {
  const [graha, setGraha] = useState<GrahaKey>("saturn");
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<Record<GrahaKey, CategoryKey[]>>({
    saturn: ["dana", "upavasa"],
    jupiter: ["gem", "mantra"],
    sun: [],
    mercury: [],
  });
  const [safetyChecks, setSafetyChecks] = useState<Record<GrahaKey, Record<string, boolean>>>({
    saturn: {},
    jupiter: {},
    mercury: {},
    sun: {},
  });
  const [commitments, setCommitments] = useState<Record<CommitmentKey, boolean>>({
    fixedOrder: true,
    noActionValid: true,
    categoriesUnchanged: true,
  });
  const [showPrescription, setShowPrescription] = useState(false);

  const g = GRAHAS[graha];

  const hazards = useMemo(() => {
    return selections[graha].filter((cat) => g.hazardous.includes(cat));
  }, [g.hazardous, graha, selections]);

  const hasHazard = hazards.length > 0;
  const isNoAction = g.state === "no-action";
  const allSafetyChecked = g.safety.length > 0 && g.safety.every((s) => safetyChecks[graha][s]);

  function reset() {
    setGraha("saturn");
    setStep(1);
    setSelections({
      saturn: ["dana", "upavasa"],
      jupiter: ["gem", "mantra"],
      sun: [],
      mercury: [],
    });
    setSafetyChecks({ saturn: {}, jupiter: {}, mercury: {}, sun: {} });
    setCommitments({ fixedOrder: true, noActionValid: true, categoriesUnchanged: true });
    setShowPrescription(false);
  }

  function selectGraha(key: GrahaKey) {
    setGraha(key);
    setStep(1);
    setShowPrescription(false);
  }

  function toggleCategory(cat: CategoryKey) {
    setSelections((prev) => {
      const current = prev[graha];
      const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
      return { ...prev, [graha]: next };
    });
    setShowPrescription(false);
  }

  function toggleSafety(check: string) {
    setSafetyChecks((prev) => ({
      ...prev,
      [graha]: { ...prev[graha], [check]: !prev[graha][check] },
    }));
  }

  const allCommitmentsHeld = Object.values(commitments).every(Boolean);

  return (
    <div data-interactive="prescription-workflow-overview" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 21 · Prescription workflow</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Chart-state → Indication → Category → Safety → Prescription
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk Rohan Mehta&apos;s grahas through the five-step prescription discipline, and see why the fixed order matters.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Five-step pipeline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          {STEPS[step - 1].title}
        </h3>
        <WorkflowSvg activeStep={step} />
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{STEPS[step - 1].detail}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button type="button" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} style={buttonStyle(false, GOLD)}>
            <ChevronLeft size={15} aria-hidden="true" /> Previous
          </button>
          <button type="button" disabled={step === STEPS.length} onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))} style={buttonStyle(false, GOLD)}>
            Next <ChevronRight size={15} aria-hidden="true" />
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Rohan&apos;s graha</p>
          <h3 style={{ margin: "0.15rem 0 0", color: g.color, fontSize: "1.2rem", fontWeight: 600 }}>
            {g.label} · {g.devanagari}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
            <MiniFact icon={<Activity size={16} />} title="Sign" body={g.sign} color={BLUE} />
            <MiniFact icon={<Layers size={16} />} title="House" body={`${g.house}th`} color={PURPLE} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Dignity" body={g.dignity} color={GREEN} />
            <MiniFact icon={<Sparkles size={16} />} title="Lordship" body={g.lordship} color={GOLD} />
          </div>

          <div style={{ marginTop: "1rem" }}>
            {step === 1 && (
              <div style={{ display: "grid", gap: "0.55rem" }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  The first step is pure observation. For {g.label.split(" ")[0]}, note the sign, house, dignity, lordship, and activation before deciding anything.
                </p>
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${g.color}0F`, border: `1px solid ${g.color}44`, color: INK_SECONDARY, lineHeight: 1.5 }}>
                  {g.sign}, {g.house}th house, {g.dignity}, lord of {g.lordship}.
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "grid", gap: "0.65rem" }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>Given the chart-state, the remedial direction is:</p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 0.85rem",
                    borderRadius: 8,
                    background: g.state === "strengthen" ? `${GREEN}12` : g.state === "pacify" ? `${VERMILION}12` : `${INK_MUTED}12`,
                    border: `1px solid ${g.state === "strengthen" ? GREEN : g.state === "pacify" ? VERMILION : HAIRLINE}`,
                    color: g.state === "strengthen" ? GREEN : g.state === "pacify" ? VERMILION : INK_MUTED,
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  {g.state === "strengthen" ? "STRENGTHEN" : g.state === "pacify" ? "PACIFY" : "NO ACTION INDICATED"}
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{g.stateReason}</p>
              </div>
            )}

            {step === 3 && !isNoAction && (
              <div style={{ display: "grid", gap: "0.65rem" }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>Select the categories that match the indicated direction. Hazardous choices are flagged immediately.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => {
                    const selected = selections[graha].includes(cat);
                    const hazardous = g.hazardous.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleCategory(cat)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          border: `1px solid ${selected ? (hazardous ? VERMILION : CATEGORIES[cat].color) : HAIRLINE}`,
                          borderRadius: 8,
                          background: selected ? (hazardous ? `${VERMILION}12` : `${CATEGORIES[cat].color}12`) : "transparent",
                          color: selected ? (hazardous ? VERMILION : CATEGORIES[cat].color) : INK_SECONDARY,
                          padding: "0.55rem 0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {CATEGORIES[cat].icon}
                        {CATEGORIES[cat].label}
                        {selected && hazardous && <AlertTriangle size={14} aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
                {hasHazard && (
                  <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55`, color: VERMILION, lineHeight: 1.5 }}>
                    <strong style={{ fontWeight: 600 }}>Safety warning:</strong> {hazards.map((h) => CATEGORIES[h].label).join(", ")} {hazards.length === 1 ? "is" : "are"} hazardous for {g.label.split(" ")[0]} because {g.state === "pacify" ? "strengthening a malefic amplifies the harm." : "it does not fit the indicated direction."}
                  </div>
                )}
              </div>
            )}

            {step === 3 && isNoAction && (
              <div style={{ padding: "0.75rem", borderRadius: 8, background: `${INK_MUTED}10`, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
                No remedy category is indicated. A workflow that only ever produces prescriptions has stopped being a diagnostic tool.
              </div>
            )}

            {step === 4 && !isNoAction && (
              <div style={{ display: "grid", gap: "0.65rem" }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>Confirm the safety checks for the selected categories before delivering any prescription.</p>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {g.safety.map((check) => (
                    <button
                      key={check}
                      type="button"
                      aria-pressed={safetyChecks[graha][check]}
                      onClick={() => toggleSafety(check)}
                      style={togglePanelStyle(safetyChecks[graha][check], safetyChecks[graha][check] ? GREEN : GOLD)}
                    >
                      {safetyChecks[graha][check] ? <CheckCircle2 size={16} aria-hidden="true" /> : <ShieldAlert size={16} aria-hidden="true" />}
                      <span>{check}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && isNoAction && (
              <div style={{ padding: "0.75rem", borderRadius: 8, background: `${INK_MUTED}10`, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
                No safety-check is needed when no remedy is indicated.
              </div>
            )}

            {step === 5 && (
              <div style={{ display: "grid", gap: "0.65rem" }}>
                <button type="button" onClick={() => setShowPrescription((v) => !v)} style={buttonStyle(showPrescription, GOLD)}>
                  {showPrescription ? "Hide prescription" : "Show final prescription"}
                </button>
                {showPrescription ? (
                  <div style={{ padding: "0.85rem", borderRadius: 8, background: `${g.state === "no-action" ? INK_MUTED : g.state === "strengthen" ? GREEN : VERMILION}10`, border: `1px solid ${g.state === "no-action" ? HAIRLINE : g.state === "strengthen" ? GREEN : VERMILION}55`, color: INK_SECONDARY, lineHeight: 1.6 }}>
                    {hasHazard ? (
                      <span style={{ color: VERMILION, fontWeight: 600 }}>Prescription blocked.</span>
                    ) : !allSafetyChecked && !isNoAction ? (
                      <span style={{ color: GOLD, fontWeight: 600 }}>Complete the safety-checks before delivering the prescription.</span>
                    ) : (
                      g.prescription
                    )}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: INK_MUTED, lineHeight: 1.55 }}>Reveal the disciplined final statement a practitioner would deliver for this graha.</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px", alignContent: "start" }}>
          <Panel title="Select a graha" icon={<Activity size={18} />} color={g.color}>
            <PlanetSelector selected={graha} onSelect={selectGraha} />
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.9rem" }}>
              Compare Saturn (pacify), Jupiter (strengthen), and the two grahas that need no action.
            </p>
          </Panel>

          <Panel title="Quick jump" icon={<Layers size={18} />} color={GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {STEPS.map((s, i) => (
                <button key={s.title} type="button" aria-pressed={step === i + 1} onClick={() => setStep(i + 1)} style={smallChipStyle(step === i + 1, GOLD)}>
                  {i + 1}. {s.title}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Common misreadings of the workflow
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
            ? "All discipline commitments are held. The workflow protects both practitioner and client."
            : `${Object.keys(COMMITMENTS).length - Object.values(commitments).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Gate doctrine</p>
        <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem", fontWeight: 600 }}>
          Why this module reopens what T1-15 closed
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          T1-15 15.6.3 closed by naming this exact module as the gate where prescription becomes authorized. That authorization required both T1-15 (theory) and T1-24 (ethics). The five-step workflow is the operational form those ethics take once they have to be applied to a specific chart.
        </p>
      </section>
    </div>
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

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
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
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
