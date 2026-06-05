"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, BadgeCheck, Layers, RotateCcw, ShieldCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#7A5BA6";

type PlanetKey = "lagna" | "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type DignityKey = "strong" | "neutral" | "debilitated";
type PresetKey = "d1d9" | "triple" | "quadruple" | "sarva" | "debilitated";

const PLANETS: Record<PlanetKey, { label: string; glyph: string; note: string }> = {
  lagna: { label: "Lagna", glyph: "La", note: "body and chart lens" },
  sun: { label: "Surya", glyph: "Su", note: "authority and vitality" },
  moon: { label: "Chandra", glyph: "Mo", note: "mind and receptivity" },
  mars: { label: "Mangala", glyph: "Ma", note: "action and courage" },
  mercury: { label: "Budha", glyph: "Me", note: "speech and skill" },
  jupiter: { label: "Guru", glyph: "Ju", note: "wisdom and expansion" },
  venus: { label: "Shukra", glyph: "Ve", note: "grace and relationship" },
  saturn: { label: "Shani", glyph: "Sa", note: "discipline and karma" },
};

const SIGNS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Mina",
];

const VARGAS = ["D1", "D9", "D2", "D3", "D4", "D7", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"];

const PRESETS: Record<PresetKey, { label: string; vargas: string[]; dignity: DignityKey; sign: number }> = {
  d1d9: { label: "D1-D9 vargottama", vargas: ["D1", "D9"], dignity: "strong", sign: 4 },
  triple: { label: "Triple vargottama", vargas: ["D1", "D9", "D60"], dignity: "strong", sign: 8 },
  quadruple: { label: "Quadruple tier", vargas: ["D1", "D9", "D12", "D30"], dignity: "neutral", sign: 0 },
  sarva: { label: "Sarvavargottama flag", vargas: VARGAS, dignity: "strong", sign: 11 },
  debilitated: { label: "Debilitated in both", vargas: ["D1", "D9"], dignity: "debilitated", sign: 6 },
};

const DIGNITIES: Record<DignityKey, { label: string; color: string; note: string }> = {
  strong: { label: "Own / exalted / supported", color: GREEN, note: "same-sign consistency can carry strength cleanly" },
  neutral: { label: "Neutral dignity", color: GOLD, note: "consistency helps, but context still decides" },
  debilitated: { label: "Debilitated / weak in both", color: VERMILION, note: "vargottama can lock weakness, not magically reverse it" },
};

function getTier(active: string[], dignity: DignityKey) {
  const count = active.length;
  const hasD9 = active.includes("D9");

  if (dignity === "debilitated" && hasD9) {
    return {
      label: "Consistently weak",
      rarity: "same sign, weak dignity",
      color: VERMILION,
      body: "Read this as a stable weakness pattern. Vargottama does not turn debility into strength by itself.",
      cue: "Caveat first",
    };
  }

  if (count === VARGAS.length) {
    return {
      label: "Sarvavargottama flag",
      rarity: "near-mythical",
      color: VERMILION,
      body: "All sixteen vargas show the same rashi. Treat this as a data-verification alarm before interpretation.",
      cue: "Verify birth data",
    };
  }

  if (count >= 4 && hasD9) {
    return {
      label: "Quadruple / deep multi-varga",
      rarity: "very rare",
      color: PURPLE,
      body: "The same rashi repeats through several lenses, so the planet's theme becomes unusually reliable.",
      cue: "Rarer is stronger",
    };
  }

  if (count >= 3 && hasD9) {
    return {
      label: "Triple vargottama",
      rarity: "rare",
      color: BLUE,
      body: "D1-D9 is joined by another varga, so the core promise gains a deeper confirmation layer.",
      cue: "Note the extra varga",
    };
  }

  if (count >= 2 && hasD9) {
    return {
      label: "D1-D9 vargottama",
      rarity: "primary case",
      color: GREEN,
      body: "Same rashi in the birth chart and Navamsha: the lesson's first check for consistency.",
      cue: "Check for every planet",
    };
  }

  return {
    label: "Not primary vargottama",
    rarity: "incomplete D1-D9 link",
    color: GOLD,
    body: "Some divisional agreement may be present, but the first doctrine check is D1 with D9.",
    cue: "Start with D1-D9",
  };
}

export function VargottamaScanner() {
  const [planetKey, setPlanetKey] = useState<PlanetKey>("lagna");
  const [signIndex, setSignIndex] = useState(4);
  const [activeVargas, setActiveVargas] = useState<string[]>(["D1", "D9"]);
  const [dignity, setDignity] = useState<DignityKey>("strong");
  const [showHeuristic, setShowHeuristic] = useState(true);

  const planet = PLANETS[planetKey];
  const tier = useMemo(() => getTier(activeVargas, dignity), [activeVargas, dignity]);
  const dignityMeta = DIGNITIES[dignity];
  const signName = SIGNS[signIndex];
  const sameCount = activeVargas.length;
  const inactiveCount = VARGAS.length - sameCount;

  function toggleVarga(varga: string) {
    if (varga === "D1") return;
    setActiveVargas((current) =>
      current.includes(varga) ? current.filter((item) => item !== varga) : [...current, varga].sort((a, b) => VARGAS.indexOf(a) - VARGAS.indexOf(b)),
    );
  }

  function applyPreset(key: PresetKey) {
    const preset = PRESETS[key];
    setActiveVargas(preset.vargas);
    setDignity(preset.dignity);
    setSignIndex(preset.sign);
  }

  function reset() {
    setPlanetKey("lagna");
    setSignIndex(4);
    setActiveVargas(["D1", "D9"]);
    setDignity("strong");
    setShowHeuristic(true);
  }

  return (
    <div data-interactive="vargottama-scanner" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ textTransform: "uppercase", letterSpacing: "0.12em", color: GOLD, fontWeight: 800, fontSize: "0.82rem" }}>
            Vargottama scanner
          </div>
          <h3 style={{ margin: "0.25rem 0", fontSize: "1.35rem", color: INK_PRIMARY, lineHeight: 1.25, fontWeight: 700 }}>
            {planet.label} fixed in {signName}
          </h3>
          <p style={{ margin: 0, maxWidth: "720px", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Toggle which vargas repeat the D1 sign. The lesson logic is simple: D1-D9 is the first confirmation, more vargas make it rarer, and weak dignity stays weak.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "0.5rem",
            background: "rgba(255,255,255,0.55)",
            color: INK_PRIMARY,
            padding: "0.7rem 0.9rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.28fr) minmax(300px, 0.72fr)", gap: "1rem", alignItems: "start" }}>
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "0.6rem",
            background: SURFACE,
            padding: "1rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <VargottamaTierSvg
            activeVargas={activeVargas}
            signName={signName}
            planetGlyph={planet.glyph}
            tierColor={tier.color}
            dignityColor={dignityMeta.color}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 0.44fr)",
              gap: "0.8rem",
            }}
          >
            <div
              style={{
                border: `1px solid ${tier.color}55`,
                borderLeft: `4px solid ${tier.color}`,
                borderRadius: "0.55rem",
                background: `${tier.color}14`,
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ textTransform: "uppercase", letterSpacing: "0.08em", color: tier.color, fontWeight: 800, fontSize: "0.78rem" }}>
                    {tier.rarity}
                  </div>
                  <h4 style={{ margin: "0.2rem 0", fontSize: "1.08rem", color: INK_PRIMARY, lineHeight: 1.25 }}>{tier.label}</h4>
                </div>
                <span
                  style={{
                    borderRadius: "0.45rem",
                    background: `${tier.color}1f`,
                    color: tier.color,
                    padding: "0.55rem 0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {sameCount} / 16 same
                </span>
              </div>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{tier.body}</p>
            </div>

            <div
              style={{
                border: `1px solid ${dignityMeta.color}55`,
                borderRadius: "0.55rem",
                background: `${dignityMeta.color}10`,
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: dignityMeta.color, fontWeight: 800 }}>
                <ShieldCheck size={18} />
                Dignity check
              </div>
              <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{dignityMeta.note}</p>
            </div>
          </div>
        </section>

        <aside style={{ display: "grid", gap: "0.85rem" }}>
          <section
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "0.6rem",
              background: SURFACE,
              padding: "1rem",
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <PanelTitle icon={<Layers size={18} />} label="Lesson presets" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
                const preset = PRESETS[key];
                const selected = activeVargas.join("|") === preset.vargas.join("|") && dignity === preset.dignity;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    style={{
                      border: `1px solid ${selected ? GOLD : HAIRLINE}`,
                      borderRadius: "0.45rem",
                      background: selected ? "rgba(184,132,33,0.14)" : "rgba(255,255,255,0.54)",
                      color: selected ? GOLD : INK_PRIMARY,
                      padding: "0.7rem",
                      minHeight: "56px",
                      fontWeight: 700,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "0.6rem",
              background: SURFACE,
              padding: "1rem",
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <PanelTitle icon={<BadgeCheck size={18} />} label="Planet and D1 sign" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem" }}>
              {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlanetKey(key)}
                  style={{
                    border: `1px solid ${planetKey === key ? BLUE : HAIRLINE}`,
                    borderRadius: "0.4rem",
                    background: planetKey === key ? "rgba(53,108,171,0.15)" : "rgba(255,255,255,0.5)",
                    color: planetKey === key ? BLUE : INK_SECONDARY,
                    padding: "0.55rem 0.35rem",
                    minHeight: "42px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {PLANETS[key].glyph}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.92rem" }}>{planet.note}</p>
            <select
              value={signIndex}
              onChange={(event) => setSignIndex(Number(event.target.value))}
              style={{
                width: "100%",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: "0.45rem",
                background: "rgba(255,255,255,0.6)",
                color: INK_PRIMARY,
                padding: "0.7rem",
                fontWeight: 800,
              }}
            >
              {SIGNS.map((sign, index) => (
                <option key={sign} value={index}>
                  {sign}
                </option>
              ))}
            </select>
          </section>

          <section
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "0.6rem",
              background: SURFACE,
              padding: "1rem",
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <PanelTitle icon={<AlertTriangle size={18} />} label="Dignity context" />
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => {
                const meta = DIGNITIES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDignity(key)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.75rem",
                      border: `1px solid ${dignity === key ? meta.color : HAIRLINE}`,
                      borderRadius: "0.45rem",
                      background: dignity === key ? `${meta.color}16` : "rgba(255,255,255,0.5)",
                      color: dignity === key ? meta.color : INK_PRIMARY,
                      padding: "0.7rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <span>{meta.label}</span>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: meta.color }} />
                  </button>
                );
              })}
            </div>
          </section>
        </aside>
      </div>

      <section
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: "0.6rem",
          background: SURFACE,
          padding: "1rem",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.45fr)",
          gap: "1rem",
        }}
      >
        <div>
          <PanelTitle icon={<Layers size={18} />} label="Varga agreement toggles" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
            {VARGAS.map((varga) => {
              const active = activeVargas.includes(varga);
              const locked = varga === "D1";
              return (
                <button
                  key={varga}
                  type="button"
                  onClick={() => toggleVarga(varga)}
                  aria-pressed={active}
                  style={{
                    border: `1px solid ${active ? tier.color : HAIRLINE}`,
                    borderRadius: "0.45rem",
                    background: active ? `${tier.color}16` : "rgba(255,255,255,0.48)",
                    color: active ? tier.color : INK_MUTED,
                    padding: "0.62rem 0.35rem",
                    minHeight: "48px",
                    fontWeight: 700,
                    cursor: locked ? "default" : "pointer",
                  }}
                >
                  {varga}
                </button>
              );
            })}
          </div>
          <p style={{ margin: "0.75rem 0 0", color: INK_MUTED, fontSize: "0.92rem" }}>
            {sameCount} charts repeat {signName}; {inactiveCount} show a different sign.
          </p>
        </div>

        <div
          style={{
            border: `1px solid ${showHeuristic ? GOLD : HAIRLINE}`,
            borderRadius: "0.55rem",
            background: showHeuristic ? "rgba(184,132,33,0.12)" : "rgba(255,255,255,0.46)",
            padding: "1rem",
          }}
        >
          <button
            type="button"
            onClick={() => setShowHeuristic((value) => !value)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              gap: "0.75rem",
              alignItems: "center",
              border: 0,
              background: "transparent",
              color: GOLD,
              padding: 0,
              fontWeight: 750,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span>Heuristic multiplier caveat</span>
            <span>{showHeuristic ? "Shown" : "Hidden"}</span>
          </button>
          {showHeuristic ? (
            <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Treat 2x, 3x, and 4x as a teaching ladder only. They mean greater reliability by rarity, not exact arithmetic strength.
            </p>
          ) : null}
          <p style={{ margin: "0.7rem 0 0", color: tier.color, fontWeight: 750 }}>{tier.cue}</p>
        </div>
      </section>
    </div>
  );
}

function PanelTitle({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_PRIMARY, fontWeight: 800 }}>
      <span style={{ color: GOLD, display: "inline-flex" }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function VargottamaTierSvg({
  activeVargas,
  signName,
  planetGlyph,
  tierColor,
  dignityColor,
}: {
  activeVargas: string[];
  signName: string;
  planetGlyph: string;
  tierColor: string;
  dignityColor: string;
}) {
  const cells = VARGAS.map((varga, index) => ({
    varga,
    active: activeVargas.includes(varga),
    x: 28 + (index % 4) * 142,
    y: 24 + Math.floor(index / 4) * 74,
  }));

  return (
    <svg viewBox="0 0 620 372" role="img" aria-label="Vargottama scanner diagram" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id="vargottama-dot" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill={tierColor} opacity="0.25" />
        </pattern>
        <linearGradient id="vargottama-core" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#FFF8DF" />
          <stop offset="1" stopColor="#F2E3BF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="618" height="370" rx="12" fill="#FFFCF5" stroke={HAIRLINE} />
      <circle cx="310" cy="182" r="104" fill="url(#vargottama-core)" stroke={tierColor} strokeWidth="3" />
      <circle cx="310" cy="182" r="80" fill="url(#vargottama-dot)" opacity="0.85" />
      <text x="310" y="160" textAnchor="middle" fontSize="32" fontWeight="800" fill={tierColor}>
        {planetGlyph}
      </text>
      <text x="310" y="184" textAnchor="middle" fontSize="16" fontWeight="750" fill={INK_PRIMARY}>
        {signName}
      </text>
      <text x="310" y="207" textAnchor="middle" fontSize="12" fontWeight="700" fill={dignityColor}>
        D1 anchor sign
      </text>

      {cells.map((cell) => {
        const isD1 = cell.varga === "D1";
        return (
          <g key={cell.varga}>
            <rect
              x={cell.x}
              y={cell.y}
              width="104"
              height="42"
              rx="9"
              fill={cell.active ? `${tierColor}18` : "#F3EAD9"}
              stroke={cell.active ? tierColor : "#D8C7A6"}
              strokeWidth={isD1 ? 2.5 : 1.3}
            />
            <text x={cell.x + 52} y={cell.y + 18} textAnchor="middle" fontSize="13" fontWeight="750" fill={cell.active ? tierColor : INK_MUTED}>
              {cell.varga}
            </text>
            <text x={cell.x + 52} y={cell.y + 33} textAnchor="middle" fontSize="10" fontWeight="650" fill={cell.active ? INK_PRIMARY : INK_MUTED}>
              {cell.active ? signName : "different"}
            </text>
          </g>
        );
      })}

      <path d="M238 292 C270 318 350 318 382 292" fill="none" stroke={tierColor} strokeWidth="3" strokeLinecap="round" />
      <text x="310" y="338" textAnchor="middle" fontSize="13" fontWeight="750" fill={INK_PRIMARY}>
        Rarer same-sign repetition increases reliability, but dignity still governs quality.
      </text>
    </svg>
  );
}
