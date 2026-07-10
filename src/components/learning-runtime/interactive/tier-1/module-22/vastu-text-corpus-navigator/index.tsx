"use client";

import { useMemo, useState } from "react";
import { BookOpen, Compass, GitBranch, Library, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  REGION_LABELS,
  SEQUENCE_NOTES,
  TEXT_LAYERS,
  VASTU_TEXTS,
  getLayer,
  getText,
  type LayerKey,
  type VastuTextKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function CorpusMap({ activeText, onSelect }: { activeText: VastuTextKey; onSelect: (key: VastuTextKey) => void }) {
  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="rounded-2xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, minWidth: "max-content" }}>
        <div className="mb-4 flex flex-col gap-1 text-center">
          <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Recommended engagement sequence</p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Compact map first, then regional depth and integrative breadth.</p>
        </div>

        <div className="flex min-w-0 gap-3">
          {VASTU_TEXTS.slice().sort((a, b) => a.priority - b.priority).map((text) => {
            const selected = text.key === activeText;
            return (
              <button
                key={text.key}
                type="button"
                onClick={() => onSelect(text.key)}
                className="min-w-[150px] flex-1 rounded-xl p-3 text-left"
                style={{ background: selected ? wash(text.color, "14") : SURFACE, border: `1.5px solid ${selected ? text.color : HAIRLINE}` }}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black" style={{ background: selected ? text.color : wash(text.color, "12"), color: selected ? SURFACE : text.color, border: `1px solid ${text.color}` }}>
                  {text.priority}
                </span>
                <span className="mt-3 block break-words text-sm font-bold leading-tight" style={{ color: INK_PRIMARY }}>{text.shortTitle}</span>
                <span className="mt-1 block break-words text-[10px] font-black uppercase leading-tight" style={{ color: text.color, letterSpacing: "0.05em" }}>{REGION_LABELS[text.region]}</span>
                <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{text.structure}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function VastuTextCorpusNavigator() {
  const [activeText, setActiveText] = useState<VastuTextKey>("brihat");
  const [activeLayer, setActiveLayer] = useState<LayerKey>("classical");
  const text = useMemo(() => getText(activeText), [activeText]);
  const layer = useMemo(() => getLayer(activeLayer), [activeLayer]);

  const reset = () => {
    setActiveText("brihat");
    setActiveLayer("classical");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-text-corpus-navigator"
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
            Vastu corpus navigator
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Which text do you read first, and why?
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare the five foundational Vastu texts, three authority layers, regional lineages, and the honest sequence of study.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset corpus
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {TEXT_LAYERS.map((item) => {
          const selected = item.key === activeLayer;
          return (
            <button key={item.key} type="button" onClick={() => setActiveLayer(item.key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
              <span className="flex items-center gap-2 text-sm font-black" style={{ color: selected ? item.color : INK_PRIMARY }}>
                <GitBranch size={17} />
                {item.label}
              </span>
              <span className="mt-2 block text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>{item.authority}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <CorpusMap activeText={activeText} onSelect={setActiveText} />

          <article className="grid min-w-0 gap-3 lg:grid-cols-2">
            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(layer.color, "10"), border: `1px solid ${layer.color}` }}>
              <div className="mb-2 flex items-center gap-2">
                <Library size={17} color={layer.color} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: layer.color, letterSpacing: "0.08em" }}>Selected authority layer</p>
              </div>
              <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{layer.label}</h3>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{layer.authority}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{layer.purpose}</p>
              <p className="mb-0 mt-2 text-xs font-bold" style={{ color: layer.color }}>{layer.examples}</p>
            </section>

            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck size={17} color={VERMILION} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Honest attribution</p>
              </div>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Universal core can travel across regions. Secondary details must name the lineage: South-Indian Manasara-Mayamata, North-Indian Vishvakarma, or integrative synthesis.
              </p>
            </section>
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(text.color, "12"), border: `1px solid ${text.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <BookOpen size={17} color={text.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: text.color, letterSpacing: "0.08em" }}>Selected text</p>
            </div>
            <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{text.title}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{text.date} - {REGION_LABELS[text.region]}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{text.role}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="grid gap-2">
              <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Structure</p>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{text.structure}</p>
              <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Accessibility</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{text.access}</p>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Compass size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Distinctive content</p>
            </div>
            <div className="grid gap-2">
              {text.distinctive.map((item) => (
                <p key={item} className="m-0 rounded-lg px-3 py-2 text-sm" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Sequence discipline</p>
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-5">
          {SEQUENCE_NOTES.map((note, index) => {
            const source = VASTU_TEXTS.find((item) => item.priority === index + 1) ?? VASTU_TEXTS[0];
            return (
              <section key={note} className="min-w-0 rounded-xl p-3" style={{ background: wash(source.color, "0D"), border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-sm font-black" style={{ color: source.color }}>Step {index + 1}</p>
                <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{note}</p>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
