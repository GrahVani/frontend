"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { BriefcaseBusiness, Building2, DoorOpen, Lock, RotateCcw, Warehouse } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CONTEXTS,
  FUNCTIONS,
  findFunction,
  findOption,
  findZone,
  judgePlacement,
  verdictLabel,
  type ContextKey,
  type FunctionKey,
  type Option,
  type VerdictKey,
  type ZoneKey,
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

const GRID: ZoneKey[][] = [
  ["nw", "north", "ne"],
  ["west", "centre", "east"],
  ["sw", "south", "se"],
];

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function verdictColor(verdict: VerdictKey) {
  if (verdict === "canonical") return GREEN;
  if (verdict === "secondary") return BLUE;
  if (verdict === "mitigate") return GOLD;
  if (verdict === "avoid") return AMBER;
  return VERMILION;
}

function functionIcon(key: FunctionKey) {
  if (key === "cashVault") return <Lock size={16} />;
  if (key === "heavyStorage") return <Warehouse size={16} />;
  if (key === "entry") return <DoorOpen size={16} />;
  return <BriefcaseBusiness size={16} />;
}

function UnitGrid({
  functionKey,
  selectedZone,
  onZoneChange,
}: {
  functionKey: FunctionKey;
  selectedZone: ZoneKey;
  onZoneChange: (zone: ZoneKey) => void;
}) {
  const profile = findFunction(functionKey);

  return (
    <section className="min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Unit-internal mandala
        </p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>Click a zone</p>
      </div>
      <div className="grid min-w-0 gap-2 rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        {GRID.map((row) => (
          <div key={row.join("-")} className="grid min-w-0 grid-cols-3 gap-2">
            {row.map((zoneKey) => {
              const zone = findZone(zoneKey);
              const verdict = judgePlacement(profile, zoneKey);
              const selected = zoneKey === selectedZone;
              const color = verdictColor(verdict);
              const isStrong = verdict === "canonical" || verdict === "prohibited";
              return (
                <button
                  key={zoneKey}
                  type="button"
                  onClick={() => onZoneChange(zoneKey)}
                  className="min-h-[104px] min-w-0 rounded-xl p-3 text-left"
                  style={{
                    background: selected ? wash(color, "16") : isStrong ? wash(color, "0E") : SURFACE,
                    border: `1px solid ${selected ? color : HAIRLINE}`,
                    boxShadow: selected ? `inset 0 0 0 1px ${color}` : "none",
                  }}
                >
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <span className="text-lg font-black" style={{ color: selected || isStrong ? color : GOLD }}>{zone.label}</span>
                    <span className="rounded-full px-2 py-1 text-[10px] font-black uppercase" style={{ color, background: SURFACE, border: `1px solid ${color}` }}>
                      {verdict === "canonical" ? "best" : verdict === "prohibited" ? "no" : verdict === "secondary" ? "ok" : "check"}
                    </span>
                  </div>
                  <p className="mb-0 mt-2 text-xs font-semibold" style={{ color: INK_PRIMARY }}>{zone.deity}</p>
                  <p className="mb-0 mt-1 text-[11px]" style={{ color: INK_SECONDARY }}>{zone.use}</p>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export function VastuApartmentOfficePlanner() {
  const [contextKey, setContextKey] = useState<ContextKey>("office");
  const [functionKey, setFunctionKey] = useState<FunctionKey>("cashVault");
  const [zoneKey, setZoneKey] = useState<ZoneKey>("north");

  const context = useMemo(() => findOption(CONTEXTS, contextKey), [contextKey]);
  const profile = useMemo(() => findFunction(functionKey), [functionKey]);
  const zone = useMemo(() => findZone(zoneKey), [zoneKey]);
  const verdict = useMemo(() => judgePlacement(profile, zoneKey), [profile, zoneKey]);
  const color = verdictColor(verdict);

  const reset = () => {
    setContextKey("office");
    setFunctionKey("cashVault");
    setZoneKey("north");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-apartment-office-planner"
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
            Apartment and office Vastu planner
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Apply the mandala inside fixed modern spaces
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose a context and function, then click the internal zone. The planner distinguishes wealth placement from heavy-storage placement.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset cash vault
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <Selector title="Modern context" icon={<Building2 size={16} />} options={CONTEXTS} value={contextKey} onChange={setContextKey} />
        <Selector title="Function to place" icon={functionIcon(functionKey)} options={FUNCTIONS} value={functionKey} onChange={setFunctionKey} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <UnitGrid functionKey={functionKey} selectedZone={zoneKey} onZoneChange={setZoneKey} />
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
                {verdictLabel(verdict)}
              </p>
              <span className="rounded-full px-3 py-1 text-xs font-black uppercase" style={{ color, background: SURFACE, border: `1px solid ${color}` }}>
                {zone.label} zone
              </span>
            </div>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {profile.label}
            </h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{profile.principle}</p>
            <p className="mb-0 mt-3 text-sm font-semibold" style={{ color }}>{profile.correction}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Modern-context rule</p>
            <h3 className="m-0 mt-2 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{context.label}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{context.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Category discipline</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
              Cash vault is a wealth category: use N or NE. Heavy storage is a weight category: use SW or S.
            </p>
          </article>
        </aside>
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
      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
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
