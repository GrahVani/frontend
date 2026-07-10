"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Baby, Compass, Heart, HeartPulse, Landmark, Orbit, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';
import { NI_HOUSE_POLYGONS, NI_HOUSE_CENTERS } from "@/lib/north-indian-chart-geometry";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type CapacityKey = "strong" | "mixed" | "weak";

const FIFTH_LORD_PLACEMENTS = [
  {
    house: 1,
    name: "Tanu",
    nature: "kendra-trikona",
    color: GOLD,
    theme: "The self carries the saṁtāna story: children and merit become woven into identity and personal path.",
    strong: "Dignified, the native's own vitality supports progeny; children are close to the self and identity.",
    weak: "Afflicted, personal stress or health may complicate the saṁtāna ease; cross-check Jupiter and D7.",
  },
  {
    house: 2,
    name: "Dhana",
    nature: "family-speech",
    color: BLUE,
    theme: "Progeny connects to family lineage, accumulated resources, speech, and values.",
    strong: "Family and resource stability support the children's wellbeing and upbringing.",
    weak: "Family or resource pressure may colour the saṁtāna story; read the wider chart.",
  },
  {
    house: 3,
    name: "Sahaja",
    nature: "upachaya-effort",
    color: BLUE,
    theme: "Children come through effort, communication, courage, and repeated initiative.",
    strong: "Persistent effort and skill-building favour the saṁtāna path; siblings may be involved.",
    weak: "Delays through scattered effort or communication strain; patience and support help.",
  },
  {
    house: 4,
    name: "Sukha",
    nature: "kendra",
    color: GREEN,
    theme: "Progeny settles into home, emotional base, mother, comfort, and domestic stability.",
    strong: "A nourishing home environment supports children; emotional security is strong.",
    weak: "Domestic or emotional instability may complicate the saṁtāna ease.",
  },
  {
    house: 5,
    name: "Putra",
    nature: "own-trikona",
    color: GREEN,
    theme: "The 5th lord in its own house: the saṁtāna-significator is self-supported and dignified.",
    strong: "The clearest favourable signature: progeny and merit flow naturally when unafflicted.",
    weak: "Even in own house, severe affliction qualifies the picture; still read Jupiter and D7.",
  },
  {
    house: 6,
    name: "Shatru",
    nature: "dusthana",
    color: VERMILION,
    theme: "The saṁtāna story enters the arena of service, competition, health, and daily obligation.",
    strong: "Strong and supported, the challenge can be navigated; sometimes service or healing roles link to children.",
    weak: "Delay, anxiety, or difficulty around children is indicated — read as a tendency, never a verdict.",
  },
  {
    house: 7,
    name: "Yuvati",
    nature: "kendra",
    color: GREEN,
    theme: "Progeny flows through partnership, spouse, contracts, and the other.",
    strong: "Spouse and partnership support the saṁtāna story; children deepen the union.",
    weak: "Partnership stress may complicate the children-area; keep the 7th lord in view.",
  },
  {
    house: 8,
    name: "Randhra",
    nature: "dusthana",
    color: PURPLE,
    theme: "The saṁtāna story touches hidden matters, inheritance, transformation, and crisis-depth.",
    strong: "Strong, it can give depth, research, or healing capacity around children; inheritance links possible.",
    weak: "Fear, hidden obstacles, or sudden changes may delay or stress the saṁtāna path.",
  },
  {
    house: 9,
    name: "Dharma",
    nature: "trikona-yoga",
    color: GOLD,
    theme: "Progeny merges with dharma, fortune, higher learning, teaching, and blessing.",
    strong: "Among the most auspicious signatures: children are linked to fortune, guru, and merit.",
    weak: "The blessing is present but under-delivered until strength, timing, and D7 confirm.",
  },
  {
    house: 10,
    name: "Karma",
    nature: "kendra",
    color: GREEN,
    theme: "Children and progeny connect to public life, profession, status, and action in the world.",
    strong: "Public or professional stability supports the saṁtāna story; children are visible in the life-path.",
    weak: "Career pressure may compete with family time; balance is the theme.",
  },
  {
    house: 11,
    name: "Labha",
    nature: "upachaya-gains",
    color: BLUE,
    theme: "Progeny links to gains, networks, elder siblings, and fulfilled desires.",
    strong: "Supportive networks and gains ease the children's path; elder siblings may help.",
    weak: "Ambition or network instability may delay or scatter the saṁtāna promise.",
  },
  {
    house: 12,
    name: "Vyaya",
    nature: "dusthana",
    color: VERMILION,
    theme: "The saṁtāna story touches foreign lands, institutions, retreat, loss, or expenditure.",
    strong: "Children may settle abroad, or the path may involve institutions, research, or spiritual context.",
    weak: "Delay, distance, or a sense of loss around children — read gently and cross-check.",
  },
] as const;

const CAPACITY = {
  strong: {
    label: "Strong / dignified",
    color: GREEN,
    score: 88,
    note: "The placement's theme delivers cleanly; the saṁtāna signature becomes usable strength.",
  },
  mixed: {
    label: "Mixed / average",
    color: GOLD,
    score: 56,
    note: "The theme is real but uneven. Read aspects, dignity, and timing before confidence rises.",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    score: 28,
    note: "The same direction struggles to deliver. Qualify the outcome and cross-check Jupiter and D7.",
  },
} as const;

export function SantanaFifthLordPermutationsWheel() {
  const [placementHouse, setPlacementHouse] = useState(5);
  const [capacity, setCapacity] = useState<CapacityKey>("strong");
  const [lagnaLink, setLagnaLink] = useState(false);
  const [ninthLink, setNinthLink] = useState(false);
  const [jupiterLink, setJupiterLink] = useState(false);
  const [showNature, setShowNature] = useState(true);
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);

  const placement = FIFTH_LORD_PLACEMENTS.find((item) => item.house === placementHouse) ?? FIFTH_LORD_PLACEMENTS[4];
  const capacityState = CAPACITY[capacity];
  const isDusthana = placement.nature.includes("dusthana");
  const isSupportive = placement.nature.includes("kendra") || placement.nature.includes("trikona") || placement.nature.includes("own");
  const relationshipScore = (lagnaLink ? 1 : 0) + (ninthLink ? 1 : 0) + (jupiterLink ? 1 : 0);
  const careFrame = nonFatalistic && medicalRoute && distressPause;

  const deliveryText = capacity === "weak" ? placement.weak : capacity === "strong" ? placement.strong : `${placement.strong} But keep the delivery qualified until dignity, aspects, and timing agree.`;

  const verdict = useMemo(() => {
    if (!careFrame) return { label: "care frame needs repair", color: VERMILION };
    if (capacity === "weak" && isDusthana) return { label: "challenge to navigate", color: VERMILION };
    if (isSupportive && relationshipScore >= 2 && capacity !== "weak") return { label: "strong santana tendency", color: GREEN };
    if (isSupportive && capacity !== "weak") return { label: "supportive santana tendency", color: GREEN };
    if (isDusthana) return { label: "delay or challenge tendency", color: GOLD };
    return { label: "mixed santana tendency", color: GOLD };
  }, [capacity, careFrame, isDusthana, isSupportive, relationshipScore]);

  const synthesis = useMemo(() => {
    const theme = `5th lord in ${placement.house}: ${placement.name}. ${placement.theme}`;
    const strength = capacityState.note;
    const delivery = deliveryText;
    const relation = relationshipScore === 0
      ? "No supporting lord relationship is selected; let Jupiter, the 9th lord, and D7 guide confidence."
      : relationshipScore === 3
        ? "Links to Lagna lord, 9th lord, and Jupiter all support the saṁtāna picture."
        : `Selected supporting links (${relationshipScore}/3) moderate the reading.`;
    const frame = careFrame
      ? "Framed as a tendency with graded confidence, medical routing intact, and distress awareness."
      : "Repair the care frame before giving the reading.";
    return `${theme} ${strength} ${delivery} ${relation} ${frame}`;
  }, [capacityState.note, careFrame, deliveryText, placement.house, placement.name, placement.theme, relationshipScore]);

  function reset() {
    setPlacementHouse(5);
    setCapacity("strong");
    setLagnaLink(false);
    setNinthLink(false);
    setJupiterLink(false);
    setShowNature(true);
    setNonFatalistic(true);
    setMedicalRoute(true);
    setDistressPause(true);
  }

  return (
    <div data-interactive="santana-fifth-lord-permutations-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>5th lord permutation wheel</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>Where the saṁtāna story lives</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Move the 5th lord through the twelve houses, then change its strength and relationships to see why a placement is a tendency, not a verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Twelve placements</p>
              <h3 style={{ margin: "0.15rem 0 0", color: placement.color, fontSize: "1.12rem", fontWeight: 600 }}>
                5th lord in {placement.house}: {placement.name}
              </h3>
            </div>
            <strong style={{ color: capacityState.color, fontWeight: 600 }}>{capacityState.label}</strong>
          </div>
          <FifthLordNorthIndianSvg placement={placement} capacity={capacity} showNature={showNature} onSelectHouse={setPlacementHouse} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Compass size={16} />} title="House theme" body={`H${placement.house}: ${placement.name}`} color={placement.color} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Strength" body={capacityState.label} color={capacityState.color} />
            <MiniFact icon={<Landmark size={16} />} title="Nature" body={placement.nature} color={showNature ? BLUE : INK_MUTED} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Place the 5th lord" icon={<Orbit size={18} />} color={placement.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem" }}>
              {FIFTH_LORD_PLACEMENTS.map((item) => (
                <button
                  key={item.house}
                  type="button"
                  aria-pressed={placementHouse === item.house}
                  onClick={() => setPlacementHouse(item.house)}
                  style={smallChipStyle(placementHouse === item.house, item.color)}
                >
                  H{item.house}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{placement.theme}</p>
          </Panel>

          <Panel title="Lord capacity" icon={<ShieldCheck size={18} />} color={capacityState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(CAPACITY) as CapacityKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={capacity === key} onClick={() => setCapacity(key)} style={smallChipStyle(capacity === key, CAPACITY[key].color)}>
                  {CAPACITY[key].label}
                </button>
              ))}
            </div>
            <div style={{ height: 12, borderRadius: 8, background: `${GOLD}22`, overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
              <div style={{ width: `${capacityState.score}%`, height: "100%", background: capacityState.color, transition: "width 240ms ease" }} />
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{deliveryText}</p>
          </Panel>

          <Panel title="House nature overlay" icon={<Landmark size={18} />} color={showNature ? BLUE : GOLD}>
            <button type="button" aria-pressed={showNature} onClick={() => setShowNature((value) => !value)} style={smallChipStyle(showNature, BLUE)}>
              {showNature ? "Nature visible" : "Show nature"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Kendra and trikona placements support saṁtāna; dusthana placements need strength and cross-checks before they become productive.
            </p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Supporting relationships</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={lagnaLink} color={lagnaLink ? GREEN : GOLD} icon={<Compass size={18} />} title="5th lord linked to Lagna lord" body={lagnaLink ? "The self engages the saṁtāna story supportively." : "No Lagna-lord link selected."} onClick={() => setLagnaLink((value) => !value)} />
            <Toggle active={ninthLink} color={ninthLink ? GREEN : GOLD} icon={<Sparkles size={18} />} title="5th lord linked to 9th lord" body={ninthLink ? "Dharma-trine link: among the most auspicious saṁtāna signatures." : "No 9th-lord link selected."} onClick={() => setNinthLink((value) => !value)} />
            <Toggle active={jupiterLink} color={jupiterLink ? GREEN : GOLD} icon={<Baby size={18} />} title="5th lord linked to Jupiter" body={jupiterLink ? "Saṁtāna-kāraka supports the 5th lord." : "No Jupiter link selected."} onClick={() => setJupiterLink((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Care frame</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={nonFatalistic} color={nonFatalistic ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Indication, not decree" body={nonFatalistic ? "No childlessness foreclosure." : "Forbidden foreclosure claim active."} onClick={() => setNonFatalistic((value) => !value)} />
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical routing intact" body={medicalRoute ? "Clinical concerns go to specialists." : "Chart replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
            <Toggle active={distressPause} color={distressPause ? GREEN : PURPLE} icon={<Heart size={18} />} title="Pause for visible distress" body={distressPause ? "Care before technique." : "Continuing through distress."} onClick={() => setDistressPause((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Direction + delivery synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function FifthLordNorthIndianSvg({
  placement,
  capacity,
  showNature,
  onSelectHouse,
}: {
  placement: (typeof FIFTH_LORD_PLACEMENTS)[number];
  capacity: CapacityKey;
  showNature: boolean;
  onSelectHouse: (house: number) => void;
}) {
  const capacityState = CAPACITY[capacity];
  const activeCenter = NI_HOUSE_CENTERS[placement.house];
  const fifthCenter = NI_HOUSE_CENTERS[5];

  return (
    <>
      <div style={{ textAlign: "center", color: INK_MUTED, fontSize: "0.72rem", letterSpacing: "0.04em", lineHeight: 1.35, marginBottom: "0.2rem" }}>
        5TH LORD CARRIES SAṀTĀNA INTO HOUSE {placement.house}
      </div>
      <svg viewBox="0 0 340 340" role="img" aria-label="Fifth lord placement in North Indian chart with capacity and house nature overlay" style={{ width: "100%", maxHeight: 430, margin: "0 auto", display: "block" }}>
        <rect x="10" y="10" width="320" height="320" fill={`${PURPLE}05`} stroke={HAIRLINE} strokeWidth="1.5" />

        {/* North Indian chart structural lines */}
        <line x1="10" y1="10" x2="330" y2="330" stroke={HAIRLINE} strokeWidth="1" />
        <line x1="330" y1="10" x2="10" y2="330" stroke={HAIRLINE} strokeWidth="1" />
        <polygon points="170,10 10,170 170,330 330,170" fill="none" stroke={HAIRLINE} strokeWidth="1" />

        {/* Connector line from 5th house to lord's placement */}
        <line x1={fifthCenter.x} y1={fifthCenter.y} x2={activeCenter.x} y2={activeCenter.y} stroke={placement.color} strokeWidth="3.5" strokeLinecap="round" />

        {/* Render all 12 house polygons */}
        {FIFTH_LORD_PLACEMENTS.map((item) => {
          const h = item.house;
          const active = h === placement.house;
          const source = h === 5;
          const dusthana = item.nature.includes("dusthana");
          const support = item.nature.includes("kendra") || item.nature.includes("trikona") || item.nature.includes("own");

          const polyFill = active
            ? `${placement.color}25`
            : source
              ? `${PURPLE}20`
              : showNature && dusthana
                ? `${VERMILION}15`
                : showNature && support
                  ? `${GREEN}15`
                  : "transparent";

          const strokeColor = active
            ? placement.color
            : source
              ? `${PURPLE}99`
              : showNature && dusthana
                ? `${VERMILION}55`
                : showNature && support
                  ? `${GREEN}55`
                  : HAIRLINE;

          return (
            <g key={h}>
              <polygon
                points={NI_HOUSE_POLYGONS[h]}
                fill={polyFill}
                stroke={strokeColor}
                strokeWidth={active ? 2.5 : source ? 2 : 1}
                style={{ cursor: "pointer" }}
                onClick={() => onSelectHouse(h)}
                role="button"
                aria-pressed={active}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectHouse(h);
                  }
                }}
              />
              <text x={NI_HOUSE_CENTERS[h].x} y={NI_HOUSE_CENTERS[h].y - 4} textAnchor="middle" fill={active ? placement.color : INK_SECONDARY} fontSize="10" fontWeight="600">
                {item.name}
              </text>
              <text x={NI_HOUSE_CENTERS[h].x} y={NI_HOUSE_CENTERS[h].y + 9} textAnchor="middle" fill={INK_MUTED} fontSize="9">
                H{h}
              </text>
            </g>
          );
        })}

        {/* Active lord marker */}
        <circle cx={activeCenter.x} cy={activeCenter.y} r="14" fill={capacityState.color} stroke="#fff" strokeWidth="2.5" />
        <text x={activeCenter.x} y={activeCenter.y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
          5L
        </text>

        {/* Source house marker */}
        <circle cx={fifthCenter.x} cy={fifthCenter.y} r="8" fill="transparent" stroke={PURPLE} strokeWidth="2" strokeDasharray="4 3" />
      </svg>
    </>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

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

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
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
    fontWeight: 400,
  };
}
