"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BadgeCheck, GitCompare, Layers, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

type Strength = "strong" | "mediocre" | "weak";
type Domain = "career" | "marriage" | "children" | "dharma";
type PatternKey = "A" | "B" | "C" | "D" | "mixed";

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

const DOMAINS: Record<Domain, { label: string; d1: string; d9: string; color: string }> = {
  career: { label: "Career", d1: "position and visible work", d9: "depth of strength and dharma", color: BLUE },
  marriage: { label: "Marriage", d1: "visible promise and circumstances", d9: "marriage depth and durability", color: GREEN },
  children: { label: "Children", d1: "5th-house baseline", d9: "partnership context and deeper support", color: GOLD },
  dharma: { label: "Dharma", d1: "outer role and life shape", d9: "inner meaning and maturity", color: PURPLE },
};

const PRESETS = [
  { label: "Pattern A", d1: "strong", d9: "weak", vargottama: false, d60: false, btr: false, domain: "career" },
  { label: "Pattern B", d1: "weak", d9: "strong", vargottama: false, d60: false, btr: false, domain: "dharma" },
  { label: "Pattern C", d1: "mediocre", d9: "strong", vargottama: true, d60: false, btr: false, domain: "marriage" },
  { label: "Pattern D", d1: "strong", d9: "strong", vargottama: false, d60: true, btr: true, domain: "children" },
] as const;

export function D1D9DivergenceReader() {
  const [domain, setDomain] = useState<Domain>("career");
  const [d1, setD1] = useState<Strength>("strong");
  const [d9, setD9] = useState<Strength>("weak");
  const [vargottamaLift, setVargottamaLift] = useState(false);
  const [d60Divergent, setD60Divergent] = useState(false);
  const [btrConfirmed, setBtrConfirmed] = useState(false);
  const [showDiscipline, setShowDiscipline] = useState(true);

  const domainMeta = DOMAINS[domain];
  const pattern = useMemo(() => getPattern(d1, d9, vargottamaLift, d60Divergent && btrConfirmed), [btrConfirmed, d1, d60Divergent, d9, vargottamaLift]);
  const frame = getHonestFrame(domain, pattern, d1, d9, d60Divergent, btrConfirmed);

  function reset() {
    setDomain("career");
    setD1("strong");
    setD9("weak");
    setVargottamaLift(false);
    setD60Divergent(false);
    setBtrConfirmed(false);
    setShowDiscipline(true);
  }

  return (
    <div data-interactive="d1-d9-divergence-reader" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D1-D9 divergence reader</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Do not pick a winner; read the relationship</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Toggle D1 and D9 strength to classify the four patterns. The output reports the relationship: D1 suggests one layer, D9 modifies it.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Current classification</p>
              <h3 style={{ margin: "0.2rem 0 0", color: pattern.color, fontSize: "1.25rem" }}>{pattern.key === "mixed" ? "Relationship reading" : `Pattern ${pattern.key}: ${pattern.label}`}</h3>
            </div>
            <strong style={{ color: domainMeta.color }}>{domainMeta.label}</strong>
          </div>

          <DivergenceSvg d1={d1} d9={d9} pattern={pattern} d60Divergent={d60Divergent} btrConfirmed={btrConfirmed} vargottamaLift={vargottamaLift} />

          <div style={{ border: `1px solid ${pattern.color}66`, borderRadius: 8, background: `${pattern.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Honest framing</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "1rem", fontWeight: 500 }}>{frame}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson patterns" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setD1(preset.d1);
                    setD9(preset.d9);
                    setVargottamaLift(preset.vargottama);
                    setD60Divergent(preset.d60);
                    setBtrConfirmed(preset.btr);
                    setDomain(preset.domain);
                  }}
                  style={buttonStyle(pattern.key === preset.label.slice(-1), BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Domain lens" icon={<Layers size={18} />} color={domainMeta.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(DOMAINS) as Domain[]).map((key) => (
                <button key={key} type="button" onClick={() => setDomain(key)} style={buttonStyle(domain === key, DOMAINS[key].color)}>
                  {DOMAINS[key].label}
                </button>
              ))}
            </div>
            <EvidenceRow color={domainMeta.color}>D1: {domainMeta.d1}</EvidenceRow>
            <EvidenceRow color={domainMeta.color}>D9: {domainMeta.d9}</EvidenceRow>
          </Panel>

          <Panel title="D1 and D9 states" icon={<GitCompare size={18} />} color={pattern.color}>
            <StrengthToggle label="D1 gross layer" value={d1} onChange={setD1} color={GREEN} />
            <StrengthToggle label="D9 deeper layer" value={d9} onChange={setD9} color={BLUE} />
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="Pattern C lift" icon={<Sparkles size={18} />} color={vargottamaLift ? GREEN : GOLD}>
          <button type="button" onClick={() => setVargottamaLift((value) => !value)} style={buttonStyle(vargottamaLift, GREEN)}>
            {vargottamaLift ? "D9 vargottama lift active" : "No vargottama lift"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>
            Use this when the D1 looks mediocre but the same-sign D9 consistency makes the promise more reliable.
          </p>
        </Panel>

        <Panel title="Pattern D D60 gate" icon={<ShieldCheck size={18} />} color={d60Divergent && btrConfirmed ? PURPLE : GOLD}>
          <button type="button" onClick={() => setBtrConfirmed((value) => !value)} style={buttonStyle(btrConfirmed, PURPLE)}>
            {btrConfirmed ? "Birth time rectified" : "Birth time not rectified"}
          </button>
          <button type="button" onClick={() => setD60Divergent((value) => !value)} style={buttonStyle(d60Divergent, VERMILION)}>
            {d60Divergent ? "D60 divergent" : "D60 not divergent"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>
            Pattern D is valid only when D60 is usable. Otherwise keep D60 out of the conclusion.
          </p>
        </Panel>

        <Panel title="Practitioner discipline" icon={<ShieldCheck size={18} />} color={showDiscipline ? GREEN : GOLD}>
          <button type="button" onClick={() => setShowDiscipline((value) => !value)} style={buttonStyle(showDiscipline, GREEN)}>
            {showDiscipline ? "Discipline visible" : "Show discipline"}
          </button>
          {showDiscipline ? (
            <div style={{ display: "grid", gap: "0.45rem" }}>
              <EvidenceRow color={GREEN}>Always check both D1 and D9.</EvidenceRow>
              <EvidenceRow color={GREEN}>Name divergences explicitly.</EvidenceRow>
              <EvidenceRow color={GREEN}>Use: D1 suggests X; D9 modifies to Y.</EvidenceRow>
              <EvidenceRow color={VERMILION}>Do not pick D1 or D9 as the sole winner.</EvidenceRow>
            </div>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>Convergence gives confidence; divergence gives nuance.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function StrengthToggle({ label, value, onChange, color }: { label: string; value: Strength; onChange: (value: Strength) => void; color: string }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem" }}>
      <p style={eyebrowStyle}>{label}</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(["strong", "mediocre", "weak"] as Strength[]).map((item) => (
          <button key={item} type="button" onClick={() => onChange(item)} style={buttonStyle(value === item, item === "strong" ? color : item === "mediocre" ? GOLD : VERMILION)}>
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function DivergenceSvg({ d1, d9, pattern, d60Divergent, btrConfirmed, vargottamaLift }: { d1: Strength; d9: Strength; pattern: ReturnType<typeof getPattern>; d60Divergent: boolean; btrConfirmed: boolean; vargottamaLift: boolean }) {
  const d1Color = strengthColor(d1);
  const d9Color = strengthColor(d9);
  return (
    <svg viewBox="0 0 620 372" role="img" aria-label="D1 D9 divergence diagram" style={{ width: "100%", height: "auto", display: "block", margin: "0.8rem auto" }}>
      <rect x="32" y="28" width="556" height="316" rx="10" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="58" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="750">The reading is the relationship between layers</text>
      <line x1="190" y1="166" x2="430" y2="166" stroke={`${pattern.color}88`} strokeWidth="5" strokeLinecap="round" />
      <circle cx="170" cy="166" r="72" fill={`${d1Color}18`} stroke={d1Color} strokeWidth="4" />
      <text x="170" y="146" textAnchor="middle" fill={d1Color} fontSize="25" fontWeight="800">D1</text>
      <text x="170" y="172" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="750">gross WHAT</text>
      <text x="170" y="198" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="650">{d1}</text>
      <circle cx="450" cy="166" r="72" fill={`${d9Color}18`} stroke={d9Color} strokeWidth="4" />
      <text x="450" y="146" textAnchor="middle" fill={d9Color} fontSize="25" fontWeight="800">D9</text>
      <text x="450" y="172" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="750">deeper layer</text>
      <text x="450" y="198" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="650">{d9}</text>
      <rect x="190" y="258" width="240" height="42" rx="8" fill={`${pattern.color}14`} stroke={`${pattern.color}66`} />
      <text x="310" y="284" textAnchor="middle" fill={pattern.color} fontSize="14" fontWeight="750">{pattern.label}</text>
      {vargottamaLift ? <text x="310" y="88" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="750">Vargottama lift active</text> : null}
      {d60Divergent ? (
        <text x="310" y="326" textAnchor="middle" fill={btrConfirmed ? PURPLE : VERMILION} fontSize="12" fontWeight="750">
          {btrConfirmed ? "D60 divergence adds a different karmic question." : "D60 divergence ignored until birth time is rectified."}
        </text>
      ) : (
        <text x="310" y="326" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="650">Report both layers. Do not delete either side.</text>
      )}
    </svg>
  );
}

function getPattern(d1: Strength, d9: Strength, vargottamaLift: boolean, d60Divergent: boolean): { key: PatternKey; label: string; color: string } {
  if (d1 === "strong" && d9 === "strong" && d60Divergent) return { key: "D", label: "Different karmic question", color: PURPLE };
  if ((d1 === "mediocre" || d1 === "weak") && d9 === "strong" && vargottamaLift) return { key: "C", label: "Vargottama lift", color: GREEN };
  if (d1 === "strong" && d9 === "weak") return { key: "A", label: "Surface without depth", color: GOLD };
  if (d1 === "weak" && d9 === "strong") return { key: "B", label: "Substance under the surface", color: BLUE };
  return { key: "mixed", label: "Convergence or ordinary nuance", color: d1 === d9 ? GREEN : GOLD };
}

function getHonestFrame(domain: Domain, pattern: ReturnType<typeof getPattern>, d1: Strength, d9: Strength, d60Divergent: boolean, btrConfirmed: boolean) {
  const meta = DOMAINS[domain];
  if (pattern.key === "A") return `The D1 suggests ${meta.d1} can be attained; the D9 modifies it to ${meta.d9} lacking depth or sustainment. This is surface without depth.`;
  if (pattern.key === "B") return `The D1 suggests a modest surface; the D9 modifies it to real inner support. This is substance under the surface, often improving with maturity.`;
  if (pattern.key === "C") return `The D1 looked mediocre, but the D9 vargottama consistency lifts the reading. Name the lift, but still keep the D1 surface in view.`;
  if (pattern.key === "D") return `D1 and D9 agree strongly, but the rectified D60 points to another karmic question. Read that as substrate, not contradiction or doom.`;
  if (d60Divergent && !btrConfirmed) return `D1 is ${d1} and D9 is ${d9}. The D60 signal is not used because the birth time is not rectified.`;
  return `D1 is ${d1} and D9 is ${d9}. Frame the relationship clearly: D1 suggests the visible layer; D9 modifies the deeper strength.`;
}

function strengthColor(value: Strength) {
  if (value === "strong") return GREEN;
  if (value === "weak") return VERMILION;
  return GOLD;
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.3 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem", fontSize: "1rem", lineHeight: 1.5 }}>{children}</div>
    </section>
  );
}

function EvidenceRow({ children, color = GREEN }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", gap: "0.45rem", alignItems: "flex-start", color: INK_SECONDARY, fontWeight: 600, fontSize: "1rem", lineHeight: 1.45 }}>
      <BadgeCheck size={15} color={color} aria-hidden="true" />
      {children}
    </div>
  );
}

function buttonStyle(active: boolean, color: string) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.5rem 0.65rem",
    fontSize: "0.95rem",
    lineHeight: 1.2,
    fontWeight: 700,
    cursor: "pointer",
  };
}

const surfaceStyle = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  overflow: "hidden",
};

const eyebrowStyle = {
  margin: 0,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
