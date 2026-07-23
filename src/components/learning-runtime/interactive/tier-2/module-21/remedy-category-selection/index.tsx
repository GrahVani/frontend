"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Gem,
  Heart,
  Layers,
  Music,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Direction = "strengthen" | "pacify";
type CategoryKey = "mantra" | "yantra" | "ratna" | "dana" | "upavasa" | "puja";
type CostLevel = "low" | "medium" | "high";
type DepthLevel = "simple" | "moderate" | "deep";

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

const COST_ORDER: Record<CostLevel, number> = { low: 0, medium: 1, high: 2 };
const DEPTH_ORDER: Record<DepthLevel, number> = { simple: 0, moderate: 1, deep: 2 };

const CATEGORIES: Record<CategoryKey, {
  label: string;
  family: "resonance" | "appeasement";
  mechanism: string;
  cost: CostLevel;
  depth: DepthLevel;
  icon: ReactNode;
  color: string;
}> = {
  mantra: { label: "Mantra", family: "resonance", mechanism: "Sound vibration that amplifies the graha's signal.", cost: "low", depth: "simple", icon: <Music size={18} aria-hidden="true" />, color: GREEN },
  yantra: { label: "Yantra", family: "resonance", mechanism: "Geometric resonance, once consecrated, amplifies the graha.", cost: "medium", depth: "moderate", icon: <Layers size={18} aria-hidden="true" />, color: GOLD },
  ratna: { label: "Ratna (gemstone)", family: "resonance", mechanism: "Gemstone resonance amplifies the graha's rays.", cost: "high", depth: "deep", icon: <Gem size={18} aria-hidden="true" />, color: VERMILION },
  dana: { label: "Dāna (charity)", family: "appeasement", mechanism: "Charitable giving appeases without amplifying.", cost: "low", depth: "simple", icon: <Heart size={18} aria-hidden="true" />, color: BLUE },
  upavasa: { label: "Upavāsa (fasting)", family: "appeasement", mechanism: "Disciplined restraint soothes the graha's energy.", cost: "low", depth: "moderate", icon: <Sparkles size={18} aria-hidden="true" />, color: PURPLE },
  puja: { label: "Pūjā / Vrata", family: "appeasement", mechanism: "Worship or vow supports through attentive conduct.", cost: "medium", depth: "deep", icon: <ShieldCheck size={18} aria-hidden="true" />, color: BLUE },
};

const CASES = [
  {
    key: "saturn",
    title: "Rohan's Saturn — pacify",
    direction: "pacify" as Direction,
    plan: ["dana", "upavasa"] as CategoryKey[],
    note: "Dāna leads (simplest, cheapest), Upavāsa layers second. No ratna ever for this functional malefic.",
  },
  {
    key: "jupiter",
    title: "Rohan's Jupiter — strengthen",
    direction: "strengthen" as Direction,
    plan: ["mantra", "ratna"] as CategoryKey[],
    note: "Guru mantra leads (simplest, cheapest), yellow sapphire layers second only after safety-check clears it.",
  },
];

function FamilyDiagram({ direction }: { direction: Direction }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 220" style={{ maxWidth: 360 }}>
      <rect x={140} y={20} width={80} height={36} rx={8} fill={direction === "strengthen" ? `${GREEN}18` : `${BLUE}18`} stroke={direction === "strengthen" ? GREEN : BLUE} strokeWidth={2} />
      <text x={180} y={43} fontSize={12} fill={direction === "strengthen" ? GREEN : BLUE} fontWeight={600} textAnchor="middle">
        {direction === "strengthen" ? "Strengthen" : "Pacify"}
      </text>

      <line x1={180} y1={56} x2={180} y2={90} stroke={HAIRLINE} strokeWidth={2} />

      <line x1={180} y1={90} x2={90} y2={130} stroke={HAIRLINE} strokeWidth={2} />
      <line x1={180} y1={90} x2={270} y2={130} stroke={HAIRLINE} strokeWidth={2} />

      <rect x={20} y={130} width={140} height={40} rx={8} fill={direction === "strengthen" ? `${GREEN}10` : "transparent"} stroke={direction === "strengthen" ? GREEN : HAIRLINE} strokeWidth={2} />
      <text x={90} y={148} fontSize={11} fill={direction === "strengthen" ? GREEN : INK_MUTED} fontWeight={600} textAnchor="middle">Resonance-based</text>
      <text x={90} y={163} fontSize={9} fill={direction === "strengthen" ? GREEN : INK_MUTED} textAnchor="middle">amplify</text>

      <rect x={200} y={130} width={140} height={40} rx={8} fill={direction === "pacify" ? `${BLUE}10` : "transparent"} stroke={direction === "pacify" ? BLUE : HAIRLINE} strokeWidth={2} />
      <text x={270} y={148} fontSize={11} fill={direction === "pacify" ? BLUE : INK_MUTED} fontWeight={600} textAnchor="middle">Appeasement-based</text>
      <text x={270} y={163} fontSize={9} fill={direction === "pacify" ? BLUE : INK_MUTED} textAnchor="middle">appease without amplifying</text>

      <text x={180} y={200} fontSize={10} fill={INK_MUTED} textAnchor="middle">
        Tantra is excluded from this module&apos;s direct-prescription toolkit
      </text>
    </svg>
  );
}

export function RemedyCategorySelection() {
  const [direction, setDirection] = useState<Direction>("strengthen");
  const [plan, setPlan] = useState<CategoryKey[]>(["mantra"]);
  const [cheaperFirst, setCheaperFirst] = useState(true);
  const [simplestFirst, setSimplestFirst] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  const familyForDirection = direction === "strengthen" ? "resonance" : "appeasement";
  const familyColor = direction === "strengthen" ? GREEN : BLUE;
  const familyLabel = direction === "strengthen" ? "resonance-based" : "appeasement-based";

  const planValid = useMemo(() => {
    return plan.every((key) => CATEGORIES[key].family === familyForDirection);
  }, [plan, familyForDirection]);

  const sequencingOk = useMemo(() => {
    if (plan.length < 2) return true;
    const costs = plan.map((k) => COST_ORDER[CATEGORIES[k].cost]);
    const depths = plan.map((k) => DEPTH_ORDER[CATEGORIES[k].depth]);
    const costOk = !cheaperFirst || costs.every((v, i) => i === 0 || v >= costs[i - 1]);
    const depthOk = !simplestFirst || depths.every((v, i) => i === 0 || v >= depths[i - 1]);
    return costOk && depthOk;
  }, [plan, cheaperFirst, simplestFirst]);

  function addCategory(key: CategoryKey) {
    const cat = CATEGORIES[key];
    if (cat.family !== familyForDirection) {
      setWarning(`Cannot add ${cat.label} to a ${direction} plan. It is ${cat.family === "resonance" ? "resonance-based" : "appeasement-based"}.`);
      return;
    }
    if (plan.includes(key)) {
      setWarning(`${cat.label} is already in the plan.`);
      return;
    }
    setWarning(null);
    setPlan((prev) => [...prev, key]);
  }

  function removeCategory(index: number) {
    setPlan((prev) => prev.filter((_, i) => i !== index));
    setWarning(null);
  }

  function loadCase(c: typeof CASES[number]) {
    setDirection(c.direction);
    setPlan([...c.plan]);
    setWarning(null);
  }

  function reset() {
    setDirection("strengthen");
    setPlan(["mantra"]);
    setCheaperFirst(true);
    setSimplestFirst(true);
    setWarning(null);
  }

  return (
    <div data-interactive="remedy-category-selection" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 21 · Chapter 1</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Remedy category selection
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Turn a remedial direction into a sequenced category plan using the family mapping and the two sequencing disciplines.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 380px" }}>
          <p style={eyebrowStyle}>Direction → family</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Choose the direction first
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.65rem" }}>
            <button type="button" aria-pressed={direction === "strengthen"} onClick={() => { setDirection("strengthen"); setPlan([]); setWarning(null); }} style={chipStyle(direction === "strengthen", GREEN)}>
              Strengthen
            </button>
            <button type="button" aria-pressed={direction === "pacify"} onClick={() => { setDirection("pacify"); setPlan([]); setWarning(null); }} style={chipStyle(direction === "pacify", BLUE)}>
              Pacify
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <FamilyDiagram direction={direction} />
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 380px" }}>
          <p style={eyebrowStyle}>Current plan</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            {plan.length === 0 ? "No categories selected" : "Sequenced plan"}
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {plan.length === 0 ? (
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px dashed ${HAIRLINE}`, color: INK_MUTED, textAlign: "center" }}>
                Select a category below.
              </div>
            ) : (
              plan.map((key, index) => {
                const cat = CATEGORIES[key];
                return (
                  <div key={`${key}-${index}`} style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.65rem", borderRadius: 8, border: `1px solid ${cat.color}55`, background: `${cat.color}10` }}>
                    <span style={{ color: cat.color, fontWeight: 700, fontSize: "0.85rem" }}>#{index + 1}</span>
                    <span style={{ color: INK_PRIMARY, fontWeight: 600, flex: 1 }}>{cat.label}</span>
                    <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{cat.cost} · {cat.depth}</span>
                    <button type="button" aria-label={`Remove ${cat.label}`} onClick={() => removeCategory(index)} style={{ ...buttonStyle(false, VERMILION), padding: "0.35rem" }}>
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          {warning && (
            <div style={{ marginTop: "0.65rem", padding: "0.65rem 0.85rem", borderRadius: 8, background: `${VERMILION}12`, border: `1px solid ${VERMILION}55`, color: VERMILION, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={16} aria-hidden="true" />
              <span>{warning}</span>
            </div>
          )}
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              background: planValid && sequencingOk ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${planValid && sequencingOk ? GREEN : VERMILION}55`,
              color: planValid && sequencingOk ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {planValid && sequencingOk
              ? "Plan matches direction and sequencing disciplines."
              : planValid
                ? "Plan matches direction but violates a sequencing discipline."
                : "Plan includes a category from the wrong family for the selected direction."}
          </div>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Available categories</p>
          <h3 style={{ margin: "0.15rem 0 0", color: familyColor, fontSize: "1.15rem", fontWeight: 600 }}>
            {familyLabel} family for {direction}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem", marginTop: "0.65rem" }}>
            {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
              const cat = CATEGORIES[key];
              const matchesDirection = cat.family === familyForDirection;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!matchesDirection}
                  onClick={() => addCategory(key)}
                  style={{
                    ...cardStyle,
                    textAlign: "left",
                    cursor: matchesDirection ? "pointer" : "not-allowed",
                    opacity: matchesDirection ? 1 : 0.5,
                    borderColor: matchesDirection ? cat.color : HAIRLINE,
                    background: matchesDirection ? `${cat.color}08` : SURFACE,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: matchesDirection ? cat.color : INK_MUTED }}>
                    {cat.icon}
                    <span style={{ fontWeight: 600 }}>{cat.label}</span>
                    {matchesDirection && <Plus size={14} aria-hidden="true" />}
                  </div>
                  <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>
                    {cat.mechanism}
                  </p>
                  <div style={{ marginTop: "0.45rem", display: "flex", gap: "0.35rem", fontSize: "0.7rem", color: INK_MUTED }}>
                    <span style={{ padding: "0.15rem 0.35rem", borderRadius: 4, border: `1px solid ${HAIRLINE}` }}>{cat.cost}</span>
                    <span style={{ padding: "0.15rem 0.35rem", borderRadius: 4, border: `1px solid ${HAIRLINE}` }}>{cat.depth}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <p style={{ ...eyebrowStyle, marginTop: "1rem" }}>Excluded</p>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px dashed ${HAIRLINE}`, background: SURFACE, opacity: 0.75 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", color: INK_MUTED }}>
              <XCircle size={18} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>Tantra</span>
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
              Dīkṣā-gated and requiring a living lineage relationship. If tantra seems indicated, refer out to a qualified lineage teacher — do not substitute with an intensified permitted category.
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Rohan Mehta cases</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Click a case to load its preview plan
          </h3>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.65rem" }}>
            {CASES.map((c) => (
              <button key={c.key} type="button" onClick={() => loadCase(c)} style={caseCardStyle(c.direction === "pacify" ? VERMILION : GREEN)}>
                <div style={{ color: c.direction === "pacify" ? VERMILION : GREEN, fontWeight: 600 }}>{c.title}</div>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {c.note}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Sequencing disciplines</p>
        <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
          <button type="button" aria-pressed={cheaperFirst} onClick={() => setCheaperFirst((v) => !v)} style={togglePanelStyle(cheaperFirst, cheaperFirst ? GREEN : VERMILION)}>
            {cheaperFirst ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
            <span>
              <span style={{ fontWeight: 600 }}>Cheaper remedies first</span>
              <span style={{ color: cheaperFirst ? INK_SECONDARY : VERMILION }}> — {cheaperFirst ? "Start low-cost and add high-cost categories only where earned." : "Warning: starting with the highest-cost category skips the cheaper-first discipline."}</span>
            </span>
          </button>
          <button type="button" aria-pressed={simplestFirst} onClick={() => setSimplestFirst((v) => !v)} style={togglePanelStyle(simplestFirst, simplestFirst ? GREEN : VERMILION)}>
            {simplestFirst ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
            <span>
              <span style={{ fontWeight: 600 }}>Simplest to deepest</span>
              <span style={{ color: simplestFirst ? INK_SECONDARY : VERMILION }}> — {simplestFirst ? "Lead with what the client can begin immediately and sustain." : "Warning: leading with the deepest category can overwhelm follow-through."}</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}

function chipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
  };
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

function caseCardStyle(color: string): CSSProperties {
  return {
    ...cardStyle,
    textAlign: "left",
    cursor: "pointer",
    borderColor: color,
    background: `${color}08`,
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
