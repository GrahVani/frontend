"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CalendarClock, GitBranch, RotateCcw, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

type WindowKey = "mercuryBirth" | "ketuVenus" | "venusMd" | "venusMercury";
type FocusKey = "presence" | "workflow" | "sarasvati" | "twoYes";

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

const WINDOWS: Record<
  WindowKey,
  {
    label: string;
    range: string;
    start: number;
    end: number;
    lordLine: string;
    signal: string;
    practicalUse: string;
    color: string;
    yogaPlanets: string[];
    twoYes: boolean;
  }
> = {
  mercuryBirth: {
    label: "Mercury MD",
    range: "age 0 to 9.5625",
    start: 0,
    end: 9.5625,
    lordLine: "Mercury mahadasha from birth",
    signal: "Sarasvati yoga planet at the mahadasha level.",
    practicalUse: "Strong for early learning aptitude, less decisive for field-of-study choice.",
    color: BLUE,
    yogaPlanets: ["Mercury"],
    twoYes: false,
  },
  ketuVenus: {
    label: "Ketu/Venus",
    range: "age 9.9708 to 11.1375",
    start: 9.9708,
    end: 11.1375,
    lordLine: "Ketu MD with Venus AD",
    signal: "9th-house occupant plus 9th-house owner/sub-lord/significator.",
    practicalUse: "Clean two-yes window for higher-learning inclination becoming visible.",
    color: GREEN,
    yogaPlanets: ["Venus"],
    twoYes: true,
  },
  venusMd: {
    label: "Venus MD",
    range: "age 16.5625 to 36.5625",
    start: 16.5625,
    end: 36.5625,
    lordLine: "Venus mahadasha",
    signal: "Sarasvati yoga planet and KP education carrier.",
    practicalUse: "Decision-relevant window for late adolescence, study direction, and career launch.",
    color: GOLD,
    yogaPlanets: ["Venus"],
    twoYes: true,
  },
  venusMercury: {
    label: "Venus/Mercury",
    range: "age 32.5625 to 35.3958",
    start: 32.5625,
    end: 35.3958,
    lordLine: "Mercury AD inside Venus MD",
    signal: "Two Sarasvati yoga planets active in sequence.",
    practicalUse: "Later learning-arts refinement or specialization window.",
    color: PURPLE,
    yogaPlanets: ["Venus", "Mercury"],
    twoYes: true,
  },
};

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string; window: WindowKey }> = {
  presence: {
    label: "Presence",
    title: "Presence is not timing",
    body: "Chapters 1-4 establish strong education promise; dasha asks when that promise becomes active.",
    icon: <TimerReset size={16} />,
    color: BLUE,
    window: "mercuryBirth",
  },
  workflow: {
    label: "Workflow",
    title: "Use the six-step event workflow",
    body: "Domain, active lords, MD disposition, AD disposition, overlays, then the two-yes reliability bar.",
    icon: <GitBranch size={16} />,
    color: GOLD,
    window: "venusMd",
  },
  sarasvati: {
    label: "Sarasvati",
    title: "Yoga planets mark firing windows",
    body: "Mercury, Jupiter, and Venus are the Sarasvati planets. Their dasha and bhukti windows carry the yoga.",
    icon: <CalendarClock size={16} />,
    color: PURPLE,
    window: "venusMercury",
  },
  twoYes: {
    label: "Two-yes",
    title: "Ketu and Venus clear the 9th-house bar",
    body: "Ketu as occupant and Venus as owner/sub-lord/significator are independent indicators active together.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
    window: "ketuVenus",
  },
};

export function EducationDashaTimingWindowLab() {
  const [windowKey, setWindowKey] = useState<WindowKey>("ketuVenus");
  const [focusKey, setFocusKey] = useState<FocusKey>("twoYes");
  const [separatePresenceTiming, setSeparatePresenceTiming] = useState(true);
  const [checkAllYogaPlanets, setCheckAllYogaPlanets] = useState(true);
  const [requireTwoYes, setRequireTwoYes] = useState(true);

  const activeWindow = WINDOWS[windowKey];
  const focus = FOCUS[focusKey];

  const readiness = useMemo(() => {
    const base = activeWindow.twoYes ? 42 : 26;
    return Math.max(8, Math.min(96, base + (separatePresenceTiming ? 18 : -22) + (checkAllYogaPlanets ? 18 : -12) + (requireTwoYes ? 18 : -18)));
  }, [activeWindow.twoYes, checkAllYogaPlanets, requireTwoYes, separatePresenceTiming]);

  const verdict = useMemo(() => {
    if (!separatePresenceTiming) return { label: "presence mistaken for timing", color: VERMILION };
    if (!checkAllYogaPlanets) return { label: "incomplete yoga scan", color: GOLD };
    if (!requireTwoYes) return { label: "two-yes bar skipped", color: VERMILION };
    if (activeWindow.twoYes) return { label: "timing claim supported", color: GREEN };
    return { label: "real window, limited use", color: GOLD };
  }, [activeWindow.twoYes, checkAllYogaPlanets, requireTwoYes, separatePresenceTiming]);

  const reading = useMemo(() => {
    if (!separatePresenceTiming) return "Repair the method: a strong education configuration is present from birth, but timing needs the running dasha and bhukti.";
    if (!checkAllYogaPlanets) return "Scan all Sarasvati planets: Mercury, Jupiter, and Venus. Do not stop at the first match.";
    if (!requireTwoYes) return "Apply the reliability bar before a prediction. One indicator is a clue; two independent indicators can support a timing call.";
    return `${activeWindow.label} (${activeWindow.range}) shows ${activeWindow.signal} ${activeWindow.practicalUse}`;
  }, [activeWindow.label, activeWindow.practicalUse, activeWindow.range, activeWindow.signal, checkAllYogaPlanets, requireTwoYes, separatePresenceTiming]);

  function loadFocus(key: FocusKey) {
    setFocusKey(key);
    setWindowKey(FOCUS[key].window);
    setSeparatePresenceTiming(true);
    setCheckAllYogaPlanets(true);
    setRequireTwoYes(true);
  }

  return (
    <div data-interactive="education-dasha-timing-window-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>education dasha timing lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Turn education promise into timing windows
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Separate chart presence from timing, scan Sarasvati-yoga planets, and test the Ketu/Venus 9th-house two-yes window.
            </p>
          </div>
          <button type="button" onClick={() => { setWindowKey("ketuVenus"); setFocusKey("twoYes"); setSeparatePresenceTiming(true); setCheckAllYogaPlanets(true); setRequireTwoYes(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => loadFocus(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <DashaTimingSvg activeKey={windowKey} verdict={verdict} readiness={readiness} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>choose timing window</p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.keys(WINDOWS) as WindowKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setWindowKey(key)} style={windowStyle(windowKey === key, WINDOWS[key].color)}>
                  <span style={{ fontWeight: 600 }}>{WINDOWS[key].label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{WINDOWS[key].range}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>timing discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Separate presence and timing" body="Strong promise still needs a running period." color={BLUE} value={separatePresenceTiming} onToggle={() => setSeparatePresenceTiming((value) => !value)} />
              <ToggleRow title="Check all yoga planets" body="Scan Mercury, Jupiter, and Venus before ranking windows." color={PURPLE} value={checkAllYogaPlanets} onToggle={() => setCheckAllYogaPlanets((value) => !value)} />
              <ToggleRow title="Require two-yes" body="Use independent indicators before committing to timing." color={GREEN} value={requireTwoYes} onToggle={() => setRequireTwoYes((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}><Sparkles size={18} aria-hidden="true" /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current timing reading</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{activeWindow.lordLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashaTimingSvg({ activeKey, verdict, readiness }: { activeKey: WindowKey; verdict: { label: string; color: string }; readiness: number }) {
  const minAge = 0;
  const maxAge = 36.5625;
  const toX = (age: number) => 86 + ((age - minAge) / (maxAge - minAge)) * 588;

  return (
    <svg viewBox="0 0 760 460" role="img" aria-label="Education dasha timing windows diagram" style={{ width: "100%", minHeight: 360, display: "block" }}>
      <rect x="12" y="12" width="736" height="436" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">CHART E1 EDUCATION DASHA WINDOWS</text>
      <text x="380" y="78" textAnchor="middle" fill={verdict.color} fontSize="18" fontWeight="600">{verdict.label}</text>
      <line x1="86" y1="220" x2="674" y2="220" stroke={HAIRLINE} strokeWidth="3" />
      {[0, 9.5625, 16.5625, 36.5625].map((age) => (
        <g key={age}>
          <line x1={toX(age)} y1="207" x2={toX(age)} y2="233" stroke={INK_MUTED} />
          <text x={toX(age)} y="256" textAnchor="middle" fill={INK_MUTED} fontSize="11">{age.toFixed(age === 0 ? 0 : 2)}</text>
        </g>
      ))}
      {(Object.keys(WINDOWS) as WindowKey[]).map((key, index) => {
        const item = WINDOWS[key];
        const active = key === activeKey;
        const x = toX(item.start);
        const width = Math.max(14, toX(item.end) - toX(item.start));
        const y = 130 + index * 38;
        return (
          <g key={key}>
            <rect x={x} y={y} width={width} height="24" rx="8" fill={item.color} fillOpacity={active ? "0.28" : "0.1"} stroke={active ? item.color : HAIRLINE} />
            <text x={x + width / 2} y={y - 7} textAnchor="middle" fill={active ? item.color : INK_MUTED} fontSize="11" fontWeight="600">{item.label}</text>
          </g>
        );
      })}
      <rect x="106" y="300" width="548" height="68" rx="18" fill={verdict.color} fillOpacity="0.1" stroke={verdict.color} />
      <text x="380" y="328" textAnchor="middle" fill={verdict.color} fontSize="13" fontWeight="600">Timing discipline: {readiness}%</text>
      <text x="380" y="353" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Mercury, Jupiter, Venus define Sarasvati-yoga firing checks; Ketu/Venus clears the 9th-house two-yes.</text>
      <text x="380" y="414" textAnchor="middle" fill={INK_MUTED} fontSize="11">Age axis: birth through Venus mahadasha span</text>
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

function windowStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
