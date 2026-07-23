"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarClock, Clock3, HeartHandshake, RotateCcw, SatelliteDish, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type ViewMode = "dba" | "twoYes" | "promise" | "window";
type PromiseMode = "promised" | "obstructed";
type StreamSupport = "aligned" | "mixed" | "divergent";

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

const MARRIAGE_SIGNIFICATORS = ["Venus", "Rahu", "Mercury"];
const RP_ROLES = [
  { role: "Day lord", planet: "Venus", color: GOLD },
  { role: "Moon sign lord", planet: "Mercury", color: GREEN },
  { role: "Moon star lord", planet: "Rahu", color: PURPLE },
  { role: "Moon sub lord", planet: "Saturn", color: BLUE },
  { role: "Asc sign lord", planet: "Venus", color: GOLD },
  { role: "Asc star lord", planet: "Mars", color: VERMILION },
];

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  dba: {
    label: "DBA",
    title: "Marriage fires in the periods of 2-7-11 significators",
    body: "The dasha, bhukti, and antara lords must be marriage significators. A busy period is not enough if it is unrelated to 2, 7, and 11.",
    icon: <Clock3 size={16} />,
    color: GREEN,
  },
  twoYes: {
    label: "Two yes",
    title: "DBA opens the window; ruling planets and transit confirm",
    body: "KP wants a second yes from the live ruling planets and a relevant transit before the timing call becomes confident.",
    icon: <BadgeCheck size={16} />,
    color: BLUE,
  },
  promise: {
    label: "Promise",
    title: "Timing only fires what the 7th CSL promised",
    body: "A promised CSL can time cleanly. An obstructed CSL gives later, qualified, or non-standard timing rather than a forced clean window.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
  window: {
    label: "Window",
    title: "State a span of likelihood, not an exact date",
    body: "A sub-period plus RP and transit narrows the span. It still remains a window that informs with agency, not a single decreed date.",
    icon: <CalendarClock size={16} />,
    color: GOLD,
  },
};

export function KpMarriageSignificatorDashaWindow() {
  const [viewMode, setViewMode] = useState<ViewMode>("twoYes");
  const [promiseMode, setPromiseMode] = useState<PromiseMode>("promised");
  const [dashaWindow, setDashaWindow] = useState(true);
  const [rpConfirmation, setRpConfirmation] = useState(true);
  const [transitTrigger, setTransitTrigger] = useState(true);
  const [otherStreams, setOtherStreams] = useState<StreamSupport>("aligned");
  const [kpSettings, setKpSettings] = useState(true);
  const [windowLanguage, setWindowLanguage] = useState(true);
  const [forceExactDate, setForceExactDate] = useState(false);

  const promised = promiseMode === "promised";
  const twoYes = promised && dashaWindow && rpConfirmation && transitTrigger && kpSettings && windowLanguage && !forceExactDate;
  const warning = !kpSettings || forceExactDate || (!promised && dashaWindow) || (!dashaWindow && rpConfirmation);
  const score = Math.max(
    5,
    Math.min(
      98,
      14 +
        (promised ? 18 : -18) +
        (dashaWindow ? 26 : -8) +
        (rpConfirmation ? 18 : -4) +
        (transitTrigger ? 14 : -4) +
        streamScore(otherStreams) +
        (kpSettings ? 8 : -28) +
        (windowLanguage ? 8 : -20) -
        (forceExactDate ? 30 : 0),
    ),
  );

  const verdict = useMemo(() => {
    if (!kpSettings) return "invalid setup";
    if (forceExactDate || !windowLanguage) return "false precision warning";
    if (!promised && dashaWindow) return "qualified or later timing";
    if (twoYes) return "strong likelihood window";
    if (promised && !dashaWindow) return "promised but not ripe";
    if (dashaWindow && (!rpConfirmation || !transitTrigger)) return "partial timing signal";
    return "not a marriage window";
  }, [dashaWindow, forceExactDate, kpSettings, promised, rpConfirmation, transitTrigger, twoYes, windowLanguage]);

  const statement = useMemo(() => {
    if (!kpSettings) return "Pause: KP timing depends on correct stellar dasha, ruling-planet, and cusp settings.";
    if (forceExactDate || !windowLanguage) return "Pause: this is becoming false precision. State a sub-period or narrowed span of likelihood, never a single decreed date.";
    if (!promised) return "The 7th CSL shows obstruction or delay, so do not force a clean marriage date. If timing appears, frame it as later, qualified, or through the non-standard path indicated by the promise.";
    if (!dashaWindow) return "Marriage is promised, but the running DBA lords are not 2-7-11 significators. The promise is not ripe in this window.";
    if (!rpConfirmation) return "The DBA window is open, but the ruling planets do not repeat the marriage significators. Treat this as incomplete confirmation.";
    if (!transitTrigger) return "The DBA and ruling planets support the window, but transit is not yet confirming. Keep the window open but modest.";
    return `The 7th CSL promise is supported, the running DBA belongs to ${MARRIAGE_SIGNIFICATORS.join(", ")}, and ruling planets plus transit confirm. State a strong marriage window of likelihood, then compare the ${otherStreams} timing from the other streams.`;
  }, [dashaWindow, forceExactDate, kpSettings, otherStreams, promised, rpConfirmation, transitTrigger, windowLanguage]);

  return (
    <div data-interactive="kp-marriage-significator-dasha-window" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP marriage timing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Find the 2-7-11 DBA window, then confirm it</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Time marriage through significator dasha, ruling planets, and transit while keeping promise-before-timing and window language intact.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("twoYes");
              setPromiseMode("promised");
              setDashaWindow(true);
              setRpConfirmation(true);
              setTransitTrigger(true);
              setOtherStreams("aligned");
              setKpSettings(true);
              setWindowLanguage(true);
              setForceExactDate(false);
            }}
            style={buttonStyle(false, PURPLE)}
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
              <p style={eyebrowStyle}>Timing verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdictColor(verdict), fontSize: "1.2rem" }}>{verdict}</h3>
            </div>
            <strong style={{ color: verdictColor(verdict) }}>{score}% timing signal</strong>
          </div>
          <MarriageTimingSvg promised={promised} dashaWindow={dashaWindow} rpConfirmation={rpConfirmation} transitTrigger={transitTrigger} twoYes={twoYes} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="DBA lords" body={dashaWindow ? "Venus / Rahu / Mercury" : "Jupiter / Saturn / Mars"} color={dashaWindow ? GREEN : VERMILION} icon={<Clock3 size={16} />} />
            <MiniFact title="RPs" body={rpConfirmation ? "repeat agents" : "no repeat"} color={rpConfirmation ? GREEN : GOLD} icon={<SatelliteDish size={16} />} />
            <MiniFact title="Transit" body={transitTrigger ? "confirms" : "waiting"} color={transitTrigger ? GREEN : GOLD} icon={<Sparkles size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Promise condition" icon={<ShieldCheck size={18} />} color={promised ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={promiseMode === "promised"} onClick={() => setPromiseMode("promised")} style={buttonStyle(promiseMode === "promised", GREEN)}>
                CSL promised
              </button>
              <button type="button" aria-pressed={promiseMode === "obstructed"} onClick={() => setPromiseMode("obstructed")} style={buttonStyle(promiseMode === "obstructed", GOLD)}>
                CSL obstructed
              </button>
            </div>
            <p style={bodyTextStyle}>{promised ? "Timing can fire the supported marriage promise." : "Timing must be later, qualified, or non-standard; never forced cleanly."}</p>
          </Panel>

          <Panel title="Ruling planets of the moment" icon={<SatelliteDish size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {RP_ROLES.map((item) => {
                const match = rpConfirmation && MARRIAGE_SIGNIFICATORS.includes(item.planet);
                return (
                  <div key={item.role} style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${match ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.55rem", background: match ? `${GREEN}10` : "transparent" }}>
                    <span style={{ color: INK_MUTED, fontSize: "0.82rem", fontWeight: 600 }}>{item.role}</span>
                    <strong style={{ color: match ? GREEN : item.color, fontWeight: 700 }}>{item.planet}</strong>
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Two-yes switches</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={dashaWindow} color={dashaWindow ? GREEN : VERMILION} icon={<Clock3 size={18} />} title="DBA of 2-7-11 significators" body={dashaWindow ? "Running lords can deliver marriage." : "Running lords are unrelated to 2-7-11."} onClick={() => setDashaWindow((value) => !value)} />
            <Toggle active={rpConfirmation} color={rpConfirmation ? GREEN : GOLD} icon={<SatelliteDish size={18} />} title="Ruling planets confirm" body={rpConfirmation ? "RPs repeat the marriage significators." : "RPs do not repeat the timing agents."} onClick={() => setRpConfirmation((value) => !value)} />
            <Toggle active={transitTrigger} color={transitTrigger ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Transit supports" body={transitTrigger ? "Transit activates the 7th or significators." : "Transit confirmation is not present."} onClick={() => setTransitTrigger((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Discipline guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Segmented label="Other streams timing" value={otherStreams} options={[["aligned", "Aligned"], ["mixed", "Mixed"], ["divergent", "Divergent"]]} colors={{ aligned: GREEN, mixed: GOLD, divergent: VERMILION }} onChange={(value) => setOtherStreams(value as StreamSupport)} />
            <Toggle active={kpSettings} color={kpSettings ? GREEN : VERMILION} icon={<Scale size={18} />} title="KP timing settings valid" body={kpSettings ? "Stellar dasha and RP context are valid." : "Wrong settings can invalidate the window."} onClick={() => setKpSettings((value) => !value)} />
            <Toggle active={windowLanguage} color={windowLanguage ? GREEN : VERMILION} icon={<CalendarClock size={18} />} title="Window language" body={windowLanguage ? "State a span of likelihood." : "The statement is losing window discipline."} onClick={() => setWindowLanguage((value) => !value)} />
            <Toggle active={forceExactDate} color={forceExactDate ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Force exact date" body={forceExactDate ? "Error active: a single date is being decreed." : "No false-precision date."} onClick={() => setForceExactDate((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdictColor(verdict)}66`, background: `${verdictColor(verdict)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {warning ? <TriangleAlert size={20} color={verdictColor(verdict)} aria-hidden="true" /> : <HeartHandshake size={20} color={verdictColor(verdict)} aria-hidden="true" />}
          <div>
            <p style={eyebrowStyle}>KP timing statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: verdictColor(verdict), fontSize: "1.16rem" }}>{verdict}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MarriageTimingSvg({ promised, dashaWindow, rpConfirmation, transitTrigger, twoYes }: { promised: boolean; dashaWindow: boolean; rpConfirmation: boolean; transitTrigger: boolean; twoYes: boolean }) {
  const finalColor = twoYes ? GREEN : promised ? GOLD : VERMILION;
  return (
    <svg viewBox="0 0 780 500" role="img" aria-label="KP marriage timing DBA ruling planets and transit two yes diagram" style={{ width: "100%", minHeight: 390, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="464" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 206 140 L 238 140 M 388 140 L 420 140 M 570 140 L 602 140" stroke={finalColor} strokeWidth="5" strokeDasharray={twoYes ? "0" : "8 8"} />
      <path d="M 292 194 C 306 260, 338 292, 358 302" fill="none" stroke={dashaWindow ? GREEN : HAIRLINE} strokeWidth="4" />
      <path d="M 474 194 C 460 260, 436 292, 414 302" fill="none" stroke={rpConfirmation ? GREEN : HAIRLINE} strokeWidth="4" />
      <Stage x={110} y={140} title="CSL promise" body={promised ? "2-7-11 supports" : "obstructed"} color={promised ? GREEN : GOLD} active={promised} />
      <Stage x={292} y={140} title="DBA window" body={dashaWindow ? "2-7-11 lords" : "unrelated lords"} color={dashaWindow ? GREEN : VERMILION} active={dashaWindow} />
      <Stage x={474} y={140} title="Ruling planets" body={rpConfirmation ? "repeat agents" : "no repeat"} color={rpConfirmation ? GREEN : GOLD} active={rpConfirmation} />
      <Stage x={656} y={140} title="Transit" body={transitTrigger ? "activates" : "waiting"} color={transitTrigger ? GREEN : GOLD} active={transitTrigger} />
      <circle cx="390" cy="340" r="72" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="4" />
      <text x="390" y="330" textAnchor="middle" fill={finalColor} fontSize="18" fontWeight="700">{twoYes ? "LIKELY WINDOW" : "QUALIFY"}</text>
      <text x="390" y="362" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight="600">window, not exact date</text>
    </svg>
  );
}

function Stage({ x, y, title, body, color, active }: { x: number; y: number; title: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <rect x={x - 78} y={y - 54} width="156" height="108" rx="8" fill={active ? OPAQUE_LIGHT_FILL[color] : "transparent"} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <circle cx={x} cy={y - 24} r="18" fill={active ? color : "transparent"} stroke={color} strokeWidth="2.5" />
      <text x={x} y={y - 17} textAnchor="middle" fill={active ? "#fff" : color} fontSize="15" fontWeight="700">{active ? "Y" : "-"}</text>
      <text x={x} y={y + 13} textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="700">{title}</text>
      <text x={x} y={y + 39} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">{body}</text>
    </g>
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

function streamScore(support: StreamSupport): number {
  if (support === "aligned") return 10;
  if (support === "mixed") return 4;
  return -6;
}

function verdictColor(verdict: string): string {
  if (verdict === "strong likelihood window") return GREEN;
  if (verdict === "promised but not ripe") return GOLD;
  if (verdict === "partial timing signal") return GOLD;
  if (verdict === "qualified or later timing") return GOLD;
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
