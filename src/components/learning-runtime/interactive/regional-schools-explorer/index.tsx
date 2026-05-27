"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Languages, Users, Globe, ArrowRight } from "lucide-react";
import { SCHOOLS, CONCENTRATION_META, CROSS_STREAM_PATTERNS, GLOBALISATION_CONNECTIONS, type RegionalSchool } from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function RegionalSchoolsExplorer() {
  const [activeSchool, setActiveSchool] = useState<string>("south-indian");
  const [showGlobalisation, setShowGlobalisation] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const school = SCHOOLS.find((s) => s.slug === activeSchool)!;

  return (
    <div className="flex flex-col gap-6">
      {/* TOP — regional schools map */}
      <div className="relative w-full rounded-xl overflow-hidden gl-surface-twilight-glass aspect-video">
        <Image
          src="/assets/learning/lesson-figures/regional-schools-and-lineages/figure-regional-schools-map.png"
          alt="Map of six Vedic astrology regional schools across India and the global diaspora"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* BOTTOM — school explorer */}
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
          Six regional schools
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
          Regional schools and lineages
        </p>

        {/* School tabs */}
        <div className="flex flex-wrap gap-2">
          {SCHOOLS.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setActiveSchool(s.slug)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={activeSchool === s.slug}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: activeSchool === s.slug ? `${s.color}18` : "rgba(255,255,255,0.03)",
                color: activeSchool === s.slug ? s.color : INK_SECONDARY,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: reducedMotion ? "none" : "all 200ms ease",
              }}
            >
              {s.shortName}
            </button>
          ))}
        </div>

        {/* School detail card */}
        <SchoolDetailCard school={school} reducedMotion={reducedMotion} />

        {/* Globalisation toggle */}
        <button
          type="button"
          onClick={() => setShowGlobalisation((v) => !v)}
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
          <Globe size={14} className="inline mr-2" style={{ verticalAlign: "text-bottom" }} />
          {showGlobalisation ? "Hide" : "Show"} modern-globalisation cross-regional connections
        </button>

        {showGlobalisation && (
          <div className="flex flex-col gap-2">
            {GLOBALISATION_CONNECTIONS.map((conn, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(120,120,120,0.05)",
                  borderLeft: "3px solid #9C7A2F",
                }}
              >
                <div className="flex items-center gap-2" style={{ fontSize: "12px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  <span style={{ color: "#4F6FA8", fontWeight: 600 }}>{conn.from}</span>
                  <ArrowRight size={12} style={{ color: INK_MUTED }} />
                  <span style={{ color: "#7A5E1E", fontWeight: 600 }}>{conn.to}</span>
                </div>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45, marginTop: "2px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                  {conn.note}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Cross-stream patterns summary */}
        <div
          style={{
            marginTop: "8px",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "rgba(156,122,47,0.06)",
            border: "1px solid rgba(156,122,47,0.15)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9C7A2F",
              marginBottom: "8px",
            }}
          >
            Cross-stream regional emphasis
          </p>
          <div className="flex flex-col gap-2">
            {CROSS_STREAM_PATTERNS.map((p, i) => (
              <div key={i} className="flex items-center justify-between" style={{ fontSize: "12px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{p.stream}</span>
                <span style={{ color: INK_MUTED }}>→</span>
                <span style={{ color: INK_SECONDARY }}>{p.school}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolDetailCard({ school, reducedMotion }: { school: RegionalSchool; reducedMotion: boolean }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${school.color}25`,
        transition: reducedMotion ? "none" : "all 200ms ease",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "20px",
            fontWeight: 600,
            color: school.color,
          }}
        >
          {school.name}
        </h3>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "3px 10px",
            borderRadius: "999px",
            background: school.reach === "broad" ? "rgba(58,140,90,0.12)" : "rgba(79,111,168,0.10)",
            color: school.reach === "broad" ? "#3A8C5A" : "#4F6FA8",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          {school.reach === "broad" ? "Broad reach" : "Concentrated"}
        </span>
      </div>

      {/* Geographic */}
      <div className="flex items-start gap-2 mb-2">
        <MapPin size={14} style={{ color: INK_MUTED, marginTop: "3px", flexShrink: 0 }} />
        <p style={{ fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          {school.geographic}
        </p>
      </div>

      {/* Languages */}
      <div className="flex items-start gap-2 mb-3">
        <Languages size={14} style={{ color: INK_MUTED, marginTop: "3px", flexShrink: 0 }} />
        <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          {school.languages.join(" · ")}
        </p>
      </div>

      {/* Stream concentrations */}
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
        Stream concentrations
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {school.streamConcentrations.map((sc) => {
          const meta = CONCENTRATION_META[sc.concentration];
          return (
            <div
              key={sc.streamSlug}
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                background: meta.bg,
                borderLeft: `3px solid ${meta.color}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  {sc.streamName}
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
              <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                {sc.note}
              </p>
            </div>
          );
        })}
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
      <div className="flex flex-col gap-2">
        {school.distinctiveFeatures.map((feat, i) => (
          <div key={i} className="flex items-start gap-2">
            <Users size={12} style={{ color: school.color, marginTop: "3px", flexShrink: 0, opacity: 0.7 }} />
            <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              {feat}
            </p>
          </div>
        ))}
      </div>

      {/* Teachers (Western-Vedic-fusion only) */}
      {school.teachers && (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
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
            Major teachers & lineages
          </p>
          <div className="flex flex-wrap gap-1.5">
            {school.teachers.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  background: "rgba(122,94,30,0.10)",
                  color: "#7A5E1E",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
