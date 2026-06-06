"use client";

/**
 * BhuktiYogaMatrix — The Bhukti-Yoga Doctrine Interactive
 *
 * §7 interactive for Lesson 10.4.1.
 *
 * Lets the learner pick an MD-lord and an AD-lord, see the naisargika
 * relation, and read the resulting bhukti-yoga baseline quality.
 * Dignity modifiers demonstrate "modulator, not override."
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS } from "../dasha-timeline/data";
import {
  getNaisargikaRelation,
  getBhuktiYogaQuality,
  modulatedLabel,
  WORKED_EXAMPLES,
  DIGNITY_MODIFIERS,
  type NaisargikaRelation,
  type DignityModifier,
} from "./data";
import {
  ArrowRightLeft,
  BadgeCheck,
  BadgeAlert,
  BadgeMinus,
  RotateCcw,
  Scale,
  Sparkles,
  Target,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const BLUE = "#356CAB";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function relationLabel(r: NaisargikaRelation | "self"): string {
  if (r === "self") return "Self";
  return r === "friend" ? "Friend" : r === "neutral" ? "Neutral" : "Enemy";
}

function relationColor(r: NaisargikaRelation | "self"): string {
  if (r === "self") return BLUE;
  return r === "friend" ? "#2F7D55" : r === "neutral" ? "#887A42" : "#A23A1E";
}

function relationBg(r: NaisargikaRelation | "self"): string {
  if (r === "self") return "rgba(53,108,171,0.12)";
  return r === "friend"
    ? "rgba(47,125,85,0.12)"
    : r === "neutral"
      ? "rgba(136,122,66,0.12)"
      : "rgba(162,58,30,0.12)";
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

function LordSelector({
  label,
  labelIAST,
  value,
  onChange,
  exclude,
}: {
  label: string;
  labelIAST: string;
  value: number;
  onChange: (idx: number) => void;
  exclude?: number;
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
          <option key={l.grahaSlug} value={i} disabled={i === exclude}>
            {l.abbr} — {l.name} ({l.nameIAST})
          </option>
        ))}
      </select>
    </label>
  );
}

function DirectedRelationCard({
  title,
  relation,
}: {
  title: string;
  relation: NaisargikaRelation | "self";
}) {
  const color = relationColor(relation);
  return (
    <div
      style={{
        border: `1.5px solid ${color}44`,
        borderRadius: 10,
        background: relationBg(relation),
        padding: "0.85rem",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.7rem",
          fontWeight: 950,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color,
        }}
      >
        {title}
      </p>
      <strong style={{ display: "block", marginTop: "0.3rem", color, fontSize: "1.1rem" }}>
        {relationLabel(relation)}
      </strong>
    </div>
  );
}

function DignityToggle({
  mod,
  active,
  onToggle,
}: {
  mod: DignityModifier;
  active: boolean;
  onToggle: () => void;
}) {
  const color =
    mod.shift > 0 ? "#2F7D55" : mod.shift < 0 ? "#A23A1E" : "#887A42";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        width: "100%",
        textAlign: "left",
        padding: "0.7rem 0.85rem",
        borderRadius: 10,
        border: `1.5px solid ${active ? color : HAIRLINE}`,
        background: active ? `${color}12` : "transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: `2px solid ${active ? color : HAIRLINE}`,
          background: active ? color : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {active && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div>
        <div style={{ fontWeight: 800, color: active ? color : INK_PRIMARY, fontSize: "0.85rem" }}>
          {mod.label} <span style={{ fontWeight: 500, color: INK_MUTED }}>(<IAST>{mod.labelIAST}</IAST>)</span>
          {mod.shift !== 0 && (
            <span style={{ marginLeft: "0.4rem", fontSize: "0.72rem" }}>
              {mod.shift > 0 ? "↑" : "↓"} {Math.abs(mod.shift)}
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "0.15rem", lineHeight: 1.5 }}>
          {mod.description}
        </div>
      </div>
    </button>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function BhuktiYogaMatrix() {
  const [mdIndex, setMdIndex] = useState(6); // Jupiter
  const [adIndex, setAdIndex] = useState(4); // Mars
  const [activeDignities, setActiveDignities] = useState<Set<string>>(new Set());

  const mdLord = DASHA_LORDS[mdIndex];
  const adLord = DASHA_LORDS[adIndex];

  const result = useMemo(
    () => getBhuktiYogaQuality(mdLord.grahaSlug, adLord.grahaSlug),
    [mdLord.grahaSlug, adLord.grahaSlug]
  );

  const mdToAd = getNaisargikaRelation(mdLord.grahaSlug, adLord.grahaSlug);
  const adToMd = getNaisargikaRelation(adLord.grahaSlug, mdLord.grahaSlug);

  const aggregateShift = useMemo(() => {
    let sum = 0;
    activeDignities.forEach((key) => {
      const mod = DIGNITY_MODIFIERS.find((d) => d.key === key);
      if (mod) sum += mod.shift;
    });
    return sum;
  }, [activeDignities]);

  const modulated = useMemo(
    () => modulatedLabel(result.quality, aggregateShift),
    [result.quality, aggregateShift]
  );

  const toggleDignity = (key: string) => {
    setActiveDignities((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const loadExample = (ex: (typeof WORKED_EXAMPLES)[number]) => {
    const mdIdx = DASHA_LORDS.findIndex((l) => l.grahaSlug === ex.mdSlug);
    const adIdx = DASHA_LORDS.findIndex((l) => l.grahaSlug === ex.adSlug);
    if (mdIdx >= 0) setMdIndex(mdIdx);
    if (adIdx >= 0) setAdIndex(adIdx);
    setActiveDignities(new Set());
  };

  const QualityIcon =
    result.quality === "auspicious"
      ? BadgeCheck
      : result.quality === "inauspicious"
        ? BadgeAlert
        : BadgeMinus;

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
      data-interactive="bhukti-yoga-matrix"
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
          Bhukti-yoga interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Bhukti</IAST>-<IAST>Yoga</IAST> Matrix: MD{" "}<IAST>↔</IAST>{" "}AD Baseline
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          The friendship between the mahādaśā-lord and the antardaśā-lord sets the baseline quality of the sub-period.
        </p>
      </div>

      {/* Baseline reminder banner */}
      <div
        style={{
          borderRadius: 10,
          background: `${BLUE}10`,
          border: `1.5px solid ${BLUE}35`,
          padding: "0.75rem 1rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Scale size={16} style={{ color: BLUE, flexShrink: 0 }} />
        <span style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          <strong style={{ color: BLUE }}>Baseline, not verdict.</strong>{" "}
          Bhukti-yoga <em>modulates</em> the sub-period — it does not <em>override</em> dignity, houses, or kāraka overlay.
        </span>
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
          onChange={setMdIndex}
          exclude={adIndex}
        />
        <LordSelector
          label="Antardaśā lord"
          labelIAST="Antardaśā"
          value={adIndex}
          onChange={setAdIndex}
          exclude={mdIndex}
        />
      </div>

      {/* Main result panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
          gap: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        {/* Quality card */}
        <div
          style={{
            borderRadius: 12,
            background: result.bg,
            border: `2px solid ${result.color}40`,
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
            <QualityIcon size={20} style={{ color: result.color }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: result.color,
              }}
            >
              Bhukti-yoga quality
            </span>
          </div>
          <strong
            style={{
              fontSize: "1.6rem",
              color: result.color,
              fontFamily: "var(--font-cormorant), serif",
              display: "block",
              marginBottom: "0.4rem",
            }}
          >
            {result.label}
          </strong>
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
            {result.effect}
          </p>
          <p
            style={{
              margin: "0.5rem 0 0",
              color: INK_MUTED,
              fontSize: "0.8rem",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            “{result.tone}”
          </p>
        </div>

        {/* Directed relation + mutuality */}
        <div
          style={{
            borderRadius: 12,
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.7rem" }}>
            <ArrowRightLeft size={16} style={{ color: GOLD_ACCENT }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: GOLD_ACCENT,
              }}
            >
              Directed naisargika check
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.6rem",
              marginBottom: "0.7rem",
            }}
          >
            <DirectedRelationCard
              title={`${mdLord.name} → ${adLord.name}`}
              relation={mdToAd}
            />
            <DirectedRelationCard
              title={`${adLord.name} → ${mdLord.name}`}
              relation={adToMd}
            />
          </div>

          <p style={{ margin: 0, fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {result.isMutual ? (
              <>
                <strong style={{ color: "#2F7D55" }}>Mutual {relationLabel(result.relation).toLowerCase()}.</strong>{" "}
                Both directions agree — the relationship runs both ways.
              </>
            ) : result.relation === "self" ? (
              <>
                <strong style={{ color: BLUE }}>Same lord.</strong>{" "}
                The lord meets itself — intensity of its own agenda, not a relational tone.
              </>
            ) : (
              <>
                <strong style={{ color: "#887A42" }}>Asymmetric.</strong>{" "}
                The mirror cell differs — naisargika friendship is directed, not necessarily mutual.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Dignity modulator */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.7rem" }}>
          <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Dignity modulator
          </span>
          <span style={{ fontSize: "0.72rem", color: INK_MUTED, marginLeft: "0.3rem" }}>
            — toggle to see how dignity shifts the baseline
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          {DIGNITY_MODIFIERS.map((mod) => (
            <DignityToggle
              key={mod.key}
              mod={mod}
              active={activeDignities.has(mod.key)}
              onToggle={() => toggleDignity(mod.key)}
            />
          ))}
        </div>

        {/* Modulated preview */}
        {activeDignities.size > 0 && (
          <div
            style={{
              borderRadius: 10,
              background: `${modulated.color}10`,
              border: `1.5px solid ${modulated.color}40`,
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <Target size={16} style={{ color: modulated.color, flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: modulated.color }}>
                Modulated reading: {modulated.label}
              </span>
              <span style={{ fontSize: "0.75rem", color: INK_SECONDARY, display: "block", marginTop: "0.15rem" }}>
                {modulated.note}
              </span>
            </div>
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
            Worked examples
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {WORKED_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => loadExample(ex)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: `1px solid ${HAIRLINE}`,
                background:
                  mdLord.grahaSlug === ex.mdSlug && adLord.grahaSlug === ex.adSlug
                    ? `${GOLD_ACCENT}15`
                    : "transparent",
                borderColor:
                  mdLord.grahaSlug === ex.mdSlug && adLord.grahaSlug === ex.adSlug
                    ? GOLD_ACCENT
                    : HAIRLINE,
                color: INK_SECONDARY,
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
              title={ex.note}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setMdIndex(6);
            setAdIndex(4);
            setActiveDignities(new Set());
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
          Reset matrix
        </button>
      </div>
    </div>
  );
}
