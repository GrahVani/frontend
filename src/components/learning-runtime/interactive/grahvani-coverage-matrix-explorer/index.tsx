"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { COVERAGE_CELLS, STREAMS, DEPTH_META, NON_COVERAGE_ITEMS, type Depth } from "./data";

const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function GrahvaniCoverageMatrixExplorer() {
  const [activeStream, setActiveStream] = useState<string>("parashari");
  const [showNonCoverage, setShowNonCoverage] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const streamCells = COVERAGE_CELLS.filter((c) => {
    const s = STREAMS.find((s) => s.slug === activeStream);
    return s && c.stream === s.name;
  });

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-6"
      style={{ minHeight: "560px" }}
    >
      {/* LEFT — manuscript diagram */}
      <div
        className="relative rounded-xl overflow-hidden gl-surface-twilight-glass aspect-[2/3]"
      >
        <Image
          src="/assets/learning/lesson-figures/where-grahvani-sits-in-the-skandha-map/figure-grahvani-self-localisation.png"
          alt="Grahvani curriculum self-localisation within the Jyotiṣa skandha-map"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* RIGHT — coverage explorer */}
      <div className="flex flex-col gap-4">
        <p
          className="uppercase"
          style={{
            color: INDIGO,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "11px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          Curriculum coverage by stream
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
          Where Grahvani sits in the skandha-map
        </p>

        {/* Stream tabs */}
        <div className="flex flex-wrap gap-2">
          {STREAMS.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setActiveStream(s.slug)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={activeStream === s.slug}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: activeStream === s.slug ? `${s.color}18` : "rgba(255,255,255,0.03)",
                color: activeStream === s.slug ? s.color : INK_SECONDARY,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: reducedMotion ? "none" : "all 200ms ease",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Coverage cards */}
        <div className="flex flex-col gap-3">
          {streamCells.map((cell) => {
            const meta = DEPTH_META[cell.depth];
            return (
              <div
                key={`${cell.stream}-${cell.subBranch}`}
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: meta.bg,
                  borderLeft: `3px solid ${meta.color}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: INK_PRIMARY,
                    }}
                  >
                    {cell.subBranch}
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginLeft: "8px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: `${meta.color}20`,
                        color: meta.color,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                      }}
                    >
                      {meta.label}
                    </span>
                  </p>
                  <span
                    style={{
                      fontSize: "11px",
                      color: INK_MUTED,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    {cell.skandha}
                  </span>
                </div>
                {cell.modules.length > 0 && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "12px",
                      color: INK_SECONDARY,
                      lineHeight: 1.45,
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ color: INK_MUTED }}>Modules:</span>{" "}
                    {cell.modules.join(" · ")}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "13px",
                    color: INK_SECONDARY,
                    lineHeight: 1.5,
                  }}
                >
                  {cell.note}
                </p>
              </div>
            );
          })}
        </div>

        {/* Non-coverage toggle */}
        <button
          type="button"
          onClick={() => setShowNonCoverage((v) => !v)}
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
          {showNonCoverage ? "Hide" : "Show"} what the curriculum intentionally doesn't cover
        </button>

        {showNonCoverage && (
          <div className="flex flex-col gap-3">
            {NON_COVERAGE_ITEMS.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "rgba(120,120,120,0.05)",
                  borderLeft: "3px solid #888888",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "12px",
                    color: INK_SECONDARY,
                    lineHeight: 1.5,
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ color: INK_MUTED }}>Why not covered:</span> {item.why}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "11px",
                    color: INK_MUTED,
                    lineHeight: 1.45,
                  }}
                >
                  <span style={{ color: "#9C7A2F" }}>Cross-references:</span>{" "}
                  {item.crossRefs.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
