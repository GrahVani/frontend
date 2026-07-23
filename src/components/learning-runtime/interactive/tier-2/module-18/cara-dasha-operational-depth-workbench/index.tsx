"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ElementKey = "fire" | "earth" | "air" | "water";
type Direction = "forward" | "backward" | "own-sign";
type MistakeKey = "parity" | "cherry" | "answer";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const GOLD_TINT = "#FFF8E8";
const GREEN_TINT = "#EAF4EE";
const BLUE_TINT = "#EAF0F8";
const VERMILION_TINT = "#FDEBE6";
const PURPLE_TINT = "#F1EEFA";
const MUTED_TINT = "#F4EFE4";

const ELEMENT_COLORS: Record<ElementKey, string> = {
  fire: VERMILION,
  earth: GREEN,
  air: AMBER,
  water: BLUE,
};

const SIGNS: Record<string, {
  label: string;
  short: string;
  element: ElementKey;
  lord: string;
  lordShort: string;
  lordSign: string;
  dual?: string;
  direction: Direction;
  period: number;
}> = {
  aries: { label: "Aries", short: "Ar", element: "fire", lord: "Mars", lordShort: "Ma", lordSign: "Aries", direction: "own-sign", period: 12 },
  taurus: { label: "Taurus", short: "Ta", element: "earth", lord: "Venus", lordShort: "Ve", lordSign: "Leo", direction: "backward", period: 9 },
  gemini: { label: "Gemini", short: "Ge", element: "air", lord: "Mercury", lordShort: "Me", lordSign: "Cancer", direction: "forward", period: 1 },
  cancer: { label: "Cancer", short: "Ca", element: "water", lord: "Moon", lordShort: "Mo", lordSign: "Sagittarius", direction: "backward", period: 7 },
  leo: { label: "Leo", short: "Le", element: "fire", lord: "Sun", lordShort: "Su", lordSign: "Cancer", direction: "forward", period: 11 },
  virgo: { label: "Virgo", short: "Vi", element: "earth", lord: "Mercury", lordShort: "Me", lordSign: "Cancer", direction: "backward", period: 2 },
  libra: { label: "Libra", short: "Li", element: "air", lord: "Venus", lordShort: "Ve", lordSign: "Leo", direction: "forward", period: 10 },
  scorpio: { label: "Scorpio", short: "Sc", element: "water", lord: "Mars", lordShort: "Ma", lordSign: "Aries", dual: "Mars over Ketu", direction: "backward", period: 7 },
  sagittarius: { label: "Sagittarius", short: "Sg", element: "fire", lord: "Jupiter", lordShort: "Ju", lordSign: "Pisces", direction: "forward", period: 3 },
  capricorn: { label: "Capricorn", short: "Cp", element: "earth", lord: "Saturn", lordShort: "Sa", lordSign: "Libra", direction: "backward", period: 3 },
  aquarius: { label: "Aquarius", short: "Aq", element: "air", lord: "Saturn", lordShort: "Sa", lordSign: "Libra", dual: "Saturn over Rāhu", direction: "forward", period: 8 },
  pisces: { label: "Pisces", short: "Pi", element: "water", lord: "Jupiter", lordShort: "Ju", lordSign: "Pisces", direction: "own-sign", period: 12 },
};

const ZODIAC_KEYS = Object.keys(SIGNS);
const SEQUENCE: string[] = [
  "cancer", "gemini", "taurus", "aries", "pisces", "aquarius",
  "capricorn", "sagittarius", "scorpio", "libra", "virgo", "leo",
];

const TOTAL_YEARS = 85;
const MOON_MD = { start: 30.506, end: 40.506 };

const MISTAKES: Record<MistakeKey, { label: string; offText: string }> = {
  parity: {
    label: "Keep sequence parity separate from duration parity",
    offText: "Warning: Cancer’s even parity sets the sequence direction, but each sign still uses its own parity for its duration count.",
  },
  cherry: {
    label: "Pisces nesting is an independently derived fact",
    offText: "Warning: the Moon MD was fixed in Chapter 1; the Cara table was derived without reference to Vimśottarī.",
  },
  answer: {
    label: "Pisces is a structural sign, not yet a marriage answer",
    offText: "Warning: which sign runs is not the same as whether it signifies marriage. That reading is Lesson 18.4.3’s work.",
  },
};

export function CaraDashaOperationalDepthWorkbench() {
  const [selected, setSelected] = useState<string>("pisces");
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    parity: true,
    cherry: true,
    answer: true,
  });

  const sequenceData = useMemo(
    () =>
      SEQUENCE.reduce<{ key: string; start: number; end: number }[]>((acc, key) => {
        const start = acc.length ? acc[acc.length - 1].end : 0;
        const end = start + SIGNS[key].period;
        acc.push({ key, start, end });
        return acc;
      }, []),
    []
  );

  const selectedData = SIGNS[selected];
  const selectedSeq = sequenceData.find((s) => s.key === selected);
  const countPath = useMemo(() => deriveCountPath(selected), [selected]);
  const allHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setSelected("pisces");
    setMistakes({ parity: true, cherry: true, answer: true });
  }

  return (
    <div data-interactive="cara-dasha-operational-depth-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Cara Daśā operational depth</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Kavya’s full Cara timeline and the Pisces nesting
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Re-derive the duration rule, follow the backward sequence from Cancer, and see why her entire Vimśottarī Moon mahādaśā sits inside one Cara sign.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Zodiac wheel</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem", fontWeight: 600 }}>
                Click a sign to see its derivation
              </h3>
            </div>
            <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>Cancer start · Pisces Moon-MD container</span>
          </div>
          <ZodiacWheel selected={selected} onSelect={setSelected} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Clock size={16} />} title="Total cycle" body="85 years" color={GOLD} />
            <MiniFact icon={<ArrowLeft size={16} />} title="Sequence direction" body="Backward from Cancer" color={BLUE} />
            <MiniFact icon={<Scale size={16} />} title="Moon MD window" body="Age 30.506–40.506" color={GREEN} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="Selected sign derivation" icon={<ShieldCheck size={18} />} color={ELEMENT_COLORS[selectedData.element]}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, color: ELEMENT_COLORS[selectedData.element], fontSize: "1.25rem", fontWeight: 600 }}>
                {selectedData.label}
              </h3>
              <span style={{ padding: "0.25rem 0.6rem", borderRadius: "9999px", background: tintForColor(ELEMENT_COLORS[selectedData.element]), color: ELEMENT_COLORS[selectedData.element], border: `1px solid ${ELEMENT_COLORS[selectedData.element]}`, fontSize: "0.78rem", fontWeight: 700 }}>
                {selectedData.period} years
              </span>
            </div>
            <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.75rem" }}>
              <KeyValue label="Lord" value={`${selectedData.lord}${selectedData.dual ? ` (${selectedData.dual})` : ""} in ${selectedData.lordSign}`} />
              <KeyValue label="Parity" value={getParity(selected)} />
              <KeyValue label="Count direction" value={selectedData.direction === "own-sign" ? "Own-sign exception" : selectedData.direction} />
              <KeyValue label="Sequence window" value={selectedSeq ? `${formatAge(selectedSeq.start)}–${formatAge(selectedSeq.end)}` : "—"} />
            </div>
            {selectedData.direction !== "own-sign" ? (
              <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, background: tintForColor(ELEMENT_COLORS[selectedData.element]), border: `1px solid ${ELEMENT_COLORS[selectedData.element]}` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
                  Count {selectedData.direction} from {selectedData.label} to {selectedData.lordSign}: {countPath.join(" → ")}.
                  Inclusive count = {countPath.length}. Period = {countPath.length} − 1 = {selectedData.period} years.
                </p>
              </div>
            ) : (
              <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, background: GREEN_TINT, border: `1px solid ${GREEN}` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
                  Lord {selectedData.lord} sits in {selectedData.label}, its own sign. The count-and-minus-one rule is overridden; the period is fixed at 12 years.
                </p>
              </div>
            )}
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Sequence and cumulative timeline</p>
        <Timeline sequenceData={sequenceData} />
        <div style={{ overflowX: "auto", marginTop: "0.85rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 520 }}>
            <thead>
              <tr style={{ background: GOLD_TINT }}>
                <th style={thStyle}>Order</th>
                <th style={thStyle}>Sign</th>
                <th style={thStyle}>Lord</th>
                <th style={thStyle}>Direction</th>
                <th style={thStyle}>Period</th>
                <th style={thStyle}>Age window</th>
              </tr>
            </thead>
            <tbody>
              {sequenceData.map(({ key, start, end }, idx) => {
                const s = SIGNS[key];
                const isSelected = key === selected;
                return (
                  <tr
                    key={key}
                    onClick={() => setSelected(key)}
                    style={{ background: isSelected ? tintForColor(ELEMENT_COLORS[s.element]) : "transparent", cursor: "pointer" }}
                  >
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>
                      <span style={{ color: ELEMENT_COLORS[s.element], fontWeight: isSelected ? 700 : 600 }}>{s.label}</span>
                    </td>
                    <td style={tdStyle}>{s.dual || s.lord}</td>
                    <td style={tdStyle}>{s.direction === "own-sign" ? "Own sign" : s.direction}</td>
                    <td style={tdStyle}>{s.period}y</td>
                    <td style={tdStyle}>{formatAge(start)}–{formatAge(end)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: PURPLE, background: PURPLE_TINT }}>
        <p style={eyebrowStyle}>Key structural finding</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.18rem", fontWeight: 600 }}>
          Moon mahādaśā sits entirely inside Pisces Cara mahādaśā
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.65 }}>
          Kavya’s Vimśottarī Moon MD runs age {formatAge(MOON_MD.start)}–{formatAge(MOON_MD.end)}.
          Her Cara sequence places Pisces at age 29–41. The Moon MD is therefore nested inside a single Cara sign.
          This is not a chosen framing: the Moon MD was fixed in Chapter 1, and the Cara table was derived from Kavya’s chart alone without reference to Vimśottarī.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const on = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !on }))}
                style={togglePanelStyle(on, on ? GREEN : VERMILION)}
              >
                {on ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 700 }}>{MISTAKES[key].label}</strong>
                  <span>{on ? " — discipline held." : ` ${MISTAKES[key].offText}`}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allHeld ? GREEN_TINT : VERMILION_TINT,
            border: `1px solid ${allHeld ? GREEN : VERMILION}`,
            color: allHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allHeld
            ? "All discipline commitments are held. The Cara findings can be reported at the correct level of precision."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>

      <section style={{ ...cardStyle, background: GOLD_TINT, borderColor: AMBER }}>
        <p style={eyebrowStyle}>Scope boundary</p>
        <h3 style={{ margin: "0.15rem 0 0", color: AMBER, fontSize: "1.1rem", fontWeight: 600 }}>
          Antar-rāśi (Cara sub-periods) are not computed in this module
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.65 }}>
          T1-17 describes sub-periods conceptually but does not supply a verified computable formula in the material read for this module.
          The Pisces finding therefore speaks to the decade, not to any individual Vimśottarī antardaśā. This limitation is disclosed, not papered over.
        </p>
      </section>
    </div>
  );
}

function deriveCountPath(signKey: string): string[] {
  const s = SIGNS[signKey];
  if (s.direction === "own-sign") return [];
  const startIdx = ZODIAC_KEYS.indexOf(signKey);
  const lordIdx = ZODIAC_KEYS.findIndex((k) => SIGNS[k].label === s.lordSign);
  const path: string[] = [];
  let idx = startIdx;
  while (true) {
    path.push(SIGNS[ZODIAC_KEYS[idx]].label);
    if (idx === lordIdx) break;
    idx = s.direction === "forward" ? (idx + 1) % 12 : (idx - 1 + 12) % 12;
  }
  return path;
}

function getParity(signKey: string) {
  const idx = ZODIAC_KEYS.indexOf(signKey);
  return idx % 2 === 0 ? "Odd (oja)" : "Even (yugma)";
}

function formatAge(n: number) {
  return n.toFixed(3);
}

function ZodiacWheel({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
  const cx = 210;
  const cy = 210;
  const rOut = 150;
  const rIn = 80;

  function polar(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(start: number, end: number) {
    const p1 = polar(start, rOut);
    const p2 = polar(end, rOut);
    const p3 = polar(end, rIn);
    const p4 = polar(start, rIn);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
  }

  return (
    <svg viewBox="0 0 420 470" role="img" aria-label="Kavya’s zodiac wheel with Cara sequence" style={{ width: "100%", maxHeight: 470, margin: "0.5rem auto 0.85rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={rOut + 6} fill="none" stroke={HAIRLINE} strokeWidth="1" />
      {ZODIAC_KEYS.map((key, idx) => {
        const start = idx * 30;
        const end = start + 30;
        const isSelected = key === selected;
        const isPisces = key === "pisces";
        const isCancer = key === "cancer";
        const color = ELEMENT_COLORS[SIGNS[key].element];
        const mid = polar(start + 15, (rOut + rIn) / 2);
        return (
          <g key={key} onClick={() => onSelect(key)} style={{ cursor: "pointer" }}>
            <path
              d={arcPath(start, end)}
              fill={isSelected ? tintForColor(color) : SURFACE}
              stroke={isSelected ? color : isPisces ? PURPLE : HAIRLINE}
              strokeWidth={isSelected ? 4 : isPisces ? 3 : 1.5}
            />
            {isCancer && (
              <circle cx={mid.x} cy={mid.y} r={6} fill={BLUE} />
            )}
            <text x={mid.x} y={mid.y - 4} textAnchor="middle" fill={isSelected ? color : INK_PRIMARY} fontSize="12" fontWeight={isSelected ? 700 : 600}>
              {SIGNS[key].short}
            </text>
            <text x={mid.x} y={mid.y + 10} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>
              {SIGNS[key].period}y
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={44} fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={GOLD} fontSize="13" fontWeight={700}>Cara</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>from Lagna</text>
      <path
        d={`M ${cx - 84} ${cy + 182} A 84 42 0 0 0 ${cx + 84} ${cy + 182}`}
        fill="none"
        stroke={BLUE}
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#arrow)"
      />
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={BLUE} />
        </marker>
      </defs>
      <text x={cx} y={cy + 212} textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={700}>Backward sequence from Cancer</text>
    </svg>
  );
}

function Timeline({ sequenceData }: { sequenceData: { key: string; start: number; end: number }[] }) {
  const width = 800;
  const scale = width / TOTAL_YEARS;
  const x = (age: number) => age * scale;
  const trackY = 56;
  const trackH = 44;

  return (
    <svg viewBox={`0 0 ${width + 40} 140`} role="img" aria-label="Kavya’s 85-year Cara Daśā timeline" style={{ width: "100%", maxHeight: 220, margin: "0.75rem auto 0", display: "block" }}>
      <text x="20" y="22" fill={INK_MUTED} fontSize="12" fontWeight={700}>Birth</text>
      <text x={width + 20} y="22" textAnchor="end" fill={INK_MUTED} fontSize="12" fontWeight={700}>Age 85</text>
      <line x1="20" y1={trackY + trackH / 2} x2={width + 20} y2={trackY + trackH / 2} stroke={HAIRLINE} strokeWidth="2" />
      {sequenceData.map(({ key, start, end }) => {
        const s = SIGNS[key];
        const color = ELEMENT_COLORS[s.element];
        const x1 = 20 + x(start);
        const x2 = 20 + x(end);
        const w = x2 - x1;
        const isPisces = key === "pisces";
        return (
          <g key={key}>
            <rect
              x={x1}
              y={trackY}
              width={Math.max(2, w)}
              height={trackH}
              rx="4"
              fill={`${color}${isPisces ? "30" : "18"}`}
              stroke={isPisces ? PURPLE : color}
              strokeWidth={isPisces ? 3 : 1.5}
            />
            {w > 34 && (
              <text x={(x1 + x2) / 2} y={trackY + 18} textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>
                {s.short}
              </text>
            )}
            {w > 44 && (
              <text x={(x1 + x2) / 2} y={trackY + 32} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>
                {s.period}y
              </text>
            )}
          </g>
        );
      })}
      <rect
        x={20 + x(MOON_MD.start)}
        y={trackY - 16}
        width={x(MOON_MD.end) - x(MOON_MD.start)}
        height={trackH + 32}
        rx="4"
        fill={GREEN_TINT}
        stroke={GREEN}
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <text x={20 + (x(MOON_MD.start) + x(MOON_MD.end)) / 2} y={trackY - 22} textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={700}>
        Moon MD
      </text>
      <text x={20 + (x(MOON_MD.start) + x(MOON_MD.end)) / 2} y={trackY + trackH + 34} textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight={700}>
        All inside Pisces (age 29–41)
      </text>
    </svg>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ color: INK_PRIMARY, fontSize: "0.9rem" }}>{value}</span>
    </div>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: tintForColor(color), padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35, fontSize: "0.88rem" }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? tintForColor(color) : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function tintForColor(color: string): string {
  switch (color) {
    case BLUE:
      return BLUE_TINT;
    case GREEN:
      return GREEN_TINT;
    case GOLD:
    case AMBER:
      return GOLD_TINT;
    case VERMILION:
      return VERMILION_TINT;
    case PURPLE:
      return PURPLE_TINT;
    default:
      return MUTED_TINT;
  }
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const thStyle: CSSProperties = {
  padding: "0.55rem 0.65rem",
  textAlign: "left",
  color: INK_MUTED,
  fontWeight: 700,
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: CSSProperties = {
  padding: "0.5rem 0.65rem",
  borderTop: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
  fontSize: "0.84rem",
};
