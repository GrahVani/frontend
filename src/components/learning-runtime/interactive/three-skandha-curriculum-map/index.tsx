/**
 * Three Skandha Curriculum Map — Lesson 3.1's §4 explorer.
 *
 * L2 pattern: LEFT = contemplative triangle painting (no clicks).
 * RIGHT = clickable skandha rows + curriculum cross-refs.
 * Click a row → ActiveDetail replaces the rows-list with that skandha's
 * full detail (function, texts, modules, structural role, stream emphasis),
 * with a Close button to return.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, BookOpen, MapPin, Layers } from "lucide-react";
import { SKANDHA_NODES, ROW_ORDER, type SkandhaNode } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

export function ThreeSkandhaCurriculumMap() {
  const [activeSlug, setActiveSlug] = useState<SkandhaNode["slug"] | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const orderedNodes = ROW_ORDER.map(
    (slug) => SKANDHA_NODES.find((n) => n.slug === slug)!,
  );
  const active = activeSlug
    ? SKANDHA_NODES.find((n) => n.slug === activeSlug) ?? null
    : null;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-stretch"
      data-interactive="three-skandha-curriculum-map"
    >
      <div
        className="p-6 flex flex-col items-center"
        style={{ background: "transparent", borderRadius: "14px", border: "1px solid rgba(156, 122, 47, 0.20)" }}
      >
        <p
          className="uppercase mb-4"
          style={{
            color: INDIGO,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "11px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          The Three Skandhas
        </p>
        <figure
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "5 / 6",
            margin: "0 auto",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow:
              "0 6px 18px rgba(74, 56, 24, 0.12), 0 1px 4px rgba(74, 56, 24, 0.08)",
          }}
        >
          <Image
            src="/assets/learning/lesson-figures/three-skandhas-overview/figure-tri-skandha.svg"
            alt="Triangular manuscript diagram: Gaṇita, Horā, and Saṁhitā connected by golden threads on cream parchment"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: "contain", userSelect: "none" }}
          />
        </figure>
        <p
          className="text-center italic mt-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15px",
            color: INK_ON_CREAM_SECONDARY,
            maxWidth: "340px",
            lineHeight: 1.5,
          }}
        >
          Tap any of the three skandha rows to explore its curriculum mapping.
        </p>
      </div>

      <div
        className="p-5 flex flex-col"
        style={{ background: "transparent", borderRadius: "14px", border: "1px solid rgba(156, 122, 47, 0.20)" }}
      >
        {active ? (
          <ActiveDetail
            node={active}
            onClose={() => setActiveSlug(null)}
            reducedMotion={reducedMotion}
          />
        ) : (
          <RowList
            nodes={orderedNodes}
            onActivate={setActiveSlug}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
    </div>
  );
}

function RowList({ nodes, onActivate, reducedMotion }: { nodes: SkandhaNode[]; onActivate: (slug: SkandhaNode["slug"]) => void; reducedMotion: boolean }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p className="uppercase" style={{ color: INDIGO, letterSpacing: "0.16em", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
        Explore each skandha
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 500, color: INK_ON_CREAM_PRIMARY, lineHeight: 1.4, marginBottom: "8px" }}>
        The classical three-fold organisation
      </p>
      <div style={{ padding: "14px 16px", background: "rgba(232, 199, 114, 0.12)", borderLeft: "3px solid #A23A1E", borderRadius: "0 8px 8px 0", marginBottom: "8px" }}>
        <p className="uppercase mb-1" style={{ color: "#A23A1E", letterSpacing: "0.12em", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          Try this
        </p>
        <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "16px", color: INK_ON_CREAM_PRIMARY, lineHeight: 1.55 }}>
          Tap a skandha to read its foundational texts, curriculum modules, and stream-specific emphasis. Then ask: which skandha gets the most curriculum coverage — and is that coverage honest?
        </p>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
        {nodes.map((node) => (
          <li key={node.slug} style={{ margin: 0, padding: 0 }}>
            <button
              type="button"
              onClick={() => onActivate(node.slug)}
              className="gl-focus-ring gl-clickable"
              aria-label={`Open ${node.iast} detail`}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: reducedMotion ? "none" : "background 250ms cubic-bezier(0.32, 0.72, 0.24, 1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79, 111, 168, 0.10)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ width: "32px", height: "32px", flexShrink: 0, borderRadius: "50%", background: `linear-gradient(135deg, ${node.nodeColor}33, ${node.nodeColorDeep}55)`, color: node.nodeColorDeep, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-devanagari), serif", fontSize: "14px", fontWeight: 700 }}>
                {node.devanagari.charAt(0)}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "17px", fontWeight: 600, color: INK_ON_CREAM_PRIMARY, lineHeight: 1.3 }}>
                  {node.iast}
                </span>
                <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "13px", color: INK_ON_CREAM_SECONDARY, lineHeight: 1.4 }}>
                  {node.function}
                </span>
              </span>
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "13px", color: INK_ON_CREAM_MUTED, fontStyle: "italic", flexShrink: 0 }}>
                {node.positionLabel}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActiveDetail({ node, onClose, reducedMotion }: { node: SkandhaNode; onClose: () => void; reducedMotion: boolean }) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <button
        type="button"
        onClick={onClose}
        className="gl-focus-ring gl-clickable"
        aria-label="Back to all skandhas"
        style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "8px", background: "rgba(79, 111, 168, 0.10)", border: `1px solid ${INDIGO}44`, cursor: "pointer", transition: reducedMotion ? "none" : "background 250ms cubic-bezier(0.32, 0.72, 0.24, 1)" }}
      >
        <ArrowLeft size={14} style={{ color: INDIGO_DEEP }} />
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "13px", fontWeight: 600, color: INDIGO_DEEP }}>
          All three skandhas
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
        <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: `linear-gradient(135deg, ${node.nodeColor}33, ${node.nodeColorDeep}55)`, color: node.nodeColorDeep, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-devanagari), serif", fontSize: "18px", fontWeight: 700 }}>
          {node.devanagari.charAt(0)}
        </span>
        <div>
          <p lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "22px", color: node.nodeColorDeep, lineHeight: 1.2, margin: 0 }}>
            {node.devanagari}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "18px", color: INK_ON_CREAM_PRIMARY, fontWeight: 500, margin: 0, marginTop: "2px" }}>
            {node.iast}
          </p>
        </div>
      </div>

      <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "16px", color: INK_ON_CREAM_PRIMARY, lineHeight: 1.55, marginTop: "4px" }}>
        {node.coverage}
      </p>

      <div style={{ marginTop: "8px", padding: "12px 14px", background: "rgba(79, 111, 168, 0.08)", borderRadius: "8px", border: `1px solid ${INDIGO}22` }}>
        <p className="uppercase" style={{ color: INDIGO, letterSpacing: "0.12em", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "6px" }}>
          <Layers size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
          Structural role
        </p>
        <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "15px", color: INK_ON_CREAM_PRIMARY, lineHeight: 1.55 }}>
          {node.structuralRole}
        </p>
      </div>

      <div style={{ marginTop: "4px" }}>
        <p className="uppercase" style={{ color: GOLD_DEEP, letterSpacing: "0.12em", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "6px" }}>
          <BookOpen size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
          Foundational texts
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
          {node.foundationalTexts.map((t, i) => (
            <li key={i} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", color: INK_ON_CREAM_PRIMARY, lineHeight: 1.45 }}>
              <strong style={{ fontWeight: 600 }}>{t.title}</strong> — {t.author}
              {t.note && <em style={{ color: INK_ON_CREAM_MUTED, fontSize: "13px" }}> ({t.note})</em>}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "4px" }}>
        <p className="uppercase" style={{ color: GOLD_DEEP, letterSpacing: "0.12em", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "6px" }}>
          <MapPin size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
          Curriculum modules
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
          {node.curriculumModules.map((m, i) => (
            <li key={i} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", color: INK_ON_CREAM_PRIMARY, lineHeight: 1.45 }}>
              <span style={{ color: node.nodeColorDeep, fontWeight: 700 }}>{m.code}</span> {m.name}
              <span style={{ color: INK_ON_CREAM_MUTED, fontSize: "12px" }}> — {m.tier}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "4px" }}>
        <p className="uppercase" style={{ color: GOLD_DEEP, letterSpacing: "0.12em", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "6px" }}>
          Stream emphasis
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
          {node.streamEmphasis.map((se, i) => (
            <li key={i} style={{ padding: "8px 10px", background: "rgba(255, 252, 240, 0.55)", borderRadius: "6px", border: "1px solid rgba(156, 122, 47, 0.15)" }}>
              <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "13px", fontWeight: 700, color: INK_ON_CREAM_PRIMARY, marginBottom: "2px" }}>
                {se.stream}
              </p>
              <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "13px", color: INK_ON_CREAM_SECONDARY, lineHeight: 1.4, marginBottom: "2px" }}>
                {se.emphasis}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: INK_ON_CREAM_MUTED, lineHeight: 1.4 }}>
                {se.primaryTexts.join("; ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
