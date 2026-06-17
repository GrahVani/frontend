"use client";

import { useCallback, useMemo, useState } from "react";
import type React from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Ban,
  CheckCircle2,
  ChevronRight,
  FileText,
  Filter,
  Gauge,
  GitBranch,
  LayoutGrid,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CLIENT_SCENARIOS,
  COMMON_MISTAKES,
  DECISION_TREE,
  STAKES_LEVELS,
  findMethod,
  findScenario,
  findStakesLevel,
  type ScenarioKey,
  type StakesKey,
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
const SLATE = "#5A5C68";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

/* ── Tab Bar ───────────────────────────────────────────── */
type TabKey = "tree" | "gauge" | "cases" | "matrix";

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "tree", label: "Decision Tree", icon: <GitBranch size={15} /> },
    { key: "gauge", label: "Stakes Gauge", icon: <Gauge size={15} /> },
    { key: "cases", label: "Case Files", icon: <FileText size={15} /> },
    { key: "matrix", label: "Method Matrix", icon: <LayoutGrid size={15} /> },
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

/* ── Decision Tree Tab ─────────────────────────────────── */
function DecisionTreeTab() {
  const [nodeId, setNodeId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>(["start"]);

  const node = useMemo(() => DECISION_TREE.find((n) => n.id === nodeId)!, [nodeId]);
  const isOutcome = !!node.outcome;

  const choose = useCallback((target: string) => {
    setNodeId(target);
    setHistory((prev) => [...prev, target]);
  }, []);

  const reset = () => {
    setNodeId("start");
    setHistory(["start"]);
  };

  const outcomeLevel = node.outcome ? findStakesLevel(node.outcome.stakes) : null;

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Operational decision-tree</p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
            style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={13} /> Restart
          </button>
        </div>

        <div className="flex justify-center">
          <svg viewBox="0 0 640 420" className="w-full" role="img" aria-label="Muhurta stakes decision tree">
            <defs>
              <marker id="tree-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={GOLD} />
              </marker>
            </defs>

            {/* Nodes */}
            <rect x="170" y="20" width="300" height="70" rx="14" fill="#FFFDF7" stroke={nodeId === "start" ? GOLD : HAIRLINE} strokeWidth={nodeId === "start" ? 2.5 : 1.5} />
            <text x="320" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize={12} fontWeight={700}>Substantial event?</text>
            <text x="320" y="68" textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Wedding / griha-praveśa apūrva / major business / surgery / contract</text>

            <rect x="40" y="170" width="160" height="60" rx="12" fill={wash(VERMILION, "18")} stroke={VERMILION} strokeWidth={nodeId === "high-outcome" ? 2.5 : 1.5} />
            <text x="120" y="200" textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={800}>HIGH-STAKES</text>
            <text x="120" y="218" textAnchor="middle" fill={INK_SECONDARY} fontSize={8}>Full integrated method</text>

            <rect x="240" y="170" width="160" height="60" rx="12" fill={wash(AMBER, "18")} stroke={AMBER} strokeWidth={nodeId === "medium-outcome" ? 2.5 : 1.5} />
            <text x="320" y="200" textAnchor="middle" fill={AMBER} fontSize={12} fontWeight={800}>MEDIUM-STAKES</text>
            <text x="320" y="218" textAnchor="middle" fill={INK_SECONDARY} fontSize={8}>Reduced-precision</text>

            <rect x="440" y="170" width="160" height="60" rx="12" fill={wash(BLUE, "18")} stroke={BLUE} strokeWidth={nodeId === "routine-outcome" ? 2.5 : 1.5} />
            <text x="520" y="200" textAnchor="middle" fill={BLUE} fontSize={12} fontWeight={800}>ROUTINE-STAKES</text>
            <text x="520" y="218" textAnchor="middle" fill={INK_SECONDARY} fontSize={8}>Chowghadiya only</text>

            <rect x="240" y="320" width="160" height="60" rx="12" fill={wash(SLATE, "18")} stroke={SLATE} strokeWidth={nodeId === "trivial-outcome" ? 2.5 : 1.5} />
            <text x="320" y="350" textAnchor="middle" fill={SLATE} fontSize={12} fontWeight={800}>TRIVIAL</text>
            <text x="320" y="368" textAnchor="middle" fill={INK_SECONDARY} fontSize={8}>Decline engagement</text>

            {/* Decision diamonds */}
            <polygon points="320,120 370,145 320,170 270,145" fill="#FFFFFF" stroke={GOLD} strokeWidth={1.5} />
            <text x="320" y="149" textAnchor="middle" fill={INK_PRIMARY} fontSize={9} fontWeight={700}>Routine event?</text>

            <polygon points="520,270 570,295 520,320 470,295" fill="#FFFFFF" stroke={GOLD} strokeWidth={1.5} />
            <text x="520" y="299" textAnchor="middle" fill={INK_PRIMARY} fontSize={9} fontWeight={700}>Routine daily?</text>

            {/* Connectors */}
            <line x1="260" y1="90" x2="140" y2="170" stroke={GOLD} strokeWidth={1.5} markerEnd="url(#tree-arrow)" />
            <text x="170" y="125" fill={GOLD} fontSize={8} fontWeight={700}>Yes</text>

            <line x1="320" y1="90" x2="320" y2="120" stroke={GOLD} strokeWidth={1.5} markerEnd="url(#tree-arrow)" />
            <text x="330" y="108" fill={INK_SECONDARY} fontSize={8}>No</text>

            <line x1="345" y1="155" x2="320" y2="170" stroke={GOLD} strokeWidth={1.5} markerEnd="url(#tree-arrow)" />
            <text x="342" y="168" fill={GOLD} fontSize={8} fontWeight={700}>Yes</text>

            <line x1="370" y1="145" x2="520" y2="170" stroke={GOLD} strokeWidth={1.5} markerEnd="url(#tree-arrow)" />
            <text x="470" y="155" fill={INK_SECONDARY} fontSize={8}>No</text>

            <line x1="520" y1="230" x2="520" y2="270" stroke={GOLD} strokeWidth={1.5} markerEnd="url(#tree-arrow)" />
            <text x="530" y="250" fill={INK_SECONDARY} fontSize={8}>No</text>

            <line x1="495" y1="295" x2="400" y2="320" stroke={GOLD} strokeWidth={1.5} markerEnd="url(#tree-arrow)" />
            <text x="425" y="315" fill={GOLD} fontSize={8} fontWeight={700}>Yes</text>

            <line x1="320" y1="230" x2="320" y2="320" stroke={GOLD} strokeWidth={1.5} markerEnd="url(#tree-arrow)" />
            <text x="330" y="280" fill={INK_SECONDARY} fontSize={8}>No</text>
          </svg>
        </div>
      </div>

      <div className="min-w-0">
        {!isOutcome ? (
          <div className="rounded-xl p-5" style={{ background: "#FFFFFF", border: `1.5px solid ${GOLD}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Current question</p>
            <h3 className="m-0 mt-3 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {node.question}
            </h3>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => choose(node.yesTarget)}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold transition"
                style={{ background: wash(GREEN, "12"), border: `1px solid ${GREEN}`, color: GREEN }}
              >
                {node.yesLabel}
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => choose(node.noTarget)}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold transition"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {node.noLabel}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : node.outcome ? (
          <div className="rounded-xl p-5" style={{ background: wash(outcomeLevel?.color ?? GOLD, "10"), border: `1.5px solid ${outcomeLevel?.color ?? GOLD}` }}>
            <div className="flex items-center gap-2">
              <BadgeCheck size={20} color={outcomeLevel?.color ?? GOLD} />
              <p className="m-0 text-sm font-bold" style={{ color: outcomeLevel?.color ?? GOLD }}>{node.outcome.title}</p>
            </div>
            <p className="m-0 mt-3 text-sm" style={{ color: INK_PRIMARY }}>{node.outcome.note}</p>
            {outcomeLevel && (
              <div className="mt-4 rounded-lg p-3" style={{ background: "#FFFFFF", border: `1px solid ${wash(outcomeLevel.color, "25")}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: outcomeLevel.color, letterSpacing: "0.06em" }}>Method</p>
                <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY }}>{findMethod(outcomeLevel.method).label}</p>
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Path taken</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {history.map((id, i) => {
              const n = DECISION_TREE.find((x) => x.id === id);
              const label = n?.outcome ? n.outcome.title : n?.id === "start" ? "Start" : i === 1 ? "Substantial?" : i === 2 ? "Routine?" : "Daily?";
              return (
                <span key={id + i} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {label}
                  {i < history.length - 1 && <ChevronRight size={10} />}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stakes Gauge Tab ──────────────────────────────────── */
function StakesGaugeTab() {
  const [selected, setSelected] = useState<StakesKey>("high");
  const level = findStakesLevel(selected);
  const method = findMethod(level.method);

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Gauge size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Stakes level</p>
        </div>
        <div className="flex flex-col gap-2">
          {STAKES_LEVELS.map((s) => {
            const active = s.key === selected;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelected(s.key)}
                className="rounded-lg p-3 text-left transition-all duration-200"
                style={{
                  background: active ? wash(s.color, "16") : SURFACE_2,
                  border: `1.5px solid ${active ? s.color : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                  <span className="text-sm font-bold" style={{ color: active ? s.color : INK_PRIMARY }}>{s.label}</span>
                </div>
                <p className="m-0 mt-1 text-[10px]" style={{ color: INK_SECONDARY }}>{s.eventTypes.length} event categories</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0">
        <article className="rounded-xl p-5" style={{ background: wash(level.color, "08"), border: `1.5px solid ${level.color}` }}>
          <div className="flex items-center gap-2">
            <Target size={20} color={level.color} />
            <p className="m-0 text-sm font-bold" style={{ color: level.color }}>{level.label}</p>
          </div>
          <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {method.label}
          </h3>
          <p className="m-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{level.discipline}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg p-3" style={{ background: "#FFFFFF", border: `1px solid ${wash(level.color, "25")}` }}>
              <p className="m-0 text-[10px] font-bold uppercase" style={{ color: level.color, letterSpacing: "0.05em" }}>Event types</p>
              <ul className="m-0 mt-1 list-none space-y-1 p-0">
                {level.eventTypes.map((e) => (
                  <li key={e} className="text-xs" style={{ color: INK_SECONDARY }}>• {e}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#FFFFFF", border: `1px solid ${wash(level.color, "25")}` }}>
              <p className="m-0 text-[10px] font-bold uppercase" style={{ color: level.color, letterSpacing: "0.05em" }}>Time estimate</p>
              <p className="m-0 mt-1 text-sm font-semibold" style={{ color: INK_PRIMARY }}>{level.timeEstimate}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#FFFFFF", border: `1px solid ${wash(level.color, "25")}` }}>
              <p className="m-0 text-[10px] font-bold uppercase" style={{ color: level.color, letterSpacing: "0.05em" }}>Fee discipline</p>
              <p className="m-0 mt-1 text-sm font-semibold" style={{ color: INK_PRIMARY }}>{level.feeNote}</p>
            </div>
          </div>
        </article>

        <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Method tools</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {method.tools.map((tool) => (
              <div key={tool} className="flex items-start gap-2 rounded-lg p-2.5" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <CheckCircle2 size={14} color={level.color} className="mt-0.5 shrink-0" />
                <span className="text-xs" style={{ color: INK_PRIMARY }}>{tool}</span>
              </div>
            ))}
          </div>
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
  const level = findStakesLevel(scenario.stakes);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-w-0 items-start gap-3 rounded-xl p-4 text-left transition-all duration-200"
      style={{
        background: isActive ? wash(level.color, "12") : SURFACE,
        border: `1.5px solid ${isActive ? level.color : HAIRLINE}`,
        cursor: "pointer",
        transform: isActive ? "scale(1.01)" : "scale(1)",
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: isReviewed ? wash(GREEN, "18") : wash(level.color, "16"), color: isReviewed ? GREEN : level.color }}
      >
        {isReviewed ? <CheckCircle2 size={20} /> : <FileText size={20} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{scenario.label}</p>
        <p className="m-0 mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>{scenario.request}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full" style={{ background: level.color }} />
          <span className="text-[10px] font-bold uppercase" style={{ color: level.color }}>{level.label}</span>
          {isReviewed && <BadgeCheck size={13} color={GREEN} className="ml-2" />}
        </div>
      </div>
      <ArrowRight
        size={16}
        className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5"
        style={{ color: isActive ? level.color : INK_SECONDARY, opacity: isActive ? 1 : 0.4 }}
      />
    </button>
  );
}

function CaseFilesTab() {
  const [activeKey, setActiveKey] = useState<ScenarioKey>("wedding");
  const [reviewed, setReviewed] = useState<Set<ScenarioKey>>(new Set(["wedding"]));

  const scenario = useMemo(() => findScenario(activeKey), [activeKey]);
  const level = findStakesLevel(scenario.stakes);
  const method = findMethod(scenario.method);

  const select = useCallback((key: ScenarioKey) => {
    setActiveKey(key);
    setReviewed((prev) => new Set(prev).add(key));
  }, []);

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <FileText size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Client requests</p>
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
            <BadgeCheck size={20} color={level.color} />
          </div>
          <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {scenario.label}
          </h3>

          <div className="mt-4 rounded-lg p-4" style={{ background: wash(level.color, "10"), border: `1px solid ${wash(level.color, "25")}` }}>
            <div className="flex items-center gap-2">
              <Target size={16} color={level.color} />
              <span className="text-xs font-bold uppercase" style={{ color: level.color, letterSpacing: "0.06em" }}>{level.label} · {method.label}</span>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{scenario.rationale}</p>
          </div>

          <div className="mt-4 rounded-lg p-4" style={{ background: wash(GREEN, "08"), border: `1px solid ${wash(GREEN, "22")}` }}>
            <p className="m-0 flex items-center gap-2 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.06em" }}>
              <Sparkles size={14} /> Discipline-compliant response
            </p>
            <ul className="m-0 mt-3 list-none space-y-2 p-0">
              {scenario.practitionerResponse.map((line, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: INK_PRIMARY }}>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: GREEN, color: "#FFF" }}>
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl p-4" style={{ background: wash(level.color, "08"), border: `1.5px solid ${level.color}` }}>
            <div className="flex items-center gap-2">
              <Scale size={18} color={level.color} />
              <p className="m-0 text-sm font-bold" style={{ color: level.color }}>Verdict</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{scenario.verdict}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ── Method Matrix Tab ─────────────────────────────────── */
function MethodMatrixTab() {
  return (
    <section>
      <div className="mb-4 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Filter size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Stakes → Method mapping</p>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {STAKES_LEVELS.map((level) => {
          const method = findMethod(level.method);
          return (
            <article key={level.key} className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5" style={{ background: wash(level.color, "08"), border: `1.5px solid ${level.color}` }}>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ background: level.color }} />
                <p className="m-0 text-sm font-bold" style={{ color: level.color }}>{level.label}</p>
              </div>
              <h3 className="m-0 mt-2 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {method.label}
              </h3>
              <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{level.discipline}</p>

              <div className="mt-4 rounded-lg p-3" style={{ background: "#FFFFFF", border: `1px solid ${wash(level.color, "25")}` }}>
                <p className="m-0 text-[10px] font-bold uppercase" style={{ color: level.color, letterSpacing: "0.05em" }}>Applies to</p>
                <ul className="m-0 mt-2 grid list-none gap-1 p-0 sm:grid-cols-2">
                  {level.eventTypes.map((e) => (
                    <li key={e} className="flex items-start gap-1.5 text-xs" style={{ color: INK_SECONDARY }}>
                      <span style={{ color: level.color }}>•</span> {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md px-2 py-1 text-[10px] font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {level.timeEstimate}
                </span>
                <span className="rounded-md px-2 py-1 text-[10px] font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {level.feeNote}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 flex items-center gap-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          <ShieldCheck size={14} /> Calibration principle
        </p>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
          Neither over-engage on trivial decisions nor under-engage on substantial events. Stakes-calibration discipline protects both client decision-capacity (<em>adhikāra</em>, <em>samatvam</em>) and practitioner scope (<em>nirlobha</em>, life-coach-avoidance).
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

/* ── Main Component ────────────────────────────────────── */
export function MuhurtaDecisionFramework() {
  const [activeTab, setActiveTab] = useState<TabKey>("tree");

  const reset = () => setActiveTab("tree");

  return (
    <div
      className="w-full min-w-0"
      data-interactive="muhurta-decision-framework"
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
            M23 Chapter 6 · Decision Framework
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Stakes-calibrated muhūrta engagement
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            When to apply the full integrated method, reduced-precision, Chowghadiya heuristic only, or decline engagement entirely.
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

      {activeTab === "tree" && <DecisionTreeTab />}
      {activeTab === "gauge" && <StakesGaugeTab />}
      {activeTab === "cases" && <CaseFilesTab />}
      {activeTab === "matrix" && <MethodMatrixTab />}

      {/* Compact discipline ribbon */}
      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAKES_LEVELS.map((s) => {
          const Icon = s.key === "trivial" ? Ban : CheckCircle2;
          return (
            <div
              key={s.key}
              className="rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: wash(s.color, "10"), border: `1px solid ${wash(s.color, "25")}` }}
            >
              <div className="flex items-center gap-2" style={{ color: s.color }}>
                <Icon size={15} />
                <span className="text-xs font-bold uppercase tracking-wider">{s.shortLabel}</span>
              </div>
              <p className="m-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>{findMethod(s.method).label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
