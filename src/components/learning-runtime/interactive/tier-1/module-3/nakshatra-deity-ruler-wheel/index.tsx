"use client";

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "@/components/learning-runtime/chrome/typography";
import { NAKSHATRAS, RULER_COLORS, GANA_STYLE } from '@/components/learning-runtime/interactive/nakshatra-data';

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
  shukla: { bg: "#FDF6E3", stroke: "#D4B896", label: "Śukla-pakṣa activities" },
  krishna: { bg: "#FDE8E5", stroke: "#E8AFA8", label: "Kṛṣṇa-pakṣa activities" },
  both: { bg: "#E8F5EE", stroke: "#A8D4B8", label: "Both pakṣas" },
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

  const CX = 200;
  const CY = 200;
  const R_INNER = 68;
  const R_MID = 138;
  const R_OUTER = 175;

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "20px",
      }}
      data-interactive="nakshatra-deity-ruler-wheel"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Nakṣatra Deity &amp; Ruler Wheel</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Hover or click a segment to explore the deity, ruling planet, and symbolic animal.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 items-center mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Filter:</span>
        {["all", "sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"].map((k) => {
          const rc = k === "all" ? null : RULER_COLORS[k];
          return (
            <button
              key={k}
              onClick={() => setRulerFilter(k)}
              className="px-2 py-0.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: rulerFilter === k ? (rc ? rc.bg : "#FDF6E3") : "var(--gl-card-surface-solid)",
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
              className="px-2 py-0.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: ganaFilter === g ? (gs ? gs.bg : "#FDF6E3") : "var(--gl-card-surface-solid)",
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
          className="px-2 py-0.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: pakshaOverlay ? "#E8F5EE" : "var(--gl-card-surface-solid)",
            color: pakshaOverlay ? "#2d7d46" : "var(--gl-ink-muted)",
            border: "1px solid var(--gl-gold-hairline)",
          }}
        >
          {pakshaOverlay ? "Pakṣa ON" : "Pakṣa overlay"}
        </button>
      </div>

      {/* Wheel + Detail */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex-1 rounded-xl p-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}>
            <defs>
              <filter id="nswShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.1" />
              </filter>
            </defs>

            <circle cx={CX} cy={CY} r={R_OUTER + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.3} />
            <circle cx={CX} cy={CY} r={R_OUTER + 4} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.2} strokeDasharray="3 3" />

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

              let fill = isSelected ? rc.bg : "var(--gl-card-surface-solid, #FFF9F0)";
              let stroke = isSelected ? rc.border : "var(--gl-gold-hairline)";
              let strokeW = isSelected ? 1.5 : 0.5;

              if (pakshaOverlay && !isSelected) {
                fill = pkStyle.bg;
                stroke = pkStyle.stroke;
                strokeW = 0.6;
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
                    strokeWidth={isHovered && !isSelected ? 1.5 : strokeW}
                    style={{ transition: "all 0.2s ease" }}
                  />
                  <text x={nx} y={ny + 3} textAnchor="middle" fill={isSelected ? rc.text : "var(--gl-ink-muted)"} fontSize={8} fontWeight={isSelected ? 700 : 500} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}>
                    {n.num}
                  </text>
                  <text x={px} y={py + 3} textAnchor="middle" fill={rc.text} fontSize={9} fontWeight={isSelected ? 700 : 600} opacity={isSelected ? 1 : 0.7} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}>
                    {n.ruler[0]}
                  </text>
                </g>
              );
            })}

            <circle cx={CX} cy={CY} r={R_MID} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} />
            <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} />

            <g>
              <circle cx={CX} cy={CY} r={R_INNER - 6} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-hairline)" strokeWidth={1} />
              <g opacity={0.12}>
                <circle cx={CX} cy={CY} r={R_INNER - 18} fill="none" stroke="var(--gl-gold-accent)" strokeWidth={1}>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="60s" repeatCount="indefinite" />
                </circle>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                  const x1 = CX + (R_INNER - 28) * Math.cos((a - 90) * (Math.PI / 180));
                  const y1 = CY + (R_INNER - 28) * Math.sin((a - 90) * (Math.PI / 180));
                  const x2 = CX + (R_INNER - 16) * Math.cos((a - 90) * (Math.PI / 180));
                  const y2 = CY + (R_INNER - 16) * Math.sin((a - 90) * (Math.PI / 180));
                  return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--gl-gold-accent)" strokeWidth={1} />;
                })}
              </g>
              <text x={CX} y={CY - 4} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>27 NAKṢATRAS</text>
              <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={8} style={{ fontFamily: "var(--font-sans), sans-serif" }}>Click to explore</text>
            </g>
          </svg>
        </div>

        {/* Detail panel */}
        <div className="w-full xl:w-72 shrink-0 rounded-xl p-4 space-y-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          {displayN ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Nakṣatra {displayN.num}/27</p>
                  <h4 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                    <IAST>{displayN.name}</IAST>
                  </h4>
                </div>
                <Devanagari size="md">{displayN.devanagari}</Devanagari>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-2.5 text-center" style={{ background: RULER_COLORS[displayN.rulerKey].bg, border: `1px solid ${RULER_COLORS[displayN.rulerKey].border}` }}>
                  <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Ruler</div>
                  <div className="text-sm font-semibold" style={{ color: RULER_COLORS[displayN.rulerKey].text }}>{displayN.ruler}</div>
                </div>
                <div className="rounded-lg p-2.5 text-center" style={{ background: GANA_STYLE[displayN.gana].bg, border: `1px solid ${GANA_STYLE[displayN.gana].text}` }}>
                  <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Gana</div>
                  <div className="text-sm font-semibold" style={{ color: GANA_STYLE[displayN.gana].text }}>{displayN.gana}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Deity:</span> {displayN.deity}</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Symbol:</span> {displayN.symbol}</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Yoni:</span> {displayN.yoni}</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Tara:</span> {displayN.taraName} (group {displayN.taraGroup})</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>Naming Syllables</p>
                <div className="grid grid-cols-4 gap-2">
                  {displayN.syllables.map((s, i) => (
                    <div key={i} className="rounded-lg p-2 text-center" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
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
            <div className="text-center py-8">
              <p className="text-sm italic" style={{ color: "var(--gl-ink-muted)" }}>Hover or click a segment on the wheel to see details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pakṣa legend */}
      {pakshaOverlay && (
        <div className="flex flex-wrap gap-4 justify-center mt-4">
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
