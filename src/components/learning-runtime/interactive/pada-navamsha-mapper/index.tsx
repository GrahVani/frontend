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

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const SIGN_ABBR = ["Meṣ", "Vṛṣ", "Mit", "Kar", "Siṁ", "Kan", "Tul", "Vṛś", "Dha", "Mak", "Kum", "Mīn"];

// Overall 0-based pāda index k = (N-1)*4 + (p-1), k = 0..107.
// Navāṁśa sign = SIGNS[k % 12]  (the 108 pādas cycle Aries→Pisces nine times).
// Rāśi the pāda falls in = SIGNS[floor(k/9) % 12]  (9 pādas per 30° sign).
// Vargottama when the navāṁśa sign equals the rāśi sign.
function padaInfo(num: number, pada: number) {
  const k = (num - 1) * 4 + (pada - 1);
  const navamsha = k % 12;
  const rashi = Math.floor(k / 9) % 12;
  return { k, navamsha, rashi, vargottama: navamsha === rashi };
}

export function PadaNavamshaMapper() {
  const [num, setNum] = useState(4); // default Rohiṇī (nice for the §7 "Rohiṇī pada 2" demo)
  const [pada, setPada] = useState(2);

  const n = NAKSHATRAS[num - 1];
  const sel = padaInfo(num, pada);

  return (
    <div data-interactive="pada-navamsha-mapper" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pāda → navāṁśa mapper</p>
        <h2 style={{ margin: "0.2rem 0 0.1rem", color: GOLD, fontSize: "1.3rem" }}>108 pādas = 108 navāṁśas</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>27 nakṣatras × 4 pādas = 108 = 12 signs × 9 navāṁśas. Each 3°20′ pāda IS one navāṁśa — the nine Aries→Pisces cycles.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.85rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.76rem", fontWeight: 900, textTransform: "uppercase", marginRight: "0.3rem" }}>Nakṣatra:</span>
          <select
            value={num}
            onChange={(e) => setNum(Number(e.target.value))}
            style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}
          >
            {NAKSHATRAS.map((nk) => (
              <option key={nk.num} value={nk.num}>{nk.num}. {nk.name}</option>
            ))}
          </select>
          <span style={{ color: INK_MUTED, fontSize: "0.76rem", fontWeight: 900, textTransform: "uppercase", margin: "0 0.3rem 0 0.6rem" }}>Pāda:</span>
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={pada === p}
              onClick={() => setPada(p)}
              style={{ border: `1px solid ${pada === p ? GOLD : HAIRLINE}`, borderRadius: 8, background: pada === p ? GOLD : "transparent", color: pada === p ? "#fff" : INK_SECONDARY, padding: "0.3rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
            >
              {p}
            </button>
          ))}
        </div>

        <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          <strong style={{ color: GOLD }}>{n.name} pāda {pada}</strong> → navāṁśa <strong style={{ color: GOLD }}>{SIGNS[sel.navamsha]}</strong> (falls in rāśi {SIGNS[sel.rashi]}).{" "}
          {sel.vargottama ? (
            <strong style={{ color: GREEN }}>Vargottama — same sign in rāśi (D1) and navāṁśa (D9); a position of special strength.</strong>
          ) : (
            <span style={{ color: INK_MUTED }}>Not vargottama (rāśi and navāṁśa differ).</span>
          )}
        </p>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflowX: "auto" }} aria-label="108-pāda navāṁśa table">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "30rem", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${GOLD}66` }}>
              <th style={{ textAlign: "left", padding: "0.3rem 0.4rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>Nakṣatra</th>
              {[1, 2, 3, 4].map((p) => (
                <th key={p} style={{ textAlign: "center", padding: "0.3rem 0.4rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>Pāda {p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NAKSHATRAS.map((nk) => (
              <tr key={nk.num} style={{ borderBottom: `1px dashed ${HAIRLINE}`, background: nk.num === num ? `${GOLD}14` : "transparent" }}>
                <td style={{ padding: "0.3rem 0.4rem", color: INK_SECONDARY, fontWeight: 700, whiteSpace: "nowrap" }}>{nk.num}. {nk.name}</td>
                {[1, 2, 3, 4].map((p) => {
                  const info = padaInfo(nk.num, p);
                  const isSel = nk.num === num && p === pada;
                  return (
                    <td
                      key={p}
                      onClick={() => { setNum(nk.num); setPada(p); }}
                      title={info.vargottama ? "Vargottama (rāśi = navāṁśa)" : `Rāśi ${SIGNS[info.rashi]}`}
                      style={{
                        padding: "0.3rem 0.4rem",
                        textAlign: "center",
                        cursor: "pointer",
                        fontWeight: info.vargottama ? 900 : 600,
                        color: info.vargottama ? GREEN : INK_PRIMARY,
                        background: isSel ? `${GOLD}33` : info.vargottama ? `${GREEN}1A` : "transparent",
                        border: isSel ? `1px solid ${GOLD}` : "1px solid transparent",
                        borderRadius: 4,
                      }}
                    >
                      {SIGN_ABBR[info.navamsha]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: "0.6rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
          Each cell is the pāda&apos;s navāṁśa sign. <strong style={{ color: GREEN }}>Green</strong> = vargottama (rāśi = navāṁśa). Every nakṣatra&apos;s pāda 1 lands on a fire sign (Meṣa / Siṁha / Dhanus) — the nine cycles each open on fire.
        </p>
      </section>
    </div>
  );
}
