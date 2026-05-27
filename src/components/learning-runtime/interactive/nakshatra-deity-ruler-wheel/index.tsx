"use client";

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { NAKSHATRAS, RULER_COLORS, GANA_STYLE } from "../nakshatra-data";

/* Pakṣa suitability overlay (simplified classical mapping) */
const PAKSHA_MAP: Record<number, { shukla: string[]; krishna: string[] }> = {
  1:  { shukla: ["Travel", "Healing"], krishna: ["Spiritual retreat"] },
  2:  { shukla: ["Charity"], krishna: ["Ancestral rites"] },
  3:  { shukla: ["Fire rituals", "Cleansing"], krishna: ["Ending bad habits"] },
  4:  { shukla: ["Planting", "Marriage"], krishna: ["Conservation"] },
  5:  { shukla: ["Study", "Journey"], krishna: ["Reflection"] },
  6:  { shukla: ["Yoga", "Medicine"], krishna: ["Purging"] },
  7:  { shukla: ["New ventures", "Home entry"], krishna: ["Reconciliation"] },
  8:  { shukla: ["Teaching", "Learning"], krishna: ["Counseling"] },
  9:  { shukla: ["Spiritual practice"], krishna: ["Research", "Secrecy"] },
  10: { shukla: ["Authority", "Leadership"], krishna: ["Ancestral worship"] },
  11: { shukla: ["Marriage", "Arts"], krishna: ["Relaxation"] },
  12: { shukla: ["Charity", "Contracts"], krishna: ["Settling debts"] },
  13: { shukla: ["Craft", "Business"], krishna: ["Organization"] },
  14: { shukla: ["Design", "Jewelry"], krishna: ["Mystery arts"] },
  15: { shukla: ["Trade", "Commerce"], krishna: ["Wind-related work"] },
  16: { shukla: ["Victory ceremonies"], krishna: ["Legal disputes"] },
  17: { shukla: ["Friendship", "Alliance"], krishna: ["Diplomacy"] },
  18: { shukla: ["Protection rites"], krishna: ["Occult study"] },
  19: { shukla: ["Foundation work"], krishna: ["Uprooting", "Surgery"] },
  20: { shukla: ["Victory celebrations"], krishna: ["Water rituals"] },
  21: { shukla: ["Marriage", "Fame"], krishna: ["Completion rites"] },
  22: { shukla: ["Pilgrimage", "Listening"], krishna: ["Scripture study"] },
  23: { shukla: ["Music", "Wealth"], krishna: ["Renovation"] },
  24: { shukla: ["Healing", "Medicine"], krishna: ["Scientific research"] },
  25: { shukla: ["Fire sacrifice"], krishna: ["Austerity", "Tapas"] },
  26: { shukla: ["Charity", "Donation"], krishna: ["Meditation", "Seclusion"] },
  27: { shukla: ["Journey", "Protection"], krishna: ["Nourishment rites"] },
};

const PAKSHA_COLORS = {
  shukla: { bg: "rgba(232,184,69,0.12)", stroke: "rgba(184,134,11,0.40)", label: "Śukla-pakṣa activities" },
  krishna: { bg: "rgba(162,58,30,0.10)", stroke: "rgba(162,58,30,0.35)", label: "Kṛṣṇa-pakṣa activities" },
  both: { bg: "rgba(74,124,89,0.08)", stroke: "rgba(74,124,89,0.30)", label: "Both pakṣas" },
};

function getPakshaClass(n: typeof NAKSHATRAS[number]): "shukla" | "krishna" | "both" {
  if (["deva"].includes(n.gana) && ["moon", "jupiter", "venus"].includes(n.rulerKey)) return "shukla";
  if (["rākṣasa"].includes(n.gana) && ["saturn", "rahu", "ketu"].includes(n.rulerKey)) return "krishna";
  return "both";
}

export function NakshatraDeityRulerWheel() {
  const [selected, setSelected] = useState<number | null>(null);
  const [rulerFilter, setRulerFilter] = useState<string>("all");
  const [ganaFilter, setGanaFilter] = useState<string>("all");
  const [pakshaOverlay, setPakshaOverlay] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const active = selected ? NAKSHATRAS.find((n) => n.num === selected) ?? null : null;
  const hoverN = hovered ? NAKSHATRAS.find((n) => n.num === hovered) ?? null : null;
  const displayN = hoverN ?? active;

  const filteredNums = useMemo(() => {
    return new Set(
      NAKSHATRAS.filter((n) => {
        if (rulerFilter !== "all" && n.rulerKey !== rulerFilter) return false;
        if (ganaFilter !== "all" && n.gana !== ganaFilter) return false;
        return true;
      }).map((n) => n.num)
    );
  }, [rulerFilter, ganaFilter]);

  const CX = 320;
  const CY = 320;
  const R_INNER = 110;
  const R_MID = 220;
  const R_OUTER = 280;

  return (
    <div className="space-y-5">
      <div style={{ textAlign: "center" }}>
        <p className="text-xs uppercase mb-2" style={{ color: "var(--gl-gold-accent)", letterSpacing: "0.16em", fontWeight: 700 }}>
          A-Atlas · Explore Mode
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "26px", fontWeight: 500, color: "var(--gl-gold-accent)" }}>
          Nakṣatra Deity & Ruler Wheel
        </h3>
        <p className="text-base italic mt-2 mx-auto" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-secondary)", maxWidth: 560, lineHeight: 1.5 }}>
          Hover or click a segment to explore the deity, ruling planet, and
          symbolic animal of each lunar mansion.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Filter:</span>
        {["all", "sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"].map((k) => {
          const rc = k === "all" ? null : RULER_COLORS[k];
          return (
            <button
              key={k}
              onClick={() => setRulerFilter(k)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all gl-clickable"
              style={{
                background: rulerFilter === k ? (rc ? rc.bg : "rgba(156,122,47,0.18)") : "rgba(255,249,234,0.5)",
                color: rulerFilter === k ? (rc ? rc.text : "var(--gl-gold-accent)") : "var(--gl-ink-muted)",
                border: "1px solid var(--gl-gold-hairline)",
              }}
            >
              {k === "all" ? "All" : k[0].toUpperCase() + k.slice(1)}
            </button>
          );
        })}
        {["all", "deva", "manuṣya", "rākṣasa"].map((g) => {
          const gs = g === "all" ? null : GANA_STYLE[g];
          return (
            <button
              key={g}
              onClick={() => setGanaFilter(g)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all gl-clickable"
              style={{
                background: ganaFilter === g ? (gs ? gs.bg : "rgba(156,122,47,0.18)") : "rgba(255,249,234,0.5)",
                color: ganaFilter === g ? (gs ? gs.text : "var(--gl-gold-accent)") : "var(--gl-ink-muted)",
                border: "1px solid var(--gl-gold-hairline)",
              }}
            >
              {g === "all" ? "All ganas" : g}
            </button>
          );
        })}
        <button
          onClick={() => setPakshaOverlay((p) => !p)}
          className="px-3 py-1 rounded-full text-xs font-medium transition-all gl-clickable"
          style={{
            background: pakshaOverlay ? "rgba(74,124,89,0.12)" : "rgba(255,249,234,0.5)",
            color: pakshaOverlay ? "#4A7C59" : "var(--gl-ink-muted)",
            border: "1px solid var(--gl-gold-hairline)",
          }}
        >
          {pakshaOverlay ? "✓ Pakṣa overlay" : "Pakṣa overlay"}
        </button>
      </div>

      {/* Wheel + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <svg viewBox="0 0 640 640" className="w-full h-auto" style={{ maxWidth: 620, display: "block", margin: "0 auto" }}>
            <defs>
              <filter id="nswShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6B4423" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* Outer decorative ring */}
            <circle cx={CX} cy={CY} r={R_OUTER + 16} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.3} />
            <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.2} strokeDasharray="4 4" />

            {/* 27 segments */}
            {NAKSHATRAS.map((n) => {
              const startAngle = (n.num - 1) * (360 / 27);
              const endAngle = n.num * (360 / 27);
              const x1 = CX + R_OUTER * Math.cos((startAngle - 90) * (Math.PI / 180));
              const y1 = CY + R_OUTER * Math.sin((startAngle - 90) * (Math.PI / 180));
              const x2 = CX + R_OUTER * Math.cos((endAngle - 90) * (Math.PI / 180));
              const y2 = CY + R_OUTER * Math.sin((endAngle - 90) * (Math.PI / 180));
              const xi1 = CX + R_INNER * Math.cos((startAngle - 90) * (Math.PI / 180));
              const yi1 = CY + R_INNER * Math.sin((startAngle - 90) * (Math.PI / 180));
              const xi2 = CX + R_INNER * Math.cos((endAngle - 90) * (Math.PI / 180));
              const yi2 = CY + R_INNER * Math.sin((endAngle - 90) * (Math.PI / 180));

              const isSelected = selected === n.num;
              const isHovered = hovered === n.num;
              const isDimmed = !filteredNums.has(n.num);
              const rc = RULER_COLORS[n.rulerKey];
              const pk = getPakshaClass(n);
              const pkStyle = PAKSHA_COLORS[pk];

              let fill = isSelected ? rc.bg : "rgba(255,249,234,0.35)";
              let stroke = isSelected ? rc.border : "var(--gl-gold-hairline)";
              let strokeW = isSelected ? 2.2 : 0.6;

              if (pakshaOverlay && !isSelected) {
                fill = pkStyle.bg;
                stroke = pkStyle.stroke;
                strokeW = 0.8;
              }

              const midAngle = (startAngle + endAngle) / 2;
              const nameR = (R_INNER + R_OUTER) / 2;
              const nx = CX + nameR * Math.cos((midAngle - 90) * (Math.PI / 180));
              const ny = CY + nameR * Math.sin((midAngle - 90) * (Math.PI / 180));

              const planetR = (R_MID + R_OUTER) / 2;
              const px = CX + planetR * Math.cos((midAngle - 90) * (Math.PI / 180));
              const py = CY + planetR * Math.sin((midAngle - 90) * (Math.PI / 180));

              return (
                <g
                  key={n.num}
                  style={{ cursor: "pointer", opacity: isDimmed ? 0.18 : 1, transition: "opacity 0.25s ease" }}
                  onMouseEnter={() => setHovered(n.num)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(isSelected ? null : n.num)}
                >
                  <path
                    d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`}
                    fill={fill}
                    stroke={isHovered && !isSelected ? rc.border : stroke}
                    strokeWidth={isHovered && !isSelected ? 1.8 : strokeW}
                    style={{ transition: "all 0.2s ease" }}
                  />
                  <text
                    x={nx} y={ny + 3}
                    textAnchor="middle"
                    fill={isSelected ? rc.text : "var(--gl-ink-muted)"}
                    fontSize={9}
                    fontWeight={isSelected ? 700 : 500}
                    style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
                  >
                    {n.num}
                  </text>
                  <text
                    x={px} y={py + 3}
                    textAnchor="middle"
                    fill={isSelected ? rc.text : rc.text}
                    fontSize={10}
                    fontWeight={isSelected ? 800 : 600}
                    opacity={isSelected ? 1 : 0.7}
                    style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
                  >
                    {n.ruler[0]}
                  </text>
                </g>
              );
            })}

            {/* Inner ring divider */}
            <circle cx={CX} cy={CY} r={R_MID} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} />
            <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} />

            {/* Center mandala */}
            <g>
              <circle cx={CX} cy={CY} r={R_INNER - 8} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-hairline)" strokeWidth={1} />
              <g opacity={0.15}>
                <circle cx={CX} cy={CY} r={R_INNER - 24} fill="none" stroke="var(--gl-gold-accent)" strokeWidth={1}>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="60s" repeatCount="indefinite" />
                </circle>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                  const x1 = CX + (R_INNER - 36) * Math.cos((a - 90) * (Math.PI / 180));
                  const y1 = CY + (R_INNER - 36) * Math.sin((a - 90) * (Math.PI / 180));
                  const x2 = CX + (R_INNER - 20) * Math.cos((a - 90) * (Math.PI / 180));
                  const y2 = CY + (R_INNER - 20) * Math.sin((a - 90) * (Math.PI / 180));
                  return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--gl-gold-accent)" strokeWidth={1} />;
                })}
              </g>
              <text x={CX} y={CY - 4} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={12} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>27 NAKṢATRAS</text>
              <text x={CX} y={CY + 12} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9} style={{ fontFamily: "var(--font-sans), sans-serif" }}>Click to explore</text>
            </g>
          </svg>
        </div>

        {/* Detail panel */}
        <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          {displayN ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Nakṣatra {displayN.num}/27</p>
                  <h4 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                    <IAST>{displayN.name}</IAST>
                  </h4>
                </div>
                <Devanagari size="lg">{displayN.devanagari}</Devanagari>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 text-center" style={{ background: RULER_COLORS[displayN.rulerKey].bg, border: `1px solid ${RULER_COLORS[displayN.rulerKey].border}` }}>
                  <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Ruler</div>
                  <div className="text-sm font-semibold" style={{ color: RULER_COLORS[displayN.rulerKey].text }}>{displayN.ruler}</div>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ background: GANA_STYLE[displayN.gana].bg, border: `1px solid ${GANA_STYLE[displayN.gana].text}` }}>
                  <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Gana</div>
                  <div className="text-sm font-semibold" style={{ color: GANA_STYLE[displayN.gana].text }}>{displayN.gana}</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Deity:</span> {displayN.deity}</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Symbol:</span> {displayN.symbol}</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Yoni:</span> {displayN.yoni}</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Tara:</span> {displayN.taraName} (group {displayN.taraGroup})</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>Naming Syllables</p>
                <div className="grid grid-cols-4 gap-2">
                  {displayN.syllables.map((s, i) => (
                    <div key={i} className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
                      <div className="text-xs font-bold" style={{ color: "var(--gl-gold-accent)" }}>Pāda {i + 1}</div>
                      <div className="text-sm" style={{ color: "var(--gl-ink-primary)" }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {pakshaOverlay && (
                <div className="rounded-lg p-3 space-y-2" style={{ background: PAKSHA_COLORS[getPakshaClass(displayN)].bg, border: `1px solid ${PAKSHA_COLORS[getPakshaClass(displayN)].stroke}` }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Pakṣa Suitability</p>
                  <div className="text-xs space-y-1">
                    <p style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "#B8860B" }}>Śukla:</span> {PAKSHA_MAP[displayN.num].shukla.join(", ") || "General"}</p>
                    <p style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "#A23A1E" }}>Kṛṣṇa:</span> {PAKSHA_MAP[displayN.num].krishna.join(", ") || "General"}</p>
                  </div>
                </div>
              )}

              <p className="text-sm italic" style={{ color: "var(--gl-ink-secondary)" }}>{displayN.meaning}</p>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm italic" style={{ color: "var(--gl-ink-muted)" }}>Hover or click a segment on the wheel to see details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pakṣa legend */}
      {pakshaOverlay && (
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(PAKSHA_COLORS).map(([key, style]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: style.bg, border: `1px solid ${style.stroke}` }} />
              <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{style.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
