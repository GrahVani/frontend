"use client";

import { useState } from "react";
import { NAKSHATRAS } from "../nakshatra-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A8412B";

// The nine tārās in cycle order (lesson-consistent names + their common variants).
const TARA = [
  { name: "Janma", kind: "mixed" },
  { name: "Sampat", kind: "good" },
  { name: "Vipat", kind: "bad" },
  { name: "Kṣema", kind: "good" },
  { name: "Pratyak", kind: "bad" },
  { name: "Sādhaka", kind: "good" },
  { name: "Vadha", kind: "bad" },
  { name: "Mitra", kind: "good" },
  { name: "Ati-Mitra", kind: "good" },
] as const;

// Aṣṭakūṭa (Guṇa-Milāna) — the eight kūṭas and their maximum points (sum 36). Static reference.
const KUTAS: [string, number, string][] = [
  ["Varṇa", 1, "spiritual caste"],
  ["Vaśya", 2, "mutual attraction / control"],
  ["Tārā", 3, "health & longevity (the tārā count)"],
  ["Yoni", 4, "biological / sexual compatibility (the animal)"],
  ["Graha-Maitrī", 5, "mental affinity (sign-lord friendship)"],
  ["Gaṇa", 6, "temperament (deva / manuṣya / rākṣasa)"],
  ["Bhakūṭa", 7, "family & prosperity (Moon-sign distance)"],
  ["Nāḍī", 8, "constitution & progeny (the doṣa-heavy one)"],
];

const KINDC = { good: GREEN, bad: RED, mixed: GOLD } as const;

export function TaraBalaWheel() {
  const [janma, setJanma] = useState(1); // 1-based nakṣatra number

  // Tārā of target nakṣatra T (1-27) counted from janma J: positions = (T-J) mod 27, tārā = (positions mod 9).
  function taraOf(target: number) {
    const positions = (((target - janma) % 27) + 27) % 27;
    return TARA[positions % 9];
  }

  return (
    <div data-interactive="tara-bala-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tāra Bala</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>The nine-fold star strength</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.76rem", fontWeight: 900, textTransform: "uppercase" }}>Janma (Moon) nakṣatra:</span>
          <select
            value={janma}
            onChange={(e) => setJanma(Number(e.target.value))}
            style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}
          >
            {NAKSHATRAS.map((nk) => <option key={nk.num} value={nk.num}>{nk.num}. {nk.name}</option>)}
          </select>
          <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>
            <strong style={{ color: GREEN }}>green</strong> favourable · <strong style={{ color: RED }}>red</strong> avoid (Vipat/Pratyak/Vadha) · <strong style={{ color: GOLD }}>Janma</strong> mixed
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(8.5rem, 1fr))", gap: "0.3rem", marginTop: "0.85rem" }}>
          {NAKSHATRAS.map((nk) => {
            const t = taraOf(nk.num);
            const c = KINDC[t.kind];
            return (
              <div
                key={nk.num}
                style={{ border: `1px solid ${nk.num === janma ? GOLD : HAIRLINE}`, borderRadius: 6, padding: "0.3rem 0.45rem", background: `${c}14` }}
              >
                <div style={{ color: INK_SECONDARY, fontSize: "0.78rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nk.num}. {nk.name}</div>
                <div style={{ color: c, fontWeight: 900, fontSize: "0.82rem" }}>{t.name}</div>
              </div>
            );
          })}
        </div>
        <p style={{ margin: "0.6rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
          The nine tārās repeat three times across the 27, counted from your Janma nakṣatra. The <strong style={{ color: RED }}>3rd Vipat</strong>, <strong style={{ color: RED }}>5th Pratyak</strong>, and <strong style={{ color: RED }}>7th Vadha</strong> are the inauspicious stars to avoid for new beginnings.
        </p>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Aṣṭakūṭa point reference">
        <h3 style={{ margin: "0 0 0.1rem", color: GOLD, fontSize: "1.05rem" }}>Aṣṭakūṭa — the eight kūṭas (36 points)</h3>
        <p style={{ margin: "0 0 0.5rem", color: INK_MUTED, fontSize: "0.82rem" }}>The nakṣatra-based compatibility (Guṇa-Milāna) point structure. A match is generally considered acceptable at ≥18/36 — read as one screen among many, never a verdict.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${GOLD}66` }}>
              <th style={{ textAlign: "left", padding: "0.25rem 0.4rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>Kūṭa</th>
              <th style={{ textAlign: "center", padding: "0.25rem 0.4rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>Max pts</th>
              <th style={{ textAlign: "left", padding: "0.25rem 0.4rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>Tests</th>
            </tr>
          </thead>
          <tbody>
            {KUTAS.map(([name, pts, desc]) => (
              <tr key={name} style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "0.25rem 0.4rem", fontWeight: 800, color: INK_PRIMARY }}>{name}</td>
                <td style={{ padding: "0.25rem 0.4rem", textAlign: "center", fontWeight: 900, color: GOLD }}>{pts}</td>
                <td style={{ padding: "0.25rem 0.4rem", color: INK_MUTED }}>{desc}</td>
              </tr>
            ))}
            <tr style={{ borderTop: `1px solid ${GOLD}66` }}>
              <td style={{ padding: "0.3rem 0.4rem", fontWeight: 900, color: GREEN }}>Total</td>
              <td style={{ padding: "0.3rem 0.4rem", textAlign: "center", fontWeight: 900, color: GREEN }}>36</td>
              <td style={{ padding: "0.3rem 0.4rem", color: INK_MUTED }}>Nāḍī (8) and Bhakūṭa (7) carry the heaviest doṣa — weigh honestly, with the whole chart.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
