"use client";

/**
 * KarakaOverlayReader — Kāraka Overlay: the AD-Lord Shapes the MD
 *
 * §7 interactive for Lesson 10.4.2.
 *
 * Lets the learner pick an MD-lord and an AD-lord, see the MD's life-phase
 * quality and the AD's domain-flavour, and read their overlaid theme.
 * Detects multi-kāraka clusters and provides "same AD, different MD" comparison.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS } from "../dasha-timeline/data";
import {
  GRAHA_KARAKAS,
  computeOverlay,
  WORKED_OVERLAYS,
} from "./data";
import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  ArrowRightLeft,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const BLUE = "#356CAB";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function lordBySlug(slug: GrahaSlug) {
  return DASHA_LORDS.find((l) => l.grahaSlug === slug)!;
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

function LordSelector({
  label,
  labelIAST,
  value,
  onChange,
}: {
  label: string;
  labelIAST: string;
  value: number;
  onChange: (idx: number) => void;
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: INK_MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "0.35rem",
        }}
      >
        {label} <IAST>{labelIAST}</IAST>
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg px-2.5 py-2 text-sm"
        style={{
          background: "var(--gl-surface-2, #F5EDD8)",
          border: `1px solid ${HAIRLINE}`,
          color: INK_PRIMARY,
          fontWeight: 700,
        }}
      >
        {DASHA_LORDS.map((l, i) => (
          <option key={l.grahaSlug} value={i}>
            {l.abbr} — {l.name} ({l.nameIAST})
          </option>
        ))}
      </select>
    </label>
  );
}

function DomainChip({ domain, color }: { domain: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.3rem 0.6rem",
        borderRadius: 6,
        background: `${color}14`,
        border: `1px solid ${color}35`,
        color,
        fontSize: "0.78rem",
        fontWeight: 800,
      }}
    >
      {domain}
    </span>
  );
}

function ClusterCard({
  cluster,
  activeSlugs,
}: {
  cluster: ReturnType<typeof computeOverlay>["triggeredClusters"][number];
  activeSlugs: Set<GrahaSlug>;
}) {
  const matchCount = cluster.grahaSlugs.filter((s) => activeSlugs.has(s)).length;
  return (
    <div
      style={{
        borderRadius: 10,
        background: `${BLUE}10`,
        border: `1.5px solid ${BLUE}35`,
        padding: "0.85rem 1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
        <Zap size={14} style={{ color: BLUE }} />
        <span style={{ fontSize: "0.8rem", fontWeight: 950, color: BLUE }}>
          {cluster.label} <span style={{ fontWeight: 500 }}>(<IAST>{cluster.labelIAST}</IAST>)</span>
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.68rem",
            fontWeight: 800,
            color: INK_MUTED,
            background: `${BLUE}18`,
            padding: "0.15rem 0.4rem",
            borderRadius: 4,
          }}
        >
          {matchCount}/{cluster.grahaSlugs.length} match
        </span>
      </div>
      <p style={{ margin: 0, fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {cluster.signal}
      </p>
      <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
        {cluster.grahaSlugs.map((s) => {
          const l = lordBySlug(s);
          const isActive = activeSlugs.has(s);
          return (
            <span
              key={s}
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: isActive ? l.color : INK_MUTED,
                background: isActive ? `${l.color}14` : "transparent",
                border: `1px solid ${isActive ? `${l.color}40` : HAIRLINE}`,
                padding: "0.2rem 0.45rem",
                borderRadius: 5,
              }}
            >
              {l.abbr}
            </span>
          );
        })}
        {cluster.houseLords.map((h) => (
          <span
            key={h}
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              color: INK_MUTED,
              border: `1px dashed ${HAIRLINE}`,
              padding: "0.2rem 0.45rem",
              borderRadius: 5,
            }}
          >
            {h}th-lord
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function KarakaOverlayReader() {
  const [mdIndex, setMdIndex] = useState(6); // Jupiter
  const [adIndex, setAdIndex] = useState(1); // Venus
  const [compareMdIndex, setCompareMdIndex] = useState<number | null>(null);

  const mdLord = DASHA_LORDS[mdIndex];
  const adLord = DASHA_LORDS[adIndex];
  const mdKaraka = GRAHA_KARAKAS[mdLord.grahaSlug];
  const adKaraka = GRAHA_KARAKAS[adLord.grahaSlug];

  const overlay = useMemo(
    () => computeOverlay(mdLord.grahaSlug, adLord.grahaSlug),
    [mdLord.grahaSlug, adLord.grahaSlug]
  );

  const compareOverlay = useMemo(() => {
    if (compareMdIndex == null) return null;
    return computeOverlay(DASHA_LORDS[compareMdIndex].grahaSlug, adLord.grahaSlug);
  }, [compareMdIndex, adLord.grahaSlug]);

  const activeSlugs = new Set([mdLord.grahaSlug, adLord.grahaSlug]);

  const loadExample = (ex: (typeof WORKED_OVERLAYS)[number]) => {
    const mdIdx = DASHA_LORDS.findIndex((l) => l.grahaSlug === ex.mdSlug);
    const adIdx = DASHA_LORDS.findIndex((l) => l.grahaSlug === ex.adSlug);
    if (mdIdx >= 0) setMdIndex(mdIdx);
    if (adIdx >= 0) setAdIndex(adIdx);
    setCompareMdIndex(null);
  };

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: "20px",
        color: INK_PRIMARY,
      }}
      data-interactive="karaka-overlay-reader"
    >
      {/* Header */}
      <div className="mb-4">
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: INK_MUTED,
          }}
        >
          Kāraka overlay interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Kāraka</IAST> Overlay: AD-Lord Shapes the MD
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          The MD-lord sets the life-phase quality; the AD-lord's significations give the specific domain-flavour.
        </p>
      </div>

      {/* Lord selectors */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <LordSelector
          label="Mahādaśā lord"
          labelIAST="Mahādaśā"
          value={mdIndex}
          onChange={(i) => {
            setMdIndex(i);
            setCompareMdIndex(null);
          }}
        />
        <LordSelector
          label="Antardaśā lord"
          labelIAST="Antardaśā"
          value={adIndex}
          onChange={(i) => {
            setAdIndex(i);
            setCompareMdIndex(null);
          }}
        />
      </div>

      {/* MD quality + AD flavour cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          gap: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        {/* MD quality */}
        <div
          style={{
            borderRadius: 12,
            background: `${mdLord.color}10`,
            border: `1.5px solid ${mdLord.color}40`,
            padding: "1.1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Layers size={15} style={{ color: mdLord.color }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: mdLord.color,
              }}
            >
              MD life-phase quality
            </span>
          </div>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: mdLord.color,
              fontFamily: "var(--font-cormorant), serif",
              marginBottom: "0.4rem",
            }}
          >
            <IAST>{mdLord.nameIAST}</IAST> mahādaśā
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {mdKaraka.mdQuality}
          </p>
          <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {mdKaraka.domains.slice(0, 4).map((d) => (
              <DomainChip key={d} domain={d} color={mdLord.color} />
            ))}
          </div>
        </div>

        {/* AD flavour */}
        <div
          style={{
            borderRadius: 12,
            background: `${adLord.color}10`,
            border: `1.5px solid ${adLord.color}40`,
            padding: "1.1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Sparkles size={15} style={{ color: adLord.color }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: adLord.color,
              }}
            >
              AD domain-flavour
            </span>
          </div>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: adLord.color,
              fontFamily: "var(--font-cormorant), serif",
              marginBottom: "0.4rem",
            }}
          >
            <IAST>{adLord.nameIAST}</IAST> antardaśā
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {adKaraka.essence}
          </p>
          <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {adKaraka.domains.slice(0, 4).map((d) => (
              <DomainChip key={d} domain={d} color={adLord.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Overlay reading */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `2px solid ${GOLD_ACCENT}40`,
          padding: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <ArrowRightLeft size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Overlay reading
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "1.15rem",
            color: INK_PRIMARY,
            fontFamily: "var(--font-cormorant), serif",
            lineHeight: 1.45,
            fontWeight: 600,
          }}
        >
          {overlay.reading}
        </p>
        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: "0.8rem",
            color: INK_MUTED,
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          {mdLord.name} colours the era; {adLord.name} names what is active right now.
        </p>
      </div>

      {/* Clusters */}
      {overlay.triggeredClusters.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
            <Target size={16} style={{ color: BLUE }} />
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: BLUE,
              }}
            >
              Multi-kāraka clusters detected
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "0.6rem" }}>
            {overlay.triggeredClusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} activeSlugs={activeSlugs} />
            ))}
          </div>
        </div>
      )}

      {/* Same AD, different MD comparison */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <ArrowRightLeft size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Same AD, different MD — compare
          </span>
        </div>

        <label style={{ display: "block", marginBottom: "0.6rem" }}>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: INK_MUTED,
              textTransform: "uppercase",
            }}
          >
            Compare under a different mahādaśā lord
          </span>
          <select
            value={compareMdIndex ?? ""}
            onChange={(e) => setCompareMdIndex(e.target.value === "" ? null : Number(e.target.value))}
            className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
            style={{
              background: "var(--gl-surface-2, #F5EDD8)",
              border: `1px solid ${HAIRLINE}`,
              color: INK_PRIMARY,
            }}
          >
            <option value="">— Select a comparison MD —</option>
            {DASHA_LORDS.map((l, i) => (
              <option key={l.grahaSlug} value={i} disabled={i === mdIndex}>
                {l.abbr} — {l.name} ({l.nameIAST})
              </option>
            ))}
          </select>
        </label>

        {compareOverlay && compareMdIndex != null && (
          <div
            style={{
              borderRadius: 10,
              background: `${DASHA_LORDS[compareMdIndex].color}10`,
              border: `1.5px solid ${DASHA_LORDS[compareMdIndex].color}40`,
              padding: "0.85rem 1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: DASHA_LORDS[compareMdIndex].color,
                fontFamily: "var(--font-cormorant), serif",
                marginBottom: "0.3rem",
              }}
            >
              <IAST>{DASHA_LORDS[compareMdIndex].nameIAST}</IAST> MD + <IAST>{adLord.nameIAST}</IAST> AD
            </div>
            <p style={{ margin: 0, fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {compareOverlay.reading}
            </p>
          </div>
        )}
      </div>

      {/* Worked examples */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <Target size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Worked overlays
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {WORKED_OVERLAYS.map((ex) => {
            const isActive =
              mdLord.grahaSlug === ex.mdSlug && adLord.grahaSlug === ex.adSlug;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => loadExample(ex)}
                title={ex.note}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 8,
                  border: `1px solid ${isActive ? GOLD_ACCENT : HAIRLINE}`,
                  background: isActive ? `${GOLD_ACCENT}15` : "transparent",
                  color: INK_SECONDARY,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {ex.label}
              </button>
            );
          })}
        </div>

        {/* Active worked example reading */}
        {WORKED_OVERLAYS.find(
          (ex) => mdLord.grahaSlug === ex.mdSlug && adLord.grahaSlug === ex.adSlug
        )?.reading && (
          <div
            style={{
              marginTop: "0.6rem",
              borderRadius: 8,
              background: `${GOLD_ACCENT}10`,
              border: `1px solid ${GOLD_ACCENT}35`,
              padding: "0.6rem 0.8rem",
              fontSize: "0.82rem",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: GOLD_ACCENT }}>Lesson reading:</strong>{" "}
            {WORKED_OVERLAYS.find(
              (ex) => mdLord.grahaSlug === ex.mdSlug && adLord.grahaSlug === ex.adSlug
            )?.reading}
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setMdIndex(6);
            setAdIndex(1);
            setCompareMdIndex(null);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: INK_SECONDARY,
            border: `1px solid ${HAIRLINE}`,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Reset reader
        </button>
      </div>
    </div>
  );
}
