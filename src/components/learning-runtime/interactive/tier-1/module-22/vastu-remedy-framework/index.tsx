"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { Building2, Layers3, RotateCcw, ShieldCheck, Sparkles, Triangle, Wrench } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CONTEXTS,
  DEFECTS,
  DEVICES,
  SEVERITY_OPTIONS,
  findDefect,
  findOption,
  getTierReadings,
  priorityLabel,
  priorityRank,
  type ContextKey,
  type DefectKey,
  type DeviceKey,
  type Option,
  type PriorityKey,
  type SeverityKey,
  type TierReading,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function priorityColor(priority: PriorityKey) {
  if (priority === "required") return VERMILION;
  if (priority === "recommended") return AMBER;
  if (priority === "optional") return BLUE;
  return INK_SECONDARY;
}

function severityColor(severity: SeverityKey) {
  if (severity === "severe") return VERMILION;
  if (severity === "moderate") return AMBER;
  if (severity === "mild") return BLUE;
  return GREEN;
}

function tierIcon(key: TierReading["key"]) {
  if (key === "architectural") return <Wrench size={16} />;
  if (key === "symbolic") return <Layers3 size={16} />;
  if (key === "device") return <Triangle size={16} />;
  return <Sparkles size={16} />;
}

function RemedyLadder({ tiers, severity }: { tiers: TierReading[]; severity: SeverityKey }) {
  const color = severityColor(severity);
  const levels = [...tiers].reverse();

  return (
    <section className="min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Four-tier remedy ladder
        </p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>Severity sets remedy depth</p>
      </div>
      <svg viewBox="0 0 520 430" className="block h-auto w-full" role="img" aria-label="Four tier Vastu remediation ladder">
        <rect x="34" y="28" width="452" height="374" rx="24" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="58" textAnchor="middle" fontSize="15" fontWeight="600" fill={GOLD}>
          DIAGNOSIS BEFORE PRODUCT
        </text>
        <rect x="128" y="330" width="264" height="42" rx="18" fill={wash(color, "14")} stroke={color} />
        <text x="260" y="356" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
          {severity.toUpperCase()} DOSHA
        </text>

        {levels.map((tier, index) => {
          const y = 82 + index * 58;
          const x = 78 + index * 32;
          const width = 364 - index * 64;
          const tierColor = priorityColor(tier.priority);
          const active = priorityRank(tier.priority) > 0;
          return (
            <g key={tier.key}>
              <rect x={x} y={y} width={width} height="44" rx="12" fill={active ? wash(tierColor, "14") : "rgba(255,249,240,0.74)"} stroke={active ? tierColor : HAIRLINE} strokeWidth={active ? 2 : 1} />
              <text x={x + 18} y={y + 18} fontSize="12" fontWeight="700" fill={active ? tierColor : INK_SECONDARY}>
                {priorityLabel(tier.priority).toUpperCase()}
              </text>
              <text x={x + width / 2} y={y + 30} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK_PRIMARY}>
                {tier.label.replace("Tier ", "T")}
              </text>
            </g>
          );
        })}
        <path d="M260 314 V276" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
        <text x="260" y="394" textAnchor="middle" fontSize="12" fontWeight="600" fill={INK_SECONDARY}>
          Severe cases layer tiers; mild cases should not be over-prescribed.
        </text>
      </svg>
    </section>
  );
}

export function VastuRemedyFramework() {
  const [defectKey, setDefectKey] = useState<DefectKey>("neCut");
  const [contextKey, setContextKey] = useState<ContextKey>("existingHome");
  const [deviceKey, setDeviceKey] = useState<DeviceKey>("yantra");
  const [manualSeverity, setManualSeverity] = useState<SeverityKey>("severe");

  const defect = useMemo(() => findDefect(defectKey), [defectKey]);
  const context = useMemo(() => findOption(CONTEXTS, contextKey), [contextKey]);
  const device = useMemo(() => findOption(DEVICES, deviceKey), [deviceKey]);
  const severity = defect.severity === "canonical" ? manualSeverity : defect.severity;
  const tiers = useMemo(() => getTierReadings(severity, contextKey, deviceKey), [severity, contextKey, deviceKey]);
  const strongest = tiers.reduce((best, tier) => (priorityRank(tier.priority) > priorityRank(best.priority) ? tier : best), tiers[0]);
  const color = severityColor(severity);

  const reset = () => {
    setDefectKey("neCut");
    setContextKey("existingHome");
    setDeviceKey("yantra");
    setManualSeverity("severe");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-remedy-framework"
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
            Vastu remedy framework
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Choose remedies by severity, not by product habit
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Select a dosha, modern context, and device stance. The ladder separates architectural correction, symbolic support, yantra or pyramid use, and ritual.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset remedy
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Selector title="Diagnosed dosha" icon={<ShieldCheck size={16} />} options={DEFECTS} value={defectKey} onChange={setDefectKey} />
        <Selector title="Context" icon={<Building2 size={16} />} options={CONTEXTS} value={contextKey} onChange={setContextKey} />
        <Selector title="Device stance" icon={<Triangle size={16} />} options={DEVICES} value={deviceKey} onChange={setDeviceKey} />
      </section>

      <section className="mb-4 min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-2 flex items-center gap-2">
          <Layers3 size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Severity calibration</p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SEVERITY_OPTIONS.map((option) => {
            const selected = option.key === severity;
            const disabled = option.key !== defect.severity;
            const optionColor = severityColor(option.key);
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setManualSeverity(option.key)}
                className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-semibold"
                style={{
                  color: selected ? optionColor : disabled ? INK_SECONDARY : INK_PRIMARY,
                  background: selected ? wash(optionColor, "10") : SURFACE_2,
                  border: `1px solid ${selected ? optionColor : HAIRLINE}`,
                  opacity: disabled ? 0.78 : 1,
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <RemedyLadder tiers={tiers} severity={severity} />
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>{severity} remedy budget</p>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {defect.label}
            </h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{defect.diagnosis}</p>
            <p className="mb-0 mt-3 text-sm font-semibold" style={{ color }}>{context.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Device attribution</p>
            <h3 className="m-0 mt-2 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{device.label}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{device.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Strongest current tier</p>
            <p className="mb-0 mt-2 text-sm font-semibold" style={{ color: priorityColor(strongest.priority) }}>
              {priorityLabel(strongest.priority)}: {strongest.label}
            </p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{strongest.action}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => {
          const tierColor = priorityColor(tier.priority);
          return (
            <article key={tier.key} className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center gap-2">
                <span style={{ color: tierColor }}>{tierIcon(tier.key)}</span>
                <p className="m-0 text-xs font-black uppercase" style={{ color: tierColor, letterSpacing: "0.06em" }}>
                  {priorityLabel(tier.priority)}
                </p>
              </div>
              <h3 className="m-0 mt-2 text-base font-bold" style={{ color: INK_PRIMARY }}>{tier.label}</h3>
              <p className="mb-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>{tier.caution}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Selector<T extends string>({
  title,
  icon,
  options,
  value,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div className="grid min-w-0 gap-2">
        {options.map((option) => {
          const selected = option.key === value;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{
                color: selected ? INK_PRIMARY : INK_SECONDARY,
                background: selected ? wash(GOLD, "12") : SURFACE_2,
                border: `1px solid ${selected ? GOLD : HAIRLINE}`,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
