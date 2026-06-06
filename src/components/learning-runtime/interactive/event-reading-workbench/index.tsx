"use client";

/**
 * EventReadingWorkbench — Introductory Daśā Event Reading
 *
 * §7 interactive for Lesson 10.4.4.
 *
 * Runs the six-step event-reading workflow for a chosen question,
 * ascendant, and active MD-AD lords. Computes functional lordship,
 * bhukti-yoga, kāraka overlay, and the two-yes tally automatically.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS } from "../dasha-timeline/data";
import {
  DOMAINS,
  RASHI_NAMES,
  RASHI_NAMES_IAST,
  DIGNITY_OPTIONS,
  runWorkflow,
  SCENARIO_PRESETS,
  type DignityLevel,
} from "./data";
import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Layers,
  RotateCcw,
  Shield,
  Target,
  XCircle,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function lordBySlug(slug: GrahaSlug) {
  return DASHA_LORDS.find((l) => l.grahaSlug === slug)!;
}

function verdictColor(v: "reliable" | "uncertain" | "no-signal"): string {
  return v === "reliable" ? GREEN : v === "uncertain" ? GOLD_ACCENT : VERMILION;
}

function verdictIcon(v: "reliable" | "uncertain" | "no-signal") {
  return v === "reliable" ? CheckCircle2 : v === "uncertain" ? HelpCircle : XCircle;
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  children: React.ReactNode;
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
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-2.5 py-2 text-sm"
        style={{
          background: "var(--gl-surface-2, #F5EDD8)",
          border: `1px solid ${HAIRLINE}`,
          color: INK_PRIMARY,
          fontWeight: 700,
        }}
      >
        {children}
      </select>
    </label>
  );
}

function StepCard({
  step,
  isLast,
}: {
  step: ReturnType<typeof runWorkflow>["steps"][number];
  isLast: boolean;
}) {
  const colors = [
    BLUE,      // step 1
    "#6B5AA8", // step 2
    "#B88421", // step 3
    "#2F7D55", // step 4
    "#7B6688", // step 5
    step.status === "complete" && (step as any).content?.includes("2") ? GREEN : GOLD_ACCENT, // step 6
  ];
  const color = colors[step.step - 1] ?? GOLD_ACCENT;

  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
      {/* Step number */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `${color}18`,
          border: `2px solid ${color}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontWeight: 950,
          color,
          fontSize: "0.9rem",
        }}
      >
        {step.step}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            borderRadius: 10,
            background: SURFACE,
            border: `1.5px solid ${color}35`,
            padding: "0.85rem 1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 950,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color,
              marginBottom: "0.25rem",
            }}
          >
            {step.title} <span style={{ fontWeight: 500 }}>(<IAST>{step.titleIAST}</IAST>)</span>
          </div>
          <div
            style={{
              fontSize: "0.92rem",
              color: INK_PRIMARY,
              fontWeight: 600,
              lineHeight: 1.45,
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            {step.content}
          </div>
          {step.detail && (
            <div
              style={{
                marginTop: "0.4rem",
                fontSize: "0.8rem",
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              {step.detail}
            </div>
          )}
        </div>

        {!isLast && (
          <div style={{ display: "flex", justifyContent: "center", padding: "0.35rem 0" }}>
            <ChevronRight size={14} style={{ color: INK_MUTED, transform: "rotate(90deg)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function TwoYesBadge({
  indicator,
}: {
  indicator: ReturnType<typeof runWorkflow>["twoYesIndicators"][number];
}) {
  const sourceColor = indicator.source === "MD" ? BLUE : indicator.source === "AD" ? "#B88421" : GREEN;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.65rem",
        borderRadius: 8,
        background: `${GREEN}10`,
        border: `1px solid ${GREEN}40`,
      }}
    >
      <BadgeCheck size={13} style={{ color: GREEN, flexShrink: 0 }} />
      <span style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
        {indicator.label}
      </span>
      <span
        style={{
          fontSize: "0.62rem",
          fontWeight: 950,
          color: sourceColor,
          background: `${sourceColor}18`,
          padding: "0.1rem 0.35rem",
          borderRadius: 4,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}
      >
        {indicator.source}
      </span>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function EventReadingWorkbench() {
  const [domainIndex, setDomainIndex] = useState(0);
  const [ascendantIndex, setAscendantIndex] = useState(0);
  const [mdIndex, setMdIndex] = useState(2); // Sun
  const [adIndex, setAdIndex] = useState(1); // Venus
  const [mdDignity, setMdDignity] = useState<DignityLevel>("own");
  const [adDignity, setAdDignity] = useState<DignityLevel>("own");

  const domain = DOMAINS[domainIndex];
  const mdLord = DASHA_LORDS[mdIndex];
  const adLord = DASHA_LORDS[adIndex];

  const result = useMemo(
    () => runWorkflow(domain, ascendantIndex, mdLord.grahaSlug, adLord.grahaSlug, mdDignity, adDignity),
    [domain, ascendantIndex, mdLord.grahaSlug, adLord.grahaSlug, mdDignity, adDignity]
  );

  const loadScenario = (preset: (typeof SCENARIO_PRESETS)[number]) => {
    const dIdx = DOMAINS.findIndex((d) => d.id === preset.domainId);
    const mdIdx = DASHA_LORDS.findIndex((l) => l.grahaSlug === preset.mdSlug);
    const adIdx = DASHA_LORDS.findIndex((l) => l.grahaSlug === preset.adSlug);
    if (dIdx >= 0) setDomainIndex(dIdx);
    if (mdIdx >= 0) setMdIndex(mdIdx);
    if (adIdx >= 0) setAdIndex(adIdx);
    setAscendantIndex(preset.ascendantIndex);
    setMdDignity(preset.mdDignity);
    setAdDignity(preset.adDignity);
  };

  const color = verdictColor(result.verdict);
  const Icon = verdictIcon(result.verdict);

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
      data-interactive="event-reading-workbench"
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
          Event reading workbench
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          Six-Step Daśā Event Reading Workflow
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Domain → Lords → Dispositions → Bhukti-yoga + Kāraka → Two-yes gate.
        </p>
      </div>

      {/* Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <SelectField label="Question domain" value={domainIndex} onChange={(v) => setDomainIndex(Number(v))}>
          {DOMAINS.map((d, i) => (
            <option key={d.id} value={i}>
              {d.label}
            </option>
          ))}
        </SelectField>

        <SelectField label="Ascendant (Lagna)" value={ascendantIndex} onChange={(v) => setAscendantIndex(Number(v))}>
          {RASHI_NAMES.map((name, i) => (
            <option key={name} value={i}>
              {name} ({RASHI_NAMES_IAST[i]})
            </option>
          ))}
        </SelectField>

        <SelectField label="MD lord" value={mdIndex} onChange={(v) => setMdIndex(Number(v))}>
          {DASHA_LORDS.map((l, i) => (
            <option key={l.grahaSlug} value={i}>
              {l.abbr} — {l.name}
            </option>
          ))}
        </SelectField>

        <SelectField label="AD lord" value={adIndex} onChange={(v) => setAdIndex(Number(v))}>
          {DASHA_LORDS.map((l, i) => (
            <option key={l.grahaSlug} value={i}>
              {l.abbr} — {l.name}
            </option>
          ))}
        </SelectField>

        <SelectField label="MD dignity" value={mdDignity} onChange={(v) => setMdDignity(v as DignityLevel)}>
          {DIGNITY_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </SelectField>

        <SelectField label="AD dignity" value={adDignity} onChange={(v) => setAdDignity(v as DignityLevel)}>
          {DIGNITY_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </SelectField>
      </div>

      {/* Verdict banner */}
      <div
        style={{
          borderRadius: 12,
          background: `${color}10`,
          border: `2px solid ${color}45`,
          padding: "1.1rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color, fontFamily: "var(--font-cormorant), serif" }}>
            {result.verdict === "reliable"
              ? "Reliable — corroborated tendency"
              : result.verdict === "uncertain"
                ? "Uncertain — need more evidence"
                : "No signal"}
          </div>
          <div style={{ fontSize: "0.82rem", color: INK_SECONDARY, marginTop: "0.15rem", lineHeight: 1.5 }}>
            {result.verdict === "reliable"
              ? `${result.twoYesCount} independent indicators agree. Deliver as a tendency, not a decree.`
              : result.verdict === "uncertain"
                ? `Only ${result.twoYesCount} indicator active. One yes alone is uncertain — report "uncertain."`
                : "No indicators active for this domain with these lords."}
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "0.35rem 0.7rem",
            borderRadius: 8,
            background: `${color}18`,
            border: `1.5px solid ${color}40`,
          }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: 950, color }}>{result.twoYesCount}</div>
          <div style={{ fontSize: "0.62rem", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>
            of 2+ yes
          </div>
        </div>
      </div>

      {/* Two-yes indicators */}
      {result.twoYesIndicators.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Shield size={15} style={{ color: GREEN }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: GREEN,
              }}
            >
              Independent indicators
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {result.twoYesIndicators.map((ind) => (
              <TwoYesBadge key={ind.id} indicator={ind} />
            ))}
          </div>
        </div>
      )}

      {/* Six steps */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <Layers size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Six-step workflow
          </span>
        </div>

        <div style={{ display: "grid", gap: "0rem" }}>
          {result.steps.map((step, i) => (
            <StepCard key={step.step} step={step} isLast={i === result.steps.length - 1} />
          ))}
        </div>
      </div>

      {/* Scenario presets */}
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
            Lesson scenarios
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadScenario(preset)}
              title={preset.note}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: INK_SECONDARY,
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Active scenario note */}
        {SCENARIO_PRESETS.find((p) => {
          return (
            DOMAINS[domainIndex].id === p.domainId &&
            ascendantIndex === p.ascendantIndex &&
            mdLord.grahaSlug === p.mdSlug &&
            adLord.grahaSlug === p.adSlug &&
            mdDignity === p.mdDignity &&
            adDignity === p.adDignity
          );
        })?.note && (
          <div
            style={{
              marginTop: "0.6rem",
              borderRadius: 8,
              background: `${BLUE}10`,
              border: `1px solid ${BLUE}35`,
              padding: "0.6rem 0.8rem",
              fontSize: "0.82rem",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: BLUE }}>Lesson note:</strong>{" "}
            {
              SCENARIO_PRESETS.find((p) => {
                return (
                  DOMAINS[domainIndex].id === p.domainId &&
                  ascendantIndex === p.ascendantIndex &&
                  mdLord.grahaSlug === p.mdSlug &&
                  adLord.grahaSlug === p.adSlug &&
                  mdDignity === p.mdDignity &&
                  adDignity === p.adDignity
                );
              })?.note
            }
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setDomainIndex(0);
            setAscendantIndex(0);
            setMdIndex(2);
            setAdIndex(1);
            setMdDignity("own");
            setAdDignity("own");
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
          Reset workbench
        </button>
      </div>
    </div>
  );
}
