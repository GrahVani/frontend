"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, Sun, TriangleAlert } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type ViewMode = "targets" | "benefics" | "malefics" | "net";
type AspectKey = "jupiter" | "venus" | "mercury" | "moon" | "mars" | "saturn" | "nodes" | "sun";

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

const ASPECTS: Record<AspectKey, { label: string; type: "benefic" | "malefic"; note: string; color: string }> = {
  jupiter: { label: "Jupiter", type: "benefic", note: "Classically protective; the strongest marriage reassurance when real.", color: GREEN },
  venus: { label: "Venus", type: "benefic", note: "Kalatra-karaka support, refinement, and relational ease.", color: PURPLE },
  mercury: { label: "Mercury", type: "benefic", note: "Communication and flexibility in partnership.", color: BLUE },
  moon: { label: "Waxing Moon", type: "benefic", note: "Emotional ease and responsiveness.", color: GREEN },
  mars: { label: "Mars", type: "malefic", note: "Heat, friction, assertiveness; manage conflict, do not decree war.", color: VERMILION },
  saturn: { label: "Saturn", type: "malefic", note: "Delay, maturity, duty, seriousness; patience, not doom.", color: GOLD },
  nodes: { label: "Nodes", type: "malefic", note: "Unconventionality, foreignness, confusion, or karmic intensity.", color: PURPLE },
  sun: { label: "Sun", type: "malefic", note: "Ego or separation themes; karaka-pollution is refined next lesson.", color: VERMILION },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  targets: {
    label: "Targets",
    title: "Check both the 7th house and the 7th lord",
    body: "Aspects on either target modify the marriage register. Missing the lord is the classic incomplete tally.",
    icon: <CircleDot size={16} />,
    color: BLUE,
  },
  benefics: {
    label: "Benefics",
    title: "Jupiter protection is a real mitigating factor",
    body: "Jupiter, Venus, Mercury, and a waxing Moon can support and protect the marriage indication.",
    icon: <Sparkles size={16} />,
    color: GREEN,
  },
  malefics: {
    label: "Malefics",
    title: "Stress is an area of attention, not doom",
    body: "Mars, Saturn, nodes, and Sun can indicate friction, delay, unconventionality, or ego themes. They do not decree a bad marriage alone.",
    icon: <TriangleAlert size={16} />,
    color: VERMILION,
  },
  net: {
    label: "Net",
    title: "Report the net, not the scariest single aspect",
    body: "Tally benefic and malefic influences on both targets, then state a qualified net indication with honest reassurance where protection is real.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
};

export function SeventhAspectNetWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("net");
  const [houseTarget, setHouseTarget] = useState(true);
  const [lordTarget, setLordTarget] = useState(true);
  const [activeAspects, setActiveAspects] = useState<Record<AspectKey, boolean>>({
    jupiter: true,
    venus: false,
    mercury: false,
    moon: false,
    mars: true,
    saturn: false,
    nodes: false,
    sun: false,
  });
  const [doomAvoided, setDoomAvoided] = useState(true);
  const [honestReassurance, setHonestReassurance] = useState(true);

  const checkedTargets = (houseTarget ? 1 : 0) + (lordTarget ? 1 : 0);
  const beneficCount = (Object.keys(activeAspects) as AspectKey[]).filter((key) => activeAspects[key] && ASPECTS[key].type === "benefic").length;
  const maleficCount = (Object.keys(activeAspects) as AspectKey[]).filter((key) => activeAspects[key] && ASPECTS[key].type === "malefic").length;
  const jupiterProtects = activeAspects.jupiter;
  const methodOk = checkedTargets === 2 && doomAvoided && (jupiterProtects || !honestReassurance);
  const score = Math.max(5, Math.min(98, 48 + beneficCount * 14 - maleficCount * 10 + (jupiterProtects ? 18 : 0) + (checkedTargets === 2 ? 10 : -18) + (doomAvoided ? 8 : -24) + (honestReassurance ? 4 : -8)));

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (beneficCount > maleficCount) return "supportive net";
    if (beneficCount === maleficCount) return "qualified mixed net";
    return jupiterProtects ? "stress with protection" : "care-needed net";
  }, [beneficCount, jupiterProtects, maleficCount, methodOk]);

  const interpretation = useMemo(() => {
    if (checkedTargets < 2) return "The tally is incomplete: aspects on both the 7th house and the 7th lord must be checked before concluding.";
    if (!doomAvoided) return "Pause: a malefic aspect is being treated as a verdict. Restore the lesson frame: friction, delay, or unconventionality are areas of attention.";
    if (honestReassurance && !jupiterProtects) return "Do not reassure by inventing protection. Reassurance is ethical only when a real benefic factor, especially Jupiter, is present.";
    if (jupiterProtects && maleficCount > 0) return "Net reading: there is real stress to manage, but Jupiter's protective aspect materially softens it. This supports honest reassurance: workable, protected, with a theme to attend to.";
    if (beneficCount > maleficCount) return "Net reading: benefic influences predominate, so the marriage register is supported. Still state it as a graded indication.";
    if (maleficCount > beneficCount) return "Net reading: malefic influences predominate, so name a care-needed theme. Do not leap to doom; ask what dignity, Venus, and later layers say.";
    return "Net reading: mixed. Report both sides, qualify confidence, and avoid selecting only the scary or comforting factor.";
  }, [beneficCount, checkedTargets, doomAvoided, honestReassurance, jupiterProtects, maleficCount]);

  const toggleAspect = (key: AspectKey) => setActiveAspects((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div data-interactive="seventh-aspect-net-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>7th-aspect net workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Tally both targets, then read the net</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Toggle benefic and malefic aspects on the 7th house and lord, surface Jupiter&apos;s protection, and keep stress inside a non-doom frame.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("net");
              setHouseTarget(true);
              setLordTarget(true);
              setActiveAspects({ jupiter: true, venus: false, mercury: false, moon: false, mars: true, saturn: false, nodes: false, sun: false });
              setDoomAvoided(true);
              setHonestReassurance(true);
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
              <p style={eyebrowStyle}>Net indication</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier), fontWeight: 600 }}>{score}% support</strong>
          </div>
          <AspectNetSvg houseTarget={houseTarget} lordTarget={lordTarget} beneficCount={beneficCount} maleficCount={maleficCount} jupiterProtects={jupiterProtects} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Targets" body={`${checkedTargets}/2 checked`} color={checkedTargets === 2 ? GREEN : VERMILION} icon={<CircleDot size={16} />} />
            <MiniFact title="Benefic" body={`${beneficCount} active`} color={GREEN} icon={<Sparkles size={16} />} />
            <MiniFact title="Malefic" body={`${maleficCount} active`} color={maleficCount > 0 ? GOLD : GREEN} icon={<TriangleAlert size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Aspect targets" icon={<Orbit size={18} />} color={checkedTargets === 2 ? GREEN : VERMILION}>
            <Toggle active={houseTarget} color={houseTarget ? GREEN : VERMILION} icon={<CircleDot size={18} />} title="7th house checked" body={houseTarget ? "Aspects on the marriage house are counted." : "The house target is missing."} onClick={() => setHouseTarget((value) => !value)} />
            <Toggle active={lordTarget} color={lordTarget ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="7th lord checked" body={lordTarget ? "Aspects on the lord wherever it sits are counted." : "The lord target is missing."} onClick={() => setLordTarget((value) => !value)} />
          </Panel>

          <Panel title="Benefic aspects" icon={<Sparkles size={18} />} color={GREEN}>
            <AspectButton aspectKey="jupiter" active={activeAspects.jupiter} onClick={toggleAspect} />
            <AspectButton aspectKey="venus" active={activeAspects.venus} onClick={toggleAspect} />
            <AspectButton aspectKey="mercury" active={activeAspects.mercury} onClick={toggleAspect} />
            <AspectButton aspectKey="moon" active={activeAspects.moon} onClick={toggleAspect} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Malefic aspects as care themes</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
            <AspectButton aspectKey="mars" active={activeAspects.mars} onClick={toggleAspect} />
            <AspectButton aspectKey="saturn" active={activeAspects.saturn} onClick={toggleAspect} />
            <AspectButton aspectKey="nodes" active={activeAspects.nodes} onClick={toggleAspect} />
            <AspectButton aspectKey="sun" active={activeAspects.sun} onClick={toggleAspect} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical reassurance</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={doomAvoided} color={doomAvoided ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Doom leap refused" body={doomAvoided ? "Malefics are named as friction/delay/care themes." : "A malefic is being treated as verdict."} onClick={() => setDoomAvoided((value) => !value)} />
            <Toggle active={honestReassurance} color={honestReassurance ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Reassure only if real" body={honestReassurance ? "Jupiter protection is cited only when present." : "No reassurance claim is made."} onClick={() => setHonestReassurance((value) => !value)} />
            <div style={{ border: `1px solid ${jupiterProtects ? GREEN : HAIRLINE}`, borderRadius: 8, background: jupiterProtects ? `${GREEN}10` : "transparent", padding: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: jupiterProtects ? GREEN : INK_MUTED }}>
                <Sun size={18} aria-hidden="true" />
                <strong style={{ fontWeight: 600 }}>{jupiterProtects ? "Jupiter protection present" : "No Jupiter protection selected"}</strong>
              </div>
              <p style={bodyTextStyle}>{jupiterProtects ? "This is a real mitigating factor. It can honestly soften fear from a malefic aspect." : "Do not invent protection to comfort the client."}</p>
            </div>
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <Scale size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Net reading statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{interpretation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AspectNetSvg({ houseTarget, lordTarget, beneficCount, maleficCount, jupiterProtects, methodOk }: { houseTarget: boolean; lordTarget: boolean; beneficCount: number; maleficCount: number; jupiterProtects: boolean; methodOk: boolean }) {
  const finalColor = !methodOk ? VERMILION : beneficCount >= maleficCount ? GREEN : GOLD;
  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Net aspects on the 7th house and 7th lord" style={diagramSvgStyle}>
      <rect x="18" y="18" width="724" height="374" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 112 86 C 156 44, 206 45, 250 86" stroke={GREEN} strokeWidth={beneficCount > 0 ? 5 : 1.5} fill="none" strokeDasharray={beneficCount > 0 ? "0" : "6 8"} />
      <text x="181" y="48" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="600">benefic {beneficCount}</text>
      <path d="M 648 86 C 604 44, 554 45, 510 86" stroke={VERMILION} strokeWidth={maleficCount > 0 ? 5 : 1.5} fill="none" strokeDasharray={maleficCount > 0 ? "0" : "6 8"} />
      <text x="579" y="48" textAnchor="middle" fill={VERMILION} fontSize="15" fontWeight="600">malefic {maleficCount}</text>
      <path d="M 288 190 L 336 230 M 472 190 L 424 230" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="6 8" />
      <circle cx="240" cy="145" r="60" fill={houseTarget ? OPAQUE_LIGHT_FILL[BLUE] : "transparent"} stroke={houseTarget ? BLUE : HAIRLINE} strokeWidth={houseTarget ? 3 : 1.5} />
      <text x="240" y="140" textAnchor="middle" fill={houseTarget ? BLUE : INK_MUTED} fontSize="17" fontWeight="600">7th house</text>
      <text x="240" y="164" textAnchor="middle" fill={INK_MUTED} fontSize="13">{houseTarget ? "target counted" : "missing"}</text>
      <circle cx="520" cy="145" r="60" fill={lordTarget ? OPAQUE_LIGHT_FILL[PURPLE] : "transparent"} stroke={lordTarget ? PURPLE : HAIRLINE} strokeWidth={lordTarget ? 3 : 1.5} />
      <text x="520" y="140" textAnchor="middle" fill={lordTarget ? PURPLE : INK_MUTED} fontSize="17" fontWeight="600">7th lord</text>
      <text x="520" y="164" textAnchor="middle" fill={INK_MUTED} fontSize="13">{lordTarget ? "target counted" : "missing"}</text>
      <circle cx="380" cy="286" r="52" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="380" y="280" textAnchor="middle" fill={finalColor} fontSize="18" fontWeight="600">{methodOk ? "NET" : "CHECK"}</text>
      <text x="380" y="303" textAnchor="middle" fill={INK_MUTED} fontSize="13">{jupiterProtects ? "Jupiter protects" : "no Jupiter selected"}</text>
      <rect x="90" y="374" width="580" height="34" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="396" textAnchor="middle" fill={INK_MUTED} fontSize="14">Tally both sides on both targets. Report the net.</text>
    </svg>
  );
}

function AspectButton({ aspectKey, active, onClick }: { aspectKey: AspectKey; active: boolean; onClick: (key: AspectKey) => void }) {
  const aspect = ASPECTS[aspectKey];
  return (
    <button type="button" aria-pressed={active} onClick={() => onClick(aspectKey)} style={toggleStyle(active, aspect.color)}>
      <span style={{ color: aspect.color }}>{aspect.type === "benefic" ? <Sparkles size={18} /> : <TriangleAlert size={18} />}</span>
      <span>
        <strong style={{ fontWeight: 600 }}>{aspect.label}</strong>
        <span>{aspect.note}</span>
      </span>
    </button>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
};

const diagramSvgStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  margin: "0.7rem 0",
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
  if (tier === "supportive net") return GREEN;
  if (tier === "qualified mixed net") return BLUE;
  if (tier === "stress with protection") return GOLD;
  if (tier === "care-needed net") return GOLD;
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
