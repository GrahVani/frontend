"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Compass, Eye, GitCompare, Orbit, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "lagna" | "houses" | "empty" | "karaka";
type HouseKey = "lagna" | "fifth" | "ninth" | "twelfth" | "jupiter";

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

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  lagna: {
    label: "Lagna",
    title: "Count from the D20 Lagna",
    body: "Chart S1 D20 Lagna is Gemini. Using Taurus from the D1 silently relabels every spiritual house.",
    icon: <Compass size={16} />,
    color: BLUE,
  },
  houses: {
    label: "Houses",
    title: "Read the D20 5th, 9th, and 12th",
    body: "From Gemini: Libra is the 5th, Aquarius is the 9th, and Taurus is the 12th.",
    icon: <Orbit size={16} />,
    color: GREEN,
  },
  empty: {
    label: "Empty",
    title: "Empty does not mean unreadable",
    body: "The D20 12th is empty, so read Taurus, its lord Venus, and Venus in the D20 7th.",
    icon: <Eye size={16} />,
    color: GOLD,
  },
  karaka: {
    label: "Karaka",
    title: "Read Jupiter wherever it falls",
    body: "Jupiter is a D20 karaka in the D20 4th; note it proportionately even outside the named houses.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
  },
};

const HOUSE_DATA: Record<HouseKey, { label: string; sign: string; house: string; occupants: string; reading: string; color: string }> = {
  lagna: { label: "D20 Lagna", sign: "Gemini", house: "1st", occupants: "Sun, Moon", reading: "Doubled luminaries make practice-identity central and visible.", color: BLUE },
  fifth: { label: "Mantra house", sign: "Libra", house: "5th", occupants: "Saturn", reading: "Disciplined, repeated, ascetic practice style.", color: GOLD },
  ninth: { label: "Dharma house", sign: "Aquarius", house: "9th", occupants: "Rahu, Ketu", reading: "Striking nodal dharma placement; flag it carefully, do not over-settle it.", color: PURPLE },
  twelfth: { label: "Moksha house", sign: "Taurus", house: "12th", occupants: "empty", reading: "Read through Venus, lord of Taurus, placed in the D20 7th.", color: GREEN },
  jupiter: { label: "Jupiter karaka", sign: "Virgo", house: "4th", occupants: "Jupiter", reading: "A secondary karaka fact in the foundational, heart-centered D20 4th.", color: VERMILION },
};

const ORDER = ["Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus"];

export function D20LagnaSpiritualHousesLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("lagna");
  const [houseKey, setHouseKey] = useState<HouseKey>("lagna");
  const [useD20Lagna, setUseD20Lagna] = useState(true);
  const [readEmptyTwelfth, setReadEmptyTwelfth] = useState(true);
  const [handleNodesCautiously, setHandleNodesCautiously] = useState(true);
  const [includeKarakaPlacement, setIncludeKarakaPlacement] = useState(true);

  const focus = FOCUS[focusKey];
  const house = HOUSE_DATA[houseKey];

  const status = useMemo(() => {
    if (!useD20Lagna) return { label: "wrong house anchor", color: VERMILION };
    if (!readEmptyTwelfth && houseKey === "twelfth") return { label: "empty house skipped", color: VERMILION };
    if (!handleNodesCautiously && houseKey === "ninth") return { label: "nodal 9th over-read", color: GOLD };
    if (!includeKarakaPlacement && houseKey === "jupiter") return { label: "karaka placement ignored", color: GOLD };
    return { label: "D20 house reading anchored", color: GREEN };
  }, [handleNodesCautiously, houseKey, includeKarakaPlacement, readEmptyTwelfth, useD20Lagna]);

  const reading = useMemo(() => {
    if (!useD20Lagna) return "Repair the anchor: Chart S1 D20 houses must be counted from Gemini, not Taurus.";
    if (!readEmptyTwelfth && houseKey === "twelfth") return "Read the empty 12th by sign and lord: Taurus, Venus, and Venus in Sagittarius in the D20 7th.";
    if (!handleNodesCautiously && houseKey === "ninth") return "Rahu and Ketu in the 9th is striking, but nodal dharma interpretation needs cautious language.";
    if (!includeKarakaPlacement && houseKey === "jupiter") return "Jupiter is a D20 karaka. Its placement in the 4th is a secondary but real fact.";
    return house.reading;
  }, [handleNodesCautiously, house.reading, houseKey, includeKarakaPlacement, readEmptyTwelfth, useD20Lagna]);

  return (
    <div data-interactive="d20-lagna-spiritual-houses-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D20 Lagna and spiritual houses lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Count Chart S1 spiritual houses from Gemini, not Taurus
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Anchor the D20 house map to its own Lagna, then read the 5th, 9th, 12th, empty-house lord, and Jupiter karaka placement.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("lagna"); setHouseKey("lagna"); setUseD20Lagna(true); setReadEmptyTwelfth(true); setHandleNodesCautiously(true); setIncludeKarakaPlacement(true); }} style={buttonStyle(false, BLUE)}>
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

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem" }}>
        <div style={cardStyle}>
          <HouseMapSvg house={house} status={status} useD20Lagna={useD20Lagna} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>D20 focus point</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(HOUSE_DATA) as HouseKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setHouseKey(key)} style={optionStyle(houseKey === key, HOUSE_DATA[key].color)}>
                  {HOUSE_DATA[key].label}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>reading guardrails</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Use D20 Lagna" body="Gemini is the D20 1st house, not D1 Taurus." color={BLUE} value={useD20Lagna} onToggle={() => setUseD20Lagna((value) => !value)} />
              <ToggleRow title="Read empty 12th" body="Use Taurus, Venus, and Venus's D20 placement." color={GREEN} value={readEmptyTwelfth} onToggle={() => setReadEmptyTwelfth((value) => !value)} />
              <ToggleRow title="Handle nodes cautiously" body="Flag the 9th-house nodal axis without overclaiming." color={GOLD} value={handleNodesCautiously} onToggle={() => setHandleNodesCautiously((value) => !value)} />
              <ToggleRow title="Include Jupiter karaka" body="Read Jupiter where it falls, even outside 5/9/12." color={PURPLE} value={includeKarakaPlacement} onToggle={() => setIncludeKarakaPlacement((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current D20 reading</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function HouseMapSvg({ house, status, useD20Lagna }: { house: (typeof HOUSE_DATA)[HouseKey]; status: { label: string; color: string }; useD20Lagna: boolean }) {
  return (
    <svg viewBox="0 0 760 560" role="img" aria-label="D20 house map from Gemini Lagna" style={{ width: "100%", minHeight: 560, display: "block" }}>
      <rect x="12" y="12" width="736" height="536" rx="18" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">CHART S1 D20 HOUSE MAP</text>
      <text x="380" y="78" textAnchor="middle" fill={status.color} fontSize="21" fontWeight="700">{status.label}</text>
      <text x="380" y="106" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">{useD20Lagna ? "Anchor: Gemini D20 Lagna" : "Wrong anchor: Taurus D1 Lagna"}</text>

      {ORDER.map((sign, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const x = 380 + Math.cos(angle) * 170;
        const y = 292 + Math.sin(angle) * 164;
        const active = sign === house.sign;
        return (
          <g key={sign}>
            <circle cx={x} cy={y} r={active ? 35 : 27} fill={active ? house.color : SURFACE} fillOpacity={active ? 0.18 : 1} stroke={active ? house.color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
            <text x={x} y={y - 4} textAnchor="middle" fill={active ? house.color : INK_PRIMARY} fontSize="13" fontWeight={active ? "700" : "600"}>{index + 1}</text>
            <text x={x} y={y + 15} textAnchor="middle" fill={active ? house.color : INK_SECONDARY} fontSize="11" fontWeight="600">{sign.slice(0, 3)}</text>
          </g>
        );
      })}

      <circle cx="380" cy="292" r="72" fill={house.color} fillOpacity="0.12" stroke={house.color} strokeWidth="1.5" />
      <text x="380" y="270" textAnchor="middle" fill={house.color} fontSize="15" fontWeight="700">{house.label}</text>
      <text x="380" y="298" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="600">{house.house} / {house.sign}</text>
      <text x="380" y="326" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">{house.occupants}</text>
      <text x="380" y="514" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">Read the D20 as its own chart: house labels begin from the computed D20 Lagna.</text>
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
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.65rem 0.45rem", cursor: "pointer", fontWeight: 600 };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
