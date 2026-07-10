"use client";

import { useMemo, useState } from "react";
import type React from "react";
import {
  CheckCircle2,
  Filter,
  Route,
  RotateCcw,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CORPUS_LAYERS,
  CORPUS_TEXTS,
  PRACTICE_CASES,
  findCorpusText,
  textsForLayer,
  type CorpusLayerKey,
  type CorpusText,
  type CorpusTextKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const BLUE = "#356EAE";
const GREEN = "#2F7D52";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function layerColor(layer: CorpusText["layer"]) {
  if (layer === "attestation") return BLUE;
  if (layer === "standalone") return GOLD;
  if (layer === "civil") return "#8A5A2B";
  if (layer === "operational") return GREEN;
  return VERMILION;
}

function layerLabel(layer: CorpusText["layer"]) {
  return CORPUS_LAYERS.find((item) => item.key === layer)?.label ?? layer;
}

function SourceCard({
  source,
  active,
  onSelect,
}: {
  source: CorpusText;
  active: boolean;
  onSelect: (key: CorpusTextKey) => void;
}) {
  const color = layerColor(source.layer);
  return (
    <button
      type="button"
      onClick={() => onSelect(source.key)}
      className="min-w-0 rounded-xl p-3 text-left"
      style={{
        background: active ? wash(color, "12") : SURFACE,
        border: `1px solid ${active ? color : HAIRLINE}`,
        boxShadow: active ? `inset 0 0 0 1px ${color}` : "none",
      }}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase" style={{ color }}>
            <ScrollText size={15} />
            {source.shortLabel} · {layerLabel(source.layer)}
          </span>
          <h3 className="mt-2 text-base font-bold leading-snug" style={{ color: INK_PRIMARY }}>
            {source.title}
          </h3>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-black"
          style={{ color, background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
        >
          {source.sequenceStep}
        </span>
      </div>
      <p className="mb-0 mt-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
        {source.role}
      </p>
    </button>
  );
}

function DetailCard({ source }: { source: CorpusText }) {
  const color = layerColor(source.layer);
  return (
    <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-xs font-black uppercase" style={{ color, letterSpacing: "0.08em" }}>
            Selected source
          </p>
          <h3 className="mt-2 text-3xl font-semibold leading-tight" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {source.title}
          </h3>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
            {source.author} · {source.period}
          </p>
        </div>
        <span className="text-3xl font-semibold" style={{ color: wash(color, "88"), fontFamily: "var(--font-devanagari), serif" }}>
          {source.devanagari}
        </span>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
        <MiniBlock title="Contribution" body={source.contribution} color={color} />
        <MiniBlock title="Use in practice" body={source.recommendedUse} color={GOLD} />
        <MiniBlock title="Attribution guard" body={source.attributionGuard} color={VERMILION} />
      </div>
    </article>
  );
}

function ReadingPath({ selectedKey }: { selectedKey: CorpusTextKey }) {
  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0E"), border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex items-center gap-2">
        <Route size={17} color={GOLD} />
        <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Sequenced reading discipline
        </p>
      </div>
      <div className="grid min-w-0 gap-2 md:grid-cols-7">
        {CORPUS_TEXTS.map((source) => {
          const active = source.key === selectedKey;
          const color = layerColor(source.layer);
          return (
            <button
              key={source.key}
              type="button"
              className="min-w-0 rounded-xl px-2 py-3 text-center"
              style={{
                background: active ? wash(color, "14") : SURFACE,
                border: `1px solid ${active ? color : HAIRLINE}`,
                color: active ? color : INK_PRIMARY,
              }}
            >
              <span className="block text-lg font-black">{source.sequenceStep}</span>
              <span className="mt-1 block text-xs font-bold leading-snug">{source.shortLabel}</span>
            </button>
          );
        })}
      </div>
      <p className="mb-0 mt-3 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
        Start with early attestation and the MC spine, then triangulate with companion texts, civil application,
        operational pañcāṅga conventions, and modern exposition as access rather than replacement.
      </p>
    </section>
  );
}

function MiniBlock({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <article className="min-w-0 rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      <p className="m-0 text-xs font-black uppercase" style={{ color }}>{title}</p>
      <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{body}</p>
    </article>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          {title}
        </p>
      </div>
      {children}
    </article>
  );
}

export function MuhurtaTextCorpusNavigator() {
  const [layerKey, setLayerKey] = useState<CorpusLayerKey>("all");
  const [sourceKey, setSourceKey] = useState<CorpusTextKey>("muhurtaCintamani");

  const visibleSources = useMemo(() => textsForLayer(layerKey), [layerKey]);
  const selectedSource = useMemo(() => findCorpusText(sourceKey), [sourceKey]);

  const reset = () => {
    setLayerKey("all");
    setSourceKey("muhurtaCintamani");
  };

  const selectLayer = (key: CorpusLayerKey) => {
    setLayerKey(key);
    const nextSource = textsForLayer(key)[0];
    if (nextSource && key !== "all") setSourceKey(nextSource.key);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="muhurta-text-corpus-navigator"
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
            Muhūrta text corpus navigator
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Read sources by layer, not by list-completion
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Explore the classical corpus, modern access layer, and attribution rules behind disciplined muhūrta study.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Reset corpus
        </button>
      </div>

      <section className="mb-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Filter size={16} color={GOLD} />
          <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Source layer
          </p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CORPUS_LAYERS.map((layer) => {
            const active = layer.key === layerKey;
            return (
              <button
                key={layer.key}
                type="button"
                onClick={() => selectLayer(layer.key)}
                className="min-w-0 rounded-xl p-3 text-left"
                style={{ background: active ? wash(GOLD, "12") : SURFACE_2, border: `1px solid ${active ? GOLD : HAIRLINE}` }}
              >
                <span className="block text-sm font-bold" style={{ color: active ? GOLD : INK_PRIMARY }}>{layer.label}</span>
                <span className="mt-1 block text-xs leading-snug" style={{ color: INK_SECONDARY }}>{layer.note}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="grid min-w-0 content-start gap-3">
          {visibleSources.map((source) => (
            <SourceCard key={source.key} source={source} active={source.key === sourceKey} onSelect={setSourceKey} />
          ))}
        </div>
        <div className="grid min-w-0 content-start gap-4">
          <DetailCard source={selectedSource} />
          <ReadingPath selectedKey={sourceKey} />
        </div>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <InfoCard title="Citation discipline" icon={<ShieldCheck size={16} />}>
          <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
            Cite classical rules as classical source content, modern syntheses as modern exposition, and
            pañcāṅga differences as computational convention unless a real textual disagreement is being compared.
          </p>
        </InfoCard>
        <InfoCard title="Practice checks" icon={<CheckCircle2 size={16} />}>
          <div className="mt-3 grid min-w-0 gap-2">
            {PRACTICE_CASES.map((item) => (
              <div key={item.label} className="min-w-0 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
                <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{item.prompt}</p>
                <p className="m-0 mt-2 text-sm" style={{ color: GREEN }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </InfoCard>
      </section>

      <section className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
        <MiniBlock title="Classical spine" body="Bṛhat Saṁhitā gives the older witness; MC gives the working spine." color={BLUE} />
        <MiniBlock title="Triangulation" body="MM, Hora-Ratnam, and VKN widen the tradition without erasing their genres." color={GOLD} />
        <MiniBlock title="Modern access" body="Raman, Rao, and later teachers help you learn; they do not replace source citation." color={VERMILION} />
      </section>
    </div>
  );
}
