"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, Compass, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type Dignity = "strong" | "neutral" | "weak";
type Aspect = "benefic" | "none" | "malefic";
type ViewMode = "placement" | "class" | "formula" | "ethics";

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

const HOUSE_NOTES: Record<number, { label: string; className: string; note: string; color: string }> = {
  1: { label: "1st", className: "kendra", note: "Spouse strongly influences the native; partnership is life-shaping.", color: GREEN },
  2: { label: "2nd", className: "artha / maraka", note: "Family, wealth, and family-building themes enter marriage.", color: BLUE },
  3: { label: "3rd", className: "upachaya", note: "Effort, initiative, courage, and improvement over time.", color: GOLD },
  4: { label: "4th", className: "kendra", note: "Domestic happiness, home, property, and spouse tied to sukha.", color: GREEN },
  5: { label: "5th", className: "trikona", note: "Romance, love-marriage tendency, creativity, and children.", color: GREEN },
  6: { label: "6th", className: "dusthana / upachaya", note: "Friction, service, health, or dispute themes; effort required.", color: VERMILION },
  7: { label: "7th", className: "own house", note: "Marriage and partner become central and prominent.", color: GREEN },
  8: { label: "8th", className: "dusthana", note: "Intensity, transformation, in-laws, legacy, possible delay.", color: VERMILION },
  9: { label: "9th", className: "trikona", note: "Fortunate, dharmic marriage; spouse from afar or different background.", color: GREEN },
  10: { label: "10th", className: "kendra", note: "Marriage tied to career, public standing, or status support.", color: BLUE },
  11: { label: "11th", className: "upachaya / labha", note: "Gains, networks, fulfilled desires, friend-to-spouse themes.", color: GREEN },
  12: { label: "12th", className: "dusthana", note: "Foreign or distant spouse, life abroad, intimacy, expenditure.", color: VERMILION },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  placement: {
    label: "Placement",
    title: "The house shows where marriage energy goes",
    body: "The 7th-lord's house is the first coordinate. It gives a tendency, not a standalone verdict.",
    icon: <Compass size={16} />,
    color: BLUE,
  },
  class: {
    label: "Class",
    title: "Read by house-class, not rote memorisation",
    body: "Kendra/trikona placements support; artha adds material themes; upachaya improves with effort; dusthana needs careful agency framing.",
    icon: <Orbit size={16} />,
    color: GREEN,
  },
  formula: {
    label: "Formula",
    title: "Placement x dignity x aspect",
    body: "A strong 7th-lord in a difficult house can be workable; a weak lord in a good house can be thinned. Aspects modify both.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  ethics: {
    label: "Ethics",
    title: "Difficult houses are not doom",
    body: "The 6th, 8th, and 12th are areas needing care. Never decree divorce, widowhood, separation, or failure from one placement.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

export function SeventhLordPlacementReader() {
  const [viewMode, setViewMode] = useState<ViewMode>("formula");
  const [house, setHouse] = useState(8);
  const [dignity, setDignity] = useState<Dignity>("strong");
  const [aspect, setAspect] = useState<Aspect>("benefic");
  const [venusChecked, setVenusChecked] = useState(true);
  const [cancellationsChecked, setCancellationsChecked] = useState(true);
  const [doomAvoided, setDoomAvoided] = useState(true);
  const [gradedLanguage, setGradedLanguage] = useState(true);

  const note = HOUSE_NOTES[house];
  const difficult = house === 6 || house === 8 || house === 12;
  const ethicsOk = doomAvoided && gradedLanguage;
  const score = Math.max(5, Math.min(98, 42 + (dignity === "strong" ? 18 : dignity === "weak" ? -18 : 0) + (aspect === "benefic" ? 16 : aspect === "malefic" ? -16 : 0) + (difficult ? -10 : 12) + (venusChecked ? 8 : -6) + (cancellationsChecked ? 8 : -6) + (ethicsOk ? 10 : -28)));

  const tier = useMemo(() => {
    if (!ethicsOk) return "method warning";
    if (difficult) return dignity === "strong" && aspect === "benefic" ? "workable with care" : "qualified / care-needed";
    if (score >= 78) return "favourable";
    if (score >= 55) return "moderate";
    return "thin / modified";
  }, [aspect, difficult, dignity, ethicsOk, score]);

  const interpretation = useMemo(() => {
    if (!ethicsOk) return "Pause: the reading is becoming fatalistic or certain. Restore graded language and refuse doom from one 7th-lord placement.";
    if (house === 8) return "7th-lord in the 8th indicates intensity, transformation, in-law or legacy themes, and possible delay. Read dignity, aspects, Venus, and cancellations before confidence; never read widowhood or doom.";
    if (house === 6) return "7th-lord in the 6th can show friction, dispute, service, or health themes in partnership. Because the 6th is also upachaya, effort and maturity can improve the result.";
    if (house === 12) return "7th-lord in the 12th can show distance, foreign connection, life abroad, privacy, intimacy, or expenditure. It is not a decreed separation.";
    return `${note.label} house: ${note.note} Modify this by dignity and aspects, then confirm with Venus, the 7th itself, and the fuller chart.`;
  }, [ethicsOk, house, note]);

  return (
    <div data-interactive="seventh-lord-placement-reader" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>7th-lord placement reader</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Read house, strength, aspect, then frame with care</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Move the marriage lord through the twelve houses and watch dignity, aspects, Venus, cancellations, and ethical framing change the indication.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("formula");
              setHouse(8);
              setDignity("strong");
              setAspect("benefic");
              setVenusChecked(true);
              setCancellationsChecked(true);
              setDoomAvoided(true);
              setGradedLanguage(true);
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

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Graded indication</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier), fontWeight: 600 }}>{score}% support</strong>
          </div>
          <SeventhLordSvg house={house} dignity={dignity} aspect={aspect} difficult={difficult} ethicsOk={ethicsOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="House" body={`${note.label} ${note.className}`} color={note.color} icon={<Compass size={16} />} />
            <MiniFact title="Dignity" body={dignity} color={dignity === "strong" ? GREEN : dignity === "weak" ? VERMILION : GOLD} icon={<Sparkles size={16} />} />
            <MiniFact title="Aspect" body={aspect} color={aspect === "benefic" ? GREEN : aspect === "malefic" ? VERMILION : GOLD} icon={<BadgeCheck size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Pick the 7th-lord house" icon={<CircleDot size={18} />} color={note.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem" }}>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
                <button key={item} type="button" aria-pressed={house === item} onClick={() => setHouse(item)} style={houseButtonStyle(house === item, HOUSE_NOTES[item].color)}>
                  <strong style={{ fontWeight: 600 }}>{HOUSE_NOTES[item].label}</strong>
                  <span>{HOUSE_NOTES[item].className}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title={`${note.label} house reading`} icon={<HeartHandshake size={18} />} color={note.color}>
            <StreamRow label={note.className} body={note.note} verdict={difficult ? "care" : "tendency"} color={note.color} />
            <StreamRow label="Formula" body="House placement x dignity x aspect x fuller chart gives the graded indication." verdict="combine" color={GOLD} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Strength and aspect modifiers</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Segmented label="Dignity" value={dignity} options={[["strong", "Strong"], ["neutral", "Neutral"], ["weak", "Weak"]]} colors={{ strong: GREEN, neutral: GOLD, weak: VERMILION }} onChange={(value) => setDignity(value as Dignity)} />
            <Segmented label="Aspect" value={aspect} options={[["benefic", "Benefic"], ["none", "None"], ["malefic", "Malefic"]]} colors={{ benefic: GREEN, none: GOLD, malefic: VERMILION }} onChange={(value) => setAspect(value as Aspect)} />
            <Toggle active={venusChecked} color={venusChecked ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Venus checked" body={venusChecked ? "Kalatra-karaka is included before concluding." : "Venus is missing from the synthesis."} onClick={() => setVenusChecked((value) => !value)} />
            <Toggle active={cancellationsChecked} color={cancellationsChecked ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Cancellations checked" body={cancellationsChecked ? "Support, protection, or cancellation factors are weighed." : "Modifiers are not yet weighed."} onClick={() => setCancellationsChecked((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical frame for 6 / 8 / 12</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={doomAvoided} color={doomAvoided ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Doom verdict refused" body={doomAvoided ? "No divorce, widowhood, or separation decree from one placement." : "Reading has become fatalistic."} onClick={() => setDoomAvoided((value) => !value)} />
            <Toggle active={gradedLanguage} color={gradedLanguage ? GREEN : VERMILION} icon={<Scale size={18} />} title="Graded language used" body={gradedLanguage ? "Uses tends to, can show, possible, qualified." : "Statement sounds certain or stereotyped."} onClick={() => setGradedLanguage((value) => !value)} />
            <div style={{ border: `1px solid ${difficult ? VERMILION : HAIRLINE}`, borderRadius: 8, background: difficult ? `${VERMILION}10` : `${GREEN}10`, padding: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: difficult ? VERMILION : GREEN }}>
                <TriangleAlert size={18} aria-hidden="true" />
                <strong style={{ fontWeight: 600 }}>{difficult ? "Difficult house selected" : "Supportive or mixed house selected"}</strong>
              </div>
              <p style={bodyTextStyle}>{difficult ? "Read as an area needing care with agency. Combine strength, aspects, Venus, and cancellations." : "Still avoid guarantees; every placement remains a graded indication."}</p>
            </div>
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

function SeventhLordSvg({ house, dignity, aspect, difficult, ethicsOk }: { house: number; dignity: Dignity; aspect: Aspect; difficult: boolean; ethicsOk: boolean }) {
  const finalColor = !ethicsOk ? VERMILION : difficult ? GOLD : GREEN;
  const dignityColor = dignity === "strong" ? GREEN : dignity === "weak" ? VERMILION : GOLD;
  const aspectColor = aspect === "benefic" ? GREEN : aspect === "malefic" ? VERMILION : GOLD;

  return (
    <svg viewBox="0 0 760 410" role="img" aria-label="7th lord placement formula diagram" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="374" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 180 120 L 270 120 M 370 120 L 460 120" stroke={HAIRLINE} strokeWidth="3" />
      <path d="M 560 120 L 596 120" stroke={HAIRLINE} strokeWidth="3" />
      <path d="M 380 170 L 380 205" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="6 8" />
      <Node x={130} y={120} label={`H${house}`} body={HOUSE_NOTES[house].className} color={HOUSE_NOTES[house].color} />
      <Node x={320} y={120} label="Dignity" body={dignity} color={dignityColor} />
      <Node x={510} y={120} label="Aspect" body={aspect} color={aspectColor} />
      <circle cx="640" cy="120" r="44" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="3" />
      <text x="640" y="116" textAnchor="middle" fill={PURPLE} fontSize="14" fontWeight="600">Fuller</text>
      <text x="640" y="136" textAnchor="middle" fill={INK_MUTED} fontSize="12">chart</text>
      <circle cx="380" cy="275" r="70" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="380" y="268" textAnchor="middle" fill={finalColor} fontSize="19" fontWeight="600">{ethicsOk ? "GRADED" : "WARNING"}</text>
      <text x="380" y="292" textAnchor="middle" fill={INK_MUTED} fontSize="14">{difficult ? "care with agency" : "tendency, not verdict"}</text>
      <rect x="90" y="355" width="580" height="36" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="378" textAnchor="middle" fill={INK_MUTED} fontSize="14" fontWeight="600">House x dignity x aspect x fuller chart. Never placement alone.</text>
    </svg>
  );
}

function Node({ x, y, label, body, color }: { x: number; y: number; label: string; body: string; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="50" fill={OPAQUE_LIGHT_FILL[color]} stroke={color} strokeWidth="3" />
      <text x={x} y={y - 5} textAnchor="middle" fill={color} fontSize="16" fontWeight="600">{label}</text>
      <text x={x} y={y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="13">{body}</text>
    </g>
  );
}

function StreamRow({ label, body, verdict, color }: { label: string; body: string; verdict: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.65rem", marginTop: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <strong style={{ color }}>{label}</strong>
        <span style={{ color, fontSize: "0.78rem", fontWeight: 600 }}>{verdict}</span>
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

const responsiveTwoColumnStyle: CSSProperties = {
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
  if (tier === "favourable") return GREEN;
  if (tier === "workable with care") return GOLD;
  if (tier === "qualified / care-needed") return GOLD;
  if (tier === "moderate") return BLUE;
  if (tier === "thin / modified") return PURPLE;
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

function houseButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonStyle(active, color),
    minHeight: 72,
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "left",
    gap: "0.25rem",
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
