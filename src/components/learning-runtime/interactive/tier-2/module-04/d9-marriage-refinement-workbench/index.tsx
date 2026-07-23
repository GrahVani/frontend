"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, FileText, GitCompare, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type ViewMode = "construction" | "jurisdiction" | "layering" | "synthesis";
type Strength = "strong" | "mixed" | "weak";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  construction: {
    label: "Construct",
    title: "Each sign splits into nine navamshas",
    body: "D9 uses nine parts of 3 deg 20 min. Movable signs count from themselves, fixed from the 9th, and dual from the 5th.",
    icon: <CircleDot size={16} />,
    color: BLUE,
  },
  jurisdiction: {
    label: "Why D9",
    title: "D9 carries marriage, dharma, fruit, and strength",
    body: "It is the primary marriage divisional, the fruit of the D1 tree, and a universal strength-test through navamsha dignity and vargottama.",
    icon: <Sparkles size={16} />,
    color: GREEN,
  },
  layering: {
    label: "Layering",
    title: "D9 refines the D1; it does not replace it",
    body: "Anchor the D1 7th first. Then read D9 Lagna, D9 7th/lord, and D9 Venus as the depth and ripening of that promise.",
    icon: <Orbit size={16} />,
    color: GOLD,
  },
  synthesis: {
    label: "Synthesis",
    title: "Convergence raises confidence; divergence qualifies",
    body: "Strong in both D1 and D9 is robust. Strong in one and weak in the other is a named tension, never a hidden average.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
  },
};

export function D9MarriageRefinementWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("synthesis");
  const [d1Strength, setD1Strength] = useState<Strength>("strong");
  const [d9Strength, setD9Strength] = useState<Strength>("strong");
  const [d1Anchored, setD1Anchored] = useState(true);
  const [d9ReadAsRefinement, setD9ReadAsRefinement] = useState(true);
  const [venusIncluded, setVenusIncluded] = useState(true);
  const [standaloneVerdictRefused, setStandaloneVerdictRefused] = useState(true);
  const [divergenceNamed, setDivergenceNamed] = useState(true);

  const convergence = d1Strength === d9Strength;
  const methodOk = d1Anchored && d9ReadAsRefinement && standaloneVerdictRefused && (convergence || divergenceNamed);
  const score = Math.max(5, Math.min(98, (d1Strength === "strong" ? 34 : d1Strength === "mixed" ? 20 : 8) + (d9Strength === "strong" ? 34 : d9Strength === "mixed" ? 20 : 8) + (d1Anchored ? 10 : -20) + (d9ReadAsRefinement ? 8 : -14) + (venusIncluded ? 8 : -6) + (standaloneVerdictRefused ? 8 : -24) + (convergence ? 6 : divergenceNamed ? 4 : -12)));

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (convergence && d1Strength === "strong") return "robust convergence";
    if (convergence && d1Strength === "weak") return "convergent caution";
    if (!convergence) return "qualified divergence";
    return "moderate convergence";
  }, [convergence, d1Strength, methodOk]);

  const interpretation = useMemo(() => {
    if (!d1Anchored) return "Pause: the D1 7th has been skipped. Establish the structural marriage promise first, then let D9 refine it.";
    if (!d9ReadAsRefinement) return "Pause: the D9 is being treated as a substitute. Restore layer-not-substitute: D9 confirms, deepens, or qualifies the D1.";
    if (!standaloneVerdictRefused) return "Pause: a D9-only doom or bliss verdict is forming. The lesson forbids standalone D9 conclusions.";
    if (!convergence && !divergenceNamed) return "The D1-D9 mismatch must be named. Divergence is itself the finding, not something to average away.";
    if (convergence && d1Strength === "strong") return "D1 and D9 both support the marriage promise. This is robust convergence: a strong indication, still framed as likelihood and refined by later layers.";
    if (convergence && d1Strength === "weak") return "Both D1 and D9 show caution. Confidence rises for a care-needed reading, not for doom; name the weakness and look for modifying support.";
    if (!convergence) return "D1 and D9 diverge. Investigate why: a surface promise may have a deeper qualification, or a modest D1 may ripen better in D9. Report the tension clearly.";
    return "D1 and D9 are both mixed. Keep the reading qualified, include Venus, and avoid overclaiming.";
  }, [convergence, d1Anchored, d1Strength, d9ReadAsRefinement, divergenceNamed, standaloneVerdictRefused]);

  return (
    <div data-interactive="d9-marriage-refinement-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D9 marriage refinement</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Read the D9 as fruit, not replacement</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Recall the navamsha construction, anchor the D1 promise, and combine D1 with D9 through convergence or named divergence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("synthesis");
              setD1Strength("strong");
              setD9Strength("strong");
              setD1Anchored(true);
              setD9ReadAsRefinement(true);
              setVenusIncluded(true);
              setStandaloneVerdictRefused(true);
              setDivergenceNamed(true);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem" }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>D1-D9 synthesis</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% support</strong>
          </div>
          <D9RefinementSvg d1Strength={d1Strength} d9Strength={d9Strength} d1Anchored={d1Anchored} methodOk={methodOk} convergence={convergence} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="D1" body={d1Strength} color={strengthColor(d1Strength)} icon={<CircleDot size={16} />} />
            <MiniFact title="D9" body={d9Strength} color={strengthColor(d9Strength)} icon={<Sparkles size={16} />} />
            <MiniFact title="Pattern" body={convergence ? "converges" : "diverges"} color={convergence ? GREEN : GOLD} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="D1 and D9 strength" icon={<Scale size={18} />} color={convergence ? GREEN : GOLD}>
            <Segmented label="D1 7th promise" value={d1Strength} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD1Strength(value as Strength)} />
            <Segmented label="D9 ripening" value={d9Strength} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD9Strength(value as Strength)} />
          </Panel>

          <Panel title="Construction memory" icon={<CircleDot size={18} />} color={BLUE}>
            <StreamRow label="Movable" body="Count navamsha from the sign itself." verdict="cara" color={BLUE} />
            <StreamRow label="Fixed" body="Count navamsha from the 9th sign." verdict="sthira" color={GOLD} />
            <StreamRow label="Dual" body="Count navamsha from the 5th sign." verdict="dual" color={PURPLE} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Layer discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={d1Anchored} color={d1Anchored ? GREEN : VERMILION} icon={<CircleDot size={18} />} title="D1 7th anchored first" body={d1Anchored ? "Structural promise is established before D9." : "D9 is being read before the D1 anchor."} onClick={() => setD1Anchored((value) => !value)} />
            <Toggle active={d9ReadAsRefinement} color={d9ReadAsRefinement ? GREEN : VERMILION} icon={<Orbit size={18} />} title="D9 refines, not replaces" body={d9ReadAsRefinement ? "D9 deepens and confirms the D1 promise." : "D9 is being used as a substitute."} onClick={() => setD9ReadAsRefinement((value) => !value)} />
            <Toggle active={venusIncluded} color={venusIncluded ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="D9 Venus included" body={venusIncluded ? "Marriage karaka depth is part of the reading." : "D9 Venus still needs to be checked."} onClick={() => setVenusIncluded((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical synthesis</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={standaloneVerdictRefused} color={standaloneVerdictRefused ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Standalone D9 verdict refused" body={standaloneVerdictRefused ? "No D9-only doom or bliss claim." : "D9 is being treated as final verdict."} onClick={() => setStandaloneVerdictRefused((value) => !value)} />
            <Toggle active={divergenceNamed} color={divergenceNamed ? GREEN : VERMILION} icon={<FileText size={18} />} title="Divergence named" body={divergenceNamed ? "Mismatch is stated and investigated." : "Mismatch is hidden or averaged away."} onClick={() => setDivergenceNamed((value) => !value)} />
            <div style={{ border: `1px solid ${convergence ? GREEN : GOLD}`, borderRadius: 8, background: convergence ? `${GREEN}10` : `${GOLD}10`, padding: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: convergence ? GREEN : GOLD }}>
                {convergence ? <BadgeCheck size={18} aria-hidden="true" /> : <TriangleAlert size={18} aria-hidden="true" />}
                <strong>{convergence ? "Convergence" : "Divergence"}</strong>
              </div>
              <p style={bodyTextStyle}>{convergence ? "Agreement raises confidence, but still remains a likelihood." : "Tension is the interpretive finding; investigate and name it."}</p>
            </div>
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <GitCompare size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Combined reading</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{interpretation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function D9RefinementSvg({ d1Strength, d9Strength, d1Anchored, methodOk, convergence }: { d1Strength: Strength; d9Strength: Strength; d1Anchored: boolean; methodOk: boolean; convergence: boolean }) {
  const finalColor = !methodOk ? VERMILION : convergence ? GREEN : GOLD;
  return (
    <svg viewBox="0 0 760 410" role="img" aria-label="D1 and D9 marriage refinement diagram" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="374" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 258 145 L 502 145" stroke={convergence ? GREEN : GOLD} strokeWidth="4" strokeDasharray={convergence ? "0" : "8 8"} />
      <circle cx="190" cy="145" r="68" fill={OPAQUE_LIGHT_FILL[strengthColor(d1Strength)]} stroke={d1Anchored ? strengthColor(d1Strength) : VERMILION} strokeWidth="4" />
      <text x="190" y="139" textAnchor="middle" fill={d1Anchored ? strengthColor(d1Strength) : VERMILION} fontSize="17" fontWeight="600">D1 7th</text>
      <text x="190" y="168" textAnchor="middle" fill={INK_MUTED} fontSize="12">{d1Anchored ? d1Strength : "missing anchor"}</text>
      <circle cx="570" cy="145" r="68" fill={OPAQUE_LIGHT_FILL[strengthColor(d9Strength)]} stroke={strengthColor(d9Strength)} strokeWidth="4" />
      <text x="570" y="139" textAnchor="middle" fill={strengthColor(d9Strength)} fontSize="17" fontWeight="600">D9 fruit</text>
      <text x="570" y="168" textAnchor="middle" fill={INK_MUTED} fontSize="12">{d9Strength}</text>
      <circle cx="380" cy="280" r="68" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="4" />
      <text x="380" y="273" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="600">{methodOk ? (convergence ? "ROBUST" : "QUALIFY") : "WARNING"}</text>
      <text x="380" y="301" textAnchor="middle" fill={INK_MUTED} fontSize="12">combine, never replace</text>
      <rect x="80" y="350" width="600" height="34" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="372" textAnchor="middle" fill={INK_MUTED} fontSize="12">D9 refines the D1 promise. No standalone D9 verdict.</text>
    </svg>
  );
}

function StreamRow({ label, body, verdict, color }: { label: string; body: string; verdict: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.65rem", marginTop: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <strong style={{ color }}>{label}</strong>
        <span style={{ color, fontSize: "0.78rem", fontWeight: 700 }}>{verdict}</span>
      </div>
      <p style={{ ...bodyTextStyle, marginTop: "0.35rem" }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 700 }}>{title}</strong>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <strong style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</strong>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function Segmented({ label, value, options, colors, onChange }: { label: string; value: string; options: Array<[string, string]>; colors: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} style={buttonStyle(value === key, colors[key])}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(360px, 1.25fr) minmax(320px, 1fr)",
  gap: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

function strengthColor(strength: Strength): string {
  if (strength === "strong") return GREEN;
  if (strength === "mixed") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "robust convergence") return GREEN;
  if (tier === "qualified divergence") return GOLD;
  if (tier === "moderate convergence") return BLUE;
  if (tier === "convergent caution") return VERMILION;
  return VERMILION;
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
  };
}
