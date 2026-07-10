/**
 * Vedāṅga Relationship Diagram — Lesson 2's primary interactive.
 *
 * Mirrors L1's VedangaBodyMap spatial pattern EXACTLY:
 *   LEFT card (~1fr) : the bespoke lotus painting + figcaption — purely
 *                       contemplative, NO click overlays. The painting has no
 *                       baked-in interactive affordances, so the click logic
 *                       lives on the right instead of as invisible overlays.
 *   RIGHT card (340px): a paired panel containing eyebrow + statement +
 *                       TRY THIS callout + "EACH TAP REVEALS" schema preview +
 *                       six CLEARLY CLICKABLE Vedāṅga rows (the legend itself
 *                       is the interactive surface). Click a row → ActiveDetail
 *                       replaces the rows-list + schema with that Vedāṅga's
 *                       full detail (function, cluster chips, Jyotiṣa
 *                       interlock), with a Close button to return.
 *
 * This is the L2-shaped adaptation of L1's BodyMap pattern: same composition,
 * same visual language, just the clickable surface migrated from
 * baked-in-glyphs-on-painting to visible-rows-in-side-panel.
 *
 * Constitutional invariants honoured:
 *   - gl-focus-ring on every clickable
 *   - prefers-reduced-motion respected
 *   - All sizes from the chrome token universe (28/22/18/15/13/11)
 *   - No internal h3 inside the interactive (constitution §32.4 rule 2)
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { VEDANGA_NODES, CLUSTERS, type VedangaNode } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const JADE = "#3A8C5A";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

/** Pāṇinīya-Śikṣā classical order. Jyotiṣa last (anchored at row 6). */
const ROW_ORDER: VedangaNode["slug"][] = [
  "shiksha",
  "kalpa",
  "vyakarana",
  "nirukta",
  "chandas",
  "jyotisha",
];

export function VedangaRelationshipDiagram() {
  const [activeSlug, setActiveSlug] = useState<VedangaNode["slug"] | null>(null);
  const [clusterOverlay, setClusterOverlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const orderedNodes = ROW_ORDER.map(
    (slug) => VEDANGA_NODES.find((n) => n.slug === slug)!,
  );
  const active = activeSlug
    ? VEDANGA_NODES.find((n) => n.slug === activeSlug) ?? null
    : null;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-stretch"
      data-interactive="vedanga-relationship-diagram"
    >
      {/* ────────── LEFT: bespoke lotus painting (contemplative) ────────── */}
      <div
        className="gl-surface-twilight-glass p-6 flex flex-col items-center"
        style={{ minHeight: "560px" }}
      >
        <p
          className="uppercase mb-4"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          The Vedāṅga Lotus
        </p>

        <figure
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "380px",
            aspectRatio: "1024 / 1536",
            margin: "0 auto",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow:
              "0 1px 0 rgba(255, 255, 255, 0.7) inset, 0 6px 18px rgba(74, 56, 24, 0.12), 0 1px 4px rgba(74, 56, 24, 0.08)",
          }}
        >
          <Image
            src="/assets/learning/six-vedangas-lotus.png"
            alt="A six-petaled golden lotus on cream parchment, an open palm-leaf Veda manuscript at its centre, each petal carrying a faint cluster-coloured aura at its tip, and the top petal alone glowing jade — representing the six Vedāṅgas as a coordinated system with Jyotiṣa interlocking through all five other limbs."
            fill
            priority
            sizes="(max-width: 768px) 100vw, 380px"
            style={{
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </figure>

        <p
          className="text-center italic mt-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: INK_ON_CREAM_SECONDARY,
            maxWidth: "320px",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          The six Vedāṅgas as a coordinated lotus — each petal a limb,
          the centre an open Veda manuscript, the jade-aurad top petal
          marking <em>Jyotiṣa</em>.
        </p>

        {/* Textbook-order strip fills the lower card with classical context */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            width: "100%",
            borderTop: `1px dashed ${GOLD}55`,
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.20em",
              color: GOLD_DEEP,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "6px",
              textAlign: "center",
            }}
          >
            In the classical Pāṇinīya Śikṣā order
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "13.5px",
              color: INK_ON_CREAM_SECONDARY,
              textAlign: "center",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Śikṣā · Kalpa · Vyākaraṇa · Nirukta · Chandas ·{" "}
            <strong
              style={{ color: GOLD_DEEP, fontWeight: 600, fontStyle: "normal" }}
            >
              Jyotiṣa
            </strong>
            <span aria-hidden style={{ color: JADE, marginLeft: "4px" }}>
              ●
            </span>
          </p>
        </div>
      </div>

      {/* ────────── RIGHT: paired interactive panel ────────── */}
      <aside
        className="gl-surface-twilight-glass p-6 flex flex-col"
        aria-live="polite"
        style={{ minHeight: "560px" }}
      >
        {active ? (
          <ActiveDetail
            node={active}
            onClose={() => setActiveSlug(null)}
            clusterOverlay={clusterOverlay}
            onToggleCluster={() => setClusterOverlay((v) => !v)}
          />
        ) : (
          <GuidancePanel
            orderedNodes={orderedNodes}
            onSelect={setActiveSlug}
            clusterOverlay={clusterOverlay}
            onToggleCluster={() => setClusterOverlay((v) => !v)}
            reducedMotion={reducedMotion}
          />
        )}
      </aside>
    </div>
  );
}

/* ────────────────────── Guidance panel (idle) ───────────────────────── */

function GuidancePanel({
  orderedNodes,
  onSelect,
  clusterOverlay,
  onToggleCluster,
  reducedMotion,
}: {
  orderedNodes: VedangaNode[];
  onSelect: (slug: VedangaNode["slug"]) => void;
  clusterOverlay: boolean;
  onToggleCluster: () => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Six petals, one lotus
        </p>
        <ClusterToggleCompact on={clusterOverlay} onToggle={onToggleCluster} />
      </header>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "18px",
          lineHeight: 1.4,
          color: INK_ON_CREAM_PRIMARY,
          margin: 0,
        }}
      >
        Each Vedāṅga is a petal of a single lotus — distinct in function, rooted in a shared Vedic centre.
      </p>

      {/* TRY THIS callout — mirrors L1's vermilion-bordered prompt */}
      <div
        style={{
          padding: "12px 14px",
          background: "rgba(232, 199, 114, 0.12)",
          borderLeft: `3px solid ${VERMILION}`,
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          className="uppercase mb-1"
          style={{
            color: VERMILION,
            letterSpacing: "0.12em",
            fontWeight: 600,
            fontSize: "11px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          Try this
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "14.5px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Tap the row marked with a{" "}
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: JADE,
              boxShadow: `0 0 4px ${JADE}88`,
              verticalAlign: "middle",
              marginRight: "1px",
            }}
          />{" "}
          jade dot —{" "}
          <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>
            Jyotiṣa
          </strong>
          . Its detail reveals the five Vedāṅga interlocks at the heart of modern practice.
        </p>
      </div>

      {/* EACH TAP REVEALS schema — mirrors L1's dashed-bordered preview */}
      <div
        aria-hidden
        style={{
          padding: "12px 14px",
          border: "1px dashed rgba(156, 122, 47, 0.32)",
          borderRadius: "10px",
          background: "rgba(255, 252, 240, 0.45)",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "11px",
            color: INK_ON_CREAM_SECONDARY,
            letterSpacing: "0.18em",
            fontWeight: 700,
            marginBottom: "8px",
            textAlign: "center",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Each tap reveals
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {[
            ["function", "what it studies of the Veda"],
            ["clusters", "recitation, meaning, or action"],
            ["interlock", "how it couples with Jyotiṣa"],
          ].map(([label, gloss]) => (
            <li
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(70px, 76px) 1fr",
                gap: "10px",
                fontSize: "13px",
                lineHeight: 1.45,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  color: INK_ON_CREAM_SECONDARY,
                  textAlign: "right",
                  fontSize: "13px",
                }}
              >
                {label}
              </span>
              <span style={{ color: INK_ON_CREAM_SECONDARY, fontFamily: "var(--font-cormorant), serif" }}>
                {gloss}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Clickable Vedāṅga rows — the actual interactive surface */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {orderedNodes.map((v, i) => {
          const isJyotisha = v.slug === "jyotisha";
          const primaryCluster = CLUSTERS.find((c) => c.slug === v.clusters[0]);
          const accent = clusterOverlay
            ? v.clusters.length > 1
              ? "#A87830"
              : primaryCluster?.color ?? GOLD
            : GOLD;
          return (
            <li key={v.slug} style={{ margin: 0, padding: 0 }}>
              <button
                type="button"
                onClick={() => onSelect(v.slug)}
                aria-label={`${v.iast} — ${v.bodyPart}. ${v.function}.`}
                className="gl-focus-ring gl-clickable"
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "64px 1fr 1fr 14px",
                  gap: "8px",
                  alignItems: "baseline",
                  padding: "10px 6px 10px 10px",
                  background: "transparent",
                  border: "none",
                  borderLeft: `3px solid ${accent}`,
                  borderBottom:
                    i < orderedNodes.length - 1
                      ? "1px solid rgba(156, 122, 47, 0.18)"
                      : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "15px",
                  color: INK_ON_CREAM_SECONDARY,
                  transition: reducedMotion ? "none" : "background 160ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!reducedMotion) {
                    e.currentTarget.style.background = "rgba(232, 199, 114, 0.10)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    color: INK_ON_CREAM_MUTED,
                  }}
                >
                  {v.bodyPart}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: INK_ON_CREAM_PRIMARY,
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "16px",
                  }}
                >
                  {v.iast}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    color: INK_ON_CREAM_MUTED,
                  }}
                >
                  {v.clusters.join(" + ")}
                </span>
                {isJyotisha ? (
                  <span
                    aria-hidden
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: JADE,
                      boxShadow: `0 0 6px ${JADE}88`,
                      alignSelf: "center",
                      justifySelf: "end",
                    }}
                  />
                ) : (
                  <span aria-hidden style={{ color: INK_ON_CREAM_MUTED, fontSize: "12px", justifySelf: "end" }}>
                    →
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ────────────────────── Active-detail panel ───────────────────────── */

function ActiveDetail({
  node,
  onClose,
  clusterOverlay,
  onToggleCluster,
}: {
  node: VedangaNode;
  onClose: () => void;
  clusterOverlay: boolean;
  onToggleCluster: () => void;
}) {
  const clusters = CLUSTERS.filter((c) => node.clusters.includes(c.slug));
  const isJyotisha = node.slug === "jyotisha";
  const primaryCluster = clusters[0];

  return (
    <div className="flex flex-col gap-3 h-full">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to all six Vedāṅgas"
          className="gl-focus-ring gl-clickable"
          style={{
            background: "transparent",
            border: `1px solid ${GOLD}66`,
            color: GOLD_DEEP,
            borderRadius: "999px",
            padding: "5px 12px",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          ← All six
        </button>
        <ClusterToggleCompact on={clusterOverlay} onToggle={onToggleCluster} />
      </header>

      <div>
        <p
          className="uppercase"
          style={{
            fontSize: "12px",
            letterSpacing: "0.18em",
            color: primaryCluster ? primaryCluster.color : GOLD,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          {node.bodyPart}
          {!isJyotisha && ` · ${node.modernPractice} in practice`}
        </p>
        <h4
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "22px",
            fontWeight: 500,
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.2,
            marginBottom: "2px",
          }}
        >
          {node.iast}{" "}
          <span
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "18px",
              color: GOLD_DEEP,
              marginLeft: "8px",
              fontWeight: 400,
            }}
          >
            {node.devanagari}
          </span>
        </h4>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "15px",
            color: INK_ON_CREAM_SECONDARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {node.function}
        </p>
      </div>

      {clusters.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {clusters.map((c) => (
            <span
              key={c.slug}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "999px",
                background: `${c.color}1f`,
                border: `1px solid ${c.color}66`,
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: c.color,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: c.color,
                }}
              />
              {c.label}
            </span>
          ))}
        </div>
      )}

      {!isJyotisha && node.jyotishaInterlock && (
        <div
          style={{
            padding: "12px 14px",
            background: "rgba(232, 199, 114, 0.12)",
            borderLeft: `3px solid ${VERMILION}`,
            borderRadius: "0 8px 8px 0",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: VERMILION,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "6px",
            }}
          >
            Jyotiṣa interlock
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "14px",
              color: INK_ON_CREAM_PRIMARY,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {node.jyotishaInterlock}
          </p>
        </div>
      )}

      {isJyotisha && (
        <div
          style={{
            padding: "12px 14px",
            background: "rgba(232, 199, 114, 0.12)",
            borderLeft: `3px solid ${VERMILION}`,
            borderRadius: "0 8px 8px 0",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: VERMILION,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "6px",
            }}
          >
            Five active interlocks
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "14px",
              color: INK_ON_CREAM_PRIMARY,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Jyotiṣa interlocks with each of the other five Vedāṅgas in modern
            practice: mantra (Śikṣā), citation (Vyākaraṇa), ritual timing
            (Kalpa), term-etymology (Nirukta), verse-metre (Chandas). Tap{" "}
            <strong style={{ fontWeight: 600, fontStyle: "normal" }}>← All six</strong>{" "}
            above to read each coupling.
          </p>
        </div>
      )}

      {/* vedasya cakṣuḥ ceremonial flourish — Jyotiṣa only, mirrors L1's bonus
          reveal pattern */}
      {isJyotisha && (
        <div
          className="mt-2 text-center p-4 rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(244, 199, 123, 0.22) 0%, rgba(232, 168, 92, 0.14) 100%)",
            border: "1px solid rgba(156, 122, 47, 0.35)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.55) inset, 0 4px 14px rgba(232, 168, 92, 0.18)",
            marginTop: "auto",
          }}
        >
          <p
            lang="sa-Latn"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "22px",
              color: VERMILION,
              fontWeight: 600,
              marginBottom: "3px",
            }}
          >
            vedasya cakṣuḥ
          </p>
          <p
            className="text-xs"
            style={{
              color: INK_ON_CREAM_MUTED,
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
            }}
          >
            the eye of the Veda
          </p>
        </div>
      )}
    </div>
  );
}

/* ────────────────────── Cluster toggle (compact pill) ───────────────────────── */

function ClusterToggleCompact({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className="gl-clickable gl-focus-ring"
      style={{
        background: on
          ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`
          : "transparent",
        color: on ? "#1A1408" : GOLD_DEEP,
        border: `1.5px solid ${on ? GOLD : `${GOLD}88`}`,
        borderRadius: "999px",
        padding: "5px 10px",
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: on ? `0 4px 10px ${GOLD}44` : "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        whiteSpace: "nowrap",
      }}
    >
      <Sparkles size={10} />
      Clusters {on ? "on" : "off"}
    </button>
  );
}
