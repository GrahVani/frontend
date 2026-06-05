"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, GitCompare, RotateCcw, Scale, ShieldCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6A568E";

type SystemKey = "parashari" | "jaimini" | "somanatha";

const SIGNS = [
  { name: "Mesha", element: "Fire", color: "#A23A1E" },
  { name: "Vrishabha", element: "Earth", color: "#2F7D55" },
  { name: "Mithuna", element: "Air", color: "#356CAB" },
  { name: "Karka", element: "Water", color: "#54778A" },
  { name: "Simha", element: "Fire", color: "#B88421" },
  { name: "Kanya", element: "Earth", color: "#6F7F41" },
  { name: "Tula", element: "Air", color: "#7A5BA6" },
  { name: "Vrishchika", element: "Water", color: "#8E3C55" },
  { name: "Dhanu", element: "Fire", color: "#C26A2C" },
  { name: "Makara", element: "Earth", color: "#6D604A" },
  { name: "Kumbha", element: "Air", color: "#4E7896" },
  { name: "Mina", element: "Water", color: "#4D7F73" },
] as const;

const PLANETS = ["Mars", "Moon", "Sun", "Mercury", "Jupiter", "Venus", "Saturn"] as const;

const SYSTEMS: Record<SystemKey, { name: string; rule: string; color: string }> = {
  parashari: { name: "Parashari", rule: "1st same, 2nd 5th, 3rd 9th", color: GOLD },
  jaimini: { name: "Jaimini", rule: "1st same, 2nd 7th, 3rd 5th", color: PURPLE },
  somanatha: { name: "Somanatha", rule: "distinct construction, deferred beyond Tier 1", color: VERMILION },
};

export function DrekkanaSystemComparator() {
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>("Mars");
  const [signIndex, setSignIndex] = useState(0);
  const [degree, setDegree] = useState(15);
  const [activeSystem, setActiveSystem] = useState<SystemKey>("parashari");
  const [disclosureOn, setDisclosureOn] = useState(true);

  const part = degree < 10 ? 0 : degree < 20 ? 1 : 2;
  const source = SIGNS[signIndex];

  const outputs = useMemo(() => {
    const parashariOffsets = [0, 4, 8];
    const jaiminiOffsets = [0, 6, 4];
    const parashariIndex = (signIndex + parashariOffsets[part]) % 12;
    const jaiminiIndex = (signIndex + jaiminiOffsets[part]) % 12;

    return {
      parashari: SIGNS[parashariIndex],
      jaimini: SIGNS[jaiminiIndex],
      agrees: parashariIndex === jaiminiIndex,
    };
  }, [part, signIndex]);

  const partLabel = part === 0 ? "1st drekkana" : part === 1 ? "2nd drekkana" : "3rd drekkana";
  const activeOutput = activeSystem === "parashari" ? outputs.parashari : activeSystem === "jaimini" ? outputs.jaimini : null;
  const activeColor = activeSystem === "somanatha" ? VERMILION : activeOutput?.color ?? GOLD;

  return (
    <div data-interactive="drekkana-system-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D3 system comparator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              A D3 claim is incomplete until the system is named
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 880 }}>
              Compare the same placement under Parashari and Jaimini, then mark Somanatha honestly as a distinct construction deferred beyond Tier 1.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanet("Mars");
              setSignIndex(0);
              setDegree(15);
              setActiveSystem("parashari");
              setDisclosureOn(true);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Same placement, different systems</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>
                {planet} at {degree} deg {source.name}: {partLabel}
              </h3>
            </div>
            <strong style={{ color: outputs.agrees ? GREEN : VERMILION }}>
              {outputs.agrees ? "Systems agree" : "Systems differ"}
            </strong>
          </div>

          <ComparatorSvg degree={degree} part={part} signIndex={signIndex} parashariName={outputs.parashari.name} jaiminiName={outputs.jaimini.name} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.75rem" }}>
            <SystemCard system="parashari" active={activeSystem === "parashari"} output={outputs.parashari.name} onClick={setActiveSystem} />
            <SystemCard system="jaimini" active={activeSystem === "jaimini"} output={outputs.jaimini.name} onClick={setActiveSystem} />
            <SystemCard system="somanatha" active={activeSystem === "somanatha"} output="Deferred" onClick={setActiveSystem} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Placement controls" icon={<BadgeCheck size={18} />} color={BLUE}>
            <select value={planet} onChange={(event) => setPlanet(event.target.value as (typeof PLANETS)[number])} style={selectStyle}>
              {PLANETS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: "0.45rem" }}>
              {SIGNS.map((item, index) => (
                <button key={item.name} type="button" onClick={() => setSignIndex(index)} style={signButtonStyle(signIndex === index, item.color)}>
                  {item.name}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Degree band" icon={<GitCompare size={18} />} color={activeColor}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
              {degree} deg {source.name}
              <input
                type="range"
                min={0}
                max={29.5}
                step={0.5}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                style={{ width: "100%", accentColor: activeColor }}
              />
            </label>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              1st drekkana always agrees. The 2nd and 3rd expose the doctrine choice.
            </p>
          </Panel>

          <Panel title="System focus" icon={<Scale size={18} />} color={SYSTEMS[activeSystem].color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(SYSTEMS) as SystemKey[]).map((system) => (
                <button key={system} type="button" onClick={() => setActiveSystem(system)} style={buttonStyle(activeSystem === system, SYSTEMS[system].color)}>
                  {SYSTEMS[system].name}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{SYSTEMS[activeSystem].rule}.</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="Disclosure discipline" icon={<ShieldCheck size={18} />} color={disclosureOn ? GREEN : VERMILION}>
          <button type="button" aria-pressed={disclosureOn} onClick={() => setDisclosureOn((value) => !value)} style={buttonStyle(disclosureOn, disclosureOn ? GREEN : VERMILION)}>
            {disclosureOn ? "System named" : "Bare D3 claim"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {disclosureOn
              ? `${planet} is in ${activeSystem === "somanatha" ? "a deferred Somanatha D3 construction" : `${activeOutput?.name} in the ${SYSTEMS[activeSystem].name} D3`}.`
              : `${planet} is in D3 ${activeOutput?.name ?? "?"}: incomplete, because the system is not disclosed.`}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${outputs.agrees ? GREEN : VERMILION}66`, borderRadius: 8, background: `${outputs.agrees ? GREEN : VERMILION}10`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: outputs.agrees ? GREEN : VERMILION, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            <AlertTriangle size={18} />
            Comparison cue
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {outputs.agrees
              ? "The first drekkana maps to the same sign in both Parashari and Jaimini, so the claim still needs disclosure but the output matches."
              : `Parashari gives ${outputs.parashari.name}, while Jaimini gives ${outputs.jaimini.name}. The reading changes with the named system.`}
          </p>
        </section>
      </div>
    </div>
  );
}

function SystemCard({ system, active, output, onClick }: { system: SystemKey; active: boolean; output: string; onClick: (system: SystemKey) => void }) {
  const item = SYSTEMS[system];
  return (
    <button type="button" onClick={() => onClick(system)} style={{ ...surfaceStyle, textAlign: "left", cursor: "pointer", border: `1px solid ${active ? item.color : HAIRLINE}`, background: active ? `${item.color}10` : SURFACE }}>
      <p style={eyebrowStyle}>{item.name}</p>
      <h4 style={{ margin: "0.2rem 0", color: item.color, fontSize: "1rem" }}>{output}</h4>
      <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45 }}>{item.rule}</p>
    </button>
  );
}

function ComparatorSvg({ degree, part, signIndex, parashariName, jaiminiName }: { degree: number; part: number; signIndex: number; parashariName: string; jaiminiName: string }) {
  const markerX = 60 + (degree / 30) * 500;
  const parashariTargets = [signIndex, (signIndex + 4) % 12, (signIndex + 8) % 12];
  const jaiminiTargets = [signIndex, (signIndex + 6) % 12, (signIndex + 4) % 12];

  return (
    <svg viewBox="0 0 620 330" role="img" aria-label="Drekkana system comparison between Parashari and Jaimini" style={{ width: "100%", maxHeight: 370, margin: "0.8rem auto", display: "block" }}>
      <rect x="34" y="34" width="552" height="250" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_SECONDARY} fontSize="13.5" fontWeight="800">Same 10 degree bands, different mapping rules</text>
      {["0-10 deg", "10-20 deg", "20-30 deg"].map((label, index) => {
        const x = 60 + index * 166.67;
        const active = part === index;
        return (
          <g key={label}>
            <rect x={x} y="88" width="166.67" height="54" rx="8" fill={active ? `${BLUE}18` : "rgba(255,251,241,0.6)"} stroke={active ? BLUE : HAIRLINE} strokeWidth={active ? 3 : 1} />
            <text x={x + 83} y="120" textAnchor="middle" fill={active ? BLUE : INK_SECONDARY} fontSize="13.5" fontWeight="800">{label}</text>
          </g>
        );
      })}
      <line x1={markerX} y1="78" x2={markerX} y2="154" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="78" r="8" fill={VERMILION} />
      <text x={markerX} y="172" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="800">{degree} deg</text>
      <ComparisonRow y={205} label="Parashari" color={GOLD} targets={parashariTargets} activePart={part} activeOutput={parashariName} />
      <ComparisonRow y={255} label="Jaimini" color={PURPLE} targets={jaiminiTargets} activePart={part} activeOutput={jaiminiName} />
      <text x="310" y="314" textAnchor="middle" fill={INK_MUTED} fontSize="12">Somanatha: distinct construction named here, detail deferred.</text>
    </svg>
  );
}

function ComparisonRow({ y, label, color, targets, activePart, activeOutput }: { y: number; label: string; color: string; targets: number[]; activePart: number; activeOutput: string }) {
  return (
    <g>
      <text x="76" y={y + 5} fill={color} fontSize="13" fontWeight="800">{label}</text>
      {targets.map((target, index) => {
        const x = 190 + index * 112;
        const active = activePart === index;
        return (
          <g key={`${label}-${target}-${index}`}>
            <rect x={x - 44} y={y - 18} width="88" height="32" rx="8" fill={active ? `${color}24` : "rgba(255,251,241,0.7)"} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x} y={y + 3} textAnchor="middle" fill={active ? color : INK_SECONDARY} fontSize="12" fontWeight="750">{compactSignName(SIGNS[target].name)}</text>
          </g>
        );
      })}
      <text x="540" y={y + 5} textAnchor="end" fill={color} fontSize="12.5" fontWeight="800">{activeOutput}</text>
    </g>
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
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function signButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.48rem 0.5rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function compactSignName(name: string) {
  const labels: Record<string, string> = {
    Vrishabha: "Vrsab",
    Mithuna: "Mithu",
    Vrishchika: "Vrsch",
    Makara: "Makar",
    Kumbha: "Kumbh",
  };
  return labels[name] ?? name;
}

const selectStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.72)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 700,
};

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  overflow: "hidden",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
