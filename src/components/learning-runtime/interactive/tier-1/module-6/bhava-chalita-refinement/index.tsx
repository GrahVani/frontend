"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, RotateCcw, SlidersHorizontal, TriangleAlert } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanus", "Makara", "Kumbha", "Mina"];
const HOUSE_NAMES = ["Tanu", "Dhana", "Sahaja", "Sukha", "Putra", "Shatru", "Yuvati", "Ayu", "Bhagya", "Karma", "Labha", "Vyaya"];

function houseFromSign(lagnaSign: number, planetSign: number) {
  return ((planetSign - lagnaSign + 12) % 12) + 1;
}

function chalitaHouse(lagnaSign: number, lagnaDegree: number, planetSign: number, planetDegree: number) {
  const deltaSigns = (planetSign - lagnaSign + 12) % 12;
  const relativeDegree = deltaSigns * 30 + planetDegree;
  const cuspRelative = lagnaDegree;
  const shifted = relativeDegree - cuspRelative;
  const normalized = ((shifted + 360) % 360);
  return Math.floor((normalized + 15) / 30) % 12 + 1;
}

function degreeDistanceToNearestBoundary(lagnaDegree: number, planetDegree: number, lagnaSign: number, planetSign: number) {
  const deltaSigns = (planetSign - lagnaSign + 12) % 12;
  const relative = deltaSigns * 30 + planetDegree;
  const shifted = ((relative - lagnaDegree + 360) % 360);
  const withinHouse = ((shifted + 15) % 30) - 15;
  return 15 - Math.abs(withinHouse);
}

function housePhrase(house: number) {
  return `${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"}`;
}

export function BhavaChalitaRefinement() {
  const [lagnaSign, setLagnaSign] = useState(1);
  const [lagnaDegree, setLagnaDegree] = useState(25);
  const [planetSign, setPlanetSign] = useState(1);
  const [planetDegree, setPlanetDegree] = useState(28);
  const [nameSystem, setNameSystem] = useState(true);

  const wholeHouse = houseFromSign(lagnaSign, planetSign);
  const movedHouse = chalitaHouse(lagnaSign, lagnaDegree, planetSign, planetDegree);
  const diverges = wholeHouse !== movedHouse;
  const boundaryDistance = degreeDistanceToNearestBoundary(lagnaDegree, planetDegree, lagnaSign, planetSign);
  const nearBoundary = boundaryDistance <= 4 || diverges;

  const synthesis = useMemo(() => {
    if (diverges) {
      return `Whole-sign gives ${housePhrase(wholeHouse)} (${HOUSE_NAMES[wholeHouse - 1]}), while Bhava Chalita gives ${housePhrase(movedHouse)} (${HOUSE_NAMES[movedHouse - 1]}). Name the system and treat Chalita as a degree-based refinement.`;
    }
    if (nearBoundary) {
      return `Both systems currently give ${housePhrase(wholeHouse)}, but the planet is close enough to a cusp boundary that the reading should be held lightly and checked in software.`;
    }
    return `Both systems agree on the ${housePhrase(wholeHouse)} house. The planet is comfortably placed, so the whole-sign default stands without extra concern.`;
  }, [diverges, movedHouse, nearBoundary, wholeHouse]);

  return (
    <div data-interactive="bhava-chalita-refinement" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bhava Chalita refinement</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Whole-sign default, cusp-based second look
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Move Lagna and planet degrees to see when Bhava Chalita agrees with whole-sign and when a boundary planet needs refinement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaSign(1);
              setLagnaDegree(25);
              setPlanetSign(1);
              setPlanetDegree(28);
              setNameSystem(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Boundary demo</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                {SIGNS[planetSign - 1]} {planetDegree} deg planet
              </h3>
            </div>
            <strong style={{ color: diverges ? VERMILION : GREEN }}>{diverges ? "Divergence" : "Agreement"}</strong>
          </div>
          <ChalitaSvg lagnaDegree={lagnaDegree} planetDegree={planetDegree} wholeHouse={wholeHouse} movedHouse={movedHouse} diverges={diverges} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <ResultCard title="Whole-sign" house={wholeHouse} color={BLUE} note="Sign-count house assignment" />
            <ResultCard title="Bhava Chalita" house={movedHouse} color={diverges ? VERMILION : GREEN} note="Degree-cusp refinement" />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Chart inputs" icon={<SlidersHorizontal size={18} />} color={BLUE}>
            <Picker label="Lagna sign" value={lagnaSign} onChange={setLagnaSign} />
            <Picker label="Planet sign" value={planetSign} onChange={setPlanetSign} />
            <Slider label={`Lagna degree: ${lagnaDegree} deg`} value={lagnaDegree} onChange={setLagnaDegree} color={BLUE} />
            <Slider label={`Planet degree: ${planetDegree} deg`} value={planetDegree} onChange={setPlanetDegree} color={VERMILION} />
          </Panel>

          <Panel title="Refinement discipline" icon={<TriangleAlert size={18} />} color={nearBoundary ? VERMILION : GREEN}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {nearBoundary
                ? "Boundary case: use Bhava Chalita to qualify the whole-sign reading, and verify actual Sripati cusps in software."
                : "Comfortable case: whole-sign and Chalita agree, so no special refinement pressure is present."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <Panel title="Name the system" icon={<BadgeCheck size={18} />} color={nameSystem ? GREEN : VERMILION}>
          <button type="button" aria-pressed={nameSystem} onClick={() => setNameSystem((value) => !value)} style={smallChipStyle(nameSystem, nameSystem ? GREEN : VERMILION)}>
            {nameSystem ? "Labels on" : "Labels off"}
          </button>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
            {nameSystem ? "Clean: say whole-sign or Bhava Chalita when stating a house." : "Risk: unlabeled results make Mars in the 1st ambiguous when the systems differ."}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
          <strong style={{ color: GOLD }}>Chalita synthesis</strong>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function ChalitaSvg({ lagnaDegree, planetDegree, wholeHouse, movedHouse, diverges }: { lagnaDegree: number; planetDegree: number; wholeHouse: number; movedHouse: number; diverges: boolean }) {
  const x = (degree: number) => 28 + (degree / 30) * 484;
  const cuspBoundary = ((lagnaDegree + 15) % 30);
  return (
    <svg viewBox="0 0 540 230" role="img" aria-label="Bhava Chalita cusp boundary compared with whole sign block" style={{ width: "100%", maxHeight: 330, margin: "0.65rem auto 0.8rem", display: "block" }}>
      <rect x="24" y="58" width="488" height="54" rx="8" fill={`${GOLD}10`} stroke={HAIRLINE} />
      <text x="28" y="36" fill={INK_MUTED} fontSize="12" fontWeight="900">0 deg sign</text>
      <text x="512" y="36" textAnchor="end" fill={INK_MUTED} fontSize="12" fontWeight="900">30 deg</text>
      {[0, 10, 20, 30].map((degree) => (
        <g key={degree}>
          <line x1={x(degree)} y1="52" x2={x(degree)} y2="120" stroke={`${GOLD}55`} />
          <text x={x(degree)} y="138" textAnchor="middle" fill={INK_MUTED} fontSize="10">{degree}</text>
        </g>
      ))}
      <line x1={x(lagnaDegree)} y1="34" x2={x(lagnaDegree)} y2="132" stroke={BLUE} strokeWidth="3" />
      <circle cx={x(lagnaDegree)} cy="58" r="10" fill={BLUE} />
      <text x={x(lagnaDegree)} y="61" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">Lg</text>
      <line x1={x(cuspBoundary)} y1="44" x2={x(cuspBoundary)} y2="128" stroke={GREEN} strokeWidth="3" strokeDasharray="6 4" />
      <text x={x(cuspBoundary)} y="158" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="900">Chalita boundary</text>
      <line x1={x(planetDegree)} y1="30" x2={x(planetDegree)} y2="132" stroke={VERMILION} strokeWidth="3" />
      <circle cx={x(planetDegree)} cy="86" r="13" fill={VERMILION} />
      <text x={x(planetDegree)} y="90" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">P</text>
      <text x="270" y="198" textAnchor="middle" fill={diverges ? VERMILION : GREEN} fontSize="13" fontWeight="900">
        Whole-sign: {wholeHouse}H | Bhava Chalita: {movedHouse}H
      </text>
    </svg>
  );
}

function ResultCard({ title, house, color, note }: { title: string; house: number; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 950 }}><GitCompare size={15} />{title}</div>
      <strong style={{ display: "block", marginTop: "0.45rem", color: INK_PRIMARY }}>{housePhrase(house)} - {HOUSE_NAMES[house - 1]}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_MUTED }}>{note}</p>
    </div>
  );
}

function Picker({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={labelStyle}>
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} style={inputStyle}>
        {SIGNS.map((sign, index) => <option key={sign} value={index + 1}>{sign}</option>)}
      </select>
    </label>
  );
}

function Slider({ label, value, onChange, color }: { label: string; value: number; onChange: (value: number) => void; color: string }) {
  return (
    <label style={labelStyle}>
      {label}
      <input type="range" min={0} max={29} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ accentColor: color }} />
    </label>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 850,
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
    fontWeight: 850,
    cursor: "pointer",
  };
}

const inputStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.78)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 850,
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: INK_MUTED,
  fontWeight: 900,
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
  fontWeight: 900,
};
