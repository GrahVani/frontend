"use client";

import { useCallback, useMemo, useState } from "react";
import type React from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  FileText,
  Heart,
  LayoutGrid,
  Lightbulb,
  MessageSquareText,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CATEGORY_META,
  CLIENT_SCENARIOS,
  COMMON_MISTAKES,
  CONVERGENCE_FACTORS,
  DAIVAJNA_QUALIFICATIONS,
  HONEST_HANDLING_INSTANCES,
  TRADE_OFFS,
  findScenario,
  type ConvergenceFactorKey,
  type DaivajnaKey,
  type InstanceCategory,
  type ScenarioKey,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;
const PURPLE = "#7A4A8A";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function categoryColor(category: InstanceCategory) {
  return CATEGORY_META[category].color;
}

/* ── SVG Helpers ───────────────────────────────────────── */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(cx, cy, rOuter, startAngle);
  const outerEnd = polarToCartesian(cx, cy, rOuter, endAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, endAngle);
  const innerEnd = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

function pentagonPoints(cx: number, cy: number, r: number, count = 5): string {
  const pts = Array.from({ length: count }, (_, i) => {
    const angle = (i * 360) / count;
    const p = polarToCartesian(cx, cy, r, angle);
    return `${p.x},${p.y}`;
  });
  return pts.join(" ");
}

/* ── Tab Bar ───────────────────────────────────────────── */
type TabKey = "rarity" | "cases" | "daivajna" | "instances";

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "rarity", label: "Rarity Dial", icon: <Target size={15} /> },
    { key: "cases", label: "Case Files", icon: <FileText size={15} /> },
    { key: "daivajna", label: "Daivajña Wheel", icon: <ShieldCheck size={15} /> },
    { key: "instances", label: "Instance Map", icon: <LayoutGrid size={15} /> },
  ];

  return (
    <div className="mb-5 flex gap-1 rounded-xl p-1" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              color: isActive ? GOLD : INK_SECONDARY,
              border: isActive ? `1px solid ${HAIRLINE}` : "1px solid transparent",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Rarity Dial Tab ───────────────────────────────────── */
function RarityDialTab() {
  const [ideal, setIdeal] = useState<Set<ConvergenceFactorKey>>(new Set());
  const [hovered, setHovered] = useState<ConvergenceFactorKey | null>(null);

  const toggle = useCallback((key: ConvergenceFactorKey) => {
    setIdeal((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const allSix = ideal.size === CONVERGENCE_FACTORS.length;
  const activeFactor = hovered ?? (allSix ? "panchanga" : "panchanga");
  const activeData = CONVERGENCE_FACTORS.find((f) => f.key === activeFactor)!;

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-2 flex items-center gap-2">
          <Target size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Six-factor convergence wheel
          </p>
        </div>
        <p className="m-0 mb-4 text-xs" style={{ color: INK_SECONDARY }}>
          Tap each wedge to toggle it between realistic (amber) and ideal (green). All six rarely align in one practical window.
        </p>

        <div className="flex justify-center">
          <svg viewBox="0 0 420 420" className="w-full max-w-[420px]" role="img" aria-label="Six factor muhurta rarity dial">
            <defs>
              <filter id="rarity-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="210" cy="210" r="200" fill="#FFFDF7" stroke={HAIRLINE} />
            {CONVERGENCE_FACTORS.map((factor, i) => {
              const startAngle = i * 60;
              const endAngle = startAngle + 60;
              const isIdeal = ideal.has(factor.key);
              const isHover = hovered === factor.key;
              const fill = isIdeal ? wash(GREEN, "28") : wash(AMBER, "22");
              const stroke = isIdeal ? GREEN : isHover ? GOLD : AMBER;
              const midAngle = startAngle + 30;
              const labelPos = polarToCartesian(210, 210, 140, midAngle);
              const iconPos = polarToCartesian(210, 210, 170, midAngle);

              return (
                <g key={factor.key}>
                  <path
                    d={describeArc(210, 210, 190, 90, startAngle + 2, endAngle - 2)}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isHover ? 3 : 2}
                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                    onClick={() => toggle(factor.key)}
                    onMouseEnter={() => setHovered(factor.key)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isIdeal ? GREEN : "#5A4E2E"}
                    fontSize={10}
                    fontWeight={700}
                    style={{ pointerEvents: "none" }}
                  >
                    {factor.label}
                  </text>
                  <text
                    x={iconPos.x}
                    y={iconPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isIdeal ? GREEN : AMBER}
                    fontSize={16}
                    style={{ pointerEvents: "none" }}
                  >
                    {isIdeal ? "✓" : "~"}
                  </text>
                </g>
              );
            })}
            <circle cx="210" cy="210" r="78" fill="#FFFFFF" stroke={HAIRLINE} strokeWidth={2} />
            <text x="210" y="195" textAnchor="middle" fill={allSix ? GREEN : AMBER} fontSize={28} fontWeight={800}>
              {allSix ? "6 / 6" : `${ideal.size} / 6`}
            </text>
            <text x="210" y="220" textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
              {allSix ? "Perfect — rare" : "Best-available — typical"}
            </text>
          </svg>
        </div>
      </div>

      <div className="min-w-0">
        <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Factor detail
          </p>
          <h3 className="m-0 mt-2 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {activeData.fullLabel}
          </h3>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{activeData.description}</p>
          <div className="mt-3 rounded-lg p-3" style={{ background: wash(AMBER, "10"), border: `1px solid ${wash(AMBER, "25")}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: AMBER, letterSpacing: "0.06em" }}>
              Typical practical state
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY }}>{activeData.typicalState}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Scale size={16} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Typical trade-offs</p>
          </div>
          <div className="flex flex-col gap-2">
            {TRADE_OFFS.map((to) => (
              <div key={to.key} className="rounded-lg p-3" style={{ background: wash(BLUE, "08"), border: `1px solid ${wash(BLUE, "18")}` }}>
                <p className="m-0 text-xs font-bold" style={{ color: BLUE }}>{to.label}</p>
                <p className="m-0 mt-1 text-[11px]" style={{ color: INK_SECONDARY }}>{to.example}</p>
                <p className="m-0 mt-1 text-[10px]" style={{ color: INK_PRIMARY }}>{to.honestResponse}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl p-4" style={{ background: allSix ? wash(GREEN, "10") : wash(AMBER, "10"), border: `1.5px solid ${allSix ? GREEN : AMBER}` }}>
          <div className="flex items-center gap-2">
            {allSix ? <CheckCircle2 size={20} color={GREEN} /> : <Scale size={20} color={AMBER} />}
            <p className="m-0 text-sm font-bold" style={{ color: allSix ? GREEN : AMBER }}>
              {allSix ? "Perfect convergence achieved — but this is rare" : "Practical recommendation: best-available"}
            </p>
          </div>
          <p className="m-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>
            {allSix
              ? "All six factors aligning is the exception, not the rule. Do not promise this to a client."
              : "Most candidates show a mixed-pillar-aggregate. The discipline is to articulate trade-offs and choose best-available."}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Case Files Tab ────────────────────────────────────── */
function CaseFileCard({
  scenario,
  isActive,
  isReviewed,
  onClick,
}: {
  scenario: (typeof CLIENT_SCENARIOS)[number];
  isActive: boolean;
  isReviewed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-w-0 items-start gap-3 rounded-xl p-4 text-left transition-all duration-200"
      style={{
        background: isActive ? wash(BLUE, "12") : SURFACE,
        border: `1.5px solid ${isActive ? BLUE : HAIRLINE}`,
        cursor: "pointer",
        transform: isActive ? "scale(1.01)" : "scale(1)",
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: isReviewed ? wash(GREEN, "18") : wash(BLUE, "16"), color: isReviewed ? GREEN : BLUE }}
      >
        {isReviewed ? <CheckCircle2 size={20} /> : <MessageSquareText size={20} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{scenario.label}</p>
        <p className="m-0 mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>&ldquo;{scenario.clientQuote}&rdquo;</p>
        {isReviewed && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: GREEN }}>
            <BadgeCheck size={13} /> Reviewed
          </span>
        )}
      </div>
      <ArrowRight
        size={16}
        className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5"
        style={{ color: isActive ? BLUE : INK_SECONDARY, opacity: isActive ? 1 : 0.4 }}
      />
    </button>
  );
}

function CaseFilesTab() {
  const [activeKey, setActiveKey] = useState<ScenarioKey>("awaitPerfect");
  const [reviewed, setReviewed] = useState<Set<ScenarioKey>>(new Set(["awaitPerfect"]));

  const scenario = useMemo(() => findScenario(activeKey), [activeKey]);

  const select = useCallback((key: ScenarioKey) => {
    setActiveKey(key);
    setReviewed((prev) => new Set(prev).add(key));
  }, []);

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <FileText size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Client files</p>
          </div>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: wash(GREEN, "16"), color: GREEN }}>
            {reviewed.size}/{CLIENT_SCENARIOS.length} reviewed
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {CLIENT_SCENARIOS.map((s) => (
            <CaseFileCard
              key={s.key}
              scenario={s}
              isActive={s.key === activeKey}
              isReviewed={reviewed.has(s.key)}
              onClick={() => select(s.key)}
            />
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <article className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Selected case</p>
            <BadgeCheck size={20} color={BLUE} />
          </div>
          <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {scenario.label}
          </h3>

          <div className="mt-4 rounded-lg p-4" style={{ background: "#FFFFFF", border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.06em" }}>Client says</p>
            <p className="m-0 mt-2 text-base italic leading-relaxed" style={{ color: INK_PRIMARY }}>&ldquo;{scenario.clientQuote}&rdquo;</p>
          </div>

          <div className="mt-4 rounded-lg p-4" style={{ background: wash(GREEN, "08"), border: `1px solid ${wash(GREEN, "22")}` }}>
            <p className="m-0 flex items-center gap-2 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.06em" }}>
              <Sparkles size={14} /> Discipline-compliant response
            </p>
            <ul className="m-0 mt-3 list-none space-y-2 p-0">
              {scenario.practitionerAnswer.map((line, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: INK_PRIMARY }}>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: GREEN, color: "#FFF" }}>
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl p-4" style={{ background: wash(BLUE, "08"), border: `1.5px solid ${BLUE}` }}>
            <div className="flex items-center gap-2">
              <Scale size={18} color={BLUE} />
              <p className="m-0 text-sm font-bold" style={{ color: BLUE }}>Verdict</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{scenario.verdict}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ── Daivajña Wheel Tab ────────────────────────────────── */
const DAIVAJNA_COLORS: Record<DaivajnaKey, string> = {
  satya: BLUE,
  daya: VERMILION,
  nirlobha: AMBER,
  jnanin: GREEN,
  sastravit: PURPLE,
};

function DaivajnaWheelTab() {
  const [activeKey, setActiveKey] = useState<DaivajnaKey>("satya");
  const active = DAIVAJNA_QUALIFICATIONS.find((d) => d.key === activeKey)!;
  const color = DAIVAJNA_COLORS[activeKey];

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Five daivajña qualifications
          </p>
        </div>
        <p className="m-0 mb-4 text-xs" style={{ color: INK_SECONDARY }}>
          Tap a vertex to see how each Bṛhat Saṁhitā Adhyāya 2 qualification operationalises honest-handling.
        </p>

        <div className="flex justify-center">
          <svg viewBox="0 0 420 420" className="w-full max-w-[420px]" role="img" aria-label="Daivajna qualifications pentagon">
            <polygon points={pentagonPoints(210, 210, 170)} fill="none" stroke={HAIRLINE} strokeWidth={2} />
            <polygon points={pentagonPoints(210, 210, 110)} fill="#FFFDF7" stroke={HAIRLINE} strokeWidth={1} />

            {DAIVAJNA_QUALIFICATIONS.map((d, i) => {
              const angle = (i * 360) / 5;
              const outer = polarToCartesian(210, 210, 170, angle);
              const inner = polarToCartesian(210, 210, 110, angle);
              const isActive = d.key === activeKey;
              const c = DAIVAJNA_COLORS[d.key];

              return (
                <g key={d.key} style={{ cursor: "pointer" }} onClick={() => setActiveKey(d.key)}>
                  <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={isActive ? c : HAIRLINE} strokeWidth={isActive ? 3 : 1} />
                  <circle cx={outer.x} cy={outer.y} r={isActive ? 26 : 22} fill={isActive ? c : "#FFFFFF"} stroke={c} strokeWidth={2} style={{ transition: "all 0.2s ease" }} />
                  <text
                    x={outer.x}
                    y={outer.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isActive ? "#FFFFFF" : c}
                    fontSize={isActive ? 14 : 12}
                    fontWeight={800}
                    style={{ pointerEvents: "none" }}
                  >
                    {d.label.split("-")[0]}
                  </text>
                </g>
              );
            })}

            <circle cx="210" cy="210" r="58" fill="#FFFFFF" stroke={color} strokeWidth={2} />
            <text x="210" y="200" textAnchor="middle" fill={color} fontSize={18} fontWeight={800}>
              {active.devanagari}
            </text>
            <text x="210" y="225" textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
              {active.meaning}
            </text>
          </svg>
        </div>
      </div>

      <div className="min-w-0">
        <article className="rounded-xl p-5" style={{ background: wash(color, "08"), border: `1.5px solid ${color}` }}>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: wash(color, "20"), color }}>
              Qualification
            </span>
            <BadgeCheck size={18} color={color} />
          </div>
          <h3 className="m-0 text-3xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {active.label}
          </h3>
          <p className="m-0 mt-1 text-lg" style={{ color: color, fontFamily: "var(--font-cormorant), serif" }}>
            {active.devanagari} — {active.meaning}
          </p>
          <p className="m-0 mt-4 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{active.note}</p>
          <div className="mt-4 rounded-lg p-3" style={{ background: "#FFFFFF", border: `1px solid ${wash(color, "25")}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.06em" }}>Honest-handling role</p>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{active.honestHandlingRole}</p>
          </div>
        </article>

        <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 flex items-center gap-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            <Heart size={14} /> Cumulative ethics integration
          </p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            All five qualifications work together. Satya-vādī and Śāstra-vit keep the analysis grounded; Dayā-yutaḥ and Nirlobha keep the client relationship clean; Jñānin ensures the method is applied, not shortcutted.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Instance Map Tab ──────────────────────────────────── */
const ALL_CATEGORIES: InstanceCategory[] = [
  "attribution",
  "articulation",
  "tradeOff",
  "variance",
  "ethics",
  "cancellation",
  "scope",
];

function InstanceMapTab() {
  const [selectedCategory, setSelectedCategory] = useState<InstanceCategory | "all">("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return HONEST_HANDLING_INSTANCES;
    return HONEST_HANDLING_INSTANCES.filter((i) => i.category === selectedCategory);
  }, [selectedCategory]);

  const toggleExpand = useCallback((id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <section>
      <div className="mb-4 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex flex-wrap items-center gap-2">
          <LayoutGrid size={16} color={GOLD} />
          <span className="text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Filter by category</span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="rounded-full px-3 py-1 text-xs font-semibold transition"
            style={{
              background: selectedCategory === "all" ? GOLD : SURFACE_2,
              color: selectedCategory === "all" ? "#FFFFFF" : INK_SECONDARY,
              border: `1px solid ${selectedCategory === "all" ? GOLD : HAIRLINE}`,
            }}
          >
            All 19
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full px-3 py-1 text-xs font-semibold transition"
                style={{
                  background: active ? meta.color : SURFACE_2,
                  color: active ? "#FFFFFF" : INK_SECONDARY,
                  border: `1px solid ${active ? meta.color : HAIRLINE}`,
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((instance) => {
          const color = categoryColor(instance.category);
          const isExpanded = expanded.has(instance.id);
          return (
            <button
              key={instance.id}
              type="button"
              onClick={() => toggleExpand(instance.id)}
              className="min-w-0 rounded-xl p-4 text-left transition-all duration-200"
              style={{
                background: isExpanded ? wash(color, "10") : SURFACE,
                border: `1.5px solid ${isExpanded ? color : HAIRLINE}`,
                cursor: "pointer",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: wash(color, "18"), color }}>
                  {instance.lesson}
                </span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: wash(color, "14"), color }}>
                  {CATEGORY_META[instance.category].label}
                </span>
              </div>
              <h4 className="m-0 mt-3 text-sm font-bold" style={{ color: INK_PRIMARY }}>{instance.label}</h4>
              {isExpanded && (
                <p className="m-0 mt-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                  {instance.content}
                </p>
              )}
              <p className="m-0 mt-2 text-[10px] font-semibold" style={{ color: color }}>
                {isExpanded ? "Click to collapse" : "Click to expand"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 flex items-center gap-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          <BookOpen size={14} /> Cumulative achievement
        </p>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
          M23 operationalises honest-handling discipline at <strong>19+ distinct instances</strong> across 18 prior lessons — a systematic practitioner-discipline framework grounded in cumulative classical-tradition and Bṛhat Saṁhitā Adhyāya 2 daivajña-qualifications.
        </p>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-3">
        {COMMON_MISTAKES.map((m) => (
          <article key={m.key} className="rounded-xl p-4" style={{ background: wash(VERMILION, "08"), border: `1px solid ${wash(VERMILION, "25")}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.06em" }}>Common mistake</p>
            </div>
            <h4 className="m-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{m.label}</h4>
            <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{m.warning}</p>
            <div className="mt-3 rounded-lg p-2" style={{ background: "#FFFFFF", border: `1px solid ${wash(VERMILION, "20")}` }}>
              <p className="m-0 text-[10px] font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.05em" }}>Remedy</p>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_PRIMARY }}>{m.remedy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Discipline Ribbon ─────────────────────────────────── */
const DISCIPLINE_CARDS = [
  {
    key: "rare",
    label: "Perfect is rare",
    note: "6-factor convergence at one moment is uncommon.",
    icon: <Target size={16} />,
    color: AMBER,
  },
  {
    key: "compromise",
    label: "Compromise required",
    note: "Select best-available, not perfect.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  {
    key: "effort",
    label: "Effort trade-off",
    note: "Delay for marginal gain can harm the event.",
    icon: <AlertTriangle size={16} />,
    color: VERMILION,
  },
  {
    key: "freewill",
    label: "Free-will outweighs",
    note: "Muhūrta is one input among many.",
    icon: <Lightbulb size={16} />,
    color: GREEN,
  },
];

function DisciplineRibbon() {
  return (
    <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {DISCIPLINE_CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: wash(card.color, "10"), border: `1px solid ${wash(card.color, "25")}` }}
        >
          <div className="flex items-center gap-2" style={{ color: card.color }}>
            {card.icon}
            <span className="text-xs font-bold uppercase tracking-wider">{card.label}</span>
          </div>
          <p className="m-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>{card.note}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */
export function MuhurtaHonestHandling() {
  const [activeTab, setActiveTab] = useState<TabKey>("rarity");

  const reset = () => {
    setActiveTab("rarity");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="muhurta-honest-handling"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            M23 Chapter 6 · Honest Handling & Closure
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Muhūrta honest-handling discipline
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            The perfect muhūrta is rare. The discipline is best-available recommendation, explicit trade-offs, and honest attribution — grounded in the five daivajña qualifications.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "rarity" && <RarityDialTab />}
      {activeTab === "cases" && <CaseFilesTab />}
      {activeTab === "daivajna" && <DaivajnaWheelTab />}
      {activeTab === "instances" && <InstanceMapTab />}

      <DisciplineRibbon />
    </div>
  );
}
