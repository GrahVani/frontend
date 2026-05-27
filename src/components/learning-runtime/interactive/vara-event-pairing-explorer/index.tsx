"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

interface EventCategory {
  key: string;
  label: string;
  best: string[];
  good: string[];
  avoid: string[];
  reasoning: string;
}

const EVENTS: EventCategory[] = [
  {
    key: "marriage",
    label: "Marriage",
    best: ["Friday (Śukra)", "Wednesday (Budha)"],
    good: ["Sunday (Sūrya)", "Thursday (Guru)"],
    avoid: ["Tuesday (Maṅgala)", "Saturday (Śani)"],
    reasoning: "Venus (Śukra) governs union and pleasure; Mercury (Budha) brings communication. Mars brings conflict and Saturn delays.",
  },
  {
    key: "travel",
    label: "Travel",
    best: ["Sunday (Sūrya)", "Wednesday (Budha)", "Saturday (Śani)"],
    good: ["Friday (Śukra)", "Thursday (Guru)"],
    avoid: ["Monday (Candra)", "Tuesday (Maṅgala)"],
    reasoning: "Sun gives clear direction; Mercury rules movement. Moon causes emotional instability; Mars risks accidents.",
  },
  {
    key: "medical",
    label: "Medical",
    best: ["Monday (Candra)", "Wednesday (Budha)"],
    good: ["Thursday (Guru)", "Friday (Śukra)"],
    avoid: ["Tuesday (Maṅgala)", "Saturday (Śani)"],
    reasoning: "Moon governs fluids and healing; Mercury rules medicine. Mars causes bleeding and Saturn brings chronicity.",
  },
  {
    key: "legal",
    label: "Legal",
    best: ["Thursday (Guru)", "Sunday (Sūrya)"],
    good: ["Wednesday (Budha)", "Friday (Śukra)"],
    avoid: ["Saturday (Śani)", "Tuesday (Maṅgala)"],
    reasoning: "Jupiter is the natural judge; Sun is authority. Saturn delays justice; Mars provokes disputes.",
  },
  {
    key: "education",
    label: "Education",
    best: ["Wednesday (Budha)", "Thursday (Guru)", "Friday (Śukra)"],
    good: ["Sunday (Sūrya)", "Monday (Candra)"],
    avoid: ["Saturday (Śani)", "Tuesday (Maṅgala)"],
    reasoning: "Mercury is learning; Jupiter is wisdom; Venus is arts. Saturn obstructs and Mars distracts.",
  },
  {
    key: "business",
    label: "Business",
    best: ["Wednesday (Budha)", "Friday (Śukra)", "Thursday (Guru)"],
    good: ["Sunday (Sūrya)", "Monday (Candra)"],
    avoid: ["Saturday (Śani)", "Tuesday (Maṅgala)"],
    reasoning: "Mercury governs commerce; Venus wealth; Jupiter expansion. Saturn causes losses; Mars conflicts.",
  },
  {
    key: "spiritual",
    label: "Spiritual",
    best: ["Thursday (Guru)", "Monday (Candra)", "Saturday (Śani)"],
    good: ["Sunday (Sūrya)", "Friday (Śukra)"],
    avoid: ["Tuesday (Maṅgala)", "Wednesday (Budha)"],
    reasoning: "Jupiter is dharma; Moon devotion; Saturn austerity and renunciation. Mars is too aggressive for subtle practices.",
  },
];

const VARA_GRID = [
  { day: "Sunday", dev: "भानु", lord: "Sūrya", symbol: "☉", quality: "Mixed", best: ["Leadership", "Travel", "Legal"], avoid: ["Subtle work", "Water rituals"], color: "#E8B845" },
  { day: "Monday", dev: "सोम", lord: "Candra", symbol: "☽", quality: "Gentle", best: ["Medical", "Spiritual", "Commerce"], avoid: ["Conflict", "Travel"], color: "#7A8CB8" },
  { day: "Tuesday", dev: "मङ्गल", lord: "Maṅgala", symbol: "♂", quality: "Aggressive", best: ["Athletics", "War", "Surgery"], avoid: ["Marriage", "Business", "Legal"], color: "#C8412E" },
  { day: "Wednesday", dev: "बुध", lord: "Budha", symbol: "☿", quality: "Balanced", best: ["Education", "Business", "Marriage", "Medical"], avoid: ["Heavy labour"], color: "#3A8C5A" },
  { day: "Thursday", dev: "गुरु", lord: "Guru", symbol: "♃", quality: "Auspicious", best: ["Education", "Legal", "Business", "Spiritual"], avoid: ["Deceitful acts"], color: "#E89E2A" },
  { day: "Friday", dev: "शुक्र", lord: "Śukra", symbol: "♀", quality: "Pleasant", best: ["Marriage", "Business", "Education", "Arts"], avoid: ["Conflict", "Surgery"], color: "#5A8CC8" },
  { day: "Saturday", dev: "शनि", lord: "Śani", symbol: "♄", quality: "Heavy", best: ["Austerity", "Property", "Spiritual"], avoid: ["Marriage", "Medical", "Business", "Legal"], color: "#5A5A7A" },
];

const FRIENDSHIP: Record<string, string[]> = {
  Sūrya: ["Candra", "Maṅgala", "Guru"],
  Candra: ["Sūrya", "Budha"],
  Maṅgala: ["Sūrya", "Candra", "Guru"],
  Budha: ["Sūrya", "Śukra"],
  Guru: ["Sūrya", "Maṅgala", "Candra"],
  Śukra: ["Budha", "Śani"],
  Śani: ["Budha", "Śukra"],
};

const ENMITY: Record<string, string[]> = {
  Sūrya: ["Śani", "Śukra"],
  Candra: ["Śani", "Maṅgala"],
  Maṅgala: ["Budha", "Śani"],
  Budha: ["Candra", "Maṅgala"],
  Guru: ["Śukra", "Budha"],
  Śukra: ["Sūrya", "Maṅgala"],
  Śani: ["Sūrya", "Candra", "Maṅgala"],
};

const GRAHA_LIST = ["Sūrya", "Candra", "Maṅgala", "Budha", "Guru", "Śukra", "Śani"];
const GRAHA_COLORS: Record<string, string> = {
  Sūrya: "#E8B845", Candra: "#7A8CB8", Maṅgala: "#C8412E", Budha: "#3A8C5A",
  Guru: "#E89E2A", Śukra: "#5A8CC8", Śani: "#5A5A7A",
};
const GRAHA_SYMBOLS: Record<string, string> = {
  Sūrya: "☉", Candra: "☽", Maṅgala: "♂", Budha: "☿", Guru: "♃", Śukra: "♀", Śani: "♄",
};

export function VaraEventPairingExplorer() {
  const [selectedEvent, setSelectedEvent] = useState<string>("marriage");
  const [hoverGraha, setHoverGraha] = useState<string | null>(null);

  const eventData = EVENTS.find((e) => e.key === selectedEvent);

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "20px",
      }}
      data-interactive="vara-event-pairing-explorer"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Vāra-Event Pairing Explorer</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Which weekday is best for which event — Muhūrta pairing guide
        </p>
      </div>

      {/* Event Selector */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {EVENTS.map((evt) => (
          <button
            key={evt.key}
            onClick={() => setSelectedEvent(evt.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.02]"
            style={{
              background: selectedEvent === evt.key ? "var(--gl-gold-accent)" : "var(--gl-card-surface-solid, #FFF9F0)",
              color: selectedEvent === evt.key ? "#fff" : "var(--gl-ink-primary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            {evt.label}
          </button>
        ))}
      </div>

      {/* Result Panel */}
      {eventData && (
        <div className="rounded-xl p-4 mb-5 space-y-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{eventData.label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg" style={{ background: "#E8F5EE", border: "1px solid #A8D4B8" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#2d7d46" }}>Best Varas</p>
              <div className="flex flex-wrap gap-1">
                {eventData.best.map((b) => <span key={b} className="px-1.5 py-0.5 rounded text-[11px] font-medium" style={{ background: "#D4EDD9", color: "#2d7d46" }}>{b}</span>)}
              </div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ background: "#FDF6E3", border: "1px solid #E8D5A3" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#B8860B" }}>Good Varas</p>
              <div className="flex flex-wrap gap-1">
                {eventData.good.map((g) => <span key={g} className="px-1.5 py-0.5 rounded text-[11px] font-medium" style={{ background: "#FDF0D4", color: "#B8860B" }}>{g}</span>)}
              </div>
            </div>
            <div className="p-2.5 rounded-lg" style={{ background: "#FDE8E5", border: "1px solid #E8AFA8" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#A23A1E" }}>Avoid</p>
              <div className="flex flex-wrap gap-1">
                {eventData.avoid.map((a) => <span key={a} className="px-1.5 py-0.5 rounded text-[11px] font-medium" style={{ background: "#FAD4CD", color: "#A23A1E" }}>{a}</span>)}
              </div>
            </div>
          </div>
          <p className="text-xs italic" style={{ color: "var(--gl-ink-muted)" }}>{eventData.reasoning}</p>
        </div>
      )}

      {/* Compact SVG Vāra-Event Pairing Matrix */}
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>
        Vāra-Event Pairing Matrix
      </h3>
      <div className="mb-5 overflow-x-auto">
        <EventMatrixSVG selectedEvent={selectedEvent} />
      </div>

      {/* Vāra Reference Grid */}
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>
        Vāra Reference Grid
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
        {VARA_GRID.map((v) => (
          <div key={v.day} className="rounded-lg p-2.5 transition-all hover:scale-[1.01]" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base" style={{ color: v.color }}>{v.symbol}</span>
              <div>
                <div className="text-xs font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{v.day}</div>
                <div className="text-[10px]" style={{ color: "var(--gl-ink-muted)" }}><IAST>{v.lord}</IAST> · {v.quality}</div>
              </div>
            </div>
            <div className="text-[11px] mb-0.5" style={{ color: "#2d7d46" }}><strong>Best:</strong> {v.best.join(", ")}</div>
            <div className="text-[11px]" style={{ color: "#A23A1E" }}><strong>Avoid:</strong> {v.avoid.join(", ")}</div>
          </div>
        ))}
      </div>

      {/* Planetary Relationships */}
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>
        Planetary Relationships
      </h3>
      <div className="rounded-xl p-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <p className="text-xs mb-3" style={{ color: "var(--gl-ink-muted)" }}>
          Hover over a planet to see friends (green) and enemies (red). Click to pin.
        </p>

        <div className="flex justify-center mb-3">
          <RelationshipSVG hoverGraha={hoverGraha} />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-3">
          {GRAHA_LIST.map((g) => (
            <button
              key={g}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                background: hoverGraha === g ? `${GRAHA_COLORS[g]}18` : "transparent",
                border: hoverGraha === g ? `1.5px solid ${GRAHA_COLORS[g]}` : "1px solid var(--gl-gold-hairline)",
              }}
              onMouseEnter={() => setHoverGraha(g)}
              onMouseLeave={() => setHoverGraha(null)}
              onClick={() => setHoverGraha(hoverGraha === g ? null : g)}
            >
              <span className="text-lg font-bold" style={{ color: GRAHA_COLORS[g] }}>{GRAHA_SYMBOLS[g]}</span>
              <span className="text-[10px] font-semibold" style={{ color: "var(--gl-ink-secondary)" }}><IAST>{g}</IAST></span>
            </button>
          ))}
        </div>

        {hoverGraha && (
          <div className="flex flex-col sm:flex-row gap-3 text-xs">
            <div className="flex-1 rounded-lg p-2.5" style={{ background: "#E8F5EE", border: "1px solid #A8D4B8" }}>
              <p className="font-bold mb-1" style={{ color: "#2d7d46" }}>Friends of <IAST>{hoverGraha}</IAST></p>
              <p style={{ color: "var(--gl-ink-secondary)" }}>
                {FRIENDSHIP[hoverGraha].map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 mr-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: GRAHA_COLORS[f] }} />
                    <IAST>{f}</IAST>
                  </span>
                ))}
              </p>
            </div>
            <div className="flex-1 rounded-lg p-2.5" style={{ background: "#FDE8E5", border: "1px solid #E8AFA8" }}>
              <p className="font-bold mb-1" style={{ color: "#A23A1E" }}>Enemies of <IAST>{hoverGraha}</IAST></p>
              <p style={{ color: "var(--gl-ink-secondary)" }}>
                {ENMITY[hoverGraha].map((e) => (
                  <span key={e} className="inline-flex items-center gap-1 mr-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: GRAHA_COLORS[e] }} />
                    <IAST>{e}</IAST>
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Compact SVG Event Matrix ─── */
function EventMatrixSVG({ selectedEvent }: { selectedEvent: string }) {
  const events = EVENTS;
  const cellW = 72;
  const cellH = 26;
  const labelW = 64;
  const headerH = 24;
  const W = labelW + events.length * cellW + 12;
  const H = headerH + VARA_GRID.length * cellH + 12;

  const getCellColor = (day: string, event: EventCategory) => {
    const dayInBest = event.best.some((b) => b.includes(day));
    const dayInGood = event.good.some((g) => g.includes(day));
    const dayInAvoid = event.avoid.some((a) => a.includes(day));
    if (dayInBest) return { fill: "#E8F5EE", stroke: "#A8D4B8", text: "#2d7d46", label: "B" };
    if (dayInGood) return { fill: "#FDF6E3", stroke: "#E8D5A3", text: "#B8860B", label: "G" };
    if (dayInAvoid) return { fill: "#FDE8E5", stroke: "#E8AFA8", text: "#A23A1E", label: "A" };
    return { fill: "var(--gl-card-surface-solid, #FFF9F0)", stroke: "var(--gl-gold-hairline)", text: "var(--gl-ink-muted)", label: "—" };
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: W, maxWidth: "100%" }}>
      <defs>
        <filter id="matShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy={1} stdDeviation={1.5} floodColor="#6B4423" floodOpacity="0.06" />
        </filter>
      </defs>

      {events.map((evt, i) => {
        const x = labelW + i * cellW;
        const isSelected = evt.key === selectedEvent;
        return (
          <g key={evt.key}>
            <rect x={x} y={0} width={cellW} height={headerH} fill={isSelected ? "var(--gl-gold-accent)" : "var(--gl-card-surface-solid, #FFF9F0)"} stroke="var(--gl-gold-hairline)" strokeWidth={1} filter={isSelected ? "url(#matShadow)" : undefined} />
            <text x={x + cellW / 2} y={headerH / 2 + 4} textAnchor="middle" fill={isSelected ? "#fff" : "var(--gl-ink-secondary)"} fontSize={9} fontWeight={isSelected ? 700 : 500}>{evt.label}</text>
          </g>
        );
      })}

      {VARA_GRID.map((v, i) => {
        const y = headerH + i * cellH;
        return (
          <g key={v.day}>
            <rect x={0} y={y} width={labelW} height={cellH} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-hairline)" strokeWidth={1} />
            <text x={6} y={y + cellH / 2 + 4} fill={v.color} fontSize={12} fontWeight={700} style={{ fontFamily: "serif" }}>{v.symbol}</text>
            <text x={22} y={y + cellH / 2 + 4} fill="var(--gl-ink-primary)" fontSize={9} fontWeight={600}>{v.day.slice(0, 3)}</text>
          </g>
        );
      })}

      {VARA_GRID.map((v, vi) =>
        events.map((evt, ei) => {
          const x = labelW + ei * cellW;
          const y = headerH + vi * cellH;
          const style = getCellColor(v.day, evt);
          const isSelectedCol = evt.key === selectedEvent;
          return (
            <g key={`${v.day}-${evt.key}`}>
              <rect x={x} y={y} width={cellW} height={cellH} fill={style.fill} stroke={isSelectedCol ? style.stroke : "var(--gl-gold-hairline)"} strokeWidth={isSelectedCol ? 1.5 : 0.5} opacity={isSelectedCol ? 1 : 0.75} />
              <text x={x + cellW / 2} y={y + cellH / 2 + 4} textAnchor="middle" fill={style.text} fontSize={9} fontWeight={700}>{style.label}</text>
            </g>
          );
        })
      )}
    </svg>
  );
}

/* ─── Compact SVG Relationship Graph ─── */
function RelationshipSVG({ hoverGraha }: { hoverGraha: string | null }) {
  const CX = 160;
  const CY = 110;
  const R = 80;

  const positions = GRAHA_LIST.map((g, i) => {
    const angle = (i * (360 / 7) - 90) * (Math.PI / 180);
    return { name: g, x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle), color: GRAHA_COLORS[g], symbol: GRAHA_SYMBOLS[g] };
  });

  const hoveredPos = hoverGraha ? positions.find((p) => p.name === hoverGraha) : null;
  const friends = hoverGraha ? FRIENDSHIP[hoverGraha] : [];
  const enemies = hoverGraha ? ENMITY[hoverGraha] : [];

  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" style={{ maxWidth: 320 }}>
      <defs>
        <filter id="relShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.08" />
        </filter>
      </defs>

      {hoveredPos && friends.map((f) => {
        const fp = positions.find((p) => p.name === f);
        if (!fp) return null;
        return <line key={`friend-${f}`} x1={hoveredPos.x} y1={hoveredPos.y} x2={fp.x} y2={fp.y} stroke="#2d7d46" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.5} />;
      })}

      {hoveredPos && enemies.map((e) => {
        const ep = positions.find((p) => p.name === e);
        if (!ep) return null;
        return <line key={`enemy-${e}`} x1={hoveredPos.x} y1={hoveredPos.y} x2={ep.x} y2={ep.y} stroke="#A23A1E" strokeWidth={1} strokeDasharray="2 2" opacity={0.4} />;
      })}

      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} strokeDasharray="3 3" />
      <circle cx={CX} cy={CY} r={R - 24} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.15} />

      {positions.map((p) => {
        const isHovered = hoverGraha === p.name;
        const isFriend = hoverGraha && friends.includes(p.name);
        const isEnemy = hoverGraha && enemies.includes(p.name);
        const isSelf = hoverGraha === p.name;
        const glowColor = isSelf ? p.color : isFriend ? "#2d7d46" : isEnemy ? "#A23A1E" : undefined;

        return (
          <g key={p.name}>
            {glowColor && <circle cx={p.x} cy={p.y} r={18} fill={glowColor} opacity={0.1} />}
            <circle cx={p.x} cy={p.y} r={14} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke={isHovered ? p.color : "var(--gl-gold-hairline)"} strokeWidth={isHovered ? 1.5 : 1} filter="url(#relShadow)" />
            <text x={p.x} y={p.y + 1} textAnchor="middle" fill={p.color} fontSize={13} fontWeight={700} style={{ fontFamily: "serif" }}>{p.symbol}</text>
            <text x={p.x} y={p.y + 26} textAnchor="middle" fill={isHovered ? "var(--gl-ink-primary)" : "var(--gl-ink-muted)"} fontSize={8} fontWeight={isHovered ? 600 : 400}><IAST>{p.name}</IAST></text>
          </g>
        );
      })}

      <g transform="translate(16, 200)">
        <line x1={0} y1={5} x2={16} y2={5} stroke="#2d7d46" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={22} y={9} fill="var(--gl-ink-secondary)" fontSize={9}>Friend</text>
        <line x1={64} y1={5} x2={80} y2={5} stroke="#A23A1E" strokeWidth={1} strokeDasharray="2 2" />
        <text x={86} y={9} fill="var(--gl-ink-secondary)" fontSize={9}>Enemy</text>
      </g>
    </svg>
  );
}
