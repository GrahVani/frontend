"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GitCompare, Home, Layers3, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type ThreadKey = "mars" | "venus";
type FocusKey = "presence" | "separate" | "texture" | "balance";

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

const THREADS: Record<ThreadKey, { label: string; domain: string; d1: string; d4: string; resolution: string; color: string }> = {
  mars: {
    label: "Mars thread",
    domain: "land/property",
    d1: "Exalted in D1 and occupying the 4th",
    d4: "Debilitated in Cancer in D4",
    resolution: "Theme is strong; delivery has friction, plausibly family or domestic in texture.",
    color: VERMILION,
  },
  venus: {
    label: "Venus thread",
    domain: "vehicles/comfort",
    d1: "Own-signed in D1",
    d4: "In Cancer, an enemy sign for Venus",
    resolution: "Comfort/vehicle capacity remains real, but it carries its own finer-grained friction.",
    color: PURPLE,
  },
};

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string; thread: ThreadKey }> = {
  presence: {
    label: "Presence",
    title: "D1 shows the theme; D4 qualifies delivery",
    body: "Mars is not strong or weak in one flat sense. D1 establishes presence; D4 describes texture and ease.",
    icon: <Layers3 size={16} />,
    color: BLUE,
    thread: "mars",
  },
  separate: {
    label: "Separate",
    title: "Venus is a second thread, not Mars evidence",
    body: "Venus confirms a broader pattern of D1-D4 disagreement, but it belongs to vehicles and comfort, not land.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
    thread: "venus",
  },
  texture: {
    label: "Texture",
    title: "Cancer gives a modest family-linked texture",
    body: "Mars debilitated in Cancer can suggest domestic or family friction, but only as a conservative texture.",
    icon: <Home size={16} />,
    color: GOLD,
    thread: "mars",
  },
  balance: {
    label: "Balance",
    title: "The D4 4th lord is not weak",
    body: "Moon as D4 4th lord sits in a kendra with neutral dignity, so the D4 4th is not uniformly negative.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
    thread: "mars",
  },
};

export function D4PropertyQualityComparisonLab() {
  const [threadKey, setThreadKey] = useState<ThreadKey>("mars");
  const [focusKey, setFocusKey] = useState<FocusKey>("presence");
  const [keepThreadsSeparate, setKeepThreadsSeparate] = useState(true);
  const [includeMoonLord, setIncludeMoonLord] = useState(true);
  const [hedgeTexture, setHedgeTexture] = useState(true);

  const thread = THREADS[threadKey];
  const focus = FOCUS[focusKey];

  const verdict = useMemo(() => {
    if (!keepThreadsSeparate && threadKey === "venus") return { label: "threads merged incorrectly", color: VERMILION };
    if (!includeMoonLord) return { label: "D4 lord omitted", color: GOLD };
    if (!hedgeTexture && threadKey === "mars") return { label: "texture overclaimed", color: VERMILION };
    return { label: "presence and delivery separated", color: GREEN };
  }, [hedgeTexture, includeMoonLord, keepThreadsSeparate, threadKey]);

  const reading = useMemo(() => {
    if (!keepThreadsSeparate && threadKey === "venus") return "Repair the scope: Venus is a vehicles/material-comfort thread, not extra proof for the land-specific Mars complication.";
    if (!includeMoonLord) return "Restore balance: the D4 4th lord Moon is in a kendra with neutral dignity, so the D4 is not uniformly weak.";
    if (!hedgeTexture && threadKey === "mars") return "Tone down the claim: Cancer supports family/domestic texture as a plausible flavour, not a specific prediction.";
    return `${thread.label}: ${thread.d1}; ${thread.d4}. Resolution: ${thread.resolution}`;
  }, [hedgeTexture, includeMoonLord, keepThreadsSeparate, thread.d1, thread.d4, thread.label, thread.resolution, threadKey]);

  function loadFocus(key: FocusKey) {
    setFocusKey(key);
    setThreadKey(FOCUS[key].thread);
    setKeepThreadsSeparate(true);
    setIncludeMoonLord(true);
    setHedgeTexture(true);
  }

  return (
    <div data-interactive="d4-property-quality-comparison-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D1-D4 property quality lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Resolve property strength versus delivery texture
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Compare Mars and Venus across D1 and D4, keep their domains separate, and add the D4 Moon-lord balance before concluding.
            </p>
          </div>
          <button type="button" onClick={() => { setThreadKey("mars"); setFocusKey("presence"); setKeepThreadsSeparate(true); setIncludeMoonLord(true); setHedgeTexture(true); }} style={buttonStyle(false, BLUE)}>
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
          <PropertyQualitySvg thread={thread} verdict={verdict} includeMoonLord={includeMoonLord} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>choose thread</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(THREADS) as ThreadKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setThreadKey(key)} style={optionStyle(threadKey === key, THREADS[key].color)}>
                  <span style={{ fontWeight: 600 }}>{THREADS[key].label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{THREADS[key].domain}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>resolution discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Keep threads separate" body="Do not merge Venus into the Mars/land conclusion." color={PURPLE} value={keepThreadsSeparate} onToggle={() => setKeepThreadsSeparate((value) => !value)} />
              <ToggleRow title="Include D4 Moon lord" body="Moon in a kendra keeps the D4 from becoming uniformly negative." color={GREEN} value={includeMoonLord} onToggle={() => setIncludeMoonLord((value) => !value)} />
              <ToggleRow title="Hedge Cancer texture" body="Family/domestic friction is plausible, not a precise forecast." color={GOLD} value={hedgeTexture} onToggle={() => setHedgeTexture((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}>{verdict.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>resolved reading</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PropertyQualitySvg({ thread, verdict, includeMoonLord }: { thread: (typeof THREADS)[ThreadKey]; verdict: { label: string; color: string }; includeMoonLord: boolean }) {
  return (
    <svg viewBox="0 0 760 460" role="img" aria-label="D1 and D4 property quality comparison diagram" style={{ width: "100%", minHeight: 360, display: "block" }}>
      <rect x="12" y="12" width="736" height="436" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">D1-D4 QUALITY RESOLUTION</text>
      <text x="380" y="78" textAnchor="middle" fill={thread.color} fontSize="18" fontWeight="600">{thread.label}: {thread.domain}</text>

      <rect x="82" y="130" width="250" height="110" rx="18" fill={GREEN} fillOpacity="0.1" stroke={GREEN} />
      <text x="207" y="160" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="600">D1 presence</text>
      <text x="207" y="192" textAnchor="middle" fill={INK_PRIMARY} fontSize="13">{thread.d1}</text>

      <rect x="428" y="130" width="250" height="110" rx="18" fill={thread.color} fillOpacity="0.1" stroke={thread.color} />
      <text x="553" y="160" textAnchor="middle" fill={thread.color} fontSize="13" fontWeight="600">D4 delivery</text>
      <text x="553" y="192" textAnchor="middle" fill={INK_PRIMARY} fontSize="13">{thread.d4}</text>

      <path d="M334 185 C372 150 388 150 426 185" fill="none" stroke={verdict.color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="380" cy="185" r="22" fill={verdict.color} fillOpacity="0.14" stroke={verdict.color} />
      <text x="380" y="190" textAnchor="middle" fill={verdict.color} fontSize="12" fontWeight="600">hold</text>

      <rect x="118" y="300" width="524" height="64" rx="18" fill={includeMoonLord ? BLUE : VERMILION} fillOpacity="0.1" stroke={includeMoonLord ? BLUE : VERMILION} />
      <text x="380" y="327" textAnchor="middle" fill={includeMoonLord ? BLUE : VERMILION} fontSize="13" fontWeight="600">
        {includeMoonLord ? "D4 Moon lord included: structurally sound" : "D4 Moon lord omitted: reading too negative"}
      </text>
      <text x="380" y="350" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Moon in D4 kendra with neutral dignity balances the weak occupants.</text>
      <text x="380" y="414" textAnchor="middle" fill={verdict.color} fontSize="12" fontWeight="600">{verdict.label}</text>
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
