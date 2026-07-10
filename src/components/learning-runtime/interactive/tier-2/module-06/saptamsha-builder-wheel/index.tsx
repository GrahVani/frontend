"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Clock, RefreshCcw, Ruler, Scale, Search } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"] as const;
const SIGN_SHORT = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"] as const;
const PART_SIZE = 30 / 7; // ≈ 4.285714°
const BOUNDARY_SENSITIVITY = 0.5; // degrees

function isOdd(signIndex: number) {
  return signIndex % 2 === 0;
}

function partNumber(deg: number) {
  return Math.min(6, Math.floor(deg / PART_SIZE));
}

function d7Sign(signIndex: number, deg: number) {
  const part = partNumber(deg);
  const offset = isOdd(signIndex) ? 0 : 6;
  return (signIndex + offset + part) % 12;
}

function formatDeg(d: number) {
  const degrees = Math.floor(d);
  const minutes = Math.floor((d - degrees) * 60);
  const seconds = Math.round(((d - degrees) * 60 - minutes) * 60);
  return `${degrees}°${minutes.toString().padStart(2, "0")}′${seconds.toString().padStart(2, "0")}″`;
}

function formatRange(part: number) {
  const lo = part * PART_SIZE;
  const hi = (part + 1) * PART_SIZE;
  return `${formatDeg(lo)} – ${formatDeg(Math.min(30, hi))}`;
}

export function SaptamshaBuilderWheel() {
  const [sign, setSign] = useState(0); // Aries
  const [deg, setDeg] = useState(19);

  const part = partNumber(deg);
  const destSign = d7Sign(sign, deg);
  const odd = isOdd(sign);
  const startSign = odd ? sign : (sign + 6) % 12;
  const lo = part * PART_SIZE;
  const hi = (part + 1) * PART_SIZE;
  const distanceToLower = deg - lo;
  const distanceToUpper = hi - deg;
  const nearBoundary = distanceToLower < BOUNDARY_SENSITIVITY || distanceToUpper < BOUNDARY_SENSITIVITY;

  const sequence = useMemo(() => Array.from({ length: 7 }, (_, i) => (startSign + i) % 12), [startSign]);

  function setExample(example: "odd" | "even") {
    if (example === "odd") {
      setSign(0);
      setDeg(19);
    } else {
      setSign(1);
      setDeg(22);
    }
  }

  function reset() {
    setSign(0);
    setDeg(19);
  }

  return (
    <div data-interactive="saptamsha-builder-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D7 Saptāṁśa builder</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.28rem", fontWeight: 600 }}>Split the sign, find the children division</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Each sign divides into seven parts of ≈4°17′08″. Odd signs count from themselves; even signs count from the opposite. Watch the part, the count, and the birth-time boundary.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Part wheel</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.12rem", fontWeight: 600 }}>
                {SIGNS[sign]} · {formatDeg(deg)}
              </h3>
            </div>
            <strong style={{ color: nearBoundary ? VERMILION : GREEN, fontWeight: 600 }}>
              {nearBoundary ? "Near boundary" : "Clear of boundary"}
            </strong>
          </div>
          <PartWheel part={part} deg={deg} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Ruler size={16} />} title="Part" body={`${part + 1} of 7`} color={BLUE} />
            <MiniFact icon={<Scale size={16} />} title="Range" body={formatRange(part)} color={GOLD} />
            <MiniFact icon={<Clock size={16} />} title="Birth-time" body={nearBoundary ? "Sensitive" : "Stable"} color={nearBoundary ? VERMILION : GREEN} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Planet position" icon={<Search size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
                <span>Rāśi</span>
                <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={selectStyle}>
                  {SIGNS.map((s, i) => (
                    <option key={s} value={i}>
                      {s} ({isOdd(i) ? "odd" : "even"})
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
                <span>Degrees in sign: {formatDeg(deg)}</span>
                <input
                  type="range"
                  min={0}
                  max={29.99}
                  step={0.01}
                  value={deg}
                  onChange={(e) => setDeg(Number(e.target.value))}
                  style={{ accentColor: GOLD, width: "100%" }}
                  aria-label="degrees in sign"
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setExample("odd")} style={smallChipStyle(sign === 0 && Math.abs(deg - 19) < 0.1, BLUE)}>
                Example: 19° Aries
              </button>
              <button type="button" onClick={() => setExample("even")} style={smallChipStyle(sign === 1 && Math.abs(deg - 22) < 0.1, PURPLE)}>
                Example: 22° Taurus
              </button>
            </div>
          </Panel>

          <Panel title="Count rule" icon={<ArrowRight size={18} />} color={odd ? BLUE : PURPLE}>
            <p style={bodyTextStyle}>
              {odd
                ? `${SIGNS[sign]} is odd, so the seven parts count forward from ${SIGNS[sign]} itself.`
                : `${SIGNS[sign]} is even, so the seven parts count forward from the 7th sign, ${SIGNS[startSign]}.`}
            </p>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
              {sequence.map((s, i) => (
                <div
                  key={i}
                  style={{
                    border: `1px solid ${i === part ? GREEN : HAIRLINE}`,
                    borderRadius: 8,
                    background: i === part ? `${GREEN}18` : "transparent",
                    padding: "0.45rem 0.55rem",
                    minWidth: 32,
                    textAlign: "center",
                    color: i === part ? GREEN : INK_SECONDARY,
                    fontWeight: 600,
                    fontSize: "0.82rem",
                  }}
                >
                  <div>{SIGN_SHORT[s]}</div>
                  <div style={{ color: INK_MUTED, fontSize: "0.7rem" }}>{i + 1}</div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: GREEN + "66", background: GREEN + "10" }}>
        <p style={eyebrowStyle}>Result</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.28rem", fontWeight: 600 }}>
          D7 sign: {SIGNS[destSign]}
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {formatDeg(deg)} {SIGNS[sign]} falls in the <strong style={{ color: GREEN, fontWeight: 600 }}>{part + 1}{["st", "nd", "rd", "th", "th", "th", "th"][part]}</strong> saptāṁśa ({formatRange(part)}). 
          Because {SIGNS[sign]} is {odd ? "odd" : "even"}, we count from {odd ? "itself" : "the 7th sign, " + SIGNS[startSign]}. 
          The {part + 1}th part lands in <strong style={{ color: GREEN, fontWeight: 600 }}>{SIGNS[destSign]}</strong>.
          {nearBoundary
            ? " This degree is close to a part boundary, so a small birth-time error could shift the saptāṁśa — hold it lightly."
            : " This degree is comfortably inside the part, so it is relatively stable against small birth-time errors."}
        </p>
      </section>
    </div>
  );
}

function PartWheel({ part, deg }: { part: number; deg: number }) {
  const cx = 170;
  const cy = 130;
  const outerR = 100;
  const innerR = 58;

  function polar(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arcPath(startAngle: number, endAngle: number, inner: number, outer: number) {
    const s1 = polar(startAngle, outer);
    const e1 = polar(endAngle, outer);
    const s2 = polar(startAngle, inner);
    const e2 = polar(endAngle, inner);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s1.x} ${s1.y} A ${outer} ${outer} 0 ${largeArc} 1 ${e1.x} ${e1.y} L ${e2.x} ${e2.y} A ${inner} ${inner} 0 ${largeArc} 0 ${s2.x} ${s2.y} Z`;
  }

  const pointerAngle = (deg / 30) * 360;
  const pointer = polar(pointerAngle, outerR + 12);

  return (
    <svg viewBox="0 0 340 260" role="img" aria-label="Saptamsha part wheel showing seven divisions of the sign" style={{ width: "100%", maxHeight: 320, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="320" height="240" rx="10" fill={`${GOLD}05`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* Seven segments */}
      {Array.from({ length: 7 }, (_, i) => {
        const start = (i * 360) / 7;
        const end = ((i + 1) * 360) / 7;
        const active = i === part;
        return (
          <path
            key={i}
            d={arcPath(start, end, innerR, outerR)}
            fill={active ? `${GREEN}22` : `${HAIRLINE}22`}
            stroke={active ? GREEN : HAIRLINE}
            strokeWidth={active ? 2.5 : 1}
          />
        );
      })}

      {/* Segment labels */}
      {Array.from({ length: 7 }, (_, i) => {
        const mid = ((i + 0.5) * 360) / 7;
        const pos = polar(mid, (innerR + outerR) / 2);
        return (
          <g key={`label-${i}`}>
            <text x={pos.x} y={pos.y - 3} textAnchor="middle" fill={i === part ? GREEN : INK_SECONDARY} fontSize="10" fontWeight="600">
              P{i + 1}
            </text>
            <text x={pos.x} y={pos.y + 9} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="600">
              {formatDeg(i * PART_SIZE).replace("″", "")}
            </text>
          </g>
        );
      })}

      {/* Pointer */}
      <circle cx={pointer.x} cy={pointer.y} r="6" fill={VERMILION} />
      <text x={pointer.x} y={pointer.y + 2} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="600">
        {formatDeg(deg).replace("″", "")}
      </text>

      {/* Center label */}
      <circle cx={cx} cy={cy} r={innerR - 8} fill={SURFACE} stroke={GOLD} strokeWidth="2" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="600">
        30° ÷ 7
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
        ≈4°17′08″
      </text>

      {/* Legend */}
      <g transform="translate(28 225)">
        <rect x="0" y="-6" width="12" height="12" rx="3" fill={`${GREEN}22`} stroke={GREEN} strokeWidth="1.5" />
        <text x="18" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
          Active part
        </text>
        <circle cx="110" cy="0" r="5" fill={VERMILION} />
        <text x="122" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
          Current degree
        </text>
      </g>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: 0,
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_PRIMARY,
  padding: "0.45rem 0.6rem",
  fontWeight: 400,
};
