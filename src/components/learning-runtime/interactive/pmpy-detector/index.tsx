"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A8412B";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const KENDRAS = new Set([1, 4, 7, 10]);

// own = sign indices owned; exalt = exaltation sign index; yoga = the Mahāpuruṣa yoga (null = cannot form one).
interface Planet { name: string; glyph: string; own: number[]; exalt: number; yoga: string | null }
const PLANETS: Planet[] = [
  { name: "Sun", glyph: "☉", own: [4], exalt: 0, yoga: null }, // luminary — no MPY
  { name: "Moon", glyph: "☽", own: [3], exalt: 1, yoga: null }, // luminary — no MPY
  { name: "Mars", glyph: "♂", own: [0, 7], exalt: 9, yoga: "Rucaka" },
  { name: "Mercury", glyph: "☿", own: [2, 5], exalt: 5, yoga: "Bhadra" },
  { name: "Jupiter", glyph: "♃", own: [8, 11], exalt: 3, yoga: "Haṃsa" },
  { name: "Venus", glyph: "♀", own: [1, 6], exalt: 11, yoga: "Mālavya" },
  { name: "Saturn", glyph: "♄", own: [9, 10], exalt: 6, yoga: "Śaśa" },
];

export function PmpyDetector() {
  const [pIdx, setPIdx] = useState(4); // Jupiter (the §7 demo)
  const [sign, setSign] = useState(3); // Karka (Jupiter's exaltation)
  const [house, setHouse] = useState(4); // a kendra
  const [afflicted, setAfflicted] = useState(false);
  const p = PLANETS[pIdx];

  const exalted = sign === p.exalt;
  const inOwn = p.own.includes(sign);
  const dignified = exalted || inOwn;
  const isKendra = KENDRAS.has(house);
  const canForm = p.yoga !== null;
  const forms = canForm && dignified && isKendra;

  const dignityLabel = exalted ? (inOwn ? "exalted (also own sign)" : "exalted") : inOwn ? "own sign" : "neither own nor exalted";

  return (
    <div data-interactive="pmpy-detector" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pañcamahāpuruṣa detector</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>Own/exalted + kendra → a great-person yoga?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase", marginRight: "0.2rem" }}>Planet:</span>
          {PLANETS.map((pl, i) => (
            <button key={pl.name} type="button" aria-pressed={pIdx === i} onClick={() => setPIdx(i)} title={pl.name}
              style={{ border: `1px solid ${pIdx === i ? GOLD : HAIRLINE}`, borderRadius: 8, background: pIdx === i ? GOLD : "transparent", color: pIdx === i ? "#fff" : INK_SECONDARY, padding: "0.25rem 0.5rem", fontWeight: 850, fontSize: "0.95rem", cursor: "pointer" }}>
              {pl.glyph}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Sign</span>
            <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.3rem 0.45rem", fontWeight: 700 }}>
              {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
            </select>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>House</span>
            <select value={house} onChange={(e) => setHouse(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.3rem 0.45rem", fontWeight: 700 }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}{KENDRAS.has(i + 1) ? " (kendra)" : ""}</option>)}
            </select>
          </span>
          <button type="button" aria-pressed={afflicted} onClick={() => setAfflicted((a) => !a)} style={{ border: `1px solid ${afflicted ? RED : HAIRLINE}`, borderRadius: 8, background: afflicted ? `${RED}1A` : "transparent", color: afflicted ? RED : INK_SECONDARY, padding: "0.3rem 0.6rem", fontWeight: 800, cursor: "pointer" }}>
            afflicted (combust / enemy navāṁśa) {afflicted ? "ON" : "OFF"}
          </button>
        </div>
      </section>

      <section style={{ border: `1px solid ${forms ? GREEN : HAIRLINE}`, borderRadius: 8, background: forms ? `${GREEN}12` : SURFACE, padding: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))", gap: "0.5rem" }}>
          {[
            { k: "Dignity", v: dignityLabel, ok: dignified },
            { k: "Placement", v: isKendra ? `${house}th — a kendra` : `${house}th — not a kendra`, ok: isKendra },
            { k: "Can form a MPY?", v: canForm ? `yes — ${p.name}'s is ${p.yoga}` : `no — ${p.name} is a ${pIdx < 2 ? "luminary" : "node"}`, ok: canForm },
          ].map((c) => (
            <div key={c.k} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.5rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase" }}>{c.k}</div>
              <div style={{ color: c.ok ? GREEN : INK_SECONDARY, fontSize: "0.92rem", fontWeight: 800, marginTop: "0.15rem" }}>{c.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: "0.7rem 0 0", fontWeight: 900, fontSize: "1.05rem", color: forms ? (afflicted ? GOLD : GREEN) : RED }}>
          {!canForm
            ? `✗ No Mahāpuruṣa yoga — only Mars, Mercury, Jupiter, Venus and Saturn form one.`
            : !dignified
            ? `✗ No ${p.yoga} — ${p.name} is neither in its own sign nor exalted.`
            : !isKendra
            ? `✗ No ${p.yoga} — ${p.name} is dignified but not in a kendra (1/4/7/10).`
            : afflicted
            ? `△ ${p.yoga} yoga is present (${p.name} ${dignityLabel}, in a kendra) — but marred: an afflicted yoga underdelivers its promise.`
            : `✓ ${p.yoga} yoga forms — ${p.name} ${dignityLabel}, in a kendra. Eminence in ${p.name}'s domain.`}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
          The recipe: one of the five tārā-grahas, in its own sign or exaltation, in a kendra from the Lagna (many authorities also reckon from the Moon). The result is distinction in that planet&apos;s field — strong, but read the whole chart (combustion, affliction, daśā) before promising greatness.
        </p>
      </section>
    </div>
  );
}
