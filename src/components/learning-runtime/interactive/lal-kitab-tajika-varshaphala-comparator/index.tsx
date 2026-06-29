"use client";

import { useState } from "react";
import { CheckCircle2, Columns3, GitCompare, RotateCcw, ShieldAlert, Shuffle } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { ANNUAL_SYSTEMS, TOOL_GATES, VERDICT_SCENARIOS, getSystem, getVerdict, type AnnualSystemKey, type VerdictKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const BLUE = "#356C96";

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function AnnualMethodMap({ activeToolId, activeSystem }: { activeToolId: string; activeSystem: AnnualSystemKey }) {
  const activeTool = TOOL_GATES.find((tool) => tool.id === activeToolId) ?? TOOL_GATES[0];
  const lal = getSystem("lalKitab");
  const tajika = getSystem("tajika");
  const activeColor = activeTool.belongsTo === "lalKitab" ? lal.color : tajika.accent;

  const lalTools = TOOL_GATES.filter((tool) => tool.belongsTo === "lalKitab");
  const tajikaTools = TOOL_GATES.filter((tool) => tool.belongsTo === "tajika");

  return (
    <section className="w-full min-w-0 rounded-xl p-8" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 800 620" className="h-auto w-full min-w-0" style={{ display: "block" }} role="img" aria-label="Lal Kitab and Tajika annual method separation diagram">
        <rect x="18" y="55" width="764" height="500" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="400" y="100" textAnchor="middle" fill={GOLD} fontSize="24" fontWeight="700" letterSpacing="0.6" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          SAME YEAR QUESTION, TWO INDEPENDENT TOOLKITS
        </text>

        <rect x="58" y="155" width="300" height="300" rx="18" fill={activeSystem === "lalKitab" ? wash(lal.color, "10") : SURFACE} stroke={activeSystem === "lalKitab" ? lal.color : HAIRLINE} strokeWidth={activeSystem === "lalKitab" ? 2 : 1.2} />
        <rect x="442" y="155" width="300" height="300" rx="18" fill={activeSystem === "tajika" ? wash(tajika.accent, "10") : SURFACE} stroke={activeSystem === "tajika" ? tajika.accent : HAIRLINE} strokeWidth={activeSystem === "tajika" ? 2 : 1.2} />

        <text x="208" y="195" textAnchor="middle" fill={lal.color} fontSize="26" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          LAL KITAB
        </text>
        <text x="592" y="195" textAnchor="middle" fill={tajika.accent} fontSize="26" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          TAJIKA
        </text>
        <text x="208" y="225" textAnchor="middle" fill={INK_SECONDARY} fontSize="18" fontWeight="500" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          fixed Teva + states + upaya
        </text>
        <text x="592" y="225" textAnchor="middle" fill={INK_SECONDARY} fontSize="18" fontWeight="500" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          lagna + muntha + sahams
        </text>

        <path d="M358 310 H442" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <circle cx="400" cy="310" r="46" fill={SURFACE} stroke={GOLD} strokeWidth="2" />
        <text x="400" y="303" textAnchor="middle" fill={GOLD} fontSize="17" fontWeight="700" letterSpacing="0.4" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          YEAR
        </text>
        <text x="400" y="329" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="500" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          read twice
        </text>

        {lalTools.map((tool, index) => {
          const y = 275 + index * 48;
          const selected = tool.id === activeToolId;
          return (
            <g key={tool.id}>
              <rect x="78" y={y - 20} width="260" height="36" rx="10" fill={selected ? wash(lal.color, "18") : SURFACE_2} stroke={selected ? lal.color : HAIRLINE} />
              <text x="208" y={y + 5} textAnchor="middle" fill={selected ? lal.color : INK_SECONDARY} fontSize="15" fontWeight="500" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {tool.label}
              </text>
            </g>
          );
        })}

        {tajikaTools.map((tool, index) => {
          const y = 275 + index * 48;
          const selected = tool.id === activeToolId;
          return (
            <g key={tool.id}>
              <rect x="462" y={y - 20} width="260" height="36" rx="10" fill={selected ? wash(tajika.accent, "18") : SURFACE_2} stroke={selected ? tajika.accent : HAIRLINE} />
              <text x="592" y={y + 5} textAnchor="middle" fill={selected ? tajika.accent : INK_SECONDARY} fontSize="15" fontWeight="500" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {tool.label}
              </text>
            </g>
          );
        })}

        <rect x="180" y="494" width="440" height="42" rx="21" fill={wash(activeColor, "10")} stroke={activeColor} />
        <text x="400" y="522" textAnchor="middle" fill={activeColor} fontSize="17" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Selected tool belongs to {activeTool.belongsTo === "lalKitab" ? "Lal Kitab only" : "Tajika only"}
        </text>
      </svg>
    </section>
  );
}

export function LalKitabTajikaVarshaphalaComparator() {
  const [activeSystem, setActiveSystem] = useState<AnnualSystemKey>("lalKitab");
  const [activeToolId, setActiveToolId] = useState("fixed-teva");
  const [verdictKey, setVerdictKey] = useState<VerdictKey>("converge");
  const system = getSystem(activeSystem);
  const tool = TOOL_GATES.find((item) => item.id === activeToolId) ?? TOOL_GATES[0];
  const toolSystem = getSystem(tool.belongsTo);
  const verdict = getVerdict(verdictKey);
  const toolAllowedColor = tool.belongsTo === "lalKitab" ? ANNUAL_SYSTEMS[0].color : ANNUAL_SYSTEMS[1].accent;

  const reset = () => {
    setActiveSystem("lalKitab");
    setActiveToolId("fixed-teva");
    setVerdictKey("converge");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-tajika-varshaphala-comparator"
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
            Lal Kitab vs Tajika varshaphala
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Same annual question, different machinery
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare the two annual systems, sort each tool into its rightful stream, and decide how to read agreement or divergence without blending methods.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset comparison
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2">
        {ANNUAL_SYSTEMS.map((item) => {
          const selected = item.key === activeSystem;
          const color = item.key === "tajika" ? item.accent : item.color;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSystem(item.key)}
              className="min-w-0 rounded-xl p-4 text-left"
              style={{ background: selected ? wash(color, "12") : SURFACE, border: `1px solid ${selected ? color : HAIRLINE}` }}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-black uppercase" style={{ color, letterSpacing: "0.08em" }}>{item.emphasis}</p>
                  <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    <IAST>{item.iast}</IAST>
                  </h3>
                  <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.frame}</p>
                </div>
                <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: wash(color, "CC") }}>{item.devanagari.split(" ")[0]}</Devanagari>
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeSystem === "tajika" ? BLUE : system.color, "10"), border: `1px solid ${activeSystem === "tajika" ? BLUE : system.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: activeSystem === "tajika" ? BLUE : system.color, letterSpacing: "0.08em" }}>Selected annual system</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{system.label}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{system.engine}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{system.output}</p>
              </div>
              <GitCompare className="shrink-0" size={38} color={activeSystem === "tajika" ? BLUE : system.color} />
            </div>
          </article>

          <AnnualMethodMap activeToolId={activeToolId} activeSystem={activeSystem} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <ShieldAlert size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Tool ownership gate</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {TOOL_GATES.map((item) => {
                const selected = item.id === activeToolId;
                const color = item.belongsTo === "lalKitab" ? ANNUAL_SYSTEMS[0].color : ANNUAL_SYSTEMS[1].accent;
                return (
                  <button key={item.id} type="button" onClick={() => setActiveToolId(item.id)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: selected ? wash(color, "12") : SURFACE_2, border: `1px solid ${selected ? color : HAIRLINE}`, color: selected ? color : INK_SECONDARY }}>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(toolAllowedColor, "10"), border: `1px solid ${toolAllowedColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 size={17} color={toolAllowedColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: toolAllowedColor, letterSpacing: "0.08em" }}>{toolSystem.label}</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{tool.iast}</IAST>
            </h3>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{tool.why}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Columns3 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Side-by-side discipline</p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            {ANNUAL_SYSTEMS.map((item) => {
              const color = item.key === "tajika" ? item.accent : item.color;
              return (
                <div key={item.key} className="min-w-0 rounded-xl p-3" style={{ background: wash(color, "0F"), border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color }}>{item.label}</p>
                  <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{item.output}</p>
                  <div className="mt-3 grid min-w-0 gap-2">
                    {item.tools.map((toolName) => (
                      <span key={toolName} className="min-w-0 rounded-lg px-3 py-2 text-xs font-bold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                        {toolName}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Shuffle size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Convergence / divergence</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {VERDICT_SCENARIOS.map((item) => {
              const selected = item.key === verdictKey;
              return (
                <button key={item.key} type="button" onClick={() => setVerdictKey(item.key)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: selected ? wash(item.color, "12") : SURFACE_2, border: `1px solid ${selected ? item.color : HAIRLINE}`, color: selected ? item.color : INK_SECONDARY }}>
                  {item.label}
                </button>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(verdict.color, "10"), border: `1px solid ${verdict.color}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: verdict.color, letterSpacing: "0.08em" }}>Decision rule</p>
        <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{verdict.choice}</h3>
        <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{verdict.premise}</p>
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{verdict.explanation}</p>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(grahas.shani.primary, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Never conflate</p>
        <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
          A Tajika saham does not enter a Lal Kitab Teva; a Lal Kitab state does not judge a Tajika chart. Keeping the systems separate is what makes cross-stream agreement meaningful.
        </p>
      </section>
    </div>
  );
}
