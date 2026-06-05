"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Eye, GitCompare, RotateCcw, SlidersHorizontal, Telescope } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type DomainKey = "marriage" | "career" | "children" | "substrate";

const DOMAIN_ROUTES: Record<DomainKey, { label: string; varga: number; chart: string; domain: string; caution: string; color: string }> = {
  marriage: {
    label: "Marriage / dharma",
    varga: 9,
    chart: "D9 Navamsha",
    domain: "spouse, marriage depth, dharma, deeper planetary strength",
    caution: "Do not read D9 as an unrelated second horoscope; read it with the D1.",
    color: GREEN,
  },
  career: {
    label: "Career",
    varga: 10,
    chart: "D10 Dashamsha",
    domain: "profession, public work, career performance",
    caution: "A career judgment from D1 alone is shallow by the varga standard.",
    color: BLUE,
  },
  children: {
    label: "Children",
    varga: 7,
    chart: "D7 Saptamsha",
    domain: "children and progeny matters",
    caution: "The question routes to D7, then returns to D1 for confirmation.",
    color: GOLD,
  },
  substrate: {
    label: "Karmic substrate",
    varga: 60,
    chart: "D60 Shashtyamsha",
    domain: "deep karmic substrate and subtle roots",
    caution: "Deep vargas demand accurate birth time; handle D60 carefully.",
    color: VERMILION,
  },
};

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export function VargaExplainer() {
  const [division, setDivision] = useState(9);
  const [domain, setDomain] = useState<DomainKey>("marriage");
  const [planetDegree, setPlanetDegree] = useState(12);
  const [readWithD1, setReadWithD1] = useState(true);

  const partWidth = 30 / division;
  const partIndex = Math.min(division - 1, Math.floor(planetDegree / partWidth));
  const mappedSign = SIGNS[partIndex % 12];
  const activeDomain = DOMAIN_ROUTES[domain];

  const synthesis = useMemo(() => {
    if (!readWithD1) {
      return "Incomplete handling: the varga is being treated as a separate horoscope. Bring the D1 back in as the macroscopic chart.";
    }
    if (division === activeDomain.varga) {
      return `${activeDomain.chart} is the right zoom lens for ${activeDomain.label.toLowerCase()}. The D1 gives the whole picture; the varga magnifies the domain.`;
    }
    return `This D${division} subdivision teaches the D-number idea, but the selected domain routes to ${activeDomain.chart}. Match the question to its varga.`;
  }, [activeDomain, division, readWithD1]);

  return (
    <div data-interactive="varga-explainer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Varga magnification principle</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Dn means n divisions of every 30 degree rashi
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Cut one sign into equal parts, route a life question to its varga, and keep the D1 beside the zoom lens.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDivision(9);
              setDomain("marriage");
              setPlanetDegree(12);
              setReadWithD1(true);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(330px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Subdivision view</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                D{division}: {division} parts, {partWidth.toFixed(2)} degrees each
              </h3>
            </div>
            <strong style={{ color: division === activeDomain.varga ? GREEN : GOLD }}>{division === activeDomain.varga ? "Domain matched" : "Concept demo"}</strong>
          </div>

          <VargaSvg division={division} planetDegree={planetDegree} partIndex={partIndex} mappedSign={mappedSign} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <ResultCard title="D-number" value={`D${division}`} color={BLUE} note={`${division} equal parts per rashi.`} />
            <ResultCard title="Part width" value={`${partWidth.toFixed(2)} deg`} color={GOLD} note="30 degrees divided by n." />
            <ResultCard title="Planet falls in" value={`Part ${partIndex + 1}`} color={GREEN} note={`Mapped here to ${mappedSign}.`} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Choose D-number" icon={<SlidersHorizontal size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[1, 7, 9, 10, 60].map((value) => (
                <button key={value} type="button" onClick={() => setDivision(value)} style={buttonStyle(division === value, BLUE)}>
                  D{value}
                </button>
              ))}
            </div>
            <label style={labelStyle}>
              Planet degree in sign: {planetDegree} deg
              <input type="range" min={0} max={29.9} step={0.1} value={planetDegree} onChange={(event) => setPlanetDegree(Number(event.target.value))} style={{ accentColor: GOLD }} />
            </label>
          </Panel>

          <Panel title="Route the question" icon={<Telescope size={18} />} color={activeDomain.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(DOMAIN_ROUTES) as DomainKey[]).map((key) => (
                <button key={key} type="button" onClick={() => { setDomain(key); setDivision(DOMAIN_ROUTES[key].varga); }} style={buttonStyle(domain === key, DOMAIN_ROUTES[key].color)}>
                  {DOMAIN_ROUTES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {activeDomain.chart}: {activeDomain.domain}.
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <Panel title="Read with D1" icon={<BadgeCheck size={18} />} color={readWithD1 ? GREEN : VERMILION}>
          <button type="button" aria-pressed={readWithD1} onClick={() => setReadWithD1((value) => !value)} style={buttonStyle(readWithD1, readWithD1 ? GREEN : VERMILION)}>
            {readWithD1 ? "D1 + varga" : "Varga alone"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {readWithD1 ? "Correct: the varga magnifies one layer of the same birth chart." : "Risk: this treats the varga like a separate horoscope."}
          </p>
        </Panel>

        <Panel title="D1 versus zoom" icon={<GitCompare size={18} />} color={GOLD}>
          <div style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
            <span><strong style={{ color: INK_PRIMARY }}>D1:</strong> macroscopic life picture.</span>
            <span><strong style={{ color: INK_PRIMARY }}>{activeDomain.chart}:</strong> magnifies {activeDomain.label.toLowerCase()}.</span>
            <span><strong style={{ color: INK_PRIMARY }}>Rule:</strong> domain question goes to its varga, confirmed against D1.</span>
          </div>
        </Panel>

        <section style={{ border: `1px solid ${readWithD1 ? GOLD : VERMILION}66`, borderRadius: 8, background: `${readWithD1 ? GOLD : VERMILION}12`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: readWithD1 ? GOLD : VERMILION, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            <Eye size={18} />
            Magnification verdict
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{activeDomain.caution}</p>
        </section>
      </div>
    </div>
  );
}

function VargaSvg({ division, planetDegree, partIndex, mappedSign }: { division: number; planetDegree: number; partIndex: number; mappedSign: string }) {
  const width = 536;
  const startX = 44;
  const markerX = startX + (planetDegree / 30) * width;
  const visibleParts = Math.min(division, 30);

  return (
    <svg viewBox="0 0 620 300" role="img" aria-label="Rashi subdivided into equal varga parts" style={{ width: "100%", maxHeight: 350, margin: "0.65rem auto 0.9rem", display: "block" }}>
      <rect x="34" y="44" width="556" height="210" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">One 30 degree rashi</text>
      <rect x={startX} y="96" width={width} height="82" rx="8" fill={`${GOLD}12`} stroke={HAIRLINE} />
      {Array.from({ length: visibleParts }).map((_, index) => {
        const x = startX + (index / visibleParts) * width;
        const nextX = startX + ((index + 1) / visibleParts) * width;
        const isActive = division <= 30 ? index === partIndex : Math.floor((partIndex / division) * visibleParts) === index;
        return (
          <g key={index}>
            <rect x={x} y="96" width={nextX - x} height="82" fill={isActive ? `${GREEN}24` : index % 2 === 0 ? `${GOLD}0D` : "transparent"} />
            <line x1={x} y1="96" x2={x} y2="178" stroke={`${GOLD}55`} />
          </g>
        );
      })}
      <line x1={startX + width} y1="96" x2={startX + width} y2="178" stroke={`${GOLD}55`} />
      <line x1={markerX} y1="82" x2={markerX} y2="198" stroke={VERMILION} strokeWidth="3" />
      <circle cx={markerX} cy="137" r="17" fill={VERMILION} />
      <text x={markerX} y="142" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">P</text>
      <text x={startX} y="204" fill={INK_SECONDARY} fontSize="11.5" fontWeight="700">0 deg</text>
      <text x={startX + width} y="204" textAnchor="end" fill={INK_SECONDARY} fontSize="11.5" fontWeight="700">30 deg</text>
      <rect x="164" y="232" width="292" height="30" rx="8" fill={`${GREEN}14`} stroke={`${GREEN}55`} />
      <text x="310" y="252" textAnchor="middle" fill={GREEN} fontSize="12.5" fontWeight="800">
        Part {partIndex + 1} maps to {mappedSign} in this teaching model
      </text>
      {division > 30 ? (
        <text x="310" y="222" textAnchor="middle" fill={INK_SECONDARY} fontSize="11.5" fontWeight="700">D60 compressed: 60 fine parts shown as grouped bands</text>
      ) : null}
    </svg>
  );
}

function ResultCard({ title, value, color, note }: { title: string; value: string; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ color, fontWeight: 800 }}>{title}</div>
      <strong style={{ display: "block", marginTop: "0.45rem", color: INK_PRIMARY }}>{value}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, lineHeight: 1.4 }}>{note}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
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
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: INK_MUTED,
  fontWeight: 800,
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
