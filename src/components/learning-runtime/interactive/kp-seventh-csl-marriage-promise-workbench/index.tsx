"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, HeartHandshake, RotateCcw, Scale, Settings2, ShieldCheck, SlidersHorizontal, TriangleAlert, UsersRound } from "lucide-react";

type HouseNumber = 1 | 2 | 5 | 6 | 7 | 10 | 11;
type StreamSupport = "strong" | "mixed" | "stressed";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const SUPPORTIVE = [2, 7, 11] as HouseNumber[];
const OBSTRUCTING = [1, 6, 10] as HouseNumber[];
const HOUSE_META: Record<HouseNumber, { label: string; color: string; group: "support" | "obstruction" | "context"; note: string }> = {
  1: { label: "1 self", color: VERMILION, group: "obstruction", note: "opposes 7th; self over partnership" },
  2: { label: "2 family", color: GREEN, group: "support", note: "addition to family" },
  5: { label: "5 romance", color: GOLD, group: "context", note: "colour; not the promise-test core" },
  6: { label: "6 disputes", color: VERMILION, group: "obstruction", note: "separation, contest, service pressure" },
  7: { label: "7 spouse", color: PURPLE, group: "support", note: "marriage and partnership" },
  10: { label: "10 status", color: VERMILION, group: "obstruction", note: "opposes domestic settlement" },
  11: { label: "11 fulfilment", color: GREEN, group: "support", note: "desire fulfilled, gains" },
};

const PRESETS = {
  promised: { label: "2 / 7 / 11", houses: [2, 7, 11] as HouseNumber[], color: GREEN },
  obstructed: { label: "1 / 6 / 10", houses: [1, 6, 10] as HouseNumber[], color: VERMILION },
  mixed: { label: "2 / 6 / 11", houses: [2, 6, 11] as HouseNumber[], color: GOLD },
  romance: { label: "5 / 7 / 11", houses: [5, 7, 11] as HouseNumber[], color: BLUE },
};

export function KpSeventhCslMarriagePromiseWorkbench() {
  const [selectedHouses, setSelectedHouses] = useState<HouseNumber[]>([2, 7, 11]);
  const [otherStreams, setOtherStreams] = useState<StreamSupport>("strong");
  const [kpSettings, setKpSettings] = useState(true);
  const [starLordLogic, setStarLordLogic] = useState(true);
  const [layerMode, setLayerMode] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);
  const [technicalDenial, setTechnicalDenial] = useState(true);
  const [timingDeferred, setTimingDeferred] = useState(true);

  const supportiveCount = selectedHouses.filter((house) => SUPPORTIVE.includes(house)).length;
  const obstructingCount = selectedHouses.filter((house) => OBSTRUCTING.includes(house)).length;
  const hasSupport = supportiveCount > 0;
  const hasObstruction = obstructingCount > 0;
  const methodOk = kpSettings && starLordLogic && layerMode && agencyFrame && technicalDenial && timingDeferred;
  const verdict = useMemo(() => {
    if (!methodOk) return "method warning";
    if (hasSupport && !hasObstruction) return "marriage promised";
    if (!hasSupport && hasObstruction) return "obstruction or delay";
    if (hasSupport && hasObstruction) return "qualified promise";
    return "insufficient core signal";
  }, [hasObstruction, hasSupport, methodOk]);
  const converges = (verdict === "marriage promised" && otherStreams === "strong") || (verdict === "qualified promise" && otherStreams !== "stressed") || (verdict === "obstruction or delay" && otherStreams === "stressed");
  const score = Math.max(
    5,
    Math.min(
      98,
      28 +
        supportiveCount * 15 -
        obstructingCount * 10 +
        supportScore(otherStreams) +
        (converges ? 10 : -8) +
        (methodOk ? 16 : -34),
    ),
  );

  const statement = useMemo(() => {
    const houses = selectedHouses.length ? selectedHouses.join(", ") : "none";
    if (!kpSettings) return "Pause: the 7th CSL must be calculated in the proper KP cusp context before the promise-test is trusted.";
    if (!starLordLogic) return "Pause: KP significations must come through the star-lord and the planet's own placement or ownership, not a Parashari sign-lord shortcut.";
    if (!layerMode) return "Pause: this is becoming a standalone KP verdict. Combine the 7th CSL with Parashari, Venus, and Jaimini streams.";
    if (!technicalDenial) return "Pause: technical denial is being stated as permanent denial. Restore obstruction, delay, or non-standard path language.";
    if (!agencyFrame) return "Pause: the client-facing statement needs agency and care, never fear.";
    if (!timingDeferred) return "Pause: promise and timing are distinct. A promised verdict still needs significator dasha timing later.";
    if (verdict === "marriage promised") return `The 7th CSL signifies ${houses}, so the KP register promises marriage. Because the other streams are ${otherStreams}, state convergence or qualification without replacing them.`;
    if (verdict === "qualified promise") return `The 7th CSL mixes support and obstruction through ${houses}. Read this as marriage with delay, qualification, or conditions to manage, then compare the other streams.`;
    if (verdict === "obstruction or delay") return `The 7th CSL emphasizes ${houses}, so KP points to obstruction, delay, or a non-standard path. This is not a "never marry" decree; it is one stream to weigh.`;
    return "The selected houses do not include the core KP marriage promise groups strongly enough. Recheck the CSL significations and supporting streams.";
  }, [agencyFrame, kpSettings, layerMode, otherStreams, selectedHouses, starLordLogic, technicalDenial, timingDeferred, verdict]);

  return (
    <div data-interactive="kp-seventh-csl-marriage-promise-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP 7th cuspal sub-lord</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Test the marriage promise without cruelty</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Classify the 7th CSL&apos;s signified houses into supportive 2-7-11, obstructing 1-6-10, or mixed, then combine KP with the other marriage streams.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedHouses([2, 7, 11]);
              setOtherStreams("strong");
              setKpSettings(true);
              setStarLordLogic(true);
              setLayerMode(true);
              setAgencyFrame(true);
              setTechnicalDenial(true);
              setTimingDeferred(true);
            }}
            style={buttonStyle(false, PURPLE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Promise-test verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdictColor(verdict), fontSize: "1.2rem" }}>{verdict}</h3>
            </div>
            <strong style={{ color: verdictColor(verdict) }}>{Math.round(score)}% KP signal</strong>
          </div>
          <CslMarriageSvg selectedHouses={selectedHouses} verdict={verdict} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Supportive" body={`${supportiveCount} of 2/7/11`} color={GREEN} icon={<HeartHandshake size={16} />} />
            <MiniFact title="Obstructing" body={`${obstructingCount} of 1/6/10`} color={obstructingCount ? VERMILION : GREEN} icon={<TriangleAlert size={16} />} />
            <MiniFact title="Streams" body={converges ? "converge" : "diverge"} color={converges ? GREEN : GOLD} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Worked presets" icon={<SlidersHorizontal size={18} />} color={verdictColor(verdict)}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((key) => (
                <button key={key} type="button" onClick={() => setSelectedHouses(PRESETS[key].houses)} style={buttonStyle(false, PRESETS[key].color)}>
                  {PRESETS[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>Use presets to see promised, obstruction, mixed, and romance-colour cases.</p>
          </Panel>

          <Panel title="Other streams" icon={<GitCompare size={18} />} color={supportColor(otherStreams)}>
            <Segmented label="Parashari / Venus / Jaimini" value={otherStreams} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setOtherStreams(value as StreamSupport)} />
            <MiniFact title="Rule" body="KP is decisive inside KP, but corroborating in the full curriculum." color={BLUE} icon={<Scale size={16} />} />
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>7th CSL signified houses</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {([1, 2, 5, 6, 7, 10, 11] as HouseNumber[]).map((house) => {
            const active = selectedHouses.includes(house);
            const meta = HOUSE_META[house];
            return (
              <button
                key={house}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedHouses((current) => current.includes(house) ? current.filter((item) => item !== house) : [...current, house].sort((a, b) => a - b))}
                style={houseButtonStyle(active, meta.color)}
              >
                <span style={{ display: "block", fontWeight: 700 }}>{meta.label}</span>
                <span style={{ display: "block", marginTop: "0.35rem", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.35 }}>{meta.note}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={kpSettings} color={kpSettings ? GREEN : VERMILION} icon={<Settings2 size={18} />} title="KP cusp context valid" body={kpSettings ? "7th CSL is computed in KP terms." : "Cusp/sub-lord setup is unreliable."} onClick={() => setKpSettings((value) => !value)} />
            <Toggle active={starLordLogic} color={starLordLogic ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Star-lord significations used" body={starLordLogic ? "Star-lord plus own placement/ownership." : "Sign-lord shortcut is being used."} onClick={() => setStarLordLogic((value) => !value)} />
            <Toggle active={timingDeferred} color={timingDeferred ? GREEN : VERMILION} icon={<Scale size={18} />} title="Promise distinct from timing" body={timingDeferred ? "Timing is deferred to significator dashas." : "Promise and timing are being collapsed."} onClick={() => setTimingDeferred((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={layerMode} color={layerMode ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Corroborating stream" body={layerMode ? "KP is combined with other marriage layers." : "KP is overriding all other streams."} onClick={() => setLayerMode((value) => !value)} />
            <Toggle active={technicalDenial} color={technicalDenial ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Denial is technical" body={technicalDenial ? "Means obstruction, delay, or non-standard path." : "Being phrased as permanent denial."} onClick={() => setTechnicalDenial((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<UsersRound size={18} />} title="Agency language" body={agencyFrame ? "Informs and equips without fear." : "Statement is becoming cruel or final."} onClick={() => setAgencyFrame((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdictColor(verdict)}66`, background: `${verdictColor(verdict)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodOk ? <ShieldCheck size={20} color={verdictColor(verdict)} aria-hidden="true" /> : <TriangleAlert size={20} color={verdictColor(verdict)} aria-hidden="true" />}
          <div>
            <p style={eyebrowStyle}>Client-safe KP statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: verdictColor(verdict), fontSize: "1.16rem" }}>{verdict}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CslMarriageSvg({ selectedHouses, verdict }: { selectedHouses: HouseNumber[]; verdict: string }) {
  const color = verdictColor(verdict);
  const houses: HouseNumber[] = selectedHouses.length ? selectedHouses : [7];
  return (
    <svg viewBox="0 0 780 390" role="img" aria-label="KP 7th cuspal sub-lord marriage promise diagram" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 186 148 C 232 94, 286 94, 322 148" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M 442 148 C 500 92, 540 92, 573 86" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M 442 148 C 500 206, 540 206, 573 196" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="132" cy="148" r="54" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="4" />
      <text x="132" y="138" textAnchor="middle" fill={PURPLE} fontSize="17" fontWeight="700">7th cusp</text>
      <text x="132" y="164" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">marriage</text>
      <circle cx="382" cy="148" r="60" fill={OPAQUE_LIGHT_FILL[color]} stroke={color} strokeWidth="5" />
      <text x="382" y="138" textAnchor="middle" fill={color} fontSize="18" fontWeight="700">CSL</text>
      <text x="382" y="165" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="700">promise-test</text>
      {houses.slice(0, 7).map((house, index) => {
        const meta = HOUSE_META[house];
        const x = 595 + (index % 2) * 58;
        const y = 86 + Math.floor(index / 2) * 55;
        return (
          <g key={`${house}-${index}`}>
            <circle cx={x} cy={y} r="24" fill={OPAQUE_LIGHT_FILL[meta.color]} stroke={meta.color} strokeWidth="3" />
            <text x={x} y={y + 6} textAnchor="middle" fill={meta.color} fontSize="16" fontWeight="700">{house}</text>
          </g>
        );
      })}
      <rect x="214" y="300" width="352" height="38" rx="8" fill={OPAQUE_LIGHT_FILL[color]} stroke={color} />
      <text x="390" y="326" textAnchor="middle" fill={color} fontSize="16" fontWeight="700">{verdict.toUpperCase()}</text>
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
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
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

function supportScore(support: StreamSupport): number {
  if (support === "strong") return 22;
  if (support === "mixed") return 14;
  return 6;
}

function supportColor(support: StreamSupport): string {
  if (support === "strong") return GREEN;
  if (support === "mixed") return GOLD;
  return VERMILION;
}

function verdictColor(verdict: string): string {
  if (verdict === "marriage promised") return GREEN;
  if (verdict === "qualified promise") return GOLD;
  if (verdict === "obstruction or delay") return GOLD;
  if (verdict === "insufficient core signal") return BLUE;
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
    fontWeight: 700,
    cursor: "pointer",
  };
}

function houseButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    textAlign: "left",
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
