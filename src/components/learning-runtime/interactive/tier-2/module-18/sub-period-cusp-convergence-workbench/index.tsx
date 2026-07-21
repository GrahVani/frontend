"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { RotateCcw, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

type Panchadha = "Adhi-Mitra" | "Mitra" | "Sama" | "Shatru" | "Adhi-Shatru";
type CuspRel = "aspects" | "owns" | "occupies" | "none";
type AdLord = "sun" | "mercury" | "jupiter" | "mars" | "venus" | "saturn";

interface AdData {
  key: AdLord;
  label: string;
  start: number;
  end: number;
  panchadha: Panchadha;
  karaka: string;
  cuspRel: CuspRel;
  combined: string;
}

const AD_DATA: Record<AdLord, AdData> = {
  sun: {
    key: "sun",
    label: "Moon/Sun",
    start: 40.006,
    end: 40.506,
    panchadha: "Sama",
    karaka: "Father, authority, vitality",
    cuspRel: "aspects",
    combined:
      "Mixed texture, father/authority-domain karaka, but genuinely reaches the marriage house — worth noting even though Sun's own karaka domain is not marriage.",
  },
  mercury: {
    key: "mercury",
    label: "Moon/Mercury",
    start: 36.339,
    end: 37.756,
    panchadha: "Sama",
    karaka: "Communication, business, education",
    cuspRel: "aspects",
    combined:
      "Mixed texture, communication-domain karaka, and also genuinely reaches the marriage house.",
  },
  jupiter: {
    key: "jupiter",
    label: "Moon/Jupiter",
    start: 33.423,
    end: 34.756,
    panchadha: "Mitra",
    karaka: "Husband, children, wisdom, dharma",
    cuspRel: "none",
    combined:
      "Supportive texture and marriage-relevant through Jupiter's own karaka domain, even though this lens is silent on the 7th cusp.",
  },
  mars: {
    key: "mars",
    label: "Moon/Mars",
    start: 31.339,
    end: 31.923,
    panchadha: "Shatru",
    karaka: "Siblings, courage, property",
    cuspRel: "none",
    combined:
      "Friction-with-capacity texture and siblings/property karaka; this lens is silent on the 7th cusp, so it adds nothing specific to a marriage question here.",
  },
  venus: {
    key: "venus",
    label: "Moon/Venus",
    start: 38.339,
    end: 40.006,
    panchadha: "Shatru",
    karaka: "Romance/luxury, relationships",
    cuspRel: "none",
    combined:
      "Friction-with-less-capacity texture and relationship-domain karaka, but this lens is silent on the 7th cusp.",
  },
  saturn: {
    key: "saturn",
    label: "Moon/Saturn",
    start: 34.756,
    end: 36.339,
    panchadha: "Mitra",
    karaka: "Longevity, career, discipline",
    cuspRel: "owns",
    combined:
      "Supportive texture and career/discipline karaka; Saturn owns the 7th cusp even though it does not aspect or occupy it — a separate classical consideration.",
  },
};

const CONVERGENCES = [
  { ad: "Moon/Sun", pd: "Saturn", start: 40.2435, end: 40.3227, duration: "≈ 29 days" },
  { ad: "Moon/Mercury", pd: "Saturn", start: 37.5317, end: 37.756, duration: "≈ 82 days" },
];

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

function cuspBadge(rel: CuspRel) {
  switch (rel) {
    case "aspects":
      return { label: "Aspects h7", color: AMBER };
    case "owns":
      return { label: "Owns h7", color: GREEN };
    case "occupies":
      return { label: "Occupies h7", color: GREEN };
    case "none":
      return { label: "Silent on h7", color: INK_MUTED };
  }
}

function formatAge(n: number) {
  return n.toFixed(4);
}

export function SubPeriodCuspConvergenceWorkbench() {
  const [selected, setSelected] = useState<AdLord>("sun");
  const [showOccupation, setShowOccupation] = useState(false);
  const [jupiterChoice, setJupiterChoice] = useState<string | null>(null);
  const [negativeMode, setNegativeMode] = useState(false);

  const ad = AD_DATA[selected];
  const badge = cuspBadge(ad.cuspRel);

  function reset() {
    setSelected("sun");
    setShowOccupation(false);
    setJupiterChoice(null);
    setNegativeMode(false);
  }

  return (
    <div
      data-interactive="sub-period-cusp-convergence-workbench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: "var(--font-family-sans)" }}
    >
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chapter 3 synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Sub-Period Cusp Convergence Workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Combine cusp-interplay with Pañcadhā and kāraka into one four-lens read, then go one level
              deeper to find the structural convergence.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select an antardaśā</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
          {Object.values(AD_DATA).map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => {
                setSelected(a.key);
                setJupiterChoice(null);
                setNegativeMode(false);
              }}
              style={chipStyle(selected === a.key, a.cuspRel !== "none")}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Four-lens view — {ad.label}</p>
          <span
            style={{
              padding: "0.25rem 0.6rem",
              borderRadius: "9999px",
              background: `${badge.color}15`,
              color: badge.color,
              fontSize: "0.75rem",
              fontWeight: 600,
              border: `1px solid ${badge.color}55`,
            }}
          >
            {badge.label}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          <LensCard title="Timing" value={`Age ${formatAge(ad.start)} – ${formatAge(ad.end)}`} />
          <LensCard title="Pañcadhā" value={ad.panchadha} valueColor={panchadhaColor(ad.panchadha)} />
          <LensCard title="Kāraka" value={ad.karaka} />
          <LensCard
            title="Cusp interplay"
            value={
              ad.cuspRel === "aspects"
                ? "Aspects 7th cusp"
                : ad.cuspRel === "owns"
                ? "Owns 7th cusp"
                : ad.cuspRel === "occupies"
                ? "Occupies 7th cusp"
                : "Silent on 7th cusp"
            }
            valueColor={ad.cuspRel === "none" ? INK_MUTED : GREEN}
          />
        </div>
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "8px",
            background: `${badge.color}0D`,
            border: `1px solid ${badge.color}40`,
          }}
        >
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55 }}>
            <span style={{ color: INK_MUTED, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
              Combined read
            </span>
            <br />
            {ad.combined}
          </p>
        </div>
      </section>

      {ad.cuspRel === "none" && (
        <section style={{ ...cardStyle, borderColor: `${AMBER}88`, background: `${AMBER}0A` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Reading silence correctly</p>
              <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
                {ad.label} shows no 7th-cusp relationship. Does that make the period unfavourable for marriage?
              </p>
            </div>
            <button type="button" onClick={() => setNegativeMode((v) => !v)} style={pillStyle(negativeMode)}>
              {negativeMode ? "Show correct read" : "Show mistaken read"}
            </button>
          </div>
          {negativeMode ? (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
              <AlertTriangle size={20} color={VERMILION} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Mistaken read: “{ad.label} is unfavourable for marriage because it does not aspect the 7th
                cusp.” This collapses one silent lens into a negative verdict.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
              <CheckCircle2 size={20} color={GREEN} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Correct read: the cusp-interplay lens is silent here. Other lenses — Pañcadhā, kāraka, timing
                — may still apply. For example, Moon/Jupiter remains marriage-relevant through Jupiter’s own
                kāraka domain even without a 7th-cusp finding.
              </p>
            </div>
          )}
        </section>
      )}

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <p style={eyebrowStyle}>Occupation check</p>
          <button type="button" onClick={() => setShowOccupation((v) => !v)} style={buttonStyle(showOccupation, GOLD)}>
            <Info size={15} aria-hidden="true" /> {showOccupation ? "Hide" : "Check"} 7th-house occupancy
          </button>
        </div>
        {showOccupation && (
          <div style={{ marginTop: "0.75rem" }}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              No natal planet occupies Kavya’s 7th house (Capricorn). Occupation is the most direct
              relationship classically, but it is simply absent in this chart — a complete finding, not an
              oversight.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
              {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((p) => (
                <span
                  key={p}
                  style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    background: `${INK_MUTED}15`,
                    color: INK_MUTED,
                    fontSize: "0.78rem",
                  }}
                >
                  {p}: not in h7
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Deeper convergence — Saturn pratyantardaśā inside aspect-carrying antardaśās</p>
        <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Every antardaśā structurally contains all nine planets’ pratyantardaśās. What is worth naming is
          when Saturn’s own sub-period is nested inside an antardaśā whose own lord already aspects the 7th
          house.
        </p>
        <div style={{ display: "grid", gap: "1rem", marginTop: "0.9rem" }}>
          {CONVERGENCES.map((c) => (
            <div
              key={c.ad}
              style={{
                padding: "0.9rem",
                borderRadius: "8px",
                background: `${GREEN}0A`,
                border: `1px solid ${GREEN}44`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <p style={{ margin: 0, fontWeight: 600, color: INK_PRIMARY }}>
                  {c.ad}/{c.pd} pratyantardaśā
                </p>
                <span style={{ fontSize: "0.78rem", color: INK_MUTED }}>{c.duration}</span>
              </div>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
                Age {formatAge(c.start)} – {formatAge(c.end)}. Saturn owns the 7th cusp, nested inside{" "}
                {c.ad}, whose lord aspects it.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: `${AMBER}88`, background: `${AMBER}0A` }}>
        <p style={eyebrowStyle}>Significance check</p>
        <p style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Moon/Jupiter antardaśā contains a Saturn pratyantardaśā somewhere within it. Does that Saturn
          sub-period carry the same significance as the two convergences above?
        </p>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
          {[
            { id: "same", text: "Yes — it is still Saturn's own sub-period, so the significance is identical." },
            { id: "less", text: "It carries Saturn ownership of the 7th, but lacks the reinforcing aspect from the parent antardaśā lord." },
            { id: "none", text: "No — because Jupiter shows no 7th-cusp relationship, the Saturn PD there is irrelevant." },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setJupiterChoice(opt.id)}
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: `1px solid ${HAIRLINE}`,
                background: jupiterChoice === opt.id ? (opt.id === "less" ? `${GREEN}11` : `${VERMILION}11`) : SURFACE,
                color: INK_PRIMARY,
                cursor: "pointer",
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
        {jupiterChoice === "less" && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
            <CheckCircle2 size={20} color={GREEN} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Correct. Saturn ownership is one relevant signal, but Moon/Sun/Saturn and Moon/Mercury/Saturn
              carry a second reinforcing signal: their parent antardaśā lord already aspects the 7th house.
              Always check the parent level before assessing a deeper sub-period in isolation.
            </p>
          </div>
        )}
        {jupiterChoice && jupiterChoice !== "less" && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
            <AlertTriangle size={20} color={VERMILION} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              This matches Common Mistake #3 or #4. The structural feature (Saturn PD present) is not itself
              rare; its combination with the parent level’s aspect is what matters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function LensCard({
  title,
  value,
  valueColor,
}: {
  title: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div style={{ padding: "0.9rem", borderRadius: "8px", background: `${valueColor ?? INK_MUTED}08`, border: `1px solid ${HAIRLINE}` }}>
      <p style={{ margin: 0, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, color: INK_MUTED }}>
        {title}
      </p>
      <p style={{ margin: "0.35rem 0 0", fontSize: "0.98rem", fontWeight: 600, color: valueColor ?? INK_PRIMARY, lineHeight: 1.4 }}>
        {value}
      </p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "8px",
  padding: "1rem",
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

function chipStyle(active: boolean, hasRelationship: boolean): CSSProperties {
  return {
    padding: "0.35rem 0.75rem",
    borderRadius: "6px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? `${GOLD}15` : SURFACE,
    color: active ? GOLD : hasRelationship ? INK_PRIMARY : INK_MUTED,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function pillStyle(active: boolean): CSSProperties {
  return {
    padding: "0.4rem 0.85rem",
    borderRadius: "9999px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? `${GOLD}15` : "transparent",
    color: active ? GOLD : INK_SECONDARY,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
