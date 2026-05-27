"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, BookOpen, Scale, Sparkles, Crosshair, ChevronRight } from "lucide-react";
import { APPROACHES, CONVERGENCE_FINDINGS, DIVERGENCE_DIMENSIONS, UNIQUE_CONTRIBUTIONS, type LineageApproach } from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function ThreeLineageComparisonChartAnalyzer() {
  const [activeApproach, setActiveApproach] = useState<string>("tamil-nadu-kp");
  const [showComparison, setShowComparison] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const approach = APPROACHES.find((a) => a.slug === activeApproach)!;

  return (
    <div className="flex flex-col gap-6">
      {/* TOP — demonstration chart */}
      <div className="relative w-full rounded-xl overflow-hidden gl-surface-twilight-glass aspect-video">
        <Image
          src="/assets/learning/lesson-figures/lineage-matters-worked-example/figure-demonstration-chart-south-indian.png"
          alt="South Indian format Vedic astrology demonstration chart — Cancer lagna with nine planets placed"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* BOTTOM — lineage approach explorer */}
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
          Three lineage approaches
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
          Same chart, three lineages
        </p>

        {/* Approach tabs */}
        <div className="flex flex-wrap gap-2">
          {APPROACHES.map((a) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => setActiveApproach(a.slug)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={activeApproach === a.slug}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: activeApproach === a.slug ? `${a.color}18` : "rgba(255,255,255,0.03)",
                color: activeApproach === a.slug ? a.color : INK_SECONDARY,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: reducedMotion ? "none" : "all 200ms ease",
              }}
            >
              {a.shortName}
            </button>
          ))}
        </div>

        {/* Approach detail card */}
        <ApproachDetailCard approach={approach} reducedMotion={reducedMotion} />

        {/* Comparison toggle */}
        <button
          type="button"
          onClick={() => setShowComparison((v) => !v)}
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
          <Scale size={14} className="inline mr-2" style={{ verticalAlign: "text-bottom" }} />
          {showComparison ? "Hide" : "Show"} convergence + divergence + unique contributions
        </button>

        {showComparison && <ComparisonPanel reducedMotion={reducedMotion} />}
      </div>
    </div>
  );
}

function ApproachDetailCard({ approach, reducedMotion }: { approach: LineageApproach; reducedMotion: boolean }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${approach.color}25`,
        transition: reducedMotion ? "none" : "all 200ms ease",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "18px",
            fontWeight: 600,
            color: approach.color,
          }}
        >
          {approach.name}
        </h3>
      </div>

      {/* Lineage context */}
      <p
        style={{
          fontSize: "12px",
          color: INK_SECONDARY,
          lineHeight: 1.55,
          marginBottom: "12px",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {approach.lineageContext}
      </p>

      {/* Chart conventions */}
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
        Chart-erection conventions
      </p>
      <div className="flex flex-col gap-1.5 mb-4">
        {approach.chartConventions.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <MapPin size={11} style={{ color: approach.color, marginTop: "3px", flexShrink: 0, opacity: 0.7 }} />
            <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              {c}
            </p>
          </div>
        ))}
      </div>

      {/* Primary lens */}
      <div
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          background: `${approach.color}10`,
          borderLeft: `3px solid ${approach.color}`,
          marginBottom: "12px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: approach.color,
            marginBottom: "4px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Primary analytical lens
        </p>
        <p style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          {approach.primaryLens}
        </p>
      </div>

      {/* Analytical details */}
      {approach.analyticalDetails.map((detail, i) => (
        <div key={i} className="mb-3">
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
            {detail.title}
          </p>
          <div className="flex flex-col gap-1.5">
            {detail.items.map((item, j) => (
              <div key={j} className="flex items-start gap-2">
                <ChevronRight size={11} style={{ color: approach.color, marginTop: "3px", flexShrink: 0, opacity: 0.7 }} />
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Predictive judgments */}
      <div className="mb-3">
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
          Distinctive predictive judgments
        </p>
        <div className="flex flex-col gap-2">
          {approach.predictiveJudgments.map((pj, i) => (
            <div
              key={i}
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(156,122,47,0.10)",
              }}
            >
              <p style={{ fontSize: "11px", fontWeight: 600, color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "2px" }}>
                {pj.area}
              </p>
              <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                {pj.judgment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-references */}
      <div className="mb-3">
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
          Cross-references
        </p>
        <div className="flex flex-col gap-1">
          {approach.crossReferences.map((cr, i) => (
            <div key={i} className="flex items-start gap-2">
              <BookOpen size={11} style={{ color: approach.color, marginTop: "2px", flexShrink: 0, opacity: 0.7 }} />
              <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                {cr}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Remedial defaults */}
      <div
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          background: "rgba(122,94,30,0.06)",
          border: "1px solid rgba(156,122,47,0.15)",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#9C7A2F",
            marginBottom: "4px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Remedial recommendations
        </p>
        <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          {approach.remedialDefaults}
        </p>
      </div>
    </div>
  );
}

function ComparisonPanel({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeView, setActiveView] = useState<"convergence" | "divergence" | "unique">("convergence");

  return (
    <div
      className="flex flex-col gap-3"
      style={{
        padding: "14px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(156,122,47,0.15)",
        transition: reducedMotion ? "none" : "all 200ms ease",
      }}
    >
      <div className="flex flex-wrap gap-2">
        {[
          { key: "convergence" as const, label: "Convergence", icon: Sparkles },
          { key: "divergence" as const, label: "Divergence", icon: Crosshair },
          { key: "unique" as const, label: "Unique", icon: Sparkles },
        ].map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setActiveView(v.key)}
            className="gl-focus-ring gl-clickable flex items-center"
            aria-pressed={activeView === v.key}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "none",
              background: activeView === v.key ? "rgba(156,122,47,0.12)" : "transparent",
              color: activeView === v.key ? "#9C7A2F" : INK_MUTED,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: reducedMotion ? "none" : "all 200ms ease",
            }}
          >
            <v.icon size={12} className="mr-1.5" />
            {v.label}
          </button>
        ))}
      </div>

      {activeView === "convergence" && (
        <div className="flex flex-col gap-2">
          {CONVERGENCE_FINDINGS.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                background: "rgba(58,140,90,0.08)",
                borderLeft: "3px solid #3A8C5A",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 600, color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
                {f.theme}
              </p>
              <div className="flex flex-col gap-1">
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: "#4F6FA8", fontWeight: 500 }}>KP:</span> {f.kp}
                </p>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: "#C8412E", fontWeight: 500 }}>BVB:</span> {f.bvb}
                </p>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: "#3A8C5A", fontWeight: 500 }}>WVF:</span> {f.western}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === "divergence" && (
        <div className="flex flex-col gap-2">
          {DIVERGENCE_DIMENSIONS.map((d, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                background: "rgba(200,65,46,0.04)",
                borderLeft: "3px solid #C8412E",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 600, color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
                {d.dimension}
              </p>
              <div className="flex flex-col gap-1">
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: "#4F6FA8", fontWeight: 500 }}>KP:</span> {d.kp}
                </p>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: "#C8412E", fontWeight: 500 }}>BVB:</span> {d.bvb}
                </p>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: "#3A8C5A", fontWeight: 500 }}>WVF:</span> {d.western}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === "unique" && (
        <div className="flex flex-col gap-2">
          {UNIQUE_CONTRIBUTIONS.map((u, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                background: "rgba(79,111,168,0.06)",
                borderLeft: "3px solid #4F6FA8",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 600, color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
                {u.lineage}
              </p>
              <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                {u.contribution}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
