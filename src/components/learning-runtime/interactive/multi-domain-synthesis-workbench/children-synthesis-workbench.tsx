"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Baby,
  Grid3X3,
  HeartPulse,
  LayoutTemplate,
  RotateCcw,
  Scale,
  ShieldCheck,
  XCircle,
} from "lucide-react";

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

type Direction = "favourable" | "mixed" | "stressed";
type Strength = "strong" | "moderate" | "weak";
type RootKey = "none" | "jupiter" | "mars" | "mercury" | "venus" | "saturn" | "moon" | "sun" | "rahu" | "ketu";

const REGISTERS = [
  { key: "d1-fifth", label: "D1 5th house / lord", chapter: "1", stream: "Parāśara" },
  { key: "d7", label: "D7 Saptāṁśa", chapter: "2", stream: "Parāśara" },
  { key: "jupiter", label: "D1 Jupiter", chapter: "3", stream: "Parāśara" },
  { key: "pk", label: "Jaimini Putrakāraka", chapter: "4.1-4.2", stream: "Jaimini" },
  { key: "kp", label: "KP 5th CSL + significators", chapter: "4.3-4.4", stream: "KP" },
] as const;

const DIRECTION_SCORES: Record<Direction, number> = {
  favourable: 1,
  mixed: 0,
  stressed: -1,
};

const STRENGTH_MULTIPLIERS: Record<Strength, number> = {
  strong: 3,
  moderate: 2,
  weak: 1,
};

const ROOT_OPTIONS: { key: RootKey; label: string }[] = [
  { key: "none", label: "Independent" },
  { key: "jupiter", label: "Jupiter root" },
  { key: "mars", label: "Mars root" },
  { key: "mercury", label: "Mercury root" },
  { key: "venus", label: "Venus root" },
  { key: "saturn", label: "Saturn root" },
  { key: "moon", label: "Moon root" },
  { key: "sun", label: "Sun root" },
  { key: "rahu", label: "Rāhu root" },
  { key: "ketu", label: "Ketu root" },
];

function directionColor(direction: Direction) {
  return direction === "favourable" ? GREEN : direction === "stressed" ? VERMILION : GOLD;
}

const DEFAULT_ENTRIES: Record<
  string,
  { direction: Direction; strength: Strength; root: RootKey }
> = {
  "d1-fifth": { direction: "favourable", strength: "strong", root: "mars" },
  d7: { direction: "favourable", strength: "moderate", root: "none" },
  jupiter: { direction: "favourable", strength: "strong", root: "jupiter" },
  pk: { direction: "favourable", strength: "moderate", root: "none" },
  kp: { direction: "favourable", strength: "strong", root: "jupiter" },
};

export function MultiDomainSynthesisWorkbench() {
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [includeTiming, setIncludeTiming] = useState(true);
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [noCountGender, setNoCountGender] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [pauseDistress, setPauseDistress] = useState(true);

  const { independentGroups, netScore, convergence, tier } = useMemo(() => {
    const groups = new Map<RootKey, { score: number; registers: string[]; dominantDirection: Direction }>();
    for (const reg of REGISTERS) {
      const entry = entries[reg.key];
      const score = DIRECTION_SCORES[entry.direction] * STRENGTH_MULTIPLIERS[entry.strength];
      const root = entry.root;
      const existing = groups.get(root);
      if (!existing || Math.abs(score) > Math.abs(existing.score)) {
        groups.set(root, { score, registers: [reg.key], dominantDirection: entry.direction });
      } else if (existing && Math.abs(score) === Math.abs(existing.score)) {
        existing.registers.push(reg.key);
        if (score > existing.score) existing.dominantDirection = entry.direction;
      }
    }
    const independentGroups = Array.from(groups.entries()).map(([root, data]) => ({
      root,
      ...data,
      label: root === "none" ? data.registers.map((key) => REGISTERS.find((r) => r.key === key)?.label).join(", ") : `${ROOT_OPTIONS.find((r) => r.key === root)?.label} group`,
    }));
    const netScore = independentGroups.reduce((sum, group) => sum + group.score, 0);
    const favourableCount = independentGroups.filter((g) => g.score > 0).length;
    const stressedCount = independentGroups.filter((g) => g.score < 0).length;
    const convergence =
      favourableCount > 0 && stressedCount === 0 ? "favourable" : stressedCount > 0 && favourableCount === 0 ? "stressed" : "mixed";
    let tier = "inconclusive";
    if (convergence === "favourable") {
      if (netScore >= 7) tier = "high-confidence favourable";
      else if (netScore >= 4) tier = "moderate-confidence favourable";
      else tier = "weak favourable";
    } else if (convergence === "stressed") {
      if (netScore <= -7) tier = "high-confidence stressed";
      else if (netScore <= -4) tier = "moderate-confidence stressed";
      else tier = "weak stressed";
    } else {
      tier = "mixed / held open";
    }
    return { independentGroups, netScore, convergence, tier };
  }, [entries]);

  const allGuards = nonFatalistic && noCountGender && medicalRoute && pauseDistress;

  const synthesis = useMemo(() => {
    if (!allGuards) {
      return "Enable all four ethical-closing toggles before presenting the synthesis.";
    }
    const gridSummary = REGISTERS.map((reg) => {
      const entry = entries[reg.key];
      return `${reg.label}: ${entry.direction} (${entry.strength})`;
    }).join("; ");
    const independentSummary = independentGroups.map((g) => `${g.label} → ${g.score > 0 ? "favourable" : g.score < 0 ? "stressed" : "mixed"}`).join("; ");
    const timingText = includeTiming
      ? "Timing windows are presented as trend periods, not due dates."
      : "Timing was not requested or not integrated into this synthesis.";
    const closing = "Close with non-fatalistic language, no count or gender claim, medical routing where relevant, and attention to the client's emotional state.";
    return `Findings: ${gridSummary}. Independent counts: ${independentSummary}. Net tier: ${tier}. ${timingText} ${closing}`;
  }, [allGuards, entries, independentGroups, includeTiming, tier]);

  function updateEntry(key: string, patch: Partial<{ direction: Direction; strength: Strength; root: RootKey }>) {
    setEntries((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  function reset() {
    setEntries(DEFAULT_ENTRIES);
    setIncludeTiming(true);
    setNonFatalistic(true);
    setNoCountGender(true);
    setMedicalRoute(true);
    setPauseDistress(true);
  }

  return (
    <div data-interactive="multi-domain-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Children synthesis workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.32rem", fontWeight: 600 }}>
              Build a multi-register synthesis and net the confidence tier
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Enter findings for all five registers, mark any that share an underlying root, and watch the workbench enforce independent counting, strength-weighting, and the ethical closing.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Synthesis map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: convergence === "favourable" ? GREEN : convergence === "stressed" ? VERMILION : GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
                {convergence} convergence
              </h3>
            </div>
            <strong style={{ color: netScore >= 4 ? GREEN : netScore <= -4 ? VERMILION : GOLD, fontWeight: 600 }}>
              Net score {netScore}
            </strong>
          </div>
          <SynthesisMapSvg entries={entries} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<LayoutTemplate size={16} />} title="Independent groups" body={`${independentGroups.length}`} color={BLUE} />
            <MiniFact icon={<Scale size={16} />} title="Net tier" body={tier} color={netScore >= 4 ? GREEN : netScore <= -4 ? VERMILION : GOLD} />
            <MiniFact icon={<Grid3X3 size={16} />} title="Registers" body={`${REGISTERS.length}`} color={PURPLE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Findings grid</p>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.5rem" }}>
              {REGISTERS.map((reg) => {
                const entry = entries[reg.key];
                const color = directionColor(entry.direction);
                return (
                  <div key={reg.key} style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"0A"}`, padding: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ color, fontWeight: 600 }}>{reg.label}</span>
                      <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{reg.stream} · Ch.{reg.chapter}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
                      {(["favourable", "mixed", "stressed"] as Direction[]).map((dir) => (
                        <button key={dir} type="button" aria-pressed={entry.direction === dir} onClick={() => updateEntry(reg.key, { direction: dir })} style={smallChipStyle(entry.direction === dir, directionColor(dir))}>
                          {dir}
                        </button>
                      ))}
                      {(["strong", "moderate", "weak"] as Strength[]).map((str) => (
                        <button key={str} type="button" aria-pressed={entry.strength === str} onClick={() => updateEntry(reg.key, { strength: str })} style={smallChipStyle(entry.strength === str, GOLD)}>
                          {str}
                        </button>
                      ))}
                    </div>
                    <label style={{ display: "grid", gap: "0.3rem", color: INK_SECONDARY, marginTop: "0.55rem", fontSize: "0.85rem" }}>
                      <span>Underlying root (for counting discipline)</span>
                      <select value={entry.root} onChange={(e) => updateEntry(reg.key, { root: e.target.value as RootKey })} style={selectStyle}>
                        {ROOT_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                );
              })}
            </div>
          </section>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Independent groups</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          Registers sharing a root are counted once, using the strongest score in the group. &quot;Independent&quot; registers are each counted separately.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {independentGroups.map((group, index) => {
            const color = group.score > 0 ? GREEN : group.score < 0 ? VERMILION : GOLD;
            return (
              <div key={index} style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"0A"}`, padding: "0.7rem" }}>
                <p style={{ margin: 0, color, fontWeight: 600 }}>{group.label}</p>
                <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  Score {group.score} · {group.dominantDirection}
                </p>
                {group.root !== "none" ? (
                  <p style={{ margin: "0.3rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
                    Counted once: shared underlying fact
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis options</p>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_SECONDARY, cursor: "pointer", marginTop: "0.75rem" }}>
            <input type="checkbox" checked={includeTiming} onChange={(e) => setIncludeTiming(e.target.checked)} aria-label="Include timing" />
            Include timing section (daśā-bhukti + KP joint periods)
          </label>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical closing</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <GuardToggle active={nonFatalistic} icon={<Scale size={18} />} title="Non-fatalistic" body={nonFatalistic ? "No verdict forecloses biological possibility." : "Warning: avoid foreclosure language."} onClick={() => setNonFatalistic((v) => !v)} />
            <GuardToggle active={noCountGender} icon={<Baby size={18} />} title="No count or gender" body={noCountGender ? "Categorical refusal, regardless of convergence." : "Warning: count/gender claims are out of scope."} onClick={() => setNoCountGender((v) => !v)} />
            <GuardToggle active={medicalRoute} icon={<HeartPulse size={18} />} title="Medical routing" body={medicalRoute ? "Clinical concerns go to a specialist." : "Warning: do not let astrology override medical care."} onClick={() => setMedicalRoute((v) => !v)} />
            <GuardToggle active={pauseDistress} icon={<ShieldCheck size={18} />} title="Pause for distress" body={pauseDistress ? "Client state takes priority over the schedule." : "Warning: do not push the synthesis past real distress."} onClick={() => setPauseDistress((v) => !v)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: allGuards ? `${GREEN}${"66"}` : `${VERMILION}${"66"}`, background: allGuards ? `${GREEN}${"0F"}` : `${VERMILION}${"0F"}` }}>
        <p style={eyebrowStyle}>Net synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: allGuards ? (convergence === "favourable" ? GREEN : convergence === "stressed" ? VERMILION : GOLD) : VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
          {allGuards ? tier : "Ethical closing incomplete"}
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function SynthesisMapSvg({ entries }: { entries: Record<string, { direction: Direction; strength: Strength; root: RootKey }> }) {
  const nodes = REGISTERS.map((reg, index) => {
    const angle = (index / REGISTERS.length) * Math.PI * 2 - Math.PI / 2;
    const x = 280 + 150 * Math.cos(angle);
    const y = 120 + 90 * Math.sin(angle);
    return { ...reg, x, y, ...entries[reg.key] };
  });

  const rootGroups = new Map<RootKey, typeof nodes>();
  for (const node of nodes) {
    if (node.root !== "none") {
      const list = rootGroups.get(node.root) ?? [];
      list.push(node);
      rootGroups.set(node.root, list);
    }
  }

  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Multi-register synthesis map" style={{ width: "100%", maxHeight: 300, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="14" y="14" width="532" height="232" rx="8" fill={`${GOLD}${"0F"}`} stroke={HAIRLINE} />
      {Array.from(rootGroups.values()).map((group) =>
        group.map((node, i) =>
          group.slice(i + 1).map((other) => (
            <line key={`${node.key}-${other.key}`} x1={node.x} y1={node.y} x2={other.x} y2={other.y} stroke={directionColor(node.direction)} strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
          ))
        )
      )}
      {nodes.map((node) => {
        const color = directionColor(node.direction);
        const r = node.strength === "strong" ? 28 : node.strength === "moderate" ? 24 : 20;
        return (
          <g key={node.key}>
            <circle cx={node.x} cy={node.y} r={r} fill={`${color}${"18"}`} stroke={color} strokeWidth="3" />
            <text x={node.x} y={node.y - 4} textAnchor="middle" fill={color} fontSize="11" fontWeight="600">
              {node.label.split(" ")[0]}
            </text>
            <text x={node.x} y={node.y + 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">
              {node.direction}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"0F"}`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function GuardToggle({ active, icon, title, body, onClick }: { active: boolean; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, active ? GREEN : VERMILION)}>
      <span style={{ color: active ? GREEN : VERMILION }}>{active ? icon : <XCircle size={18} />}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
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
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.6rem",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_PRIMARY,
  padding: "0.45rem 0.6rem",
  fontWeight: 400,
};
