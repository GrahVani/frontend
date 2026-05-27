"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Users, BookOpen, Link2, Network, ArrowRight } from "lucide-react";
import { LINEAGES, EMPHASIS_META, CROSS_CUTTING_PATTERNS, type LineageThread } from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function LineageThreadsNetworkExplorer() {
  const [activeLineage, setActiveLineage] = useState<string>("bvb-delhi");
  const [showPatterns, setShowPatterns] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const lineage = LINEAGES.find((l) => l.slug === activeLineage)!;

  return (
    <div className="flex flex-col gap-6">
      {/* TOP — network diagram */}
      <div className="relative w-full rounded-xl overflow-hidden gl-surface-twilight-glass aspect-video">
        <Image
          src="/assets/learning/lesson-figures/modern-lineage-threads/figure-lineage-threads-network.png"
          alt="Network diagram of eight modern Vedic astrology lineage threads"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* BOTTOM — lineage explorer */}
      <div className="flex flex-col gap-4">
        <p
          className="uppercase"
          style={{
            color: "#7A5E1E",
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "11px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          Eight modern lineage threads
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "20px",
            fontWeight: 500,
            color: INK_PRIMARY,
            lineHeight: 1.4,
            marginBottom: "8px",
          }}
        >
          Modern lineage threads
        </p>

        {/* Lineage tabs */}
        <div className="flex flex-wrap gap-2">
          {LINEAGES.map((l) => (
            <button
              key={l.slug}
              type="button"
              onClick={() => setActiveLineage(l.slug)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={activeLineage === l.slug}
              style={{
                padding: "5px 10px",
                borderRadius: "6px",
                border: "none",
                background: activeLineage === l.slug ? `${l.color}18` : "rgba(255,255,255,0.03)",
                color: activeLineage === l.slug ? l.color : INK_SECONDARY,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: reducedMotion ? "none" : "all 200ms ease",
              }}
            >
              {l.shortName}
            </button>
          ))}
        </div>

        {/* Lineage detail card */}
        <LineageDetailCard lineage={lineage} reducedMotion={reducedMotion} />

        {/* Cross-cutting patterns toggle */}
        <button
          type="button"
          onClick={() => setShowPatterns((v) => !v)}
          className="gl-focus-ring gl-clickable"
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px dashed rgba(156,122,47,0.35)",
            background: "transparent",
            color: "#9C7A2F",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            marginTop: "4px",
          }}
        >
          <Network size={14} className="inline mr-2" style={{ verticalAlign: "text-bottom" }} />
          {showPatterns ? "Hide" : "Show"} cross-cutting lineage patterns
        </button>

        {showPatterns && (
          <div className="flex flex-col gap-3">
            {CROSS_CUTTING_PATTERNS.map((pattern, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "rgba(156,122,47,0.06)",
                  border: "1px solid rgba(156,122,47,0.15)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#9C7A2F",
                    marginBottom: "6px",
                  }}
                >
                  {pattern.title}
                </p>
                <div className="flex flex-col gap-1.5">
                  {pattern.examples.map((ex, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <ArrowRight size={11} style={{ color: "#9C7A2F", marginTop: "3px", flexShrink: 0 }} />
                      <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                        {ex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LineageDetailCard({ lineage, reducedMotion }: { lineage: LineageThread; reducedMotion: boolean }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${lineage.color}25`,
        transition: reducedMotion ? "none" : "all 200ms ease",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "20px",
            fontWeight: 600,
            color: lineage.color,
          }}
        >
          {lineage.name}
        </h3>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "3px 10px",
            borderRadius: "999px",
            background: lineage.reach === "broad" ? "rgba(58,140,90,0.12)" : lineage.reach === "concentrated" ? "rgba(79,111,168,0.10)" : "rgba(120,120,120,0.08)",
            color: lineage.reach === "broad" ? "#3A8C5A" : lineage.reach === "concentrated" ? "#4F6FA8" : "#888888",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          {lineage.reach === "broad" ? "Broad reach" : lineage.reach === "concentrated" ? "Concentrated" : "Regional"}
        </span>
      </div>

      {/* Founder */}
      <div className="flex items-start gap-2 mb-2">
        <Users size={14} style={{ color: INK_MUTED, marginTop: "3px", flexShrink: 0 }} />
        <p style={{ fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          <span style={{ color: INK_MUTED }}>Founder:</span>{" "}
          <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{lineage.founder}</span>
        </p>
      </div>

      {/* Regional school */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin size={14} style={{ color: INK_MUTED, marginTop: "3px", flexShrink: 0 }} />
        <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          <span style={{ color: INK_MUTED }}>Regional school:</span>{" "}
          {lineage.regionalSchool}
        </p>
      </div>

      {/* Stream emphases */}
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: INK_MUTED,
          marginBottom: "8px",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        Stream emphasis
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {lineage.streamEmphases.map((se) => {
          const meta = EMPHASIS_META[se.level];
          return (
            <div
              key={se.streamSlug}
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                background: meta.bg,
                borderLeft: `3px solid ${meta.color}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  {se.streamName}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: `${meta.color}20`,
                    color: meta.color,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  {meta.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teaching infrastructure */}
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: INK_MUTED,
          marginBottom: "8px",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        Teaching infrastructure
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {lineage.teachingInfrastructure.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <BookOpen size={12} style={{ color: lineage.color, marginTop: "3px", flexShrink: 0, opacity: 0.7 }} />
            <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* Distinctive features */}
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: INK_MUTED,
          marginBottom: "8px",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        Distinctive features
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {lineage.distinctiveFeatures.map((feat, i) => (
          <div key={i} className="flex items-start gap-2">
            <Link2 size={12} style={{ color: lineage.color, marginTop: "3px", flexShrink: 0, opacity: 0.7 }} />
            <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              {feat}
            </p>
          </div>
        ))}
      </div>

      {/* Sub-lineages (if any) */}
      {lineage.subLineages && (
        <div className="mb-4">
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: INK_MUTED,
              marginBottom: "8px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            Sub-lineages
          </p>
          <div className="flex flex-col gap-2">
            {lineage.subLineages.map((sl, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  background: "rgba(79,111,168,0.06)",
                  borderLeft: "3px solid #4F6FA8",
                }}
              >
                <p style={{ fontSize: "12px", fontWeight: 600, color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  {sl.name}
                </p>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: INK_MUTED }}>Lead:</span> {sl.lead} · {sl.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cross-references */}
      <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: INK_MUTED,
            marginBottom: "6px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Cross-references for engagement
        </p>
        <div className="flex flex-col gap-1">
          {lineage.crossReferences.map((cr, i) => (
            <p key={i} style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              · {cr}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
