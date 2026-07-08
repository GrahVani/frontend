"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GitCompare, Leaf, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "voices" | "placement" | "saturn" | "score";
type KarakaKey = "jupiter" | "ketu" | "saturn" | "all";

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
  voices: {
    label: "Voices",
    title: "Three voices, not one score",
    body: "Jupiter, Ketu, and Saturn describe wisdom, detachment, and discipline as separate registers.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  placement: {
    label: "Placement",
    title: "Read house and dignity together",
    body: "House placement shows where the register expresses; dignity shows how smoothly or strongly it operates.",
    icon: <Scale size={16} />,
    color: GREEN,
  },
  saturn: {
    label: "Saturn",
    title: "Saturn is added with its basis shown",
    body: "Saturn extends Chapter 1's ascetic register into D20 practice; it is not an unlinked new karaka claim.",
    icon: <ShieldCheck size={16} />,
    color: GOLD,
  },
  score: {
    label: "No Score",
    title: "Decline the combined spirituality score",
    body: "The overlay reports strongest and quieter voices; it never averages spiritual registers into one number.",
    icon: <Leaf size={16} />,
    color: PURPLE,
  },
};

const KARAKAS: Record<Exclude<KarakaKey, "all">, { label: string; register: string; sign: string; house: string; dignity: string; reading: string; color: string }> = {
  jupiter: {
    label: "Jupiter",
    register: "wisdom / dharma",
    sign: "Virgo",
    house: "D20 4th",
    dignity: "enemy sign",
    reading: "Wisdom and guru-guidance reach the D20 foundation house, but Mercury's sign adds friction to smooth access.",
    color: BLUE,
  },
  ketu: {
    label: "Ketu",
    register: "natural detachment",
    sign: "Aquarius",
    house: "D20 9th",
    dignity: "no dignity claim",
    reading: "Ketu sits with the nodal axis on dharma: striking and mystic, but interpreted with cautious language.",
    color: PURPLE,
  },
  saturn: {
    label: "Saturn",
    register: "disciplined renunciation",
    sign: "Libra",
    house: "D20 5th",
    dignity: "exalted",
    reading: "The strongest overlay signal: disciplined practice is dignified in the mantra and upasana house.",
    color: GOLD,
  },
};

export function D20SpiritualKarakasOverlayLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("voices");
  const [karakaKey, setKarakaKey] = useState<KarakaKey>("all");
  const [keepVoicesSeparate, setKeepVoicesSeparate] = useState(true);
  const [showSaturnBasis, setShowSaturnBasis] = useState(true);
  const [readHouseAndDignity, setReadHouseAndDignity] = useState(true);
  const [avoidErasure, setAvoidErasure] = useState(true);

  const focus = FOCUS[focusKey];
  const selected = karakaKey === "all" ? null : KARAKAS[karakaKey];

  const status = useMemo(() => {
    if (!keepVoicesSeparate) return { label: "single-score flattening", color: VERMILION };
    if (!showSaturnBasis) return { label: "Saturn basis hidden", color: GOLD };
    if (!readHouseAndDignity) return { label: "half-reading warning", color: VERMILION };
    if (!avoidErasure) return { label: "difficult placement over-erased", color: GOLD };
    return { label: "three-karaka overlay ready", color: GREEN };
  }, [avoidErasure, keepVoicesSeparate, readHouseAndDignity, showSaturnBasis]);

  const reading = useMemo(() => {
    if (!keepVoicesSeparate) return "Do not average wisdom, detachment, and discipline into one spirituality score. Report the three voices separately.";
    if (!showSaturnBasis) return "State Saturn's basis: it extends the ascetic register already established in Lesson 12.1.4.";
    if (!readHouseAndDignity) return "Read both facts together. A house without dignity, or dignity without house, gives only half the overlay.";
    if (!avoidErasure) return "A difficult house or dignity complicates a register; it does not erase that register.";
    if (selected) return selected.reading;
    return "Chart S1 overlay: Jupiter has wisdom with friction, Ketu marks mystic dharma, and exalted Saturn in the D20 5th is the strongest practice signal.";
  }, [avoidErasure, keepVoicesSeparate, readHouseAndDignity, selected, showSaturnBasis]);

  return (
    <div data-interactive="d20-spiritual-karakas-overlay-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D20 spiritual karakas overlay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Read Jupiter, Ketu, and Saturn as three distinct spiritual registers
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Compare placement and dignity side by side, keep the added Saturn basis visible, and refuse a combined spirituality score.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("voices"); setKarakaKey("all"); setKeepVoicesSeparate(true); setShowSaturnBasis(true); setReadHouseAndDignity(true); setAvoidErasure(true); }} style={buttonStyle(false, BLUE)}>
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
          <OverlaySvg activeKey={karakaKey} status={status} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>karaka voice</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.5rem" }}>
              <button type="button" onClick={() => setKarakaKey("all")} style={optionStyle(karakaKey === "all", GREEN)}>All</button>
              {(Object.keys(KARAKAS) as Array<Exclude<KarakaKey, "all">>).map((key) => (
                <button key={key} type="button" onClick={() => setKarakaKey(key)} style={optionStyle(karakaKey === key, KARAKAS[key].color)}>
                  {KARAKAS[key].label}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>overlay guardrails</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Keep voices separate" body="Wisdom, detachment, and discipline are not averaged." color={BLUE} value={keepVoicesSeparate} onToggle={() => setKeepVoicesSeparate((value) => !value)} />
              <ToggleRow title="Show Saturn basis" body="Saturn extends the Chapter 1 ascetic register." color={GOLD} value={showSaturnBasis} onToggle={() => setShowSaturnBasis((value) => !value)} />
              <ToggleRow title="House plus dignity" body="Placement and dignity must be read together." color={GREEN} value={readHouseAndDignity} onToggle={() => setReadHouseAndDignity((value) => !value)} />
              <ToggleRow title="Do not erase difficulty" body="A difficult placement complicates a register; it does not remove it." color={PURPLE} value={avoidErasure} onToggle={() => setAvoidErasure((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current overlay reading</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function OverlaySvg({ activeKey, status }: { activeKey: KarakaKey; status: { label: string; color: string } }) {
  const entries = Object.entries(KARAKAS) as Array<[Exclude<KarakaKey, "all">, (typeof KARAKAS)[Exclude<KarakaKey, "all">]]>;
  return (
    <svg viewBox="0 0 820 500" role="img" aria-label="D20 Jupiter Ketu Saturn spiritual karakas overlay" style={{ width: "100%", minHeight: 390, display: "block" }}>
      <rect x="12" y="12" width="796" height="476" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">D20 THREE-KARAKA OVERLAY</text>
      <text x="410" y="78" textAnchor="middle" fill={status.color} fontSize="18" fontWeight="600">{status.label}</text>

      {entries.map(([key, karaka], index) => {
        const x = 160 + index * 250;
        const active = activeKey === "all" || activeKey === key;
        return (
          <g key={key} opacity={active ? 1 : 0.35}>
            <circle cx={x} cy="210" r={active ? 72 : 62} fill={karaka.color} fillOpacity="0.12" stroke={karaka.color} strokeWidth="3" />
            <text x={x} y="178" textAnchor="middle" fill={karaka.color} fontSize="15" fontWeight="600">{karaka.label}</text>
            <text x={x} y="205" textAnchor="middle" fill={INK_PRIMARY} fontSize="12">{karaka.register}</text>
            <text x={x} y="231" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{karaka.house} / {karaka.sign}</text>
            <text x={x} y="253" textAnchor="middle" fill={karaka.color} fontSize="11" fontWeight="600">{karaka.dignity}</text>
          </g>
        );
      })}

      <path d="M160 320 C270 372 550 372 660 320" fill="none" stroke={status.color} strokeWidth="4" strokeLinecap="round" />
      <rect x="238" y="368" width="344" height="54" rx="14" fill={status.color} fillOpacity="0.1" stroke={status.color} />
      <text x="410" y="401" textAnchor="middle" fill={status.color} fontSize="12" fontWeight="600">report strongest voice; do not compute a score</text>
      <text x="410" y="456" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Chart S1 strongest overlay signal: exalted Saturn in the D20 5th.</text>
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
