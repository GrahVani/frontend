"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

type Gender = "male" | "female";

interface Row {
  num: number;
  name: string;
  primary: string; // primary kāraka (7th resolved by gender at render)
  secondary: string;
}

// The naisargika bhāva-kāraka table (Lesson 6.6.4 §4.1). The 7th's primary is
// gender-asymmetric (Venus in a man's chart, Jupiter in a woman's).
const ROWS: Row[] = [
  { num: 1, name: "Tanu", primary: "Sun", secondary: "Mars (vitality)" },
  { num: 2, name: "Dhana", primary: "Jupiter", secondary: "Mercury (speech)" },
  { num: 3, name: "Sahaja", primary: "Mars", secondary: "Mercury (communication)" },
  { num: 4, name: "Sukha", primary: "Moon", secondary: "Mars (land), Mercury (education), Venus (vehicles)" },
  { num: 5, name: "Putra", primary: "Jupiter", secondary: "Mercury (intellect)" },
  { num: 6, name: "Śatru", primary: "Mars", secondary: "Saturn (illness, service)" },
  { num: 7, name: "Yuvati", primary: "(gender)", secondary: "Mercury (trade)" },
  { num: 8, name: "Āyu", primary: "Saturn", secondary: "Mars (sudden events), Ketu (occult)" },
  { num: 9, name: "Bhāgya", primary: "Sun + Jupiter", secondary: "Ketu (spirituality)" },
  { num: 10, name: "Karma", primary: "Saturn", secondary: "Sun, Mercury, Jupiter" },
  { num: 11, name: "Lābha", primary: "Jupiter", secondary: "—" },
  { num: 12, name: "Vyaya", primary: "Saturn", secondary: "Ketu (mokṣa)" },
];

// Houses each graha is a kāraka of (the §4.3 sets). The 7th joins Jupiter's set
// for a woman's chart and Venus's for a man's — handled by gender at render.
const KARAKA_HOUSES: Record<string, number[]> = {
  Sun: [1, 9],
  Moon: [4],
  Mars: [3, 6],
  Mercury: [],
  Jupiter: [2, 5, 9, 11],
  Venus: [],
  Saturn: [6, 8, 10, 12],
};

const GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

function ordinal(n: number) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function KarakaTable() {
  const [gender, setGender] = useState<Gender>("male");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  const seventhPrimary = gender === "male" ? "Venus" : "Jupiter";

  // Houses to highlight for the selected graha (with the gender-dependent 7th).
  function highlightedHouses(graha: string): number[] {
    const base = [...KARAKA_HOUSES[graha]];
    if (graha === seventhPrimary) base.push(7);
    return base;
  }
  const active = highlight ? highlightedHouses(highlight) : [];

  return (
    <div data-interactive="karaka-table" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Kāraka table</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>The natural significator of each bhāva</h2>
          </div>
          <button
            type="button"
            onClick={() => { setGender("male"); setHighlight(null); setPicked(null); }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.85rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", marginRight: "0.3rem" }}>Highlight a graha's houses:</span>
          {GRAHAS.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={highlight === g}
              onClick={() => setHighlight(highlight === g ? null : g)}
              style={{ border: `1px solid ${highlight === g ? GOLD : HAIRLINE}`, borderRadius: 999, background: highlight === g ? GOLD : "transparent", color: highlight === g ? "#fff" : INK_SECONDARY, padding: "0.25rem 0.6rem", fontWeight: 850, fontSize: "0.8rem", cursor: "pointer" }}
            >
              {g}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }}>7th by chart:</span>
          {(["male", "female"] as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={gender === g}
              onClick={() => setGender(g)}
              style={{ border: `1px solid ${gender === g ? GREEN : HAIRLINE}`, borderRadius: 8, background: gender === g ? GREEN : "transparent", color: gender === g ? "#fff" : INK_SECONDARY, padding: "0.35rem 0.7rem", fontWeight: 850, fontSize: "0.82rem", cursor: "pointer" }}
            >
              {g === "male" ? "Man's chart (Venus)" : "Woman's chart (Jupiter)"}
            </button>
          ))}
        </div>
        {highlight ? (
          <p style={{ margin: "0.6rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: GOLD }}>{highlight}</strong> is a kāraka of {active.length ? active.map((h) => `${h}${ordinal(h)}`).join(", ") : "no house as primary (it carries only secondary kāraka roles)"}.
            {highlight === "Jupiter" || highlight === "Saturn" ? " Jupiter (2/5/9/11) and Saturn (6/8/10/12) together cover eight of the twelve houses." : ""}
          </p>
        ) : null}
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflowX: "auto" }} aria-label="Naisargika kāraka of each bhāva">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "32rem" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${GOLD}66` }}>
              {["House", "Name", "Primary kāraka", "Secondary"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.4rem 0.5rem", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: INK_MUTED, fontWeight: 900 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const isHi = active.includes(r.num);
              const isPicked = picked === r.num;
              const primaryText = r.primary === "(gender)" ? `${seventhPrimary} (${gender === "male" ? "wife" : "husband"})` : r.primary;
              return (
                <tr
                  key={r.num}
                  onClick={() => setPicked(isPicked ? null : r.num)}
                  style={{
                    borderBottom: `1px dashed ${HAIRLINE}`,
                    background: isPicked ? `${GREEN}1A` : isHi ? `${GOLD}1A` : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td style={{ padding: "0.5rem", fontWeight: 900, color: isHi ? GOLD : INK_PRIMARY }}>{r.num}{ordinal(r.num)}</td>
                  <td style={{ padding: "0.5rem", color: INK_SECONDARY, fontWeight: 700 }}>{r.name}</td>
                  <td style={{ padding: "0.5rem", color: isHi ? GOLD : INK_PRIMARY, fontWeight: 800 }}>{primaryText}</td>
                  <td style={{ padding: "0.5rem", color: INK_MUTED, fontSize: "0.86rem" }}>{r.secondary}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ minHeight: "1.5rem", marginTop: "0.7rem" }}>
          {picked ? (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              To judge the <strong>{picked}{ordinal(picked)}</strong> ({ROWS[picked - 1].name}), read it through <em>both</em> its <strong>lord</strong> (the planet ruling its sign — its house, dignity, aspects) <em>and</em> its <strong>kāraka</strong> ({picked === 7 ? seventhPrimary : ROWS[picked - 1].primary}). When the two agree the verdict is robust; when they disagree, the picture is mixed.
            </p>
          ) : (
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem" }}>Pick a house (click a row) to read it via both its lord and its kāraka.</p>
          )}
        </div>
      </section>
    </div>
  );
}
