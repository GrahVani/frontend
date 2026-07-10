"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Info,
  RefreshCcw,
  ShieldCheck,
  Swords,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type Dignity = "strong" | "mixed" | "weak";
type Role = "second" | "seventh" | "eighth";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORDS: Record<number, PlanetKey> = {
  0: "mars", 1: "venus", 2: "mercury", 3: "moon", 4: "sun", 5: "mercury",
  6: "venus", 7: "mars", 8: "jupiter", 9: "saturn", 10: "saturn", 11: "jupiter",
};

const PLANET_INFO: Record<PlanetKey, { label: string; color: string; nature: "benefic" | "malefic" }> = {
  sun: { label: "Sun", color: VERMILION, nature: "malefic" },
  moon: { label: "Moon", color: BLUE, nature: "benefic" },
  mars: { label: "Mars", color: VERMILION, nature: "malefic" },
  mercury: { label: "Mercury", color: GREEN, nature: "benefic" },
  jupiter: { label: "Jupiter", color: GREEN, nature: "benefic" },
  venus: { label: "Venus", color: GOLD, nature: "benefic" },
  saturn: { label: "Saturn", color: PURPLE, nature: "malefic" },
};

const DIGNITY_SCORE: Record<Dignity, number> = { strong: -1, mixed: 0, weak: 1 };
const NATURE_SCORE = { benefic: -1, malefic: 1 };
const DUSTHANA_SCORE = 2;

interface LordState {
  dignity: Dignity;
  dusthana: boolean;
  neechaBhanga?: boolean;
}

const MISTAKES = [
  {
    label: "Stopping at house-lord identification without applying severity factors",
    wrong: "A learner names the 2nd/7th lords and treats identification as complete, without checking dignity, affliction, or dusthāna-lord association.",
    right: "Treat the table as step one of five — always continue through natural character, dignity, dusthāna association, and the 8th-lord check.",
  },
  {
    label: "Missing a planet's overlapping roles",
    wrong: "A planet that rules both a maraka house and the 8th house is analysed only once, under a single role.",
    right: "After the initial lookup, explicitly check whether any single planet appears in more than one of the 2nd/7th/8th lord slots.",
  },
  {
    label: "Reading an unamplified maraka picture as a guarantee",
    wrong: "A chart with no severity amplification is read as proof that nothing concerning could occur.",
    right: "An unamplified finding is real, positive information for internal synthesis — never a guarantee, and never disclosed as one.",
  },
];

function getLords(lagna: number) {
  return {
    second: { sign: (lagna + 1) % 12, lord: SIGN_LORDS[(lagna + 1) % 12] },
    seventh: { sign: (lagna + 6) % 12, lord: SIGN_LORDS[(lagna + 6) % 12] },
    eighth: { sign: (lagna + 7) % 12, lord: SIGN_LORDS[(lagna + 7) % 12] },
  };
}

export function MarakaIdentificationWorkbench() {
  const [lagna, setLagna] = useState<number>(2);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});
  const [states, setStates] = useState<Record<Role, LordState>>({
    second: { dignity: "strong", dusthana: false },
    seventh: { dignity: "strong", dusthana: false },
    eighth: { dignity: "weak", dusthana: false, neechaBhanga: true },
  });

  const lords = useMemo(() => getLords(lagna), [lagna]);

  const applyPreset = (preset: "chart-h1" | "cancer" | "libra") => {
    if (preset === "chart-h1") {
      setLagna(2);
      setStates({
        second: { dignity: "strong", dusthana: false },
        seventh: { dignity: "strong", dusthana: false },
        eighth: { dignity: "weak", dusthana: false, neechaBhanga: true },
      });
    } else if (preset === "cancer") {
      setLagna(3);
      setStates({
        second: { dignity: "mixed", dusthana: false },
        seventh: { dignity: "mixed", dusthana: false },
        eighth: { dignity: "mixed", dusthana: false },
      });
    } else {
      setLagna(6);
      setStates({
        second: { dignity: "mixed", dusthana: false },
        seventh: { dignity: "mixed", dusthana: false },
        eighth: { dignity: "mixed", dusthana: false },
      });
    }
  };

  const reset = () => {
    setLagna(2);
    setStates({
      second: { dignity: "strong", dusthana: false },
      seventh: { dignity: "strong", dusthana: false },
      eighth: { dignity: "weak", dusthana: false, neechaBhanga: true },
    });
    setOpenMistakes({});
  };

  const updateState = (role: Role, patch: Partial<LordState>) =>
    setStates((prev) => ({ ...prev, [role]: { ...prev[role], ...patch } }));

  const sameLord = lords.second.lord === lords.seventh.lord;
  const overlapSecondEighth = lords.second.lord === lords.eighth.lord;
  const overlapSeventhEighth = lords.seventh.lord === lords.eighth.lord;

  const verdicts = (["second", "seventh", "eighth"] as Role[]).map((role) => {
    const lord = lords[role].lord;
    const state = states[role];
    let score = NATURE_SCORE[PLANET_INFO[lord].nature] + DIGNITY_SCORE[state.dignity];
    if (state.dusthana) score += DUSTHANA_SCORE;
    if (state.dignity === "weak" && state.neechaBhanga) score -= 1;
    return { role, lord, score };
  });

  const totalScore = verdicts.reduce((sum, v) => sum + v.score, 0);
  const verdictLabel =
    totalScore <= -2 ? "Unamplified / mild" : totalScore <= 1 ? "Moderately amplified" : "Sharply amplified";
  const verdictColor = totalScore <= -2 ? GREEN : totalScore <= 1 ? GOLD : VERMILION;

  const toggleMistake = (index: number) => setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div data-interactive="maraka-identification-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Maraka identification workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Identify 2nd/7th lords, then apply the severity factors
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              Lookup is only step one. Natural character, dignity, dusthāna-lord association, and overlapping roles complete the picture.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Twelve-lagna reference</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            2nd, 7th, and 8th house lords
          </h3>
          <div style={{ maxHeight: 320, overflowY: "auto", border: `1px solid ${HAIRLINE}`, borderRadius: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead style={{ position: "sticky", top: 0, background: SURFACE }}>
                <tr style={{ color: INK_MUTED, borderBottom: `1px solid ${HAIRLINE}` }}>
                  <th style={{ textAlign: "left", padding: "0.5rem", fontWeight: 600 }}>Lagna</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", fontWeight: 600 }}>2nd</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", fontWeight: 600 }}>7th</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", fontWeight: 600 }}>8th</th>
                </tr>
              </thead>
              <tbody>
                {SIGNS.map((s, i) => {
                  const row = getLords(i);
                  const same = row.second.lord === row.seventh.lord;
                  const isSelected = i === lagna;
                  return (
                    <tr
                      key={s}
                      onClick={() => setLagna(i)}
                      style={{
                        cursor: "pointer",
                        borderBottom: `1px solid ${HAIRLINE}`,
                        background: isSelected ? `${BLUE}10` : same ? `${PURPLE}08` : "transparent",
                      }}
                    >
                      <td style={{ padding: "0.5rem", fontWeight: isSelected ? 600 : 400, color: isSelected ? BLUE : INK_PRIMARY }}>{s}</td>
                      <td style={{ padding: "0.5rem", color: same ? PURPLE : INK_SECONDARY }}>
                        {PLANET_INFO[row.second.lord].label} {same && <span style={{ color: PURPLE, fontSize: "0.7rem" }}>(cancelled)</span>}
                      </td>
                      <td style={{ padding: "0.5rem", color: same ? PURPLE : INK_SECONDARY }}>{PLANET_INFO[row.seventh.lord].label}</td>
                      <td style={{ padding: "0.5rem", color: INK_SECONDARY }}>{PLANET_INFO[row.eighth.lord].label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Selected lagna</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            {SIGNS[lagna]} lagna
          </h3>
          <LagnaWheel lagna={lagna} />
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <LordBadge role="2nd house" sign={lords.second.sign} lord={lords.second.lord} primary />
            <LordBadge role="7th house" sign={lords.seventh.sign} lord={lords.seventh.lord} primary />
            <LordBadge role="8th house" sign={lords.eighth.sign} lord={lords.eighth.lord} />
          </div>
          {sameLord && (
            <div style={{ marginTop: "0.75rem", padding: "0.6rem", borderRadius: 6, background: `${PURPLE}10`, border: `1px solid ${PURPLE}55`, color: PURPLE, fontWeight: 500 }}>
              Dwi-Maraka Na Maraka: {PLANET_INFO[lords.second.lord].label} rules both 2nd and 7th — maraka potency cancelled.
            </div>
          )}
          {(overlapSecondEighth || overlapSeventhEighth) && !sameLord && (
            <div style={{ marginTop: "0.75rem", padding: "0.6rem", borderRadius: 6, background: `${GOLD}10`, border: `1px solid ${GOLD}55`, color: GOLD, fontWeight: 500 }}>
              Overlap detected: {overlapSecondEighth && `${PLANET_INFO[lords.second.lord].label} rules both 2nd and 8th`} {overlapSecondEighth && overlapSeventhEighth && "; "} {overlapSeventhEighth && `${PLANET_INFO[lords.seventh.lord].label} rules both 7th and 8th`}. This is a secondary amplification.
            </div>
          )}
        </section>
      </div>

      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Severity inspector</p>
            <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
              Apply the three amplifying factors
            </h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" onClick={() => applyPreset("chart-h1")} style={presetButtonStyle(BLUE)}>
              Chart H1
            </button>
            <button type="button" onClick={() => applyPreset("cancer")} style={presetButtonStyle(GOLD)}>
              Cancer lagna
            </button>
            <button type="button" onClick={() => applyPreset("libra")} style={presetButtonStyle(PURPLE)}>
              Libra lagna
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem", marginTop: "0.75rem" }}>
          {(["second", "seventh", "eighth"] as Role[]).map((role) => {
            const lord = lords[role].lord;
            const state = states[role];
            const roleLabel = role === "second" ? "2nd lord" : role === "seventh" ? "7th lord" : "8th lord (secondary)";
            return (
              <div key={role} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                  <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{roleLabel}</span>
                  <span style={{ color: PLANET_INFO[lord].color, fontWeight: 600 }}>{PLANET_INFO[lord].label}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.6rem" }}>
                  {(["strong", "mixed", "weak"] as Dignity[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={state.dignity === d}
                      onClick={() => updateState(role, { dignity: d })}
                      style={smallChipStyle(state.dignity === d, d === "strong" ? GREEN : d === "mixed" ? GOLD : VERMILION)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_SECONDARY, fontWeight: 400, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={state.dusthana}
                    onChange={(e) => updateState(role, { dusthana: e.target.checked })}
                  />
                  Associated with 6th/8th/12th lord
                </label>
                {role === "eighth" && (
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_SECONDARY, fontWeight: 400, cursor: "pointer", marginTop: "0.4rem" }}>
                    <input
                      type="checkbox"
                      checked={state.neechaBhanga || false}
                      onChange={(e) => updateState(role, { neechaBhanga: e.target.checked })}
                    />
                    Neecha-bhaṅga cancelled
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${verdictColor}10`, border: `1px solid ${verdictColor}55`, display: "flex", alignItems: "start", gap: "0.6rem" }}>
          {totalScore <= -2 ? <ShieldCheck size={20} style={{ color: verdictColor, flexShrink: 0 }} /> : <Swords size={20} style={{ color: verdictColor, flexShrink: 0 }} />}
          <div>
            <p style={{ margin: 0, color: verdictColor, fontWeight: 600 }}>
              Overall maraka picture: {verdictLabel}
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              {totalScore <= -2
                ? "Both primary marakas are well dignified, benefic, and free of dusthāna-lord association. This is real, positive structural information — not a guarantee."
                : totalScore <= 1
                  ? "Some amplification is present. The picture is neither sharply dangerous nor cleanly unamplified; interpret in context."
                  : "Multiple amplifiers overlap. This maraka picture merits heightened internal vigilance and careful cross-checking with other layers."}
            </p>
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Three identification errors to avoid
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {MISTAKES.map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => toggleMistake(index)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 600 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 600, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function LordBadge({ role, sign, lord, primary }: { role: string; sign: number; lord: PlanetKey; primary?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", padding: "0.55rem 0.75rem", borderRadius: 6, border: `1px solid ${primary ? VERMILION : HAIRLINE}`, background: primary ? `${VERMILION}08` : "transparent" }}>
      <div>
        <p style={{ margin: 0, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: INK_MUTED, fontWeight: 600 }}>{role}</p>
        <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontWeight: 500 }}>{SIGNS[sign]}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: INK_MUTED, fontWeight: 600 }}>Lord</p>
        <p style={{ margin: "0.15rem 0 0", color: PLANET_INFO[lord].color, fontWeight: 500 }}>{PLANET_INFO[lord].label}</p>
      </div>
    </div>
  );
}

function LagnaWheel({ lagna }: { lagna: number }) {
  const cx = 100;
  const cy = 100;
  const r = 70;
  const roleOffset: Record<Role, number> = { second: 1, seventh: 6, eighth: 7 };
  const roleColor: Record<Role, string> = { second: VERMILION, seventh: VERMILION, eighth: BLUE };
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Zodiac wheel highlighting the second, seventh, and eighth houses from the selected lagna">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      {SIGNS.map((_, i) => {
        const angle = (i - lagna) * 30 * (Math.PI / 180) - Math.PI / 2;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + (r - 15) * Math.cos(angle);
        const y2 = cy + (r - 15) * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth={1} />;
      })}
      {(Object.keys(roleOffset) as Role[]).map((role) => {
        const offset = roleOffset[role];
        const angle = offset * 30 * (Math.PI / 180) - Math.PI / 2;
        const x = cx + (r - 28) * Math.cos(angle);
        const y = cy + (r - 28) * Math.sin(angle);
        return (
          <g key={role}>
            <circle cx={x} cy={y} r={14} fill={`${roleColor[role]}20`} stroke={roleColor[role]} strokeWidth={2} />
            <text x={x} y={y + 4} textAnchor="middle" fill={roleColor[role]} fontSize="10" fontWeight={600}>{role === "second" ? "2" : role === "seventh" ? "7" : "8"}</text>
          </g>
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={500}>Lagna</text>
    </svg>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function presetButtonStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}66`,
    borderRadius: 8,
    background: `${color}10`,
    color,
    padding: "0.55rem 0.75rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
