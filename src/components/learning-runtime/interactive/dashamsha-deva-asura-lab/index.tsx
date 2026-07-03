"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { BookOpenCheck, RefreshCcw, AlertTriangle, RotateCcw } from "lucide-react";
import { RASHIS, polarToCartesian } from "../rashi-data";

// ── Existing learning design tokens ──
// CSS variables from src/app/globals.css (Grahvani learning chrome palette)
const INK = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
// Spacing / motion / radius from src/components/learning-runtime/chrome/lib/tokens.ts
const S = { xs: 8, sm: 12, md: 16, lg: 24 } as const;
const R = { sm: 8, md: 12 } as const;
const M = { fast: 150, default: 250 } as const;
// Semantic accents
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const VERMILION = "#9B2C2C";
const MOON_BLUE = "#4a7ba7";

const SIGNS = RASHIS.map((r) => r.nameIAST);
const DEG_PER_PART = 3;

const DEITIES = [
  { name: "Indra", direction: "East" },
  { name: "Agni", direction: "South-east" },
  { name: "Yama", direction: "South" },
  { name: "Nirṛti", direction: "South-west" },
  { name: "Varuṇa", direction: "West" },
  { name: "Vāyu", direction: "North-west" },
  { name: "Kubera", direction: "North" },
  { name: "Īśāna", direction: "North-east" },
  { name: "Brahma", direction: "Zenith" },
  { name: "Ananta", direction: "Nadir" },
] as const;

const PRESETS = [
  { label: "Example 1: 23°15′ Aries", sign: 0, degree: 23.25 },
  { label: "Example 2: 10° Taurus", sign: 1, degree: 10 },
] as const;

type Mode = "construct" | "deity" | "lagna";

interface D10Result {
  band: number;
  isOdd: boolean;
  startSign: number;
  destSign: number;
  wrongStartSign: number;
  wrongDestSign: number;
}

function calculateD10(sign: number, degree: number): D10Result {
  const band = Math.min(Math.floor(degree / DEG_PER_PART), 9);
  const isOdd = sign % 2 === 0;
  const startSign = isOdd ? sign : (sign + 8) % 12;
  const destSign = (startSign + band) % 12;
  const wrongStartSign = isOdd ? (sign + 8) % 12 : sign;
  const wrongDestSign = (wrongStartSign + band) % 12;
  return { band, isOdd, startSign, destSign, wrongStartSign, wrongDestSign };
}

function formatDegree(value: number): string {
  const totalMinutes = Math.round(value * 60);
  const deg = Math.floor(totalMinutes / 60);
  const min = totalMinutes % 60;
  return min === 0 ? `${deg}°` : `${deg}° ${min.toString().padStart(2, "0")}′`;
}

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

export function DashamshaDevaAsuraLab() {
  const [mode, setMode] = useState<Mode>("construct");
  const [sign, setSign] = useState(0);
  const [degree, setDegree] = useState(23.25);
  const [showError, setShowError] = useState(false);
  const [highlightStep, setHighlightStep] = useState(0);

  const result = useMemo(() => calculateD10(sign, degree), [sign, degree]);
  const destSignData = RASHIS[result.destSign];

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setMode("construct");
    setSign(preset.sign);
    setDegree(preset.degree);
    setShowError(false);
    setHighlightStep(0);
  };

  return (
    <div data-interactive="dashamsha-deva-asura-lab" style={{ display: "grid", gap: S.md, color: INK }}>
      {/* Header */}
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: S.md, alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D10 Daśāṁśa — Deva-Asura Construction Lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              The degree sets the part; parity sets the starting sign
            </h2>
            <p style={{ margin: `${S.xs}px 0 0`, color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Each sign divides into ten 3° parts. For an odd sign count from the sign itself; for an even sign count from the 9th sign from it. Swap the parity and the whole career reading lands on sand.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode("construct");
              setSign(0);
              setDegree(23.25);
              setShowError(false);
              setHighlightStep(0);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>

        {/* Mode tabs */}
        <div role="tablist" aria-label="Lab mode" style={{ display: "flex", gap: S.xs, marginTop: S.md, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: S.xs }}>
          {[
            { key: "construct", label: "Construct" },
            { key: "deity", label: "Deity wheel" },
            { key: "lagna", label: "D10 Lagna" },
          ].map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={mode === tab.key}
              type="button"
              onClick={() => setMode(tab.key as Mode)}
              style={tabStyle(mode === tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main two-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 1.1fr)", gap: S.md, alignItems: "start" }}>
        {/* Left: inputs */}
        <section style={{ display: "grid", gap: S.md }}>
          <Panel title="Pick a sign" icon={<span style={{ fontSize: 18 }}>♈</span>} color={GOLD}>
            <ZodiacRing selected={sign} onSelect={setSign} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {SIGNS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSign(i)}
                  style={signChipStyle(sign === i, i % 2 === 0)}
                  aria-pressed={sign === i}
                >
                  {s}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Degree within sign" icon={<RefreshCcw size={18} />} color={destSignData.color}>
            <label style={{ display: "grid", gap: S.xs, color: INK_SECONDARY, fontWeight: 700 }}>
              <span>{formatDegree(degree)} {SIGNS[sign]}</span>
              <input
                type="range"
                min={0}
                max={29.99}
                step={0.01}
                value={degree}
                onChange={(e) => setDegree(Number(e.target.value))}
                style={{ width: "100%", accentColor: GOLD }}
                aria-label="Degree within sign"
              />
            </label>
            <div style={{ display: "flex", gap: S.xs, alignItems: "center" }}>
              <label style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>Deg:</label>
              <input
                type="number"
                min={0}
                max={29}
                value={Math.floor(degree)}
                onChange={(e) => {
                  const deg = Math.min(29, Math.max(0, Number(e.target.value)));
                  const min = degree % 1;
                  setDegree(deg + min);
                }}
                style={{ ...inputStyle, width: 64 }}
              />
              <label style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>Min:</label>
              <input
                type="number"
                min={0}
                max={59}
                value={Math.round((degree % 1) * 60)}
                onChange={(e) => {
                  const min = Math.min(59, Math.max(0, Number(e.target.value))) / 60;
                  const deg = Math.floor(degree);
                  setDegree(deg + min);
                }}
                style={{ ...inputStyle, width: 64 }}
              />
            </div>
          </Panel>

          <Panel title="Worked examples" icon={<BookOpenCheck size={18} />} color={GREEN}>
            <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  style={buttonStyle(sign === preset.sign && Math.abs(degree - preset.degree) < 0.01, GREEN)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <Stepper value={highlightStep} onChange={setHighlightStep} result={result} />
          </Panel>
        </section>

        {/* Right: output / diagrams */}
        <section style={{ display: "grid", gap: S.md }}>
          {mode === "construct" && (
            <>
              <section style={surfaceStyle}>
                <ResultHeader result={result} sign={sign} degree={degree} />
                <TenSegmentStrip band={result.band} />
                <DestinationArc result={result} />
              </section>

              <section style={{ border: `1px solid ${GREEN}66`, borderRadius: R.sm, background: `${GREEN}10`, padding: S.md }}>
                <div style={{ display: "flex", alignItems: "center", gap: S.xs, color: GREEN, fontWeight: 800 }}>
                  <BookOpenCheck size={18} />
                  Construction cue
                </div>
                <p style={{ margin: `${S.xs}px 0 0`, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  {formatDegree(degree)} {SIGNS[sign]} ({result.isOdd ? "odd" : "even"}) falls in the {" "}
                  <strong style={{ color: GREEN }}>{ordinal(result.band + 1)} daśāṁśa</strong>. Count {result.band + 1} signs from{" "}
                  <strong>{SIGNS[result.startSign]}</strong> → D10 sign is{" "}
                  <strong style={{ color: GREEN }}>{SIGNS[result.destSign]}</strong>.
                </p>
              </section>

              <section style={{ border: `1px solid ${showError ? VERMILION : HAIRLINE}`, borderRadius: R.sm, background: showError ? `${VERMILION}10` : SURFACE, padding: S.md }}>
                <div style={{ display: "flex", alignItems: "center", gap: S.xs, marginBottom: S.xs }}>
                  <button
                    type="button"
                    aria-pressed={showError}
                    onClick={() => setShowError((v) => !v)}
                    style={buttonStyle(showError, VERMILION)}
                  >
                    {showError ? "Hide parity error" : "Show parity error"}
                  </button>
                </div>
                {showError ? (
                  <div style={{ display: "grid", gap: S.xs }}>
                    <div style={{ display: "flex", alignItems: "center", gap: S.xs, color: VERMILION, fontWeight: 800 }}>
                      <AlertTriangle size={18} />
                      Wrong-parity result: {SIGNS[result.wrongDestSign]}
                    </div>
                    <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                      If you mistakenly counted from {result.isOdd ? "the 9th sign" : "the sign itself"}, the planet would land in{" "}
                      <strong style={{ color: VERMILION }}>{SIGNS[result.wrongDestSign]}</strong> instead of{" "}
                      <strong style={{ color: GREEN }}>{SIGNS[result.destSign]}</strong>. Always check parity first.
                    </p>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: INK_MUTED, lineHeight: 1.55 }}>
                    Toggle to see what happens when the odd/even rule is swapped. The wrong parity sends the planet to a different D10 sign and corrupts the career reading.
                  </p>
                )}
              </section>
            </>
          )}

          {mode === "deity" && <DeityWheel isOdd={result.isOdd} band={result.band} />}

          {mode === "lagna" && (
            <section style={{ border: `1px solid ${GOLD}66`, borderRadius: R.sm, background: `${GOLD}10`, padding: S.md }}>
              <p style={eyebrowStyle}>D10 Lagna builder</p>
              <h3 style={{ margin: `${S.xs}px 0`, color: GOLD, fontSize: "1.2rem" }}>
                {formatDegree(degree)} {SIGNS[sign]} → D10 Lagna = {SIGNS[result.destSign]}
              </h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                The Ascendant is treated exactly like a planet. Its D10 sign becomes the D10 Lagna — the anchor for reading the whole Daśāṁśa.
              </p>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function ResultHeader({ result, sign, degree }: { result: D10Result; sign: number; degree: number }) {
  return (
    <div style={{ marginBottom: S.md }}>
      <p style={eyebrowStyle}>Calculated D10 sign</p>
      <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", alignItems: "center", marginTop: S.xs }}>
        <div style={{ ...badgeStyle(result.isOdd ? GOLD : MOON_BLUE), fontSize: "0.78rem" }}>
          {result.isOdd ? "Odd sign" : "Even sign"}
        </div>
        <div style={{ ...badgeStyle(GREEN), fontSize: "0.78rem" }}>
          {ordinal(result.band + 1)} daśāṁśa ({formatDegree(degree)})
        </div>
      </div>
      <h3 style={{ margin: `${S.sm}px 0 0`, color: GREEN, fontSize: "1.5rem", fontWeight: 800 }}>
        → {SIGNS[result.destSign]}
      </h3>
      <p style={{ margin: `${S.xs}px 0 0`, color: INK_SECONDARY, lineHeight: 1.5 }}>
        Counted {result.band + 1} signs from <strong>{SIGNS[result.startSign]}</strong> (the {result.isOdd ? "sign itself" : "9th from " + SIGNS[sign]}).
      </p>
    </div>
  );
}

function TenSegmentStrip({ band }: { band: number }) {
  return (
    <div style={{ margin: `${S.md}px 0` }}>
      <p style={{ ...eyebrowStyle, marginBottom: S.xs }}>Ten 3° bands</p>
      <div style={{ display: "flex", border: `1px solid ${HAIRLINE}`, borderRadius: R.sm, overflow: "hidden" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const active = band === i;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                padding: `${S.xs}px ${2}px`,
                textAlign: "center",
                background: active ? GOLD : SURFACE,
                color: active ? "#fff" : INK_SECONDARY,
                borderRight: i < 9 ? `1px solid ${HAIRLINE}` : undefined,
                transition: `background ${M.default}ms ease, color ${M.default}ms ease`,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "0.8rem" }}>{i + 1}</div>
              <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>{i * 3}–{(i + 1) * 3}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DestinationArc({ result }: { result: D10Result }) {
  return (
    <div>
      <p style={{ ...eyebrowStyle, marginBottom: S.xs }}>Destination arc</p>
      <svg viewBox="0 0 520 200" role="img" aria-label="D10 destination arc" style={{ width: "100%", maxHeight: 220, display: "block" }}>
        {/* Base semi-circle arc */}
        <path d="M 60 170 A 200 200 0 0 1 460 170" fill="none" stroke={HAIRLINE} strokeWidth={2} />

        {/* Ten destination nodes */}
        {Array.from({ length: 10 }).map((_, i) => {
          const targetIndex = (result.startSign + i) % 12;
          const x = 60 + (i / 9) * 400;
          const y = 170 - Math.sin((i / 9) * Math.PI) * 120;
          const active = result.band === i;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={active ? 18 : 12} fill={active ? GOLD : SURFACE} stroke={active ? GOLD : HAIRLINE} strokeWidth={2} />
              <text x={x} y={y + (active ? 5 : 4)} textAnchor="middle" fill={active ? "#fff" : INK_SECONDARY} fontSize={active ? 12 : 10} fontWeight={800}>
                {SIGNS[targetIndex].slice(0, 3)}
              </text>
              {active && (
                <text x={x} y={y - 26} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={800}>
                  {ordinal(i + 1)}
                </text>
              )}
            </g>
          );
        })}

        {/* Parity-jump arrow for even signs */}
        {!result.isOdd && (
          <g>
            <path
              d="M 60 170 Q 260 40 460 170"
              fill="none"
              stroke={MOON_BLUE}
              strokeWidth={2}
              strokeDasharray="6 4"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={MOON_BLUE} />
              </marker>
            </defs>
            <text x={260} y={60} textAnchor="middle" fill={MOON_BLUE} fontSize={11} fontWeight={800}>
              Start from the 9th sign ({SIGNS[result.startSign]})
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function ZodiacRing({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const cx = 100;
  const cy = 100;
  const r = 80;
  const innerR = 52;

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Zodiac sign selector" style={{ width: "100%", maxHeight: 180, display: "block", marginBottom: S.sm }}>
      {RASHIS.map((rashi, i) => {
        const startAngle = i * 30;
        const endAngle = (i + 1) * 30;
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const mid = polarToCartesian(cx, cy, (r + innerR) / 2, midAngle(startAngle, endAngle));
        const isOdd = i % 2 === 0;
        const isSelected = selected === i;
        const fill = isSelected ? `${GOLD}30` : isOdd ? `${GOLD}12` : `${MOON_BLUE}10`;
        return (
          <g key={rashi.nameIAST}>
            <path
              d={`M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 0 0 ${end.x} ${end.y} Z`}
              fill={fill}
              stroke={isSelected ? GOLD : HAIRLINE}
              strokeWidth={isSelected ? 2.5 : 1}
              style={{ cursor: "pointer", transition: `fill ${M.default}ms ease` }}
              onClick={() => onSelect(i)}
              role="button"
              aria-label={rashi.nameIAST}
              tabIndex={0}
            />
            <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="middle" fill={INK} fontSize={9} fontWeight={700} pointerEvents="none">
              {rashi.nameEnglish.slice(0, 3)}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR - 2} fill={SURFACE} stroke={HAIRLINE} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={GOLD} fontSize={14} fontWeight={800}>
        {RASHIS[selected].nameIAST}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle" fill={INK_MUTED} fontSize={9}>
        {selected % 2 === 0 ? "odd" : "even"}
      </text>
    </svg>
  );
}

function DeityWheel({ isOdd, band }: { isOdd: boolean; band: number }) {
  const ordered = isOdd ? [...DEITIES] : [...DEITIES].reverse();
  return (
    <section style={surfaceStyle}>
      <p style={eyebrowStyle}>Dikpāla deity order</p>
      <p style={{ margin: `${S.xs}px 0 ${S.md}px`, color: INK_SECONDARY, lineHeight: 1.55 }}>
        The ten directional guardians are assigned in <strong>{isOdd ? "forward" : "reverse"}</strong> order for {isOdd ? "odd" : "even"} signs. Recognition-level reference only.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: S.xs }}>
        {ordered.map((deity, i) => {
          const active = band === i;
          return (
            <div
              key={deity.name}
              style={{
                border: `1px solid ${active ? GOLD : HAIRLINE}`,
                borderRadius: R.sm,
                background: active ? `${GOLD}15` : SURFACE,
                padding: S.xs,
                textAlign: "center",
                transition: `background ${M.default}ms ease`,
              }}
            >
              <div style={{ color: active ? GOLD : INK_MUTED, fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase" }}>
                {ordinal(i + 1)} daśāṁśa
              </div>
              <div style={{ color: active ? GOLD : INK, fontWeight: 800, fontSize: "1rem" }}>{deity.name}</div>
              <div style={{ color: INK_SECONDARY, fontSize: "0.78rem" }}>{deity.direction}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stepper({ value, onChange, result }: { value: number; onChange: (n: number) => void; result: D10Result }) {
  const steps = [
    "Identify the sign and degree.",
    `Find the daśāṁśa band: ${ordinal(result.band + 1)} (${result.band * 3}–${(result.band + 1) * 3}°).`,
    `Check parity: ${result.isOdd ? "odd" : "even"} sign.`,
    `Start count from ${SIGNS[result.startSign]} (${result.isOdd ? "sign itself" : "9th from sign"}).`,
    `Advance ${result.band + 1} signs → D10 sign ${SIGNS[result.destSign]}.`,
  ];

  return (
    <div style={{ display: "grid", gap: S.xs, marginTop: S.xs }}>
      <p style={{ ...eyebrowStyle, marginBottom: 0 }}>Step-by-step walker</p>
      {steps.map((step, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          style={{
            textAlign: "left",
            border: `1px solid ${value === i ? GOLD : HAIRLINE}`,
            borderLeft: `4px solid ${value === i ? GOLD : "transparent"}`,
            borderRadius: R.sm,
            background: value === i ? `${GOLD}10` : SURFACE,
            color: value === i ? GOLD : INK_SECONDARY,
            padding: `${S.xs}px ${S.sm}px`,
            fontWeight: value === i ? 800 : 600,
            cursor: "pointer",
            transition: `all ${M.fast}ms ease`,
          }}
        >
          {i + 1}. {step}
        </button>
      ))}
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: React.ReactNode; color: string; children: React.ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: R.sm, background: SURFACE, padding: S.md }}>
      <div style={{ display: "flex", alignItems: "center", gap: S.xs, color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: S.sm, display: "grid", gap: S.sm }}>{children}</div>
    </section>
  );
}

/* ── Styles ── */

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: R.sm,
  background: SURFACE,
  padding: S.md,
  overflow: "hidden",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: R.sm,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: `all ${M.fast}ms ease`,
  };
}

function signChipStyle(active: boolean, odd: boolean): CSSProperties {
  const color = odd ? GOLD : MOON_BLUE;
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: R.sm,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.42rem 0.2rem",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: `all ${M.fast}ms ease`,
  };
}

function tabStyle(active: boolean): CSSProperties {
  return {
    border: "none",
    borderBottom: `2px solid ${active ? GOLD : "transparent"}`,
    background: "transparent",
    color: active ? GOLD : INK_SECONDARY,
    padding: "0.5rem 0.9rem",
    fontWeight: 800,
    cursor: "pointer",
    transition: `color ${M.fast}ms ease, border-color ${M.fast}ms ease`,
  };
}

function badgeStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    border: `1px solid ${color}`,
    borderRadius: 999,
    background: `${color}15`,
    color,
    padding: "0.2rem 0.55rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };
}

const inputStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: R.sm,
  background: "rgba(255,251,241,0.72)",
  color: INK,
  padding: "0.4rem 0.5rem",
  fontWeight: 700,
};

function midAngle(start: number, end: number) {
  return (start + end) / 2;
}
