"use client";

import React, { useState, useMemo } from "react";
import { Info } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#10b981";
const RED = "#ef4444";
const AMBER = "#f59e0b";
const BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const GRAHAS = [
  { key: "sun", name: "Sun", iast: "Sūrya", houseFavourable: [1, 5, 9, 10, 11] },
  { key: "moon", name: "Moon", iast: "Candra", houseFavourable: [1, 4, 7, 10] },
  { key: "mars", name: "Mars", iast: "Maṅgala", houseFavourable: [3, 6, 10, 11] },
  { key: "mercury", name: "Mercury", iast: "Budha", houseFavourable: [1, 2, 4, 7, 10] },
  { key: "jupiter", name: "Jupiter", iast: "Guru", houseFavourable: [1, 2, 5, 9, 10, 11] },
  { key: "venus", name: "Venus", iast: "Śukra", houseFavourable: [1, 2, 3, 4, 5, 8, 9, 11, 12] },
  { key: "saturn", name: "Saturn", iast: "Śani", houseFavourable: [3, 6, 10, 11] },
  { key: "rahu", name: "Rahu", iast: "Rāhu", houseFavourable: [3, 6, 10, 11] },
  { key: "ketu", name: "Ketu", iast: "Ketu", houseFavourable: [3, 6, 10, 11] },
];

const DOMAINS = [
  { key: "marriage", label: "Marriage", icon: "💍" },
  { key: "career", label: "Career", icon: "💼" },
  { key: "energy", label: "Energy/Health", icon: "⚡" },
  { key: "children", label: "Children", icon: "👶" },
  { key: "health", label: "Health", icon: "🏥" },
];

/* ── Vertical Gauge Component ── */
function VerticalGauge({
  label,
  icon,
  selectedHouse,
  favourableHouses,
  onHouseChange,
  accentColor,
}: {
  label: string;
  icon: string;
  selectedHouse: number;
  favourableHouses: number[];
  onHouseChange: (h: number) => void;
  accentColor: string;
}) {
  const isFav = favourableHouses.includes(selectedHouse);
  const GAUGE_H = 240;
  const TICK_H = GAUGE_H / 12;

  return (
    <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "90px" }}>
      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <div style={{ fontSize: "9px", fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      </div>

      {/* Gauge body */}
      <div style={{
        position: "relative",
        width: "56px",
        height: `${GAUGE_H}px`,
        background: "rgba(0,0,0,0.03)",
        borderRadius: "8px",
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        {/* House tick marks */}
        {Array.from({ length: 12 }, (_, i) => {
          const h = i + 1;
          const isSelected = h === selectedHouse;
          const isFavourable = favourableHouses.includes(h);
          const y = i * TICK_H;
          const bgColor = isSelected
            ? (isFavourable ? `${GREEN}30` : `${RED}20`)
            : (isFavourable ? `${GREEN}08` : "transparent");
          const borderColor = isSelected
            ? (isFavourable ? GREEN : RED)
            : "rgba(0,0,0,0.04)";

          return (
            <div
              key={h}
              onClick={() => onHouseChange(h)}
              style={{
                position: "absolute",
                top: `${y}px`,
                left: 0,
                right: 0,
                height: `${TICK_H}px`,
                background: bgColor,
                borderBottom: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title={`House ${h}${isFavourable ? " (Favourable)" : ""}`}
            >
              <span style={{
                fontSize: isSelected ? "11px" : "8px",
                fontWeight: isSelected ? 800 : 500,
                color: isSelected
                  ? (isFavourable ? GREEN : RED)
                  : (isFavourable ? `${GREEN}90` : INK_MUTED),
              }}>
                H{h}
              </span>
              {/* Favourable dot */}
              {isFavourable && !isSelected && (
                <div style={{
                  position: "absolute",
                  right: "4px",
                  width: "4px",
                  height: "4px",
                  borderRadius: "2px",
                  background: `${GREEN}60`,
                }} />
              )}
              {/* Selected indicator */}
              {isSelected && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: isFavourable ? GREEN : RED,
                  borderRadius: "0 2px 2px 0",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Status badge */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 8px",
        borderRadius: "4px",
        background: isFav ? `${GREEN}12` : `${RED}10`,
        border: `1px solid ${isFav ? `${GREEN}30` : `${RED}25`}`,
      }}>
        <span style={{ fontSize: "10px" }}>{isFav ? "✓" : "✗"}</span>
        <span style={{ fontSize: "9px", fontWeight: 700, color: isFav ? GREEN : RED }}>
          {isFav ? "Favourable" : "Contrary"}
        </span>
      </div>
    </div>
  );
}

export function ThreeReferenceReader() {
  const [selectedGraha, setSelectedGraha] = useState<string>("jupiter");
  const [domain, setDomain] = useState<string>("career");
  const [moonHouse, setMoonHouse] = useState<number>(1);
  const [lagnaHouse, setLagnaHouse] = useState<number>(1);
  const [natalHouse, setNatalHouse] = useState<number>(10);

  const graha = GRAHAS.find(g => g.key === selectedGraha) || GRAHAS[4];

  const moonFav = graha.houseFavourable.includes(moonHouse);
  const lagnaFav = graha.houseFavourable.includes(lagnaHouse);
  const natalFav = graha.houseFavourable.includes(natalHouse);
  const convergenceScore = (moonFav ? 1 : 0) + (lagnaFav ? 1 : 0) + (natalFav ? 1 : 0);

  const verdict = useMemo(() => {
    if (convergenceScore === 3) return { status: "STRONG", text: "Strong convergence. All three references support this domain. High probability of manifestation.", color: GREEN };
    if (convergenceScore === 2) return { status: "MODERATE", text: "Moderate convergence. Two references align; one is neutral or contrary. Events may unfold with adjustments.", color: "#9C7A2F" };
    if (convergenceScore === 1) return { status: "WEAK", text: "Weak convergence. Only one reference supports. The event may be delayed, partial, or require significant remedial effort.", color: AMBER };
    return { status: "NONE", text: "No convergence. All three references are neutral or contrary. The domain is unlikely to manifest without major mitigating factors.", color: RED };
  }, [convergenceScore]);

  const strengthPercent = Math.round((convergenceScore / 3) * 100);
  const barColor = convergenceScore === 3 ? GREEN : convergenceScore === 2 ? "#9C7A2F" : convergenceScore === 1 ? AMBER : RED;

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>

      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Trividha-Dṛṣṭi</IAST> — Three-Reference Reader
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Moon + Lagna + Natal Planet convergence for timing events. Click any house tick to update.</p>
      </div>

      {/* ─── CONTROLS BAR ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Graha</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {GRAHAS.map(g => (
                <button key={g.key} onClick={() => setSelectedGraha(g.key)} title={g.name} style={{ padding: "4px 7px", borderRadius: "4px", border: selectedGraha === g.key ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: selectedGraha === g.key ? "rgba(156,122,47,0.08)" : "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: selectedGraha === g.key ? GOLD_DEEP : INK_SECONDARY }}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Domain</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {DOMAINS.map(d => (
                <button key={d.key} onClick={() => setDomain(d.key)} style={{ padding: "4px 8px", borderRadius: "4px", border: domain === d.key ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: domain === d.key ? "rgba(156,122,47,0.08)" : "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: domain === d.key ? GOLD_DEEP : INK_SECONDARY }}>
                  {d.icon} {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* House selectors (dropdown fallback for mobile) */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Moon</span>
            <select value={moonHouse} onChange={(e) => setMoonHouse(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "70px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Lagna</span>
            <select value={lagnaHouse} onChange={(e) => setLagnaHouse(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "70px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Natal Planet</span>
            <select value={natalHouse} onChange={(e) => setNatalHouse(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "70px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── MAIN: THREE GAUGES + VERDICT ─── */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Three Vertical Gauges */}
        <div style={{ flex: "0 0 auto", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", gap: "10px" }}>
          <VerticalGauge
            label="From Moon"
            icon="☽"
            selectedHouse={moonHouse}
            favourableHouses={graha.houseFavourable}
            onHouseChange={setMoonHouse}
            accentColor={BLUE}
          />
          <VerticalGauge
            label="From Lagna"
            icon="⬆"
            selectedHouse={lagnaHouse}
            favourableHouses={graha.houseFavourable}
            onHouseChange={setLagnaHouse}
            accentColor="#9C7A2F"
          />
          <VerticalGauge
            label={graha.name}
            icon="🪐"
            selectedHouse={natalHouse}
            favourableHouses={graha.houseFavourable}
            onHouseChange={setNatalHouse}
            accentColor="#6366f1"
          />
        </div>

        {/* Verdict + Combined Strength */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          {/* Combined Strength Bar */}
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>Combined Convergence Strength</span>
              <span style={{ fontSize: "16px", fontWeight: 800, color: barColor }}>{strengthPercent}%</span>
            </div>
            {/* Progress bar */}
            <div style={{ width: "100%", height: "14px", background: "rgba(0,0,0,0.04)", borderRadius: "7px", overflow: "hidden", position: "relative" }}>
              <div style={{
                width: `${strengthPercent}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
                borderRadius: "7px",
                transition: "width 0.4s ease, background 0.3s ease",
              }} />
              {/* Tick markers at 33% and 66% */}
              <div style={{ position: "absolute", left: "33.3%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.5)" }} />
              <div style={{ position: "absolute", left: "66.6%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.5)" }} />
            </div>
            {/* Scale labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontSize: "8px", color: RED, fontWeight: 600 }}>0/3</span>
              <span style={{ fontSize: "8px", color: AMBER, fontWeight: 600 }}>1/3</span>
              <span style={{ fontSize: "8px", color: "#9C7A2F", fontWeight: 600 }}>2/3</span>
              <span style={{ fontSize: "8px", color: GREEN, fontWeight: 600 }}>3/3</span>
            </div>
          </div>

          {/* Verdict panel */}
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px", background: verdict.color, color: "#ffffff" }}>
                {verdict.status}
              </span>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>Timing Synthesis</h4>
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>{verdict.text}</p>

            {/* Reference cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
              <div style={{ background: moonFav ? "#f0fdf4" : "#fef2f2", padding: "8px 6px", borderRadius: "6px", textAlign: "center", border: `1px solid ${moonFav ? "#bbf7d0" : "#fecaca"}` }}>
                <div style={{ fontSize: "12px", marginBottom: "2px" }}>☽</div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: moonFav ? "#166534" : "#991b1b" }}>Moon → H{moonHouse}</div>
                <div style={{ fontSize: "8px", color: INK_MUTED, marginTop: "1px" }}>{moonFav ? "Favourable" : "Contrary"}</div>
              </div>
              <div style={{ background: lagnaFav ? "#f0fdf4" : "#fef2f2", padding: "8px 6px", borderRadius: "6px", textAlign: "center", border: `1px solid ${lagnaFav ? "#bbf7d0" : "#fecaca"}` }}>
                <div style={{ fontSize: "12px", marginBottom: "2px" }}>⬆</div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: lagnaFav ? "#166534" : "#991b1b" }}>Lagna → H{lagnaHouse}</div>
                <div style={{ fontSize: "8px", color: INK_MUTED, marginTop: "1px" }}>{lagnaFav ? "Favourable" : "Contrary"}</div>
              </div>
              <div style={{ background: natalFav ? "#f0fdf4" : "#fef2f2", padding: "8px 6px", borderRadius: "6px", textAlign: "center", border: `1px solid ${natalFav ? "#bbf7d0" : "#fecaca"}` }}>
                <div style={{ fontSize: "12px", marginBottom: "2px" }}>🪐</div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: natalFav ? "#166534" : "#991b1b" }}>{graha.name} → H{natalHouse}</div>
                <div style={{ fontSize: "8px", color: INK_MUTED, marginTop: "1px" }}>{natalFav ? "Favourable" : "Contrary"}</div>
              </div>
            </div>

            {/* Favourable houses legend */}
            <div style={{ marginTop: "10px", padding: "8px", background: "rgba(0,0,0,0.02)", borderRadius: "6px" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", marginBottom: "3px" }}>
                <IAST>{graha.iast}</IAST> — Favourable Transit Houses
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {graha.houseFavourable.map(h => (
                  <span key={h} style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>
                    H{h}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Each lens adds a reference frame. All three converging = high confidence. Dignity of <IAST>{graha.iast}</IAST> modifies the strength of each reference.
            </p>
          </div>

          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — the three-reference rule (Moon + Lagna + Natal Planet) for <IAST>gochara</IAST> timing. <IAST>Phaladīpikā</IAST> — when all three references align, the event is certain.
          </div>
        </div>
      </div>
    </div>
  );
}
