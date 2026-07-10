"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A44135";

type Naisargika = "friend" | "neutral" | "enemy";
type Tamkalika = "friend" | "enemy";
type Tier = "adhimitra" | "mitra" | "sama" | "satru" | "adhisatru";

// Pañcadhā compound: fixed (naisargika) row × temporary (tāmkālika) column → one
// of five tiers. Equivalent ladder: friend=+1/neutral=0/enemy=−1 (naisargika) plus
// friend=+1/enemy=−1 (tāmkālika); the sum gives +2 adhimitra … −2 adhiśatru.
const TABLE: Record<Naisargika, Record<Tamkalika, Tier>> = {
  friend: { friend: "adhimitra", enemy: "sama" },
  neutral: { friend: "mitra", enemy: "satru" },
  enemy: { friend: "sama", enemy: "adhisatru" },
};

const TIERS: Record<Tier, { name: string; gloss: string; score: string; color: string; strong: boolean }> = {
  adhimitra: { name: "Adhimitra", gloss: "Great friend", score: "+2", color: GREEN, strong: true },
  mitra: { name: "Mitra", gloss: "Friend", score: "+1", color: GREEN, strong: false },
  sama: { name: "Sama", gloss: "Neutral", score: "0", color: GOLD, strong: false },
  satru: { name: "Śatru", gloss: "Enemy", score: "−1", color: RED, strong: false },
  adhisatru: { name: "Adhiśatru", gloss: "Great enemy", score: "−2", color: RED, strong: true },
};

const NAISARGIKA_OPTS: { key: Naisargika; label: string; score: string; color: string }[] = [
  { key: "friend", label: "Friend", score: "+1", color: GREEN },
  { key: "neutral", label: "Neutral", score: "0", color: GOLD },
  { key: "enemy", label: "Enemy", score: "−1", color: RED },
];

const TAMKALIKA_OPTS: { key: Tamkalika; label: string; score: string; color: string }[] = [
  { key: "friend", label: "Friend", score: "+1", color: GREEN },
  { key: "enemy", label: "Enemy", score: "−1", color: RED },
];

export function PanchadhaCombiner() {
  const [naisargika, setNaisargika] = useState<Naisargika>("enemy");
  const [tamkalika, setTamkalika] = useState<Tamkalika>("enemy");

  const result = TABLE[naisargika][tamkalika];
  const tier = TIERS[result];

  return (
    <div data-interactive="panchadha-combiner" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Pañcadhā combiner
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Fixed × temporary → one of five
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setNaisargika("enemy");
              setTamkalika("enemy");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {/* Layer selectors */}
        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Friendship layer inputs">
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Naisargika (fixed) layer</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
              {NAISARGIKA_OPTS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={naisargika === o.key}
                  onClick={() => setNaisargika(o.key)}
                  style={{ border: `1px solid ${naisargika === o.key ? o.color : HAIRLINE}`, borderRadius: 8, background: naisargika === o.key ? o.color : "transparent", color: naisargika === o.key ? "#fff" : INK_SECONDARY, padding: "0.6rem 0.4rem", fontWeight: 850, cursor: "pointer" }}
                >
                  {o.label}<br />
                  <span style={{ fontSize: "0.74rem", opacity: 0.85 }}>{o.score}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tāmkālika (temporary) layer</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
              {TAMKALIKA_OPTS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={tamkalika === o.key}
                  onClick={() => setTamkalika(o.key)}
                  style={{ border: `1px solid ${tamkalika === o.key ? o.color : HAIRLINE}`, borderRadius: 8, background: tamkalika === o.key ? o.color : "transparent", color: tamkalika === o.key ? "#fff" : INK_SECONDARY, padding: "0.6rem 0.4rem", fontWeight: 850, cursor: "pointer" }}
                >
                  {o.label}<br />
                  <span style={{ fontSize: "0.74rem", opacity: 0.85 }}>{o.score}</span>
                </button>
              ))}
            </div>
            <p style={{ margin: "0.7rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>Tāmkālika has no neutral &mdash; only friend or enemy.</p>
          </section>

          <section style={{ border: `1px solid ${tier.color}`, borderRadius: 8, background: `${tier.color}1F`, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Compound result</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginTop: "0.3rem" }}>
              <span style={{ color: tier.color, fontSize: "1.5rem", fontWeight: 900 }}>{tier.name}</span>
              <span style={{ color: INK_SECONDARY, fontWeight: 800 }}>{tier.gloss}</span>
              <span style={{ marginLeft: "auto", color: tier.color, fontWeight: 900, fontSize: "1.1rem" }}>{tier.score}</span>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              Fixed <strong>{naisargika}</strong> ({naisItem(naisargika).score}) + temporary <strong>{tamkalika}</strong> ({tamItem(tamkalika).score}) &rarr; <strong>{tier.name}</strong>. The two layers add: like reinforces, opposite cancels toward neutral.
            </p>
          </section>
        </section>

        {/* 3×2 matrix */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Pancadha combination matrix">
          <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.6rem" }}>The 3 × 2 matrix</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.4rem", fontSize: "0.74rem", color: INK_MUTED, textAlign: "left" }}>fixed ↓ / temp →</th>
                {TAMKALIKA_OPTS.map((t) => (
                  <th key={t.key} style={{ padding: "0.4rem", fontSize: "0.8rem", color: tamkalika === t.key ? t.color : INK_SECONDARY, fontWeight: 900, textAlign: "center" }}>{t.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NAISARGIKA_OPTS.map((n) => (
                <tr key={n.key}>
                  <td style={{ padding: "0.4rem", fontSize: "0.8rem", color: naisargika === n.key ? n.color : INK_SECONDARY, fontWeight: 900 }}>{n.label}</td>
                  {TAMKALIKA_OPTS.map((t) => {
                    const cell = TIERS[TABLE[n.key][t.key]];
                    const active = naisargika === n.key && tamkalika === t.key;
                    return (
                      <td
                        key={t.key}
                        style={{
                          padding: "0.55rem 0.4rem",
                          textAlign: "center",
                          border: `1px solid ${active ? cell.color : HAIRLINE}`,
                          background: active ? `${cell.color}26` : `${cell.color}0D`,
                          color: cell.color,
                          fontWeight: active ? 900 : 700,
                          fontSize: "0.82rem",
                          boxShadow: active ? `inset 0 0 0 1px ${cell.color}` : "none",
                        }}
                      >
                        {cell.name}
                        <br />
                        <span style={{ fontSize: "0.72rem", color: INK_MUTED }}>{cell.score}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <Note>
            Two of the five — <strong>sama</strong> — sit on the cross-diagonal (fixed-friend + temp-enemy, and fixed-enemy + temp-friend): opposite layers cancel to neutral. The deeper strength use of these tiers (dignity, ṣaḍbala) comes in Module 13.
          </Note>
        </section>
      </div>
    </div>
  );
}

function naisItem(k: Naisargika) {
  return NAISARGIKA_OPTS.find((o) => o.key === k)!;
}
function tamItem(k: Tamkalika) {
  return TAMKALIKA_OPTS.find((o) => o.key === k)!;
}

function Note({ children }: { children: ReactNode }) {
  return <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.88rem" }}>{children}</p>;
}
