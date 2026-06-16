"use client";

import { useMemo, useState } from "react";
import { BookOpen, Building2, Compass, History, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import { CORPUS, MODERN_GUARDS, ORIGIN_STAGES, VASTU_DOMAINS, type DomainKey, type StageKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;
const INDIGO = "#2C2C3E";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function stageColor(key: StageKey) {
  if (key === "harappan") return "#7A6B3E";
  if (key === "vedic") return GOLD;
  if (key === "classical") return BLUE;
  return GREEN;
}

function domainColor(key: DomainKey) {
  if (key === "site") return GREEN;
  if (key === "layout") return GOLD;
  if (key === "orientation") return BLUE;
  if (key === "room") return VERMILION;
  return INDIGO;
}

function VastuScopeSvg({ activeDomain }: { activeDomain: DomainKey }) {
  const active = VASTU_DOMAINS.find((item) => item.key === activeDomain) ?? VASTU_DOMAINS[0];
  const nodes = [
    { key: "site", x: 156, y: 120 },
    { key: "layout", x: 380, y: 100 },
    { key: "orientation", x: 604, y: 120 },
    { key: "room", x: 248, y: 322 },
    { key: "sequence", x: 512, y: 322 },
  ] as const;
  const labelLines = active.label.includes("-") || active.label.includes(" ")
    ? active.label.split(/[-\s]+/)
    : [active.label];
  const questionLines = active.question.includes(" ") ? (() => {
    const words = active.question.split(" ");
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  })() : [active.question];

  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 430" className="h-auto w-full min-w-[520px]" role="img" aria-label="Vastu Shastra five-domain scope diagram">
        <rect x="20" y="20" width="720" height="390" rx="22" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          VASTU ANSWERS THE SPATIAL WHERE
        </text>
        <path d="M156 120 L380 100 L604 120 L512 322 L248 322 Z" fill="none" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="10 12" />
        <circle cx="380" cy="225" r="70" fill={SURFACE} stroke={domainColor(activeDomain)} strokeWidth="4" />
        <text x="380" y="200" textAnchor="middle" fill={domainColor(activeDomain)} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{active.sanskrit}</text>
        <text x="380" y={225 + (labelLines.length === 1 ? 6 : -10)} textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {labelLines.map((line, index) => (
            <tspan key={line} x={380} dy={index === 0 ? 0 : 20}>{line}</tspan>
          ))}
        </text>
        <text x="380" y={270 + (questionLines.length === 1 ? 6 : -6)} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {questionLines.map((line, index) => (
            <tspan key={line} x={380} dy={index === 0 ? 0 : 16}>{line}</tspan>
          ))}
        </text>
        {nodes.map((node) => {
          const domain = VASTU_DOMAINS.find((item) => item.key === node.key)!;
          const selected = activeDomain === node.key;
          const color = domainColor(node.key);
          return (
            <g key={node.key}>
              <rect x={node.x - 75} y={node.y - 32} width="150" height="64" rx="16" fill={selected ? wash(color, "18") : SURFACE} stroke={selected ? color : HAIRLINE} strokeWidth={selected ? 3 : 1.5} />
              <text x={node.x} y={node.y - 4} textAnchor="middle" fill={selected ? color : INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{domain.label}</text>
              <text x={node.x} y={node.y + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{domain.sanskrit}</text>
            </g>
          );
        })}
        <rect x="130" y="370" width="500" height="28" rx="14" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="389" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Muhurta asks when; Vastu asks where and how space is ordered.
        </text>
      </svg>
    </section>
  );
}

export function VastuOriginsExplorer() {
  const [activeStage, setActiveStage] = useState<StageKey>("classical");
  const [activeDomain, setActiveDomain] = useState<DomainKey>("orientation");
  const stage = useMemo(() => ORIGIN_STAGES.find((item) => item.key === activeStage) ?? ORIGIN_STAGES[2], [activeStage]);
  const domain = useMemo(() => VASTU_DOMAINS.find((item) => item.key === activeDomain) ?? VASTU_DOMAINS[0], [activeDomain]);
  const sColor = stageColor(activeStage);
  const dColor = domainColor(activeDomain);

  const reset = () => {
    setActiveStage("classical");
    setActiveDomain("orientation");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-origins-explorer"
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
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Vastu Shastra origins
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            From sacred site science to modern feasibility
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Explore the historical stream, five-domain definition, classical corpus, and the where-versus-when discipline parallel.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset origins
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {ORIGIN_STAGES.map((item) => {
          const selected = item.key === activeStage;
          const color = stageColor(item.key);
          return (
            <button key={item.key} type="button" onClick={() => setActiveStage(item.key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(color, "12") : SURFACE, border: `1px solid ${selected ? color : HAIRLINE}` }}>
              <span className="block text-xs font-black uppercase" style={{ color: selected ? color : GOLD, letterSpacing: "0.08em" }}>{item.period}</span>
              <span className="mt-2 block text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</span>
            </button>
          );
        })}
      </section>

      <section className="mb-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <VastuScopeSvg activeDomain={activeDomain} />
          <div className="grid min-w-0 gap-2 md:grid-cols-5">
            {VASTU_DOMAINS.map((item) => {
              const selected = item.key === activeDomain;
              const color = domainColor(item.key);
              return (
                <button key={item.key} type="button" onClick={() => setActiveDomain(item.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(color, "12") : SURFACE, border: `1px solid ${selected ? color : HAIRLINE}` }}>
                  <span className="block text-sm font-bold" style={{ color: selected ? color : INK_PRIMARY }}>{item.label}</span>
                  <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.sanskrit}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(sColor, "12"), border: `1px solid ${sColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <History size={17} color={sColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: sColor, letterSpacing: "0.08em" }}>Historical layer</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{stage.label}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{stage.headline}</p>
            <div className="mt-3 grid gap-2">
              {stage.details.map((item) => (
                <div key={item} className="rounded-lg px-3 py-2 text-sm" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(dColor, "10"), border: `1px solid ${dColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={17} color={dColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: dColor, letterSpacing: "0.08em" }}>Selected domain</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{domain.label}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{domain.explanation}</p>
          </article>
        </aside>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Foundational corpus</p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            {CORPUS.map((text) => (
              <section key={text.title} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{text.title}</p>
                <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{text.period} · {text.tradition}</p>
                <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{text.role}</p>
              </section>
            ))}
          </div>
        </article>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Building2 size={17} color={BLUE} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Where and when</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Vastu is the spatial discipline: where, orientation, layout, room placement. Muhurta is the temporal discipline: when to begin, enter, travel, or launch.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Modern guardrails</p>
            </div>
            <div className="grid gap-2">
              {MODERN_GUARDS.map((item) => (
                <p key={item} className="m-0 rounded-lg px-3 py-2 text-sm" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
