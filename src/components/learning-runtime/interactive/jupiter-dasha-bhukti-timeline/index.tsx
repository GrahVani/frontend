"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Calendar, Clock, HeartPulse, RefreshCcw, Scale, Sparkles, TriangleAlert } from "lucide-react";

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

const LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rāhu", "Jupiter", "Saturn", "Mercury"] as const;
const LORD_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rāhu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};
const JUPITER_MAHADASHA_YEARS = 16;

function formatDuration(years: number) {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12 * 10) / 10;
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

function formatAge(years: number) {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12 * 10) / 10;
  return `${y}y ${m}m`;
}

export function JupiterDashaBhuktiTimeline() {
  const [startAge, setStartAge] = useState(32);
  const [fifthLord, setFifthLord] = useState("Venus");
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [noUrgency, setNoUrgency] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);

  const bhuktis = useMemo(() => {
    const sequence = ["Jupiter", "Saturn", "Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rāhu"];
    let cursor = startAge;
    return sequence.map((lord) => {
      const duration = (JUPITER_MAHADASHA_YEARS * LORD_YEARS[lord]) / 120;
      const from = cursor;
      const to = cursor + duration;
      cursor = to;
      return { lord, duration, from, to, highlighted: lord === fifthLord };
    });
  }, [fifthLord, startAge]);

  const total = bhuktis[bhuktis.length - 1].to - bhuktis[0].from;
  const highlighted = bhuktis.find((b) => b.highlighted);
  const careFrame = nonFatalistic && noUrgency && medicalRoute;

  const framing = useMemo(() => {
    if (!careFrame) return "Repair the care frame before delivering any timing reading.";
    if (!highlighted) return "Select the chart's 5th lord to identify the most-indicated bhukti.";
    return `Across this Jupiter mahādaśā, and especially in the ${highlighted.lord} bhukti from about age ${formatAge(highlighted.from)} to ${formatAge(highlighted.to)}, the timing indicators for the saṁtāna theme converge more strongly. That is a supportive window to be aware of — not a deadline, not a guarantee, and never a reason to rush or delay medical guidance.`;
  }, [careFrame, highlighted]);

  function reset() {
    setStartAge(32);
    setFifthLord("Venus");
    setNonFatalistic(true);
    setNoUrgency(true);
    setMedicalRoute(true);
  }

  return (
    <div data-interactive="jupiter-dasha-bhukti-timeline" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Jupiter mahādaśā timing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>Bhukti windows for saṁtāna events</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compute the nine bhuktis of a Jupiter mahādaśā, mark the 5th lord&apos;s bhukti, and practise framing the window as a trend — never a deadline.
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
              <p style={eyebrowStyle}>Timeline</p>
              <h3 style={{ margin: "0.15rem 0 0", color: highlighted ? GREEN : GOLD, fontSize: "1.12rem", fontWeight: 600 }}>
                {highlighted ? `${highlighted.lord} bhukti highlighted` : "Select 5th lord"}
              </h3>
            </div>
            <strong style={{ color: INK_MUTED, fontWeight: 600 }}>Total {formatDuration(total)}</strong>
          </div>
          <TimelineSvg bhuktis={bhuktis} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Calendar size={16} />} title="Mahādaśā starts" body={`Age ${formatAge(startAge)}`} color={BLUE} />
            <MiniFact icon={<Clock size={16} />} title="Mahādaśā ends" body={`Age ${formatAge(startAge + JUPITER_MAHADASHA_YEARS)}`} color={PURPLE} />
            <MiniFact icon={<Sparkles size={16} />} title="5th lord" body={fifthLord} color={GREEN} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Inputs" icon={<Scale size={18} />} color={BLUE}>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
              <span>Jupiter mahādaśā starts at age</span>
              <input
                type="range"
                min={0}
                max={80}
                step={1}
                value={startAge}
                onChange={(e) => setStartAge(Number(e.target.value))}
                style={{ accentColor: GOLD, width: "100%" }}
                aria-label="Jupiter mahadasha start age"
              />
              <span style={{ color: GOLD, fontWeight: 600 }}>{startAge} years</span>
            </label>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY, marginTop: "0.65rem" }}>
              <span>5th lord</span>
              <select value={fifthLord} onChange={(e) => setFifthLord(e.target.value)} style={selectStyle}>
                {LORDS.map((lord) => (
                  <option key={lord} value={lord}>
                    {lord} ({LORD_YEARS[lord]}y)
                  </option>
                ))}
              </select>
            </label>
          </Panel>

          <Panel title="Bhukti table" icon={<Calendar size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {bhuktis.map((b) => (
                <div
                  key={b.lord}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    padding: "0.45rem 0.6rem",
                    borderRadius: 6,
                    background: b.highlighted ? `${GREEN}18` : "transparent",
                    border: `1px solid ${b.highlighted ? GREEN : HAIRLINE}`,
                    color: b.highlighted ? GREEN : INK_SECONDARY,
                    fontWeight: 600,
                    fontSize: "0.86rem",
                  }}
                >
                  <span>{b.lord}</span>
                  <span>{formatDuration(b.duration)}</span>
                  <span>{formatAge(b.from)} – {formatAge(b.to)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={{ ...cardStyle, borderColor: (careFrame ? GREEN : VERMILION) + "66", background: (careFrame ? GREEN : VERMILION) + "10" }}>
          <p style={eyebrowStyle}>Sample framing</p>
          <h3 style={{ margin: "0.15rem 0 0", color: careFrame ? GREEN : VERMILION, fontSize: "1.12rem", fontWeight: 600 }}>
            {careFrame ? "Trend window, not deadline" : "Care frame incomplete"}
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{framing}</p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Care frame</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={nonFatalistic} color={nonFatalistic ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Indication, not guarantee" body={nonFatalistic ? "Window is likelihood, not certainty." : "Forbidden guarantee framing."} onClick={() => setNonFatalistic((value) => !value)} />
            <Toggle active={noUrgency} color={noUrgency ? GREEN : VERMILION} icon={<Clock size={18} />} title="No urgency or countdown" body={noUrgency ? "No pressure to conceive inside the window." : "Countdown pressure active."} onClick={() => setNoUrgency((value) => !value)} />
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical routing intact" body={medicalRoute ? "Treatment timing goes to specialists." : "Chart overriding medical care."} onClick={() => setMedicalRoute((value) => !value)} />
          </div>
        </section>
      </div>
    </div>
  );
}

function TimelineSvg({ bhuktis }: { bhuktis: Array<{ lord: string; duration: number; from: number; to: number; highlighted: boolean }> }) {
  const total = bhuktis[bhuktis.length - 1].to - bhuktis[0].from;
  const startX = 30;
  const endX = 310;
  const trackY = 110;
  const trackWidth = endX - startX;

  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Jupiter mahadasha bhukti timeline" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="320" height="200" rx="10" fill={`${PURPLE}${"05"}`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* Timeline track */}
      <line x1={startX} y1={trackY} x2={endX} y2={trackY} stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />

      {/* Bhukti segments */}
      {bhuktis.map((b, i) => {
        const left = startX + ((b.from - bhuktis[0].from) / total) * trackWidth;
        const width = (b.duration / total) * trackWidth;
        return (
          <g key={b.lord}>
            <rect x={left} y={trackY - 12} width={width} height="24" rx="4" fill={b.highlighted ? GREEN : i % 2 === 0 ? `${BLUE}22` : `${GOLD}22`} stroke={b.highlighted ? GREEN : HAIRLINE} strokeWidth={b.highlighted ? 2 : 1} />
            <text x={left + width / 2} y={trackY + 4} textAnchor="middle" fill={b.highlighted ? "#fff" : INK_SECONDARY} fontSize={width > 28 ? "9" : "7"} fontWeight="600">
              {b.lord.slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Start / end labels */}
      <text x={startX} y={trackY + 36} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
        start
      </text>
      <text x={endX} y={trackY + 36} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
        end
      </text>

      {/* Highlight marker */}
      {bhuktis.map((b) =>
        b.highlighted ? (
          <g key={`marker-${b.lord}`}>
            <polygon points={`${startX + ((b.from - bhuktis[0].from) / total) * trackWidth + ((b.duration / total) * trackWidth) / 2 - 6},${trackY - 28} ${startX + ((b.from - bhuktis[0].from) / total) * trackWidth + ((b.duration / total) * trackWidth) / 2 + 6},${trackY - 28} ${startX + ((b.from - bhuktis[0].from) / total) * trackWidth + ((b.duration / total) * trackWidth) / 2},${trackY - 16}`} fill={GREEN} />
            <text x={startX + ((b.from - bhuktis[0].from) / total) * trackWidth + ((b.duration / total) * trackWidth) / 2} y={trackY - 32} textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">
              5th lord
            </text>
          </g>
        ) : null
      )}

      {/* Legend */}
      <g transform="translate(30 180)">
        <rect x="0" y="-6" width="14" height="12" rx="3" fill={`${GREEN}${"22"}`} stroke={GREEN} strokeWidth="1.5" />
        <text x="20" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
          5th-lord bhukti
        </text>
        <rect x="110" y="-6" width="14" height="12" rx="3" fill={`${BLUE}${"22"}`} stroke={HAIRLINE} strokeWidth="1" />
        <text x="130" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
          other bhuktis
        </text>
      </g>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
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
    <div style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"10"}`, padding: "0.7rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
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

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
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
