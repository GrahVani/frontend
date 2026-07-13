"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Clock,
  RotateCcw,
  Sun,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type SystemKey = "kp" | "parashari" | "tajika";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const PURPLE = "#6B5AA8";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_SHORT = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

const PLANETS = [
  { key: "Sun", symbol: "Su", color: GOLD, offset: 45 },
  { key: "Moon", symbol: "Mo", color: BLUE, offset: 110 },
  { key: "Mars", symbol: "Ma", color: VERMILION, offset: 175 },
  { key: "Mercury", symbol: "Me", color: GREEN, offset: 75 },
  { key: "Jupiter", symbol: "Ju", color: PURPLE, offset: 235 },
  { key: "Venus", symbol: "Ve", color: GREEN, offset: 145 },
  { key: "Saturn", symbol: "Sa", color: PURPLE, offset: 300 },
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatDateTimeLocal(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function PrashnaMomentFramingWorkbench() {
  const [momentInput, setMomentInput] = useState(() => formatDateTimeLocal(new Date()));
  const [place, setPlace] = useState("Bengaluru, India");
  const [acknowledged, setAcknowledged] = useState(false);
  const [system, setSystem] = useState<SystemKey>("parashari");
  const [fixed, setFixed] = useState(false);

  const parsed = useMemo(() => {
    if (!momentInput) return null;
    const d = new Date(momentInput);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }, [momentInput]);

  const precision = useMemo(() => {
    if (!momentInput) return "none";
    const timePart = momentInput.split("T")[1] ?? "";
    if (!timePart) return "none";
    if (timePart.length >= 8 && timePart.includes(":")) return "seconds";
    if (timePart.length >= 5) return "minutes";
    return "hours";
  }, [momentInput]);

  const ascendant = useMemo(() => {
    if (!parsed) return { degree: 0, signIndex: 0, sign: "Aries", exact: 0 };
    const totalMinutes = parsed.getHours() * 60 + parsed.getMinutes() + parsed.getSeconds() / 60;
    const exact = (totalMinutes / 4) % 360; // ~1° per 4 minutes
    const signIndex = Math.floor(exact / 30) % 12;
    const degree = exact % 30;
    return { degree: Math.round(degree * 10) / 10, signIndex, sign: SIGNS[signIndex], exact };
  }, [parsed]);

  const vāra = useMemo(() => {
    if (!parsed) return null;
    const hours = parsed.getHours() + parsed.getMinutes() / 60;
    const calendarIndex = parsed.getDay();
    const prevIndex = (calendarIndex + 6) % 7;
    const isPreSunrise = hours < 6;
    const index = isPreSunrise ? prevIndex : calendarIndex;
    return { weekday: WEEKDAYS[index], lord: WEEKDAY_LORDS[index], isPreSunrise };
  }, [parsed]);

  const planetPositions = useMemo(() => {
    return PLANETS.map((p) => {
      const longitude = (ascendant.exact + p.offset) % 360;
      const signIndex = Math.floor(longitude / 30) % 12;
      const degree = longitude % 30;
      return { ...p, longitude, signIndex, degree: Math.round(degree * 10) / 10 };
    });
  }, [ascendant.exact]);

  const canFix = acknowledged && parsed !== null;

  const reset = () => {
    setMomentInput(formatDateTimeLocal(new Date()));
    setPlace("Bengaluru, India");
    setAcknowledged(false);
    setSystem("parashari");
    setFixed(false);
  };

  return (
    <div data-interactive="prashna-moment-framing-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Praśna moment framing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Record one instant, read it two ways
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The Ascendant and planetary longitudes stay the same; only the question you bring to the moment changes.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Input panel */}
      <section style={cardStyle}>
        <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div>
            <label htmlFor="prashna-moment" style={{ display: "block", color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              QUESTION MOMENT
            </label>
            <input
              id="prashna-moment"
              type="datetime-local"
              step="1"
              value={momentInput}
              onChange={(e) => { setMomentInput(e.target.value); setFixed(false); }}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="prashna-place" style={{ display: "block", color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              PLACE
            </label>
            <input
              id="prashna-place"
              type="text"
              value={place}
              onChange={(e) => { setPlace(e.target.value); setFixed(false); }}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            id="prashna-ack"
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => { setAcknowledged(e.target.checked); setFixed(false); }}
            style={{ width: 18, height: 18, accentColor: GREEN }}
          />
          <label htmlFor="prashna-ack" style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            This is a genuine, already-considered question, asked once and not rehearsed.
          </label>
        </div>

        <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <button type="button" disabled={!canFix} onClick={() => setFixed(true)} style={{ ...buttonStyle(true, canFix ? GREEN : INK_MUTED) }}>
            <Clock size={15} aria-hidden="true" />
            Fix moment
          </button>
          {!canFix && (
            <span style={{ color: VERMILION, fontSize: "0.8rem" }}>Set a valid moment and confirm the question is genuine.</span>
          )}
        </div>

        {precision !== "none" && (
          <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <PrecisionMeter precision={precision} />
            {vāra && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.6rem", borderRadius: 999, background: vāra.isPreSunrise ? `${VERMILION}10` : `${GREEN}10`, border: `1px solid ${vāra.isPreSunrise ? VERMILION : GREEN}`, color: vāra.isPreSunrise ? VERMILION : GREEN, fontSize: "0.8rem", fontWeight: 600 }}>
                <Sun size={14} aria-hidden="true" />
                <span>Vāra: {vāra.weekday} ({vāra.lord}){vāra.isPreSunrise ? " — pre-sunrise" : ""}</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* System selector */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Praśna system preview</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
          {(["kp", "parashari", "tajika"] as SystemKey[]).map((s) => (
            <button key={s} type="button" aria-pressed={system === s} onClick={() => setSystem(s)} style={smallChipStyle(system === s, s === "kp" ? BLUE : s === "parashari" ? GREEN : GOLD)}>
              {s === "kp" ? "KP Horary" : s === "parashari" ? "Parāśarī Praśna" : "Tājika Praśna"}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.55rem", padding: "0.65rem", borderRadius: 8, background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          {system === "kp" && (
            <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
              <strong style={{ color: BLUE, fontWeight: 600 }}>KP preview:</strong> a querent number from 1–249 would fix the horary Ascendant&apos;s sub-position. Input shown disabled here.
              <input type="number" disabled value={123} style={{ display: "block", marginTop: "0.35rem", padding: "0.35rem", borderRadius: 4, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_MUTED }} />
            </div>
          )}
          {system === "parashari" && (
            <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
              <strong style={{ color: GREEN, fontWeight: 600 }}>Parāśarī preview:</strong> no extra input needed. The whole-sign moment-chart is judged holistically by lagna, house-lords, occupants, and daśā.
            </div>
          )}
          {system === "tajika" && (
            <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
              <strong style={{ color: GOLD, fontWeight: 600 }}>Tājika preview:</strong> an orb table would show applying/separating aspects between significators.
              <div style={{ marginTop: "0.35rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.35rem" }}>
                {["Sun-Mars", "Moon-Venus", "Jupiter-Saturn"].map((pair) => (
                  <div key={pair} style={{ padding: "0.35rem", borderRadius: 4, border: `1px solid ${HAIRLINE}`, textAlign: "center", fontSize: "0.75rem", color: INK_MUTED }}>{pair}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Side-by-side framing */}
      {fixed && parsed && (
        <div style={workbenchTwoColumnStyle as CSSProperties}>
          <FramingPanel title="Jātaka framing" subtitle="This same moment, read as a birth" color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
              The chart stands for a person&apos;s whole life. Houses carry lifelong significations, and timing would come from daśā. The Ascendant and planets are exactly as shown.
            </p>
            <ChartWheel ascendant={ascendant} planets={planetPositions} />
          </FramingPanel>

          <FramingPanel title="Praśna framing" subtitle="This same moment, read as a question" color={GOLD}>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
              The chart stands for one bounded matter. The consulting client is the &quot;native&quot; of this instant, and the question&apos;s own matter is the life-domain read.
            </p>
            <ChartWheel ascendant={ascendant} planets={planetPositions} />
          </FramingPanel>
        </div>
      )}
    </div>
  );
}

function PrecisionMeter({ precision }: { precision: "none" | "hours" | "minutes" | "seconds" }) {
  const labels: Record<typeof precision, { label: string; color: string }> = {
    none: { label: "No time", color: VERMILION },
    hours: { label: "Hour precision — high risk", color: VERMILION },
    minutes: { label: "Minute precision — acceptable for concept", color: GOLD },
    seconds: { label: "Second precision — good", color: GREEN },
  };
  const meta = labels[precision];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
      <Clock size={14} style={{ color: meta.color }} />
      <span style={{ color: meta.color, fontSize: "0.8rem", fontWeight: 600 }}>{meta.label}</span>
    </div>
  );
}

function FramingPanel({ title, subtitle, color, children }: { title: string; subtitle: string; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, borderColor: color }}>
      <div style={{ marginBottom: "0.65rem" }}>
        <p style={{ margin: 0, color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
        <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function ChartWheel({ ascendant, planets }: { ascendant: { degree: number; sign: string }; planets: Array<{ key: string; symbol: string; color: string; degree: number; signIndex: number }> }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 100;
  const innerRadius = 70;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Zodiac wheel with Ascendant at ${ascendant.degree}° ${ascendant.sign}`} style={{ width: "100%", maxWidth: 280, margin: "0.75rem auto 0", display: "block" }}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={innerRadius} fill={`${ACCENT}08`} stroke={HAIRLINE} />

      {/* Sign segments */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const labelAngle = (i * 30 - 75) * (Math.PI / 180);
        const lx = cx + (radius - 15) * Math.cos(labelAngle);
        const ly = cy + (radius - 15) * Math.sin(labelAngle);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={HAIRLINE} strokeWidth={1} />
            <text x={lx} y={ly} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>{SIGN_SHORT[i]}</text>
          </g>
        );
      })}

      {/* Ascendant marker */}
      <line x1={cx - radius} y1={cy} x2={cx - innerRadius} y2={cy} stroke={GREEN} strokeWidth={3} strokeLinecap="round" />
      <text x={cx - radius + 10} y={cy - 8} fill={GREEN} fontSize="10" fontWeight={600}>Asc</text>
      <text x={cx - radius + 10} y={cy + 12} fill={INK_PRIMARY} fontSize="10" fontWeight={600}>{ascendant.degree}° {ascendant.sign}</text>

      {/* Planets */}
      {planets.map((p, index) => {
        const angle = (p.signIndex * 30 + p.degree - 90) * (Math.PI / 180);
        const r = innerRadius - 18 - (index % 3) * 14;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <g key={p.key}>
            <circle cx={x} cy={y} r="8" fill={SURFACE} stroke={p.color} strokeWidth="2" />
            <text x={x} y={y + 3} textAnchor="middle" fill={p.color} fontSize="7" fontWeight={700}>{p.symbol}</text>
          </g>
        );
      })}
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: SURFACE,
  color: INK_PRIMARY,
  fontSize: "0.9rem",
  fontFamily: "inherit",
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: primary ? "pointer" : "default",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
