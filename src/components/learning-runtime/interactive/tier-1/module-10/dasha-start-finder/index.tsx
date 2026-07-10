"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BadgeCheck, Moon, RotateCcw } from "lucide-react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS } from "../dasha-timeline/data";
import { NAKSHATRAS } from '@/components/learning-runtime/interactive/nakshatra-data';
import {
  DASHA_NAKSHATRA_GROUPS,
  NAKSHATRA_SPAN_ARC_MINUTES,
  calculateBalance,
  formatArcMinutes,
  formatYears,
  getDashaStartMapping,
  getNakshatrasForLord,
} from "./data";

const CX = 200;
const CY = 200;
const R_INNER = 76;
const R_OUTER = 178;
const R_LABEL = 126;
const R_ABBR = 160;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSegment(startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(CX, CY, R_OUTER, startAngle);
  const outerEnd = polarToCartesian(CX, CY, R_OUTER, endAngle);
  const innerStart = polarToCartesian(CX, CY, R_INNER, endAngle);
  const innerEnd = polarToCartesian(CX, CY, R_INNER, startAngle);

  return [
    `M ${innerEnd.x} ${innerEnd.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${R_INNER} ${R_INNER} 0 0 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

export function DashaStartFinder() {
  const [selectedNakshatra, setSelectedNakshatra] = useState(1);
  const [hoveredNakshatra, setHoveredNakshatra] = useState<number | null>(null);
  const [elapsedArcMinutes, setElapsedArcMinutes] = useState(160);
  const [showTriads, setShowTriads] = useState(true);

  const displayNakshatra = hoveredNakshatra ?? selectedNakshatra;
  const selectedMapping = useMemo(() => getDashaStartMapping(selectedNakshatra), [selectedNakshatra]);
  const displayMapping = useMemo(() => getDashaStartMapping(displayNakshatra), [displayNakshatra]);
  const balance = useMemo(() => calculateBalance(selectedMapping.lord, elapsedArcMinutes), [elapsedArcMinutes, selectedMapping.lord]);
  const triad = useMemo(() => getNakshatrasForLord(selectedMapping.lord.index), [selectedMapping.lord.index]);
  const nextLord = DASHA_LORDS[selectedMapping.lord.index % DASHA_LORDS.length];

  function reset() {
    setSelectedNakshatra(1);
    setHoveredNakshatra(null);
    setElapsedArcMinutes(160);
    setShowTriads(true);
  }

  return (
    <div
      className="w-full"
      data-interactive="dasha-start-finder"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Nakshatra</IAST> to Starting <IAST>Dasha</IAST> Lord
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)", maxWidth: 840 }}>
            Choose the Moon&apos;s Janma-nakshatra. Its lord starts the first mahadasha; the Moon&apos;s position inside the nakshatra previews how much of that first period remains.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all self-start"
          style={{
            background: "var(--gl-card-surface-solid)",
            color: "var(--gl-ink-secondary)",
            border: "1px solid var(--gl-gold-hairline)",
          }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_340px]">
        <div className="rounded-xl p-3" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
          <DashaNakshatraWheel
            selected={selectedNakshatra}
            hovered={hoveredNakshatra}
            onSelect={setSelectedNakshatra}
            onHover={setHoveredNakshatra}
            onHoverEnd={() => setHoveredNakshatra(null)}
          />
        </div>

        <aside className="rounded-xl p-4 space-y-3" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: displayMapping.lord.color }}>
                Janma-nakshatra {displayMapping.nakshatra.num}
              </p>
              <h3 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{displayMapping.nakshatra.name}</IAST>
              </h3>
            </div>
            <Devanagari size="lg" style={{ color: displayMapping.lord.color }}>
              {displayMapping.nakshatra.devanagari}
            </Devanagari>
          </div>

          <div className="rounded-lg p-3 text-center" style={{ background: displayMapping.lord.colorTint, border: `1.5px solid ${displayMapping.lord.color}30` }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Starting mahadasha lord</p>
            <div className="text-3xl font-bold" style={{ color: displayMapping.lord.color, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{displayMapping.lord.nameIAST}</IAST>
            </div>
            <Devanagari size="md" style={{ color: displayMapping.lord.color }}>
              {displayMapping.lord.devanagari}
            </Devanagari>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>
              Select Janma-nakshatra
            </span>
            <select
              value={selectedNakshatra}
              onChange={(event) => {
                setSelectedNakshatra(Number(event.target.value));
                setHoveredNakshatra(null);
              }}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                color: "var(--gl-ink-primary)",
                background: "var(--gl-surface-2, #F5EDD8)",
                border: "1px solid var(--gl-gold-hairline)",
              }}
            >
              {NAKSHATRAS.map((nakshatra) => {
                const mapping = getDashaStartMapping(nakshatra.num);
                return (
                  <option key={nakshatra.num} value={nakshatra.num}>
                    {nakshatra.num}. {nakshatra.name} - {mapping.lord.name}
                  </option>
                );
              })}
            </select>
          </label>

          <div className="rounded-lg p-3" style={{ background: "var(--gl-surface-2, #F5EDD8)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ink.goldAccent }}>
              Selected lord triad
            </p>
            <div className="flex flex-wrap gap-1.5">
              {triad.map((nakshatra) => (
                <button
                  key={nakshatra.num}
                  type="button"
                  onClick={() => setSelectedNakshatra(nakshatra.num)}
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    color: selectedNakshatra === nakshatra.num ? "#fff" : selectedMapping.lord.color,
                    background: selectedNakshatra === nakshatra.num ? selectedMapping.lord.color : selectedMapping.lord.colorTint,
                    border: `1px solid ${selectedMapping.lord.color}40`,
                  }}
                >
                  {nakshatra.num}. <IAST>{nakshatra.name}</IAST>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-4 mt-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <section className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ink.goldAccent }}>Balance preview</p>
              <h3 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
                Degree-within controls how much first dasha remains
              </h3>
            </div>
            <div className="rounded-full px-3 py-1 text-sm font-bold" style={{ color: selectedMapping.lord.color, background: selectedMapping.lord.colorTint }}>
              {formatYears(balance.remainingYears)} left
            </div>
          </div>

          <label htmlFor="moon-within-nakshatra" className="block">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-secondary)" }}>
                Moon within <IAST>{selectedMapping.nakshatra.name}</IAST>: {formatArcMinutes(balance.elapsedArcMinutes)}
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--gl-ink-muted)" }}>
                remaining arc: {formatArcMinutes(balance.remainingArcMinutes)}
              </span>
            </div>
            <input
              id="moon-within-nakshatra"
              type="range"
              min={0}
              max={NAKSHATRA_SPAN_ARC_MINUTES}
              step={10}
              value={elapsedArcMinutes}
              onChange={(event) => setElapsedArcMinutes(Number(event.target.value))}
              className="w-full"
              style={{ accentColor: selectedMapping.lord.color, cursor: "pointer" }}
            />
          </label>

          <div className="mt-3 h-10 rounded-lg overflow-hidden flex" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
            <div
              style={{
                width: `${balance.remainingFraction * 100}%`,
                background: selectedMapping.lord.color,
                transition: "width 0.25s ease",
              }}
              title="Remaining first mahadasha balance"
            />
            <div
              style={{
                flex: 1,
                background: nextLord.colorTint,
                transition: "width 0.25s ease",
              }}
              title="Elapsed portion before birth"
            />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
            <span>Full {selectedMapping.lord.name}: {selectedMapping.lord.years} years</span>
            <span>Next lord: {nextLord.name}</span>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ink.goldAccent }}>Module 7 cross-reference</p>
              <h3 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
                Same lord triads
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowTriads((value) => !value)}
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{
                color: showTriads ? "#fff" : ink.goldAccent,
                background: showTriads ? ink.goldAccent : "var(--gl-card-surface-solid)",
                border: "1px solid var(--gl-gold-hairline)",
              }}
            >
              {showTriads ? "Triads shown" : "Show triads"}
            </button>
          </div>
          {showTriads ? (
            <div className="grid gap-2">
              <EvidenceRow color={selectedMapping.lord.color}>The Vimshottari order is the same lord order learned in Module 7.</EvidenceRow>
              <EvidenceRow color={selectedMapping.lord.color}>Each lord rules three nakshatras: one in each 9-nakshatra cycle.</EvidenceRow>
              <EvidenceRow color={grahas.candra.primary}>Use Moon&apos;s nakshatra, not Lagna or Sun, for the first dasha lord.</EvidenceRow>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
              The lookup is simple: Janma-nakshatra lord fixes the starting mahadasha; degree-within previews the balance.
            </p>
          )}
        </section>
      </div>

      <section className="rounded-xl p-4 mt-4" style={{ background: "var(--gl-surface-2, #F5EDD8)", border: "1px solid var(--gl-gold-hairline)" }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: ink.goldAccent }}>
          27 to 9 mapping table
        </p>
        <div className="grid gap-2 md:grid-cols-3">
          {DASHA_NAKSHATRA_GROUPS.map((group) => {
            const active = group.lord.index === selectedMapping.lord.index;
            const nakshatras = group.nakshatraNums.map((num) => NAKSHATRAS.find((nakshatra) => nakshatra.num === num)!);
            return (
              <div
                key={group.lord.index}
                className="rounded-lg p-3"
                style={{
                  background: active ? group.lord.colorTint : "var(--gl-card-surface-solid)",
                  border: `1.5px solid ${active ? group.lord.color : "var(--gl-gold-hairline)"}`,
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <strong style={{ color: group.lord.color }}>
                    <IAST>{group.lord.nameIAST}</IAST>
                  </strong>
                  <span className="text-xs font-bold" style={{ color: group.lord.color }}>{group.lord.years}y</span>
                </div>
                <div className="grid gap-1">
                  {nakshatras.map((nakshatra) => (
                    <button
                      type="button"
                      key={nakshatra.num}
                      onClick={() => setSelectedNakshatra(nakshatra.num)}
                      className="text-left rounded px-2 py-1 text-xs font-medium"
                      style={{
                        color: selectedNakshatra === nakshatra.num ? "#fff" : "var(--gl-ink-secondary)",
                        background: selectedNakshatra === nakshatra.num ? group.lord.color : "transparent",
                      }}
                    >
                      {nakshatra.num}. <IAST>{nakshatra.name}</IAST>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function DashaNakshatraWheel({
  selected,
  hovered,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  selected: number;
  hovered: number | null;
  onSelect: (nakshatraNum: number) => void;
  onHover: (nakshatraNum: number) => void;
  onHoverEnd: () => void;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-auto"
      style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
      role="img"
      aria-label="Twenty seven nakshatra wheel mapped to Vimshottari starting dasha lords"
    >
      <circle cx={CX} cy={CY} r={R_OUTER + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.38} />
      <circle cx={CX} cy={CY} r={R_OUTER + 4} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.25} strokeDasharray="4 4" />

      {NAKSHATRAS.map((nakshatra) => {
        const mapping = getDashaStartMapping(nakshatra.num);
        const startAngle = (nakshatra.num - 1) * (360 / 27);
        const endAngle = nakshatra.num * (360 / 27);
        const midAngle = (startAngle + endAngle) / 2;
        const labelPos = polarToCartesian(CX, CY, R_LABEL, midAngle);
        const abbrPos = polarToCartesian(CX, CY, R_ABBR, midAngle);
        const isSelected = selected === nakshatra.num;
        const isHovered = hovered === nakshatra.num;
        const isActive = isSelected || isHovered;

        return (
          <g
            key={nakshatra.num}
            onMouseEnter={() => onHover(nakshatra.num)}
            onMouseLeave={onHoverEnd}
            onClick={() => onSelect(nakshatra.num)}
            role="button"
            tabIndex={0}
            aria-label={`${nakshatra.name}, starting dasha lord ${mapping.lord.name}`}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(nakshatra.num);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <path
              d={describeSegment(startAngle, endAngle)}
              fill={isActive ? mapping.lord.colorTint : "var(--gl-card-surface-solid, #FFF9F0)"}
              stroke={isActive ? mapping.lord.color : "var(--gl-gold-hairline)"}
              strokeWidth={isActive ? 1.8 : 0.55}
              style={{ transition: "all 0.2s ease" }}
            />
            <text
              x={labelPos.x}
              y={labelPos.y + 3}
              textAnchor="middle"
              fill={isActive ? mapping.lord.color : "var(--gl-ink-muted)"}
              fontSize={8}
              fontWeight={isActive ? 800 : 600}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
            >
              {nakshatra.num}
            </text>
            <text
              x={abbrPos.x}
              y={abbrPos.y + 3}
              textAnchor="middle"
              fill={mapping.lord.color}
              fontSize={8.5}
              fontWeight={800}
              opacity={isActive ? 1 : 0.66}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
            >
              {mapping.lord.abbr}
            </text>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={R_INNER - 6} fill="var(--gl-card-surface-solid)" stroke="var(--gl-gold-hairline)" strokeWidth={1} />
      <Moon x={CX - 17} y={CY - 32} size={34} color={grahas.candra.primary} strokeWidth={1.7} />
      <text x={CX} y={CY + 16} textAnchor="middle" fill={ink.goldAccent} fontSize={13} fontWeight={800} style={{ fontFamily: "var(--font-cormorant), serif" }}>
        Janma
      </text>
      <text x={CX} y={CY + 31} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        Moon nakshatra
      </text>
    </svg>
  );
}

function EvidenceRow({ children, color = ink.goldAccent }: { children: ReactNode; color?: string }) {
  return (
    <div className="flex items-start gap-2 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
      <BadgeCheck size={16} color={color} aria-hidden="true" style={{ marginTop: 2, flex: "0 0 auto" }} />
      <span>{children}</span>
    </div>
  );
}
