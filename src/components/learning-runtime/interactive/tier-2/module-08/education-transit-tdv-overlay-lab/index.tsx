"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CalendarDays, CheckCircle2, GitMerge, Orbit, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";

type TransitSignKey = "capricorn" | "virgo" | "scorpio";
type FocusKey = "workflow" | "moon" | "vedha" | "tdv";

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

const TRANSITS: Record<TransitSignKey, { label: string; moonPosition: string; lagnaHit: string; vedhaPoint: string; color: string; favourable: boolean; directFifth: boolean }> = {
  capricorn: {
    label: "Jupiter in Capricorn",
    moonPosition: "7th from natal Moon in Cancer",
    lagnaHit: "directly occupies the natal 5th house from Virgo Lagna",
    vedhaPoint: "3rd from Moon: Virgo",
    color: GREEN,
    favourable: true,
    directFifth: true,
  },
  virgo: {
    label: "Jupiter in Virgo",
    moonPosition: "3rd from natal Moon in Cancer",
    lagnaHit: "occupies Lagna, not the exam house",
    vedhaPoint: "not a favourable Jupiter position in this lesson check",
    color: VERMILION,
    favourable: false,
    directFifth: false,
  },
  scorpio: {
    label: "Jupiter in Scorpio",
    moonPosition: "5th from natal Moon in Cancer",
    lagnaHit: "occupies the 3rd from Virgo Lagna",
    vedhaPoint: "4th from Moon: Libra",
    color: GOLD,
    favourable: true,
    directFifth: false,
  },
};

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  workflow: {
    label: "8 steps",
    title: "Run the full transit workflow",
    body: "Question, transit, Moon, Lagna, natal planet, vedha, dasha, then two-yes. Skipping steps weakens the reading.",
    icon: <GitMerge size={16} />,
    color: BLUE,
  },
  moon: {
    label: "Moon table",
    title: "Jupiter must be favourable from the Moon",
    body: "For Jupiter, 2, 5, 7, 9, and 11 from the Moon are favourable positions. Capricorn is 7th from Cancer.",
    icon: <Orbit size={16} />,
    color: GREEN,
  },
  vedha: {
    label: "Vedha",
    title: "Favourable still needs unobstructed",
    body: "The Capricorn example uses Jupiter's 7th-from-Moon result and checks its vedha point, the 3rd from Moon.",
    icon: <ShieldCheck size={16} />,
    color: GOLD,
  },
  tdv: {
    label: "T-D-V",
    title: "Dasha window, transit trigger, vedha filter",
    body: "The lesson previews T-D-V: Transit plus Dasha plus Vedha, with dasha not optional.",
    icon: <CalendarDays size={16} />,
    color: PURPLE,
  },
};

export function EducationTransitTdvOverlayLab() {
  const [transitKey, setTransitKey] = useState<TransitSignKey>("capricorn");
  const [focusKey, setFocusKey] = useState<FocusKey>("workflow");
  const [vedhaClear, setVedhaClear] = useState(true);
  const [insideDashaWindow, setInsideDashaWindow] = useState(true);
  const [treatAsIllustration, setTreatAsIllustration] = useState(true);

  const transit = TRANSITS[transitKey];
  const focus = FOCUS[focusKey];

  const indicatorScore = useMemo(() => {
    return Math.max(
      8,
      Math.min(
        96,
        20 +
          (transit.favourable ? 18 : -12) +
          (transit.directFifth ? 18 : -6) +
          (vedhaClear ? 18 : -22) +
          (insideDashaWindow ? 14 : -18) +
          (treatAsIllustration ? 8 : -18),
      ),
    );
  }, [insideDashaWindow, transit.directFifth, transit.favourable, treatAsIllustration, vedhaClear]);

  const verdict = useMemo(() => {
    if (!treatAsIllustration) return { label: "live prediction overreach", color: VERMILION };
    if (!insideDashaWindow) return { label: "transit read in isolation", color: VERMILION };
    if (!vedhaClear) return { label: "favourable transit obstructed", color: GOLD };
    if (transit.favourable && transit.directFifth) return { label: "T-D-V support confirmed", color: GREEN };
    if (transit.favourable) return { label: "partial transit support", color: GOLD };
    return { label: "Moon-table support missing", color: VERMILION };
  }, [insideDashaWindow, transit.directFifth, transit.favourable, treatAsIllustration, vedhaClear]);

  const reading = useMemo(() => {
    if (!treatAsIllustration) return "Repair the frame: this lesson's transit is stipulated for method training, not a real calendar-date prediction.";
    if (!insideDashaWindow) return "Step 7 is missing. A transit trigger needs the already-established Venus dasha window behind it.";
    if (!vedhaClear) return "The Moon-table result cannot stand cleanly until the vedha point is clear.";
    return `${transit.label}: ${transit.moonPosition}; ${transit.lagnaHit}; vedha check is ${transit.vedhaPoint}.`;
  }, [insideDashaWindow, transit.label, transit.lagnaHit, transit.moonPosition, transit.vedhaPoint, treatAsIllustration, vedhaClear]);

  return (
    <div data-interactive="education-transit-tdv-overlay-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>education transit overlay lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Use transit as the trigger, not the whole prediction
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Walk the stipulated Jupiter transit through Moon favourability, Lagna relevance, vedha, dasha cross-reference, and the two-yes check.
            </p>
          </div>
          <button type="button" onClick={() => { setTransitKey("capricorn"); setFocusKey("workflow"); setVedhaClear(true); setInsideDashaWindow(true); setTreatAsIllustration(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <TransitOverlaySvg transit={transit} verdict={verdict} score={indicatorScore} vedhaClear={vedhaClear} insideDashaWindow={insideDashaWindow} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>stipulated transit</p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.keys(TRANSITS) as TransitSignKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setTransitKey(key)} style={optionStyle(transitKey === key, TRANSITS[key].color)}>
                  <span style={{ fontWeight: 600 }}>{TRANSITS[key].label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{TRANSITS[key].moonPosition}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>T-D-V discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Vedha clear" body="No planet blocks the relevant vedha point." color={GOLD} value={vedhaClear} onToggle={() => setVedhaClear((value) => !value)} />
              <ToggleRow title="Inside Venus dasha" body="Transit is cross-referenced with the active dasha window." color={GREEN} value={insideDashaWindow} onToggle={() => setInsideDashaWindow((value) => !value)} />
              <ToggleRow title="Treat as illustration" body="This stipulated transit teaches method, not a real-date prediction." color={VERMILION} value={treatAsIllustration} onToggle={() => setTreatAsIllustration((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}>{verdict.color === GREEN ? <CheckCircle2 size={18} aria-hidden="true" /> : <TriangleAlert size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current transit reading</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TransitOverlaySvg({
  transit,
  verdict,
  score,
  vedhaClear,
  insideDashaWindow,
}: {
  transit: (typeof TRANSITS)[TransitSignKey];
  verdict: { label: string; color: string };
  score: number;
  vedhaClear: boolean;
  insideDashaWindow: boolean;
}) {
  const steps = [
    { label: "Moon", active: transit.favourable, color: GREEN },
    { label: "Lagna", active: transit.directFifth, color: BLUE },
    { label: "Vedha", active: vedhaClear, color: GOLD },
    { label: "Dasha", active: insideDashaWindow, color: PURPLE },
  ];

  return (
    <svg viewBox="0 0 640 500" role="img" aria-label="Transit dasha vedha overlay diagram" style={{ width: "100%", minHeight: 420, display: "block" }}>
      <rect x="12" y="12" width="616" height="476" rx="18" fill={SURFACE} stroke={HAIRLINE} />
      <text x="320" y="54" textAnchor="middle" fill={GOLD} fontSize="17" fontWeight="700">TRANSIT + DASHA + VEDHA</text>
      <text x="320" y="88" textAnchor="middle" fill={transit.color} fontSize="22" fontWeight="700">{transit.label}</text>

      <circle cx="120" cy="205" r="62" fill={BLUE} fillOpacity="0.1" stroke={BLUE} />
      <text x="120" y="199" textAnchor="middle" fill={BLUE} fontSize="15" fontWeight="700">Moon</text>
      <text x="120" y="222" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{transit.moonPosition}</text>

      <circle cx="320" cy="205" r="62" fill={GOLD} fillOpacity="0.1" stroke={GOLD} />
      <text x="320" y="199" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">Transit</text>
      <text x="320" y="222" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">stipulated input</text>

      <circle cx="520" cy="205" r="62" fill={PURPLE} fillOpacity="0.1" stroke={PURPLE} />
      <text x="520" y="199" textAnchor="middle" fill={PURPLE} fontSize="15" fontWeight="700">Dasha</text>
      <text x="520" y="222" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{insideDashaWindow ? "Venus window" : "not checked"}</text>

      <path d="M184 205 L256 205" stroke={verdict.color} strokeWidth="4" strokeLinecap="round" />
      <path d="M384 205 L456 205" stroke={verdict.color} strokeWidth="4" strokeLinecap="round" />

      {steps.map((step, index) => {
        const x = 116 + index * 136;
        return (
          <g key={step.label}>
            <rect x={x - 56} y="318" width="112" height="64" rx="14" fill={step.active ? step.color : SURFACE} fillOpacity={step.active ? "0.13" : "1"} stroke={step.active ? step.color : HAIRLINE} />
            <text x={x} y="344" textAnchor="middle" fill={step.active ? step.color : INK_SECONDARY} fontSize="14" fontWeight="700">{step.label}</text>
            <text x={x} y="367" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{step.active ? "yes" : "no"}</text>
          </g>
        );
      })}

      <text x="320" y="432" textAnchor="middle" fill={verdict.color} fontSize="15" fontWeight="700">{verdict.label}</text>
      <text x="320" y="458" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">Indicator strength: {score}%</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function optionStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
