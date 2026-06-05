"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BadgeAlert, BadgeCheck, GitCompare, MapPinned, RotateCcw, SlidersHorizontal } from "lucide-react";

type SystemKey = "whole" | "sripati" | "placidus" | "equal";

interface Sign {
  index: number;
  name: string;
  english: string;
}

interface SystemResult {
  key: SystemKey;
  name: string;
  module: string;
  boundaryDeg: number | null;
  house: number;
  rule: string;
  color: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SIGNS: Sign[] = [
  { index: 1, name: "Mesha", english: "Aries" },
  { index: 2, name: "Vrishabha", english: "Taurus" },
  { index: 3, name: "Mithuna", english: "Gemini" },
  { index: 4, name: "Karka", english: "Cancer" },
  { index: 5, name: "Simha", english: "Leo" },
  { index: 6, name: "Kanya", english: "Virgo" },
  { index: 7, name: "Tula", english: "Libra" },
  { index: 8, name: "Vrishchika", english: "Scorpio" },
  { index: 9, name: "Dhanus", english: "Sagittarius" },
  { index: 10, name: "Makara", english: "Capricorn" },
  { index: 11, name: "Kumbha", english: "Aquarius" },
  { index: 12, name: "Mina", english: "Pisces" },
];

function clampDegree(value: number) {
  return Math.max(0, Math.min(29.9, value));
}

function houseFromLagna(lagnaSign: number, planetSign: number) {
  return ((planetSign - lagnaSign + 12) % 12) + 1;
}

function cuspBoundary(lagnaDegree: number, latitude: number, system: SystemKey) {
  if (system === "whole") return null;
  if (system === "equal") return lagnaDegree;
  if (system === "sripati") return clampDegree(lagnaDegree + 4 + latitude / 18);
  return clampDegree(lagnaDegree + 8 + latitude / 7);
}

function systemHouse(lagnaSign: number, planetSign: number, planetDegree: number, boundary: number | null) {
  const wholeHouse = houseFromLagna(lagnaSign, planetSign);
  if (boundary === null) return wholeHouse;
  const isRisingSign = planetSign === lagnaSign;
  if (isRisingSign && planetDegree >= boundary) return 2;
  return wholeHouse;
}

function xForDegree(degree: number) {
  return 24 + (degree / 30) * 512;
}

export function HouseSystemComparator() {
  const [lagnaSign, setLagnaSign] = useState(1);
  const [lagnaDegree, setLagnaDegree] = useState(0);
  const [planetSign, setPlanetSign] = useState(1);
  const [planetDegree, setPlanetDegree] = useState(28);
  const [latitude, setLatitude] = useState(28);
  const [nameLabels, setNameLabels] = useState(true);

  const planet = SIGNS[planetSign - 1];
  const lagna = SIGNS[lagnaSign - 1];

  const results = useMemo<SystemResult[]>(() => {
    const systems: Omit<SystemResult, "boundaryDeg" | "house">[] = [
      { key: "whole", name: "Whole-sign", module: "Tier 1 default", rule: "Every house is a whole sign.", color: BLUE },
      { key: "sripati", name: "Sripati / bhava-chalita", module: "Bhava-bala, Module 13", rule: "Cusps interpolate from exact Lagna.", color: GREEN },
      { key: "placidus", name: "Placidus", module: "KP, Module 16", rule: "Time-based cusps; software normally computes this.", color: PURPLE },
      { key: "equal", name: "Equal-house", module: "Rare Vedic use", rule: "Thirty-degree houses from exact Lagna.", color: GOLD },
    ];
    return systems.map((system) => {
      const boundary = cuspBoundary(lagnaDegree, latitude, system.key);
      return {
        ...system,
        boundaryDeg: boundary,
        house: systemHouse(lagnaSign, planetSign, planetDegree, boundary),
      };
    });
  }, [lagnaDegree, lagnaSign, latitude, planetDegree, planetSign]);

  const uniqueHouses = new Set(results.map((item) => item.house));
  const split = uniqueHouses.size > 1;

  return (
    <div data-interactive="house-system-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              House-system comparator
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Same planet, different boundary rules
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaSign(1);
              setLagnaDegree(0);
              setPlanetSign(1);
              setPlanetDegree(28);
              setLatitude(28);
              setNameLabels(true);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="House system controls">
          <Panel title="Chart inputs" icon={<SlidersHorizontal size={18} />} color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem" }}>
              <Picker label="Lagna sign" value={lagnaSign} onChange={setLagnaSign} />
              <Picker label="Planet sign" value={planetSign} onChange={setPlanetSign} />
            </div>
            <Slider label={`Lagna degree: ${lagnaDegree.toFixed(0)} deg`} value={lagnaDegree} min={0} max={29} onChange={setLagnaDegree} color={BLUE} />
            <Slider label={`Planet degree: ${planetDegree.toFixed(0)} deg ${planet.name}`} value={planetDegree} min={0} max={29} onChange={setPlanetDegree} color={VERMILION} />
            <Slider label={`Latitude cue: ${latitude.toFixed(0)} deg`} value={latitude} min={0} max={60} onChange={setLatitude} color={PURPLE} />
          </Panel>

          <Panel title="Name your system" icon={nameLabels ? <BadgeCheck size={18} /> : <BadgeAlert size={18} />} color={nameLabels ? GREEN : VERMILION}>
            <button
              type="button"
              aria-pressed={nameLabels}
              onClick={() => setNameLabels((value) => !value)}
              style={{ border: `1px solid ${nameLabels ? GREEN : VERMILION}`, borderRadius: 8, background: nameLabels ? GREEN : VERMILION, color: "#fff", padding: "0.58rem 0.75rem", fontWeight: 900, cursor: "pointer" }}
            >
              Labels {nameLabels ? "on" : "off"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {nameLabels ? "Clean: each result names the house system used." : "Risk: unlabeled results invite accidental blending."}
            </p>
          </Panel>
        </section>

        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Boundary visualization">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE, fontWeight: 950, marginBottom: "0.85rem" }}>
            <MapPinned size={18} aria-hidden="true" />
            Rising sign boundary demo
          </div>
          <svg viewBox="0 0 560 170" role="img" aria-label="Planet and cusp boundaries across the rising sign" style={{ width: "100%", height: "auto", display: "block" }}>
            <rect x="24" y="50" width="512" height="48" rx="10" fill="rgba(255,251,241,0.8)" stroke={HAIRLINE} />
            <text x="24" y="32" fill={INK_MUTED} fontSize="13" fontWeight="900">0 deg {lagna.name}</text>
            <text x="536" y="32" textAnchor="end" fill={INK_MUTED} fontSize="13" fontWeight="900">30 deg</text>
            {[0, 10, 20, 30].map((degree) => (
              <g key={degree}>
                <line x1={xForDegree(degree)} y1="46" x2={xForDegree(degree)} y2="104" stroke="rgba(75,58,35,0.25)" />
                <text x={xForDegree(degree)} y="123" textAnchor="middle" fill={INK_MUTED} fontSize="11">{degree}</text>
              </g>
            ))}
            <line x1={xForDegree(planetDegree)} y1="34" x2={xForDegree(planetDegree)} y2="116" stroke={VERMILION} strokeWidth="3" />
            <circle cx={xForDegree(planetDegree)} cy="74" r="13" fill={VERMILION} />
            <text x={xForDegree(planetDegree)} y="79" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="950">P</text>
            {results.filter((item) => item.boundaryDeg !== null).map((item, index) => (
              <g key={item.key}>
                <line x1={xForDegree(item.boundaryDeg ?? 0)} y1="42" x2={xForDegree(item.boundaryDeg ?? 0)} y2="106" stroke={item.color} strokeWidth="2" strokeDasharray="5 4" />
                <text x={xForDegree(item.boundaryDeg ?? 0)} y={145 + index * 8} textAnchor="middle" fill={item.color} fontSize="10" fontWeight="900">{item.name}</text>
              </g>
            ))}
          </svg>
          <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Educational cusp lines approximate how boundary systems can shift. Real Sripati and Placidus cusps come from `/cusps`.
          </p>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }} aria-label="House system results">
        {results.map((item) => (
          <ResultCard key={item.key} result={item} labelOn={nameLabels} />
        ))}
      </section>

      <section style={{ border: `1px solid ${split ? VERMILION : GREEN}55`, borderRadius: 8, background: `${split ? VERMILION : GREEN}12`, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: split ? VERMILION : GREEN, fontWeight: 950 }}>
          <GitCompare size={18} aria-hidden="true" />
          {split ? "Systemic disagreement" : "Systems agree"}
        </div>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          {split
            ? `The planet at ${planetDegree.toFixed(0)} deg ${planet.name} splits across house systems. This is expected near a boundary, so name the system.`
            : `The planet at ${planetDegree.toFixed(0)} deg ${planet.name} is far enough from the active boundaries that the systems agree in this demo.`}
        </p>
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.78)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 850,
} as const;

function Picker({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} style={inputStyle}>
        {SIGNS.map((sign) => <option key={sign.index} value={sign.index}>{sign.name} / {sign.english}</option>)}
      </select>
    </label>
  );
}

function Slider({ label, value, min, max, onChange, color }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void; color: string }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem", marginTop: "0.75rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
      <input type="range" min={min} max={max} step={1} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ width: "100%", accentColor: color }} />
    </label>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function ResultCard({ result, labelOn }: { result: SystemResult; labelOn: boolean }) {
  return (
    <div style={{ border: `1px solid ${result.color}44`, borderRadius: 8, background: SURFACE, padding: "0.95rem" }}>
      <strong style={{ color: result.color }}>{labelOn ? result.name : "House result"}</strong>
      <p style={{ margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1.1rem", fontWeight: 950 }}>House {result.house}</p>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{result.rule}</p>
      <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontWeight: 850 }}>{result.module}</p>
    </div>
  );
}
