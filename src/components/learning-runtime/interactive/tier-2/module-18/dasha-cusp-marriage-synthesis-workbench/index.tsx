"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { RotateCcw, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

type Panchadha = "Adhi-Mitra" | "Mitra" | "Sama" | "Shatru" | "Adhi-Shatru";
type CuspRel = "aspects" | "owns" | "none";
type AdKey = "jupiter" | "saturn" | "sun" | "mercury" | "mars" | "venus";

interface AdData {
  label: string;
  start: number;
  end: number;
  panchadha: Panchadha;
  dignity: string;
  karaka: string;
  marriageKaraka: boolean;
  cuspRel: CuspRel;
  hasNestedSaturnPd: boolean;
  indicatorCount: number;
  note: string;
}

const AD_DATA: Record<AdKey, AdData> = {
  jupiter: {
    label: "Moon/Jupiter",
    start: 33.423,
    end: 34.756,
    panchadha: "Mitra",
    dignity: "Jupiter in own sign",
    karaka: "Husband, children, wisdom, dharma",
    marriageKaraka: true,
    cuspRel: "none",
    hasNestedSaturnPd: false,
    indicatorCount: 1,
    note: "One indicator: Jupiter is Kavya's husband-karaka. No 7th-cusp relationship.",
  },
  saturn: {
    label: "Moon/Saturn",
    start: 34.756,
    end: 36.339,
    panchadha: "Mitra",
    dignity: "Saturn exalted",
    karaka: "Longevity, career, discipline",
    marriageKaraka: false,
    cuspRel: "owns",
    hasNestedSaturnPd: false,
    indicatorCount: 0.5,
    note: "Ownership of the 7th cusp is a real, separate classical principle, but not aspect-or-occupation reach. Counted as a partial signal only.",
  },
  sun: {
    label: "Moon/Sun",
    start: 40.006,
    end: 40.506,
    panchadha: "Sama",
    dignity: "Sun in neutral sign",
    karaka: "Father, authority, vitality",
    marriageKaraka: false,
    cuspRel: "aspects",
    hasNestedSaturnPd: false,
    indicatorCount: 1,
    note: "One indicator: Sun aspects the 7th cusp from Cancer. Karaka domain is not marriage-specific.",
  },
  mercury: {
    label: "Moon/Mercury",
    start: 36.339,
    end: 37.756,
    panchadha: "Sama",
    dignity: "Mercury in own sign",
    karaka: "Communication, business, education",
    marriageKaraka: false,
    cuspRel: "aspects",
    hasNestedSaturnPd: true,
    indicatorCount: 1,
    note: "One indicator: Mercury aspects the 7th cusp. The nested Saturn pratyantardaśā refines timing, it does not double the count.",
  },
  mars: {
    label: "Moon/Mars",
    start: 31.339,
    end: 31.923,
    panchadha: "Shatru",
    dignity: "Mars in own sign",
    karaka: "Siblings, courage, property",
    marriageKaraka: false,
    cuspRel: "none",
    hasNestedSaturnPd: false,
    indicatorCount: 0,
    note: "No marriage-relevant karaka and no 7th-cusp relationship.",
  },
  venus: {
    label: "Moon/Venus",
    start: 38.339,
    end: 40.006,
    panchadha: "Shatru",
    dignity: "Venus in enemy's sign",
    karaka: "Romance/luxury, relationships",
    marriageKaraka: false,
    cuspRel: "none",
    hasNestedSaturnPd: false,
    indicatorCount: 0,
    note: "Romance-domain karaka is related but not the specific marriage-karaka; no 7th-cusp relationship.",
  },
};

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "var(--gold-dark, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#B88421";

function panchadhaColor(p: Panchadha) {
  switch (p) {
    case "Adhi-Mitra":
      return GREEN;
    case "Mitra":
      return "#4A9A6B";
    case "Sama":
      return AMBER;
    case "Shatru":
      return VERMILION;
    case "Adhi-Shatru":
      return "#7A1E12";
  }
}

function tierLabel(count: number) {
  if (count >= 2) return { label: "Moderate", color: GREEN };
  if (count >= 1) return { label: "Weak", color: AMBER };
  if (count > 0) return { label: "Weak / partial", color: AMBER };
  return { label: "None", color: INK_MUTED };
}

function formatAge(n: number) {
  return n.toFixed(3);
}

export function DashaCuspMarriageSynthesisWorkbench() {
  const [selected, setSelected] = useState<AdKey>("jupiter");
  const [userKaraka, setUserKaraka] = useState(false);
  const [userCusp, setUserCusp] = useState(false);
  const [mistakes, setMistakes] = useState({ panchadha: false, pd: false, round: false, dead: false });
  const [showPhrase, setShowPhrase] = useState(false);
  const [jaiminiChoice, setJaiminiChoice] = useState<string | null>(null);

  const ad = AD_DATA[selected];

  const honestCount = ad.indicatorCount;
  const userCount = (userKaraka && ad.marriageKaraka ? 1 : 0) + (userCusp && ad.cuspRel === "aspects" ? 1 : 0);
  const inflatedCount =
    userCount +
    (mistakes.panchadha ? 1 : 0) +
    (mistakes.pd && ad.hasNestedSaturnPd ? 1 : 0) +
    (mistakes.round && honestCount < 2 && honestCount > 0 ? 0.5 : 0);

  const displayedCount = mistakes.round ? Math.min(2, Math.ceil(inflatedCount)) : inflatedCount;

  function reset() {
    setSelected("jupiter");
    setUserKaraka(false);
    setUserCusp(false);
    setMistakes({ panchadha: false, pd: false, round: false, dead: false });
    setShowPhrase(false);
    setJaiminiChoice(null);
  }

  return (
    <div
      data-interactive="dasha-cusp-marriage-synthesis-workbench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: "var(--font-family-sans)" }}
    >
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chapter 3 capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Dasha-Cusp Marriage Synthesis Workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Combine all four lenses and count only genuinely independent indicators for the marriage
              question — then report the honest tier, even when it is not Moderate.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Four-lens synthesis across Kavya’s Moon mahādaśā</p>
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 520 }}>
            <thead>
              <tr style={{ background: `${GOLD}08` }}>
                <th style={thStyle}>Antardaśā</th>
                <th style={thStyle}>Timing</th>
                <th style={thStyle}>Pañcadhā</th>
                <th style={thStyle}>Kāraka</th>
                <th style={thStyle}>Cusp to h7</th>
                <th style={thStyle}>Indicators</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(AD_DATA).map((a) => {
                const isSelected = a.label === ad.label;
                const key = Object.keys(AD_DATA).find((k) => AD_DATA[k as AdKey].label === a.label) as AdKey;
                return (
                  <tr
                    key={a.label}
                    onClick={() => {
                      setSelected(key);
                      setUserKaraka(false);
                      setUserCusp(false);
                      setMistakes({ panchadha: false, pd: false, round: false, dead: false });
                    }}
                    style={{ background: isSelected ? `${GOLD}10` : "transparent", cursor: "pointer" }}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{a.label}</span>
                    </td>
                    <td style={tdStyle}>
                      {formatAge(a.start)}–{formatAge(a.end)}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: panchadhaColor(a.panchadha), fontWeight: 600 }}>{a.panchadha}</span>
                    </td>
                    <td style={tdStyle}>
                      {a.marriageKaraka ? (
                        <span style={{ color: GREEN, fontWeight: 600 }}>Yes — {a.karaka.split(",")[0]}</span>
                      ) : (
                        <span style={{ color: INK_MUTED }}>No — {a.karaka.split(",")[0]}</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {a.cuspRel === "aspects" ? (
                        <span style={{ color: AMBER, fontWeight: 600 }}>Aspects</span>
                      ) : a.cuspRel === "owns" ? (
                        <span style={{ color: GREEN, fontWeight: 600 }}>Owns</span>
                      ) : (
                        <span style={{ color: INK_MUTED }}>None</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <TierBadge count={a.indicatorCount} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Confidence counter — {ad.label}</p>
          <TierBadge count={displayedCount} />
        </div>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{ad.note}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "0.9rem" }}>
          <CounterToggle
            label="Kāraka-relevance"
            sub={ad.marriageKaraka ? "Husband-karaka present" : "Not marriage-karaka"}
            active={userKaraka}
            disabled={!ad.marriageKaraka}
            locked={false}
            onToggle={() => setUserKaraka((v) => !v)}
          />
          <CounterToggle
            label="Cusp-reach"
            sub={ad.cuspRel === "aspects" ? "Aspects 7th cusp" : ad.cuspRel === "owns" ? "Owns 7th cusp" : "No 7th-cusp relationship"}
            active={userCusp}
            disabled={ad.cuspRel === "none"}
            locked={false}
            onToggle={() => setUserCusp((v) => !v)}
          />
          <CounterToggle
            label="Pañcadhā"
            sub="Qualifies texture, not marriage relevance"
            active={false}
            disabled
            locked
            onToggle={() => {}}
          />
          <CounterToggle
            label="Nested Saturn PD"
            sub={ad.hasNestedSaturnPd ? "Refines timing, not a second indicator" : "Not present for this antardaśā"}
            active={false}
            disabled
            locked
            onToggle={() => {}}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.9rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: INK_SECONDARY, fontSize: "0.85rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={mistakes.panchadha}
              onChange={(e) => setMistakes((m) => ({ ...m, panchadha: e.target.checked }))}
            />
            Mistake: count Pañcadhā as indicator
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: INK_SECONDARY, fontSize: "0.85rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={mistakes.pd}
              onChange={(e) => setMistakes((m) => ({ ...m, pd: e.target.checked }))}
            />
            Mistake: double-count nested Saturn PD
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: INK_SECONDARY, fontSize: "0.85rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={mistakes.round}
              onChange={(e) => setMistakes((m) => ({ ...m, round: e.target.checked }))}
            />
            Mistake: round up to Moderate
          </label>
        </div>

        {(mistakes.panchadha || mistakes.pd || mistakes.round) && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
            <AlertTriangle size={20} color={VERMILION} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The inflated tier above comes from counting qualifiers or refinements as independent
              indicators. The honest count for {ad.label} is {honestCount === 0.5 ? "a partial signal" : honestCount} indicator
              {honestCount !== 1 ? "s" : ""}.
            </p>
          </div>
        )}
      </section>

      <section style={{ ...cardStyle, borderColor: `${AMBER}88`, background: `${AMBER}0A` }}>
        <p style={eyebrowStyle}>Whole-mahādaśā honest finding</p>
        <p style={{ margin: "0.4rem 0 0", color: INK_PRIMARY, lineHeight: 1.55, fontSize: "1.05rem" }}>
          No antardaśā in Kavya’s Moon mahādaśā reaches the Moderate confidence tier for the marriage
          question when only genuinely independent indicators are counted.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
          {Object.values(AD_DATA).map((a) => (
            <span
              key={a.label}
              style={{
                padding: "0.35rem 0.65rem",
                borderRadius: "6px",
                background: `${tierLabel(a.indicatorCount).color}15`,
                color: tierLabel(a.indicatorCount).color,
                fontSize: "0.78rem",
                fontWeight: 600,
                border: `1px solid ${tierLabel(a.indicatorCount).color}40`,
              }}
            >
              {a.label.split("/")[1]}: {tierLabel(a.indicatorCount).label}
            </span>
          ))}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          background: "#F5EDD8",
          borderLeft: "4px solid var(--gold-primary, #C9A24D)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ ...eyebrowStyle, color: GOLD }}>Client-facing finding</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_PRIMARY, lineHeight: 1.65, fontStyle: "italic" }}>
              “Looking at your current Moon mahādaśā for marriage-timing: I can identify several periods
              worth watching — most notably the Jupiter antardaśā and the Sun and Mercury antardaśās. But
              each rests on a single supporting factor, not several independently confirming ones. I&apos;d call
              this a possibility worth noting, not yet a confident prediction. To sharpen it, I&apos;d want to
              check your Navāṁśa and, closer to any window, transits.”
            </p>
          </div>
          <button type="button" onClick={() => setShowPhrase((v) => !v)} style={buttonStyle(showPhrase, GOLD)}>
            <Info size={15} aria-hidden="true" /> {showPhrase ? "Hide" : "Why"}
          </button>
        </div>
        {showPhrase && (
          <ul style={{ margin: "0.75rem 0 0", paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
            <li>Names real candidates without inflating any of them.</li>
            <li>States the true Weak tier honestly.</li>
            <li>Names exactly what would strengthen the claim — none invented.</li>
          </ul>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Chapter 4 preview</p>
        <p style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Suppose Chapter 4’s Jaimini Cara-daśā independently points to the same age-range as Moon/Jupiter
          antardaśā. Would that change Moon/Jupiter’s tier?
        </p>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
          {[
            { id: "no", text: "No — Jaimini is a different system, so it cannot confirm Vimśottarī." },
            { id: "yes", text: "Yes — a genuinely independent convergence would raise it from Weak to Moderate." },
            { id: "dead", text: "No — the chart already shows marriage-timing cannot be addressed." },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setJaiminiChoice(opt.id)}
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: `1px solid ${HAIRLINE}`,
                background: jaiminiChoice === opt.id ? (opt.id === "yes" ? `${GREEN}11` : `${VERMILION}11`) : SURFACE,
                color: INK_PRIMARY,
                cursor: "pointer",
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
        {jaiminiChoice === "yes" && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
            <CheckCircle2 size={20} color={GREEN} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Correct. Jaimini Cara-daśā is a genuinely independent system. If it converges on the same
              window, that supplies the second independent indicator needed for Moderate.
            </p>
          </div>
        )}
        {jaiminiChoice && jaiminiChoice !== "yes" && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
            <AlertTriangle size={20} color={VERMILION} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              This matches Common Mistake #4. A “not yet Moderate” finding is a precise statement of what is
              still needed, not a dead end.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function TierBadge({ count }: { count: number }) {
  const t = tierLabel(count);
  return (
    <span
      style={{
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        background: `${t.color}15`,
        color: t.color,
        border: `1px solid ${t.color}55`,
        fontSize: "0.78rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {t.label}
    </span>
  );
}

function CounterToggle({
  label,
  sub,
  active,
  disabled,
  locked,
  onToggle,
}: {
  label: string;
  sub: string;
  active: boolean;
  disabled: boolean;
  locked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        padding: "0.75rem",
        borderRadius: "8px",
        border: `1px solid ${locked ? HAIRLINE : active ? GREEN : HAIRLINE}`,
        background: active ? `${GREEN}0A` : SURFACE,
        opacity: disabled ? 0.65 : 1,
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: disabled ? "not-allowed" : "pointer" }}>
        <input type="checkbox" checked={active} disabled={disabled} onChange={onToggle} />
        <span style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{label}</span>
      </label>
      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.45 }}>{sub}</p>
      {locked && (
        <p style={{ margin: "0.35rem 0 0", color: AMBER, fontSize: "0.72rem", fontWeight: 600 }}>Does not count</p>
      )}
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "8px",
  padding: "1rem",
};

const thStyle: CSSProperties = {
  padding: "0.6rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  color: GOLD,
  borderBottom: `1px solid ${HAIRLINE}`,
};

const tdStyle: CSSProperties = {
  padding: "0.6rem 0.75rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  fontWeight: 700,
  color: INK_MUTED,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.45rem 0.9rem",
    borderRadius: "8px",
    border: `1px solid ${color}`,
    background: active ? color : "transparent",
    color: active ? "#fff" : color,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
