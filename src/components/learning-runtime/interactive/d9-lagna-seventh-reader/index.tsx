"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, FileText, GitCompare, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type ViewMode = "foundation" | "spouse" | "net" | "crosscheck";
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
  foundation: {
    label: "D9 Lagna",
    title: "The D9 Lagna is the foundation of married life",
    body: "Read the D9 Lagna sign, its lord, dignity, placement, and influences before judging the spouse-at-depth register.",
    icon: <CircleDot size={16} />,
    color: BLUE,
  },
  spouse: {
    label: "D9 7th",
    title: "The D9 7th is spouse and bond at depth",
    body: "Read the D9 7th sign, occupants, lord, dignity, and aspects as tendencies, never rigid spouse stereotypes.",
    icon: <HeartHandshake size={16} />,
    color: PURPLE,
  },
  net: {
    label: "Net",
    title: "Weigh benefic and malefic influence on both points",
    body: "Support or stress on either the D9 Lagna or D9 7th changes the depth reading. Report the net, not a single scary factor.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  crosscheck: {
    label: "D1 Check",
    title: "Cross-check the D9 with the D1",
    body: "Convergence gives robustness; divergence is a qualification to investigate and name. D9 does not stand alone.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
};

export function D9LagnaSeventhReader() {
  const [viewMode, setViewMode] = useState<ViewMode>("foundation");
  const [d9Lagna, setD9Lagna] = useState<Strength>("strong");
  const [d9Seventh, setD9Seventh] = useState<Strength>("strong");
  const [d1Seventh, setD1Seventh] = useState<Strength>("strong");
  const [beneficNet, setBeneficNet] = useState(true);
  const [maleficStress, setMaleficStress] = useState(false);
  const [lagnaReadFirst, setLagnaReadFirst] = useState(true);
  const [d1CrossChecked, setD1CrossChecked] = useState(true);
  const [tendenciesOnly, setTendenciesOnly] = useState(true);
  const [doomAvoided, setDoomAvoided] = useState(true);

  const d9Converges = d9Lagna === d9Seventh;
  const d1D9Converges = d1Seventh === d9Seventh;
  const methodOk = lagnaReadFirst && d1CrossChecked && tendenciesOnly && doomAvoided;
  const score = Math.max(5, Math.min(98, strengthScore(d9Lagna) + strengthScore(d9Seventh) + strengthScore(d1Seventh) + (beneficNet ? 12 : 0) - (maleficStress ? 12 : 0) + (lagnaReadFirst ? 8 : -16) + (d1CrossChecked ? 8 : -14) + (tendenciesOnly ? 8 : -18) + (doomAvoided ? 8 : -24)));

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (d9Lagna === "strong" && d9Seventh === "strong" && d1D9Converges) return "robust foundation";
    if (d9Lagna === "weak" || d9Seventh === "weak") return "care-needed depth";
    if (!d1D9Converges) return "qualified divergence";
    return "moderate support";
  }, [d1D9Converges, d9Lagna, d9Seventh, methodOk]);

  const interpretation = useMemo(() => {
    if (!lagnaReadFirst) return "Pause: the D9 7th is being read without its foundation. Read the D9 Lagna and Lagna lord first.";
    if (!d1CrossChecked) return "Pause: the D9 is not self-sufficient. Cross-check the D9 spouse-at-depth reading with the D1 7th.";
    if (!tendenciesOnly) return "Pause: the spouse reading is becoming an exact portrait. D9 7th indications are tendencies, not rigid stereotypes.";
    if (!doomAvoided) return "Pause: a weak D9 factor is being treated as failure. Restore the care-with-agency frame.";
    if (d9Lagna === "strong" && d9Seventh === "strong" && d1D9Converges) return "D9 Lagna and D9 7th are both strong, and the D1 agrees. This is a robust foundation and supportive spouse-at-depth reading, stated as a likelihood.";
    if (d9Seventh === "weak") return "The D9 7th needs care: the spouse/bond-at-depth register is stressed or thin. Weigh benefic protection, D1 support, Venus, and later layers before confidence.";
    if (d9Lagna === "weak") return "The D9 foundation needs care: the base of married life is the first focus. Read this as a foundation to tend, not as doom.";
    if (!d1D9Converges) return "The D1 and D9 diverge. Name the mismatch: the surface promise and depth texture are telling different parts of the story.";
    return "The D9 foundation and spouse-at-depth register are workable. Keep the reading qualified and combine it with the D1 and Venus.";
  }, [d1CrossChecked, d1D9Converges, d9Lagna, d9Seventh, doomAvoided, lagnaReadFirst, tendenciesOnly]);

  return (
    <div data-interactive="d9-lagna-seventh-reader" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D9 Lagna and 7th reader</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Read foundation, then spouse at depth</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Build the D9 reading in order: Lagna foundation, 7th spouse/bond, net influences, then the D1 cross-check.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("foundation");
              setD9Lagna("strong");
              setD9Seventh("strong");
              setD1Seventh("strong");
              setBeneficNet(true);
              setMaleficStress(false);
              setLagnaReadFirst(true);
              setD1CrossChecked(true);
              setTendenciesOnly(true);
              setDoomAvoided(true);
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
              <p style={eyebrowStyle}>Depth reading</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% support</strong>
          </div>
          <D9LagnaSeventhSvg d9Lagna={d9Lagna} d9Seventh={d9Seventh} d1Seventh={d1Seventh} methodOk={methodOk} d1D9Converges={d1D9Converges} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Foundation" body={d9Lagna} color={strengthColor(d9Lagna)} icon={<CircleDot size={16} />} />
            <MiniFact title="Spouse" body={d9Seventh} color={strengthColor(d9Seventh)} icon={<HeartHandshake size={16} />} />
            <MiniFact title="D1 check" body={d1D9Converges ? "agrees" : "diverges"} color={d1D9Converges ? GREEN : GOLD} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Set the reading layers" icon={<Scale size={18} />} color={d9Converges ? GREEN : GOLD}>
            <Segmented label="D9 Lagna foundation" value={d9Lagna} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD9Lagna(value as Strength)} />
            <Segmented label="D9 7th spouse at depth" value={d9Seventh} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD9Seventh(value as Strength)} />
            <Segmented label="D1 7th cross-check" value={d1Seventh} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD1Seventh(value as Strength)} />
          </Panel>

          <Panel title="Net influence" icon={<Sparkles size={18} />} color={beneficNet && !maleficStress ? GREEN : GOLD}>
            <Toggle active={beneficNet} color={beneficNet ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Benefic support counted" body={beneficNet ? "Support on D9 Lagna or 7th is included." : "Benefic protection still needs tallying."} onClick={() => setBeneficNet((value) => !value)} />
            <Toggle active={maleficStress} color={maleficStress ? GOLD : GREEN} icon={<TriangleAlert size={18} />} title="Malefic stress present" body={maleficStress ? "Stress is named as care theme, not doom." : "No major stress selected."} onClick={() => setMaleficStress((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading order</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={lagnaReadFirst} color={lagnaReadFirst ? GREEN : VERMILION} icon={<Orbit size={18} />} title="D9 Lagna read first" body={lagnaReadFirst ? "Foundation is established before spouse-at-depth." : "D9 7th is being read without the foundation."} onClick={() => setLagnaReadFirst((value) => !value)} />
            <Toggle active={d1CrossChecked} color={d1CrossChecked ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="D1 cross-check included" body={d1CrossChecked ? "D9 is compared back to the D1 7th." : "D9 is being reported without D1."} onClick={() => setD1CrossChecked((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical frame</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={tendenciesOnly} color={tendenciesOnly ? GREEN : VERMILION} icon={<FileText size={18} />} title="Spouse read as tendency" body={tendenciesOnly ? "No exact looks/profession/temperament decree." : "Reading is becoming an exact stereotype."} onClick={() => setTendenciesOnly((value) => !value)} />
            <Toggle active={doomAvoided} color={doomAvoided ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Weak D9 is not doom" body={doomAvoided ? "Weakness means care with agency." : "Weak D9 factor is being treated as failure."} onClick={() => setDoomAvoided((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <HeartHandshake size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Interpretive statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{interpretation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function D9LagnaSeventhSvg({ d9Lagna, d9Seventh, d1Seventh, methodOk, d1D9Converges }: { d9Lagna: Strength; d9Seventh: Strength; d1Seventh: Strength; methodOk: boolean; d1D9Converges: boolean }) {
  const finalColor = !methodOk ? VERMILION : d1D9Converges ? GREEN : GOLD;
  return (
    <svg viewBox="0 0 760 410" role="img" aria-label="D9 Lagna and D9 seventh reading flow" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="374" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 212 140 L 318 140 M 442 140 L 548 140" stroke={d1D9Converges ? GREEN : GOLD} strokeWidth="4" strokeDasharray={d1D9Converges ? "0" : "8 8"} />
      <circle cx="150" cy="140" r="62" fill={OPAQUE_LIGHT_FILL[strengthColor(d9Lagna)]} stroke={strengthColor(d9Lagna)} strokeWidth="4" />
      <text x="150" y="134" textAnchor="middle" fill={strengthColor(d9Lagna)} fontSize="16" fontWeight="600">D9 Lagna</text>
      <text x="150" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="12">foundation: {d9Lagna}</text>
      <circle cx="380" cy="140" r="62" fill={OPAQUE_LIGHT_FILL[strengthColor(d9Seventh)]} stroke={strengthColor(d9Seventh)} strokeWidth="4" />
      <text x="380" y="134" textAnchor="middle" fill={strengthColor(d9Seventh)} fontSize="16" fontWeight="600">D9 7th</text>
      <text x="380" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="12">depth: {d9Seventh}</text>
      <circle cx="610" cy="140" r="62" fill={OPAQUE_LIGHT_FILL[strengthColor(d1Seventh)]} stroke={strengthColor(d1Seventh)} strokeWidth="4" />
      <text x="610" y="134" textAnchor="middle" fill={strengthColor(d1Seventh)} fontSize="16" fontWeight="600">D1 7th</text>
      <text x="610" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="12">surface: {d1Seventh}</text>
      <circle cx="380" cy="280" r="68" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="4" />
      <text x="380" y="273" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="600">{methodOk ? (d1D9Converges ? "ROBUST" : "QUALIFY") : "WARNING"}</text>
      <text x="380" y="301" textAnchor="middle" fill={INK_MUTED} fontSize="12">foundation + spouse + D1</text>
      <rect x="80" y="350" width="600" height="34" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="372" textAnchor="middle" fill={INK_MUTED} fontSize="12">Read tendencies, weigh net influence, avoid standalone D9 doom.</text>
    </svg>
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

function strengthScore(strength: Strength): number {
  if (strength === "strong") return 22;
  if (strength === "mixed") return 14;
  return 6;
}

function strengthColor(strength: Strength): string {
  if (strength === "strong") return GREEN;
  if (strength === "mixed") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "robust foundation") return GREEN;
  if (tier === "qualified divergence") return GOLD;
  if (tier === "care-needed depth") return VERMILION;
  if (tier === "moderate support") return BLUE;
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
