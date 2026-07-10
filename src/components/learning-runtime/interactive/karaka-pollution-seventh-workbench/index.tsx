"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Flame, HeartHandshake, HelpCircle, RotateCcw, Scale, ShieldCheck, Sparkles, Sun, Venus } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type ViewMode = "principle" | "sun" | "modifiers" | "debate";
type SunDignity = "dignified" | "neutral" | "afflicted";
type Conflict = "sun" | "other" | "venus";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  principle: {
    label: "Principle",
    title: "Karaka-pollution is a flag for careful reading",
    body: "A planet inimical to a house karaka, placed in that house, can stress the house significations. The flag prompts analysis; it is not a verdict.",
    icon: <Flame size={16} />,
    color: GOLD,
  },
  sun: {
    label: "Sun in 7th",
    title: "Sun in the 7th is caution, not curse",
    body: "The Sun can bring heat, ego, authority, prominence, or distance into partnership. Dignity and aspects decide the severity.",
    icon: <Sun size={16} />,
    color: VERMILION,
  },
  modifiers: {
    label: "Modifiers",
    title: "Dignity, Jupiter, Venus, and cancellations transform the reading",
    body: "A dignified, Jupiter-aspected Sun can become a principled, prominent spouse signature. An afflicted Sun needs care and agency.",
    icon: <Sparkles size={16} />,
    color: GREEN,
  },
  debate: {
    label: "Debate",
    title: "Karako bhava nasa is not mechanical",
    body: "The maxim is debated. Venus in the 7th is often supportive, so it must never be used as a standalone doom rule.",
    icon: <HelpCircle size={16} />,
    color: PURPLE,
  },
};

export function KarakaPollutionSeventhWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("modifiers");
  const [conflict, setConflict] = useState<Conflict>("sun");
  const [sunDignity, setSunDignity] = useState<SunDignity>("dignified");
  const [jupiterAspect, setJupiterAspect] = useState(true);
  const [venusStrong, setVenusStrong] = useState(true);
  const [cancellationsChecked, setCancellationsChecked] = useState(true);
  const [debateDisclosed, setDebateDisclosed] = useState(true);
  const [doomAvoided, setDoomAvoided] = useState(true);

  const isSun = conflict === "sun";
  const isVenusDebate = conflict === "venus";
  const methodOk = doomAvoided && (!isVenusDebate || debateDisclosed);
  const mitigation = (sunDignity === "dignified" ? 22 : sunDignity === "afflicted" ? -22 : 0) + (jupiterAspect ? 20 : 0) + (venusStrong ? 14 : -8) + (cancellationsChecked ? 10 : -8);
  const pollution = isVenusDebate ? 4 : isSun ? 32 : 22;
  const score = Math.max(5, Math.min(98, 50 - pollution + mitigation + (methodOk ? 12 : -28)));

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (isVenusDebate) return "debated consideration";
    if (score >= 72) return "mitigated / workable";
    if (score >= 48) return "care-needed flag";
    return "strong caution";
  }, [isVenusDebate, methodOk, score]);

  const interpretation = useMemo(() => {
    if (!doomAvoided) return "Pause: the pollution flag is being turned into a curse. Restore the lesson rule: read dignity, aspects, Venus, and cancellations before any conclusion.";
    if (isVenusDebate && !debateDisclosed) return "Pause: karako bhava nasa must be disclosed as debated. Do not present Venus in the 7th as a settled destructive rule.";
    if (isVenusDebate) return "Venus in the 7th raises the debated maxim, but it is often supportive of marriage. Treat it as a scholarly consideration, then weigh Venus strength, aspects, the 7th lord, and the fuller chart.";
    if (sunDignity === "dignified" && jupiterAspect) return "The Sun in the 7th is present, but dignity and Jupiter's aspect transform the caution: this can show a principled, prominent spouse and a mild independence theme, not separation.";
    if (sunDignity === "afflicted" && !jupiterAspect) return "The Sun-in-7th caution is less buffered: ego, dominance, heat, or distance themes need care. Still, this is an area of attention, not a decree of separation.";
    return "Karaka-pollution is active as a caution. Read the planet's nature, strength, aspects, Venus condition, and cancellations, then state a graded care theme.";
  }, [debateDisclosed, doomAvoided, isVenusDebate, jupiterAspect, sunDignity]);

  return (
    <div data-interactive="karaka-pollution-seventh-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Karaka-pollution reader</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Flag the conflict, then weigh the modifiers</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Test Sun-in-7th, other Venus-conflicts, and the debated Venus-in-7th maxim without turning any single factor into doom.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("modifiers");
              setConflict("sun");
              setSunDignity("dignified");
              setJupiterAspect(true);
              setVenusStrong(true);
              setCancellationsChecked(true);
              setDebateDisclosed(true);
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
              <p style={eyebrowStyle}>Pollution assessment</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier), fontWeight: 600 }}>{score}% buffered</strong>
          </div>
          <KarakaPollutionSvg conflict={conflict} sunDignity={sunDignity} jupiterAspect={jupiterAspect} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Flag" body={isVenusDebate ? "debated maxim" : isSun ? "Sun in 7th" : "karaka conflict"} color={isVenusDebate ? PURPLE : VERMILION} icon={<Flame size={16} />} />
            <MiniFact title="Dignity" body={sunDignity} color={sunDignity === "dignified" ? GREEN : sunDignity === "afflicted" ? VERMILION : GOLD} icon={<Sun size={16} />} />
            <MiniFact title="Jupiter" body={jupiterAspect ? "mitigates" : "absent"} color={jupiterAspect ? GREEN : GOLD} icon={<Sparkles size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Choose the karaka case" icon={<Venus size={18} />} color={isVenusDebate ? PURPLE : VERMILION}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.55rem" }}>
              <button type="button" aria-pressed={conflict === "sun"} onClick={() => setConflict("sun")} style={buttonStyle(conflict === "sun", VERMILION)}>
                <Sun size={16} />
                Sun in 7th
              </button>
              <button type="button" aria-pressed={conflict === "other"} onClick={() => setConflict("other")} style={buttonStyle(conflict === "other", GOLD)}>
                <Flame size={16} />
                Other conflict
              </button>
              <button type="button" aria-pressed={conflict === "venus"} onClick={() => setConflict("venus")} style={buttonStyle(conflict === "venus", PURPLE)}>
                <Venus size={16} />
                Venus in 7th
              </button>
            </div>
          </Panel>

          <Panel title="Sun severity controls" icon={<Sun size={18} />} color={sunDignity === "dignified" ? GREEN : sunDignity === "afflicted" ? VERMILION : GOLD}>
            <Segmented label="Sun dignity" value={sunDignity} options={[["dignified", "Dignified"], ["neutral", "Neutral"], ["afflicted", "Afflicted"]]} colors={{ dignified: GREEN, neutral: GOLD, afflicted: VERMILION }} onChange={(value) => setSunDignity(value as SunDignity)} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Modifiers</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={jupiterAspect} color={jupiterAspect ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Jupiter aspect mitigates" body={jupiterAspect ? "Heat is protected and softened." : "No Jupiter mitigation selected."} onClick={() => setJupiterAspect((value) => !value)} />
            <Toggle active={venusStrong} color={venusStrong ? GREEN : GOLD} icon={<Venus size={18} />} title="Venus remains strong" body={venusStrong ? "Kalatra-karaka can carry the marriage register." : "Venus needs more support in the fuller chart."} onClick={() => setVenusStrong((value) => !value)} />
            <Toggle active={cancellationsChecked} color={cancellationsChecked ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Cancellations checked" body={cancellationsChecked ? "Supportive factors are weighed before conclusion." : "Modifiers have not been weighed yet."} onClick={() => setCancellationsChecked((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Debate and ethics</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={debateDisclosed} color={debateDisclosed ? GREEN : VERMILION} icon={<HelpCircle size={18} />} title="Debate disclosed" body={debateDisclosed ? "Karako bhava nasa is named as debated." : "Debated maxim is being treated as settled law."} onClick={() => setDebateDisclosed((value) => !value)} />
            <Toggle active={doomAvoided} color={doomAvoided ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Doom verdict refused" body={doomAvoided ? "No separation decree from a pollution flag." : "The flag is becoming a curse."} onClick={() => setDoomAvoided((value) => !value)} />
            <div style={{ border: `1px solid ${isVenusDebate ? PURPLE : HAIRLINE}`, borderRadius: 8, background: isVenusDebate ? `${PURPLE}10` : "transparent", padding: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: isVenusDebate ? PURPLE : INK_MUTED }}>
                <Scale size={18} aria-hidden="true" />
                <strong style={{ fontWeight: 600 }}>{isVenusDebate ? "Debated maxim active" : "Pollution principle active"}</strong>
              </div>
              <p style={bodyTextStyle}>{isVenusDebate ? "Venus in the 7th is often supportive. Do not weaponise the maxim." : "A hostile planet in the 7th is a caution to read with modifiers."}</p>
            </div>
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <HeartHandshake size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Reading statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{interpretation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function KarakaPollutionSvg({ conflict, sunDignity, jupiterAspect, methodOk }: { conflict: Conflict; sunDignity: SunDignity; jupiterAspect: boolean; methodOk: boolean }) {
  const finalColor = !methodOk ? VERMILION : jupiterAspect && sunDignity === "dignified" ? GREEN : GOLD;
  const conflictLabel = conflict === "venus" ? "DEBATE" : conflict === "sun" ? "SUN" : "CONFLICT";
  return (
    <svg viewBox="0 0 760 410" role="img" aria-label="Karaka pollution modifiers diagram" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 206 132 L 324 132 M 436 132 L 554 132" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="6 8" />
      <circle cx="150" cy="132" r="56" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="3" />
      <text x="150" y="126" textAnchor="middle" fill={PURPLE} fontSize="16" fontWeight="600">Venus</text>
      <text x="150" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="13">marriage karaka</text>
      <circle cx="380" cy="132" r="56" fill={OPAQUE_LIGHT_FILL[VERMILION]} stroke={VERMILION} strokeWidth="3" />
      <text x="380" y="126" textAnchor="middle" fill={VERMILION} fontSize="16" fontWeight="600">{conflictLabel}</text>
      <text x="380" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="13">{conflict === "venus" ? "maxim" : "in 7th"}</text>
      <circle cx="610" cy="132" r="56" fill={jupiterAspect ? OPAQUE_LIGHT_FILL[GREEN] : "transparent"} stroke={jupiterAspect ? GREEN : HAIRLINE} strokeWidth={jupiterAspect ? 3 : 1.5} />
      <text x="610" y="126" textAnchor="middle" fill={jupiterAspect ? GREEN : INK_MUTED} fontSize="16" fontWeight="600">Jupiter</text>
      <text x="610" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="13">{jupiterAspect ? "mitigates" : "absent"}</text>
      <circle cx="380" cy="280" r="70" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="380" y="273" textAnchor="middle" fill={finalColor} fontSize="19" fontWeight="600">{methodOk ? "WEIGH" : "WARNING"}</text>
      <text x="380" y="297" textAnchor="middle" fill={INK_MUTED} fontSize="14">{sunDignity} + aspects</text>
      <rect x="90" y="360" width="580" height="36" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="382" textAnchor="middle" fill={INK_MUTED} fontSize="14">Flag, then weigh dignity, aspects, Venus, cancellations. No curse.</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
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
        <strong style={{ fontWeight: 600 }}>{title}</strong>
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
        <strong style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</strong>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function Segmented({ label, value, options, colors, onChange }: { label: string; value: string; options: Array<[string, string]>; colors: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <div>
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

function tierColor(tier: string): string {
  if (tier === "mitigated / workable") return GREEN;
  if (tier === "care-needed flag") return GOLD;
  if (tier === "debated consideration") return PURPLE;
  if (tier === "strong caution") return VERMILION;
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
